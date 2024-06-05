const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const contactRoutes = require("./routes/contactRoutes");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');


const app = express();

app.use(helmet());
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

accessLogStream.on('error', function (err) {
  console.error('Log file error:', err);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  keyGenerator: function (req) {
    return req.headers['x-forwarded-for'] || req.ip; // for nginx proxy server
  },
});

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ['https://aisense-website-beta.pages.dev', 'https://aisense.co.in'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) === -1) {
      let msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/contact", contactRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 6001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;