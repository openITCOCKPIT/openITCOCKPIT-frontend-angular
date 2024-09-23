import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    AlertComponent,
    ColComponent,
    FormCheckComponent,
    FormControlDirective,
    FormLabelDirective,
    InputGroupComponent,
    RowComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { UsersService } from '../users.service';
import { Subscription } from 'rxjs';
import { LoginImage } from '../users.interface';
import { AuthService } from '../../../auth/auth.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
// PRTCLS
import { Container, Engine, MoveDirection, OutMode, } from "@tsparticles/engine";
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { NgParticlesService, NgxParticlesModule } from "@tsparticles/angular";

@Component({
    selector: 'oitc-users-login',
    standalone: true,
    imports: [
        FaIconComponent,
        AlertComponent,
        FormsModule,
        TranslocoDirective,
        NgIf,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        FormCheckComponent,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        NgxParticlesModule,
        NgForOf,
        NgStyle,
    ],
    templateUrl: './users-login.component.html',
    styleUrl: './users-login.component.css'
})
export class UsersLoginComponent implements OnInit, OnDestroy {
    private readonly UsersService: UsersService = inject(UsersService);
    protected logoUrl: string = '';

    protected isSsoEnabled: boolean = true;
    protected forceRedirectSsousersToLoginScreen: boolean = false;
    protected hasValidSslCertificate: boolean = false;
    protected disableLoginAnimation: boolean = false;

    protected disableLogin: boolean = false;
    private subscriptions: Subscription = new Subscription();

    protected post: { email: string, password: string, remember_me: boolean } = {
        email: '',
        password: '',
        remember_me: false
    };

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
    private readonly NotyService: NotyService = inject(NotyService);
    private _csrfToken: string = '';

    constructor(private readonly ngParticlesService: NgParticlesService) {
        localStorage.removeItem('browserUuid');

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.subscriptions.add(this.UsersService.getLoginDetails().subscribe(data => {
            this.images = data.images.images;
            this.isSsoEnabled = data.isSsoEnabled;
            this.forceRedirectSsousersToLoginScreen = data.forceRedirectSsousersToLoginScreen;
            this.hasValidSslCertificate = data.hasValidSslCertificate;
            this.logoUrl = data.logoUrl;

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
            this.ngParticlesService.init(async (engine: Engine) => {
                await loadFull(engine);
            });


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
        }));
    }

    protected description: string = 'Lorem ipsum dolor sit amet';

    getBackgroundUrl(image: string): string {
        return `url('/img/login/${image}')`;
    }
    particlesLoaded(container: Container): void {
        console.log(container);
    }

    private readonly AuthService: AuthService = inject(AuthService);

    protected submit(): void {

        this.disableLogin = true;


        //Submit as classic form (not as json data) so that
        //CakePHPs FormAuthenticator is able to parse the POST data
        //AngularJS $httpParamSerializerJQLike is going to encode the data for us...

        this.subscriptions.add(this.AuthService.login(this.post.email, this.post.password, this.post.remember_me).subscribe(data => {

            // FERDSCH:
            if (data) {
                this.disableLogin = false;
                this.NotyService.genericSuccess('Login successful', 'success');
                window.location = this.getLocalStorageItemWithDefaultAndRemoveItem('lastPage', '/');
                return;
            }


            //noch nötich?  this.loadCsrf();
            this.disableLogin = false;

            if (data.hasOwnProperty('errors')) {
                let errors: {} = data as unknown as object;
                /*
                for (var key in errors) {
                    if (typeof errors[key] === "string") {
                        this.NotyService.genericError(errors[key]);
                        return;
                    }
                    for (var index in errors[key]) {
                        this.NotyService.genericError(errors[key][index]);
                    }
                }
                 */
            }
            this.NotyService.genericError('Unknown error');

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

            console.log(this.getLocalStorageItemWithDefaultAndRemoveItem('lastPage', '/'));
            window.location.href = this.getLocalStorageItemWithDefaultAndRemoveItem('lastPage', '/');
        }

    };

    getLocalStorageItemWithDefaultAndRemoveItem = function (key: string, defaultValue: any) {
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
