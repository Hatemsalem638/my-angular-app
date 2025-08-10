import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-banner',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './offers-banner.html',
  styleUrls: ['./offers-banner.scss']
})
export class OffersBannerComponent implements OnInit, OnDestroy {
  allOffers = [
    { id: 1, src: 'assets/offers/offer1.jpg', alt: 'Summer Sale', link: '/offers/summer' },
    { id: 2, src: 'assets/offers/offer2.jpg', alt: 'New Arrivals', link: '/products/new' },
    { id: 3, src: 'assets/offers/offer3.jpg', alt: 'Clearance', link: '/clearance' },
    { id: 4, src: 'assets/offers/offer4.jpg', alt: 'Bundle Deal', link: '/bundles' }
  ];
  
  currentOffers: any[] = [];
  rotationInterval = 3000; 
  private rotationTimer: any;
  private destroyed = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setInitialOffers();
    this.startRotation();
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.stopRotation();
  }

  setInitialOffers() {
    this.currentOffers = [this.allOffers[0], this.allOffers[1]];
  }

  startRotation() {
    this.rotationTimer = setInterval(() => {
      this.rotateOffers();
      if (!this.destroyed) {
        this.cdr.detectChanges();
      }
    }, this.rotationInterval);
  }

  stopRotation() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
  }

  rotateOffers() {
    const currentIds = this.currentOffers.map(offer => offer.id);
    const availableOffers = this.allOffers.filter(offer => !currentIds.includes(offer.id));
    
    if (availableOffers.length >= 2) {
      const shuffled = [...availableOffers].sort(() => 0.5 - Math.random());
      this.currentOffers = shuffled.slice(0, 2);
    } else {
      this.currentOffers = [this.allOffers[0], this.allOffers[1]];
    }
  }

  navigateToOffer(link: string) {
    this.router.navigate([link]);
  }
}