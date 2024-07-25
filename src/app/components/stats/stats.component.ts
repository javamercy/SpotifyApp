import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Track } from "../../models/track.model";
import { Subscription } from "rxjs";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";
import { TimeRange } from "../../enums/time-range";
import { SharedModule } from "../../shared/modules/shared.module";
import { Artist } from "../../models/artist.model";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [SharedModule, MsToTimePipe, ReactiveFormsModule],
  templateUrl: "./stats.component.html",
  styleUrl: "./stats.component.css",
})
export class StatsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  topTracks: Track[];
  isAllTopTracks: boolean;
  topArtists: Artist[];
  timeRange: TimeRange;
  isAllTopArtists: boolean;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.topTracks = [];
    this.topArtists = [];
    this.isAllTopTracks = false;
    this.isAllTopArtists = false;
    this.timeRange = TimeRange.LONG_TERM;
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.getSelectedTimeRange();
    this.getTopTracks();
    this.getTopArtists();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onTimeRangeChange(value: string) {
    this.timeRange = value as TimeRange;

    this.getTopTracks();
    this.getTopArtists();
  }

  getTopTracks() {
    this.subscription.add(
      this.userService
        .getTopTracks(new PageRequest(10, 0), this.timeRange)
        .subscribe(response => {
          this.topTracks = response.items;
          this.isAllTopTracks = false;
        })
    );
  }

  getAllTopTracks() {
    this.subscription.add(
      this.userService
        .getTopTracks(new PageRequest(50, 0), this.timeRange)
        .subscribe(response => {
          this.topTracks = response.items;
          this.isAllTopTracks = true;
        })
    );
  }

  toggleTopTracks() {
    if (this.isAllTopTracks) {
      this.getTopTracks();
    } else {
      this.getAllTopTracks();
    }
  }

  getTopArtists() {
    this.subscription.add(
      this.userService
        .getTopArtists(new PageRequest(10, 0), this.timeRange)
        .subscribe(response => {
          this.topArtists = response.items;
          this.isAllTopArtists = false;
        })
    );
  }

  getAllTopArtists() {
    this.subscription.add(
      this.userService
        .getTopArtists(new PageRequest(50, 0), this.timeRange)
        .subscribe(response => {
          this.topArtists = response.items;
          this.isAllTopArtists = true;
        })
    );
  }

  toggleTopArtists() {
    if (this.isAllTopArtists) {
      this.getTopArtists();
    } else {
      this.getAllTopArtists();
    }
  }

  getBadgeColor(popularity: number): string {
    const red = Math.round(255 * (1 - popularity / 100));
    const green = Math.round(255 * (popularity / 100));
    return `rgb(${red}, ${green}, 0)`;
  }

  getSelectedTimeRange() {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe(params => {
        this.timeRange =
          TimeRange[params["time_range"] as keyof typeof TimeRange];
      })
    );
  }
}
