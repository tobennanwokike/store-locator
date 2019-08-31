const fs = require('fs');
const httpsHandle = require('https');
const csvHandle = require('fast-csv');
const appConfig = require('../config/app.config');

const fileLocation = appConfig.storeLocationsFile;

exports.closest = (req, res, next) => {
    //Zip code route with optional units
    if (req.query.zip) {
        let zipCodeData = '';
        
        //check if units paramater exists and assign to miles unless km specified
        let unit = req.query.units && (req.query.units === 'mi' || req.query.units == 'km') ? req.query.units : 'mi';

        const zipCode = req.query.zip;

        //check for valid zip code
        if (!validateZipCode(zipCode)) {
            res.status(400).json({
                status: 400,
                message: 'Invalid zip code: Zip code should be in format xxxxx or xxxxx-xxxx',
                data: {}
            });
            return;
        }

        //make request to ZipCodeAPI to get longitude and latitude of zip code
        httpsHandle
            .get(`${appConfig.zipcodeURL}/${appConfig.zipcodeAPIKey}/info.json/${zipCode}/degrees`, resp => {
                resp
                    .on('data', zipCodeBreakDown => {
                        zipCodeData += zipCodeBreakDown;
                    })
                    .on('end', () => {
                        zipCodeData = JSON.parse(zipCodeData);
                        console.log('zipcode', zipCodeData);

                        //check for errors with API call
                        if (zipCodeData.error_code) {
                            res.status(400).json({
                                status: 400,
                                message: "Error validating zipcode!",
                                data: {}
                            });
                            return;
                        }

                        const latitudeFromZipCode = zipCodeData.lat;
                        const longitudeFromZipCode = zipCodeData.lng;
                        let distanceDifference = null;

                        //get the distance and address of the nearest store to the zip code
                        fileDatabaseSearch(latitudeFromZipCode, longitudeFromZipCode)
                            .then(data => {

                                //send appropriate response to client dependent on the unit
                                if (unit === 'mi') {
                                    distanceDifference = convertToTwoDecimal(unitConversion(data.distance)) + ' mi';
                                } else {
                                    distanceDifference = convertToTwoDecimal(data.distance) + ' km';
                                }
                                res.json({
                                    status: 200,
                                    message: 'Successful',
                                    data: { distance: distanceDifference, address: data.address }
                                });
                            })
                            .catch(err => {
                                console.log('error occured processing zip code distance!', err);
                            });
                    });
            })
            .on('error', err => {
                console.log('unable to get http request!', err);
            })
            .on('timeout', timeoutHandle => {
                console.log('request timed out!', timeoutHandle);
            });

    }
    else if (req.query.address) {
        
        //only accept address parameter
        if (Object.keys(req.query).length > 1) {
            res.status(404).json({
                status: 404,
                message: 'Route not found!'
            });
            return;
        }

        //encode URI and decode for Google Geolocation API
        let address = encodeURI(req.query.address);
        address = decodeURI(address);
        //replace all spaces with a +
        address = address.replace(/\s/g, "+");

        //make call to Google Geolocation API
        const apiURL = `${appConfig.googleMapURL}/${appConfig.googleMapRespType}?address=${address}&key=${appConfig.googleMapApiKey}`;
        let googleResponse = '';
        let distanceDifference = null;

        httpsHandle
            .get(apiURL, resp => {
                resp
                    .on('data', (data) => {
                        googleResponse += data;
                    })
                    .on('end', () => {
                        googleResponse = JSON.parse(googleResponse);

                        //check for errors with API call
                        if (googleResponse.status !== 'OK') {
                            res.status(400).json({
                                status: 400,
                                message: 'Error validating address!',
                                data: {}
                            });
                            return;
                        }

                        const latitudeFromAddress = googleResponse.results[0].geometry.location.lat;
                        const longitudeFromAddress = googleResponse.results[0].geometry.location.lng;

                        //get the distance and address of the nearest store to the zip code
                        fileDatabaseSearch(latitudeFromAddress, longitudeFromAddress)
                            .then(data => {
                                //send response to client
                                distanceDifference = convertToTwoDecimal(unitConversion(data.distance)) + ' mi';
                                res.json({
                                    status: 200,
                                    message: 'Successful',
                                    data: { distance: distanceDifference, address: data.address }
                                });
                            })
                            .catch(err => {
                                console.log('error occured!', err);
                            });
                    });
            });
    }
    else {
        res.status(404).json({
            status: 404,
            message: 'Route not found!',
        });
    }

}

//validate zip code using regex
function validateZipCode(zipCode) {
    const re = /^[0-9]{5}(-[0-9]{4})?$/;

    return re.test(zipCode);
}

//calculate the distance between two points using Haversine formula
function calculateDistance(lat1, long1, lat2, long2) {
    let dLat = (lat2 - lat1) * Math.PI / 180.0;
    let dLon = (long2 - long1) * Math.PI / 180.0;

    // convert to radians 
    lat1 = (lat1) * Math.PI / 180.0;
    lat2 = (lat2) * Math.PI / 180.0;

    // apply formulae 
    let a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    let rad = 6371;
    let c = 2 * Math.asin(Math.sqrt(a));

    return rad * c; 
}

//convert from km to mi
function unitConversion(value) {
    return value / 1.60934;
    //return value * 0.621371;
}

//convert to two decimal places
function convertToTwoDecimal(num) {
    return num.toFixed(2);
}

//get the closest store to a location
function fileDatabaseSearch(latitude, longitude) {
    let distanceDifference = null;
    let response = {};
    let closest = {};

    //return the distance and address of the closest store
    return new Promise((resolve, reject) => {
        fs
            .createReadStream(fileLocation)
            .pipe(csvHandle.parse({ headers: true }))
            .on('data', row => {
                let latitudeFromFile = row.Latitude;
                let longitudeFromFile = row.Longitude;

                let difference = calculateDistance(latitude, longitude, latitudeFromFile, longitudeFromFile);

                //check for shortest distance. always keep the initial shortest distance
                if (distanceDifference === null) {
                    distanceDifference = difference;
                    closest = row;
                } else {
                    if (difference < distanceDifference) {
                        distanceDifference = difference;
                        closest = row;
                    }
                }
            })
            .on('end', () => {
                //return the required data - distance and address
                response = { distance: distanceDifference, address: closest.Address };
                resolve(response);
            })
            .on('error', err => {
                reject(err);
            });

    })
}