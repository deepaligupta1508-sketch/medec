/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONNECTION ---
// Replace with your actual MongoDB Atlas Connection String
const DB_URI = "mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/lifelineDB?retryWrites=true&w=majority";

mongoose.connect(DB_URI)
    .then(() => console.log("✅ Connected to LifeLine Database"))
    .catch(err => console.error("❌ Database Connection Error:", err));

// --- 2. HOSPITAL SCHEMA & MODEL ---
const HospitalSchema = new mongoose.Schema({
    id: Number,      // Numeric ID used by your frontend logic
    name: String,
    beds: Number,
    region: { type: String, default: "Mumbai Region" }
});

const Hospital = mongoose.model('Hospital', HospitalSchema);

// --- 3. API ENDPOINTS ---

// GET: Fetch all hospitals for the Public and Admin lists
app.get('/api/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch hospitals" });
    }
});

// POST: Update bed count (Triggered by your + and - buttons)
app.post('/api/update', async (req, res) => {
    const { id, change } = req.body;
    try {
        const hospital = await Hospital.findOne({ id: id });
        if (hospital) {
            // Ensure beds don't go below zero
            hospital.beds = Math.max(0, hospital.beds + change);
            await hospital.save();
            res.json({ success: true, newCount: hospital.beds });
        } else {
            res.status(404).json({ error: "Hospital not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// --- 4. SEED DATA (Run once to populate your DB) ---
const seedData = async () => {
    const count = await Hospital.countDocuments();
    if (count === 0) {
        const initialHospitals = [
            { id: 101, name: "City Care Hospital", beds: 15 },
            { id: 102, name: "Metro General", beds: 8 },
            { id: 103, name: "St. Joseph's Clinic", beds: 22 }
        ];
        await Hospital.insertMany(initialHospitals);
        console.log("🌱 Database Seeded with initial hospitals");
    }
};
seedData();

const PORT = 5000;
server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));*/
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LifeLine | Admin Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-slate-100 font-sans">

    <div class="min-h-screen p-4 md:p-8 flex justify-center items-center">
        <div class="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            
            <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight uppercase">Hospital Admin Portal</h2>
                    <p class="text-blue-100 text-sm">Sync live bed availability to the cloud</p>
                </div>
                <i class="fas fa-heartbeat text-4xl opacity-50"></i>
            </div>

            <form id="adminForm" class="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                
                <div class="md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Hospital Name</label>
                    <input type="text" id="hospitalName" required placeholder="e.g. City Life Hospital" 
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>

                <div class="md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Full Address</label>
                    <input type="text" id="address" required placeholder="Street, City, Zip Code"
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                </div>

                <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label class="text-xs font-bold text-blue-800 uppercase block mb-1">ICU Beds</label>
                    <input type="number" id="icuBeds" value="0" class="w-full bg-transparent text-xl font-bold outline-none text-blue-600">
                </div>

                <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <label class="text-xs font-bold text-emerald-800 uppercase block mb-1">General Beds</label>
                    <input type="number" id="generalBeds" value="0" class="w-full bg-transparent text-xl font-bold outline-none text-emerald-600">
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Credentials</label>
                    <input type="text" id="credentials" placeholder="NABH, ISO 9001"
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                </div>

                <div>
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Timings</label>
                    <input type="text" id="timing" placeholder="24/7"
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                </div>

                <div class="md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Specialities</label>
                    <textarea id="specialities" placeholder="Cardiology, Neurology..."
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg h-20 outline-none"></textarea>
                </div>

                <div class="md:col-span-2">
                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Amenities</label>
                    <input type="text" id="amenities" placeholder="Oxygen, Pharmacy, Parking"
                        class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none">
                </div>

                <button type="submit" class="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest">
                    <i class="fas fa-cloud-upload-alt mr-2"></i> Sync Live Data
                </button>
            </form>
        </div>
    </div>

    <script>
        // Connect to your Node.js Server
        const socket = io('http://localhost:5000');

        const adminForm = document.getElementById('adminForm');

        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect data from inputs
            const formData = {
                hospitalName: document.getElementById('hospitalName').value,
                address: document.getElementById('address').value,
                icuBeds: parseInt(document.getElementById('icuBeds').value),
                generalBeds: parseInt(document.getElementById('generalBeds').value),
                credentials: document.getElementById('credentials').value,
                timing: document.getElementById('timing').value,
                specialities: document.getElementById('specialities').value,
                amenities: document.getElementById('amenities').value
            };

            // Trigger Socket.io Event
            socket.emit('update_hospital', formData);
            
            alert("✅ Successfully Synced to Patient Dashboard!");
        });
    </script>
</body>
</html>