import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../environments/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  isOpen = false;
  currentForm: 'login' | 'register' | 'otp' = 'login';
  email = '';
  phone = '';
  password = '';
  otp = '';
  username = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.resetForms();
  }

  close() {
    this.isOpen = false;
    this.currentForm = 'login';
    this.errorMessage = '';
    document.body.style.overflow = '';
    this.resetForms();
  }

  private resetForms() {
    this.email = '';
    this.phone = '';
    this.password = '';
    this.otp = '';
    this.username = '';
    this.confirmPassword = '';
    this.errorMessage = '';
  }

  showRegister() {
    this.currentForm = 'register';
    this.errorMessage = '';
  }

  showLogin() {
    this.currentForm = 'login';
    this.errorMessage = '';
  }

  showOtp() {
    this.currentForm = 'otp';
    this.errorMessage = '';
  }

  sendOtp() {
    if (!this.phone) {
      this.errorMessage = 'Phone number is required';
      return;
    }

    this.isLoading = true;
    this.authService.initiatePhoneAuth(this.phone).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.exists) {
          this.close();
        } else {
          this.showRegister();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err;
        console.error('Phone auth failed', err);
      }
    });
  }

  verifyOtp() {
    // Implement OTP verification logic here
    this.errorMessage = 'OTP verification not implemented in this flow';
  }

  loginWithEmail() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.close();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err;
        console.error('Login failed', err);
      }
    });
  }

  register() {
    if (!this.email || !this.password || !this.username) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = '';
        alert('Registration successful! Please login');
        this.showLogin();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err;
        console.error('Registration failed', err);
      }
    });
  }
}