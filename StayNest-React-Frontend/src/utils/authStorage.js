const TOKEN_KEY =
  "staynest-access-token";

const ACCOUNT_KEY =
  "staynest-authenticated-account";

export const normalizeRole = (
  role = ""
) => {
  return String(role)
    .trim()
    .toUpperCase()
    .replace("ROLE_", "");
};

const extractToken = (
  authenticationResponse = {}
) => {
  return (
    authenticationResponse.token ||
    authenticationResponse.accessToken ||
    authenticationResponse.jwtToken ||
    authenticationResponse.jwt ||
    ""
  );
};

const createAccount = (
  authenticationResponse = {}
) => {
  const sourceAccount =
    authenticationResponse.user ||
    authenticationResponse.account ||
    authenticationResponse;

  return {
    id:
      sourceAccount.userId ||
      sourceAccount.id ||
      authenticationResponse.userId ||
      authenticationResponse.id ||
      null,

    fullName:
      sourceAccount.fullName ||
      sourceAccount.name ||
      authenticationResponse.fullName ||
      authenticationResponse.name ||
      "",

    email:
      sourceAccount.email ||
      authenticationResponse.email ||
      "",

    phone:
      sourceAccount.phone ||
      authenticationResponse.phone ||
      "",

    role: normalizeRole(
      sourceAccount.role ||
        authenticationResponse.role
    ),

    status:
      sourceAccount.status ||
      authenticationResponse.status ||
      "ACTIVE",
  };
};

export const saveAuthentication = (
  authenticationResponse = {}
) => {
  clearAuthentication();

  const token = extractToken(
    authenticationResponse
  );

  if (!token) {
    throw new Error(
      "Authentication token is missing from the login response."
    );
  }

  const account = createAccount(
    authenticationResponse
  );

  if (!account.role) {
    throw new Error(
      "Account role is missing from the login response."
    );
  }

  localStorage.setItem(
    TOKEN_KEY,
    token
  );

  localStorage.setItem(
    ACCOUNT_KEY,
    JSON.stringify(account)
  );

  return account;
};
export const saveAuthenticatedAccount = (
  authenticationResponse = {}
) => {
  return saveAuthentication(
    authenticationResponse
  );
};

export const getAccessToken = () => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("token") ||
    ""
  );
};

export const getToken = () => {
  return getAccessToken();
};

export const getAuthenticatedAccount = () => {
  const storedAccount =
    localStorage.getItem(ACCOUNT_KEY);

  if (!storedAccount) {
    return null;
  }

  try {
    return JSON.parse(storedAccount);
  } catch {
    clearAuthentication();
    return null;
  }
};

/*
 * Used by BookingPage and other older user pages.
 */
export const getLoggedInUser = () => {
  return getAuthenticatedAccount();
};

export const getCurrentUser = () => {
  return getAuthenticatedAccount();
};

export const getAuthenticatedRole = () => {
  const account =
    getAuthenticatedAccount();

  return normalizeRole(account?.role);
};

export const isAuthenticated = () => {
  return Boolean(
    getAccessToken() &&
      getAuthenticatedAccount()
  );
};

export const hasRole = (
  allowedRoles = []
) => {
  if (!isAuthenticated()) {
    return false;
  }

  const currentRole =
    getAuthenticatedRole();

  const normalizedAllowedRoles =
    allowedRoles.map((role) =>
      normalizeRole(role)
    );

  return normalizedAllowedRoles.includes(
    currentRole
  );
};

export const clearAuthentication = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACCOUNT_KEY);

  localStorage.removeItem("token");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("staynest-role");
  localStorage.removeItem(
    "staynest-refresh-token"
  );
};

export const removeAuthenticatedAccount =
  () => {
    clearAuthentication();
  };

export const clearAuthenticatedAccount =
  () => {
    clearAuthentication();
  };

export const logout = () => {
  clearAuthentication();
};