import Workercom from "../../lib/workers/inworker.js";

const messages = {
  current: "",
  list: [],
};

const messanger = {
  get: () => messages.list,
  add: (message) => {
    messages.list.push(message);
    return messanger.get();
  },
  input: (message) => (messages.current = message),
  current: () => messages.current,
};

const com = new Workercom(self);
com.listen();
self.com = com;

com.module({ messanger });
com.listen().then(() => console.log("Listening"));
