const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

require('dotenv').config();

// Load DB model
const { TripNameModel } = require('./model');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Load SSL Certificate and Key (if available)
let server;
if (process.env.USE_HTTPS === 'true') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY), // Private key
        cert: fs.readFileSync(process.env.SSL_CERT) // Certificate
    };
    server = https.createServer(options, app);
    console.log("Starting server with HTTPS...");
} else {
    server = http.createServer(app);
    console.log("Starting server with HTTP...");
}

// API Routes
app.post('/api/people', async (req, res) => {
    try {
        const { name, tripName } = req.body;
        const trip = await TripNameModel.findOne({ tripName });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        trip.PeopleNameList.push(name);
        await trip.save();
        res.json({ name, peopleNameList: trip.PeopleNameList });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save person' });
    }
});

app.post('/api/trips', async (req, res) => {
    try {
        const { tripName } = req.body;
        const existingTrip = await TripNameModel.findOne({ tripName });
        if (existingTrip) {
            return res.status(400).json({ error: "Trip already exists!" });
        }
        const trip = new TripNameModel({
            tripName
        });
        await trip.save();
        res.json({ id: trip._id, tripName: trip.tripName });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save trip' });
    }
});

app.post('/api/tripData', async (req, res) => {
    try {
        const { tripName } = req.body;
        const trip = await TripNameModel.findOne({ tripName });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json({ tripName: trip.tripName, PeopleNameList: trip.PeopleNameList });
    } catch (err) {
        console.error("Error fetching trip data:", err);
        res.status(500).json({ error: 'Failed to fetch trip data' });
    }
});

app.delete('/api/trips/:tripName', async (req, res) => {
    try {
        const { tripName } = req.params;
        const deletedTrip = await TripNameModel.findOneAndDelete({ tripName });
        if (!deletedTrip) {
            return res.status(404).json({ error: "Trip not found" });
        }
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        console.error("Error deleting trip:", err);
        res.status(500).json({ error: "Failed to delete trip" });
    }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${process.env.USE_HTTPS === 'true' ? 'HTTPS' : 'HTTP'} port ${PORT}`);
});