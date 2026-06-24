import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import PendingUsers from "./pages/PendingUsers.jsx";
import CreateCollege from "./pages/CollegeCreate.jsx";
import Layout from "./layout/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* Dashboard Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/pending-users" element={<PendingUsers />} />
          <Route path="/create-college" element={<CreateCollege />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;