const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Seed data if DB doesn't exist yet
const seed = {
    sections: [
        { id: 1, section_name: 'CSE A' },
        { id: 2, section_name: 'CSE B' },
        { id: 3, section_name: 'IT A' }
    ],
    students: [
        { id: 1, name: 'Arjun Kumar',  gender: 'Male',   cgpa: 8.5, section_id: 1, email: 'arjun@example.com',   phone: '9876543210', arrears: 0 },
        { id: 2, name: 'Priya Sharma', gender: 'Female', cgpa: 7.2, section_id: 1, email: 'priya@example.com',   phone: '9876543211', arrears: 0 },
        { id: 3, name: 'Rahul Verma',  gender: 'Male',   cgpa: 6.8, section_id: 2, email: 'rahul@example.com',   phone: '9876543212', arrears: 1 },
        { id: 4, name: 'Sneha Reddy',  gender: 'Female', cgpa: 9.1, section_id: 2, email: 'sneha@example.com',   phone: '9876543213', arrears: 0 },
        { id: 5, name: 'Karthik Raj',  gender: 'Male',   cgpa: 7.9, section_id: 3, email: 'karthik@example.com', phone: '9876543214', arrears: 0 }
    ],
    _nextStudentId: 6,
    _nextSectionId: 4
};

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
}

// Read entire DB
function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

// Write entire DB
function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
