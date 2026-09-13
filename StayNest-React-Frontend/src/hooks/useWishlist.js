import { useEffect, useState } from "react";

const WISHLIST_STORAGE_KEY = "staynest-wishlist";

function readWishlist() {
  try {
    const storedWishlist = localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!storedWishlist) {
      return [];
    }

    const parsedWishlist = JSON.parse(storedWishlist);

    return Array.isArray(parsedWishlist)
      ? parsedWishlist
      : [];
  } catch (error) {
    console.error("Unable to read wishlist:", error);
    return [];
  }
}

function getItemId(item) {
  return typeof item === "object" ? item.id : item;
}

function useWishlist() {
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    const synchronizeWishlist = () => {
      setWishlist(readWishlist());
    };

    window.addEventListener(
      "storage",
      synchronizeWishlist
    );

    window.addEventListener(
      "staynest-wishlist-updated",
      synchronizeWishlist
    );

    return () => {
      window.removeEventListener(
        "storage",
        synchronizeWishlist
      );

      window.removeEventListener(
        "staynest-wishlist-updated",
        synchronizeWishlist
      );
    };
  }, []);

  const isWishlisted = (homestayId) => {
    return wishlist.some(
      (item) =>
        String(getItemId(item)) ===
        String(homestayId)
    );
  };

  const toggleWishlist = (homestay) => {
    const alreadyWishlisted = isWishlisted(
      homestay.id
    );

    const updatedWishlist = alreadyWishlisted
      ? wishlist.filter(
          (item) =>
            String(getItemId(item)) !==
            String(homestay.id)
        )
      : [...wishlist, homestay.id];

    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);

    window.dispatchEvent(
      new Event("staynest-wishlist-updated")
    );

    return !alreadyWishlisted;
  };

  return {
    wishlist,
    isWishlisted,
    toggleWishlist,
  };
}

export default useWishlist;