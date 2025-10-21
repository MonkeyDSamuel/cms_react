import React from 'react';

const AdminDashboard = () => {
  // Mock data for stats/cards
  const stats = [
    { title: "Total Patients", value: 120 },
    { title: "Total Doctors", value: 9 },
    { title: "Appointments Today", value: 15 },
  ];

  return (
    <div className="container mt-4">
      <h2>Welcome, Admin</h2>
      <div className="row">
        {stats.map((stat, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card text-center shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">{stat.title}</h5>
                <p className="card-text display-4">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;