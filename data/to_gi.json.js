#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let giFull = fs.readFileSync(path.join(__dirname, "gi_full.json"), {
  encoding: "utf8"
});

giFull = JSON.parse(giFull);

const idToFood = {};
for (const food of giFull) {
  if (!food || !food["Diogenes food code"]) {
    continue;
  }

  idToFood[food["Diogenes food code"]] = food;
}

const gi = {};
for (let id in idToFood) {
  const giValue = +idToFood[id]["GI value"];
  const carbsPer100g = +idToFood[id]["CHO (g/100g)"];
  if (Number.isNaN(giValue) || Number.isNaN(carbsPer100g)) {
    continue;
  }

  let name = idToFood[id]["English translation"];
  if (!name) {
    continue;
  }
  name = name[0].toUpperCase() + name.slice(1);

  gi[name] = {
    gi: giValue,
    carbs_per_100g: carbsPer100g
  };
}

fs.writeFileSync(path.join(__dirname, "gi.json"), JSON.stringify(gi), {
  encoding: "utf8"
});
