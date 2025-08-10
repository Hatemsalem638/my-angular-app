import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export const OFFERS = [
  {
    id: 1,
    title: '7UP Can',
    price: '500 EGP',
    image: 'assets/products/7uppack.jpg',
    packageOptions: ['6 cans (pack)', '12 cans (box)', '24 cans (big box)'],
    selectedPackage: '6 cans (pack)',
    quantity: 1
  },
  {
    id: 2,
    title: 'Cherry Cola Can',
    price: '500 EGP',
    image: 'assets/products/cherrycolapack.jpg',
    packageOptions: ['6 cans (pack)', '12 cans (box)', '24 cans (big box)'],
    selectedPackage: '6 cans (pack)',
    quantity: 1
  },
  {
    id: 3,
    title: 'Pepsi Max Can',
    price: '500 EGP',
    image: 'assets/products/pepsimaxpack.jpg',
    packageOptions: ['6 cans (pack)', '12 cans (box)', '24 cans (big box)'],
    selectedPackage: '6 cans (pack)',
    quantity: 1
  },
  {
    id: 4,
    title: 'Pepsi Can',
    price: '500 EGP',
    image: 'assets/products/pepsipack.jpg',
    packageOptions: ['6 cans (pack)', '12 cans (box)', '24 cans (big box)'],
    selectedPackage: '6 cans (pack)',
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

  selectPackage(offer: any, option: string) {
    const fullOption = offer.packageOptions.find((p: string) => p.startsWith(option));
    if (fullOption) {
      offer.selectedPackage = fullOption;
    }
  }

  updateQuantity(offer: any, change: number) {
    offer.quantity = Math.max(1, offer.quantity + change);
  }

  addToCart(offer: any) {
    console.log(`Added ${offer.quantity} ${offer.selectedPackage} of ${offer.title} to cart`);
    offer.quantity = 1;
    offer.selectedPackage = '6 cans (pack)';
  }
}