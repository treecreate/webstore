import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FamilyTreeDesignComponent } from './family-tree-design.component';

describe('FamilyTreeDesignComponent', () => {
  let component: FamilyTreeDesignComponent;
  let fixture: ComponentFixture<FamilyTreeDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyTreeDesignComponent],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeDesignComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
