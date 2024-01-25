import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPowermove } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { Type } from '@pokemon/shared/api';
import { PowermoveService } from '../../powermove/powermove.service';

@Component({
  selector: 'pokemon-powermove-edit',
  templateUrl: './powermove-edit.component.html',
  styleUrls: ['./powermove-edit.component.css'],
})
export class PowermoveEditComponent implements OnInit {
  powermoveForm: FormGroup;
  powermove: IPowermove | undefined;

  constructor(
    private fb: FormBuilder,
    private powermoveService: PowermoveService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.powermoveForm = this.fb.group({
      name: ['', Validators.required],
      type: [null, Validators.required],
      power: ['', Validators.required],
      accuracy: ['', Validators.required],
    });
  }

  getTypeOptions() {
    return Object.values(Type);
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    this.route.paramMap.subscribe((params) => {
      const powermoveId = params.get('id');
      if (powermoveId) {
        this.powermoveService.read(powermoveId).subscribe((powermove) => {
          this.powermove = powermove;
          this.powermoveForm.patchValue({
            name: powermove.name,
            type: powermove.type,
            power: powermove.power,
            accuracy: powermove.accuracy,
          });
        });
      }
    });
  }

  editPowermove(): void {
    if (this.powermoveForm.valid && this.powermove) {
      const newPowermove: IPowermove = this.powermoveForm.value as IPowermove;
      newPowermove.powermoveId = this.powermove.powermoveId;
      this.powermoveService.editPowermove(newPowermove).subscribe(
        (editedPowermove: IPowermove) => {
          console.log('Bewerkt powermove:', editedPowermove);
          this.router.navigateByUrl('/powermove/' + editedPowermove.powermoveId);
        },
        (error: any) => {
          console.error('Fout bij het bewerken van de powermove:', error);
        }
      );
    }
  }
}
