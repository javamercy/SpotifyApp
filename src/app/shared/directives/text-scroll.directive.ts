import { Directive, ElementRef, Renderer2, AfterViewInit } from "@angular/core";

/**
 * Directive to add scroll animation to text that overflows its container.
 */
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

  updateScrollAnimationProperty() {
    this.setScrollAnimationProperty();
  }

  private setScrollAnimationProperty() {
    const container = this.el.nativeElement as HTMLElement;
    const items = this.el.nativeElement.querySelectorAll(
      ".ek-scroll-item"
    ) as NodeListOf<HTMLElement>;

    items.forEach(item => {
      this.setStyles(item, container);
    });
  }

  private setStyles(item: HTMLElement, container: HTMLElement) {
    const containerWidth = container.scrollWidth;
    const itemWidth = container.clientWidth;

    const overflowWidth = containerWidth - itemWidth;

    if (overflowWidth > 0) {
      const duration = (overflowWidth / 50) * 1000;

      this.renderer.setStyle(
        container,
        "--animation-duration",
        `${duration}ms`
      );
      this.renderer.setStyle(
        container,
        "--overflow-width",
        `${overflowWidth}px`
      );
      this.renderer.addClass(item, "animate");
    }
  }
}
