import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDisplayComponent } from './design-display.component';

describe('DesignDisplayComponent', () => {
  let component: DesignDisplayComponent;
  let fixture: ComponentFixture<DesignDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
