import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [],
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

  it('should have parallax <div>', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector(
      '.parallax-img'
    );
    expect(div.style.backgroundImage).toBe(``);
  });
});
