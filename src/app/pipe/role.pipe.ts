import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'role'})
export class RolePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'ADMIN':
        return 'Admin';
      case 'STAFF':
        return 'Pracownik sklepu';
      case 'REGISTERED_USER':
        return 'Zwykły użytkownik';
    }
  }
}
