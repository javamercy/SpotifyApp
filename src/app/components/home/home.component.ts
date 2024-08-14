import { BrowseService } from "./../../services/browse.service";
import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  HostListener,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";
import { Playlist } from "../../models/playlist.model";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SimplifiedPlaylist } from "../../models/simplified.playlist.model";
import { QuoteService } from "../../services/quote.service";
import { NgxTypedJsComponent, NgxTypedJsModule } from "ngx-typed-js";
import { Quote } from "../../models/quote.model";
import { BrowseCategory } from "../../models/browse-category.model";

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
  user: User;
  featuredPlaylists: Playlist[];
  madeForYouPlaylists: Playlist[];
  newReleasedPlaylists: Playlist[];
  currentUsersPlaylists: SimplifiedPlaylist[];
  browseCategories: BrowseCategory[];
  madeForYouId: string;
  playlistsFilterQuery: string;
  quotes: Quote[];
  strings: string[];
  isAuthorShown = false;
  currentAuthor: string;

  @ViewChild("autoScrollArrow")
  private readonly autoScrollArrow: ElementRef<HTMLElement>;
  @ViewChild("parallaxContainer")
  private readonly parallaxContainer: ElementRef<HTMLElement>;

  @ViewChild(NgxTypedJsComponent) private readonly typed: NgxTypedJsComponent;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private browseService: BrowseService,
    private quoteService: QuoteService,
    private renderer: Renderer2
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.getQuotes();
      })
    );
    this.getFeaturedPlaylists();
    this.getBrowseCategories();
    this.getMadeForYouPlaylists();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(): void {
    if (this.user) return;
    const scrollY = window.scrollY;
    const parallaxContainerPos = this.parallaxContainer.nativeElement.offsetTop;

    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar.clientHeight;

    if (scrollY === 0) {
      this.renderer.setStyle(
        this.autoScrollArrow.nativeElement,
        "display",
        "block"
      );
    } else {
      this.renderer.setStyle(
        this.autoScrollArrow.nativeElement,
        "display",
        "none"
      );
    }

    if (scrollY > parallaxContainerPos - navbarHeight) {
      this.renderer.addClass(this.parallaxContainer.nativeElement, "scrolled");
      this.typed.stop();
    } else {
      this.renderer.removeClass(
        this.parallaxContainer.nativeElement,
        "scrolled"
      );
      this.typed.start();
    }
  }

  autoScroll(): void {
    const parallaxContainerPos = this.parallaxContainer.nativeElement.offsetTop;
    window.scrollTo({
      top: parallaxContainerPos,
      behavior: "smooth",
    });
  }

  login(): void {
    this.authService.login();
  }

  getFeaturedPlaylists(): void {
    this.subscriptions.add(
      this.browseService
        .getFeaturedPlaylists(new PageRequest(20, 0))
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
        .getPlaylistsByCategoryId(categoryId, new PageRequest(20, 0))
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
      this.browseService.getBrowseCategories(new PageRequest(20, 0)).subscribe({
        next: categories => {
          this.browseCategories = categories.categories.items;
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

  shuffleQuotes(quotes: Quote[]) {
    quotes.sort(() => Math.random() - 0.5);
  }
}
