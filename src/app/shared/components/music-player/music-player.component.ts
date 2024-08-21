import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  Renderer2,
} from "@angular/core";
import { MusicPlayerService } from "../../../services/music-player.service";
import { Track } from "../../../models/track.model";
import { Subscription } from "rxjs";
import { SharedModule } from "../../modules/shared.module";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { TextScrollDirective } from "../../directives/text-scroll.directive";
import { CircularProgressBarDirective } from "../../directives/circular-progress-bar.directive";

@Component({
  selector: "app-music-player",
  standalone: true,
  imports: [SharedModule, TextScrollDirective, CircularProgressBarDirective],
  templateUrl: "./music-player.component.html",
  styleUrls: ["./music-player.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translateX(150%)",
        })
      ),
      transition("out => in", [animate("200ms ease-in-out")]),
      transition("in => out", [animate("200ms ease-out")]),
    ]),
  ],
})
export class MusicPlayerComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild("audioRef")
  private readonly audioRef: ElementRef<HTMLAudioElement>;

  @ViewChild("ekScrollContainer")
  private readonly scrollContainer: ElementRef<HTMLDivElement>;

  @ViewChildren("ekScrollItem")
  private readonly scrollItems: QueryList<ElementRef<HTMLDivElement>>;

  currentlyPlayingTrack: Track | null;
  progress = 0;
  isPlaying: boolean;
  showPlayer = true;
  private readonly subscriptions: Subscription = new Subscription();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private timeUpdateInterval: any;

  constructor(
    private musicPlayerService: MusicPlayerService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe(track => {
        this.currentlyPlayingTrack = track;

        if (this.audioRef && track) {
          this.updateAudio(track);

          setTimeout(() => this.setScrollAnimationProperty(), 0);
        }
      })
    );

    this.subscriptions.add(
      this.musicPlayerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
        if (this.audioRef && this.currentlyPlayingTrack) {
          this.updatePlayback(isPlaying);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.audioRef && this.currentlyPlayingTrack) {
      this.updateAudio(this.currentlyPlayingTrack);
      this.setScrollAnimationProperty();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    clearInterval(this.timeUpdateInterval);
  }

  get playerState() {
    return this.showPlayer ? "in" : "out";
  }

  @HostListener("window:keydown.space", ["$event"])
  onSpacebarPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.toggle();
  }

  toggle() {
    if (this.audioRef.nativeElement.paused) {
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
    }
    this.musicPlayerService.toggle();
  }

  pause() {
    this.musicPlayerService.pause();
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.toggle();
  }

  onTimeUpdate() {
    const currentTime = this.audioRef.nativeElement.currentTime;
    const duration = this.audioRef.nativeElement.duration;

    const progress: number = Math.round((currentTime / duration) * 100) || 0;
    this.progress = progress;
  }

  onTrackEnded() {
    this.reset();
    this.musicPlayerService.pause();
  }

  close() {
    this.hide();
    this.musicPlayerService.clear();
  }

  show() {
    this.showPlayer = true;
  }

  hide() {
    this.showPlayer = false;
  }

  reset() {
    this.progress = 0;
    this.audioRef.nativeElement.currentTime = 0;
    this.audioRef.nativeElement.pause();
  }

  getJoinedArtists(artists: { name: string }[]) {
    return artists.map(artist => artist.name).join(", ");
  }

  private updatePlayback(isPlaying: boolean) {
    if (isPlaying && this.audioRef.nativeElement.paused) {
      this.audioRef.nativeElement.play();
    } else if (!isPlaying && !this.audioRef.nativeElement.paused) {
      this.audioRef.nativeElement.pause();
    }
  }

  private updateAudio(track: Track) {
    this.progress = 0;
    this.audioRef.nativeElement.src = track.preview_url;
    this.audioRef.nativeElement.load();
    this.updatePlayback(this.isPlaying);
  }

  startTimeUpdateInterval() {
    if (!this.timeUpdateInterval) {
      this.timeUpdateInterval = setInterval(() => this.onTimeUpdate(), 1000);
    }
  }

  stopTimeUpdateInterval() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  private setScrollAnimationProperty() {
    const containerWidth = this.scrollContainer.nativeElement.clientWidth;

    this.scrollItems.forEach(item => {
      const itemElement = item.nativeElement;
      const itemWidth = itemElement.scrollWidth;
      const speed = 20;
      this.renderer.removeClass(itemElement, "animate");

      if (itemWidth > containerWidth) {
        const duration = Math.round(itemWidth / speed);

        itemElement.style.setProperty("--item-width", `${itemWidth}px`);
        itemElement.style.setProperty(
          "--container-width",
          `${containerWidth}px`
        );
        itemElement.style.setProperty("--scroll-duration", `${duration}s`);

        requestAnimationFrame(() =>
          this.renderer.addClass(itemElement, "animate")
        );
      }
    });
  }
}
