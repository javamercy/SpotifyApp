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

@Component({
  selector: "app-music-player",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./music-player.component.html",
  styleUrls: ["./music-player.component.css"],
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @ViewChild("audioRef") audioRef: ElementRef<HTMLAudioElement>;
  currentTrack: Track | null;
  progress: string;
  isPlaying: boolean;
  subscriptions: Subscription;

  constructor(private musicPlayerService: MusicPlayerService) {
    this.subscriptions = new Subscription();
  }

  ngOnInit() {
    this.subscriptions.add(
      this.musicPlayerService.track$.subscribe(track => {
        this.currentTrack = track;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener("window:keydown.space", ["$event"])
  onSpacebarPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.toggle();
  }

  play(track: Track) {
    this.audioRef.nativeElement.src = track.preview_url;
    this.audioRef.nativeElement.play();
  }

  toggle() {
    if (this.audioRef.nativeElement.paused) {
      this.audioRef.nativeElement.play();
    } else {
      this.audioRef.nativeElement.pause();
    }
    this.isPlaying = !this.audioRef.nativeElement.paused;
  }

  stop() {
    this.audioRef.nativeElement.pause();
    this.isPlaying = false;
  }

  onTimeUpdate() {
    const currentTime = this.audioRef.nativeElement.currentTime;
    const duration = this.audioRef.nativeElement.duration;

    const progress = Math.round((currentTime / duration) * 100);
    this.progress = `${progress}%`;
  }

  onTrackEnded() {
    this.stop();
    this.clear();
  }

  closePlayer() {
    this.clear();
    this.musicPlayerService.clearTrack();
  }

  clear() {
    this.progress = "0%";
    this.audioRef.nativeElement.currentTime = 0;
  }
}
