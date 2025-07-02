import bcrypt from "bcrypt";

/**
 * Generate a secure hashed password (not used for login but required by schema).
 * @param {string} raw - A fallback UID or random string
 * @returns {Promise<string>}
 */


const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error("Error hashing password: " + error.message);
  }
};
export default hashPassword;
