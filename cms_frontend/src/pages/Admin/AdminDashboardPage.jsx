import React, { useState } from 'react';
import AdminSidebar from '../../elements/Admin/AdminSidebar';

const ViewStaff = () => <div className="p-3"><h3>Staff List</h3><p>[Placeholder for staff grid]</p></div>;
const AddStaff = () => <div className="p-3"><h3>Add New Staff</h3><p>[Placeholder for add staff form]</p></div>;
const UpdateStaff = () => <div className="p-3"><h3>Update Staff</h3><p>[Placeholder for update form]</p></div>;

const AdminDashboardPage = () => {
  const [selectedSection, setSelectedSection] = useState('view');

  let SectionComponent;
  if (selectedSection === 'view') SectionComponent = <ViewStaff />;
  else if (selectedSection === 'add') SectionComponent = <AddStaff />;
  else if (selectedSection === 'update') SectionComponent = <UpdateStaff />;

  return (
    <div className="d-flex">
      <AdminSidebar selected={selectedSection} onSelectSection={setSelectedSection} />
      <main style={{ flex: 1 }}>{SectionComponent}</main>
    </div>
  );
};

export default AdminDashboardPage;
