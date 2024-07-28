import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { SharedModule } from "../../shared/modules/shared.module";
import { TrackService } from "../../services/track.service";
import { Track } from "../../models/track.model";
import { PageRequest } from "../../models/page-request.model";
import { MusicPlayerService } from "../../services/music-player.service";

@Component({
  selector: "app-track-discover",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./track-discover.component.html",
  styleUrl: "./track-discover.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackDiscoverComponent implements OnInit {
  tracks: Track[];
  likedTracks: Map<string, Track> = new Map<string, Track>();
  private pageRequest: PageRequest = new PageRequest(30, 0);
  private genres: string[] = ["pop"];

  constructor(
    private trackService: TrackService,
    private musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit(): void {
    this.getTracksByGenre();
  }

  getTracksByGenre() {
    this.trackService
      .getTracksByGenres(this.pageRequest, this.genres)
      .subscribe(response => {
        this.tracks = response.tracks;
        console.log(this.tracks.map(track => track.name));
      });
  }

  togglePlay(track: Track) {
    this.musicPlayerService.togglePlay(track);
  }

  isAlreadyLiked(track: Track): boolean {
    return this.likedTracks.has(track.id);
  }

  toggleLike(track: Track) {
    if (this.isAlreadyLiked(track)) {
      this.likedTracks.delete(track.id);
    } else {
      this.likedTracks.set(track.id, track);
    }
  }

  isNowPlaying(track: Track): boolean {
    return this.musicPlayerService.isNowPlaying(track);
  }
}
