/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Directive({
    selector: '[oitcResizable]',
    standalone: true
})
export class ResizableDirective implements AfterViewInit {

    @Output() resizeStop = new EventEmitter<{ width: number, height: number }>();
    @Input() aspectRatio: boolean = false;

    private lastWidth: number = 0
    private lastHeight: number = 0;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.renderer.addClass(this.el.nativeElement, 'resizable');
        this.renderer.listen(this.el.nativeElement, 'mouseup', this.onMouseUp.bind(this));
    }

    public ngAfterViewInit(): void {
        // timeout needed to prevent that height is 0
        setTimeout(() => {
            const rect = this.el.nativeElement.getBoundingClientRect();
            this.setLastWidthHeight(rect.width, rect.height);
        }, 400);
    }

    private onMouseUp() {
        const rect = this.el.nativeElement.getBoundingClientRect();
        let newWidth = rect.width;
        let newHeight = rect.height;

        if (this.aspectRatio) {
            let aspectRatio = this.lastWidth / this.lastHeight;
            if (this.lastWidth === 0 || this.lastHeight === 0) {
                aspectRatio = newWidth / newHeight;
            }
            if (newWidth / newHeight > aspectRatio) {
                newWidth = newHeight * aspectRatio;
            } else {
                newHeight = newWidth / aspectRatio;
            }
        }

        if ((newWidth !== this.lastWidth || newHeight !== this.lastHeight) && (this.lastWidth !== 0 && this.lastHeight !== 0)) {
            this.lastWidth = newWidth;
            this.lastHeight = newHeight;
            this.resizeStop.emit({width: newWidth, height: newHeight});
        }

        this.lastWidth = newWidth;
        this.lastHeight = newHeight;
    }

    // its important to put this function in the init of the item to make sure that the lastWidth and lastHeight are set
    public setLastWidthHeight(width: number, height: number) {
        this.lastWidth = width;
        this.lastHeight = height;
    }

}
