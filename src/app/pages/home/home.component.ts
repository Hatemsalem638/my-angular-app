import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OffersComponent, OFFERS } from '../offers/offers.component';
import { MainBannerComponent } from '../../components/main-banner/main-banner.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { VideoBannerComponent } from '../../components/video-banner/video-banner.component';
import { OffersBannerComponent } from '../../components/offers-banner/offers-banner.component'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  featuredOffers = [...OFFERS].sort(() => 0.5 - Math.random()).slice(0, 4);
  
  updateQuantity = OffersComponent.prototype.updateQuantity;
  addToCart = OffersComponent.prototype.addToCart;
}