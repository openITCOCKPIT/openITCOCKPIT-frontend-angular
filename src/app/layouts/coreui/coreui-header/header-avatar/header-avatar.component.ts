import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { ProfileService } from '../../../../pages/profile/profile.service';
import initials from 'initials';
import { Avatar } from 'primeng/avatar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from '@coreui/angular';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'oitc-header-avatar',
    imports: [
        Avatar,
        FaIconComponent,
        TooltipDirective,
        TranslocoPipe
    ],
    templateUrl: './header-avatar.component.html',
    styleUrl: './header-avatar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderAvatarComponent implements OnDestroy {

    public image: string | null = null;
    public nameInitials = ''; // Unknown User
    public hasRootPrivileges: boolean = false;

    private readonly subscriptions: Subscription = new Subscription();
    private readonly AuthService = inject(AuthService);
    private readonly ProfileService = inject(ProfileService);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.subscriptions.add(this.AuthService.authenticated$.subscribe((authenticated) => {
            if (authenticated) {
                // User is logged in
                this.loadProfile();
            }
        }));

        this.subscriptions.add(this.ProfileService.profileImageChanged$.subscribe((value) => {
            // The user has changed their profile image
            this.loadProfile();
        }));

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private loadProfile(): void {
        this.subscriptions.add(this.ProfileService.getProfile().subscribe((profile) => {
            const firstname = profile.user.firstname;
            const lastname = profile.user.lastname;
            const fullname = `${firstname} ${lastname}`;

            this.nameInitials = initials(fullname);

            this.image = null;
            if (profile.user.image) {
                this.image = profile.user.image;
            }

            this.hasRootPrivileges = profile.hasRootPrivileges;

            this.cdr.markForCheck();
        }));
    }

}
