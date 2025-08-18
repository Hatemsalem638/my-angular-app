import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterBannerComponent } from './footer-banner.component';

describe('FooterBannerComponent', () => {
  let component: FooterBannerComponent;
  let fixture: ComponentFixture<FooterBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = new Date().getFullYear();
    const yearElement = fixture.nativeElement.querySelector('.footer-bottom span');
    expect(yearElement.textContent).toContain(currentYear.toString());
  });

  it('should have 4 footer sections', () => {
    const sections = fixture.nativeElement.querySelectorAll('.footer-section');
    expect(sections.length).toBe(4);
  });
});