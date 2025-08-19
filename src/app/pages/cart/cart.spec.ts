import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService, CartItem } from '../../../services/cart.service';
import { BehaviorSubject, firstValueFrom, map } from 'rxjs';

class MockCartService {
  private items$ = new BehaviorSubject<CartItem[]>([
    { id: '1', name: 'Pepsi', price: 10, quantity: 2, pack: '6 cans', image: '' },
    { id: '2', name: 'Lays',  price:  5, quantity: 3, pack: 'bag',    image: '' },
  ]);

  cart$ = this.items$.asObservable();
  total$ = this.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  changeQty(id: string, pack: string, delta: number) {
    const copy = [...this.items$.value];
    const idx = copy.findIndex(i => i.id === id && i.pack === pack);
    if (idx >= 0) {
      const nextQty = Math.max(1, copy[idx].quantity + delta);
      copy[idx] = { ...copy[idx], quantity: nextQty };
      this.items$.next(copy);
    }
  }

  remove(id: string, pack: string) {
    this.items$.next(this.items$.value.filter(i => !(i.id === id && i.pack === pack)));
  }

  addItem(item: CartItem) {
    const copy = [...this.items$.value];
    const idx = copy.findIndex(i => i.id === item.id && i.pack === item.pack);
    if (idx >= 0) {
      copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
    } else {
      copy.unshift(item);
    }
    this.items$.next(copy);
  }
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockService: MockCartService;

  beforeEach(async () => {
    mockService = new MockCartService();

    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      providers: [{ provide: CartService, useValue: mockService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the cart component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total correctly (using total$)', async () => {
    const cart = await firstValueFrom(mockService.cart$);
    const expected = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = await firstValueFrom(component.total$);
    expect(total).toBe(expected);
  });

  it('should increase quantity of item', async () => {
    const before = await firstValueFrom(mockService.cart$);
    const target = before[0]; // Pepsi

    component.increaseQty(target);
    const after = await firstValueFrom(mockService.cart$);
    const updated = after.find(i => i.id === target.id && i.pack === target.pack)!;

    expect(updated.quantity).toBe(target.quantity + 1);
  });

  it('should decrease quantity but not below 1', async () => {
    // ensure the first item is at least 2
    let cart = await firstValueFrom(mockService.cart$);
    const t0 = cart[0];
    mockService.changeQty(t0.id, t0.pack, +(2 - t0.quantity)); // set to 2

    cart = await firstValueFrom(mockService.cart$);
    const target = cart[0];

    component.decreaseQty(target); // -> 1
    component.decreaseQty(target); // stays 1

    const after = await firstValueFrom(mockService.cart$);
    const updated = after.find(i => i.id === target.id && i.pack === target.pack)!;
    expect(updated.quantity).toBe(1);
  });

  it('should remove item from cart', async () => {
    const before = await firstValueFrom(mockService.cart$);
    const target = before[0];

    component.removeItem(target);
    const after = await firstValueFrom(mockService.cart$);

    expect(after.length).toBe(before.length - 1);
    expect(after.find(i => i.id === target.id && i.pack === target.pack)).toBeUndefined();
  });
});
