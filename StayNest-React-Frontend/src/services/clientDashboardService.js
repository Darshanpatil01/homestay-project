import apiClient from "../api/apiClient";

export async function getClientDashboardData() {
  const [
    homestaysResponse,
    bookingsResponse,
  ] = await Promise.all([
    apiClient.get("/client/homestays"),
    apiClient.get("/client/bookings"),
  ]);

  const homestays = homestaysResponse.data;
  const bookings = bookingsResponse.data;

  const totalGuests = bookings
    .filter((booking) =>
      ["CONFIRMED", "COMPLETED"].includes(
        booking.status
      )
    )
    .reduce(
      (total, booking) =>
        total + Number(booking.guests || 0),
      0
    );

  return {
    homestays,
    bookings,
    statistics: {
      totalProperties: homestays.length,

      activeProperties: homestays.filter(
        (homestay) =>
          homestay.status === "ACTIVE"
      ).length,

      totalBookings: bookings.length,

      pendingBookings: bookings.filter(
        (booking) =>
          booking.status === "PENDING"
      ).length,

      confirmedBookings: bookings.filter(
        (booking) =>
          booking.status === "CONFIRMED"
      ).length,

      totalGuests,
    },

    recentBookings: bookings.slice(0, 5),
  };
}

export async function updateClientBookingStatus(
  bookingId,
  status
) {
  const response = await apiClient.patch(
    `/client/bookings/${bookingId}/status`,
    {
      status,
    }
  );

  return response.data;
}