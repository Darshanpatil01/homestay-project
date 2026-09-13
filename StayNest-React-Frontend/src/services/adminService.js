import apiClient from "../api/apiClient";

export const getAdminDashboard = async () => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

export const updateAdminUserStatus = async (
  userId,
  status
) => {
  const response = await apiClient.patch(
    `/admin/users/${userId}/status`,
    { status }
  );

  return response.data;
};

export const getAdminHomestays = async () => {
  const response = await apiClient.get("/admin/homestays");
  return response.data;
};

export const getAdminBookings = async () => {
  const response = await apiClient.get("/admin/bookings");
  return response.data;
};

export const updateAdminBookingStatus = async (
  bookingId,
  status
) => {
  const response = await apiClient.patch(
    `/admin/bookings/${bookingId}/status`,
    { status }
  );

  return response.data;
};