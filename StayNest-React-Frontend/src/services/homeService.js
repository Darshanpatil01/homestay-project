import apiClient from "../api/apiClient";

export async function getHomepageData() {
  const [
    settingsResponse,
    destinationsResponse,
    homestaysResponse,
    categoriesResponse,
    experiencesResponse,
    benefitsResponse,
    testimonialsResponse,
  ] = await Promise.all([
    apiClient.get("/website/settings"),
    apiClient.get("/destinations"),
    apiClient.get("/homestays/featured"),
    apiClient.get("/categories"),
    apiClient.get("/experiences"),
    apiClient.get("/benefits"),
    apiClient.get("/testimonials"),
  ]);

  return {
    settings: settingsResponse.data,
    destinations: destinationsResponse.data,
    homestays: homestaysResponse.data,
    categories: categoriesResponse.data,
    experiences: experiencesResponse.data,
    benefits: benefitsResponse.data,
    testimonials: testimonialsResponse.data,
  };
}