const { readDB, writeDB } = require('../config/db');

// GET /students
exports.getAllStudents = (req, res) => {
    const db = readDB();
    const { section_id } = req.query;

    let students = db.students;
    if (section_id) students = students.filter(s => s.section_id == section_id);

    // Join section name
    const result = students.map(s => ({
        ...s,
        section_name: db.sections.find(sec => sec.id === s.section_id)?.section_name || null
    })).reverse();

    res.json(result);
};

// GET /students/eligible
exports.getEligibleStudents = (req, res) => {
    const db = readDB();
    const minCgpa = parseFloat(req.query.cgpa) || 0;
    const maxArrears = req.query.arrears !== undefined ? parseInt(req.query.arrears) : null;

    let students = db.students.filter(s => parseFloat(s.cgpa) >= minCgpa);
    if (maxArrears !== null) students = students.filter(s => s.arrears <= maxArrears);

    const result = students
        .map(s => ({
            ...s,
            section_name: db.sections.find(sec => sec.id === s.section_id)?.section_name || null
        }))
        .sort((a, b) => b.cgpa - a.cgpa);

    res.json(result);
};

// GET /students/:id
exports.getStudentById = (req, res) => {
    const db = readDB();
    const student = db.students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({
        ...student,
        section_name: db.sections.find(sec => sec.id === student.section_id)?.section_name || null
    });
};

// POST /students
exports.createStudent = (req, res) => {
    const { name, gender, cgpa, section_id, email, phone, arrears } = req.body;
    if (!name || cgpa === undefined) return res.status(400).json({ error: 'Name and CGPA are required' });

    const db = readDB();
    const newStudent = {
        id: db._nextStudentId++,
        name,
        gender: gender || null,
        cgpa: parseFloat(cgpa),
        section_id: section_id ? parseInt(section_id) : null,
        email: email || null,
        phone: phone || null,
        arrears: parseInt(arrears) || 0
    };

    db.students.push(newStudent);
    writeDB(db);
    res.status(201).json({ id: newStudent.id, message: 'Student created successfully' });
};

// PUT /students/:id
exports.updateStudent = (req, res) => {
    const { name, gender, cgpa, section_id, email, phone, arrears } = req.body;
    const db = readDB();
    const idx = db.students.findIndex(s => s.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });

    db.students[idx] = {
        ...db.students[idx],
        name,
        gender: gender || null,
        cgpa: parseFloat(cgpa),
        section_id: section_id ? parseInt(section_id) : null,
        email: email || null,
        phone: phone || null,
        arrears: parseInt(arrears) || 0
    };

    writeDB(db);
    res.json({ message: 'Student updated successfully' });
};

// DELETE /students/:id
exports.deleteStudent = (req, res) => {
    const db = readDB();
    const idx = db.students.findIndex(s => s.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });

    db.students.splice(idx, 1);
    writeDB(db);
    res.json({ message: 'Student deleted successfully' });
};
