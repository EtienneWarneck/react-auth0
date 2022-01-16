// importing the dependencies
const express = require('express');
require("dotenv").config();
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
const jwt = require("express-jwt")//validate JWT and set req.user
const jwksRsa = require("jwks-rsa")//retrieve RSA keys from a JSON web key set(JWKS) endpoint


const checkJwt = jwt({
    // Dynamically provide a signing key based on the header
    // and the signing keys provided by the JWS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true, //cache signing key
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

// defining the Express app
const app = express();


// // adding Helmet to enhance your API's security
// app.use(helmet());

// // using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json());

// // enabling CORS for all requests
// app.use(cors());

// // adding morgan to log HTTP requests
// app.use(morgan('combined'));

// defining an endpoint to return public API
app.get('/public', (req, res) => {
    res.json({
        message: "public API"
    })
});

app.get('/private', checkJwt, (req, res) => {
    res.json({
        message: "private API"
    })
});

// starting the server
app.listen(3001, () => {
    console.log('listening on port: ' + process.env.REACT_APP_API_URL);
});