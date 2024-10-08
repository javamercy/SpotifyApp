import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { User } from "../../../models/user.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null;
  navbarVisible = false;
  iconColor = "currentColor";
  isLoaded: boolean;

  private subscriptions: Subscription = new Subscription();

  @ViewChild("navbar") private readonly navbar: ElementRef<HTMLElement>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onMouseOver(): void {
    this.iconColor = "var(--forest-green)";
  }

  onMouseOut(): void {
    this.iconColor = "currentColor";
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: user => {
          if (user) {
            this.user = user;
            this.isLoaded = true;
          }
        },
        error: () => (this.isLoaded = true),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    if (this.user) return;
    const scrollY = window.scrollY;
    const parallaxContainer = document.querySelector(
      ".ek-parallax-container"
    ) as HTMLElement;
    const parallaxContainerPos = parallaxContainer.offsetTop;
    const navbarHeight = this.navbar.nativeElement.clientHeight;

    if (scrollY > parallaxContainerPos - navbarHeight) {
      this.navbarVisible = true;
    } else {
      this.navbarVisible = false;
    }
  }

  signIn(): void {
    this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(["/"]);
  }

  getNavbarClass(): string {
    if (this.user) return "";
    return "ek-navbar-fixed " + this.navbarVisible
      ? "ek-navbar-visible"
      : "ek-navbar-hidden";
  }
}
