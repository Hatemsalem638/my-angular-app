import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterBannerComponent } from './components/footer-banner/footer-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, CommonModule, FooterBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}