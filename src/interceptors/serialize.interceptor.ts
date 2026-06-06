import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

export class SerializeInterceptor implements NestInterceptor {

    intercept(
        context: ExecutionContext, 
        handler: CallHandler<any>
    ): Observable<any> {
        // Run something before the request is handled
        // by the request handler
        console.log('Im running before handler', context)
        return handler.handle().pipe(
            map((data: any) => {
                console.log('Im running before response is sent out', data);
            }),
        );
    }
}