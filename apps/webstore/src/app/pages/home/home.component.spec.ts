import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParallaxDirective } from '../../shared/directives/parallax/parallax.directive';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [ParallaxDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    expect(component.title).toBe('homeComponent');
  });
});
