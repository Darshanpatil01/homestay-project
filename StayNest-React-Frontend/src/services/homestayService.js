import apiClient from "../api/apiClient";

export async function getPublicHomestays(search = "") {
  const response = await apiClient.get(
    "/homestays",
    {
      params: search ? { search } : {},
    }
  );

  return response.data;
}

export async function getFeaturedHomestays() {
  const response = await apiClient.get(
    "/homestays/featured"
  );

  return response.data;
}

export async function getHomestayById(id) {
  const response = await apiClient.get(
    `/homestays/${id}`
  );

  return response.data;
}