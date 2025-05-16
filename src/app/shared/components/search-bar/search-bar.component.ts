import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../../../core/services/search.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    OverlayPanelModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  isSearching = false;

  constructor(private searchService: SearchService, private router: Router) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.length >= 3) {
          this.performSearch(value);
        } else {
          this.searchResults = [];
        }
      });
  }

  performSearch(query: string) {
    this.isSearching = true;
    this.searchService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error in search:', error);
        this.isSearching = false;
      },
    });
  }

  navigateToResult(result: any) {
    let route: string;

    switch (result.type) {
      case 'concept':
        route = `/concepts/${result.id}`;
        break;
      case 'process':
        route = `/processes/${result.id}`;
        break;
      case 'glossary':
        route = `/glossary/${result.id}`;
        break;
      case 'file':
        route = `/content/file/${result.id}`;
        break;
      default:
        return;
    }

    this.router.navigate([route]);
    this.searchControl.setValue('');
    this.searchResults = [];
  }

  onSearchSubmit() {
    const query = this.searchControl.value;
    if (query && query.length >= 3) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchControl.setValue('');
      this.searchResults = [];
    }
  }
}
