import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const accessToken = localStorageService.getAccessToken();

  const authReq = accessToken
    ? req.clone({
        headers: req.headers.set(
          "Authorization",
          `Bearer ${accessToken.token}`
        ),
      })
    : req;

  return next(authReq);
};
