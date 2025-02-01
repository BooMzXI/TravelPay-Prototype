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

    const login = new mongoose.Schema({
        email: {type: String},
        password: {type: String},
        Data: [{
            tripName: {type: String , require: true},
            peopleNameList: {type: Array},
        }],
        dateNow: { type: Date, default: new Date() }
    })
    
    const loginData = mongoose.model('loginData', login)
    
    module.exports = { loginData };
