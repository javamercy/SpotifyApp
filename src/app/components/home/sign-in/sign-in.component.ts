import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
  OnInit,
} from "@angular/core";
import { IconComponent } from "../../../shared/components/icon/icon.component";
import { NgxTypedJsComponent, NgxTypedJsModule } from "ngx-typed-js";
import { AuthService } from "../../../services/auth.service";
import { Quote } from "../../../models/quote.model";
import { QuoteService } from "../../../services/quote.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [IconComponent, NgxTypedJsModule],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.css",
})
export class SignInComponent implements OnInit {
  quotes: Quote[];
  strings: string[];
  isAuthorShown = false;
  currentAuthor: string;

  private readonly subscriptions = new Subscription();
  @ViewChild("arrowDown")
  private readonly arrowDown: ElementRef<HTMLElement>;
  @ViewChild("parallaxContainer")
  private readonly parallaxContainer: ElementRef<HTMLElement>;

  @ViewChild(NgxTypedJsComponent) private readonly typed: NgxTypedJsComponent;

  constructor(
    private authService: AuthService,
    private quoteService: QuoteService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getQuotes();
  }

  @HostListener("window:scroll", ["$event"])
  onScroll(): void {
    const scrollY = window.scrollY;
    const parallaxContainerPos = this.parallaxContainer.nativeElement.offsetTop;

    if (scrollY === 0) {
      this.renderer.setStyle(this.arrowDown.nativeElement, "display", "block");
    } else {
      this.renderer.setStyle(this.arrowDown.nativeElement, "display", "none");
    }

    if (scrollY > parallaxContainerPos - 200) {
      this.renderer.addClass(this.parallaxContainer.nativeElement, "scrolled");
      this.typed.stop();
    } else {
      this.renderer.removeClass(
        this.parallaxContainer.nativeElement,
        "scrolled"
      );
      this.typed.start();
    }
  }

  onArrowDown(): void {
    const parallaxContainerPos = this.parallaxContainer.nativeElement.offsetTop;
    window.scrollTo({
      top: parallaxContainerPos,
      behavior: "smooth",
    });
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

  onStringTyped(index: number) {
    this.currentAuthor = this.quotes[index].author;
    this.isAuthorShown = true;
  }

  onPreStringTyped() {
    this.isAuthorShown = false;
  }

  onLastStringBackspaced() {
    this.isAuthorShown = false;
  }

  shuffleQuotes(quotes: Quote[]) {
    quotes.sort(() => Math.random() - 0.5);
  }
}
