import { Component, OnInit, OnDestroy } from "@angular/core";
import { Artist } from "../../models/artist.model";
import { TimeRange } from "../../enums/time-range";
import { UserService } from "../../services/user.service";
import { PageRequest } from "../../models/page-request.model";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-top-artists",
  standalone: true,
  imports: [],
  templateUrl: "./top-artists.component.html",
  styleUrl: "./top-artists.component.css",
})
export class TopArtistsComponent implements OnInit, OnDestroy {
  topArtists: Artist[];
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

        this.getTopArtists(this.pageRequest, timeRange);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getTopArtists(pageRequest: PageRequest, timeRange?: TimeRange) {
    this.subscriptions.add(
      this.userService
        .getTopArtists(pageRequest, timeRange)
        .subscribe(response => {
          this.topArtists = response.items;
        })
    );
  }
}
