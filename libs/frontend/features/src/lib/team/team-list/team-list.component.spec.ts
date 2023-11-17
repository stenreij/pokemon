import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamListComponent } from './team-list.component';
import { TeamService } from '../team.service';

describe('TeamListComponent', () => {
  let component: TeamListComponent;
  let fixture: ComponentFixture<TeamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamListComponent],
      providers: [TeamService],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
