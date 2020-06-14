import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('search') searchForm: NgForm;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  searchProducts() {
    const searchQuery = this.searchForm.value['searchQuery'];

    if (searchQuery) {
      this.router.navigate(['/produkty'], {queryParams: {'search': searchQuery}});
    }

  }

}
