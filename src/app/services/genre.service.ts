import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BehaviorSubject, Observable, shareReplay, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GenreService {
  private apiUrl: string = environment.spotify.apiUrl;
  private genreSubject: BehaviorSubject<string[] | null>;
  genres$: Observable<string[] | null>;
  constructor(private http: HttpClient) {
    this.genreSubject = new BehaviorSubject<string[] | null>(null);
    this.genres$ = this.genreSubject.asObservable().pipe(shareReplay(1));
  }

  getGenres(): Observable<string[]> {
    if (this.genreSubject.value) {
      return this.genres$ as Observable<string[]>;
    }

    return this.http
      .get<string[]>(`${this.apiUrl}/recommendations/available-genre-seeds`)
      .pipe(
        shareReplay(1),
        tap(genres => {
          this.genreSubject.next(genres);
        })
      );
  }
}
