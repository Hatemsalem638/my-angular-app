import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { map } from 'rxjs';

import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../../environments/auth.service';
import { SearchBarComponent } from '../searchbar/searchbar.component';
import { CartService } from '../../../services/cart.service'; // adjust path if needed

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent, SearchBarComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  isMenuOpen = false;
  currentUser: any = null;

  @ViewChild('loginModal') loginComponent!: LoginComponent;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // inject CartService as a field (avoids "used before initialization" errors)
  private cartService = inject(CartService);

  // live cart counter (total quantity of items)
  readonly count$ = this.cartService.cart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  constructor(private router: Router, private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  openLogin() {
    this.loginComponent?.open();
  }

  logout() {
    this.authService.logout();
  }

  onSearch(searchTerm: string) {
    const q = (searchTerm || '').trim();
    if (q.length >= 3) {
      this.router.navigate(['/products'], { queryParams: { q } });
    }
  }
}
