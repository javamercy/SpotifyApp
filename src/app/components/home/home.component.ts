import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
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
import { SimplifiedPlaylist } from "../../models/simplified.playlist.model";
import { QuoteService } from "../../services/quote.service";
import { NgxTypedJsComponent, NgxTypedJsModule } from "ngx-typed-js";
import { Quote } from "../../models/quote.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, NgxTypedJsModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  currentUser: User;
  isAuthenticated: boolean;
  trendPlaylists: Playlist[];
  playlistsByGenre: Playlist[];
  currentUsersPlaylists: SimplifiedPlaylist[];
  playlistsFilterQuery: string;
  topGenres: string[];
  quotes: Quote[];
  strings: string[];
  isAuthorShown = false;
  currentAuthor: string;

  @ViewChild(NgxTypedJsComponent) private readonly typed: NgxTypedJsComponent;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private quoteService: QuoteService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.checkIfUserAutenticated();
    this.getQuotes();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
      this.getCurrentUserPlaylists();
    }
  }

  getFeaturedPlaylists(): void {
    this.subscriptions.add(
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
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe({
        next: user => {
          this.currentUser = user;
        },
        error: error => console.error(error),
      })
    );
  }

  getTopGenres(): void {
    this.subscriptions.add(
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
    this.subscriptions.add(
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

  getCurrentUserPlaylists(): void {
    this.subscriptions.add(
      this.userService
        .getCurrentUserPlaylists(new PageRequest(20, 0))
        .subscribe({
          next: playlists => {
            this.currentUsersPlaylists = playlists.items;
          },
          error: error => console.error(error),
        })
    );
  }

  getQuotes() {
    this.quoteService.getAll().subscribe({
      next: response => {
        this.quotes = response;
        this.shuffleQuotes(this.quotes);
        this.strings = this.quotes.map(quote => quote.quoteText);
      },
      error: error => console.error(error),
    });
  }

  onStringTyped(index: number) {
    this.currentAuthor = this.quotes[index].author;
    this.isAuthorShown = true;
  }

  onPreStringTyped() {
    this.isAuthorShown = false;
  }

  onLastStringBackspaced() {
    this.isAuthorShown = false;
  }

  log(value: string) {
    console.log(value);
  }

  shuffleQuotes(quotes: Quote[]) {
    quotes.sort(() => Math.random() - 0.5);
  }
}
