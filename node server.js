const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory databases (resets when server restarts)
let users = []; 
let hospitals = [
    { id: 1, name: "City General", beds: 10, lat: 19.07, lng: 72.87 }
];

// SIGNUP ROUTE
app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email already registered!" });
    }

    // 2. Save User
    const newUser = { name, email, password, role };
    users.push(newUser);

    // 3. If they are a hospital, add them to the bed-tracking list
    if (role === 'hospital') {
        hospitals.push({
            id: hospitals.length + 1,
            name: name, // Hospital name
            beds: 0,
            lat: 19.07 + (Math.random() * 0.05),
            lng: 72.87 + (Math.random() * 0.05)
        });
    }

    res.status(201).json({ success: true, message: "Account created!" });
});

// LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, role: user.role, name: user.name });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));