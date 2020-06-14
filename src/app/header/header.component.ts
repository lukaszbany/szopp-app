import {Component, OnInit, ViewChild} from '@angular/core';
import {CartService} from '../service/cart/cart.service';
import {ProductService} from '../service/product/product.service';
import {CategoryService} from '../service/product/category.service';
import {Category} from '../model/category/category.model';
import {AuthService} from '../service/auth/auth.service';
import {UserData} from '../model/user.data.model';
import {Role} from '../model/user/role.model';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  sideNavOpened: boolean;
  categoriesExpanded: boolean;
  userMenuExpanded: boolean;

  userData: UserData;
  itemInCartCount: number;
  categories: Category[];

  constructor(private cartService: CartService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadSideNav();
    this.loadCart();
    this.loadCategories();
    this.loadLogged();
  }

  private loadSideNav() {
    this.closeEverything()

    this.router.events.subscribe(event => {
      this.closeEverything();
    });
  }

  closeEverything() {
    this.sideNavOpened = false;
    this.categoriesExpanded = false;
    this.userMenuExpanded = false;
  }

  private loadCart() {
    if (this.isCustomer()) {
      this.cartService.cartChanged
        .subscribe(cart => {
          this.itemInCartCount = cart.orderItems.length;
        });
      this.cartService.getCart();
    }
  }

  private loadCategories() {
    this.categoryService.getCategories()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  private loadLogged() {
    this.userData = this.authService.getUserData();

    this.authService.userDataChanged
      .subscribe(userData => {
        this.userData = userData;
      });
  }

  logout() {
    this.authService.logout();
  }

  isLogged() {
    return this.authService.isLogged();
  }

  isAdmin() {
    return this.authService.userHasRole(Role.ADMIN);
  }

  isStaff() {
    return this.authService.userHasRole(Role.STAFF);
  }

  isCustomer() {
    return this.authService.isCustomer();
  }

}
