const workercode = () => {
  let glycemicIndex;
  let foods;

  //eslint-disable-next-line
  self.onmessage = ({ data: { query, setGlycemicIndex } }) => {
    if (setGlycemicIndex) {
      glycemicIndex = setGlycemicIndex;
      foods = Object.keys(glycemicIndex).sort();
      return;
    }
    if (query && glycemicIndex && foods) {
      query = query.trim().toLowerCase();

      const results = foods
        .filter(food => food.toLowerCase().includes(query))
        .map(food => ({ title: food, gi: glycemicIndex[food].gi }));

      const maxResults = 25;
      if (results.length > maxResults) {
        //eslint-disable-next-line
        self.postMessage({
          results: results.slice(0, maxResults).concat({
            title: "Too many results.",
            more: results.length - maxResults
          })
        });
      } else {
        //eslint-disable-next-line
        self.postMessage({ results });
      }
      return;
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const workerScript = URL.createObjectURL(blob);

module.exports = workerScript;
