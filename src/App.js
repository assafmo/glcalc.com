import React, { Component } from "react";
import {
  Dropdown,
  Icon,
  Input,
  Label,
  Divider,
  Search
} from "semantic-ui-react";
import PropTypes from "prop-types";
import workerScript from "./SearchWorker.js";
import glycemicIndex from "./gi.json";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

// const foods = Object.keys(glycemicIndex).sort();
const worker = new Worker(workerScript);
worker.postMessage({ setGlycemicIndex: glycemicIndex });

function getColorOrTextForGI(gi, isText) {
  // Low: 55 or less
  // Medium: 56 - 69
  // High: 70 or more

  if (gi <= 55) {
    return isText ? "Low" : "green";
  }
  if (gi > 55 && gi < 70) {
    return isText ? "Medium" : "orange";
  }
  if (gi >= 70) {
    return isText ? "High" : "red";
  }
}

function getColorOrTextForGL(gl, isText) {
  // Low: 10 or less
  // Medium: 11-19
  // High: 20 or more

  if (gl <= 10) {
    return isText ? "Low" : "green";
  }
  if (gl > 10 && gl < 20) {
    return isText ? "Medium" : "orange";
  }
  if (gl >= 20) {
    return isText ? "High" : "red";
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: "",
      serving: 100,
      unit: "g",
      isLoading: false,
      results: []
    };

    worker.onmessage = this.handleSearchDone;
  }

  handleServingSizeChange = (e, { value }) => this.setState({ serving: value });

  unitChange = (e, { value }) => this.setState({ unit: value });

  handleResultSelect = (e, { result }) => {
    if (result.more) {
      document.getElementById("searchBar").focus();
      return;
    }

    this.setState({ food: result.title });

    worker.postMessage({ query: result.title });
  };

  handleSearchInputChange = (e, { value }) => {
    if (!value) {
      this.setState({ isLoading: false, food: "" });
      return;
    }
    this.setState({ isLoading: true, food: value });

    worker.postMessage({ query: value });
  };

  handleSearchDone = ({ data: { results } }) => {
    this.setState({
      isLoading: false,
      results: results
    });
  };

  componentDidMount = () => {
    document.getElementById("searchBar").focus();
  };

  render() {
    let giValue, carbsRatio;
    if (glycemicIndex[this.state.food]) {
      giValue = +glycemicIndex[this.state.food].gi;
      carbsRatio = +glycemicIndex[this.state.food].carbs_per_100g / 100;
    }

    return (
      <div style={{ margin: 20 }}>
        <h1>Glycemic load calculator</h1>
        <Divider />
        {this.getSearchInput()}
        {this.getServingSizeInput()}
        <Divider />
        {this.getCarbsResults(giValue, carbsRatio)}
        {this.getGIResult(giValue)}
        {this.getGLResult(carbsRatio, giValue)}
        {this.getFooter()}
      </div>
    );
  }

  getSearchInput = () => {
    const resultRenderer = result => {
      if (result.more) {
        return (
          <b style={{ color: "red" }}>
            {result.more} more results. Please refine your search.
          </b>
        );
      }
      return (
        <div>
          <b>{result.title}</b>{" "}
          <Label size="small" color={getColorOrTextForGI(result.gi)}>
            GI: {result.gi}
          </Label>
        </div>
      );
    };
    resultRenderer.propTypes = {
      food: PropTypes.string,
      gi: PropTypes.number
    };
    const searchInput = (
      <Search
        id="searchBar"
        placeholder="Food"
        loading={this.state.isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchInputChange}
        results={this.state.results}
        value={this.state.food}
        fluid
        resultRenderer={resultRenderer}
      />
    );
    return searchInput;
  };

  getServingSizeInput = () => {
    return (
      <div style={{ marginTop: 5 }}>
        <Input
          style={{ width: 125 }}
          type="number"
          min="0"
          value={this.state.serving}
          label={
            <Dropdown
              style={{
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px"
              }}
              defaultValue="g"
              options={[
                { key: "g", text: "g", value: "g" },
                { key: "oz", text: "oz", value: "oz" }
              ]}
              onChange={this.unitChange}
            />
          }
          labelPosition="right"
          placeholder="Serving Size"
          onChange={this.handleServingSizeChange}
        />
      </div>
    );
  };

  getCarbsResults = (gi, carbsRatio) => {
    if (!(this.state.food && Number.isInteger(gi))) {
      return null;
    }

    return (
      <div>
        <Label size="large" horizontal>
          Carbohydrates{" "}
          <a
            href="https://www.gisymbol.com/carbohydrates/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="help circle" />
          </a>
        </Label>
        {Math.round(this.state.serving * carbsRatio * 10) / 10} ({
          this.state.unit
        })
      </div>
    );
  };

  getGLResult = (carbsRatio, gi) => {
    if (!(this.state.food && carbsRatio && Number.isInteger(gi))) {
      return null;
    }

    const servingFactor = { g: 1, oz: 28.3495231 }[this.state.unit];
    let gl = (gi * this.state.serving * carbsRatio * servingFactor) / 100;
    gl = Math.round(gl * 100) / 100; //round 2 decimals

    return (
      <div style={{ marginTop: 5 }}>
        <Label size="large" horizontal>
          Glycemic load{" "}
          <a
            href="https://www.gisymbol.com/what-about-glycemic-load/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="help circle" />
          </a>
        </Label>
        {gl}{" "}
        <Label color={getColorOrTextForGL(gl)} pointing="left">
          {getColorOrTextForGL(gl, true)}
        </Label>
      </div>
    );
  };

  getGIResult = gi => {
    if (!this.state.food || !Number.isInteger(gi)) {
      return null;
    }

    return (
      <div style={{ marginTop: 5 }}>
        <Label size="large" horizontal>
          Glycemic index{" "}
          <a
            href="https://www.gisymbol.com/about-glycemic-index/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="help circle" />
          </a>
        </Label>
        {gi}{" "}
        <Label color={getColorOrTextForGI(gi)} pointing="left">
          {getColorOrTextForGI(gi, true)}
        </Label>
      </div>
    );
  };

  getFooter = () => {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          backgroundColor: "#e7e7e7",
          color: "black",
          textAlign: "center"
        }}
      >
        Made with <span style={{ fontSize: "large", color: "red" }}>♥</span> by
        Assaf Morami{" "}
        <a href="https://github.com/assafmo" style={{ color: "black" }}>
          <Icon name="github" />
        </a>
      </div>
    );
  };
}

export default App;
