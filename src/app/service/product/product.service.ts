import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Product} from '../../model/product/product.model';
import {Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';
import {EditProduct} from '../../model/product/edit.product.model';
import {Success} from '../../model/success/success.model';
import {AddProduct} from '../../model/product/add.product.model';

@Injectable({providedIn: 'root'})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>('/api/products/' + id);
  }

  getProducts(name: string, page: number, size: number): Observable<Product[]> {
    const params: HttpParams = this.getParams(name, page, size);

    return this.http
      .get<Product[]>('/api/products/', {params: params})
      .pipe(share());
  }

  private getParams(name: string, page: number, size: number) {
    let httpParams = new HttpParams();

    if (name) {
      httpParams = httpParams.set('name', name);
    }

    if (page != null && size != null) {
      httpParams = httpParams
        .set('page', page.toString())
        .set('size', size.toString());
    }

    return httpParams;
  }

  getProductCount(name: string): Observable<number> {
    const params: HttpParams = this.getParams(name, null, null);

    return this.http
      .get<Product[]>('/api/products/', {params: params})
      .pipe(map(products => products.length));
  }

  getProductsByCategory(categoryId: number, page: number, size: number): Observable<Product[]> {
    const params: HttpParams = this.getParams(null, page, size);

    return this.http
      .get<Product[]>(
        '/api/categories/' + categoryId + '/products',
        {params: params}
      );
  }

  getProductsByCategoryCount(categoryId: number): Observable<number> {
    return this.http
      .get<Product[]>('/api/categories/' + categoryId + '/products')
      .pipe(map(products => products.length));
  }

  editProduct(editProduct: EditProduct): Observable<Success> {
    return this.http
      .put<Success>('/api/products', editProduct, {observe: 'body'});
  }

  addProduct(addProduct: AddProduct): Observable<Product> {
    return this.http
      .post<Product>('/api/products', addProduct, {observe: 'body'});
  }

  deleteProduct(product: Product): Observable<Success> {
    return this.http
      .delete<Success>('/api/products/' + product.id);
  }

}
