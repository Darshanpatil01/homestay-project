export function getApiErrorMessage(
  error,
  fallbackMessage = "Something went wrong. Please try again."
) {
  if (!error) {
    return fallbackMessage;
  }

  if (error.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Make sure the backend is running.";
  }

  const responseData = error.response.data;

  if (responseData?.validationErrors) {
    const messages = Object.values(
      responseData.validationErrors
    );

    if (messages.length > 0) {
      return messages[0];
    }
  }

  return responseData?.message || fallbackMessage;
}

export function getValidationErrors(error) {
  return error?.response?.data?.validationErrors || {};
}