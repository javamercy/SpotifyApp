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
import { NgxTypedJsModule } from "ngx-typed-js";
import { authorizationInterceptor } from "./interceptors/authorization.interceptor";
import { errorHandlerInterceptor } from "./interceptors/error-handler.interceptor";
import { spinnerInterceptor } from "./interceptors/spinner.interceptor";
import { NgxSpinnerModule } from "ngx-spinner";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authorizationInterceptor,
        errorHandlerInterceptor,
        spinnerInterceptor,
      ])
    ),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(NgxTypedJsModule, NgxSpinnerModule),
  ],
};
