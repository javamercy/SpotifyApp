import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Subscription } from "rxjs";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowseCategory } from "../../models/browse-category.model";
import { PageRequest } from "../../models/page-request.model";
import { Playlist } from "../../models/playlist.model";
import { SimplifiedPlaylist } from "../../models/simplified.playlist.model";
import { User } from "../../models/user.model";
import { BrowseService } from "../../services/browse.service";
import { UserService } from "../../services/user.service";
import { AverageColorDirective } from "../../directives/average-color.directive";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, AverageColorDirective, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnDestroy, OnInit {
  private subscriptions: Subscription;

  user: User | null;

  featuredPlaylists: Playlist[];
  madeForYouPlaylists: Playlist[];
  newReleasedPlaylists: Playlist[];
  currentUsersPlaylists: SimplifiedPlaylist[];
  browseCategories: BrowseCategory[];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private browseService: BrowseService
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.getFeaturedPlaylists();
    this.getBrowseCategories();
    this.getMadeForYouPlaylists();

    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        if (user) {
          this.getUserPlaylists();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getFeaturedPlaylists(): void {
    this.subscriptions.add(
      this.browseService
        .getFeaturedPlaylists(new PageRequest(30, 0))
        .subscribe({
          next: playlists => {
            this.featuredPlaylists = playlists.playlists.items;
          },
          error: error => console.error(error),
        })
    );
  }

  getMadeForYouPlaylists(): void {
    const categoryId = "0JQ5DAt0tbjZptfcdMSKl3";
    this.subscriptions.add(
      this.browseService
        .getPlaylistsByCategoryId(categoryId, new PageRequest(30, 0))
        .subscribe({
          next: playlists => {
            this.madeForYouPlaylists = playlists.playlists.items;
          },
          error: error => console.error(error),
        })
    );
  }

  getBrowseCategories(): void {
    this.subscriptions.add(
      this.browseService.getBrowseCategories(new PageRequest(50, 0)).subscribe({
        next: categories => {
          this.browseCategories = categories.categories.items;
          console.log(this.browseCategories.map(c => c.name));
        },
        error: error => console.error(error),
      })
    );
  }

  getUserPlaylists(): void {
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
}
