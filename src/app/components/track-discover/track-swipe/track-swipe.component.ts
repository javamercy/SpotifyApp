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
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Track } from "../../../models/track.model";
import { SharedModule } from "../../../shared/modules/shared.module";
import { MusicPlayerService } from "../../../services/music-player.service";
import { SwiperContainer } from "swiper/element";
import { Subscription } from "rxjs";
import { AverageColorDirective } from "../../../shared/directives/average-color.directive";
import { TextScrollDirective } from "../../../shared/directives/text-scroll.directive";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-track-swipe",
  standalone: true,
  imports: [SharedModule, AverageColorDirective, TextScrollDirective],
  templateUrl: "./track-swipe.component.html",
  styleUrl: "./track-swipe.component.css",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackSwipeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tracks: Track[];
  @Input() genre: string;
  nowPlayingTrack: Track | null;
  @Input() likedTracks: Map<string, Track>;
  @Input() audioRef: ElementRef<HTMLAudioElement>;
  @ViewChild("swiperContainer")
  private readonly swiperContainer: ElementRef<SwiperContainer>;
  private subscriptions: Subscription = new Subscription();

  @ViewChildren("scrollItem")
  private readonly scrollItems: QueryList<ElementRef<HTMLDivElement>>;

  autoPlay = true;

  constructor(
    private musicPlayerService: MusicPlayerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe(track => {
        this.nowPlayingTrack = track;
      })
    );
  }

  ngAfterViewInit(): void {
    this.addEventListeners();
  }

  togglePlay(track: Track) {
    this.musicPlayerService.togglePlay(track);
  }

  toggleAutoplay(checked: boolean) {
    this.autoPlay = checked;
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
      this.unsaveTrack(track);
    } else {
      this.likedTracks.set(track.id, track);
      this.saveTrack(track);
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

  saveTrack(track: Track) {
    this.subscriptions.add(
      this.userService.saveTrack(track.id).subscribe(response => {
        console.log(response);
      })
    );
  }

  unsaveTrack(track: Track) {
    this.subscriptions.add(
      this.userService.unsaveTrack(track.id).subscribe(response => {
        console.log(response);
      })
    );
  }
}
