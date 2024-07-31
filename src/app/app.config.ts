import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { authorizationInterceptor } from "./interceptors/authorization.interceptor";
import { errorHandlerInterceptor } from "./interceptors/error-handler.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authorizationInterceptor, errorHandlerInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      closeButton: true,
    }),
    importProvidersFrom(SweetAlert2Module.forRoot()),
  ],
};
