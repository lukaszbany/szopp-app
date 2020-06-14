import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './content/home/home.component';
import {ProductsComponent} from './content/customer/products/products.component';
import {ProductComponent} from './content/customer/product/product.component';
import {CustomerOrdersComponent} from './content/customer/customer-orders/customer-orders.component';
import {RoleGuard} from './service/auth/role.guard';
import {Role} from './model/user/role.model';
import {CustomerDataComponent} from './content/customer/customer-data/customer-data.component';
import {CartComponent} from './content/customer/cart/cart.component';
import {CheckoutComponent} from './content/customer/checkout/checkout.component';
import {AuthComponent} from './content/auth/auth.component';
import {AdminComponent} from './content/admin/admin.component';
import {UsersComponent} from './content/admin/users/users.component';
import {AdminCategoriesComponent} from './content/admin/categories/categories.component';
import {AdminProductsComponent} from './content/admin/products/products.component';
import {AdminProductComponent} from './content/admin/product/product.component';
import {AdminOrdersComponent} from './content/admin/orders/orders.component';
import {AboutComponent} from './content/about/about.component';
import {NotFoundComponent} from './content/not-found/not-found.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'produkty', component: ProductsComponent},
  {path: 'produkty/:id', component: ProductComponent},
  {path: 'kategorie/:categoryId/produkty', component: ProductsComponent},
  {
    path: 'zamowienia',
    component: CustomerOrdersComponent,
    canActivate: [RoleGuard],
    data: {
      hasRole: [Role.REGISTERED_USER],
      hasNoRole: [Role.ADMIN, Role.STAFF],
      hasToBeLogged: true
    }
  },
  {
    path: 'dane',
    component: CustomerDataComponent,
    canActivate: [RoleGuard],
    data: {
      hasRole: [Role.REGISTERED_USER],
      hasNoRole: [Role.ADMIN, Role.STAFF],
      hasToBeLogged: true
    }
  },
  {
    path: 'koszyk',
    component: CartComponent,
    canActivate: [RoleGuard],
    data: {
      hasRole: [Role.REGISTERED_USER],
      hasNoRole: [Role.ADMIN, Role.STAFF],
      hasToBeLogged: false
    }
  },
  {
    path: 'finalizuj',
    component: CheckoutComponent,
    canActivate: [RoleGuard],
    data: {
      hasRole: [Role.REGISTERED_USER],
      hasNoRole: [Role.ADMIN, Role.STAFF],
      hasToBeLogged: false
    }
  },
  {path: 'logowanie', component: AuthComponent, canActivate: [RoleGuard], data: {hasToBeLogged: false}},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: {
      hasRole: [Role.ADMIN, Role.STAFF],
      hasToBeLogged: true
    },
    children: [
      {
        path: 'uzytkownicy',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.ADMIN],
          hasToBeLogged: true
        }
      },
      {
        path: 'kategorie',
        component: AdminCategoriesComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      },
      {
        path: 'kategorie/:id',
        component: AdminCategoriesComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      },
      {
        path: 'produkty',
        component: AdminProductsComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      },
      {
        path: 'kategorie/:id/produkty',
        component: AdminProductsComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      },
      {
        path: 'produkty/:id',
        component: AdminProductComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      },
      {
        path: 'zamowienia',
        component: AdminOrdersComponent,
        canActivate: [RoleGuard],
        data: {
          hasRole: [Role.STAFF],
          hasToBeLogged: true
        }
      }
    ]
  },
  {path: 'o-projekcie', component: AboutComponent},
  {path: 'brak-strony', component: NotFoundComponent},
  {path: '**', redirectTo: 'brak-strony'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {


}
