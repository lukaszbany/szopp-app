import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../../model/product/product.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CategoryService} from '../../../service/product/category.service';
import {ProductService} from '../../../service/product/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ValidationErrorHandler} from '../../../service/utils/validation.error.handler';
import {Category} from '../../../model/category/category.model';
import {FormControl, NgForm} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AddProduct} from '../../../model/product/add.product.model';
import {EditProduct} from '../../../model/product/edit.product.model';
import {ApiError} from '../../../model/error/error.model';
import {ProductImagesEditModalComponent} from './product-images-edit-modal/product-images-edit-modal.component';
import {ValidationError} from '../../../model/error/validation.error.model';

@Component({
  selector: 'app-admin-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class AdminProductComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string;
  isLoaded: boolean;

  @ViewChild('productForm') productForm: NgForm;

  productId: number;
  product: Product;
  newProduct: boolean;

  allCategories: Category[];
  categoryControl = new FormControl();
  filteredCategories: Observable<Category[]>;

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    this.saveReturnUrl();
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.checkProductIdParam();
    this.loadCategoriesAndProduct();
  }

  private checkProductIdParam() {
    if (this.route.snapshot.params['id']) {
      this.saveProductId(this.route.snapshot.params['id']);
    }

    this.route.params
      .subscribe((params: Params) => {
        this.saveProductId(params['id']);
      });
  }

  private saveProductId(productIdParam) {
    if (!isNaN(+productIdParam)) {
      this.newProduct = false;
      this.productId = productIdParam;
    } else if (productIdParam === 'nowy') {
      this.newProduct = true;
      this.productId = null;
    } else {
      this.router.navigate(['/brak-strony']);
    }
  }

  private loadCategoriesAndProduct() {
    this.categoryService
      .getCategories()
      .subscribe(categories => {
        this.allCategories = this.categoryService.findAllCategoriesRecursively(categories);
        this.prepareCategoryFilter();
        this.loadProduct();
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

  private loadProduct() {
    if (this.productId) {
      this.loadProductById();
    } else {
      this.createNewProduct();
    }
  }

  private loadProductById() {
    this.productService
      .getProduct(this.productId)
      .subscribe(product => {
        this.product = product;

        let category = this.findCategory(product.categoryId);
        this.categoryControl.setValue(category);
        this.isLoaded = true;
      });
  }

  private createNewProduct() {
    this.product = new Product();
    this.isLoaded = true;
  }

  isIncorrect(field: string): boolean {
    return this.productForm && this.productForm.controls[field] && this.productForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.productForm.controls[field].getError('message');
  }

  displayFn(category: Category): string {
    return category && category.name ? category.name : '';
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();

    return this.allCategories.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private findCategory(categoryId: number) {
    return this.allCategories.find(cat => cat.id == categoryId);
  }

  submit(stay: boolean) {
    this.loading = true;
    if (this.newProduct) {
      this.addProduct(stay);
    } else {
      this.editProduct(stay);
    }
  }

  private addProduct(stay: boolean) {
    let addProduct = this.createAddProduct();
    this.addNewProduct(addProduct, stay);
  }

  private createAddProduct() {
    return new AddProduct(
      this.product.name,
      this.product.description,
      this.product.shortDescription,
      this.product.price,
      this.categoryControl.value ? this.categoryControl.value.id : null,
      this.product.inStock,
      this.product.active
    );
  }

  private addNewProduct(addProduct: AddProduct, stay: boolean) {
    this.productService
      .addProduct(addProduct)
      .subscribe(product => {
        this.reloadPageOrGetBack(stay, product);
        this.snackBar.open('Produkt został dodany', null, {duration: 3000});
        this.loading = false;
      }, error => {
        this.handleError(error);
        this.snackBar.open(error.error.message, null, {duration: 3000});
        this.loading = false;
      });
  }

  private reloadPageOrGetBack(stay: boolean, product: Product) {
    if (!stay) {
      this.back();
    } else {
      this.router.navigate(['/admin/produkty/' + product.id], {state: {returnUrl: this.returnUrl}});
      this.ngOnInit();
    }
  }

  private editProduct(stay: boolean) {
    let editProduct = this.createEditProduct();
    this.editSelectedProduct(editProduct, stay);
  }

  private createEditProduct() {
    return new EditProduct(
      this.product.id,
      this.product.name,
      this.product.description,
      this.product.shortDescription,
      this.product.price,
      this.categoryControl.value ? this.categoryControl.value.id : null,
      this.product.inStock,
      this.product.active
    );
  }

  private editSelectedProduct(editProduct: EditProduct, stay: boolean) {
    this.productService
      .editProduct(editProduct)
      .subscribe(success => {
        if (!stay) {
          this.back();
        }

        this.ngOnInit();
        this.snackBar.open(success.message, null, {duration: 3000});
        this.loading = false;
      }, error => {
        this.handleError(error);
        this.snackBar.open(error.error.message, null, {duration: 3000});
        this.loading = false;
      });
  }

  back() {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/admin/produkty/']);
    }
  }

  private saveReturnUrl() {
    let currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
      this.returnUrl = currentNavigation.extras.state.returnUrl;
    }
  }

  private handleError(error) {
    if (error.error) {
      ValidationErrorHandler.saveErrors(this.productForm, error.error);
      this.checkCategoryField(error.error);
    }
  }

  private checkCategoryField(error: ApiError) {
    if (error.validationErrors) {
      this.setValidationErrors(error);
    }
  }

  private setValidationErrors(error: ApiError) {
    for (let validationError of error.validationErrors) {
      this.addCategoryErrorIfNeeded(validationError);
    }
  }

  private addCategoryErrorIfNeeded(validationError: ValidationError) {
    if (validationError.field === 'categoryId') {
      this.categoryControl.markAsTouched();
      this.categoryControl.setErrors({
        incorrect: true,
        message: validationError.message
      });
    }
  }

  invalidCategory(): boolean {
    return this.categoryControl.hasError('incorrect');
  }

  getCategoryErrorMessage(): string {
    return this.categoryControl.getError('message');
  }

  editImages() {
    this.dialog.open(ProductImagesEditModalComponent, {
      data: this.product.id,
      height: '410px',
      width: '1000px',
    });
  }
}
