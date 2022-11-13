import { Component, OnInit } from '@angular/core';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { AuthService } from './../../shared/auth.service';

// User interface
export interface User {
  name: String;
  email: String;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  UserProfile?: User;

  constructor(
    public authService: AuthService,
  ) {}

  ngOnInit() { 
    this.authService.profileUser().subscribe((data:any) => {
      this.UserProfile = data;
    },
    err => {
      this.authService.signOut();
    })
  }
}
