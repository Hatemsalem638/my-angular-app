import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { OffersComponent } from './pages/offers/offers.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Home - Beverage Store'
  },
  { 
    path: 'products', 
    component: ProductsComponent,
    title: 'Our Products' 
  },
  { 
    path: 'offers', 
    component: OffersComponent,
    title: 'Special Offers' 
  },
  { path: '**', redirectTo: '' } // 404 handling
];