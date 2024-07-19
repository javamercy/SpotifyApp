import { Component, OnInit, OnDestroy } from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { Observable, Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { Artist } from "../../models/artist.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  user: User;
  isAuthenticated: Observable<boolean>;
  topArtists: Artist[];
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.checkIfUserIsAuthenticated();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  login() {
    this.authService.login();
  }

  private getTopArtists(pageRequest: PageRequest) {
    this.subscription.add(
      this.userService.getTopArtists(pageRequest).subscribe({
        next: response => {
          console.log(response);

          this.topArtists = response.items;
        },
        error: error => console.error(error),
      })
    );
  }

  private getTopTracks(pageRequest: PageRequest) {
    this.subscription.add(
      this.userService.getTopTracks(pageRequest).subscribe({
        next: response => {
          console.log(response);
        },
        error: error => console.error(error),
      })
    );
  }

  private getUser(): void {
    this.subscription.add(
      this.authService.user$.subscribe({
        next: response => {
          this.user = response;
        },
        error: error => console.error(error),
      })
    );
  }

  private checkIfUserIsAuthenticated(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    this.subscription.add(
      this.isAuthenticated.subscribe({
        next: response => {
          if (response) {
            this.getUser();
            this.getTopArtists(new PageRequest(10, 0));
            this.getTopTracks(new PageRequest(10, 0));
          }
        },
        error: error => console.error(error),
      })
    );
  }
}
