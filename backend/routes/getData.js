/**
 * Handles routes for authors
 * @param {Express} app
 */
module.exports = function armor(app) {
    console.log('in armor')

    // GET Requests
    app.get('/getData', function getArmors(request, response) {
    });

    // POST requests
    app.post('/getData', function getArmors(request, response) {
        console.log('in post')
        return null;
    });

    // PUT requests
    app.put('/getData', function getArmors(request, response) {
        console.log('in put')
        return null;
    });

    // DELETE requests
    app.delete('/getData', function getArmors(request, response) {
        console.log('in armor')
        return null;
    });
};