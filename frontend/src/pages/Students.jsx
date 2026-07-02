import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const emptyForm = {
    id: null,
    name: '',
    gender: 'Male',
    cgpa: '',
    section_id: '',
    email: '',
    phone: '',
    arrears: 0
};

function Students() {
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [search, setSearch] = useState('');
    const [minCgpaFilter, setMinCgpaFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchSections();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Error fetching students:', err);
        }
    };

    const fetchSections = async () => {
        try {
            const res = await api.get('/sections');
            setSections(res.data);
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setForm(emptyForm);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleEdit = (student) => {
        setForm({
            id: student.id,
            name: student.name,
            gender: student.gender || 'Male',
            cgpa: student.cgpa,
            section_id: student.section_id || '',
            email: student.email || '',
            phone: student.phone || '',
            arrears: student.arrears || 0
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;

        try {
            await api.delete(`/students/${id}`);
            fetchStudents();
        } catch (err) {
            console.error('Error deleting student:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            gender: form.gender,
            cgpa: parseFloat(form.cgpa),
            section_id: form.section_id || null,
            email: form.email,
            phone: form.phone,
            arrears: parseInt(form.arrears) || 0
        };

        try {
            if (isEditing) {
                await api.put(`/students/${form.id}`, payload);
            } else {
                await api.post('/students', payload);
            }
            setShowForm(false);
            setForm(emptyForm);
            fetchStudents();
        } catch (err) {
            console.error('Error saving student:', err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setForm(emptyForm);
    };

    const exportToExcel = () => {
    const exportData = filteredStudents.map((s) => ({
        ID: s.id,
        Name: s.name,
        Gender: s.gender,
        CGPA: s.cgpa,
        Arrears: s.arrears,
        Section: s.section_name || '-',
        Email: s.email || '-',
        Phone: s.phone || '-'
    }));

    const worksheet =
        XLSX.utils.json_to_sheet(exportData);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Students'
    );

    const excelBuffer =
        XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

    const fileData = new Blob(
        [excelBuffer],
        {
            type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    );

    saveAs(
        fileData,
        'Placement_Students.xlsx'
    );
};

    const filteredStudents = students.filter((s) => {
    const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        String(s.id).includes(search);

    const matchesCgpa =
        minCgpaFilter === '' ||
        parseFloat(s.cgpa) >= parseFloat(minCgpaFilter);

    const matchesSection =
        sectionFilter === '' ||
        String(s.section_id) === sectionFilter;

    return (
        matchesSearch &&
        matchesCgpa &&
        matchesSection
    );
});

    return (
        <Layout>
            <h1 className="page-title">Students</h1>

            <div className="toolbar">
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        className="search-input"
                        style={{ minWidth: '160px' }}
                        type="number"
                        step="0.01"
                        placeholder="Min CGPA"
                        value={minCgpaFilter}
                        onChange={(e) => setMinCgpaFilter(e.target.value)}
                    />
                    <select
    className="search-input"
    value={sectionFilter}
    onChange={(e) =>
        setSectionFilter(e.target.value)
    }
>
    <option value="">
        All Sections
    </option>

    {sections.map((sec) => (
        <option
            key={sec.id}
            value={sec.id}
        >
            {sec.section_name}
        </option>
    ))}
</select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
    <button
        className="btn btn-primary"
        onClick={exportToExcel}
    >
        📥 Export Excel
    </button>

    <button
        className="btn btn-success"
        onClick={handleAddNew}
    >
        + Add Student
    </button>
</div>
            </div>

            {showForm && (
                <div className="table-wrapper" style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '15px' }}>{isEditing ? 'Edit Student' : 'Add Student'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>CGPA</label>
                                <input type="number" step="0.01" min="0" max="10" name="cgpa" value={form.cgpa} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Arrears</label>
                                <input type="number" min="0" name="arrears" value={form.arrears} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Section</label>
                                <select name="section_id" value={form.section_id} onChange={handleChange}>
                                    <option value="">-- Select Section --</option>
                                    {sections.map((sec) => (
                                        <option key={sec.id} value={sec.id}>{sec.section_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Save'}</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            )}

            <div className="table-wrapper">
            <div
    style={{
        marginBottom: '15px',
        fontWeight: '600'
    }}
>
    Showing {filteredStudents.length} Students
</div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>CGPA</th>
                            <th>Arrears</th>
                            <th>Section</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr><td colSpan="9">No students found.</td></tr>
                        ) : (
                            filteredStudents.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.gender}</td>
                                    <td>{s.cgpa}</td>
                                    <td>{s.arrears}</td>
                                    <td>{s.section_name || '-'}</td>
                                    <td>{s.email || '-'}</td>
                                    <td>{s.phone || '-'}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Students;
