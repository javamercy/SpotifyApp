import { Router, RouterOutlet } from "@angular/router";
import { Component } from "@angular/core";
import { PageRequest } from "../../models/page-request.model";
import { SharedModule } from "../../shared/modules/shared.module";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { ReactiveFormsModule } from "@angular/forms";
import { TopArtistsComponent } from "../top-artists/top-artists.component";
import { TopTracksComponent } from "../top-tracks/top-tracks.component";

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [
    SharedModule,
    MsToTimePipe,
    ReactiveFormsModule,
    TopArtistsComponent,
    TopTracksComponent,
    RouterOutlet,
  ],
  templateUrl: "./stats.component.html",
  styleUrl: "./stats.component.css",
})
export class StatsComponent {
  pageRequest: PageRequest = new PageRequest(50, 0);

  constructor(private router: Router) {}

  onTimeRangeChange(value: string) {
    this.router.navigate([], {
      queryParams: { time_range: value },
      queryParamsHandling: "merge",
    });
  }
}
