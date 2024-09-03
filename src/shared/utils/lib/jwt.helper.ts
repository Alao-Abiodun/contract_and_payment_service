import { config as enviromentConfig } from 'src/shared/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

/**
 *
 * @param payload the data to be encoded in the token
 * @param expiresIn the time the token will expire
 * @returns
 */
export const generateJwtToken = (
  payload: any,
  expiresIn: string,
): string | boolean => {
  try {
    return jwt.sign(payload, String(enviromentConfig.jwtSecret), {
      expiresIn,
    });
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

/**
 * Verify if token is valid and not expired
 * @param token the authentication token
 * @returns boolean | object
 */
export const verifyJwtToken = (
  token: string,
): string | boolean | JwtPayload => {
  try {
    return jwt.verify(token, String(process.env.JWT_SECRET));
  } catch (err) {
    return false;
  }
};
