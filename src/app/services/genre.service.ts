import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable, shareReplay, tap } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  private apiUrl: string = environment.spotify.apiUrl;
  private cacheKey = "genres";

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getGenres(): Observable<{ genres: string[] }> {
    const cached = this.localStorageService.get<{ genres: string[] }>(
      this.cacheKey
    );

    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    const url = `${this.apiUrl}/recommendations/available-genre-seeds`;
    return this.http.get<{ genres: string[] }>(url).pipe(
      tap(response => {
        this.localStorageService.set(this.cacheKey, response);
      }),
      shareReplay(1)
    );
  }
}
