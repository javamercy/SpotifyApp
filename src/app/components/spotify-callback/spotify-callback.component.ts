import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Constants } from "../../shared/constants/Constants";
import { LocalStorageService } from "../../services/local-storage.service";
import { AccessToken } from "../../models/access-token.model";

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
    private localStorageService: LocalStorageService
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
            const accessToken: AccessToken = {
              token: data.access_token,
              expiration: new Date(Date.now() + data.expires_in * 1000),
            };

            this.localStorageService.set(Constants.ACCESS_TOKEN, accessToken);
          });
        }
      }
    });
  }
}
