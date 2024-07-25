import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";
import { PlaylistService } from "../../services/playlist.service";
import { Playlist } from "../../models/playlist.model";
import { FormsModule } from "@angular/forms";
import { TimeRange } from "../../enums/time-range";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  currentUser: User;
  isAuthenticated: boolean;
  trendPlaylists: Playlist[];
  playlistsByGenre: Playlist[];
  playlistsFilterQuery: string;
  topGenres: string[];
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private playlistService: PlaylistService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.checkIfUserAutenticated();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
    this.authService.login();
  }

  checkIfUserAutenticated(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.getCurrentUser();
      this.getFeaturedPlaylists();
      this.getTopGenres();
    }
  }

  getFeaturedPlaylists(): void {
    this.subscription.add(
      this.playlistService
        .getFeaturedPlaylists(new PageRequest(20, 0))
        .subscribe({
          next: playlists => {
            this.trendPlaylists = playlists.playlists.items;
          },
          error: error => console.error(error),
        })
    );
  }

  getCurrentUser(): void {
    this.subscription.add(
      this.authService.getCurrentUser().subscribe({
        next: user => {
          this.currentUser = user;
        },
        error: error => console.error(error),
      })
    );
  }

  getTopGenres(): void {
    this.subscription.add(
      this.userService
        .getTopArtists(new PageRequest(10, 0), TimeRange.SHORT_TERM)
        .subscribe({
          next: artists => {
            const genres = artists.items
              .map(artist => artist.genres)
              .reduce((acc, val) => acc.concat(val), []);
            this.topGenres = genres.slice(0, 5);
            const genre = this.topGenres.find(g => g.split(" ").length === 1);

            this.getPlaylistsByGenre(genre);
          },
          error: error => console.error(error),
        })
    );
  }

  getPlaylistsByGenre(genre: string): void {
    this.subscription.add(
      this.playlistService
        .getAllByGenre(new PageRequest(20, 0), genre)
        .subscribe({
          next: playlists => {
            this.playlistsByGenre = playlists.playlists.items;
          },
          error: error => console.error(error),
        })
    );
  }
}
