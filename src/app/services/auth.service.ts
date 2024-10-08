import { BehaviorSubject, map, Observable } from "rxjs";
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
  user$: Observable<User | null> = this.userSubject.asObservable();

  private isInitializing = false;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    if (this.isInitializing) return;

    this.isInitializing = true;
    const accessToken = this.localStorageService.get<AccessToken>(
      Constants.SPOTIFY_ACCESS_TOKEN
    );

    if (accessToken && !this.isTokenExpired(new Date(accessToken.expiration))) {
      this.getMe().subscribe({
        next: user => {
          this.userSubject.next(user);
          this.localStorageService.set(Constants.USER, user);
          this.isInitializing = false;
        },

        error: () => {
          this.clear();
          this.isInitializing = false;
        },
      });
    } else {
      this.clear();
      this.isInitializing = false;
    }
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  signIn(): void {
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

  signOut(): void {
    this.userSubject.next(null);
    this.localStorageService.delete(Constants.SPOTIFY_ACCESS_TOKEN);
    this.localStorageService.delete(Constants.USER);
  }

  setToken(spotifyToken: SpotifyToken): void {
    const expiresInMilliseconds = spotifyToken.expires_in * 1000;
    const currentUtcTime = Date.now();
    const expirationUtcTime = currentUtcTime + expiresInMilliseconds;

    const accessToken = new AccessToken(
      spotifyToken.access_token,
      new Date(expirationUtcTime)
    );

    this.localStorageService.set(Constants.SPOTIFY_ACCESS_TOKEN, accessToken);

    this.initializeUser();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  private clear(): void {
    this.userSubject.next(null);
    this.localStorageService.delete(Constants.SPOTIFY_ACCESS_TOKEN);
    this.localStorageService.delete(Constants.USER);
  }

  private isTokenExpired(expiration: Date): boolean {
    return expiration < new Date();
  }
}
