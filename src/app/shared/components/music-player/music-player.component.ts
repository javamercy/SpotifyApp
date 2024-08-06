import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  HostListener,
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
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild("audioRef") public readonly audioRef: ElementRef<HTMLAudioElement>;
  currentTrack: Track | null;
  progress = 0;
  isPlaying: boolean;
  subscriptions: Subscription;
  showPlayer = true;

  constructor(private musicPlayerService: MusicPlayerService) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe(track => {
        this.currentTrack = track;
      })
    );

    this.subscriptions.add(
      this.musicPlayerService.isPlaying$.subscribe(isPlaying => {
        this.isPlaying = isPlaying;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get playerState() {
    return this.showPlayer ? "in" : "out";
  }

  @HostListener("window:keydown.space", ["$event"])
  onSpacebarPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.toggle();
  }

  play(track: Track) {
    this.audioRef.nativeElement.src = track.preview_url;
    this.audioRef.nativeElement.play();
    this.musicPlayerService.play(track);
  }

  toggle() {
    if (this.audioRef.nativeElement.paused) {
      this.audioRef.nativeElement.play();
      this.musicPlayerService.play(this.currentTrack);
    } else {
      this.audioRef.nativeElement.pause();
      this.musicPlayerService.pause();
    }
  }

  pause() {
    this.audioRef.nativeElement.pause();
    this.musicPlayerService.pause();
  }

  onTimeUpdate() {
    const currentTime = this.audioRef.nativeElement.currentTime;
    const duration = this.audioRef.nativeElement.duration;

    const progress = Math.round((currentTime / duration) * 100);
    this.progress = progress;
  }

  onTrackEnded() {
    this.progress = 0;
    this.musicPlayerService.pause();
  }

  close() {
    this.showPlayer = false;
    this.musicPlayerService.clearTrack();
  }

  show() {
    this.showPlayer = true;
  }

  hide() {
    this.showPlayer = false;
  }

  clear() {
    this.progress = 0;
    this.audioRef.nativeElement.currentTime = 0;
  }
}
