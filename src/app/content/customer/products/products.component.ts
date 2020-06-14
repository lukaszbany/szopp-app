import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../../service/product/product.service';
import {Product} from '../../../model/product/product.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Order} from '../../../model/order/order.model';
import {CartService} from '../../../service/cart/cart.service';
import {CategoryService} from '../../../service/product/category.service';
import {Category} from '../../../model/category/category.model';
import {ImageService} from '../../../service/product/image.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  private isSearchResults: boolean = false;
  private cart: Order;
  categories: Category[];

  productLoading: boolean = true;
  categoryLoading: boolean = true;
  categoryId: number;
  searchQuery: string;
  categoryTree: Category[];
  products: Product[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService) {
  }

  ngOnInit(): void {
    this.loadCart();
    this.saveCategoryId();
    this.saveSearchQuery();
    this.loadCategoriesAndProducts();

  }

  isInCart(product: Product) {
    return this.cartService.isInCart(product);
  }

  countInCart(product: Product) {
    return this.cartService.countInCart(product);
  }

  getImageDescription(product: Product) {
    return ImageService.getFirstImageDescription(product);
  }

  getImagePath(product: Product) {
    return ImageService.getFirstImagePath(product);
  }

  addToCart(product: Product) {
    this.cartService.addProductToCart(product.id);
  }

  removeFromCart(product: Product) {
    this.cartService.removeProductFromCart(product.id);
  }

  private saveCategoryId() {
    if (this.route.snapshot.params['categoryId']) {
      this.categoryId = this.route.snapshot.params['categoryId'];
    }

    this.route.params
      .subscribe((params: Params) => {
        if (this.categoryId != params['categoryId']) {
          this.categoryId = params['categoryId'];
          this.loadProducts();
        }
      });
  }

  private saveSearchQuery() {
    if (this.route.snapshot.queryParams['search']) {
      this.searchQuery = this.route.snapshot.queryParams['search'];
    }

    this.route.queryParams
      .subscribe(queryParams => {
        if (this.searchQuery != queryParams['search']) {
          this.searchQuery = queryParams['search'];
          this.loadProducts();
        }
      });
  }

  private loadProducts() {
    this.productLoading = true;

    if (this.categoryId) {
      this.loadProductsByCategory();
    } else if (this.searchQuery) {
      this.searchProducts();
    } else {
      this.loadAllProducts();
    }
  }

  private loadProductsByCategory() {
    this.isSearchResults = false;

    this.productService.getProductsByCategory(this.categoryId, null, null)
      .subscribe(products => {
        this.products = products;
        this.findParentCategories();
        this.productLoading = false;
      });
  }

  private searchProducts() {
    this.isSearchResults = true;

    this.productService.getProducts(this.searchQuery, null, null)
      .subscribe(products => {
        this.products = products;
        this.productLoading = false;
      });
  }

  private loadAllProducts() {
    this.isSearchResults = false;

    this.productService.getProducts(null, null, null)
      .subscribe(products => {
        this.products = products;
        this.productLoading = false;
      });
  }

  private loadCategoriesAndProducts() {
    this.categoryService.getCategories()
      .subscribe(categories => {
        this.categories = categories;
        this.categoryLoading = false;
        this.loadProducts();
      });
  }

  private loadCart() {
    this.cartService.cartChanged
      .subscribe(cart => {
        this.cart = cart;
      });
    this.cartService.getCart();
  }

  shouldShowSearchAlert() {
    return this.searchQuery && !this.productLoading;
  }

  shouldShowBreadcrumb() {
    return !this.searchQuery && !this.productLoading && this.categoryId;
  }

  isEveryPieceInCartAlready(product: Product): boolean {
    return this.cartService.isEveryPieceInCartAlready(product);
  }

  private findParentCategories() {
    this.categoryTree = this.categoryService.getCategoryTree(this.categoryId, this.categories);
  }

}
