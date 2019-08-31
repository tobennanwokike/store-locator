module.exports = (app) => {
    //Create application route
    const locatorController = require('../controllers/locator.controller');

    app.get('/closest?:query', locatorController.closest);
}