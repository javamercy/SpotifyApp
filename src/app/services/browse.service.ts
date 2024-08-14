import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PageRequest } from "../models/page-request.model";
import { Observable } from "rxjs";
import { ListResponse } from "../models/list-response.model";
import { Playlist } from "../models/playlist.model";
import { environment } from "../../environments/environment.development";
import { BrowseCategory } from "../models/browse-category.model";

@Injectable({
  providedIn: "root",
})
export class BrowseService {
  private apiUrl = environment.spotify.apiUrl;

  constructor(private http: HttpClient) {}

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

  getPlaylistsByCategoryId(
    categoryId: string,
    pageRequest: PageRequest
  ): Observable<{ message: string; playlists: ListResponse<Playlist> }> {
    return this.http.get<{
      message: string;
      playlists: ListResponse<Playlist>;
    }>(
      `${this.apiUrl}/browse/categories/${categoryId}/playlists?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }

  getBrowseCategories(
    pageRequest: PageRequest
  ): Observable<{ categories: ListResponse<BrowseCategory> }> {
    return this.http.get<{ categories: ListResponse<BrowseCategory> }>(
      `${this.apiUrl}/browse/categories?limit=${pageRequest.limit}&offset=${pageRequest.offset}`
    );
  }
}
