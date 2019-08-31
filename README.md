# Store Locator API

The Store Locator API is designed to help you find the nearest store to you via either your zip code or address.

The instructions below will get you started in no time!!


## Table of Contents

  - [Overview](#overview)
  - [Dependencies](#dependencies)
  - [Setup](#setup)
  - [Requests](#requests)
  - [Tests](#tests)
  - [References](#references)
  - [Other](#other)

## Overview

The Store Locator API was built to assist users to find the nearest store to them using their zip code or address.

It is easy to setup and can be customized to fit the user's requirements.

At the moment, three (3) URLs are permitted:

    - {server}/closest?zip=<zip>     Find nearest store to this zip code. If there are multiple best-matches, the first is returned.
    - {server}/closest?address=<address>    Find nearest store to this address. If there are multiple best-matches, the first is returned.
    - {server}/closest?zip=<zip>&units=<(mi|km)>    Display units in miles or kilometers [default: mi]


## Dependencies

You will need to install the following:

- [Node.js](https://nodejs.org) 8.x.x and above
- [npm](https://npmjs.com/) 4.x.x and above



## Setup

Before getting started, please ensure that you have all of the dependencies installed and that your have entered your API keys in the [config](config/app.config.js) file. For information on getting your API keys, see [Other](#other) section.

### Build the webapp

```shell
git clone https://github.com/tobennanwokike/store-locator
cd store-locator
npm install
npm start
```

By default, the web application should now run on port 3000 on your local machine.

You may navigate to http://localhost:3000/closest?zip=55428 to ensure that your local server is up and running

## Requests

At the moment, three (3) URLs are permitted:

    - {server}/closest?zip=<zip>     Find nearest store to this zip code. If there are multiple best-matches, the first is returned.
    - {server}/closest?address=<address>    Find nearest store to this address. If there are multiple best-matches, the first is returned.
    - {server}/closest?zip=<zip>&units=<(mi|km)>    Display units in miles or kilometers [default: mi]

See sample requests below:

### Get the nearest store by zip code

#### Request

`GET /closest?zip=55428`

    curl -i -H 'Accept: application/json' -d 'zip=55428' http://localhost:3000?zip=55428

#### Response

    {
        "status": 200,
        "message": "Successful",
        "data": {
            "distance": "1.09 mi",
            "address": "5537 W Broadway Ave"
        }
    }


### Get the nearest store by address

#### Request

`GET /closest?address=1600%20Amphitheatre%20Parkway%20Mountain%20View,%20CA`

    curl -i -H 'Accept: application/json' -d 'address=1600%20Amphitheatre%20Parkway%20Mountain%20View,%20CA' http://localhost:3000?address=1600%20Amphitheatre%20Parkway%20Mountain%20View,%20CA

#### Response

    {
        "status": 200,
        "message": "Successful",
        "data": {
            "distance": "1.87 mi",
            "address": "555 Showers Dr"
        }
    }


### Get the nearest store by zip code while specifying units

#### Request

`GET /closest?zip=55428&units=km`

    curl -i -H 'Accept: application/json' -d 'zip=554288&units=km' http://localhost:3000?zip=55428&units=km

#### Response

    {
        "status": 200,
        "message": "Successful",
        "data": {
            "distance": "1.76 km",
            "address": "5537 W Broadway Ave"
        }
    }


### Get the nearest store by wrong zip code

#### Request

`GET /closest?zip=000`

    curl -i -H 'Accept: application/json' -d 'zip=55428' http://localhost:3000?zip=000

#### Response

    {
        "status": 400,
        "message": "Invalid zip code: Zip code should be in format xxxxx or xxxxx-xxxx",
        "data": {}
    }



## Tests

Check out the test files under the tests directory for all the tests you can run.

### Unit tests

Run this command in the tests to run your tests: `npm test`


## References

During the development of this application, a number of online resources were used and they are mentioned below:

- [Google geolocation API](https://developers.google.com/maps/documentation/geolocation/intro) For getting the coordinates from the address
- [ZipCodeAPI](https://www.zipcodeapi.com) For getting the coordinates from the zip code
- [GeeksForGeeks](https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/) Converted Haversine formula from PHP to JS from this site

## Other

For security reasons, the API keys are blank on the [config](config/app.config.js) file, You may setup your own API keys via the URLs below:

- [Google geolocation API](https://developers.google.com/maps/documentation/geolocation/intro)
- [ZipCodeAPI](https://www.zipcodeapi.com)
