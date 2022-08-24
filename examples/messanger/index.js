import Threadcom from "../../lib/workers/inmain.js";
import ApiWorker from "./api.sworker.js";
import messanger from "./messages.js";
import ui from "./ui.js";

window.com = new Threadcom(ApiWorker);
com.listen();

com.sub("/messanger/current", (message) => {
  ui.input.message.value = message;
});
com.sub("/messanger", (messages) => {
  ui.display.message.innerHTML = messages.join(" * ");
});

ui.input.message.onchange = async (e) => {
  const value = e.target.value;
  await messanger.input(value);
};

ui.button.send.onclick = async () => {
  const value = ui.input.message.value;
  await messanger.add(value);
};
