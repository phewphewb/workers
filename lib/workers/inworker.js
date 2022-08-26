import EventEmitter from "../event-emitter/event.emitter.js";
import Semaphore from "../semaphore/semaphore.js";
import { EventTypeError } from "./errors.js";
import { Event, Result, Task } from "./events.js";
import { mixin, parse, typeOf } from "./utils.js";

const SIZE = 10;
const TIMEOUT = 5000;

export default class Workercom extends EventEmitter {
  constructor(worker) {
    super();
    this.modules = {};
    this.worker = worker;
    this.execute = this.execute.bind(this);
    this.post = this.post.bind(this);
    this.forward = this.forward.bind(this);
    this.listen = this.listen.bind(this);
    this.channel = this.channel.bind(this);
    this.module = this.module.bind(this);
    this.notifyChannels = this.notifyChannels.bind(this);
    this.ports = [];
    this.channels = {};
    this.semaphore = new Semaphore(SIZE, TIMEOUT);
  }

  static parse = parse;
  static mixin = mixin;

  find(id) {
    const type = typeOf(id);
    if (type === "number") return this.port(id);
    if (type === "string") return this.channel(id);
    throw new NoChannelFound(id);
  }

  port(index) {
    if (index === undefined || index > this.ports.length) return;
    if (index === -1) return this.ports;
    return this.ports[index];
  }

  channel(name) {
    if (!name) return;
    if (name === "*") return this.channels;
    let channel = this.channels[name];
    if (!channel) {
      channel = new BroadcastChannel(name);
      channel.onmessage = this.receive.bind(this, channel);
      channel.onerror = this.error;
    }
    this.channels[name] = channel;
    return channel;
  }

  async listen() {
    return new Promise((resolve) => {
      this.worker.onconnect = (e) => {
        const { ports } = e;
        for (const port of ports) {
          port.onmessage = this.receive.bind(this, port);
          port.onmessageerror = this.error;
          this.ports.push(port);
          port.start();
          this.post(
            port,
            new Event({
              name: "connected",
              port: 0, // TODO remove it does not matter here
              data: { initialized: true },
            })
          );
          console.log("New Connection");
        }
        resolve(true);
      };
    });
  }

  post(channels, message) {
    const msg = Workercom.mixin(message);
    const type = typeOf(channels);
    if (type === "array") {
      for (const channel of channels) {
        channel.postMessage(msg);
      }
    } else channels.postMessage(msg);
  }

  notifyChannels(notification, data) {
    const { channel, port, events } = notification;
    const portType = typeOf(port);
    const channelType = typeOf(channel);
    if (channelType !== "string" && portType !== "number") return;
    for (const name of events) {
      this.emit(name, data);
      this.forward({ name, data, channel, port });
    }
  }

  async execute(task, channel) {
    const {
      id,
      data,
      module: moduleName,
      method: methodName,
      notify = {},
    } = task;
    const module = this.modules[moduleName];
    const method = module[methodName];
    await this.semaphore.enter(id);
    const result = await new Result({ id, executable: method, data });
    this.semaphore.leave(id);
    this.notifyChannels(notify, result.data);
    if (channel) this.post(channel, result);
  }

  forward(event) {
    const checked = new Event(event);
    const channel = this.port(checked.port) || this.channel(checked.channel);
    this.post(channel, checked);
  }

  receive(channel, e) {
    const message = Workercom.parse(e.data); // TODO remove this
    if (message instanceof Event) return this.emit(message.name, message.data);
    if (message instanceof Task) return this.execute(message, channel);
    throw new EventTypeError(message.constructor.name, message);
  }

  error(error) {
    console.error(error);
  }

  module(modules) {
    const keys = Object.keys(modules);
    for (const key of keys) {
      this.modules[key] = modules[key];
    }
  }
}
