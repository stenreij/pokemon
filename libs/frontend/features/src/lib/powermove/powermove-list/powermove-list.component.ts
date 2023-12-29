import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';

import { IPowermove, IUser } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'
import { AuthService } from '../../auth/auth.service';
import { PowermoveService } from '../powermove.service';


@Component({
    selector: 'pokemon-powermove-list',
    templateUrl: './powermove-list.component.html',
    styleUrls: ['./powermove-list.component.css'],
})

export class PowermoveListComponent implements OnInit, OnDestroy {
    powermoves: IPowermove[] | null = null;
    subscription: Subscription | undefined = undefined;
    loggedInUser = this.authService.currentUser$.value!;

    constructor(private powermoveService: PowermoveService, private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
        this.subscription = this.powermoveService.list().subscribe((results) => {
          console.log(`results: ${results}`);
          this.powermoves = results;     
        });
      }
      
      private herlaadPowermoveLijst(): void {
        this.powermoveService.list().subscribe(
          (resultaten) => {
            this.powermoves = resultaten;
          },
          (error) => {
            console.log('Er is een fout opgetreden bij het ophalen van de powermoves-lijst:', error);
          }
        );
      }


    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    verwijderPowermove(powermoveId: number): void {
        const bevestigen = window.confirm('Weet je zeker dat je deze powermove wilt verwijderen?');

        if (bevestigen) {
            this.powermoveService.delete(powermoveId).subscribe(
                () => {
                    this.herlaadPowermoveLijst();
                },
                (error) => {
                    console.log('Er is een fout opgetreden bij het verwijderen van de powermove:', error);
                }
            );
        }
    }
}