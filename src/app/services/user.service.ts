import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { ListResponse } from "../models/list-response.model";
import { Artist } from "../models/artist.model";
import { PageRequest } from "../models/page-request.model";
import { Track } from "../models/track.model";
import { Album } from "../models/album.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.spotify.apiUrl;
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getTopArtists(pageRequest: PageRequest): Observable<ListResponse<Artist>> {
    return this.http.get<ListResponse<Artist>>(
      `${this.apiUrl}/me/top/artists?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getTopTracks(pageRequest: PageRequest): Observable<ListResponse<Track>> {
    return this.http.get<ListResponse<Track>>(
      `${this.apiUrl}/me/top/tracks?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
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
}
