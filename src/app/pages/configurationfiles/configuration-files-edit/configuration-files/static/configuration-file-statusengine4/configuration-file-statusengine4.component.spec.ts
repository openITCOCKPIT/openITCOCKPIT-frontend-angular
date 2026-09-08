import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationFileStatusengine4Component } from "./configuration-file-statusengine4.component";

describe("ConfigurationFileStatusengine4Component", () => {
    let component: ConfigurationFileStatusengine4Component;
    let fixture: ComponentFixture<ConfigurationFileStatusengine4Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfigurationFileStatusengine4Component],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfigurationFileStatusengine4Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
