import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseWrapper } from '../model/response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  readonly blackList = ['password'];
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map(data => {
        return this.removeNullFields(data);
      }),
      map((data: T) => {
        return ResponseWrapper.ok(data);
      })
    );
  }

  private removeNullFields(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNullFields(item)).filter(Boolean);
    } else if (typeof obj === 'object' && !!obj) {
      return Object.entries(obj)
        .filter(([key, value]) => !!value && !this.blackList.includes(key))
        .reduce((acc, [key, value]) => {
          // console.log(key, value);
          if (new Date(value.toString()).toString() !== 'Invalid Date') {
            acc[key] = value;
          } else {
            acc[key] = this.removeNullFields(value);
          }
          return acc;
        }, {});
    }
    return obj;
  }
}
