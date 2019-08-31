module.exports = {
    port: process.env.port || 3000,
    storeLocationsFile: 'public/store-locations.csv',
    zipcodeURL: 'https://www.zipcodeapi.com/rest',
    zipcodeAPIKey: '',
    googleMapApiKey: '',
    googleMapURL: 'https://maps.googleapis.com/maps/api/geocode',
    googleMapRespType: 'json'
}