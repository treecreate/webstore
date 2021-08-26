import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPopoverComponent } from './info-popover.component';

describe('InfoPopoverComponent', () => {
  let component: InfoPopoverComponent;
  let fixture: ComponentFixture<InfoPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
