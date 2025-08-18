import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer-banner',
  templateUrl: './footer-banner.html',
  styleUrls: ['./footer-banner.scss']
})
export class FooterBannerComponent {
  currentYear: number = new Date().getFullYear();
}