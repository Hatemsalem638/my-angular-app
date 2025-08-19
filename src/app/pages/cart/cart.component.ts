import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { CartService, CartItem } from '../../../services/cart.service';

type DeliveryOption = 'standard' | 'express' | 'scheduled';
type PaymentMethod = 'cod' | 'card' | 'wallet';

interface Address {
  id: string;
  title: string;
  line1: string;
  line2?: string;
  city?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent {
  // 1) Service is created first (so it's available to fields below)
  private cartService = inject(CartService);

  // 2) Streams that depend on the service
  cart$: Observable<CartItem[]> = this.cartService.cart$;
  subtotal$: Observable<number> = this.cartService.total$;

  // -------- Checkout (left side) state --------
  addresses: Address[] = [
    {
      id: 'addr-1',
      title: 'Main Office (Default)',
      line1: '123 Business District',
      line2: 'Building A, 4th Floor',
      city: 'Cairo',
      country: 'Egypt',
      phone: '+20 11 2345 6789',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Warehouse',
      line1: '456 Industrial Area',
      city: 'Giza',
      country: 'Egypt',
      phone: '+20 10 1234 5678',
    },
  ];
  selectedAddressId: string = this.addresses.find(a => a.isDefault)?.id || this.addresses[0].id;

  deliveryOption: DeliveryOption = 'standard';
  scheduleDate: string | null = null; // yyyy-MM-dd
  scheduleTime: string | null = null; // HH:mm

  paymentMethod: PaymentMethod = 'cod';

  // 3) Shipping + totals
  private readonly SHIPPING_STANDARD = 0;
  private readonly SHIPPING_EXPRESS = 50;
  private readonly SHIPPING_SCHEDULED = 0;

  shippingFee$ = new BehaviorSubject<number>(this.SHIPPING_STANDARD);
  grandTotal$ = combineLatest([this.subtotal$, this.shippingFee$]).pipe(
    map(([sub, ship]) => sub + ship)
  );

  // -------- UI handlers --------
  selectAddress(id: string) {
    this.selectedAddressId = id;
  }

  setDelivery(option: DeliveryOption) {
    this.deliveryOption = option;
    if (option === 'express') this.shippingFee$.next(this.SHIPPING_EXPRESS);
    else if (option === 'scheduled') this.shippingFee$.next(this.SHIPPING_SCHEDULED);
    else this.shippingFee$.next(this.SHIPPING_STANDARD);
  }

  setPayment(method: PaymentMethod) {
    this.paymentMethod = method;
  }

  increaseQty(item: CartItem) {
    this.cartService.changeQty(item.id, item.pack, +1);
  }

  decreaseQty(item: CartItem) {
    this.cartService.changeQty(item.id, item.pack, -1);
  }

  removeItem(item: CartItem) {
    this.cartService.remove(item.id, item.pack);
  }

  trackByKey = (_: number, item: CartItem) => `${item.id}__${item.pack}`;

  placeOrder() {
    console.log('Placing order with:', {
      address: this.addresses.find(a => a.id === this.selectedAddressId),
      deliveryOption: this.deliveryOption,
      scheduleDate: this.scheduleDate,
      scheduleTime: this.scheduleTime,
      paymentMethod: this.paymentMethod,
    });
    alert('Order placed (demo)!');
  }
}
