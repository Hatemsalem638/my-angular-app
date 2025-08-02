import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-banner',
  standalone: true,
  templateUrl: './video-banner.html',
  styleUrls: ['./video-banner.scss']
})
export class VideoBannerComponent {
  constructor(private router: Router) {}

  redirectToOffers() {
    this.router.navigate(['/offers']);
  }

  redirectToProducts() {
    this.router.navigate(['/products']); 
  }
}