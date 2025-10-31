// Paste code từ phần Aspect interception của trang https://docs.nestjs.com/interceptors 
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { MESSAGE_RESPONSE } from '../decorators/message-response.decorator';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {

    constructor(private refector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // console.log('Before...');

        // const now = Date.now();

        const { statusCode } = context.switchToHttp().getResponse<Response>();

        return next
            .handle()
            .pipe(
                // tap (from 'rxjs/operators'): chạm, không thay đổi dữ liệu trả về, lỗi sẽ không bắt buộc
                // finalize (from 'rxjs/operators'): không thay đổi dữ liệu trả về, bắt được kể cả lỗi
                // map (from 'rxjs/operators'): thay đổi dữ liệu trả về, format
                map((data) => {
                    // console.log({ data })
                    const message = this.refector.get(MESSAGE_RESPONSE, context.getHandler());

                    return {
                        status: `success`,
                        statusCode: statusCode,
                        message: message || `Chưa gắn decorator MessageResponse vào controller`,
                        data: data,
                    }
                }),
            );
    }
}
