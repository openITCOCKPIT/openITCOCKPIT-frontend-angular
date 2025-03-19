import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  AlertComponent,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormLabelDirective,
  RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgForOf, NgIf } from '@angular/common';



import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { LoginImage } from '../users.interface';
import { AuthService } from '../../../auth/auth.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
// PRTCLS
import { Container, Engine, MoveDirection, OutMode, } from "@tsparticles/engine";
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";
import { InstantreportObjectTypes } from '../../instantreports/instantreports.enums';
import { LayoutOptions, LayoutService } from '../../../layouts/coreui/layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';
import { LoginResponse } from '../../../auth/auth.interface';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'oitc-users-login',
    imports: [
    FaIconComponent,
    AlertComponent,
    FormsModule,
    TranslocoDirective,
    NgIf,
    FormControlDirective,
    FormLabelDirective,
    FormCheckComponent,
    RowComponent,
    ColComponent,
    NgxParticlesModule,
    NgForOf,
    FormCheckInputDirective,
    FormCheckLabelDirective
],
    templateUrl: './users-login.component.html',
    styleUrl: './users-login.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersLoginComponent implements OnInit, OnDestroy {
    private readonly UsersService: UsersService = inject(UsersService);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly LayoutService: LayoutService = inject(LayoutService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly NotyService: NotyService = inject(NotyService);
    private readonly AuthService: AuthService = inject(AuthService);
    private readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly TitleService: Title = inject(Title);
    private _csrfToken: string = '';

    protected logoUrl: string = '';
    protected isSsoEnabled: boolean = true;
    protected forceRedirectSsousersToLoginScreen: boolean = false;
    protected hasValidSslCertificate: boolean = false;
    protected loginAnimation: boolean = true;
    protected disableAnimation: boolean = false;
    protected disableLogin: boolean = false;
    protected particlesOptions: any = {
        background: {
            color: {
                value: "#0d47a1",
            },
        },
        fpsLimit: 120,
        interactivity: {
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            move: {
                direction: MoveDirection.none,
                enable: true,
                outModes: {
                    default: OutMode.bounce,
                },
                random: false,
                speed: 6,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: {min: 1, max: 5},
            },
        },
        detectRetina: true,
    };
    protected images: LoginImage[] = [];
    protected customLoginBackgroundHtml: string = '';
    protected isCustomLoginBackground: boolean = false;
    protected description: string = '';
    protected post: { email: string, password: string, remember_me: boolean } = {
        email: '',
        password: '',
        remember_me: true
    };

    constructor(private readonly ngParticlesService: NgParticlesService) {
        localStorage.removeItem('browserUuid');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
        // Switch back to the default layout otherwise we screw up the layout for the next page
        this.LayoutService.setLayout(LayoutOptions.Default);
    }

    public ngOnInit(): void {
        // Switch to a blank layout for the login screen
        this.LayoutService.setLayout(LayoutOptions.Blank);

        this.subscriptions.add(this.UsersService.getLoginDetails().subscribe(data => {
            this.TitleService.setTitle('Login');

            this.images = data.images.images;
            this.isSsoEnabled = data.isSsoEnabled;
            this.forceRedirectSsousersToLoginScreen = data.forceRedirectSsousersToLoginScreen;
            this.hasValidSslCertificate = data.hasValidSslCertificate;
            this.logoUrl = data.logoUrl;
            this.customLoginBackgroundHtml = data.customLoginBackgroundHtml;
            this.isCustomLoginBackground = data.isCustomLoginBackground;
            this.loginAnimation = !data.disableAnimation;
            this.disableAnimation = data.disableAnimation; // Server wants us to not have this feature at all

            switch (data.images.particles) {
                case 'none':
                    break;

                case 'snow':
                    this.particlesOptions = this.getSnowConfig();
                    break;

                case 'stars':
                    this.particlesOptions = this.getStarsConfig();
                    break;

                case 'bubble':
                    this.particlesOptions = this.getBubbleConfig();
                    break;

                default:
                    this.particlesOptions = this.getDefaultConfig();
                    break;
            }

            if (this.loginAnimation) {
                this.ngParticlesService.init(async (engine: Engine) => {
                    await loadFull(engine);
                });
            }


            this._csrfToken = data._csrfToken;

            var hasSsoError = false;
            if (data.hasOwnProperty('errorMessages')) {
                for (var index in data.errorMessages) {
                    hasSsoError = true;
                    this.NotyService.genericError(data.errorMessages[index]);
                }
            }

            if (data.isLoggedIn) {
                //User maybe logged in via oAuth?
                this.isOAuthResponse(hasSsoError);
            }

            if (!data.isLoggedIn && !hasSsoError) {
                if (data.isSsoEnabled && data.forceRedirectSsousersToLoginScreen) {
                    setTimeout(function () {
                        window.location.href = '/users/login?redirect_sso=true';
                    }, 10);
                }
            }
            this.cdr.markForCheck();
        }));
    }

    public particlesLoaded(container: Container): void {
    }

    protected submit(): void {

        this.disableLogin = true;


        //Submit as classic form (not as json data) so that
        //CakePHPs FormAuthenticator is able to parse the POST data
        //AngularJS $httpParamSerializerJQLike is going to encode the data for us...

        this.subscriptions.add(this.AuthService.login(this.post.email, this.post.password, this.post.remember_me).subscribe((data: LoginResponse) => {
            this.cdr.markForCheck();
            if (data.success) {
                this.disableLogin = false;
                this.NotyService.genericSuccess('Login successful', 'success');

                // Load user permissions
                this.PermissionsService.loadPermissions();

                //window.location = this.getLocalStorageItemWithDefaultAndRemoveItem('lastPage', '/');

                this.router.navigate(['/']); //todo replace with last page

                return;
            }

            // still required?  this.loadCsrf();
            this.disableLogin = false;

            if (data.hasOwnProperty('errors')) {
                let errors: { [key: string]: string[] } = data.errors as unknown as { [key: string]: string[] };
                for (let key in errors) {
                    if (typeof errors[key] === "string") {
                        this.NotyService.genericError(errors[key] as unknown as string);
                        return;
                    }
                    for (let index in errors[key]) {
                        this.NotyService.genericError(errors[key][index]);
                    }
                }
            }

            this.disableLogin = false;
            this.hasValidSslCertificate = false;
        }));

    }

    protected isOAuthResponse = (hasSsoError: boolean) => {
        if (hasSsoError === true) {
            return;
        }

        //    var sourceUrl = parseUri(decodeURIComponent(window.location.href)).source;
        var sourceUrl = '';
        if (sourceUrl.includes('/#!/')) {
            sourceUrl = sourceUrl.replace('/#!', '');
        }

        //    var query = parseUri(sourceUrl).queryKey;
        let query = {};
        if (query.hasOwnProperty('code') && query.hasOwnProperty('state')) {
            // User got redirected back from oAuth servers login screen to openITCOCKPIT

            this.NotyService.genericSuccess('Login successful');

            window.location.href = this.getLocalStorageItemWithDefaultAndRemoveItem('lastPage', '/');
        }

    };

    private getLocalStorageItemWithDefaultAndRemoveItem = function (key: string, defaultValue: any) {
        var val = window.localStorage.getItem(key);
        if (val === null) {
            return defaultValue;
        }
        //window.localStorage.removeItem(key);
        return val;
    };

    private getDefaultConfig = () => {
        return {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "fpsLimit": 30,
            "config_demo": {
                "hide_card": false,
                "background_color": "#b61924",
                "background_image": "",
                "background_position": "50% 50%",
                "background_repeat": "no-repeat",
                "background_size": "cover"
            }
        }
    };

    private getSnowConfig = () => {
        return {
            "particles": {
                "number": {
                    "value": 400,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#fff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 10,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 500,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "bottom",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 4,
                        "duration": 0.3,
                        "opacity": 1,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "fpsLimit": 30
        };
    };

    private getStarsConfig = () => {
        return {
            "particles": {
                "number": {
                    "value": 160,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 1,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 4,
                        "size_min": 0.3,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 600
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "bubble"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 250,
                        "size": 0,
                        "duration": 2,
                        "opacity": 0,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 400,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "fpsLimit": 30
        };
    };

    private getBubbleConfig = () => {
        return {
            "particles": {
                "number": {
                    "value": 6,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#1b1e34"
                },
                "shape": {
                    "type": "polygon",
                    "stroke": {
                        "width": 0,
                        "color": "#000"
                    },
                    "polygon": {
                        "nb_sides": 6
                    },
                    "image": {
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 160,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 10,
                        "size_min": 40,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false,
                    "distance": 200,
                    "color": "#ffffff",
                    "opacity": 1,
                    "width": 2
                },
                "move": {
                    "enable": true,
                    "speed": 8,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "fpsLimit": 30
        };
    };
}
