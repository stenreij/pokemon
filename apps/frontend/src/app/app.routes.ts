/* eslint-disable @nx/enforce-module-boundaries */
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamListComponent } from 'libs/frontend/features/src/lib/team/team-list/team-list.component';
import { TeamDetailComponent } from 'libs/frontend/features/src/lib/team/team-detail/team-detail.component';
import { AboutComponent } from 'libs/frontend/features/src/lib/about/about.component';
import { PokemonAddComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-add/pokemon-add.component';
import { PokemonDetailComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-detail/pokemon-detail.component';
import { PokemonEditComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-edit/pokemon-edit.component';
import { PokemonListComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-list/pokemon-list.component';
import { TeamAddComponent } from 'libs/frontend/features/src/lib/team/team-add/team-add.component';
import { TeamEditComponent } from 'libs/frontend/features/src/lib/team/team-edit/team-edit.component';
import { UserListComponent } from 'libs/frontend/features/src/lib/user/user-list/user-list.component';
import { RegisterComponent } from 'libs/frontend/features/src/lib/auth/register/register.component';
import { LoginComponent } from 'libs/frontend/features/src/lib/auth/login/login.component';
import { ProfileComponent } from 'libs/frontend/features/src/lib/user/user-profile/user-profile.component';
import { UserEditComponent } from 'libs/frontend/features/src/lib/user/user-edit/user-edit.component';
import { PowermoveListComponent } from 'libs/frontend/features/src/lib/powermove/powermove-list/powermove-list.component';
import { PowermoveDetailComponent } from 'libs/frontend/features/src/lib/powermove/powermove-detail/powermove-detail.component';
import { PowermoveAddComponent } from 'libs/frontend/features/src/lib/powermove/powermove-add/powermove-add.component';

export const appRoutes: Routes= [
    { path:"", component: TeamListComponent },
    { path: "team/:id", component: TeamDetailComponent },
    { path: "team-add", component: TeamAddComponent},
    { path: "team-edit/:id", component: TeamEditComponent},
    { path: "about", component: AboutComponent},
    { path: "pokemon", component: PokemonListComponent},
    { path: "pokemon/:id", component: PokemonDetailComponent},
    { path: "pokemon-add", component: PokemonAddComponent},
    { path: "pokemon-edit/:id", component: PokemonEditComponent},
    { path: "user", component: UserListComponent},
    { path: "register", component: RegisterComponent},
    { path: "login", component: LoginComponent},
    { path: "profile/:id", component: ProfileComponent},
    { path: "user-edit/:id", component: UserEditComponent},
    { path: "powermove", component: PowermoveListComponent},
    { path: "powermove/:id", component: PowermoveDetailComponent},
    { path: "powermove-add", component: PowermoveAddComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class appRouting {}
