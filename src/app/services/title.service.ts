import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class TitleService extends Title {
    private systemName: string = '';
    private titleFetchTimeout: number = 200;

    public setSystemName(systemName: string): void {
        console.log('TitleService::setSystemName', systemName);
        this.systemName = systemName;
    }

    override setTitle(title: string | undefined = ''): void {
        /*
         * I am a workaround!
         *
         * This method is invoked on route changes.
         * In that moment, the new page is not yet fully loaded.
         * So we need to wait a tiny bit before actively fetching the title from the new laded DOM.
         */
        setTimeout(() => {
            console.log('TitleService::setTitle::Anon begin', title);
            if (!title) { // If it is wrapped in a form...
                title = document.querySelector('#mainContentContainer>*>c-card>c-card-header>h5')?.textContent?.trim().replaceAll('  ', ' ');
                console.log('TitleService::setTitle::Anon from #mainContentContainer>*>c-card>c-card-header>h5', title);
            }
            if (!title) { // If it is wrapped in a form...
                title = document.querySelector('#mainContentContainer>*>form>c-card>c-card-header>h5')?.textContent?.trim().replaceAll('  ', ' ');
                console.log('TitleService::setTitle::Anon from #mainContentContainer>*>form>c-card>c-card-header>h5', title);
            }
            if (!title) { // If no title was found, try loading the title from the breadcrumb.
                title = document.querySelector('nav>ol>li.breadcrumb-item:last-child')?.textContent?.trim();
                console.log('TitleService::setTitle::Anon nav>ol>li.breadcrumb-item:last-child', title);
            }

            // Set the title, duh...
            super.setTitle(`${title} | ${this.systemName}`);
        }, this.titleFetchTimeout);
    }
}
