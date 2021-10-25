import { EventEmitter } from 'events';
import { Store } from './store';
import { Config } from "./types";

export class Queue extends EventEmitter {
  config: Config;
  connection: Store;
  constructor(config: Config) {
    super();

    this.config = config;
    this.connection = new Store(config);
  }

  connect() {
    this.connection.connect();
  }

  encode(q: string, func: string, args: Array<any> = []) {
    return JSON.stringify({
      class: func,
      queue: q,
      args: args,
    });
  }

  async add(queue: string, funcName: string, args: Array<any> = []) {
    try {
      await this.connection.store.sadd(this.connection.key('queues'), queue);
      await this.connection.store.rpush(
        this.connection.key('queue', queue),
        JSON.stringify({ queue: queue, class: funcName, args: args })
      );
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
}