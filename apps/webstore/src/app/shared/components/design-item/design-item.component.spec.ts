import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignItemComponent } from './design-item.component';

describe('DesignItemComponent', () => {
  let component: DesignItemComponent;
  let fixture: ComponentFixture<DesignItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
