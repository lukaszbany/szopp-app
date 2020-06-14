import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import localePL from '@angular/common/locales/pl';
import {registerLocaleData} from '@angular/common';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {ContentComponent} from './content/content.component';
import {ProductsComponent} from './content/customer/products/products.component';
import {ProductComponent} from './content/customer/product/product.component';
import {CartComponent} from './content/customer/cart/cart.component';
import {HomeComponent} from './content/home/home.component';
import {NotFoundComponent} from './content/not-found/not-found.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CategoriesComponent} from './content/customer/products/categories/categories.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SpinnerComponent} from './shared/spinner/spinner.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoriesDropdownComponent} from './header/categories-dropdown/categories-dropdown.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {SearchComponent} from './header/search/search.component';
import {MatTreeModule} from '@angular/material/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {PlnPipe} from './pipe/pln.pipe';
import {AuthComponent} from './content/auth/auth.component';
import {MatTabsModule} from '@angular/material/tabs';
import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {CustomerDataComponent} from './content/customer/customer-data/customer-data.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {ErrorInterceptor} from './interceptor/error.interceptor';
import {CustomerOrdersComponent} from './content/customer/customer-orders/customer-orders.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {CheckoutComponent} from './content/customer/checkout/checkout.component';
import {CartSummaryComponent} from './content/customer/checkout/cart-summary/cart-summary.component';
import {MatStepperModule} from '@angular/material/stepper';
import {OrderStatusPipe} from './pipe/order.status.pipe';
import {AdminComponent} from './content/admin/admin.component';
import {UsersComponent} from './content/admin/users/users.component';
import {RolePipe} from './pipe/role.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {AddRoleConfirmationComponent} from './content/admin/users/add-role-confirmation/add-role-confirmation.component';
import {RemoveUserConfirmationComponent} from './content/admin/users/remove-user-confirmation/remove-user-confirmation.component';
import {AdminCategoriesComponent} from './content/admin/categories/categories.component';
import {CategoryEditModalComponent} from './content/admin/categories/category-edit-modal/category-edit-modal.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {CategoryAddModalComponent} from './content/admin/categories/category-add-modal/category-add-modal.component';
import {MatChipsModule} from '@angular/material/chips';
import {CategoryDeleteConfirmationComponent} from './content/admin/categories/category-delete-confirmation/category-delete-confirmation.component';
import {AdminProductsComponent} from './content/admin/products/products.component';
import {AdminProductComponent} from './content/admin/product/product.component';
import {ProductDeleteConfirmationComponent} from './content/admin/products/product-delete-confirmation/product-delete-confirmation.component';
import {AdminOrdersComponent} from './content/admin/orders/orders.component';
import {ProductImagesEditModalComponent} from './content/admin/product/product-images-edit-modal/product-images-edit-modal.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ImageDeleteConfirmationComponent} from './content/admin/product/product-images-edit-modal/image-delete-confirmation/image-delete-confirmation.component';
import {MatSelectModule} from '@angular/material/select';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {getPolish} from './translation/polish-paginator';
import {AboutComponent} from './content/about/about.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {CategoriesMobileComponent} from './header/categories-mobile/categories-mobile.component';
import {AppRoutingModule} from './app-routing.module';


registerLocaleData(localePL);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ProductsComponent,
    ProductComponent,
    CartComponent,
    HomeComponent,
    NotFoundComponent,
    CategoriesComponent,
    SpinnerComponent,
    CategoriesDropdownComponent,
    SearchComponent,
    PlnPipe,
    RolePipe,
    OrderStatusPipe,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    CustomerDataComponent,
    CustomerOrdersComponent,
    CheckoutComponent,
    CartSummaryComponent,
    AdminComponent,
    UsersComponent,
    AddRoleConfirmationComponent,
    RemoveUserConfirmationComponent,
    AdminCategoriesComponent,
    CategoryEditModalComponent,
    CategoryAddModalComponent,
    CategoryDeleteConfirmationComponent,
    AdminProductsComponent,
    AdminProductComponent,
    ProductDeleteConfirmationComponent,
    AdminOrdersComponent,
    ProductImagesEditModalComponent,
    ImageDeleteConfirmationComponent,
    AboutComponent,
    CategoriesMobileComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatTreeModule,
    MatBadgeModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatChipsModule,
    DragDropModule,
    MatSelectModule,
    CdkAccordionModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatListModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: LOCALE_ID, useValue: 'pl-PL'},
    {provide: MatPaginatorIntl, useValue: getPolish()}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
