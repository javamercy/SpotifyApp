import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, shareReplay } from "rxjs";
import { Quote } from "../models/quote.model";

@Injectable({
  providedIn: "root",
})
export class QuoteService {
  private quotesUrl = "data/quotes.json";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.quotesUrl).pipe(shareReplay(1));
  }
}
