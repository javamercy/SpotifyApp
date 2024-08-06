import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { ListResponse } from "../models/list-response.model";
import { Artist } from "../models/artist.model";
import { PageRequest } from "../models/page-request.model";
import { Track } from "../models/track.model";
import { Album } from "../models/album.model";
import { TimeRange } from "../enums/time-range";
import { User } from "../models/user.model";
import { SimplifiedPlaylist } from "../models/simplified.playlist.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.spotify.apiUrl;
  constructor(private http: HttpClient) {}

  getTopArtists(
    pageRequest: PageRequest,
    timeRange = TimeRange.LONG_TERM
  ): Observable<ListResponse<Artist>> {
    return this.http.get<ListResponse<Artist>>(
      `${this.apiUrl}/me/top/artists?limit=${pageRequest.limit}&offset=${pageRequest.offset}&time_range=${timeRange}`
    );
  }

  getTopTracks(
    pageRequest: PageRequest,
    timeRange = TimeRange.LONG_TERM
  ): Observable<ListResponse<Track>> {
    console.log(timeRange);

    return this.http.get<ListResponse<Track>>(
      `${this.apiUrl}/me/top/tracks?limit=${pageRequest.limit}&offset=${pageRequest.offset}&time_range=${timeRange}`
    );
  }

  getTopAlbums(pageRequest: PageRequest): Observable<ListResponse<Album>> {
    return this.http.get<ListResponse<Album>>(
      `${this.apiUrl}/me/top/albums?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getFollowedArtists(
    pageRequest: PageRequest
  ): Observable<ListResponse<Artist>> {
    return this.http.get<ListResponse<Artist>>(
      `${this.apiUrl}/me/following?type=artist&limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getCurrentUserPlaylists(
    pageRequest: PageRequest
  ): Observable<ListResponse<SimplifiedPlaylist>> {
    return this.http.get<ListResponse<SimplifiedPlaylist>>(
      `${this.apiUrl}/me/playlists?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  saveTrack(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me/tracks?ids=${id}`, {});
  }

  unsaveTrack(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me/tracks?ids=${id}`);
  }
}
