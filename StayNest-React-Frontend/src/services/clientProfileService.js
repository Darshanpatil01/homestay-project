import apiClient from "../api/apiClient";

export const getClientProfile = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};

export const updateClientProfile = async (profileData) => {
  const response = await apiClient.put(
    "/users/profile",
    profileData
  );

  return response.data;
};

export const changeClientPassword = async (passwordData) => {
  const response = await apiClient.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};