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
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/modules/shared.module";
import { FormsModule } from "@angular/forms";
import { FilterGenresPipe } from "../../pipes/filter-genres.pipe";

@Component({
  selector: "app-track-discover",
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    FormsModule,
    TrackSwipeComponent,
    FilterGenresPipe,
  ],
  templateUrl: "./track-discover.component.html",
  styleUrl: "./track-discover.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackDiscoverComponent implements OnInit {
  @ViewChild("swipeSection") swipeSection: ElementRef<HTMLElement>;
  nowPlayingTrack: Track;
  tracks: Track[];
  genres: string[];
  selectedGenre: string;
  filterText = "";

  private pageRequest: PageRequest = new PageRequest(30, 0);

  constructor(
    private trackService: TrackService,
    private genreService: GenreService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkGenreQueryParams();
    this.getGenres();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  getTracksByGenre(genre: string = null) {
    this.trackService
      .getTracksByGenre(this.pageRequest, genre)
      .subscribe(response => {
        this.tracks = response.tracks;
        this.scrollToTop();
      });
  }

  getGenres() {
    this.genreService.getGenres().subscribe(genres => {
      this.genres = genres.genres;
      this.genres = this.shuffleGenres(this.genres);
    });
  }

  checkGenreQueryParams() {
    this.activatedRoute.params.subscribe(params => {
      if (params["genre"]) {
        this.selectedGenre = params["genre"];
        this.getTracksByGenre(this.selectedGenre);
      }
    });
  }

  shuffleGenres(genres: string[]) {
    return genres.sort(() => Math.random() - 0.5);
  }
}
