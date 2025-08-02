import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MainBannerComponent } from '../../components/main-banner/main-banner.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { VideoBannerComponent } from '../../components/video-banner/video-banner.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MainBannerComponent, CategoriesComponent, VideoBannerComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {}
