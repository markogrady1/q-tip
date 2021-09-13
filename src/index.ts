const { Queue } = require('../dist/queue');

const q = new Queue({ type: 'redis' });

q.add('beepbop', 'testFuncName', { beep: 'bop' })
