import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const apiLink =
      '<a href="/api-doc" style="color: blue; text-decoration: underline;">Click this link to see the API</a>';
    return `${apiLink}`;
  }
}
