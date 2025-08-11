import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../../environments/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent {
  isMenuOpen = false;
  currentUser: any = null;
  
  @ViewChild('loginModal') loginComponent!: LoginComponent;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
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

  search(query: string) {
    if (query && query.trim()) {
      console.log('Searching for:', query);
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchInput.nativeElement.value = '';
    }
  }
}