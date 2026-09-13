import {
  useEffect,
  useState,
} from "react";

function useLocalStorageState(
  storageKey,
  initialValue
) {
  const [state, setState] = useState(() => {
    try {
      const storedValue =
        localStorage.getItem(storageKey);

      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(
        `Unable to read ${storageKey} from localStorage:`,
        error
      );
    }

    return typeof initialValue === "function"
      ? initialValue()
      : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error(
        `Unable to save ${storageKey} to localStorage:`,
        error
      );
    }
  }, [storageKey, state]);

  return [state, setState];
}

export default useLocalStorageState;