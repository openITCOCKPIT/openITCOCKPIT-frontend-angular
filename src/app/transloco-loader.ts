import { inject, Injectable } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        // todo remove /a for final release
        return this.http.get<Translation>(`/a/assets/i18n/${lang}.json`);
    }
}
