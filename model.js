const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/`,{
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
