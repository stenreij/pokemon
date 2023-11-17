import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamListComponent } from 'libs/frontend/features/src/lib/team/team-list/team-list.component';
import { TeamDetailComponent } from 'libs/frontend/features/src/lib/team/team-detail/team-detail.component';

export const appRoutes: Routes= [
    { path:"", component: TeamListComponent },
    { path: "team/:id", component: TeamDetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class appRouting {}
