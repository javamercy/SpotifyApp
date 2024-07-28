import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../../models/user.model";
import { Subscription } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { LocalStorageService } from "../../../services/local-storage.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  user: User;
  isAuthenticated: boolean;
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.router.events.subscribe({
        next: () => {
          this.isAuthenticated = this.checkifUserAuthenticated();
          if (this.isAuthenticated) {
            this.getCurrentUser();
          }
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  getCurrentUser(): void {
    this.authService.user$.subscribe({
      next: user => {
        this.user = user;
      },
    });
  }

  checkifUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  log(value: unknown): boolean {
    console.log(value);
    return true;
  }
}
