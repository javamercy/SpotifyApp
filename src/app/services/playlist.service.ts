import { PageRequest } from "./../models/page-request.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { forkJoin, map, Observable, switchMap } from "rxjs";
import { ListResponse } from "../models/list-response.model";
import { Playlist } from "../models/playlist.model";
import { PlaylistTrackItem } from "../models/playlist-track-item.model";

@Injectable({
  providedIn: "root",
})
export class PlaylistService {
  private apiUrl = environment.spotify.apiUrl;
  constructor(private http: HttpClient) {}

  getPlaylists() {
    return this.http.get(`${this.apiUrl}/me/playlists`);
  }

  getFeaturedPlaylists(
    pageRequest: PageRequest
  ): Observable<{ message: string; playlists: ListResponse<Playlist> }> {
    return this.http.get<{
      message: string;
      playlists: ListResponse<Playlist>;
    }>(
      `${this.apiUrl}/browse/featured-playlists?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getAllByName(
    name: string
  ): Observable<{ message: string; playlists: ListResponse<Playlist> }> {
    return this.http.get<{
      message: string;
      playlists: ListResponse<Playlist>;
    }>(`${this.apiUrl}/search?type=playlist&q=${name}`);
  }

  getAllByGenre(
    PageRequest: PageRequest,
    genre: string
  ): Observable<{ message: string; playlists: ListResponse<Playlist> }> {
    return this.http.get<{
      message: string;
      playlists: ListResponse<Playlist>;
    }>(
      `${this.apiUrl}/browse/categories/${genre}/playlists?limit=${PageRequest.limit}&offset=${PageRequest.offset}`
    );
  }

  getById(id: string): Observable<Playlist> {
    return this.http
      .get<Playlist>(`${this.apiUrl}/playlists/${id}`)
      .pipe(switchMap(playlist => this.getAllTracks(playlist)));
  }

  private getAllTracks(playlist: Playlist): Observable<Playlist> {
    const limit = 100;
    const total = playlist.tracks.total;
    const requests = [];

    for (let offset = 0; offset < total; offset += limit) {
      requests.push(
        this.http.get<{ items: PlaylistTrackItem[] }>(
          `${this.apiUrl}/playlists/${playlist.id}/tracks?offset=${offset}&limit=${limit}`
        )
      );
    }

    return forkJoin(requests).pipe(
      map(responses => responses.flatMap(response => response.items)),
      map(tracks => {
        playlist.tracks.items = tracks;
        return playlist;
      })
    );
  }
}
