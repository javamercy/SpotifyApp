import { Directive, ElementRef, Renderer2, AfterViewInit } from "@angular/core";

@Directive({
  selector: "[appTextScroll]",
  standalone: true,
})
export class TextScrollDirective implements AfterViewInit {
  constructor(
    private el: ElementRef<HTMLDivElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.setScrollAnimationProperty();
  }

  setScrollAnimationProperty() {
    const container = this.el.nativeElement;
    const scrollItem = this.el.nativeElement
      .firstElementChild as HTMLDivElement;

    if (scrollItem) {
      const containerWidth = container.scrollWidth;
      const scrollItemWidth = container.clientWidth;
      const overflowWidth = containerWidth - scrollItemWidth;

      if (overflowWidth > 0) {
        const animationDuration = Math.ceil(overflowWidth * 0.15);

        container.style.setProperty(
          "--overflow-width",
          `${overflowWidth * -1}px`
        );
        container.style.setProperty(
          "--animation-duration",
          `${animationDuration}s`
        );

        container.classList.add("animate");
      } else {
        container.classList.remove("animate");
      }
    }
  }
}
