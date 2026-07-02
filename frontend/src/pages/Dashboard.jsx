import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [eligibleStudents, setEligibleStudents] = useState([]);

    const [minCgpa, setMinCgpa] = useState('7.5');
    const [maxArrears, setMaxArrears] = useState('0');
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            const [studentsRes, sectionsRes] = await Promise.all([
                api.get('/students'),
                api.get('/sections')
            ]);

            setStudents(studentsRes.data);
            setSections(sectionsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckEligibility = async () => {
        setLoading(true);

        try {
            const res = await api.get('/students/eligible', {
                params: {
                    cgpa: minCgpa,
                    arrears: maxArrears
                }
            });

            setEligibleStudents(res.data);
            setHasSearched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const avgCgpa = students.length
        ? (
              students.reduce(
                  (sum, s) => sum + parseFloat(s.cgpa),
                  0
              ) / students.length
           ).toFixed(2)
        : '0.00';

    const placementRate = students.length
        ? Math.round(
              (eligibleStudents.length / students.length) * 100
          )
        : 0;
    
    const eligibleCount = eligibleStudents.length;
const notEligibleCount =
  students.length - eligibleCount;

const pieData = [
  {
    name: 'Eligible',
    value: eligibleCount
  },
  {
    name: 'Not Eligible',
    value: notEligibleCount
  }
];

const sectionData = sections.map((section) => ({
  name: section.name,
  students: students.filter(
    (s) => s.section_id === section.id
  ).length
}));

const COLORS = ['#10b981', '#ef4444'];    
    const maleStudents = students.filter(
    s => s.gender === 'Male'
).length;

const femaleStudents = students.filter(
    s => s.gender === 'Female'
).length;

    return (
        <Layout>
            <div className="welcome-banner">
    <div>
        <h1>👋 Welcome Admin</h1>
        <p>
            Manage students, track eligibility,
            and generate placement reports.
        </p>
    </div>
</div>
            <h2 className="dashboard-title">
                📊 Placement Analytics Dashboard
            </h2>

            <div className="stats-row">
                <div className="stat-card">
                    <span>👨‍🎓</span>
                    <h3>Total Students</h3>
                    <p>{students.length}</p>
                </div>
                
                <div className="stat-card">
    <h3>Male Students</h3>
    <p>{maleStudents}</p>
</div>

<div className="stat-card">
    <h3>Female Students</h3>
    <p>{femaleStudents}</p>
</div>

                <div className="stat-card">
                    <span>🏫</span>
                    <h3>Sections</h3>
                    <p>{sections.length}</p>
                </div>

                <div className="stat-card">
                    <span>📚</span>
                    <h3>Average CGPA</h3>
                    <p>{avgCgpa}</p>
                </div>

                <div className="stat-card">
                    <span>✅</span>
                    <h3>Eligible</h3>
                    <p>{hasSearched ? eligibleStudents.length : 0}</p>
                </div>
            </div>

            <div className="analytics-banner">
                <div>
                    <h2>Placement Readiness Overview</h2>
                    <p>
                        Track student eligibility, academic performance,
                        and placement readiness across sections.
                    </p>
                </div>

                <div className="rate-box">
                    <h3>{placementRate}%</h3>
                    <p>Placement Rate</p>
                </div>
            </div>
             
            <div className="charts-grid">

  <div className="chart-card">
    <h3>📊 Eligibility Distribution</h3>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={100}
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-card">
    <h3>🏫 Students Per Section</h3>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={sectionData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="students"
          fill="#3b82f6"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div> 

            <div className="eligibility-box">
                <h3>🎯 Eligibility Checker</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label>Minimum CGPA</label>
                        <input
                            type="number"
                            step="0.01"
                            value={minCgpa}
                            onChange={(e) =>
                                setMinCgpa(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Arrears</label>
                        <input
                            type="number"
                            value={maxArrears}
                            onChange={(e) =>
                                setMaxArrears(e.target.value)
                            }
                        />
                    </div>

                    <div
                        className="form-group"
                        style={{
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}
                    >
                        <button
                            className="btn btn-primary"
                            onClick={handleCheckEligibility}
                            disabled={loading}
                        >
                            {loading
                                ? 'Checking...'
                                : 'Check Eligibility'}
                        </button>
                    </div>
                </div>

                {hasSearched && (
                    <div className="table-wrapper">
                        <h3>
                            Eligible Students (
                            {eligibleStudents.length})
                        </h3>

                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>CGPA</th>
                                    <th>Arrears</th>
                                    <th>Section</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {eligibleStudents.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.cgpa}</td>
                                        <td>{s.arrears}</td>
                                        <td>
                                            {s.section_name || '-'}
                                        </td>
                                        <td>
                                            <span className="badge badge-success">
                                                Eligible
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Dashboard;