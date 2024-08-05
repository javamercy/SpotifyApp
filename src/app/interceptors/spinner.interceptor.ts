import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs";

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show();

  return next(req).pipe(finalize(() => ngxSpinnerService.hide()));
};
