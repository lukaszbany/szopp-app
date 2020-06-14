import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth/auth.service';
import {Role} from '../../model/user/role.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  isCustomer() {
    return this.authService.isCustomer();
  }

  userHasRole(role: string) {
    return this.authService.userHasRole(Role[role]);
  }

}
