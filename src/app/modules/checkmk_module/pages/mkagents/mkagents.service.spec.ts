import { TestBed } from '@angular/core/testing';

import { MkagentsService } from './mkagents.service';

describe('MkagentsService', () => {
    let service: MkagentsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MkagentsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
