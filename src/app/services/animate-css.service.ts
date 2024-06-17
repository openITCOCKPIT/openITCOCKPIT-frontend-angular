import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AnimateCssService {

    private readonly document = inject(DOCUMENT);


    constructor() {
    }

    /**
     * Animate an element with a CSS animation
     * By default "animate__" will be added as prefix
     * Example animateCSS('.my-element', 'bounce')
     * @param element valid CSS selector like #id or .class or "div.user-panel.main input[name='login']"
     * @param animation
     * @param prefix
     */
    public animateCSS = (element: string, animation: string, prefix: string = 'animate__'): Promise<string> => {
        return new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = this.document.querySelector(element);

            if (!node) {
                reject('No node found');
                return;
            }

            node.classList.add(`${prefix}animated`, animationName);

            function handleAnimationEnd(event: AnimationEvent) {
                event.stopPropagation();
                if (node) {
                    node.classList.remove(`${prefix}animated`, animationName);
                }
                resolve('Animation ended');
            }

            // @ts-ignore
            node.addEventListener('animationend', handleAnimationEnd, {once: true});
        });
    };

}
