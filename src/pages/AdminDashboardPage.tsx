import React from "react";
import UserTable from "../components/Admin/UserTable";
import EventTable from "../components/Admin/EventTable";
import GuestTable from "../components/Admin/GuestTable";
import MessageTable from "../components/Admin/MessageTable";
import "../styles/table.css"; // Import table styles

const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Users</h2>
        {/* Add Create User Button/Modal Trigger here later */}
        <UserTable />
      </section>

      <section>
        <h2>Events</h2>
        {/* Add Create Event Button/Modal Trigger here later */}
        <EventTable />
      </section>

      <section>
        <h2>Guest Entries</h2>
        {/* Admin doesn't typically create guests directly via dashboard */}
        <GuestTable />
      </section>

      <section>
        <h2>Messages</h2>
        {/* Admin doesn't typically create messages directly via dashboard */}
        <MessageTable />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
