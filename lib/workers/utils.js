import { EventTypeError } from "./errors.js";
import { Task, Event, Result } from "./events.js";

export const typeOf = (value) =>
  Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;

// TODO remove this
const task = new Task({
  id: "utility",
  data: {},
  method: "test",
  module: "test",
});
const event = new Event({
  name: "utility",
  data: {},
  type: "outcoming",
  port: 1,
});
const utils = {
  Task: task,
  Event: event,
  Result: {},
};
new Result({ id: "utility", executable: () => {}, data: {} }).then(
  (value) => (utils.Result = value)
);

const types = {
  Task,
  Event,
  Result,
};

export const parse = (message) => {
  const msg = { ...message };
  const type = message.___protoname__; // added by Thread or Webworker class
  const instance = utils[type];
  if (!instance) throw new EventTypeError(type, message);
  const instanceKeys = Object.getOwnPropertyNames(instance);
  const msgKeys = Object.getOwnPropertyNames(msg);
  const isWorngType = instanceKeys.find((key) => !msgKeys.includes(key));
  if (isWorngType) throw new EventTypeError(type, message);
  const Proto = types[type];
  Object.setPrototypeOf(msg, Proto.prototype);
  return msg;
};

export const mixin = (message) => {
  const prot = Object.getPrototypeOf(message);
  const name = prot.constructor.name;
  return { ...message, ___protoname__: name };
};
