const leftCol = document.getElementById("left-col");
const rightCol = document.getElementById("right-col");
const startButton = document.getElementById("start-button");
const concModeSwitch = document.getElementById("conc-mode-switch");

export default {
  cols: {
    left: leftCol,
    right: rightCol,
    clearColumns: () => {
      leftCol.innerHTML = "";
      rightCol.innerHTML = "";
    },
  },
  buttons: { start: startButton },
  switches: {
    concMode: concModeSwitch,
  },
};
