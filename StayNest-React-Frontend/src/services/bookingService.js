import apiClient from "../api/apiClient";

export async function createBooking(
  bookingData
) {
  const response = await apiClient.post(
    "/bookings",
    bookingData
  );

  return response.data;
}

export async function getMyBookings() {
  const response = await apiClient.get(
    "/bookings/my"
  );

  return response.data;
}

export async function getMyBookingById(
  bookingId
) {
  const response = await apiClient.get(
    `/bookings/${bookingId}`
  );

  return response.data;
}

export async function cancelBooking(
  bookingId
) {
  const response = await apiClient.patch(
    `/bookings/${bookingId}/cancel`
  );

  return response.data;
}