import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleConfirmationComponent } from './add-role-confirmation.component';

describe('AddRoleConfirmationComponent', () => {
  let component: AddRoleConfirmationComponent;
  let fixture: ComponentFixture<AddRoleConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
