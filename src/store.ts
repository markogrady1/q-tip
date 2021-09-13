import Redis from 'ioredis';
import { EventEmitter } from 'events';
import { Config } from "./types";

interface EventListeners {
  [key: string]: Function;
}

export class Store extends EventEmitter {
  config: any;
  store: any;
  eventListeners: EventListeners;
  isConnected: boolean;

  constructor(config: Config) {
    super();
    config.type = config.type ?? 'ioredis';
    config.host = config.host ?? '127.0.0.1';
    config.port = config.port ?? 6379;
    config.database = config.database ?? 0;
    config.namespace = config.namespace ?? 'queue-tip';
    config.scanCount = config.scanCount ?? 10;

    this.config = config;

    this.eventListeners = {};
    this.isConnected = false;

    if (config && config.type) {
      this.store = this._setType(config.type);
    } else {
      throw new Error('type is required');

    }
  }

  add(key: string, value: any) {
    this.store.set(key, value);
  }

  // setupQueues(queues: Array<string>) {

  //   queues.forEach(key => {
  //     return this.store.set(key, JSON.stringify('queue'));
  //   });

  // }

  _setType(type: string) {
    if (type === 'redis') {
      return new Redis(this.config);
    }
  }

  async connect() {
    if (this.config.redis) {
      this.store = this.config.redis;
    } else {
      const StorageType = require(this.config.type);
      if (
        typeof StorageType.createClient === 'function' &&
        this.config.type !== 'ioredis'
      ) {
        this.store = StorageType.createClient(this.config.port, this.config.host, this.config.options);
      } else {
        this.config.options.database = this.config.database;
        this.store = new StorageType(this.config.port, this.config.host);
      }
    }


    this.eventListeners.error = (error: Error) => {
      this.emit('error', error);
    };
    this.eventListeners.end = () => {
      this.isConnected = false;
    };
    this.store.on('error', (err) => this.eventListeners.error(err));
    this.store.on('end', () => this.eventListeners.end());

    if (!this.config.redis && typeof this.store.select === "function") {
      await this.store.select(this.config.database);
    }

  }


  key(arg: any, arg2?: any, arg3?: any, arg4?: any): string {
    let args;
    args = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
    if (Array.isArray(this.config.namespace)) {
      args.unshift(...this.config.namespace);
    } else {
      args.unshift(this.config.namespace);
    }
    args = args.filter((e: any) => {
      return String(e).trim();
    });
    return args.join(":");
  }
}