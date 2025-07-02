export const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded
      ? forwarded.split(',')[0].trim() // first in list
      : req.connection.remoteAddress;
  };

  
  