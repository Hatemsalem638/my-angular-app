import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  startAt,
  endAt,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  of,
  map,
  catchError,
  switchMap,
  distinctUntilChanged,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';

interface PackageOption {
  name: string;
  size: number;
  priceMultiplier: number;
  totalPrice?: number;
  pricePerUnit?: string;
  discount?: number;
}

interface Product {
  id: string;
  title: string;
  basePrice: number;
  image: string;
  packageOptions: PackageOption[];
  selectedPackage: string;
  quantity: number;
  currentPrice: number;

  brand?: string;   
  type?: string;    
}

type SortField = 'title' | 'price';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);

  products$!: Observable<Product[]>;
  isLoading = true;
  errorMessage = '';

  selectedSort = 'name-asc';
  private sortField$ = new BehaviorSubject<SortField>('title');
  private sortDir$   = new BehaviorSubject<SortDir>('asc');

  private brandFilter$ = new BehaviorSubject<Set<string>>(new Set());
  private typeFilter$  = new BehaviorSubject<Set<string>>(new Set());

  private priceMin$ = new BehaviorSubject<number | null>(null);
  private priceMax$ = new BehaviorSubject<number | null>(null);

  priceMinInput: number | null = null;
  priceMaxInput: number | null = null;

  availableBrands$!: Observable<string[]>;
  availableTypes$!: Observable<string[]>;

  private brandLogos: Record<string, string> = {
    'pepsi': 'assets/brands/pepsi.svg',
    '7up': 'assets/brands/7up.svg',
  };

  ngOnInit(): void {
    const productsCol = collection(this.firestore, 'products');

    const baseProducts$ = this.route.queryParamMap.pipe(
      map(params => (params.get('q') || '').trim()),
      distinctUntilChanged(),
      switchMap(term => {
        this.isLoading = true;

        if (term.length < 3) {
          return collectionData(productsCol, { idField: 'id' });
        }

        const qRef = query(
          productsCol,
          orderBy('title'),
          startAt(term),
          endAt(term + '\uf8ff')
        );
        return collectionData(qRef, { idField: 'id' });
      }),
      map((products: any[]) => {
        this.isLoading = false;
        return products.map(p => {
          const normalized = this.normalizeProduct(p);
          return { ...normalized, currentPrice: this.calculatePrice(normalized) };
        });
      }),
      catchError(error => {
        console.error('Error loading products/search:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load products. Please try again later.';
        return of([]);
      })
    );

    this.availableBrands$ = baseProducts$.pipe(
      map(ps => Array.from(
        new Set(ps.map(p => (p.brand || '').trim()).filter(Boolean).map(b => b))
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))
    );

    this.availableTypes$ = baseProducts$.pipe(
      map(ps => Array.from(
        new Set(ps.map(p => (p.type || '').trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })))
    );

    this.products$ = combineLatest([
      baseProducts$,
      this.brandFilter$,
      this.typeFilter$,
      this.priceMin$,
      this.priceMax$,
      this.sortField$,
      this.sortDir$
    ]).pipe(
      map(([products, brandSet, typeSet, min, max, sortField, sortDir]) => {
        const filtered = products.filter(p => {
          const passesBrand =
            brandSet.size === 0 || (p.brand && brandSet.has(p.brand.toLowerCase()));
          const passesType =
            typeSet.size === 0 || (p.type && typeSet.has(p.type.toLowerCase()));
          const price = Number.isFinite(p.currentPrice) ? p.currentPrice : p.basePrice;
          const passesMin = (min == null) || price >= min;
          const passesMax = (max == null) || price <= max;
          return passesBrand && passesType && passesMin && passesMax;
        });

        return this.sortProducts(filtered, sortField, sortDir);
      })
    );
  }

  toggleBrand(brand: string) {
    const key = (brand || '').toLowerCase().trim();
    const next = new Set(this.brandFilter$.getValue());
    if (next.has(key)) next.delete(key); else next.add(key);
    this.brandFilter$.next(next);
  }

  isBrandActive(brand: string): boolean {
    return this.brandFilter$.getValue().has((brand || '').toLowerCase().trim());
  }

  toggleType(type: string) {
    const key = (type || '').toLowerCase().trim();
    const next = new Set(this.typeFilter$.getValue());
    if (next.has(key)) next.delete(key); else next.add(key);
    this.typeFilter$.next(next);
  }

  isTypeActive(type: string): boolean {
    return this.typeFilter$.getValue().has((type || '').toLowerCase().trim());
  }

  applyPriceRange() {
    let min = this.priceMinInput;
    let max = this.priceMaxInput;

    if (min != null && max != null && min > max) {
      const t = min; min = max; max = t;
      this.priceMinInput = min; this.priceMaxInput = max;
    }

    this.priceMin$.next(min == null || Number.isNaN(min) ? null : Number(min));
    this.priceMax$.next(max == null || Number.isNaN(max) ? null : Number(max));
  }

  clearAllFilters() {
    this.brandFilter$.next(new Set());
    this.typeFilter$.next(new Set());
    this.priceMinInput = null;
    this.priceMaxInput = null;
    this.priceMin$.next(null);
    this.priceMax$.next(null);
  }

  brandLogo(brand: string): string | null {
    const key = (brand || '').toLowerCase().trim();
    return this.brandLogos[key] || null;
  }

  onSortChange(value: string) {
    this.selectedSort = value;
    switch (value) {
      case 'name-asc':
        this.sortField$.next('title'); this.sortDir$.next('asc'); break;
      case 'name-desc':
        this.sortField$.next('title'); this.sortDir$.next('desc'); break;
      case 'price-asc':
        this.sortField$.next('price'); this.sortDir$.next('asc'); break;
      case 'price-desc':
        this.sortField$.next('price'); this.sortDir$.next('desc'); break;
    }
  }

  private sortProducts(products: Product[], field: SortField, dir: SortDir): Product[] {
    const copy = [...products];
    copy.sort((a, b) => {
      let cmp = 0;
      if (field === 'title') {
        cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
      } else {
        const pa = Number.isFinite(a.currentPrice) ? a.currentPrice : a.basePrice;
        const pb = Number.isFinite(b.currentPrice) ? b.currentPrice : b.basePrice;
        cmp = pa - pb;
      }
      return dir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }

  private normalizeProduct(product: any): Product {
    const basePrice = product.basePrice || product.price || 0;

    return {
      ...product,
      quantity: product.quantity || 1,
      basePrice: basePrice,
      selectedPackage: product.selectedPackage || this.getDefaultPackage(product),
      packageOptions: this.normalizePackageOptions(product.packageOptions, basePrice),
      currentPrice: 0,
      brand: (product.brand || '').trim(),
      type: (product.type || '').trim()
    };
  }

  private normalizePackageOptions(options: any, basePrice: number): PackageOption[] {
    if (!options || !options.length) {
      return [
        this.createPackageOption('6 cans (pack)', 6, 1,   basePrice,  0),
        this.createPackageOption('12 cans (box)', 12, 1.8, basePrice, 10),
        this.createPackageOption('24 cans (case)', 24, 3.2, basePrice, 20)
      ];
    }

    if (typeof options[0] === 'string') {
      return options.map((opt: string) => ({
        name: opt,
        size: this.getSizeFromPackageName(opt),
        priceMultiplier: this.getMultiplierFromPackageName(opt)
      }));
    }

    return options.map((opt: any) => ({
      name: opt.name || '6 cans (pack)',
      size: opt.size || 6,
      priceMultiplier: opt.priceMultiplier || 1
    }));
  }

  private createPackageOption(
    name: string,
    size: number,
    multiplier: number,
    basePrice: number,
    discount: number
  ): PackageOption {
    const totalPrice = basePrice * multiplier;
    return {
      name,
      size,
      priceMultiplier: multiplier,
      totalPrice,
      pricePerUnit: (totalPrice / size).toFixed(2),
      discount
    };
  }

  private getDefaultPackage(product: any): string {
    return product.packageOptions?.[0]?.name ||
      (typeof product.packageOptions?.[0] === 'string' ? product.packageOptions[0] : '6 cans (pack)');
  }

  private getSizeFromPackageName(packageName: string): number {
    const sizeMatch = packageName.match(/\d+/);
    return sizeMatch ? parseInt(sizeMatch[0], 10) : 6;
  }

  private getMultiplierFromPackageName(packageName: string): number {
    if (packageName.includes('12')) return 1.8;
    if (packageName.includes('24')) return 3.2;
    return 1;
  }

  getOptionDisplay(optionName: string): string {
    const quantityMatch = optionName.match(/(\d+\s*cans)/i);
    return quantityMatch ? quantityMatch[0] : optionName;
  }

  calculatePrice(product: Product): number {
    const selectedOption = product.packageOptions.find(opt => opt.name === product.selectedPackage);
    return selectedOption ? product.basePrice * selectedOption.priceMultiplier : product.basePrice;
  }

  getPriceDisplay(price: number): string {
    return `${price.toFixed(2)} EGP`;
  }

  getOptionPrice(product: Product, option: PackageOption): string {
    return this.getPriceDisplay(product.basePrice * option.priceMultiplier);
  }

  selectPackage(product: Product, packageName: string): void {
    product.selectedPackage = packageName;
    product.currentPrice = this.calculatePrice(product);

    if (this.sortField$.getValue() === 'price') {
      this.sortDir$.next(this.sortDir$.getValue());
    }
  }

  updateQuantity(product: Product, change: number): void {
    product.quantity = Math.max(1, product.quantity + change);
  }

  addToCart(product: Product): void {
    const cartItem = {
      ...product,
      totalPrice: product.currentPrice * product.quantity,
      selectedPackageDetails: product.packageOptions.find(opt => opt.name === product.selectedPackage)
    };
    console.log('Added to cart:', cartItem);
  }
}
