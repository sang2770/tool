import { HttpStatus } from '@nestjs/common';

export class ResponseWrapper<T> {
  data: T;

  success: boolean = true;

  message: string;

  code: number;

  constructor(
    data: T,
    message: string,
    statusCode: number,
    success: boolean = true
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = statusCode;
    for (const key in this) {
      if (!this[key]) {
        delete this[key];
      }
    }
  }

  public static ok<U>(data: U): ResponseWrapper<U> {
    return new ResponseWrapper<U>(data, '', HttpStatus.OK);
  }

  public static fail<U>(
    message: string,
    statusCode: number
  ): ResponseWrapper<U> {
    return new ResponseWrapper<U>(null, message, statusCode, false);
  }
}

export class PageResponseWrapper<T> {
  dataList: T[];
  page: number;
  pageSize: number;
  total: number;

  constructor(data: T[], page: number, pageSize: number, total: number) {
    this.dataList = data;
    this.page = page;
    this.pageSize = pageSize;
    this.total = total;
  }
}
