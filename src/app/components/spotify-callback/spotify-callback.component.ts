import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { Constants } from "../../shared/constants/Constants";

@Component({
  selector: "app-spotify-callback",
  standalone: true,
  imports: [],
  templateUrl: "./spotify-callback.component.html",
  styleUrl: "./spotify-callback.component.css",
})
export class SpotifyCallbackComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private cookieService: CookieService
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
          this.spotifyService.getToken(code).subscribe(data => {
            const expiration: Date = new Date(
              Date.now() + data.expires_in * 1000
            );
            this.cookieService.set(
              Constants.ACCESS_TOKEN,
              data.access_token,
              expiration,
              "/",
              "",
              true,
              "Strict"
            );
            this.toastr.success("You have successfully logged in to Spotify.");
            this.router.navigate(["/home"]);
          });
        }
      }
    });
  }
}
