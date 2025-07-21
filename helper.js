export const apiResponse = (status, data = null, message = '') => {
  // Validate status code (ensure it’s a number and a valid HTTP status)
  if (!Number.isInteger(status) || status < 100 || status > 599) {
    throw new Error('Invalid HTTP status code');
  }

  // Determine success based on 2xx range
  const isSuccess = status >= 200 && status < 300;

  // Default messages based on status code range
  const defaultMessage = message || (isSuccess
    ? 'Request successful'
    : status >= 400 && status < 500
      ? 'Client error'
      : 'Server error');

  return {
    success: isSuccess,
    statusCode: status,
    message: defaultMessage,
    data: data ?? null, // Ensure null if data is undefined
    timestamp: new Date().toISOString(),
  };
};


