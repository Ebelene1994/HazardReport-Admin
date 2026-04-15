import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardProvider } from "./context/DashboardContext";
import ErrorPage from "./errorpage";
import DashboardLayout from "./layouts/dashBoardLayout";
import AdminLogin from "./pages/AdminLogin";
import Announcements from "./pages/Announcements";
import ContentModeration from "./pages/ContentModeration";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";



function App() {
    const router = createBrowserRouter([
        {
            path: "/admin-login",
            element: <AdminLogin />,
        },
        {
            path: "/admin-dashboard",
            element: (
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    index: true,
                    element: <Dashboard />,
                },
                {
                    path: "moderation",
                    element: <ContentModeration />,
                },
                {
                    path: "announcements",
                    element: <Announcements />,
                },
                {
                    path: "users",
                    element: <UserManagement />,
                },
                {
                    path: "settings",
                    element: <Settings />,
                },
            ],
        },
        {
            path: "*",
            element: <ErrorPage />
        },
        {
            path: "/",
            element: <Navigate to="/admin-login" replace />
        }
    ]);

    return (
        <DashboardProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </DashboardProvider>
    );
};

export default App;