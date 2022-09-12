require('dotenv').config()
const express = require('express');
const app = express();
const fs = require('fs');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const company_api = require('./api/company');
const customer_api = require('./api/customer');
const employee_api = require('./api/employee');
const manager_api = require('./api/manager');
const listing_api = require('./api/listing');
const rental_api = require('./api/rental');
const price_api = require('./api/price');
const mongoose = require('mongoose');
const path = require('path');
const Customer = require('./models/customer')
const SimpleHWman = require('./models/simpleHWman');
const price = require('./util/priceCalc')
const upload = require("./api/upload");
const Grid = require("gridfs-stream");
const connection = require("./db");

//mongo connection
connection();

//uploading images to mongo, reading them and deleting them
const conn = mongoose.connection;
let gfs, gridfsBucket;
conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'imgs'
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('imgs');
})

app.get("/api/imgs/:filename", async (req, res) => {
  const file = await gfs.files.findOne({ filename: req.params.filename });
  if (!file) return res.json({ command: 'logErr', msg: 'File loaded but not found' })
  const readStream = gridfsBucket.openDownloadStream(file._id);
  readStream.pipe(res);
});

app.delete("/api/imgs/:filename", async (req, res) => {
  try {
    await gfs.files.deleteOne({ filename: req.params.filename });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});

app.delete("/api/imgsArray", async (req, res) => {
  console.log('serverjs 52')
  try {
    await gfs.files.deleteMany({ filename: JSON.parse(req.query.array) });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("An error occured.");
  }
});

app.use('/api/imgs', upload);


//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));

async function getUserByUsername(username) {
  var dbAnswer = { err: null, customer: null, simpleHWman: null }; //creo una variabile che posso riempire man mano che avanzo nelle chiamate a mongo ecc

  try {
    dbAnswer.customer = await Customer.findOne({ 'username': username });
  } catch (err) {
    dbAnswer.err = err;
  }
  //processing the db answer
  if (dbAnswer.err) return { msg: 'failed to retrieve customer' };
  if (dbAnswer.customer) {
    return dbAnswer.customer;
  };

  try {
    dbAnswer.simpleHWman = await SimpleHWman.findOne({ 'username': username });
  } catch (err) {
    dbAnswer.err = err;
  }
  //processing the db answer
  if (dbAnswer.err) return { msg: 'failed to retrieve simpleHWman' };
  if (dbAnswer.simpleHWman) return dbAnswer.simpleHWman;

  //shouldn't be able to get here
  return null;
}

async function getUserById(id) {
  var dbAnswer = { err: null, customer: null, simpleHWman: null }; //creo una variabile che posso riempire man mano che avanzo nelle chiamate a mongo ecc

  try {
    dbAnswer.customer = await Customer.findOne({ '_id': id });
  } catch (err) {
    dbAnswer.err = err;
  }
  //processing the db answer
  if (dbAnswer.err) return { msg: 'failed to retrieve customer' };
  if (dbAnswer.customer) {
    return dbAnswer.customer;
  };

  try {
    dbAnswer.simpleHWman = await SimpleHWman.findOne({ '_id': id });
  } catch (err) {
    dbAnswer.err = err;
  }
  //processing the db answer
  if (dbAnswer.err) return { msg: 'failed to retrieve simpleHWman' };
  if (dbAnswer.simpleHWman) return dbAnswer.simpleHWman;

  //shouldn't be able to get here
  return null;
}

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  getUserByUsername,
  getUserById
)

app.use(flash())
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//connect to mongodb
// const connectDB = async () => {

//   price.calc({
//     base: 10,
//     fidelity: 20,
//     modifiers: [
//       {
//         reason: 'perche si',
//         sign: '+',
//         quantity: 1,
//         apply: 'daily'
//       },
//       {
//         reason: 'perche si',
//         sign: '-',
//         quantity: 10,
//         apply: 'onHoly'
//       },
//       {
//         reason: 'perche si',
//         sign: '-',
//         quantity: 5,
//         apply: 'onWeekend'
//       }
//     ]
//   }, new Date('2021-12-24'), new Date('2022-1-2'));

//   //const dbURI = "mongodb://site202106:ahsuiR6x@mongo_site202106?writeConcern=majority"; //mongoscuola
//   const dbURI = 'mongodb+srv://projectCo:ProgettoTW2021@clusterprova.e4amo.mongodb.net/Customer?retryWrites=true&w=majority';
//   try {
//     await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

//     console.log('MongoDB connected!!');
//   } catch (err) {
//     console.log('Failed to connect to MongoDB', err);
//   }
// };

// connectDB();

//info sulle connessioni
app.use((req, res, next) => {
  if (req.method === 'GET') {
    console.log('request: GET ', req.path);
  } else {
    console.log('new request made:');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    console.log('req.user:', req.user);
    console.log('\n');
  }

  next();
});

app.get('/errHandler.js', (req, res) => {
  fs.readFile(__dirname + '/clientUtil/errHandler.js', 'utf8', (err, text) => {
    res.send(text);
  });
})

app.get('/favicon.ico', (req, res) => {
  fs.readFile(__dirname + '/clientUtil/favicon.ico', 'utf8', (err, text) => {
    res.send(text);
  });
})

app.get('/cout.js', (req, res) => {
  fs.readFile(__dirname + '/clientUtil/cout.js', 'utf8', (err, text) => {
    res.send(text);
  });
})


app.use('/', express.static(path.join(__dirname, 'customer')));
app.use('/manager', express.static(path.join(__dirname, 'manager')));
app.use('/employee', express.static(path.join(__dirname, 'employee')));
app.use('/clientUtil', express.static(path.join(__dirname, 'clientUtil')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/price', price_api);
app.use('/api/customer', customer_api);
app.use('/api/company', company_api);
app.use('/api/manager', manager_api);
app.use('/api/employee', employee_api);
app.use('/api/listing', listing_api);
app.use('/api/rental', rental_api);

app.listen(8000);