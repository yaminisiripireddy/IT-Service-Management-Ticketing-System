import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import TicketDetails from "./pages/TicketDetails";
import CreateTicket from "./pages/CreateTicket";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

import VerifyRegistration from "./pages/VerifyRegistration";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <div className="app-main">{children}</div>;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="app-main">{children}</div>;
}

function AppContent() {
  const location = useLocation();

  const token = Boolean(
    localStorage.getItem("token")
  );

  const authPages = [
    "/login",
    "/register",
    "/verify-registration",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthPage = authPages.includes(
    location.pathname
  );

  return (
    <>
      {token && !isAuthPage && <Navbar />}

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/verify-registration"
          element={<VerifyRegistration />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* APPLICATION */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                token
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;