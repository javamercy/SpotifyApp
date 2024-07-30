import { inject } from "@angular/core";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      toastr.error(
        error.error.error?.message?.toString() || "An error occurred"
      );
      return throwError(() => error);
    })
  );
};
