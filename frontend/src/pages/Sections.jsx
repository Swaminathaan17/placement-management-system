import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

function Sections() {
    const [sections, setSections] = useState([]);
    const [sectionName, setSectionName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await api.get('/sections');
            setSections(res.data);
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!sectionName.trim()) return;

        try {
            await api.post('/sections', { section_name: sectionName.trim() });
            setSectionName('');
            fetchSections();
        } catch (err) {
            console.error('Error adding section:', err);
            alert(err.response?.data?.error || 'Error adding section');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this section? Students in this section will become unassigned.')) return;

        try {
            await api.delete(`/sections/${id}`);
            fetchSections();
        } catch (err) {
            console.error('Error deleting section:', err);
        }
    };

    const startEdit = (section) => {
        setEditingId(section.id);
        setEditingName(section.section_name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const saveEdit = async (id) => {
        try {
            await api.put(`/sections/${id}`, { section_name: editingName.trim() });
            setEditingId(null);
            setEditingName('');
            fetchSections();
        } catch (err) {
            console.error('Error updating section:', err);
        }
    };

    return (
        <Layout>
            <h1 className="page-title">Sections</h1>

            <div className="table-wrapper" style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Add Section</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="e.g. CSE A"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-success">Add</button>
                </form>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Section Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.length === 0 ? (
                            <tr><td colSpan="3">No sections found.</td></tr>
                        ) : (
                            sections.map((sec) => (
                                <tr key={sec.id}>
                                    <td>{sec.id}</td>
                                    <td>
                                        {editingId === sec.id ? (
                                            <input
                                                className="search-input"
                                                style={{ minWidth: '160px' }}
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                            />
                                        ) : (
                                            sec.section_name
                                        )}
                                    </td>
                                    <td>
                                        {editingId === sec.id ? (
                                            <>
                                                <button className="btn btn-primary" onClick={() => saveEdit(sec.id)}>Save</button>
                                                <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary" onClick={() => startEdit(sec)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(sec.id)}>Delete</button>
                                            </>
                                        )}
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

export default Sections;
