import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OffersComponent, OFFERS } from '../offers/offers.component';
import { MainBannerComponent } from '../../components/main-banner/main-banner.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { VideoBannerComponent } from '../../components/video-banner/video-banner.component';
import { OffersBannerComponent } from '../../components/offers-banner/offers-banner.component';

interface Offer {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
  selectedPackage: string;
  packageOptions: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MainBannerComponent,
    CategoriesComponent,
    VideoBannerComponent,
    OffersComponent,
    OffersBannerComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  featuredOffers: Offer[] = [...OFFERS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .map(offer => ({
      ...offer,
      quantity: 1,
      selectedPackage: offer.packageOptions?.[0] || '6 cans',
      packageOptions: offer.packageOptions || ['6 cans', '12 cans', '24 cans']
    }));

  updateQuantity(offer: Offer, change: number): void {
    const newQuantity = offer.quantity + change;
    if (newQuantity >= 1) {
      offer.quantity = newQuantity;
    }
  }

  
  addToCart(offer: Offer): void {
    console.log('Added to cart:', {
      ...offer,
      totalPrice: this.calculateTotalPrice(offer)
    });
  }

 
  selectPackage(offer: Offer, packageOption: string): void {
    offer.selectedPackage = packageOption;
    console.log('Package selected:', packageOption, 'for', offer.title);
  }

 
  private calculateTotalPrice(offer: Offer): string {
    const priceValue = parseFloat(offer.price.replace(/[^0-9.]/g, ''));
    
    let multiplier = 1;
    if (offer.selectedPackage.includes('12')) multiplier = 2;
    if (offer.selectedPackage.includes('24')) multiplier = 4;
    
    const total = priceValue * multiplier * offer.quantity;
    return `$${total.toFixed(2)}`;
  }
}