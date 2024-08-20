import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [DashboardComponent, SignInComponent, CommonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  schemas: [],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  user: User;
  isUserLoaded = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.isUserLoaded = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
