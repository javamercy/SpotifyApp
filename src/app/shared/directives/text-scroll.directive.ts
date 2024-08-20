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

  resetScrollAnimationProperty() {
    const items = this.el.nativeElement.querySelectorAll(
      ".ek-scroll-item"
    ) as NodeListOf<HTMLElement>;

    items.forEach(item => {
      this.renderer.removeClass(item, "animate");
    });
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
    const containerWidth = container.clientWidth;
    const itemWidth = item.scrollWidth;

    if (itemWidth > containerWidth) {
      item.style.setProperty("--item-width", `${itemWidth}px`);
      item.style.setProperty("--container-width", `${containerWidth}px`);
      this.renderer.addClass(item, "animate");
    }
  }
}
