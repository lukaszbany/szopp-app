import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDeleteConfirmationComponent } from './image-delete-confirmation.component';

describe('ImageDeleteConfirmationComponent', () => {
  let component: ImageDeleteConfirmationComponent;
  let fixture: ComponentFixture<ImageDeleteConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDeleteConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
