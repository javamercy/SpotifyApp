import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  get(key: string): unknown {
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
}
