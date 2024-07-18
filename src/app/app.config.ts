import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { authorizationInterceptor } from "./interceptors/authorization.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      closeButton: true,
    }),
  ],
};
