import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

// validating environment variables
const schema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'staging')
      .required(),
    // database configs
    DB_HOST: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_PORT: joi.number().port().required().default(5432),
    EXP_URL: joi.string().required(),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),
  })
  .unknown()
  .required();

const { error, value: envVars } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  isDevelopment:
    envVars.NODE_ENV === 'development' || envVars.NODE_ENV === 'staging'
      ? true
      : false,
  isLocahost: envVars.NODE_ENV === 'development' ? true : false,
  port: {
    http: envVars.PORT,
  },
  NODE_ENV: envVars.NODE_ENV,
  exp_token: envVars.EXP_TOKEN,
  db: {
    port: envVars.DB_PORT,
    host: envVars.DB_HOST,
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
    logging: envVars.DATABASE_LOGGING,
  },
  jwtSecret: envVars.JWT_SECRET,
  expeditorUrl: envVars.EXP_URL,
};
