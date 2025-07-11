export const apiResponse = (status, data, message = '') => {
  return {
    status: status ? 'success' : 'error',
    statusCode: status ? 200 : 400,
    message: message || (status ? 'Request successful' : 'Request failed'),
    data: data || null,
    timestamp: new Date().toISOString()
  };
};