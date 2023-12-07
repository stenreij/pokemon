import { Component, OnInit, OnDestroy} from '@angular/core';
import { IUser } from '@pokemon/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';


@Component({
    selector: 'pokemon-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
})

export class UserListComponent implements OnInit, OnDestroy {
    users: IUser[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        if(!this.authService.isAuthenticated()) this.router.navigateByUrl('/login');
        this.subscription = this.userService.list().subscribe((results) => {
            if (results) {
                console.log(`results: ${results}`);
                this.users = results.map((user) => ({
                    ...user,
                    birthDate: this.formatDate(user.birthDate as Date),
                }));
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

    formatDate(dateString: Date): Date {
        const originalDate = new Date(dateString);
        return originalDate.toLocaleDateString('nl-NL') as unknown as Date; 
    }

    verwijderUser(userId: number): void {
        this.userService.delete(userId).subscribe(() => {
            this.userService.list().subscribe((results) => {
                this.users = results;
            },
                (error) => {
                    console.log('Er is een fout opgetreden:', error);
                });
        });
    }
}