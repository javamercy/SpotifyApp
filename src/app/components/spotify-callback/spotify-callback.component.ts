import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
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
  private subscriptions: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(params => {
        const error = params["error"];

        if (error) {
          this.toastr.error(
            "An error occurred while logging in to Spotify. Please try again."
          );
        } else {
          const code = params["code"];
          if (code) {
            this.subscriptions.add(
              this.authService.getToken(code).subscribe({
                next: spotifyToken => {
                  this.authService.setToken(spotifyToken);
                },
                complete: () => {
                  this.router.navigate(["/"]);
                },
                error: () => {
                  this.toastr.error(
                    "An error occurred while logging in to Spotify. Please try again."
                  );
                },
              })
            );
          } else {
            this.router.navigate(["/"]);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
