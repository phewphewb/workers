const WORKER_PATH = "./worker.js";
const WORKER_CONFIG = {
  type: "module",
};

export default class Thread {
  constructor(path = WORKER_PATH, config = WORKER_CONFIG) {
    this.worker = new Worker(path, config);
    this.resolve = null;
    this.reject = null;
    this.onMessage = this.onMessage.bind(this);
    this.worker.onmessage = this.onMessage;
  }

  run(task) {
    this.worker.postMessage(task);
    return new Promise((ok, fail) => {
      this.resolve = ok;
      this.reject = fail;
    });
  }
  onMessage(result) {
    this.resolve(result);
  }
}
