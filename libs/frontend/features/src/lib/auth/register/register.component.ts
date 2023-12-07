import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { IUser } from '@pokemon/shared/api';
import { isEmpty, isNotEmpty } from 'class-validator';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'pokemon-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
        userName: [null, [Validators.required, Validators.maxLength(30)]],
        password: ['', [Validators.required, Validators.maxLength(30)]],
        email: ['', [Validators.required, Validators.maxLength(150)]],
        birthDate: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  register():void {
    if (this.registerForm.valid) {
      const newUser: IUser = this.registerForm.value as IUser;
      this.userService.register(newUser).subscribe(
        (addedUser: IUser) => {
          console.log('Toegevoegd user:', addedUser);
          this.router.navigateByUrl('/');
        },
        (error: any) => {
          console.error('Fout bij het toevoegen van user:', error);
        }
      );
    }   
  }
}