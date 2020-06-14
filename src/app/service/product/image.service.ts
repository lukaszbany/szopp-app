import {Injectable} from '@angular/core';
import {Product} from '../../model/product/product.model';
import {Image} from '../../model/product/image.model';
import {HttpClient} from '@angular/common/http';
import {Success} from '../../model/success/success.model';
import {Observable} from 'rxjs';

const defaultImageFilename = 'product-placeholder.png';
const imagePath = 'images/';
const placeholderPath = 'assets/img/products/' + defaultImageFilename;

@Injectable({providedIn: 'root'})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  static getFirstImageDescription(product: Product) {
    if (this.hasImages(product)) {
      return product.images[0].description;
    }

    return product.name;
  }

  static getFirstImagePath(product: Product) {
    if (this.hasImages(product)) {
      return imagePath + product.images[0].filename;
    }

    return placeholderPath;
  }

  static hasImages(product: Product) {
    return product.images.length > 0;
  }

  static getImagePath(image: Image) {
    return imagePath + image.filename;
  }

  static getDefaultImage(product: Product): Image {
    return {
      order: 0,
      id: 0,
      filename: defaultImageFilename,
      description: product.name,
      productId: 0
    };
  }

  editImageOrder(productId: number, imageId: number, newOrder: number): Observable<Success> {
    return this.http
      .put<Success>(
        '/api/products/' + productId + '/image/' + imageId,
        newOrder,
        {observe: 'body'}
      );
  }

  addImage(productId: number, image: File, description: string): Observable<Success> {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    formData.append('description', description);
    return this.http
      .post<Success>(
        '/api/products/' + productId + '/image',
        formData,
        {observe: 'body'}
      );
  }

  deleteImage(productId: number, imageId: number): Observable<Success> {
    return this.http
      .delete<Success>(
        '/api/products/' + productId + '/image/' + imageId,
      );
  }

}
