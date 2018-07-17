import React, { Component } from "react";
import { Dropdown, Input, Label, Divider } from "semantic-ui-react";
import glycemicIndex from "./gi.json";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

const low = (
  <Label color="green" pointing="left">
    Low (good)
  </Label>
);
const medium = (
  <Label color="orange" pointing="left">
    Medium
  </Label>
);
const high = (
  <Label color="red" pointing="left">
    High (Bad)
  </Label>
);

const servingFactor = {
  g: 1,
  oz: 28.3495231
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { food: "", serving: 50, unit: "g" };
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
      <div style={{ marginTop: 50 }}>
        <Input
          list="foods"
          onChange={this.foodChange.bind(this)}
          placeholder="Food"
          style={{ width: "80%" }}
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
          style={{ width: 90 }}
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

    const gi = +glycemicIndex[this.state.food];

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
        <div>
          Glycemic index: {gi} {giSummary}
        </div>
      );
    }

    let glResult;
    if (this.state.food && Number.isInteger(gi)) {
      // Low: 10 or less
      // Medium: 11-19
      // High: 20 or more

      let gl = (gi * this.state.serving * servingFactor[this.state.unit]) / 100;
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
          Glycemic laod: {gl} {glSummary}
        </div>
      );
    }

    return (
      <div className="App">
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
