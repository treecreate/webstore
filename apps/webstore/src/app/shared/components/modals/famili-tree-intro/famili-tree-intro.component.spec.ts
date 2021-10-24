import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliTreeIntroComponent } from './famili-tree-intro.component';

describe('FamiliTreeIntroComponent', () => {
  let component: FamiliTreeIntroComponent;
  let fixture: ComponentFixture<FamiliTreeIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamiliTreeIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliTreeIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
