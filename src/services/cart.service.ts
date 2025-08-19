import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;          // product id (from Firestore)
  name: string;        // product.title
  price: number;       // unit price for the selected package (currentPrice)
  quantity: number;    // chosen quantity
  pack: string;        // selectedPackage name
  image: string;       // product.image
}

const STORAGE_KEY = 'cart_items_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  readonly cart$ = this.itemsSubject.asObservable();

  readonly total$ = this.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  get items(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  addItem(newItem: CartItem) {
    const items = [...this.itemsSubject.getValue()];
    // merge by (id + pack) so different packages are separate lines
    const idx = items.findIndex(i => i.id === newItem.id && i.pack === newItem.pack);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + newItem.quantity };
    } else {
      items.unshift(newItem);
    }
    this.commit(items);
  }

  changeQty(id: string, pack: string, delta: number) {
    const items = [...this.itemsSubject.getValue()];
    const idx = items.findIndex(i => i.id === id && i.pack === pack);
    if (idx >= 0) {
      const nextQty = Math.max(1, items[idx].quantity + delta);
      items[idx] = { ...items[idx], quantity: nextQty };
      this.commit(items);
    }
  }

  remove(id: string, pack: string) {
    const items = this.itemsSubject.getValue().filter(i => !(i.id === id && i.pack === pack));
    this.commit(items);
  }

  clear() {
    this.commit([]);
  }

  private commit(items: CartItem[]) {
    this.itemsSubject.next(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore storage errors */ }
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
