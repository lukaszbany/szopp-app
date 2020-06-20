import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Image} from '../../../../model/product/image.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ImageService} from '../../../../service/product/image.service';
import {CdkDrag, CdkDragDrop, CdkDragEnter, moveItemInArray} from '@angular/cdk/drag-drop';
import {Product} from '../../../../model/product/product.model';
import {ProductService} from '../../../../service/product/product.service';
import {ImageDeleteConfirmationComponent} from './image-delete-confirmation/image-delete-confirmation.component';

@Component({
  selector: 'app-product-images-edit-modal',
  templateUrl: './product-images-edit-modal.component.html',
  styleUrls: ['./product-images-edit-modal.component.css']
})
export class ProductImagesEditModalComponent implements OnInit {

  product: Product;
  isDragging: boolean = false;
  isOverDeleteField = false;
  loaded: boolean = false;
  disabled: boolean = false;
  fileDescription: string = '';
  @ViewChild('imageDrag') imageDrag: CdkDrag;

  constructor(
    public dialogRef: MatDialogRef<ProductImagesEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public productId: number,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private imageService: ImageService,
    public dialog: MatDialog) {
  }

  getImagePath(image: Image) {
    return ImageService.getImagePath(image);
  }


  ngOnInit(): void {
    this.initFields();
    this.loadProduct();
  }

  private initFields() {
    this.loaded = false;
    this.fileDescription = '';
  }

  private loadProduct() {
    this.productService
      .getProduct(this.productId)
      .subscribe(product => {
        this.product = product;
        this.loaded = true;
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<Image[]>) {
    if (event.container.id === 'toDelete') {
      this.deleteImage(event);
    } else {
      this.moveImage(event);
    }
  }

  private moveImage(event: CdkDragDrop<Image[]>) {
    let imageId = event.item.data.id;
    let previousOrder = event.previousIndex;
    let newOrder = event.currentIndex;

    if (previousOrder !== newOrder) {
      this.changeImageOrder(imageId, newOrder, previousOrder);
    }
  }

  private changeImageOrder(imageId, newOrder: number, previousOrder: number) {
    this.imageService
      .editImageOrder(this.productId, imageId, newOrder)
      .subscribe(success => {
        moveItemInArray(this.product.images, previousOrder, newOrder);
        this.snackBar.open(success.message, null, {duration: 3000});
      }, error => {
        this.dialogRef.close();
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });
  }

  private deleteImage(event: CdkDragDrop<Image[]>) {
    let imageId = event.item.data.id;
    let filename = event.item.data.filename;
    const dialogRef = this.openImageDeleteConfirmationModal(filename);
    this.handleModalClose(dialogRef, imageId);
  }

  private openImageDeleteConfirmationModal(filename) {
    return this.dialog.open(ImageDeleteConfirmationComponent, {
      data: {product: this.product, filename: filename}
    });
  }

  private handleModalClose(dialogRef: MatDialogRef<ImageDeleteConfirmationComponent, any>, imageId) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSelectedImage(imageId);
      }
    });
  }

  private deleteSelectedImage(imageId) {
    this.imageService
      .deleteImage(this.productId, imageId)
      .subscribe(success => {
        this.ngOnInit();
        this.snackBar.open(success.message, null, {duration: 3000});
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 3000});
      });
  }

  dragging(isDragging: boolean) {
    this.isDragging = isDragging;
  }

  checkEntered(event: CdkDragEnter) {
    this.isOverDeleteField = event.container.id === 'toDelete';
  }

  addImage(event: Event) {
    let eventTarget = (<HTMLInputElement> event.target);

    if (eventTarget.files) {
      this.addImageFromTarget(eventTarget);
    }

  }

  private addImageFromTarget(eventTarget: HTMLInputElement) {
    this.imageService
      .addImage(this.productId, eventTarget.files[0], this.fileDescription)
      .subscribe(success => {
        this.ngOnInit();
        this.snackBar.open(success.message, null, {duration: 3000});
      }, error => {
        if (error.error) {
          this.snackBar.open(error.error.message, null, {duration: 3000});
        } else {
          this.snackBar.open(error, null, {duration: 3000});
        }
      });
  }
}
