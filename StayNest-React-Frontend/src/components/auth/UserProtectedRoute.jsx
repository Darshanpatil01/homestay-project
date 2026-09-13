import RoleProtectedRoute from "./RoleProtectedRoute.jsx";

function UserProtectedRoute({ children }) {
  return (
    <RoleProtectedRoute
      allowedRoles={["USER"]}
      redirectTo="/"
    >
      {children}
    </RoleProtectedRoute>
  );
}

export default UserProtectedRoute;