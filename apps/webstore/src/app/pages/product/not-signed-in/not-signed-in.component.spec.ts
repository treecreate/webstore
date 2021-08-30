import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSignedInComponent } from './not-signed-in.component';

describe('NotSignedInComponent', () => {
  let component: NotSignedInComponent;
  let fixture: ComponentFixture<NotSignedInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotSignedInComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotSignedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
