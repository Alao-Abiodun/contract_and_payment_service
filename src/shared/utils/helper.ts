import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import crypto from 'crypto';
import { config } from 'src/shared/config';
import * as jwt from 'jsonwebtoken';
import { PaginationDto } from './dtos/pagination';
import { CustomerData, SiteData } from '../types/types';

export const handleErrorCatch = (err) => {
  if (
    err.status === HttpStatus.NOT_FOUND ||
    err.status === HttpStatus.BAD_REQUEST ||
    err.status === HttpStatus.UNAUTHORIZED
  ) {
    throw new HttpException(
      {
        status: err.status,
        error: err.message,
        message: err.message,
      },
      err.status,
    );
  }
  throw new HttpException(
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: `An error occured on the server`,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

export const generateToken = (userData) => {
  try {
    const jwtExpirySeconds = 604800;
    return jwt.sign(userData, config.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds,
    });
  } catch (err) {
    Logger.log(err.message);
    return null;
  }
};

export const generateBasePaymentId = (transporterName: string): string => {
  const name: string = transporterName.split(' ').join('').slice(0, 10);
  return `${name.toUpperCase()}`;
};

export const getCurrentDateTime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  return formattedDate;
};
