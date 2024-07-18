import { map, Observable, of } from "rxjs";
import { environment } from "./../../environments/environment.development";
import { Injectable } from "@angular/core";
import { SpotifyToken } from "../models/spotify-token.model";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Constants } from "../shared/constants/Constants";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}
  login(): void {
    const directUrl = `${environment.spotify.AuthorizeOptions.url}?client_id=${environment.spotify.AuthorizeOptions.clientId}&response_type=${environment.spotify.AuthorizeOptions.responseType}&redirect_uri=${environment.spotify.AuthorizeOptions.redirectUri}&scope=${environment.spotify.AuthorizeOptions.scope}`;

    window.location.href = directUrl;
  }

  getToken(code: string): Observable<SpotifyToken> {
    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    body.set("redirect_uri", environment.spotify.AuthorizeOptions.redirectUri);
    body.set("client_id", environment.spotify.TokenOptions.clientId);
    body.set("client_secret", environment.spotify.TokenOptions.clientSecret);

    return this.http.post<SpotifyToken>(
      environment.spotify.TokenOptions.url,
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.cookieService.get(Constants.ACCESS_TOKEN);

    if (!token) return of(false);

    const newUrl = `${environment.spotify.apiUrl}/me`;

    return this.http.get<boolean>(newUrl).pipe(map(() => true));
  }
}
