import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { User } from "../../../models/user.model";
import { Observable, Subscription } from "rxjs";
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
  user: Observable<User>;
  isAuthenticated: boolean;
  navbarVisible = false;
  iconColor = "currentColor";

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
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log(this.isAuthenticated);

    this.user = this.authService.user$;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    if (this.isAuthenticated) return;
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

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  log(value: unknown): boolean {
    console.log(value);
    return true;
  }
}
