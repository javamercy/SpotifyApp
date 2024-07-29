import { Injectable } from "@angular/core";
import { Track } from "../models/track.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MusicPlayerService {
  private trackSubject: BehaviorSubject<Track | null>;
  track$: Observable<Track | null>;
  private isPlaying: BehaviorSubject<boolean>;
  isPlaying$: Observable<boolean>;

  constructor() {
    this.trackSubject = new BehaviorSubject<Track | null>(null);
    this.track$ = this.trackSubject.asObservable();

    this.isPlaying = new BehaviorSubject<boolean>(false);
    this.isPlaying$ = this.isPlaying.asObservable();
  }

  play(track: Track) {
    this.isPlaying.next(true);
    if (this.trackSubject.value && this.trackSubject.value.id === track.id)
      return;
    this.trackSubject.next(track);
  }

  togglePlay(track: Track) {
    if (this.trackSubject.value && this.trackSubject.value.id === track.id) {
      this.isPlaying.next(!this.isPlaying.value);
    } else {
      this.play(track);
      this.isPlaying.next(true);
    }
  }

  pause() {
    this.isPlaying.next(false);
  }

  clearTrack() {
    this.trackSubject.next(null);
    this.isPlaying.next(false);
  }

  isNowPlaying(track: Track): boolean {
    return this.trackSubject.value?.id === track.id;
  }

  getNowPlaying(): Track | null {
    return this.trackSubject.value;
  }
}
