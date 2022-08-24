import { NoArgumentError } from "./errors.js";

export class Task {
  constructor({ id, data, module, method, notify }) {
    const noargs = !module || !method;
    if (noargs) throw new NoArgumentError({ id, module, method });
    this.id = id || `/${module}/${method}`;
    this.method = method;
    this.module = module;
    this.data = data;
    this.notify = notify;
  }
}

export class Event {
  constructor({ name, data, port, channel }) {
    const noargs =
      !name || data === undefined || (port === undefined && !channel);
    if (noargs) throw new NoArgumentError({ name, data, port, channel });
    this.name = name;
    this.data = data;
    this.port = port;
    this.channel = channel;
  }
}

export class Result {
  constructor({ id, executable, data }) {
    const noargs = !id;
    if (noargs) throw new NoArgumentError({ id, data });
    return new Promise(async (resolve) => {
      this.id = id;
      this.data = `No method found - ${id}`;
      this.type = "reject";
      if (executable) {
        this.data = await executable(data);
        this.type = "resolve";
      }
      resolve(this);
    });
  }

  static types = ["resolve", "reject"];
}
