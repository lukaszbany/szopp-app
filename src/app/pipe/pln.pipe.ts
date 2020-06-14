import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({name: 'pln'})
export class PlnPipe extends CurrencyPipe implements PipeTransform {

  transform(value: number): string {
    return super.transform(value, 'PLN', 'zł', '1.2-2', 'pl-PL');
  }
}
