import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[webstoreParallax]'
})
export class ParallaxDirective {

  //This parameter is used to configure the the amount of distance an element with this directive moves on a unit scroll.
  @Input('ratio') parallaxRatio : number = 1
  
  //This property indicates the initial vertical position of the element on which the directive is applied.
  initialTop : number = 0

  constructor(private eleRef : ElementRef) {
    this.initialTop = this.eleRef.nativeElement.getBoundingClientRect().top
  }

  //called on the window scroll event using the HostListener decorator. The HostListener passes the scroll event to the method.
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event) {
    this.eleRef.nativeElement.style.top = (this.initialTop - (window.scrollY * this.parallaxRatio)) + 'px'
  }

}
