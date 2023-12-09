import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { IUser } from '@pokemon/shared/api';
import { isEmpty, isNotEmpty } from 'class-validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'pokemon-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
        password: ['', [Validators.required, Validators.maxLength(30)]],
        email: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
  
      this.authService.login(email, password).subscribe(
        (user) => {
          if (user) {
            console.log('Ingelogd user:', user);
            this.router.navigateByUrl('/');
          } else {
            console.error('Fout bij het inloggen van user:', 'Gebruiker bestaat niet of ongeldige gegevens.');
            this.errorMessage = this.authService.errorMessage;
          }
        },
        (error: any) => {
          console.error('Fout bij het inloggen van user:', error);
          this.errorMessage = this.authService.errorMessage;
        }
      );
    }
  }  
}