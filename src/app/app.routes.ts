import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { OffersComponent } from './pages/offers/offers.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Home'
  },
  { 
    path: 'products', 
    component: ProductsComponent,
    title: 'Products' 
  },
  { 
    path: 'offers', 
    component: OffersComponent,
    title: 'Special Offers' 
  },
  { path: 'cart', component: CartComponent, title: 'Your Cart' },
  
  { path: '**', redirectTo: '' } 
];