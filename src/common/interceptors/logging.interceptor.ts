// Paste code từ phần Aspect interception của trang https://docs.nestjs.com/interceptors 
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger("API")

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // console.log('Before...');

        const now = Date.now();

        const { method, url } = context.switchToHttp().getRequest<Request>();

        return next
            .handle()
            .pipe(
                // tap: chạm, không thay đổi dữ liệu trả về, lỗi sẽ không bắt buộc
                // finalize: không thay đổi dữ liệu trả về, bắt được kể cả lỗi
                // map: thay đổi dữ liệu trả về, format
                finalize(() => this.logger.log(`${method} ${url} ${Date.now() - now}ms`)),
            );
    }
}
