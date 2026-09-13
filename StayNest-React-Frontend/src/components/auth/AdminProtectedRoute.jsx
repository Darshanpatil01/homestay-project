import RoleProtectedRoute from "./RoleProtectedRoute.jsx";

function AdminProtectedRoute({ children }) {
  return (
    <RoleProtectedRoute
      allowedRoles={["ADMIN"]}
      redirectTo="/admin"
    >
      {children}
    </RoleProtectedRoute>
  );
}

export default AdminProtectedRoute;