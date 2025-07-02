const validateEnv = () => {
    const errors = [];
  
    if (!process.env.PORT) errors.push("PORT is required");
    else if (isNaN(Number(process.env.PORT))) errors.push("PORT must be a number");
  
    if (!process.env.MONGO_URI) errors.push("MONGO_URI is required");
  
    if (!process.env.JWT_SECRET) errors.push("JWT_SECRET is required");
    else if (process.env.JWT_SECRET.length < 32)
      errors.push("JWT_SECRET should be at least 32 characters long");
  
    if (errors.length > 0) {
      console.error(errors.join(", "));
      process.exit(1);
    }
  };


  export default validateEnv;
  