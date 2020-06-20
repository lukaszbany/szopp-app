import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CartService} from '../../../service/cart/cart.service';
import {MatStep, MatStepper} from '@angular/material/stepper';
import {CustomerService} from '../../../service/customer/customer.service';
import {Customer} from '../../../model/customer/customer.model';
import {EditCustomer} from '../../../model/customer/edit.customer.model';
import {ValidationErrorHandler} from '../../../service/utils/validation.error.handler';
import {NgForm} from '@angular/forms';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {ShipmentAddress} from '../../../model/shipment-address/shipment.address.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('stepper') stepper: MatStepper;

  @ViewChild('step1') step1: MatStep;
  @ViewChild('customerDataForm') customerDataForm: NgForm;
  step1IsCompany = false;

  @ViewChild('step2') step2: MatStep;
  @ViewChild('shipmentAddressForm') shipmentAddressForm: NgForm;
  step2isCompany = false;
  differentShipmentAddress = false;

  orderCompleted: boolean = false;

  constructor(private router: Router,
              private cartService: CartService,
              private customerService: CustomerService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.redirectIfEmptyCart();
    this.subscribeCustomer();
  }

  private redirectIfEmptyCart() {
    if (this.cartService.isEmpty()) {
      this.router.navigate(['/']);
    }
  }

  private subscribeCustomer() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    this.customerService
      .getCustomerData()
      .subscribe(customer => {
        this.fillForm(customer);
      });
  }

  private fillForm(customer: Customer) {
    this.customerDataForm.controls['firstName'].setValue(customer.firstName);
    this.customerDataForm.controls['lastName'].setValue(customer.lastName);
    this.customerDataForm.controls['email'].setValue(customer.email);
    this.customerDataForm.controls['city'].setValue(customer.city);
    this.customerDataForm.controls['phone'].setValue(customer.phone);
    this.customerDataForm.controls['zipCode'].setValue(customer.zipCode);
    this.customerDataForm.controls['street'].setValue(customer.street);

    this.step1IsCompany = customer.type && customer.type === 'COMPANY';
    if (this.step1IsCompany) {
      this.customerDataForm.controls['companyName'].setValue(customer.companyName);
      this.customerDataForm.controls['nip'].setValue(customer.nip);
    }
  }

  validateStep($event: StepperSelectionEvent) {
    if ($event.previouslySelectedIndex == 0) {
      this.submitCustomerData();
    } else if (!$event.previouslySelectedStep.completed) {
      this.stepper.selectedIndex = 1;
    }
  }

  submitCustomerData() {
    const firstName = this.customerDataForm.value['firstName'];
    const lastName = this.customerDataForm.value['lastName'];
    const email = this.customerDataForm.value['email'];
    const city = this.customerDataForm.value['city'];
    const phone = this.customerDataForm.value['phone'];
    const zipCode = this.customerDataForm.value['zipCode'];
    const street = this.customerDataForm.value['street'];
    const companyName = this.customerDataForm.value['companyName'];
    const nip = this.customerDataForm.value['nip'];
    const type = this.step1IsCompany ? 'COMPANY' : 'INDIVIDUAL';

    const editCustomer = new EditCustomer(firstName, lastName, email, city, phone, zipCode, street, type, companyName, nip);

    this.customerService
      .saveCustomerData(editCustomer)
      .subscribe(() => {
        this.step1.completed = true;
        this.subscribeCustomer();
        this.stepper.selectedIndex = 1;
      }, error => {
        this.handleError(this.customerDataForm, error);
        this.step1.completed = false;
        this.stepper.selectedIndex = 0;
      });
  }

  private handleError(form: NgForm, error) {
    if (error.error) {
      ValidationErrorHandler.saveErrors(form, error.error);
    }
  }

  isIncorrect(form: NgForm, field: string): boolean {
    return form && form.controls[field] && form.controls[field].hasError('incorrect');
  }

  getErrorMessage(form: NgForm, field: string): string {
    return form.controls[field].getError('message');
  }

  submitShipmentAddress() {
    this.loading = true;

    if (!this.differentShipmentAddress) {
      this.checkout(null);
      return;
    }

    const firstName = this.shipmentAddressForm.value['firstName'];
    const lastName = this.shipmentAddressForm.value['lastName'];
    const email = this.shipmentAddressForm.value['email'];
    const city = this.shipmentAddressForm.value['city'];
    const phone = this.shipmentAddressForm.value['phone'];
    const zipCode = this.shipmentAddressForm.value['zipCode'];
    const street = this.shipmentAddressForm.value['street'];
    const companyName = this.shipmentAddressForm.value['companyName'];
    const nip = this.shipmentAddressForm.value['nip'];
    const type = this.step2isCompany ? 'COMPANY' : 'INDIVIDUAL';

    let shipmentAddress = new ShipmentAddress(firstName, lastName, email, city, phone, zipCode, street, type, companyName, nip);
    this.checkout(shipmentAddress);
  }

  private checkout(shipmentAddress: ShipmentAddress) {
    this.cartService
      .checkout(shipmentAddress)
      .subscribe(() => {
        this.step1.editable = false;
        this.step2.editable = false;
        this.step2.completed = true;
        this.stepper.selectedIndex = 2;
        this.loading = false;
      }, error => {
        if (error.error) {
          if (error.error.validationErrors) {
            this.handleError(this.shipmentAddressForm, error);
            this.step2.completed = false;
            this.stepper.selectedIndex = 1;
          } else {
            this.router.navigate(['/koszyk']);
            this.snackBar.open(error.error.message, null, {duration: 4000});
          }
        }
        this.loading = false;
      });
  }
}
