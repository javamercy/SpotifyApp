import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Constants } from "../../shared/constants/Constants";
import { LocalStorageService } from "../../services/local-storage.service";
import { AccessToken } from "../../models/access-token.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-spotify-callback",
  standalone: true,
  imports: [],
  templateUrl: "./spotify-callback.component.html",
  styleUrl: "./spotify-callback.component.css",
})
export class SpotifyCallbackComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const error = params["error"];

      if (error) {
        this.toastr.error(
          "An error occurred while logging in to Spotify. Please try again."
        );

        this.router.navigate(["/home"]);
      } else {
        const code = params["code"];
        if (code) {
          this.subscription = this.authService
            .getToken(code)
            .subscribe(data => {
              const expiresInMilliseconds = data.expires_in * 1000;
              const currentUtcTime = Date.now();
              const expirationUtcTime = currentUtcTime + expiresInMilliseconds;

              const accessToken: AccessToken = {
                token: data.access_token,
                expiration: new Date(expirationUtcTime),
              };

              this.localStorageService.set(Constants.ACCESS_TOKEN, accessToken);
              this.router.navigate(["/home"]);
            });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
