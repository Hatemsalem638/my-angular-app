import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map, of, catchError } from 'rxjs';

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
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  
  products$!: Observable<Product[]>;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    try {
      const productsCollection = collection(this.firestore, 'products');
      this.products$ = collectionData(productsCollection, { idField: 'id' }).pipe(
        map(products => {
          this.isLoading = false;
          return products.map(product => {
            const normalizedProduct = this.normalizeProduct(product);
            return {
              ...normalizedProduct,
              currentPrice: this.calculatePrice(normalizedProduct)
            };
          });
        }),
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load products. Please try again later.';
          console.error('Error loading products:', error);
          return of([]);
        })
      );
    } catch (error) {
      this.isLoading = false;
      this.errorMessage = 'Failed to initialize products service.';
      console.error('Initialization error:', error);
      this.products$ = of([]);
    }
  }

  private normalizeProduct(product: any): Product {
    const basePrice = product.basePrice || product.price || 0;
    
    return {
      ...product,
      quantity: product.quantity || 1,
      basePrice: basePrice,
      selectedPackage: product.selectedPackage || this.getDefaultPackage(product),
      packageOptions: this.normalizePackageOptions(product.packageOptions, basePrice),
      currentPrice: 0 
    };
  }

  private normalizePackageOptions(options: any, basePrice: number): PackageOption[] {
    if (!options || !options.length) {
      return [
        this.createPackageOption('6 cans (pack)', 6, 1, basePrice, 0),
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