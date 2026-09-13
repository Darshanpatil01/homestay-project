import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  hasRole,
  isAuthenticated,
} from "../../utils/authStorage";

function RoleProtectedRoute({
  allowedRoles = [],
  redirectTo = "/",
  children,
}) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname,
          reason: "LOGIN_REQUIRED",
        }}
      />
    );
  }

  if (!hasRole(allowedRoles)) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          reason: "ACCESS_DENIED",
        }}
      />
    );
  }

  return children;
}

export default RoleProtectedRoute;