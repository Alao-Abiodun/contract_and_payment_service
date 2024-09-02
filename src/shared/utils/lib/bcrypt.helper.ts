import * as argon2 from 'argon2';

/**
 * Argon2 helper to hash password
 * @param password password to be hashed
 * @return the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

/**
 * Argon2 helper to compare hashed password
 * @param password password to be compared
 * @param hashedPassword hashed password
 * @return boolean
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await argon2.verify(hashedPassword, password);
};
