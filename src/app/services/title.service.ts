import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TitleService extends Title {
    private systemName: string = '';
    private titleFetchTimeout: number = 300;
    private manualSetTimeout: number = 0;

    public setSystemName(systemName: string): void {
        this.systemName = systemName;
    }

    override setTitle(title: string | undefined = ''): void {
        // If a title is passed, we can set it rite here rite now.
        if (title) {
            // So clear the automatic run, if pending.
            if (this.manualSetTimeout) {
                clearTimeout(this.manualSetTimeout);
                this.manualSetTimeout = 0;
            }

            let separator: string = '';
            if (title && this.systemName) {
                separator = ' | ';
            }

            // And set the title immediately.
            super.setTitle(`${title} ${separator} ${this.systemName}`);
            return;
        }
        /*
         * I am a workaround!
         *
         * This method is invoked on route changes.
         * In that moment, the new page is not yet fully loaded.
         * So we need to wait a tiny bit before actively fetching the title from the new laded DOM.
         */
        this.manualSetTimeout = setTimeout(() => {
            // Find the title on the DOM.
            let title = this.findTitle();

            // And set it, then.
            let separator: string = '';
            if (title && this.systemName) {
                separator = ' | ';
            }

            // And set the title immediately.
            super.setTitle(`${title} ${separator} ${this.systemName}`);
        }, this.titleFetchTimeout);
    }

    private findTitle(): string {
        let title: string | undefined = '';
        if (!title) { // First check the first container's title.
            title = document.querySelector('#mainContentContainer>*>c-card>c-card-header>h5')?.textContent?.trim().replaceAll('  ', ' ');
        }
        if (!title) { // Maybe the first container is in a form?
            title = document.querySelector('#mainContentContainer>*>form>c-card>c-card-header>h5')?.textContent?.trim().replaceAll('  ', ' ');
        }
        if (!title) { // *sigh* okay, let' use the breadcrumbs then.
            title = document.querySelector('nav>ol>li.breadcrumb-item:last-child')?.textContent?.trim();
        }
        if (!title) { // This seems odd, but it just prevens the 'undefined' string from being set as title.
            title = '';
        }

        return String(title);
    }
}
