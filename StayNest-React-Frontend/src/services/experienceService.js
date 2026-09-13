import apiClient from "../api/apiClient";

export async function getPublicExperiences() {
  const response = await apiClient.get(
    "/experiences"
  );

  return response.data;
}

export async function getExperienceById(id) {
  const response = await apiClient.get(
    `/experiences/${id}`
  );

  return response.data;
}