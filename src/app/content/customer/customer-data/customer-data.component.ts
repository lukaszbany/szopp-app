import {Component, OnInit, ViewChild} from '@angular/core';
import {ValidationErrorHandler} from '../../../service/utils/validation.error.handler';
import {NgForm} from '@angular/forms';
import {CustomerService} from '../../../service/customer/customer.service';
import {Customer} from '../../../model/customer/customer.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditCustomer} from '../../../model/customer/edit.customer.model';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css']
})
export class CustomerDataComponent implements OnInit {

  @ViewChild('customerDataForm') customerDataForm: NgForm;
  formMessage: string;
  isCompany = false;
  public phoneMask = [
    /\d/, /\d/, /\d/,
    /\d/, /\d/, /\d/,
    /\d/, /\d/, /\d/
  ];
  public postalCodeMask = [
    /\d/, /\d/,
    '-',
    /\d/, /\d/, /\d/
  ];

  constructor(private customerService: CustomerService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subscribeCustomer();
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
    this.customerDataForm.controls['username'].setValue(customer.user ? customer.user.username : '');
    this.customerDataForm.controls['firstName'].setValue(customer.firstName);
    this.customerDataForm.controls['lastName'].setValue(customer.lastName);
    this.customerDataForm.controls['email'].setValue(customer.email);
    this.customerDataForm.controls['city'].setValue(customer.city);
    this.customerDataForm.controls['phone'].setValue(customer.phone);
    this.customerDataForm.controls['zipCode'].setValue(customer.zipCode);
    this.customerDataForm.controls['street'].setValue(customer.street);

    this.isCompany = customer.type && customer.type === 'COMPANY';
    if (this.isCompany) {
      this.customerDataForm.controls['companyName'].setValue(customer.companyName);
      this.customerDataForm.controls['nip'].setValue(customer.nip);
    }
  }

  submit() {
    const firstName = this.customerDataForm.value['firstName'];
    const lastName = this.customerDataForm.value['lastName'];
    const email = this.customerDataForm.value['email'];
    const city = this.customerDataForm.value['city'];
    const phone = this.customerDataForm.value['phone'];
    const zipCode = this.customerDataForm.value['zipCode'];
    const street = this.customerDataForm.value['street'];
    const companyName = this.customerDataForm.value['companyName'];
    const nip = this.customerDataForm.value['nip'];
    const type = this.isCompany ? 'COMPANY' : 'INDIVIDUAL';

    const editCustomer = new EditCustomer(firstName, lastName, email, city, phone, zipCode, street, type, companyName, nip);

    this.customerService
      .saveCustomerData(editCustomer)
      .subscribe(success => {
        this.subscribeCustomer();
        this.snackBar.open(success.message, null, {duration: 2000});
      }, error => this.handleError(error))
  }

  private handleError(error) {
    if (error.error) {
      this.snackBar.open(error.error.message, null, {duration: 3000});
      ValidationErrorHandler.saveErrors(this.customerDataForm, error.error);
    }
  }

  isIncorrect(field: string): boolean {
    return this.customerDataForm && this.customerDataForm.controls[field] && this.customerDataForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.customerDataForm.controls[field].getError('message');
  }

}
