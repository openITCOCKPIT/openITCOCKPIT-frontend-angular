import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsocketConnectionErrorComponent } from './websocket-connection-error.component';

describe('WebsocketConnectionErrorComponent', () => {
    let component: WebsocketConnectionErrorComponent;
    let fixture: ComponentFixture<WebsocketConnectionErrorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WebsocketConnectionErrorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WebsocketConnectionErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
