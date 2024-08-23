import { Component, OnInit } from "@angular/core";

import { Subscription } from "rxjs";
import { Quote } from "../../models/quote.model";
import { IconComponent } from "../../shared/components/icon/icon.component";
import { AuthService } from "../../services/auth.service";
import { QuoteService } from "../../services/quote.service";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [IconComponent],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.css",
})
export class SignInComponent implements OnInit {
  quotes: Quote[];
  strings: string[];
  isAuthorShown = false;
  currentAuthor: string;

  private readonly subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private quoteService: QuoteService
  ) {}

  ngOnInit(): void {
    this.getQuotes();
  }

  signIn(): void {
    this.authService.signIn();
  }

  getQuotes() {
    this.subscriptions.add(
      this.quoteService.getAll().subscribe({
        next: response => {
          this.quotes = response;
          this.shuffleQuotes(this.quotes);
          this.strings = this.quotes.map(quote => quote.quoteText);
        },
        error: error => console.error(error),
      })
    );
  }

  // onStringTyped(index: number) {
  //   this.currentAuthor = this.quotes[index].author;
  //   this.isAuthorShown = true;
  // }

  // onPreStringTyped() {
  //   this.isAuthorShown = false;
  // }

  // onLastStringBackspaced() {
  //   this.isAuthorShown = false;
  // }

  shuffleQuotes(quotes: Quote[]) {
    quotes.sort(() => Math.random() - 0.5);
  }
}
