let self;
const workercode = () => {
  let glycemicIndex;
  let foods;

  self.onmessage = ({ data: { query, setGlycemicIndex } }) => {
    if (setGlycemicIndex) {
      glycemicIndex = setGlycemicIndex;
      foods = Object.keys(glycemicIndex);
      return;
    }
    if (query && glycemicIndex && foods) {
      query = query.trim().toLowerCase();

      self.postMessage({
        results: foods
          .filter(food => food.toLowerCase().includes(query))
          .map(food => ({ title: food, gi: glycemicIndex[food].gi }))
      });
      return;
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

module.exports = workerScript;
