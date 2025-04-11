import { Directive, ElementRef, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

export interface DragPosition {
  absolute: { x: number, y: number };
  relative: { x: number, y: number };
}

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit, OnDestroy {
  // This directive allows an element to be draggable
  private element: HTMLElement;
  private dragging: boolean = false;
  private offset = { x: 0, y: 0 };

  // Bound event handlers to ensure proper removal
  private boundMouseMove: any;
  private boundMouseUp: any;
  private boundTouchMove: any;
  private boundTouchEnd: any;

  @Output() dragEnd = new EventEmitter<DragPosition>();

  constructor(private elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.onTouchEnd.bind(this);
  }

  ngOnInit() {
    this.element.style.position = 'absolute';
    this.initDragListeners();
  }

  private initDragListeners() {
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);

    // Touch support
    this.element.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.boundTouchMove);
    document.addEventListener('touchend', this.boundTouchEnd);
  }

  private getRelativePosition() {
    // Get position relative to parent
    const parentRect = this.element.parentElement?.getBoundingClientRect() ||
                       { left: 0, top: 0, width: 0, height: 0 };
    const elemRect = this.element.getBoundingClientRect();

    return {
      absolute: { x: elemRect.left, y: elemRect.top },
      relative: {
        x: parseFloat(this.element.style.left) || 0,
        y: parseFloat(this.element.style.top) || 0
      }
    };
  }

  private onMouseDown(event: MouseEvent) {
    const parentBound = this.element.parentElement?.getBoundingClientRect() ||
                       { left: 0, top: 0, width: 0, height: 0 };
    this.dragging = true;
    this.offset.x = event.clientX - this.element.getBoundingClientRect().left + parentBound.left;
    this.offset.y = event.clientY - this.element.getBoundingClientRect().top;

    event.preventDefault();
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.dragging) return;

    const x = event.clientX - this.offset.x;
    const y = event.clientY - this.offset.y;

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  private onMouseUp() {
    if (this.dragging) {
      this.emitPosition();
    }
    this.dragging = false;
  }

  private onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.dragging = true;
      const touch = event.touches[0];
      this.offset.x = touch.clientX - this.element.getBoundingClientRect().left;
      this.offset.y = touch.clientY - this.element.getBoundingClientRect().top;
      event.preventDefault();
    }
  }

  private onTouchMove(event: TouchEvent) {
    if (!this.dragging || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const x = touch.clientX - this.offset.x;
    const y = touch.clientY - this.offset.y;

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    event.preventDefault();
  }

  private onTouchEnd() {
    if (this.dragging) {
      this.emitPosition();
    }
    this.dragging = false;
  }

  private emitPosition() {
    const position = this.getRelativePosition();
    this.dragEnd.emit(position);
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.removeEventListener('touchmove', this.boundTouchMove);
    document.removeEventListener('touchend', this.boundTouchEnd);
  }
}
