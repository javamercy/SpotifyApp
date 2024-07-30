import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
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
export class TrackSwipeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tracks: Track[];
  @Input() genre: string;
  nowPlayingTrack: Observable<Track | null>;
  @Input() likedTracks: Map<string, Track>;
  @Input() audioRef: ElementRef<HTMLAudioElement>;
  @ViewChild("swiperContainer")
  swiperContainer: ElementRef<SwiperContainer>;
  autoPlay = true;

  constructor(private musicPlayerService: MusicPlayerService) {}

  togglePlay(track: Track) {
    this.musicPlayerService.togglePlay(track);
  }

  toggleAutoplay(checked: boolean) {
    this.autoPlay = checked;
  }

  ngOnInit(): void {
    this.getNowPlayingTrack();
  }

  ngAfterViewInit(): void {
    this.addEventListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["genre"] && !changes["genre"].firstChange) {
      this.resetSwiper();
    }
  }

  resetSwiper() {
    this.swiperContainer.nativeElement.swiper.slideTo(0);
    this.musicPlayerService.clearTrack();
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
      if (this.autoPlay) {
        this.play(track);
      }
    });
  }

  play(track: Track) {
    this.musicPlayerService.play(track);
  }

  getNowPlayingTrack(): void {
    this.nowPlayingTrack = this.musicPlayerService.track$;
  }
}
