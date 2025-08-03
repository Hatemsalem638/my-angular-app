import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OffersBannerComponent } from './offers-banner.component';
import { Router } from '@angular/router';

describe('OffersBannerComponent', () => {
  let component: OffersBannerComponent;
  let fixture: ComponentFixture<OffersBannerComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersBannerComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OffersBannerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component['rotationTimer']) {
      clearInterval(component['rotationTimer']);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with two offers', () => {
    expect(component['currentOffers'].length).toBe(2);
    expect(component['currentOffers'][0]).toBeDefined();
    expect(component['currentOffers'][1]).toBeDefined();
    expect(component['currentOffers'][0].id).not.toBe(component['currentOffers'][1].id);
  });

  it('should automatically rotate offers', fakeAsync(() => {
    const initialFirstOffer = component['currentOffers'][0];
    const initialSecondOffer = component['currentOffers'][1];
    
    tick(component['rotationInterval']);
    
    fixture.detectChanges();
    
    expect(component['currentOffers'][0].id).not.toBe(initialFirstOffer.id);
    expect(component['currentOffers'][1].id).not.toBe(initialSecondOffer.id);
  }));

  it('should navigate to offer when clicked', () => {
    const firstOfferLink = component['currentOffers'][0].link;
    component.navigateToOffer(firstOfferLink);
    expect(router.navigate).toHaveBeenCalledWith([firstOfferLink]);
  });

  it('should not show duplicate offers', () => {
    const currentIds = component['currentOffers'].map(offer => offer.id);
    expect(currentIds[0]).not.toBe(currentIds[1]);
  });

  it('should recycle offers when all have been shown', () => {
    component['allOffers'].forEach(offer => {
      component['currentOffers'] = [offer, offer]; 
    });
    
    component['rotateOffers']();
    
    expect(component['currentOffers'].length).toBe(2);
    expect(component['currentOffers'][0].id).not.toBe(component['currentOffers'][1].id);
  });

  it('should clean up rotation timer on destroy', () => {
    spyOn(component as any, 'stopRotation');
    component.ngOnDestroy();
    expect(component['stopRotation']).toHaveBeenCalled();
  });
});