import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from "rxjs";

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(NgxSpinnerService);

  return next(req).pipe(
    tap({
      next: () => spinnerService.show(),
      complete: () => spinnerService.hide(),
      error: () => spinnerService.hide(),
    })
  );
};
