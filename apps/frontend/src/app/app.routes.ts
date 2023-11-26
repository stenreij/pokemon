import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamListComponent } from 'libs/frontend/features/src/lib/team/team-list/team-list.component';
import { TeamDetailComponent } from 'libs/frontend/features/src/lib/team/team-detail/team-detail.component';
import { TeamAddComponent } from 'libs/frontend/features/src/lib/team/team-add/team-add.component';
import { TeamEditComponent } from 'libs/frontend/features/src/lib/team/team-edit/team-edit.component';
import { AboutComponent } from 'libs/frontend/features/src/lib/about/about.component' 
import { PokemonListComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-detail/pokemon-detail.component'; 
import { PokemonAddComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-add/pokemon-add.component';
import { PokemonEditComponent } from 'libs/frontend/features/src/lib/pokemon/pokemon-edit/pokemon-edit.component';

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
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class appRouting {}
