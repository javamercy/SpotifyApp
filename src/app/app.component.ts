import { AuthService } from "./services/auth.service";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { MusicPlayerComponent } from "./shared/components/music-player/music-player.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { MusicPlayerService } from "./services/music-player.service";
import { map, Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { User } from "./models/user.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    MusicPlayerComponent,
    FooterComponent,
    CommonModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  isTrack: Observable<boolean>;
  user: User;

  constructor(
    private authService: AuthService,
    private musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit() {
    this.isTrack = this.musicPlayerService.track$.pipe(map(track => !!track));

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
