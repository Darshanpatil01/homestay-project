import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import {
  addToWishlist,
  checkWishlistStatus,
  removeFromWishlist,
} from "../../services/wishlistService";

import {
  getLoggedInUser,
  isAuthenticated,
} from "../../utils/authStorage";

import { getApiErrorMessage } from "../../utils/apiError";

import "../../styles/wishlistButton.css";

function WishlistButton({
  homestayId,
  homestayName = "homestay",
  showText = false,
  className = "",
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    let componentActive = true;

    const loadWishlistStatus = async () => {
      const user = getLoggedInUser();

      if (
        !isAuthenticated() ||
        user?.role !== "USER"
      ) {
        return;
      }

      try {
        const response =
          await checkWishlistStatus(
            homestayId
          );

        if (componentActive) {
          setSaved(Boolean(response.saved));
        }
      } catch (error) {
        console.error(
          "Unable to check wishlist status:",
          error
        );
      }
    };

    loadWishlistStatus();

    return () => {
      componentActive = false;
    };
  }, [homestayId]);

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const user = getLoggedInUser();

    if (!isAuthenticated()) {
      window.alert(
        "Please sign in from the homepage to use your wishlist."
      );
      return;
    }

    if (user?.role !== "USER") {
      window.alert(
        "Wishlist is available only for traveller accounts."
      );
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        await removeFromWishlist(
          homestayId
        );

        setSaved(false);
      } else {
        await addToWishlist(
          homestayId
        );

        setSaved(true);
      }
    } catch (error) {
      window.alert(
        getApiErrorMessage(
          error,
          "Unable to update your wishlist."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-api-button ${
        saved ? "saved" : ""
      } ${className}`}
      onClick={handleWishlist}
      disabled={loading}
      aria-label={
        saved
          ? `Remove ${homestayName} from wishlist`
          : `Add ${homestayName} to wishlist`
      }
      title={
        saved
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
    >
      <Heart
        size={20}
        fill={saved ? "currentColor" : "none"}
      />

      {showText && (
        <span>
          {loading
            ? "Please wait..."
            : saved
            ? "Saved"
            : "Save"}
        </span>
      )}
    </button>
  );
}

export default WishlistButton;