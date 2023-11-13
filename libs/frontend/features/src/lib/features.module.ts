import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamListComponent } from './team/team-list/team-list.component';
import { TeamDetailComponent } from './team/team-detail/team-detail.component';
import { TeamService } from './team/team.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [TeamListComponent, TeamDetailComponent],
  providers: [TeamService],
  exports: [TeamListComponent, TeamDetailComponent],
})
export class FeaturesModule {}
