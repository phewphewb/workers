export class EventTypeError extends Error {
  constructor(type, recieved) {
    super(`Could not find handler for event type - ${type}`);
    console.log({ recieved });
  }
}

export class NoArgumentError extends Error {
  constructor(args) {
    const keys = Object.keys(args);
    const missing = keys.filter((key) => !args[key]);
    super(`Arguments required - ${missing.join(' ')}`);
  }
}

