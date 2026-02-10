const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware - IMPORTANT: Routes must come AFTER middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Database
let hospitals = [
    { id: 1, name: "City Hospital", beds: 5, lat: 19.076, lng: 72.877 },
    { id: 2, name: "Emergency Care Center", beds: 0, lat: 19.120, lng: 72.900 },
    { id: 3, name: "Sunrise Medical", beds: 12, lat: 19.050, lng: 72.800 }
];

let users = [
    { email: "admin@hospital.com", password: "password123", role: "hospital", hospitalId: 1 },
    { email: "patient@gmail.com", password: "user123", role: "patient" }
];

// Define API routes BEFORE static file serving
app.get('/api/hospitals', (req, res) => {
    res.json(hospitals);
});

app.post('/api/update', (req, res) => {
    const { id, change } = req.body;
    const hospital = hospitals.find(h => h.id === id);
    if (hospital) {
        hospital.beds = Math.max(0, hospital.beds + change);
        res.json(hospital);
    } else {
        res.status(404).json({ error: "Hospital not found" });
    }
});

app.post('/api/register', (req, res) => {
    console.log("POST /api/register received with body:", req.body);
    const { role, email, password, hospitalName } = req.body;
    
    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: "User already exists" });
    }
    
    users.push({ role, email, password, hospitalName });
    console.log("User registered:", email);
    res.json({ success: true, message: "Registration successful" });
});

app.post('/api/login', (req, res) => {
    console.log("POST /api/login received with body:", req.body);
    const { email, password, role } = req.body;
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        res.json({ success: true, role: user.role, message: "Login Successful!" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));