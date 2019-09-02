const expect = require('chai').expect;
const request = require('request');

describe('Routes status codes', () => {
    describe('Main route', () => {
        it('Status code testing', (done) => {
            request('http://localhost:81/', (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });
        it('Main route testing response type', (done) => {
            request('http://localhost:81/', (err, resp, body) => {
                expect(resp.headers['content-type']).to.equal("application/json; charset=utf-8");
                done();
            });
        });

    });
    describe('Closest routes testing', () => {
        it('zipcode testing', (done) => {
            request('http://localhost:81/closest', (err, resp, body) => {
                expect(resp.statusCode).to.equal(404);
                done();
            });
        });
        it('zipcode testing response type', (done) => {
            request('http://localhost:81/closest', (err, resp, body) => {
                expect(resp.headers["content-type"]).to.equal("application/json; charset=utf-8");
                done();
            });
        });
    });
    describe('Closest route zip code testing', () => {
        it('zipcode route: status code', (done) => {
            request('http://localhost:81/closest?zip=01752', (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });
        it('zipcode route: response type', (done) => {
            request('http://localhost:81/closest?zip=01752', (err, resp, body) => {
                expect(resp.headers["content-type"]).to.equal("application/json; charset=utf-8");
                done();
            });
        });
        it('zipcode route: response status code', (done) => {
            request('http://localhost:81/closest?zip=01752', (err, resp, body) => {
                let responseBody = JSON.parse(body);
                expect(responseBody.status).to.equal(200);
                done();
            });
        });
        it('zipcode route: response message', (done) => {
            request('http://localhost:81/closest?zip=01752', (err, resp, body) => {
                let responseBody = JSON.parse(body);
                expect(responseBody.message).to.equal("Successful");
                done();
            });
        });
        it('zipcode route: invalid zip code test with decimals', (done) => {
            request('http://localhost:81/closest?zip=111.90', (err, resp, body) => {
                expect(resp.statusCode).to.equal(400);
                done();
            });
        });
        it('zipcode route: invalid but complete zip code test', (done) => {
            request('http://localhost:81/closest?zip=00000', (err, resp, body) => {
                expect(resp.statusCode).to.equal(400);
                done();
            });
        });
        it('zipcode route: empty zip code test', (done) => {
            request('http://localhost:81/closest?zip=', (err, resp, body) => {
                expect(resp.statusCode).to.equal(404);
                done();
            });
        });
        it('zipcode route: empty zip code test with units', (done) => {
            request('http://localhost:81/closest?zip=01752&units=km', (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });
        it('zipcode route: empty zip code test empty units', (done) => {
            request('http://localhost:81/closest?zip=01752&units=', (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });
        
    });
});