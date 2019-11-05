const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const logger = require('morgan');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger('dev'));
server.use(methodLogger);
server.use(addName);
server.use(divisibleByThree);
// server.use(lockout);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  // next();
  // because of the next call, it will skip what is below and go to the next thing in the chain.
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || 'Sean';
  //if req.name exists assign it its name. If not assign it to Sean
  next();
}

function lockout(req, res) {
  //do some validation...
  res.status(403).json({ message: 'api lockout!' })
}

//create middleware that will reject any api call if the current second is evenly divisible by three
function divisibleByThree(req, res, next) {
  let date = new Date();
  let seconds = date.getSeconds();

  seconds % 3 === 0
  ? res.status(418).json({ message: 'REJECTED' })
  : next();
}


module.exports = server;
