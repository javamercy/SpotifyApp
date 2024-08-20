import { Router, RouterOutlet } from "@angular/router";
import { Component } from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [SharedModule, MsToTimePipe, ReactiveFormsModule, RouterOutlet],
  templateUrl: "./stats.component.html",
  styleUrl: "./stats.component.css",
})
export class StatsComponent {
  constructor(private router: Router) {}

  onTimeRangeChange(value: string) {
    this.router.navigate([], {
      queryParams: { time_range: value },
      queryParamsHandling: "merge",
    });
  }
}
