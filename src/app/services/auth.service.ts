import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subscription,
  tap,
} from "rxjs";
import { environment } from "./../../environments/environment.development";
import { Injectable } from "@angular/core";
import { SpotifyToken } from "../models/spotify-token.model";
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user.model";
import { Constants } from "../shared/constants/Constants";
import { LocalStorageService } from "./local-storage.service";
import { AccessToken } from "../models/access-token.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.spotify.apiUrl;

  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject
    .asObservable()
    .pipe(shareReplay(1));

  private subscriptions: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
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

    console.log(body.getAll("client_id"));

    return this.http
      .post<SpotifyToken>(
        environment.spotify.TokenOptions.url,
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .pipe(
        tap({
          next: data => {
            const expiresInMilliseconds = data.expires_in * 1000;
            const currentUtcTime = Date.now();
            const expirationUtcTime = currentUtcTime + expiresInMilliseconds;

            const accessToken = new AccessToken(
              data.access_token,
              new Date(expirationUtcTime)
            );

            this.localStorageService.set(
              Constants.SPOTIFY_ACCESS_TOKEN,
              accessToken
            );

            this.subscriptions.add(
              this.getCurrentUser().subscribe({
                next: user => {
                  this.userSubject.next(user);
                },
                complete: () => this.subscriptions.unsubscribe(),
              })
            );
          },
        })
      );
  }

  logout(): void {
    this.userSubject.next(null);
    this.localStorageService.delete(Constants.SPOTIFY_ACCESS_TOKEN);
    this.localStorageService.delete(Constants.USER);
  }

  private getCurrentUser(): Observable<User> {
    const newUrl = `${this.apiUrl}/me`;
    return this.http.get<User>(newUrl);
  }

  isAuthenticated(): boolean {
    const accessToken = this.localStorageService.get(
      Constants.SPOTIFY_ACCESS_TOKEN
    ) as AccessToken;
    const token = accessToken?.token;
    const expiration = accessToken?.expiration as Date;

    if (!token || !expiration) {
      return false;
    }

    if (this.isTokenExpired(new Date(expiration))) {
      this.clearToken();
      return false;
    }

    return !!this.userSubject.value;
  }

  private clearToken(): void {
    this.userSubject.next(null);
    this.localStorageService.delete(Constants.SPOTIFY_ACCESS_TOKEN);
  }

  private isTokenExpired(expiration: Date): boolean {
    return expiration < new Date();
  }
}
