import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./hooks/useAuth";

import { Splash } from "./pages/Splash";
import { Home } from "./pages/Home";
import Admin from "./pages/Admin";
import { Login } from "./pages/Login";

function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return null; 
  }

  return signed ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/busca" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;