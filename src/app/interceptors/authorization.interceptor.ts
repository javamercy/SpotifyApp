import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);

  const accessToken = localStorageService.getSpotifyAccessToken();

  if (!accessToken) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken.token}`,
    },
  });

  return next(authReq);
};
