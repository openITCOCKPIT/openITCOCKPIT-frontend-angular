import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { SearchService } from "../../search/search.service";
import { SearchType } from "../../search/search-type.enum";
import { filter, map, Subscription } from "rxjs";

@Component({
    selector: 'oitc-header',
    standalone: true,
    imports: [FontAwesomeModule, ReactiveFormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
    public readonly SearchType = SearchType;

    private readonly subscription = new Subscription();

    private readonly authService = inject(AuthService);
    private readonly searchService = inject(SearchService);

    private readonly formBuilder = inject(FormBuilder);
    public readonly form = this.formBuilder.group({
        type: ['host'],
        query: [''],
    });

    public ngOnInit() {
        this.subscription.add(this.form.get('query')?.valueChanges.pipe(
            filter(value => !!value),
            map(value => `${value}`),
            filter(value => this.searchService.isUUID(value)),
        ).subscribe({
            next: () => this.form.get('type')?.setValue(SearchType.UUID), // TestID: c36b8048-93ce-4385-ac19-ab5c90574b77
        }))
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public logout(): void {
        this.authService.logout();
    }

    public submitSearch() {
        const {type, query} = this.form.value;

        this.searchService.search(type as SearchType, query as string);
    }
}
