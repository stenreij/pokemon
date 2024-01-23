import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { IPowermove, IUser } from '@pokemon/shared/api';
import { Type } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { PowermoveService } from '../../powermove/powermove.service';

@Component({
  selector: 'pokemon-powermove-add',
  templateUrl: './powermove-add.component.html',
  styleUrls: ['./powermove-add.component.css'],
})
export class PowermoveAddComponent {
  powermoveForm: FormGroup;
  loggedInUser: IUser | null = null;

  constructor(
    private fb: FormBuilder, 
    private powermoveService: PowermoveService, 
    private router: Router, 
    private authService: AuthService,
    ) {
    this.powermoveForm = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
      power: [null, Validators.required],
      accuracy: ['', Validators.required],
    });
    this.authService.currentUser$.subscribe((user: IUser | null) => {
      this.loggedInUser = user;
      console.log('Logged in user:', this.loggedInUser);
      this.powermoveForm.get('creator')?.setValue(this.loggedInUser?.userName);
    });
  }

  getTypeOptions(){
    return Object.values(Type);
  }

  addPowermove(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    if (this.powermoveForm.valid) {
      if (this.loggedInUser) {
        const newPowermove: IPowermove = { ...this.powermoveForm.value, creator: this.loggedInUser.userName } as IPowermove;
  
        this.powermoveService.addPowermove(newPowermove).subscribe(
          (addedPowermove: IPowermove) => {
            console.log('Toegevoegd powermove:', addedPowermove);
            this.router.navigateByUrl('/powermove');
          },
          (error: any) => {
            console.error('Fout bij het toevoegen van powermove:', error);
          }
        );
      }
    }
  }
}