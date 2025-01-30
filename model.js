const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://bummi:<pass>@express.iuqqb.mongodb.net/?retryWrites=true&w=majority&appName=Express',{
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