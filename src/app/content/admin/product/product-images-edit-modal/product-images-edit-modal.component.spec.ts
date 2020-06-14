import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesEditModalComponent } from './product-images-edit-modal.component';

describe('ProductImagesEditModalComponent', () => {
  let component: ProductImagesEditModalComponent;
  let fixture: ComponentFixture<ProductImagesEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImagesEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagesEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
