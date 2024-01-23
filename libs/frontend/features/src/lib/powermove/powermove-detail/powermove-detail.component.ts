import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPowermove, Role } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';
import { PowermoveService } from '../powermove.service';

@Component({
  selector: 'pokemon-powermove-detail',
  templateUrl: './powermove-detail.component.html',
  styleUrls: ['./powermove-detail.component.css'],
})
export class PowermoveDetailComponent implements OnInit {
  powermove: IPowermove | undefined;
  selectedPowermove: IPowermove | null = null;
  user= this.authService.currentUser$.value?.userName;

  constructor(private route: ActivatedRoute, private powermoveService: PowermoveService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
    this.route.paramMap.subscribe((params) => {
      const powermoveId = params.get('id');
      if (powermoveId) {
        this.powermoveService.read(powermoveId).subscribe((powermove) => {
          this.powermove = powermove;
        });
      }
    });
  }
  
  verwijderPowermove(powermoveId: number): void {
    const bevestigen = window.confirm('Weet je zeker dat je deze powermove wilt verwijderen?');
  
    if (bevestigen) {
      this.powermoveService.delete(powermoveId).subscribe(
        () => {
          this.router.navigateByUrl('/powermove');
        },
        (error) => {
          console.log('Er is een fout opgetreden bij het verwijderen van de powermove:', error);
        }
      );
    }
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser$.value;
    return user?.role === Role.ADMIN;
  }
}