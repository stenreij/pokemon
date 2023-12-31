import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, FeaturesModule } from '@pokemon/frontend/features';
import { IUser } from '@pokemon/shared/api';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule, CommonModule],
  selector: 'pokemon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'frontend';
  loggedInUser: IUser | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
  }


  isAuth(): boolean {
    return this.authService.isAuthenticated();
  }

  Logout() {
    this.authService.logout();
  }
}