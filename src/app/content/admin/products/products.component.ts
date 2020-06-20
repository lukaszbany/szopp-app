import {Component, OnInit} from '@angular/core';
import {Category} from '../../../model/category/category.model';
import {Product} from '../../../model/product/product.model';
import {CategoryService} from '../../../service/product/category.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../service/product/product.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ProductDeleteConfirmationComponent} from './product-delete-confirmation/product-delete-confirmation.component';
import {EditProduct} from '../../../model/product/edit.product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class AdminProductsComponent implements OnInit {

  loading: boolean = false;
  categoryTree: Category[];
  categoryId: number;
  category: Category;

  parentCategories: Category[];
  allCategories: Category[];
  products: Product[];

  searchQuery = '';
  searchQueryParam: string;

  categoryControl = new FormControl();
  filteredCategories: Observable<Category[]>;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.saveCategoryId();
    this.saveSearchQueryParam();
    this.loadCategories();
    this.loadProducts();
  }

  private saveCategoryId() {
    if (this.route.snapshot.params['id']) {
      this.categoryId = this.route.snapshot.params['id'];
    }

    this.route.params
      .subscribe((params: Params) => {
        this.categoryId = params['id'];
        this.loadCategories();
        this.loadProducts();
      });
  }

  private saveSearchQueryParam() {
    if (this.route.snapshot.params['search']) {
      this.searchQueryParam = this.route.snapshot.queryParams['search'];
    }

    this.route.queryParams
      .subscribe((params: Params) => {
        if (!this.categoryId) {
          this.searchQueryParam = this.route.snapshot.queryParams['search'];
          this.loadCategories();
          this.loadProducts();
        }
      });
  }

  private loadCategories() {
    this.categoryService
      .getCategories()
      .subscribe(categories => {
        this.parentCategories = categories;
        this.allCategories = this.categoryService.findAllCategoriesRecursively(categories);
        this.prepareCategoryFilter();

        if (!this.categoryId) {
          this.category = null;
        } else {
          this.category = this.findCategory(this.categoryId);
          this.getCategoryTree();
        }
      });
  }

  private prepareCategoryFilter() {
    this.filteredCategories = this.categoryControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.allCategories.slice())
      );
  }

  private getCategoryTree() {
    if (this.parentCategories && this.parentCategories.length > 0) {
      this.categoryTree = this.categoryService.getCategoryTree(this.categoryId, this.parentCategories);
    }
  }

  private loadProducts() {
    if (this.categoryId) {
      this.productService
        .getProductsByCategory(this.categoryId, null, null)
        .subscribe(products => {
          this.products = products;
        });
    } else {
      this.productService
        .getProducts(this.searchQueryParam, null, null)
        .subscribe(products => {
          this.products = products;
        });
    }
  }

  findCategoryName(categoryId: number) {
    if (this.allCategories) {
      let category = this.findCategory(categoryId);
      return category ? category.name : '';
    }

    return '';
  }

  private findCategory(categoryId: number) {
    return this.allCategories.find(cat => cat.id == categoryId);
  }

  searchProducts() {
    if (this.searchQuery) {
      this.router.navigate(['/admin/produkty'], {queryParams: {'search': this.searchQuery}});
    }
  }

  filterByCategory() {
    let categoryToFilter = this.categoryControl.value;

    if (categoryToFilter && categoryToFilter.id) {
      this.router.navigateByUrl('/admin/produkty', {skipLocationChange: true})
        .then(() => {
          this.router.navigate(['/admin/kategorie/' + categoryToFilter.id + '/produkty']);
        });
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();

    return this.allCategories.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  setActive(product: Product, active: boolean) {
    this.loading = true;
    let editProduct = this.createEditProductActivation(product, active);

    this.productService.editProduct(editProduct)
      .subscribe(() => {
        this.loadCategories();
        this.loadProducts();
        this.snackBar.open(active ? 'Kategoria została włączona' : 'Kategoria została wyłączona', null, {duration: 3000});
        this.loading = false;
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 3000});
        this.loading = false;
      });
  }

  private createEditProductActivation(product: Product, active: boolean) {
    return new EditProduct(
      product.id,
      product.name,
      product.description,
      product.shortDescription,
      product.price,
      product.categoryId,
      product.inStock,
      active
    );
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/produkty/' + product.id], {state: {returnUrl: this.router.url}});
  }

  addProduct() {
    this.router.navigate(['/admin/produkty/nowy'], {state: {returnUrl: this.router.url}});
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductDeleteConfirmationComponent, {
      data: {product: product, categoryName: this.findCategoryName(product.categoryId)}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService
          .deleteProduct(product)
          .subscribe(success => {
            this.loadCategories();
            this.loadProducts();
            this.snackBar.open(success.message, null, {duration: 3000});
          }, error => {
            this.snackBar.open(error.error.message, null, {duration: 3000});
          });
      }
    });
  }
}
