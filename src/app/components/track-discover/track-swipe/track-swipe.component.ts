import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Track } from "../../../models/track.model";
import { SharedModule } from "../../../shared/modules/shared.module";
import { MusicPlayerService } from "../../../services/music-player.service";
import { SwiperContainer } from "swiper/element";
import { Observable } from "rxjs";

@Component({
  selector: "app-track-swipe",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./track-swipe.component.html",
  styleUrl: "./track-swipe.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackSwipeComponent implements OnInit, AfterViewInit {
  @Input() tracks: Track[];
  @Input() genre: string;
  nowPlayingTrack: Observable<Track | null>;
  @Input() likedTracks: Map<string, Track>;
  @Input() audioRef: ElementRef<HTMLAudioElement>;
  @ViewChild("swiperContainer")
  swiperContainer: ElementRef<SwiperContainer>;

  constructor(private musicPlayerService: MusicPlayerService) {}

  togglePlay(track: Track) {
    this.musicPlayerService.togglePlay(track);
  }

  ngOnInit(): void {
    this.getNowPlayingTrack();
  }

  ngAfterViewInit(): void {
    this.addEventListeners();
  }

  toggleLike(track: Track) {
    if (this.isAlreadyLiked(track)) {
      this.likedTracks.delete(track.id);
    } else {
      this.likedTracks.set(track.id, track);
    }
  }

  isAlreadyLiked(track: Track): boolean {
    return this.likedTracks.has(track.id);
  }

  addEventListeners() {
    this.onSlideChange();
  }

  onSlideChange() {
    this.swiperContainer.nativeElement.swiper.on("slideChange", () => {
      const index = this.swiperContainer.nativeElement.swiper.realIndex;
      const track = this.tracks[index];
      this.play(track);
    });
  }

  play(track: Track) {
    this.musicPlayerService.play(track);
  }

  getNowPlayingTrack(): void {
    this.nowPlayingTrack = this.musicPlayerService.track$;
  }
}
