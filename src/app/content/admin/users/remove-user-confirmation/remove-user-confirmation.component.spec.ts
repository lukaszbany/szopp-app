import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveUserConfirmationComponent } from './remove-user-confirmation.component';

describe('RemoveUserConfirmationComponent', () => {
  let component: RemoveUserConfirmationComponent;
  let fixture: ComponentFixture<RemoveUserConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveUserConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveUserConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
