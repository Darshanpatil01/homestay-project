import apiClient from "../api/apiClient";

export const getAdminProfile = async () => {
  const response = await apiClient.get(
    "/users/profile"
  );

  return response.data;
};

export const updateAdminProfile = async (
  profileData
) => {
  const response = await apiClient.put(
    "/users/profile",
    profileData
  );

  return response.data;
};

export const changeAdminPassword = async (
  passwordData
) => {
  const response = await apiClient.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
};