import React, { Component } from "react";
import { Dropdown, Input, Label, Divider } from "semantic-ui-react";
import glycemicIndex from "./gi.json";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

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
      serving: 50,
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
          {Object.keys(glycemicIndex).map((food, idx) => (
            <option key={idx} value={food} />
          ))}
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

      giSummary = (
        <a
          href="https://www.gisymbol.com/about-glycemic-index/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {giSummary}
        </a>
      );

      giResult = (
        <div>
          <Label size="large" horizontal>
            Glycemic index
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

      glSummary = (
        <a
          href="https://www.gisymbol.com/what-about-glycemic-load/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {glSummary}
        </a>
      );

      glResult = (
        <div style={{ marginTop: 5 }}>
          <Label size="large" horizontal>
            Glycemic laod
          </Label>
          {gl} {glSummary}
        </div>
      );
    }

    return (
      <div style={{ marginLeft: 20 }}>
        <h1>Glycemic load calculator</h1>
        <Divider />
        {searchBox}
        {weightUnit}
        <Divider />
        {giResult}
        {glResult}
      </div>
    );
  }
}

export default App;
