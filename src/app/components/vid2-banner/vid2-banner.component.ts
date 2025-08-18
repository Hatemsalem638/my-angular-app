
import { Component,Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vid2-banner',
  standalone: true,
  templateUrl: './vid2-banner.html',
  styleUrls: ['./vid2-banner.scss'],
  imports: [Vid2BannerComponent]
})
export class Vid2BannerComponent {
  @Input() src?: string;
  @Input() poster?: string;
  @Input() autoplay: boolean = false;
  @Input() loop: boolean = false;
  @Input() muted: boolean = false;
  @Input() title?: string;
  @Input() subtitle?: string;
  constructor(private router: Router) {}

  redirectToOffers() {
    this.router.navigate(['/offers']);
  }

  redirectToProducts() {
    this.router.navigate(['/products']); 
  }
}
