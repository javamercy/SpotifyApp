import { Inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs";

export const authGuard: CanActivateFn = () => {
  const authService = Inject(AuthService) as AuthService;
  const router = Inject(Router) as Router;

  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(["/"]);
        return false;
      }

      return true;
    })
  );
};
