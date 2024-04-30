import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ngSwitchMultiCase',
    standalone: true
})
export class NgSwitchMultiCasePipe implements PipeTransform {

    // Thanks to https://www.reddit.com/r/Angular2/comments/12liatu/comment/jr2fh08/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    // WTF - seriously, why is this not a built-in feature of Angular?
    // https://github.com/angular/angular/issues/14659
    transform(caseValue: string, ...casesToCheck: string[]): string | undefined {
        return casesToCheck.includes(caseValue) ? caseValue : undefined;
    }

}
