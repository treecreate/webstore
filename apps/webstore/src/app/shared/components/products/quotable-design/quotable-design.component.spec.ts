import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QuotableDesignEnum } from '@assets';
import { DesignFontEnum, IQoutable } from '@interfaces';
import { QuotableDesignComponent } from './quotable-design.component';

describe('QuotableDesignComponent', () => {
  const design: IQoutable = {
    font: DesignFontEnum.archaLight,
    fontSize: 20,
    designSrc: QuotableDesignEnum.frame1,
    text: 'string',
  };
  let component: QuotableDesignComponent;
  let fixture: ComponentFixture<QuotableDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotableDesignComponent],
      imports: [RouterTestingModule, HttpClientModule, TextFieldModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotableDesignComponent);
    component = fixture.componentInstance;
    component.design = design;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
