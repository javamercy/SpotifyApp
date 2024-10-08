import { Injectable } from "@angular/core";
import { AccessToken } from "../models/access-token.model";
import { Constants } from "../shared/constants/Constants";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  get<T>(key: string): T | null {
    return JSON.parse(localStorage.getItem(key)) as T;
  }

  set = (key: string, value: unknown): void =>
    localStorage.setItem(key, JSON.stringify(value));

  delete = (key: string): void => localStorage.removeItem(key);

  clear = (): void => localStorage.clear();

  has = (key: string): boolean => !!localStorage.getItem(key);

  getSpotifyAccessToken(): AccessToken | null {
    const accessToken: AccessToken = this.get(
      Constants.SPOTIFY_ACCESS_TOKEN
    ) as AccessToken;

    if (!accessToken) return null;

    if (this.isAccessTokenExpired(accessToken.expiration)) {
      this.delete(Constants.SPOTIFY_ACCESS_TOKEN);
      return null;
    }
    return accessToken;
  }

  private isAccessTokenExpired = (expiration: Date): boolean =>
    new Date(expiration) < new Date();
}
