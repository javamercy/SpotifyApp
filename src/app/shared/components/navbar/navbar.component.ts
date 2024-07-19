import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../../models/user.model";
import { filter, Subscription } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  isAuthenticated: boolean | undefined;
  user: User | null | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.checkIfUserIsAuthenticated();

    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkIfUserIsAuthenticated();
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  private getUser(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe({
        next: response => {
          this.user = response;
        },
        error: error => console.error(error),
      })
    );
  }

  private checkIfUserIsAuthenticated(): void {
    this.subscriptions.add(
      this.authService.isAuthenticated().subscribe({
        next: response => {
          this.isAuthenticated = response;

          if (this.isAuthenticated) {
            this.getUser();
          }
        },
        error: error => console.error(error),
      })
    );
  }
}
