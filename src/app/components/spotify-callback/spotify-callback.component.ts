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
  private subscription: Subscription;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const error = params["error"];

      if (error) {
        this.toastr.error(
          "An error occurred while logging in to Spotify. Please try again."
        );
      } else {
        const code = params["code"];
        if (code) {
          this.subscription = this.authService.getToken(code).subscribe({
            next: () => {
              this.authService.getCurrentUser().subscribe({
                complete: () => this.router.navigate(["/"]),
              });
            },
          });
        } else {
          this.router.navigate(["/"]);
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
