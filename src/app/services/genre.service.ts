import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable, shareReplay, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  private apiUrl: string = environment.spotify.apiUrl;
  private genreSubject: BehaviorSubject<{ genres: string[] } | null>;
  genres$: Observable<{ genres: string[] } | null>;
  constructor(private http: HttpClient) {
    this.genreSubject = new BehaviorSubject<{ genres: string[] } | null>(null);
    this.genres$ = this.genreSubject.asObservable().pipe(shareReplay(1));
  }

  getGenres(): Observable<{ genres: string[] }> {
    if (this.genreSubject.value) {
      console.log("returning cached genres");

      return this.genres$ as Observable<{ genres: string[] }>;
    }

    return this.http
      .get<{
        genres: string[];
      }>(`${this.apiUrl}/recommendations/available-genre-seeds`)
      .pipe(
        shareReplay(1),
        tap(genres => {
          this.genreSubject.next(genres);
        })
      );
  }
}
