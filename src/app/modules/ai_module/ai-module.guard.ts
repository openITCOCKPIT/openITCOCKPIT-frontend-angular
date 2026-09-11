import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { PermissionsService } from '../../permissions/permissions.service';

/**
 * Keeps this module's routes from opening where the module is not installed.
 *
 * The compiled bundle contains the routes of every module, whether or not the
 * plugin exists on the server. Nothing links here in that case - the menu comes
 * from the server - but a typed or bookmarked URL would render a page whose
 * first request answers 404. The module list comes from the same payload as the
 * permissions.
 */
export const aiModuleGuard: CanActivateFn = () => {
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);

    return permissionsService.hasModuleObservable('AiModule').pipe(
        map(hasModule => hasModule ? true : router.createUrlTree(['/']))
    );
};
