import { UserService } from "./../../services/user.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Track } from "../../models/track.model";
import { Subscription } from "rxjs";
import { PageRequest } from "../../models/page-request.model";
import { TimeRange } from "../../enums/time-range";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { SharedModule } from "../../shared/modules/shared.module";

@Component({
  selector: "app-top-tracks",
  standalone: true,
  imports: [SharedModule, MsToTimePipe],
  templateUrl: "./top-tracks.component.html",
  styleUrl: "./top-tracks.component.css",
})
export class TopTracksComponent implements OnInit, OnDestroy {
  topTracks: Track[];
  private subscription: Subscription;

  constructor(private userService: UserService) {
    this.topTracks = [];
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.getTopTracks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTopTracks() {
    this.subscription.add(
      this.userService
        .getTopTracks(new PageRequest(10, 0), TimeRange.LONG_TERM)
        .subscribe(response => {
          this.topTracks = response.items;
        })
    );
  }

  getBadgeColor(popularity: number): string {
    const red = Math.round(255 * (1 - popularity / 100));
    const green = Math.round(255 * (popularity / 100));
    return `rgb(${red}, ${green}, 0)`;
  }
}
