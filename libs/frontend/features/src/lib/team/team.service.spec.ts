import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamService } from './team.service';

describe('TeamService', () => {
    let service: TeamService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TeamService],
        });
        service = TestBed.inject(TeamService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve teams', () => {
        const dummyTeams = [
            { teamId: 1, teamName: 'Team A', rating: 1500 }, 
            { teamId: 2, teamName: 'Team B', rating: 1600 }
        ];

        service.list().subscribe((teams) => {
            expect(teams).toEqual(dummyTeams);
            expect(teams?.length).toBe(2);
        });
        const req = httpMock.expectOne({
            method: 'GET',
            url: `${service.endpoint}`,
          });
        req.flush(dummyTeams);
    });
});