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

@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  declarations: [
    TeamListComponent,
    TeamDetailComponent,
    TeamAddComponent,
    TeamEditComponent,
  ],
  providers: [TeamService],
  exports: [TeamListComponent, TeamDetailComponent, TeamAddComponent, TeamEditComponent],
})
export class FeaturesModule {}
