import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class CategoriesComponent {
  categories = [
    { name: 'Pepsi', image: 'assets/brands/pepsi.jpg' },
    { name: 'Aquafina', image: 'assets/brands/aquafina.jpg' },
    { name: '7UP', image: 'assets/brands/7up.jpg' },
    { name: 'Mirinda', image: 'assets/brands/mirinda.jpg' },
    { name: 'Juhayna', image: 'assets/brands/juhayna.jpg' },
    { name: 'Mountain Dew', image: 'assets/brands/mountaindew.jpg' },
    { name: 'Tropicana', image: 'assets/brands/tropicana.jpg' },
    { name: 'Lipton', image: 'assets/brands/lipton.jpg' }
  ];
}