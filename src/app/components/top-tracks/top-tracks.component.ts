import { Component, OnInit, OnDestroy } from "@angular/core";
import { Track } from "../../models/track.model";
import { MsToTimePipe } from "../../pipes/ms-to-time.pipe";
import { SharedModule } from "../../shared/modules/shared.module";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";
import { TimeRange } from "../../enums/time-range";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-top-tracks",
  standalone: true,
  imports: [SharedModule, MsToTimePipe],
  templateUrl: "./top-tracks.component.html",
  styleUrl: "./top-tracks.component.css",
})
export class TopTracksComponent implements OnInit, OnDestroy {
  topTracks: Track[];
  pageRequest: PageRequest = new PageRequest(50, 0);

  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(params => {
        const timeRange = params["time_range"] as TimeRange;

        this.getTopTracks(this.pageRequest, timeRange);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getTopTracks(pageRequest: PageRequest, timeRange: TimeRange) {
    this.subscriptions.add(
      this.userService
        .getTopTracks(pageRequest, timeRange)
        .subscribe(response => {
          this.topTracks = response.items;
        })
    );
  }

  getJoinedArtists(artists: { name: string }[]) {
    return artists.map(artist => artist.name).join(", ");
  }
}
