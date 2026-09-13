import apiClient from "../api/apiClient";

export async function getPublicWebsiteSettings() {
  const response = await apiClient.get(
    "/website/settings"
  );

  return response.data;
}

export async function getClientWebsiteSettings() {
  const response = await apiClient.get(
    "/client/website/settings"
  );

  return response.data;
}

export async function updateWebsiteSettings(
  websiteData
) {
  const response = await apiClient.put(
    "/client/website/settings",
    websiteData
  );

  return response.data;
}

export async function createNavigationLink(
  navigationData
) {
  const response = await apiClient.post(
    "/client/navigation-links",
    navigationData
  );

  return response.data;
}

export async function updateNavigationLink(
  navigationId,
  navigationData
) {
  const response = await apiClient.put(
    `/client/navigation-links/${navigationId}`,
    navigationData
  );

  return response.data;
}

export async function deleteNavigationLink(
  navigationId
) {
  await apiClient.delete(
    `/client/navigation-links/${navigationId}`
  );
}