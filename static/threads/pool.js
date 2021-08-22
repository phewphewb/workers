import { threadFactory } from "./thread-factory.js";
const CPU_COUNT = 2;

export default class Pool {
  constructor(threadCount = CPU_COUNT, factory = threadFactory) {
    this.pool = new Array(threadCount).fill(null).map(factory);
    this.threadCount = threadCount;
  }
  async run(task) {
    const thread = this.pool.pop();
    const result = await thread.run(task);
    this.pool.push(thread);
    return result;
  }
}
