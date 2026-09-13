import RoleProtectedRoute from "./RoleProtectedRoute.jsx";

function ClientProtectedRoute({ children }) {
  return (
    <RoleProtectedRoute
      allowedRoles={["CLIENT"]}
      redirectTo="/client/login"
    >
      {children}
    </RoleProtectedRoute>
  );
}

export default ClientProtectedRoute;