import { Injectable } from "@angular/core";
import { AccessToken } from "../models/access-token.model";
import { Constants } from "../shared/constants/Constants";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return !!localStorage.getItem(key);
  }

  getAccessToken(): AccessToken | null {
    const accessToken: AccessToken = this.get(
      Constants.ACCESS_TOKEN
    ) as AccessToken;

    if (!accessToken) return null;

    if (this.isAccessTokenExpired(accessToken.expiration)) {
      this.delete(Constants.ACCESS_TOKEN);
      return null;
    }
    return accessToken;
  }

  private isAccessTokenExpired(expiration: Date): boolean {
    return new Date(expiration) < new Date();
  }
}
