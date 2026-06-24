    import DashboardIcon from "@mui/icons-material/Dashboard";
    import PeopleIcon from "@mui/icons-material/People";
    import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
    import SchoolIcon from "@mui/icons-material/School";

    export const getNavigation = () => [
    {
        segment: "dashboard",
        title: "Dashboard",
        icon: <DashboardIcon />,
    },
    {
        segment: "users",
        title: "Users",
        icon: <PeopleIcon />,
    },
    {
        segment: "pending-users",
        title: "Pending Users",
        icon: <VerifiedUserIcon />,
    },
    ];