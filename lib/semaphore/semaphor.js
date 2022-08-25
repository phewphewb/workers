export default class Semaphore {
  constructor(size = 0, timeout = 0) {
    this.timeout = timeout;
    this.size = size;
    this.queues = new Map();
  }

  queue(id) {
    const { queues } = this;
    const queue = queues.get(id);
    if (!queue) queues.set(id, []);
    return queues.get(id);
  }

  async enter(id) {
    const { timeout, size } = this;
    const queue = this.queue(id);
    return new Promise((resolve, reject) => {
      if (queue.length >= size) {
        reject(new Error("Semaphore queue is full"));
        return;
      }

      const timer = setTimeout(() => {
        queue.shift();
        reject(new Error("Semaphore timeout"));
      }, timeout);

      const waiting = { resolve, timer };
      const length = queue.push(waiting);
      if (length === 1) {
        waiting.resolve = null;
        resolve();
      }
    });
  }

  leave(id) {
    const queue = this.queues.get(id);
    const { resolve, timer } = queue.shift();
    clearTimeout(timer);
    if (resolve) setTimeout(resolve, 0);
  }
}
