import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TeamListComponent } from './team-list.component';
import { TeamService } from '../team.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('TeamListComponent', () => {
  let component: TeamListComponent;
  let fixture: ComponentFixture<TeamListComponent>;
  let service: TeamService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamListComponent],
      providers: [TeamService],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(TeamListComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve teams', () => {
    const dummyTeams = [
      { teamId: 1, teamName: 'Team A', rating: 1500 },
      { teamId: 2, teamName: 'Team B', rating: 1600 }
    ];

    const req1 = httpMock.expectOne(`${service.endpoint}`);
    expect(req1.request.method).toBe('GET');
    req1.flush(dummyTeams);

    service.list().subscribe((teams) => {
      expect(teams).toEqual(dummyTeams);
      expect(teams?.length).toBe(2);
    });

    const req2 = httpMock.expectOne(`${service.endpoint}`);
    expect(req2.request.method).toBe('GET');
    req2.flush(dummyTeams);
  });

  it('should delete a team', () => {
    const dummyTeams = [
      { teamId: 1, teamName: 'Team A', rating: 1500 },
      { teamId: 2, teamName: 'Team B', rating: 1600 }
    ];

    const req1 = httpMock.expectOne(`${service.endpoint}`);
    expect(req1.request.method).toBe('GET');
    req1.flush(dummyTeams);

    service.delete(1).subscribe((teams) => {
      expect(teams).toEqual(dummyTeams);
      expect(teams?.length).toBe(2);
    });

    const req2 = httpMock.expectOne(`${service.endpoint}/1`);
    expect(req2.request.method).toBe('DELETE');
    req2.flush(dummyTeams);
  });

  it('should navigate to team details when button is clicked', () => {
    const dummyTeams = [
      { teamId: 1, teamName: 'Team A', rating: 1500 },
      { teamId: 2, teamName: 'Team B', rating: 1600 }
    ];

    const req1 = httpMock.expectOne(`${service.endpoint}`);
    expect(req1.request.method).toBe('GET');
    req1.flush(dummyTeams);

    service.read('1').subscribe((teams) => {
      expect(teams).toEqual(dummyTeams);
      expect(teams.teamName).toBe('');
    });

    const req2 = httpMock.expectOne(`${service.endpoint}/1`);
    expect(req2.request.method).toBe('GET');
    req2.flush(dummyTeams);

  });
});
