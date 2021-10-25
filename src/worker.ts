import { EventEmitter } from 'events';

export class Worker extends EventEmitter {
  working: boolean;
  running: boolean;
  queue: string;
  constructor(queue: string) {
    super();
    this.working = false;
    this.queue = queue;
    this.running = false;
  }

  async pickup() {
    //const job = this.store.firstJob();

  }

}