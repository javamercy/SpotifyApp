import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class TrackService {
  constructor(
    private http: HttpClient,
    private localstorageService: LocalStorageService
  ) {}
}
