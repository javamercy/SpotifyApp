import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SharedModule } from "./shared/modules/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SharedModule, NgxSpinnerModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "SpotifyApp";
}
