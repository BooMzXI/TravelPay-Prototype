const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const session = require('express-session')

require('dotenv').config();

// Load DB model
const { loginData } = require('./model');
const app = express();

//Session Config
app.use(session({
    secret: 'Bummi',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.USE_HTTPS === 'true' }
}));

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

app.get('/', (req, res) => {
    if(!req.session.user){
      return res.sendFile(path.join(__dirname, "public", "html", 'login.html'));
    }
    res.sendFile(path.join(__dirname, "public", "html", 'index.html')); 
  });
  
app.get('/index.html', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/');  // Redirect to login if not logged in
    }
    res.sendFile(path.join(__dirname, "public", "html", 'index.html')); 
  });
app.get('/register.html', (req,res) => {
    if (req.session.user){
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, "public", "html", 'register.html'));
})
app.get('/tripDetail.html',(req,res) => {
    if (!req.session.user){
        return res.redirect('/')
    }
    res.sendFile(path.join(__dirname, "public", "html", 'tripDetail.html'));
})


// API Routes
app.get('/api/LoadData', async (req,res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(404).json('Error: User not logged in or email not found');
        }
        const userEmail = req.session.user.email;
        const user = await loginData.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.Data || []);


    } catch {
        res.status(500).json({ error: 'Failed to load data' });
    }
})

app.post('/api/people', async (req, res) => {
    try {
        const { name, tripName } = req.body;
        if (!req.session.user || !req.session.user.email) {
            return res.status(404).json('Error: User not logged in or email not found');
        }
        
        const userEmail = req.session.user.email;
        const user = await loginData.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const trip = user.Data.find((trip) => trip.tripName === tripName);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        trip.peopleNameList.push(name);
        await user.save();
        res.json({ name, peopleNameList: trip.peopleNameList });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save person' });
    }
});

app.post('/api/trips', async (req, res) => {
    try {
        const { tripName } = req.body;
        if (!req.session.user || !req.session.user.email) {
            return res.status(404).json('Error: User not logged in or email not found');
        }
        
        const userEmail = req.session.user.email;
        const user = await loginData.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingTrip = user.Data.find(trip => trip.tripName === tripName);
        if (existingTrip) {
            return res.status(400).json({ error: "Trip already exists!" });
        }
        const newTrip = { tripName, peopleNameList: [] };
        user.Data.push(newTrip);

        await user.save();
        res.json({ tripName: newTrip.tripName });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save trip' });
    }
});

app.post('/api/tripData', async (req, res) => {
    try {
        const { tripName } = req.body;

        if (!req.session.user || !req.session.user.email) {
            return res.status(404).json('Error: User not logged in or email not found');
        }
        
        const userEmail = req.session.user.email;
        const user = await loginData.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const trip = user.Data.find(trip => trip.tripName === tripName);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json({ tripName: trip.tripName, peopleNameList: trip.peopleNameList });
    } catch (err) {
        console.error("Error fetching trip data:", err);
        res.status(500).json({ error: 'Failed to fetch trip data' });
    }
});

app.delete('/api/trips/:tripName', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(401).json({ error: "User not logged in or email not found" });
        }

        const userEmail = req.session.user.email;
        const user = await loginData.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the trip exists
        const tripIndex = user.Data.findIndex(trip => trip.tripName === req.params.tripName);
        if (tripIndex === -1) {
            return res.status(404).json({ error: "Trip not found" });
        }

        // Remove trip from user's Data array
        user.Data.splice(tripIndex, 1);
        await user.save();

        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        console.error("Error deleting trip:", err);
        res.status(500).json({ error: "Failed to delete trip" });
    }
});


app.post('/api/sign-in',async (req,res) => {
    const { email , password } = req.body
    const user = await loginData.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'Error: Cannot find this email' });
  }
  
  if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
  }

  // Save user info in session after successful login
  req.session.user = { id: user._id, email: user.email };

  // Send success response
  return res.json({ success: true, redirectUrl: '/index.html' });
  })

  app.post('/api/register', async (req,res) => {
    const { email , password } = req.body
    const user = await loginData.findOne({ email })
    if (user) {
        return res.status(403).json({error : 'This email is already registered'})
    }
    const newData = new loginData({email: email, password: password}) 
    newData.save()
    return res.json({ success: true, redirectUrl: '/index.html' });
  })


app.post('/api/addBill', async (req,res) => {
    try {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).json({ error: "User not logged in or email not found" });
    }

    const { tripName , BillName , Amount } = req.body
    const userEmail = req.session.user.email

    const user = await loginData.findOne({ email: userEmail })
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const trip = user.Data.find(trip => trip.tripName === tripName);
    if (!trip) {
        return res.status(404).json({ error: 'Trip not found' });
    }
    const newBill = { bill: BillName, amount: Amount };
    trip.tripBill.push(newBill)

    user.markModified("Data");
    await user.save()
    return res.json({ BillName: BillName , Amount: Amount });
    } catch (err) {
        return res.status(500).json({ error: "Failed to add bill to database" });
    }
})

app.post('/api/getBill' , async (req,res) => {
   try { 
    if (!req.session.user || !req.session.user.email){
        return res.status(401).json({ error: "User not logged in or email not found" });
    }
        const userEmail = req.session.user.email
        const { tripName } = req.body
        const user = await loginData.findOne({ email: userEmail })
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
        const trips = user.Data.find(trip => trip.tripName === tripName)
    if (!trips){
        return res.status(404).json({ error: "trip not found" });
    }

    res.json(trips.tripBill);

} catch (err) {
    return res.status(500).json({ error: "Failed to reload bill" });
}
})

app.delete("/api/deleteBill/:billId", async (req,res) => {
    try {
        if (!req.session.user || !req.session.user.email){
            return res.status(401).json({ error: "User not logged in or email not found" });
        }
        const userEmail = req.session.user.email
        const billId = req.params.billId;
        
        const user = await loginData.findOne({ email: userEmail })
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let billDeleted = false;

        user.Data.forEach(trip => {
            const billIndex = trip.tripBill.findIndex(bill => bill._id.toString() === billId);
            if (billIndex !== -1) {
                trip.tripBill.splice(billIndex, 1);
                billDeleted = true;
            }
        });

        if (!billDeleted) {
            return res.status(404).json({ error: "Bill not found" });
        }

        // Mark the data as modified and save
        user.markModified("Data");
        await user.save();

        res.json({ success: true, message: "Bill deleted successfully" });

    }
    catch (err) {
        return res.status(500).json({ error: "Failed to delete bill" });
    }
})



// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public","html", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${process.env.USE_HTTPS === 'true' ? 'HTTPS' : 'HTTP'} port ${PORT}`);
});