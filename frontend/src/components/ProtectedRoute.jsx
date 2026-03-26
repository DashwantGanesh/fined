import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ✅ Protect routes by role
// usage: <ProtectedRoute role="bank"> or <ProtectedRoute role="recipient">
export default function ProtectedRoute({ children, role }) {
  const { user } = useSelector((store) => store.auth);

  // Not logged in at all → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect appropriately
  if (role && user.role !== role) {
    if (user.role === "bank") return <Navigate to="/bank/loans" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}