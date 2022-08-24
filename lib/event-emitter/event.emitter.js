export default class EventEmitter {
  constructor() {
    this.listeners = new Map();
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.get = this.get.bind(this);
    this.notify = this.notify.bind(this);
  }

  get(name) {
    let listeners = this.listeners.get(name);
    if (listeners) return listeners;
    listeners = new Set();
    this.listeners.set(name, listeners);
    return listeners;
  }

  on(name, listener) {
    const listeners = this.get(name);
    listeners.add(listener);
    return this.unsubscribe.bind(this, listeners, listener);
  }

  once(name, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.remove(name, wrapper);
    };
    return this.on(name, wrapper);
  }

  emit(name, ...args) {
    const listeners = this.listeners.get(name);
    this.notify(listeners, ...args);
    if (name !== "*") {
      const all = this.listeners.get("*");
      this.notify(all, ...args);
    }
  }

  notify(listeners, ...args) {
    if (!listeners) return;
    for (const listener of listeners.values()) {
      listener(...args);
    }
  }

  remove(name, listener) {
    const listeners = this.listeners.get(name);
    if (!listeners) return;
    if (listeners.has(listener)) {
      listeners.delete(listener);
      return;
    }
  }

  clear(name) {
    if (name) this.listeners.delete(name);
    else this.listeners.clear();
  }

  count(name) {
    const listeners = this.listeners.get(name);
    return listeners ? listeners.size : 0;
  }

  names() {
    return [...this.listeners.keys()];
  }

  unsubscribe(listeners, listener) {
    return listeners.delete(listener);
  }
}