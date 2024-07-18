import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "./shared/modules/shared.module";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "SpotifyApp";
}
