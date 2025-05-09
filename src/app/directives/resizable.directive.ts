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

import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';

@Directive({
    selector: '[oitcResizable]',
    standalone: true
})
export class ResizableDirective implements AfterViewInit, OnDestroy {

    @Output() resizeStop = new EventEmitter<{ width: number, height: number }>();
    @Input() aspectRatio: boolean = false;

    private lastWidth: number = 0
    private lastHeight: number = 0;
    private mouseUpListener: () => void;
    private mouseDownListener: () => void;
    private mouseMoveListener: () => void;
    private resizeObserver?: ResizeObserver;
    private mouseMove = false;
    private mouseDown = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.renderer.addClass(this.el.nativeElement, 'resizable');
        this.mouseUpListener = this.renderer.listen(this.el.nativeElement, 'mouseup', this.onMouseUp.bind(this));
        this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
        this.mouseMoveListener = this.renderer.listen(this.el.nativeElement, 'mousemove', this.onMouseMove.bind(this));
        this.resizeObserver = new ResizeObserver(() => {
            let calculatedAspectRatio = this.calculateAspectRatio();

            let newWidth = calculatedAspectRatio.width;
            let newHeight = calculatedAspectRatio.height;

            if (this.mouseDown && this.mouseMove && !this.el.nativeElement.classList.contains('resize-border') && this.hasSizeChanged(newWidth, newHeight)) {
                this.renderer.addClass(this.el.nativeElement, 'resize-border');
            }
        });
        this.resizeObserver.observe(this.el.nativeElement);
    }

    public ngAfterViewInit(): void {
        // timeout needed to prevent that height is 0
        setTimeout(() => {
            this.setLastWidthHeightByHimself();
        }, 400);
    }

    public ngOnDestroy(): void {
        this.mouseDownListener();
        this.mouseUpListener();
        this.mouseMoveListener();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    private onMouseDown() {
        this.setLastWidthHeightByHimself();
        this.mouseDown = true;
    }

    private onMouseMove() {
        this.mouseMove = true;
    }

    private onMouseUp() {
        let calculatedAspectRatio = this.calculateAspectRatio();

        let newWidth = calculatedAspectRatio.width;
        let newHeight = calculatedAspectRatio.height;

        if (this.hasSizeChanged(newWidth, newHeight)) {
            this.lastWidth = newWidth;
            this.lastHeight = newHeight;
            this.resizeStop.emit({width: newWidth, height: newHeight});
        }

        this.lastWidth = newWidth;
        this.lastHeight = newHeight;
        this.mouseDown = false;
        this.mouseMove = false;
        this.renderer.removeClass(this.el.nativeElement, 'resize-border');
    }

    private calculateAspectRatio(): { width: number, height: number } {
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
        newWidth = Math.round(newWidth);
        newHeight = Math.round(newHeight);

        return {width: newWidth, height: newHeight};
    }

    private hasSizeChanged(newWidth: number, newHeight: number): boolean {
        return (newWidth !== this.lastWidth || newHeight !== this.lastHeight) && (this.lastWidth !== 0 && this.lastHeight !== 0) && (newWidth !== 0 && newHeight !== 0);
    }

    public setLastWidthHeightByHimself() {
        const rect = this.el.nativeElement.getBoundingClientRect();
        this.setLastWidthHeight(rect.width, rect.height);
    }

    // its important to put this function in the init of the item to make sure that the lastWidth and lastHeight are set
    public setLastWidthHeight(width: number, height: number) {
        this.lastWidth = Math.round(width);
        this.lastHeight = Math.round(height);
    }

}
