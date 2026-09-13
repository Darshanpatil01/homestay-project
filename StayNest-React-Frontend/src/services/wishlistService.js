import apiClient from "../api/apiClient";

export async function getMyWishlist() {
  const response = await apiClient.get(
    "/wishlist"
  );

  return response.data;
}

export async function addToWishlist(
  homestayId
) {
  const response = await apiClient.post(
    "/wishlist",
    {
      homestayId: Number(homestayId),
    }
  );

  return response.data;
}

export async function removeFromWishlist(
  homestayId
) {
  await apiClient.delete(
    `/wishlist/${homestayId}`
  );
}

export async function checkWishlistStatus(
  homestayId
) {
  const response = await apiClient.get(
    `/wishlist/check/${homestayId}`
  );

  return response.data;
}