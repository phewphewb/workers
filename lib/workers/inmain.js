import EventEmmiter from "../event-emitter/event.emitter.js";
import { EventTypeError } from "./errors.js";
import { Event, Result, Task } from "./events.js";
import { parse, mixin } from "./utils.js";

export default class Threadcom extends EventEmmiter {
  constructor(Worker) {
    super();
    this.worker = new Worker();
    this.channels = {};
    this.tasks = new Map();
    this.receive = this.receive.bind(this);
    this.forward = this.forward.bind(this);
    this.post = this.post.bind(this);
    this.done = this.done.bind(this);
    this.listen = this.listen.bind(this);
    this.error = this.error.bind(this);
    this.channel = this.channel.bind(this);
  }

  static parse = parse;
  static mixin = mixin;

  sub(name, listener) {
    const unsub = super.on(name, listener);
    const [, module, method = "get"] = name.split("/");
    this.run(
      new Task({
        id: name,
        port: 0,
        module,
        method,
        data: { name },
        notify: {
          port: -1,
          events: [name],
        },
      })
    );
    return unsub;
  }

  channel(name) {
    if (!name) return;
    if (name === "*") return this.channels;
    let channel = this.channels[name];
    if (!channel) {
      channel = new BroadcastChannel(name);
      channel.onmessage = this.receive;
      channel.onerror = this.error;
    }
    this.channels[name] = channel;
    return channel;
  }

  done(result) {
    const { type, data, id } = result;
    this.tasks.get(id)[type](data);
    this.tasks.delete(id);
  }

  error(error) {
    console.error(error);
  }

  post(channel, message) {
    const msg = Threadcom.mixin(message);
    channel.postMessage(msg);
  }

  receive(e) {
    const message = Threadcom.parse(e.data); // TODO remove this
    if (message instanceof Event) return this.emit(message.name, message.data);
    if (message instanceof Result) return this.done(message);
    throw new EventTypeError(message.constructor.name, message);
  }

  run(task) {
    const checked = new Task(task);
    this.post(this.worker.port, checked);
    return new Promise((resolve, reject) => {
      this.tasks.set(checked.id, { resolve, reject });
    });
  }

  forward(event) {
    const checked = new Event(event);
    const channel = this.channel(checked.channel) || this.worker.port;
    this.post(channel, checked);
    return this;
  }

  listen() {
    this.worker.port.onmessage = this.receive;
    this.worker.port.onmessageerror = this.error;
    this.worker.onerror = this.error;
    this.worker.port.start();
    return this;
  }
}
