import apiClient from "../api/apiClient";

export async function getMyProfile() {
  const response = await apiClient.get(
    "/users/profile"
  );

  return response.data;
}

export async function updateMyProfile(
  profileData
) {
  const response = await apiClient.put(
    "/users/profile",
    profileData
  );

  return response.data;
}

export async function changeMyPassword(
  passwordData
) {
  const response = await apiClient.put(
    "/users/change-password",
    passwordData
  );

  return response.data;
}