const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb://localhost:27017/chat-app",{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('DB connection successful');
  })
  .catch(() => {
    console.log('DB connection failed');
  })

app.get('/', (req, res) => {
    res.send('<h1>Hey socket</h1>');
});
const corsOptions = {
  origin: 'http://localhost:4200',
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/user",userRoutes);

module.exports = app;