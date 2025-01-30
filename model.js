const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || "travelPay"}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database connection successful")
    })
    .catch((err) => {
        console.error('Database connection error:', err)
    })

const TripName = new mongoose.Schema({
    tripName: {type: String, require: true},
    PeopleNameList: {type: Array},
    PeopleJoinName: {type: String},
})

const TripNameModel = mongoose.model('TripNameModel',TripName)

module.exports = {TripNameModel}