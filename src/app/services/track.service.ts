import { PageRequest } from "./../models/page-request.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { map, Observable, tap } from "rxjs";
import { RecommendationSeed } from "../models/recommendation-seed.model";
import { Track } from "../models/track.model";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class TrackService {
  private apiUrl = environment.spotify.apiUrl;
  private cacheKey = (pageRequest: PageRequest) =>
    `tracks(${pageRequest.limit},${pageRequest.offset})`;
  constructor(
    private http: HttpClient,
    private localstorageService: LocalStorageService
  ) {}

  getTracksByGenre(
    pageRequest: PageRequest,
    genre: string
  ): Observable<{ seeds: RecommendationSeed; tracks: Track[] }> {
    const cached = this.localstorageService.get<{
      seeds: RecommendationSeed;
      tracks: Track[];
    }>(this.cacheKey(pageRequest));

    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }
    const url = `${this.apiUrl}/recommendations?limit=${pageRequest.limit}&offset=${pageRequest.offset}&seed_genres=${genre}
    )}`;
    return this.http
      .get<{ seeds: RecommendationSeed; tracks: Track[] }>(url)
      .pipe(
        map(response => {
          return {
            ...response,
            tracks: response.tracks.filter(track => track.preview_url),
          };
        }),
        tap(response => {
          this.localstorageService.set(this.cacheKey(pageRequest), response);
        })
      );
  }
}
