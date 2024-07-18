import { Component } from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { SpotifyService } from "../../services/spotify.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  constructor(private spotifyService: SpotifyService) {}

  login() {
    this.spotifyService.login();
  }
}
