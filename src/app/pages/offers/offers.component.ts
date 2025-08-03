import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Export the offers array and component class
export const OFFERS = [
  {
    id: 1,
    title: '7UP Can',
    price: '500 EGP',
    image: 'assets/products/7uppack.jpg',
    packageOptions: ['6 cans', '12 cans', '24 cans'],
    selectedPackage: '6 cans',
    quantity: 1
  },
  {
    id: 2,
    title: 'Cherry Cola Can',
    price: '500 EGP',
    image: 'assets/products/cherrycolapack.jpg',
    packageOptions: ['6 cans', '12 cans', '24 cans'],
    selectedPackage: '6 cans',
    quantity: 1
  },
  {
    id: 3,
    title: 'Pepsi Max Can',
    price: '500 EGP',
    image: 'assets/products/pepsimaxpack.jpg',
    packageOptions: ['6 cans', '12 cans', '24 cans'],
    selectedPackage: '6 cans',
    quantity: 1
  },
  {
    id: 4,
    title: 'Pepsi Can',
    price: '500 EGP',
    image: 'assets/products/pepsipack.jpg',
    packageOptions: ['6 cans', '12 cans', '24 cans'],
    selectedPackage: '6 cans',
    quantity: 1
  }
];

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.html',
  styleUrls: ['./offers.scss']
})
export class OffersComponent {
  offers = OFFERS;

  updateQuantity(offer: any, change: number) {
    offer.quantity = Math.max(1, offer.quantity + change);
  }

  addToCart(offer: any) {
    console.log(`Added ${offer.quantity} ${offer.selectedPackage} of ${offer.title} to cart`);
    offer.quantity = 1;
    offer.selectedPackage = '6 cans';
  }
}