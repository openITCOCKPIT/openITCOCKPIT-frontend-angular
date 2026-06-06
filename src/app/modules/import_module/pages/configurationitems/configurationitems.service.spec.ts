import { TestBed } from '@angular/core/testing';

import { ConfigurationitemsService } from './configurationitems.service';

describe('ConfigurationitemsService', () => {
    let service: ConfigurationitemsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigurationitemsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
