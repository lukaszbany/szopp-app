import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CustomerService} from '../../../../service/customer/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Customer} from '../../../../model/customer/customer.model';
import {EditCustomer} from '../../../../model/customer/edit.customer.model';
import {ValidationErrorHandler} from '../../../../service/utils/validation.error.handler';
import {ShipmentAddress} from '../../../../model/shipment-address/shipment.address.model';

@Component({
  selector: 'app-shipment-address',
  templateUrl: './shipment-address.component.html',
  styleUrls: ['./shipment-address.component.css']
})
export class ShipmentAddressComponent implements OnInit {

  @ViewChild('shipmentAddressForm') shipmentAddressForm: NgForm;
  shipmentAddress: ShipmentAddress;
  formMessage: string;
  isCompany = false;
  differentShipmentAddress = false;

  constructor(private customerService: CustomerService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subscribeCustomer();
  }

  private subscribeCustomer() {
    this.loadCustomerData();
  }

  loadCustomerData() {
    this.formMessage = null;
  }

  submit() {
    if (!this.differentShipmentAddress) {

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
    const type = this.isCompany ? 'COMPANY' : 'INDIVIDUAL';

    this.shipmentAddress = new ShipmentAddress(firstName, lastName, email, city, phone, zipCode, street, type, companyName, nip);
  }

  isIncorrect(field: string): boolean {
    return this.shipmentAddressForm && this.shipmentAddressForm.controls[field] && this.shipmentAddressForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.shipmentAddressForm.controls[field].getError('message');
  }

}
