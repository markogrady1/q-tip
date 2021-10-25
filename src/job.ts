
/**
 * this is for testing purposes, right now
 */

const Redis = require("ioredis");

module.exports = class Test {

  constructor() { }
  doTest() {
    const redis = new Redis(); // uses defaults unless given configuration object
    //redis.status = 'connected'
    console.log('in doTest', redis)
    return true
  }
}