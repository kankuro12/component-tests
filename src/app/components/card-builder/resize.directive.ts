import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit {
  @Output() onResize = new EventEmitter<{ width: number; height: number }>();
  @Input() resizeDebounce = 100; // Optional debounce time in ms

  private timeoutId: any;
  private initialWidth!: number;
  private initialHeight!: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    //set css
    this.el.nativeElement.style.resize = 'both';
    this.el.nativeElement.style.overflow = 'auto';

    // Store initial dimensions
    this.initialWidth = this.el.nativeElement.clientWidth;
    this.initialHeight = this.el.nativeElement.clientHeight;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    // Clear timeout if it exists
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set a new timeout to debounce resize events
    this.timeoutId = setTimeout(() => {
      const width = this.el.nativeElement.clientWidth;
      const height = this.el.nativeElement.clientHeight;

      // Emit only if dimensions actually changed
      if (width !== this.initialWidth || height !== this.initialHeight) {
        this.onResize.emit({ width, height });

        // Update stored dimensions
        this.initialWidth = width;
        this.initialHeight = height;
      }
    }, this.resizeDebounce);
  }
}
