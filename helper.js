export const apiResponse = (status, data, message = '') => {
  return {
    success: !!status, // true if status is truthy
    status: status ? 'success' : 'error',
    statusCode: status ? 200 : 400,
    message: message || (status ? 'Request successful' : 'Request failed'),
     data ,
    timestamp: new Date().toISOString()
  };
};
