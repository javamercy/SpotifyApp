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
import { Subscription } from "rxjs";
import { AverageColorDirective } from "../../../shared/directives/average-color.directive";
import { TextScrollDirective } from "../../../shared/directives/text-scroll.directive";
import { UserService } from "../../../services/user.service";
import { LocalStorageService } from "../../../services/local-storage.service";
import { ToastrService } from "ngx-toastr";

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
  currentlyPlayingTrack: Track | null;
  isPlaying: boolean;
  likedTracks = new Map<string, Track>();
  autoplay: boolean;
  @ViewChild("swiperContainer")
  private readonly swiperContainer: ElementRef<SwiperContainer>;
  private readonly subscriptions: Subscription = new Subscription();
  constructor(
    private musicPlayerService: MusicPlayerService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.autoplay = this.localStorageService.get<boolean>("autoplay") || false;
    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe(track => {
        this.currentlyPlayingTrack = track;
      })
    );

    this.subscriptions.add(
      this.musicPlayerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
      })
    );
  }

  ngAfterViewInit(): void {
    this.addEventListeners();
  }

  togglePlay(track: Track) {
    if (
      this.currentlyPlayingTrack &&
      this.currentlyPlayingTrack.id === track.id
    ) {
      this.musicPlayerService.toggle();
    } else {
      this.musicPlayerService.play(track);
    }
  }

  // popupSwal() {
  //   const isAutoplay = this.localStorageService.get<boolean>("autoplay");

  //   if (isAutoplay === null) {
  //     Swal.fire({
  //       title: "Welcome to the Discover!",
  //       text: "Swipe to discover new tracks",
  //       icon: "info",
  //       confirmButtonText: "Got it!",
  //     }).then(() => {
  //       Swal.fire({
  //         title: "Tip",
  //         text: "Would you like to enable autoplay? You can always change this setting right above the cards",
  //         icon: "question",
  //         showCancelButton: true,
  //         cancelButtonText: "No",
  //         confirmButtonText: "Yes",
  //       }).then((result: { isConfirmed: boolean }) => {
  //         if (result.isConfirmed) {
  //           this.autoplay = true;
  //           this.localStorageService.set("autoplay", this.autoplay);
  //         }
  //       });
  //     });
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["genre"] && !changes["genre"].firstChange) {
      this.resetSwiper();
    }
  }

  resetSwiper() {
    this.musicPlayerService.clear();
    this.swiperContainer.nativeElement.swiper.slideTo(0);
  }

  toggleLike(track: Track) {
    if (this.isAlreadyLiked(track)) {
      this.likedTracks.delete(track.id);
      this.unsave(track);
      this.toastrService.info("Track removed from liked tracks", null, {
        positionClass: "toast-top-right",
        progressBar: true,
      });
    } else {
      this.likedTracks.set(track.id, track);
      this.save(track);
      this.toastrService.success("Track added to liked tracks", null, {
        positionClass: "toast-top-right",
        progressBar: true,
      });
    }
  }

  isAlreadyLiked(track: Track): boolean {
    return this.likedTracks.has(track.id);
  }

  play(track: Track) {
    this.musicPlayerService.play(track);
  }

  save(track: Track) {
    this.subscriptions.add(
      this.userService.saveTrack(track.id).subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
      })
    );
  }

  unsave(track: Track) {
    this.subscriptions.add(
      this.userService.unsaveTrack(track.id).subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.log(error);
        },
      })
    );
  }

  addEventListeners() {
    this.onSlideChange();
  }

  onSlideChange() {
    this.swiperContainer.nativeElement.swiper.on("slideChange", () => {
      if (this.autoplay) {
        const index = this.swiperContainer.nativeElement.swiper.realIndex;
        const track = this.tracks[index];
        this.musicPlayerService.play(track);
      }
    });
  }

  switchAutoplay() {
    this.autoplay = !this.autoplay;
    this.localStorageService.set("autoplay", this.autoplay);
  }
}
