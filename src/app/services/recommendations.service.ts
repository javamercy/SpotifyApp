import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { environment } from "../../environments/environment.development";
import { Track } from "../models/track.model";
import { RecommendationSeedObject } from "../models/recommendation-seed-object.model";
import { PageRequest } from "../models/page-request.model";

@Injectable({
  providedIn: "root",
})
export class RecommendationsService {
  private apiUrl = environment.spotify.apiUrl;
  private cacheKey = "genres";
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getAvailableGenres(): Observable<{ genres: string[] }> {
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
      tap({
        next: response => {
          this.localStorageService.set(this.cacheKey, response);
        },
      })
    );
  }

  getRecommandationTracks(
    seedArtistIds: string[],
    seedGenres: string[],
    seedTrackIds: string[],
    pageRequest: PageRequest
  ): Observable<{ seeds: RecommendationSeedObject[]; tracks: Track[] }> {
    const url = `${this.apiUrl}/recommendations`;
    const params = {
      seed_artists: seedArtistIds.join(","),
      seed_genres: seedGenres.join(","),
      seed_tracks: seedTrackIds.join(","),
      limit: pageRequest.limit,
      offset: pageRequest.offset,
    };

    return this.http.get<{
      seeds: RecommendationSeedObject[];
      tracks: Track[];
    }>(url, { params });
  }
}
