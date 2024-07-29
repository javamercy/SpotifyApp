import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { TrackService } from "../../services/track.service";
import { Track } from "../../models/track.model";
import { PageRequest } from "../../models/page-request.model";
import { TrackSwipeComponent } from "./track-swipe/track-swipe.component";
import { GenreService } from "../../services/genre.service";

@Component({
  selector: "app-track-discover",
  standalone: true,
  imports: [TrackSwipeComponent],
  templateUrl: "./track-discover.component.html",
  styleUrl: "./track-discover.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackDiscoverComponent implements OnInit {
  @ViewChild("audioRef") audioRef: ElementRef<HTMLAudioElement>;
  nowPlayingTrack: Track;
  tracks: Track[];
  likedTracks: Map<string, Track> = new Map<string, Track>();
  genres: string[];

  private pageRequest: PageRequest = new PageRequest(30, 0);

  constructor(
    private trackService: TrackService,
    private genreService: GenreService
  ) {}

  ngOnInit() {
    this.getGenres();
  }

  getTracksByGenre() {
    this.trackService
      .getTracksByGenre(this.pageRequest, this.genres[0])
      .subscribe(response => {
        this.tracks = response.tracks;
      });
  }

  getGenres() {
    this.genreService.getGenres().subscribe(genres => {
      this.genres = genres.genres;

      this.getTracksByGenre();
    });
  }
}
