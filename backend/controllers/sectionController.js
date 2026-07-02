const { readDB, writeDB } = require('../config/db');

// GET /sections
exports.getAllSections = (req, res) => {
    const db = readDB();
    res.json([...db.sections].sort((a, b) => a.section_name.localeCompare(b.section_name)));
};

// POST /sections
exports.createSection = (req, res) => {
    const { section_name } = req.body;
    if (!section_name) return res.status(400).json({ error: 'Section name is required' });

    const db = readDB();
    if (db.sections.find(s => s.section_name === section_name.trim())) {
        return res.status(409).json({ error: 'Section already exists' });
    }

    const newSection = { id: db._nextSectionId++, section_name: section_name.trim() };
    db.sections.push(newSection);
    writeDB(db);
    res.status(201).json({ id: newSection.id, message: 'Section created successfully' });
};

// PUT /sections/:id
exports.updateSection = (req, res) => {
    const { section_name } = req.body;
    const db = readDB();
    const idx = db.sections.findIndex(s => s.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Section not found' });

    db.sections[idx].section_name = section_name.trim();
    writeDB(db);
    res.json({ message: 'Section updated successfully' });
};

// DELETE /sections/:id
exports.deleteSection = (req, res) => {
    const db = readDB();
    const idx = db.sections.findIndex(s => s.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Section not found' });

    // Unassign students in this section
    db.students = db.students.map(s =>
        s.section_id == req.params.id ? { ...s, section_id: null } : s
    );

    db.sections.splice(idx, 1);
    writeDB(db);
    res.json({ message: 'Section deleted successfully' });
};
