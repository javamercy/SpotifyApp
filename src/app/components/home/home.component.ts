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
import { PlaylistService } from "../../services/playlist.service";
import { Playlist } from "../../models/playlist.model";
import { FormsModule } from "@angular/forms";
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
  user: User;
  trendPlaylists: Playlist[];
  currentUsersPlaylists: SimplifiedPlaylist[];
  playlistsFilterQuery: string;
  quotes: Quote[];
  strings: string[];
  isAuthorShown = false;
  currentAuthor: string;

  @ViewChild("containerFluid")
  private readonly containerFluid: ElementRef<HTMLElement>;
  @ViewChild("autoScrollArrow")
  private readonly autoScrollArrow: ElementRef<HTMLElement>;
  @ViewChild("parallaxContainer")
  private readonly parallaxContainer: ElementRef<HTMLElement>;

  @ViewChild(NgxTypedJsComponent) private readonly typed: NgxTypedJsComponent;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private quoteService: QuoteService,
    private renderer: Renderer2
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        if (user) {
          this.getFeaturedPlaylists();
        } else {
          this.getQuotes();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll() {
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

  autoScroll() {
    const parallaxContainerPos = this.parallaxContainer.nativeElement.offsetTop;
    window.scrollTo({
      top: parallaxContainerPos,
      behavior: "smooth",
    });
  }

  login() {
    this.authService.login();
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
