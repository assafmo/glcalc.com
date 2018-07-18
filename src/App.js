import React, { Component } from "react";
import { Dropdown, Icon, Input, Label, Divider } from "semantic-ui-react";
import glycemicIndex from "./gi.json";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

const foods = Object.keys(glycemicIndex).sort();

const low = (
  <Label color="green" pointing="left">
    Low
  </Label>
);
const medium = (
  <Label color="orange" pointing="left">
    Medium
  </Label>
);
const high = (
  <Label color="red" pointing="left">
    High
  </Label>
);

const servingFactor = {
  g: 1,
  oz: 28.3495231
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food: "",
      serving: 100,
      unit: "g"
    };
  }

  foodChange(e, data) {
    this.setState({ food: data.value });
  }

  servingChange(e, data) {
    this.setState({ serving: data.value });
  }

  unitChange(e, data) {
    this.setState({ unit: data.value });
  }

  render() {
    const searchBox = (
      <div>
        <Input
          value={this.state.food}
          list="foods"
          onChange={this.foodChange.bind(this)}
          placeholder="Food"
          style={{ width: "95%" }}
        />
        <datalist id="foods">
          {foods.map((food, idx) => <option key={idx} value={food} />)}
        </datalist>
      </div>
    );

    const weightUnit = (
      <div style={{ marginTop: 5 }}>
        <Input
          style={{ width: 130 }}
          type="number"
          min="0"
          value={this.state.serving}
          label={
            <Dropdown
              defaultValue="g"
              options={[
                { key: "g", text: "g", value: "g" },
                { key: "oz", text: "oz", value: "oz" }
              ]}
              onChange={this.unitChange.bind(this)}
            />
          }
          labelPosition="right"
          placeholder="Serving Size"
          onChange={this.servingChange.bind(this)}
        />
      </div>
    );

    let gi, carbsRatio;
    if (glycemicIndex[this.state.food]) {
      gi = +glycemicIndex[this.state.food].gi;
      carbsRatio = +glycemicIndex[this.state.food].carbs_per_100g / 100;
    }

    let carbsResult;
    if (this.state.food && Number.isInteger(gi)) {
      carbsResult = (
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
    }

    let giResult;
    if (this.state.food && Number.isInteger(gi)) {
      // Low: 55 or less
      // Medium: 56 - 69
      // High: 70 or more

      let giSummary = low;
      if (gi > 55 && gi < 70) {
        giSummary = medium;
      }
      if (gi >= 70) {
        giSummary = high;
      }

      giResult = (
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
          {gi} {giSummary}
        </div>
      );
    }

    let glResult;
    if (this.state.food && carbsRatio && Number.isInteger(gi)) {
      // Low: 10 or less
      // Medium: 11-19
      // High: 20 or more

      let gl =
        (gi *
          this.state.serving *
          carbsRatio *
          servingFactor[this.state.unit]) /
        100;
      gl = Math.round(gl * 100) / 100; //round 2 decimals

      let glSummary = low;
      if (gl > 10 && gl < 20) {
        glSummary = medium;
      }
      if (gl >= 20) {
        glSummary = high;
      }

      glResult = (
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
          {gl} {glSummary}
        </div>
      );
    }

    return (
      <div style={{ marginTop: 10, marginLeft: 20 }}>
        <h1>Glycemic load calculator</h1>
        <Divider />
        {searchBox}
        {weightUnit}
        <Divider />
        {carbsResult}
        {giResult}
        {glResult}
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
          Made with <span style={{ fontSize: "large", color: "red" }}>♥</span>{" "}
          by Assaf Morami{" "}
          <a href="https://github.com/assafmo" style={{ color: "black" }}>
            <Icon name="github" />
          </a>
        </div>
      </div>
    );
  }
}

export default App;
