// Require needed packages
const Express = require('express');
const BodyParser = require('body-parser');
const Fs = require('fs');
const Routes = require('./backend/routes/routes');

// Create and configure Express instance
const app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));

// Set the root path for other files like css and js-scripts
app.use(Express.static('frontend'));

// This handles the routes
const routes = Routes(app, Fs);

// Start server
const server = app.listen(3001, function startServer() {
   console.log('listening to port %s...', server.address().port)
});