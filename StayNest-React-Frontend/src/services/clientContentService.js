import apiClient from "../api/apiClient";

/*
 * Load every content collection required by
 * the Client website editor.
 */
export async function getClientHomepageData() {
  const [
    settingsResponse,
    destinationsResponse,
    homestaysResponse,
    categoriesResponse,
    experiencesResponse,
    benefitsResponse,
    testimonialsResponse,
  ] = await Promise.all([
    apiClient.get("/client/website/settings"),
    apiClient.get("/client/destinations"),
    apiClient.get("/client/homestays"),
    apiClient.get("/client/categories"),
    apiClient.get("/client/experiences"),
    apiClient.get("/client/benefits"),
    apiClient.get("/client/testimonials"),
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

/*
 * Website settings
 */
export async function updateClientWebsiteSettings(
  settingsData
) {
  const response = await apiClient.put(
    "/client/website/settings",
    settingsData
  );

  return response.data;
}

/*
 * Navigation links
 */
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

/*
 * Destinations
 */
export async function createDestination(
  destinationData
) {
  const response = await apiClient.post(
    "/client/destinations",
    destinationData
  );

  return response.data;
}

export async function updateDestination(
  destinationId,
  destinationData
) {
  const response = await apiClient.put(
    `/client/destinations/${destinationId}`,
    destinationData
  );

  return response.data;
}

export async function deleteDestination(
  destinationId
) {
  await apiClient.delete(
    `/client/destinations/${destinationId}`
  );
}

/*
 * Homestays
 */
export async function createHomestay(
  homestayData
) {
  const response = await apiClient.post(
    "/client/homestays",
    homestayData
  );

  return response.data;
}

export async function updateHomestay(
  homestayId,
  homestayData
) {
  const response = await apiClient.put(
    `/client/homestays/${homestayId}`,
    homestayData
  );

  return response.data;
}

export async function deleteHomestay(
  homestayId
) {
  await apiClient.delete(
    `/client/homestays/${homestayId}`
  );
}

/*
 * Stay categories
 */
export async function createCategory(
  categoryData
) {
  const response = await apiClient.post(
    "/client/categories",
    categoryData
  );

  return response.data;
}

export async function updateCategory(
  categoryId,
  categoryData
) {
  const response = await apiClient.put(
    `/client/categories/${categoryId}`,
    categoryData
  );

  return response.data;
}

export async function deleteCategory(
  categoryId
) {
  await apiClient.delete(
    `/client/categories/${categoryId}`
  );
}

/*
 * Experiences
 */
export async function createExperience(
  experienceData
) {
  const response = await apiClient.post(
    "/client/experiences",
    experienceData
  );

  return response.data;
}

export async function updateExperience(
  experienceId,
  experienceData
) {
  const response = await apiClient.put(
    `/client/experiences/${experienceId}`,
    experienceData
  );

  return response.data;
}

export async function deleteExperience(
  experienceId
) {
  await apiClient.delete(
    `/client/experiences/${experienceId}`
  );
}

/*
 * Benefits / Why Choose Us
 */
export async function createBenefit(
  benefitData
) {
  const response = await apiClient.post(
    "/client/benefits",
    benefitData
  );

  return response.data;
}

export async function updateBenefit(
  benefitId,
  benefitData
) {
  const response = await apiClient.put(
    `/client/benefits/${benefitId}`,
    benefitData
  );

  return response.data;
}

export async function deleteBenefit(
  benefitId
) {
  await apiClient.delete(
    `/client/benefits/${benefitId}`
  );
}

/*
 * Testimonials
 */
export async function createTestimonial(
  testimonialData
) {
  const response = await apiClient.post(
    "/client/testimonials",
    testimonialData
  );

  return response.data;
}

export async function updateTestimonial(
  testimonialId,
  testimonialData
) {
  const response = await apiClient.put(
    `/client/testimonials/${testimonialId}`,
    testimonialData
  );

  return response.data;
}

export async function deleteTestimonial(
  testimonialId
) {
  await apiClient.delete(
    `/client/testimonials/${testimonialId}`
  );
}

/*
 * Image upload
 *
 * Allowed folders:
 * homestays
 * destinations
 * categories
 * experiences
 * testimonials
 * website
 * profiles
 */
export async function uploadClientImage(
  file,
  folder
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    `/client/uploads/${folder}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteClientImage(
  folder,
  fileName
) {
  await apiClient.delete(
    `/client/uploads/${folder}/${encodeURIComponent(
      fileName
    )}`
  );
}