const { Queue } = require('./queue');
// const Test = require('./job');





// const t = new Test();
// t.doTest();


const q = new Queue({ type: 'redis' });

q.add('beepbop', 'testFuncName', { beep: 'bop' }).then(result => {
  console.log(result)
})

