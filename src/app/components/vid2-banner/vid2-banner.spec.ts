import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vid2BannerComponent } from './vid2-banner.component';

describe('VideoBanner', () => {
  let component: Vid2BannerComponent;
  let fixture: ComponentFixture<Vid2BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vid2BannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vid2BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
