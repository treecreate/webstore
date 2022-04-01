import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FamilyTreeComponent } from './family-tree.component';

describe('FamilyTreeComponent', () => {
  let component: FamilyTreeComponent;
  let fixture: ComponentFixture<FamilyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyTreeComponent],
      imports: [RouterTestingModule, HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
