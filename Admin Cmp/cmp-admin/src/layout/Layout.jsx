import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createTheme } from "@mui/material/styles";

import { getNavigation } from "./GetNavigation.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { FiLogOut } from "react-icons/fi";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f0f",
      paper: "#161616",
    },
  },
});

function ThemedToast() {
  return <ToastContainer theme="dark" position="top-center" autoClose={3000} />;
}

function Layout() {
  const { user, logout } = useAuth();

  const Navigation = getNavigation(user);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
     navigate("/", { replace: true });
  };

  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  return (
    <AppProvider
      theme={darkTheme}
      navigation={Navigation}
      router={router}
      branding={{
        title: "Campus MarketPlace Admin",
        logo: <></>
      }}
    >
      <ThemedToast />

      <DashboardLayout
        navigation={Navigation}
        router={router}
        slots={{
          sidebarFooter: ({ mini }) => (
            <button
              onClick={handleLogout}
              className={`sidebar-logout-btn ${mini ? "mini" : ""}`}
            >
              <FiLogOut size={18} />
              {!mini && <span>Sign Out</span>}
            </button>
          ),
        }}
      >
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
