// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// defining the Express app
const app = express();


// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return public API
app.get('/public', (req, res) => {
    res.json({
        message: "public API"
    })
});

// starting the server
app.listen(3001, () => {
    console.log('listening on port: ' + process.env.REACT_APP_API_URL);
});