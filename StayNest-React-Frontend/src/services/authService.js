import apiClient from "../api/apiClient";

export async function registerUser(registrationData) {
  const response = await apiClient.post(
    "/auth/register",
    registrationData
  );

  return response.data;
}

export async function loginUser(loginData) {
  const response = await apiClient.post(
    "/auth/login",
    loginData
  );

  return response.data;
}

export async function loginClient(loginData) {
  const response = await apiClient.post(
    "/auth/client/login",
    loginData
  );

  return response.data;
}

export async function loginAdmin(loginData) {
  const response = await apiClient.post(
    "/auth/admin/login",
    loginData
  );

  return response.data;
}