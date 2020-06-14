import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../../model/product/product.model';
import {ProductService} from '../../../service/product/product.service';
import {ActivatedRoute, Params} from '@angular/router';
import {CartService} from '../../../service/cart/cart.service';
import {Image} from '../../../model/product/image.model';
import {ImageService} from '../../../service/product/image.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isLoaded: boolean = false;
  productId: number;
  product: Product;
  currentImage: Image;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.saveProductId();
    this.loadProduct();
  }

  saveProductId() {
    if (this.route.snapshot.params['id']) {
      this.productId = this.route.snapshot.params['id'];
    }

    this.route.params
      .subscribe((params: Params) => {
        if (this.productId != params['id']) {
          this.isLoaded = false;
          this.productId = params['id'];
          this.loadProduct();
        }
      });
  }

  loadProduct() {
    this.productService
      .getProduct(this.productId)
      .subscribe(product => {
        this.product = product;
        this.getFirstProductImage(product);
        this.isLoaded = true;
      });
  }

  private getFirstProductImage(product: Product) {
    if (ImageService.hasImages(product)) {
      this.currentImage = product.images
        .find(file => file.order === 0);
    } else {
      this.currentImage = ImageService.getDefaultImage(product);
    }
  }

  changeCurrentImage(image: Image) {
    this.currentImage = image;
  }

  getCurrentImagePath() {
    return ImageService.getImagePath(this.currentImage);
  }

  getImagePath(image: Image) {
    return ImageService.getImagePath(image);
  }

  isInCart(product: Product) {
    return this.cartService.isInCart(product);
  }

  countInCart(product: Product) {
    return this.cartService.countInCart(product);
  }

  isEveryPieceInCartAlready(product: Product): boolean {
    return this.cartService.isEveryPieceInCartAlready(product);
  }

  addToCart(product: Product) {
    this.cartService.addProductToCart(product.id);
  }

  removeFromCart(product: Product) {
    this.cartService.removeProductFromCart(product.id);
  }

}
