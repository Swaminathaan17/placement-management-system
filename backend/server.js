const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const sectionRoutes = require('./routes/sectionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', authRoutes);
app.use('/students', studentRoutes);
app.use('/sections', sectionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Placement Eligibility Tracking System API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: JSON file (no MySQL needed)`);
    console.log(`🔑 Login: admin / admin123\n`);
});
