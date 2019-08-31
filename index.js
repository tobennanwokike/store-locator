const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const appconfig = require('./config/app.config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
    next();
});

app.get('/', (req, res, next) => {
    res.json({"message" : "Welcome to StoreLocator Node Server "});
});

require('./routes/locator.routes')(app);

app.listen(appconfig.port, err => {
    if (err) {
        console.log('unable to start express server on port ' + appconfig.port + '. Reason: ', err);
    } else {
        console.log('Express server is listening on port: ' + appconfig.port);
    }
});