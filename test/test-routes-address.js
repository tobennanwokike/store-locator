const expect = require('chai').expect;
const request = require('request');

describe('Testing Address Routes', () => {
    describe('Status and Content Testing', () => {
        it('Empty address URL status testing', (done) => {
            request('http://localhost:81/closest?address=', (err, resp, body) => {
                expect(resp.statusCode).to.equal(404);
                done();
            });
        });
        it('Wrong spelling of address', (done) => {
            request('http://localhost:81/closest?adress=1600 Amphitheatre Parkway, Mountain View, CA', (err, resp, body) => {
                expect(resp.statusCode).to.equal(404);
                done();
            });
        });
        it('Correct address status testing', (done) => {
            request('http://localhost:81/closest?address=1600 Amphitheatre Parkway, Mountain View, CA', (err, resp, body) => {
                expect(resp.statusCode).to.equal(200);
                done();
            });
        });

    });
});