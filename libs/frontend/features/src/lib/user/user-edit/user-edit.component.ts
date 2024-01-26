import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { IUser, Role } from '@pokemon/shared/api';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'pokemon-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
    userForm: FormGroup;
    user: IUser | undefined;
    errorMessage: string | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.userForm = this.fb.group({
            birthDate: ['', Validators.required],
            email: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        if (!this.authService.isAuthenticated()) {
            this.router.navigateByUrl('/login');
        }

        this.route.paramMap.subscribe((params) => {
            const userId = params.get('id');
            if (userId) {
                this.userService.read(userId).subscribe((user) => {
                    if (!user || !this.authService.currentUser$.value) {
                        this.router.navigateByUrl('/user');
                    } else if (this.authService.currentUser$.value.role !== Role.ADMIN && this.authService.currentUser$.value.userId !== user.userId) {
                        this.router.navigateByUrl('/user');
                        console.log(this.authService.currentUser$.value.role + ", " + this.authService.currentUser$.value.userId + ": " + user.userId);
                    } else {
                        this.user = user;
                        this.userForm.patchValue({
                            birthDate: user.birthDate,
                            email: user.email,
                        });
                    }
                });
            }
        });
    }

    formatDate(dateString: Date): Date {
        const originalDate = new Date(dateString);
        return originalDate.toLocaleDateString('nl-NL') as unknown as Date;
    }

    editUser(): void {
        if (this.userForm.valid && this.user) {
            const updatedUser: IUser = {
                ...this.user,
                ...this.userForm.value,
            };

            this.userService.editUser(updatedUser).subscribe(
                (editedUser: IUser) => {
                    console.log('Bewerkt user:', editedUser);
                    this.router.navigateByUrl('/profile/' + editedUser.userId);
                },
                (error: any) => {
                    console.error('Fout bij het bewerken van de gebruiker:', error);
                    this.errorMessage = error.message;
                }
            );
        }
    }
}
