import apiClient from "../api/apiClient";

export async function getPublicDestinations() {
  const response = await apiClient.get(
    "/destinations"
  );

  return response.data;
}

export async function getDestinationById(id) {
  const response = await apiClient.get(
    `/destinations/${id}`
  );

  return response.data;
}