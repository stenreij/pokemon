import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team/team-list/team-list.component';
import { TeamDetailComponent } from './team/team-detail/team-detail.component';
import { TeamService } from './team/team.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TeamAddComponent } from './team/team-add/team-add.component';
import { TeamEditComponent } from './team/team-edit/team-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { PokemonService } from './pokemon/pokemon.service';
import { UserService } from './user/user.service';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pokemon/pokemon-detail/pokemon-detail.component';
import { PokemonAddComponent } from './pokemon/pokemon-add/pokemon-add.component';
import { PokemonEditComponent } from './pokemon/pokemon-edit/pokemon-edit.component';
import { FormsModule } from '@angular/forms';
import { PopupComponent } from './pokemon/team-selection/team-selection-popup.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { AuthService } from './auth/auth.service';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './user/user-profile/user-profile.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule, FormsModule],
  declarations: [
    TeamListComponent,
    TeamDetailComponent,
    TeamAddComponent,
    TeamEditComponent,
    AboutComponent,
    PokemonListComponent,
    PokemonDetailComponent,
    PokemonAddComponent,
    PokemonEditComponent,
    PopupComponent,
    UserListComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    UserEditComponent,
  ],
  providers: [TeamService, PokemonService, UserService, AuthService],
  exports: [
    TeamListComponent,
    TeamDetailComponent,
    TeamAddComponent,
    TeamEditComponent,
    AboutComponent,
    PokemonListComponent,
    PokemonDetailComponent,
    PokemonAddComponent,
    PokemonEditComponent,
    PopupComponent,
    UserListComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    UserEditComponent,
  ],
})
export class FeaturesModule {}