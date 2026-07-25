import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadDetails from "./pages/LeadDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Public Routes - With Navbar */}
            <Route
              path="/*"
              element={
                <div className="public-layout">
                  <Navbar />
                  <main className="app-main">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      {/* Admin Routes - With Navbar */}
                      <Route
                        path="admin/*"
                        element={
                          <div className="admin-layout">
                            <Routes>
                              <Route path="login" element={<Login />} />
                              <Route
                                path="dashboard"
                                element={
                                  <ProtectedRoute>
                                    <Dashboard />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="leads/:id"
                                element={
                                  <ProtectedRoute>
                                    <LeadDetails />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="*"
                                element={<Navigate to="login" replace />}
                              />
                            </Routes>
                          </div>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
