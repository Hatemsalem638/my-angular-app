import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-search-bar',
  templateUrl: './searchbar.html',
  styleUrls: ['./searchbar.scss'],
  imports: [FormsModule]
})
export class SearchBarComponent implements OnDestroy {
  @Output() searchTriggered = new EventEmitter<string>();
  
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  constructor() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged() 
    ).subscribe(term => {
      if (term.length >= 3) {
        this.searchTriggered.emit(term);
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
}