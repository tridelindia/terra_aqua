import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation, numberAttribute } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Splitter is utilized to separate and resize panels.
 * @group Components
 */
export class Splitter {
    document;
    platformId;
    renderer;
    cd;
    el;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass;
    /**
     * Style class of the panel.
     * @group Props
     */
    panelStyleClass;
    /**
     * Inline style of the component.
     * @group Props
     */
    style;
    /**
     * Inline style of the panel.
     * @group Props
     */
    panelStyle;
    /**
     * Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage.
     * @group Props
     */
    stateStorage = 'session';
    /**
     * Storage identifier of a stateful Splitter.
     * @group Props
     */
    stateKey = null;
    /**
     * Orientation of the panels. Valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    layout = 'horizontal';
    /**
     * Size of the divider in pixels.
     * @group Props
     */
    gutterSize = 4;
    /**
     * Step factor to increment/decrement the size of the panels while pressing the arrow keys.
     * @group Props
     */
    step = 5;
    /**
     * Minimum size of the elements relative to 100%.
     * @group Props
     */
    minSizes = [];
    /**
     * Size of the elements relative to 100%.
     * @group Props
     */
    get panelSizes() {
        return this._panelSizes;
    }
    set panelSizes(val) {
        this._panelSizes = val;
        if (this.el && this.el.nativeElement && this.panels.length > 0) {
            let children = [...this.el.nativeElement.children[0].children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
            let _panelSizes = [];
            this.panels.map((panel, i) => {
                let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                let panelSize = panelInitialSize ?? 100 / this.panels.length;
                _panelSizes[i] = panelSize;
                children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            });
        }
    }
    /**
     * Callback to invoke when resize ends.
     * @param {SplitterResizeEndEvent} event - Custom panel resize end event
     * @group Emits
     */
    onResizeEnd = new EventEmitter();
    /**
     * Callback to invoke when resize starts.
     * @param {SplitterResizeStartEvent} event - Custom panel resize start event
     * @group Emits
     */
    onResizeStart = new EventEmitter();
    templates;
    containerViewChild;
    nested = false;
    panels = [];
    dragging = false;
    mouseMoveListener;
    mouseUpListener;
    touchMoveListener;
    touchEndListener;
    size;
    gutterElement;
    startPos;
    prevPanelElement;
    nextPanelElement;
    nextPanelSize;
    prevPanelSize;
    _panelSizes = [];
    prevPanelIndex;
    timer;
    prevSize;
    window;
    constructor(document, platformId, renderer, cd, el) {
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.cd = cd;
        this.el = el;
        this.window = this.document.defaultView;
    }
    ngOnInit() {
        this.nested = this.isNested();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'panel':
                    this.panels.push(item.template);
                    break;
                default:
                    this.panels.push(item.template);
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.panels && this.panels.length) {
                let initialized = false;
                if (this.isStateful()) {
                    initialized = this.restoreState();
                }
                if (!initialized) {
                    let children = [...this.el.nativeElement.children[0].children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
                    let _panelSizes = [];
                    this.panels.map((panel, i) => {
                        let panelInitialSize = this.panelSizes.length - 1 >= i ? this.panelSizes[i] : null;
                        let panelSize = panelInitialSize || 100 / this.panels.length;
                        _panelSizes[i] = panelSize;
                        children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
                    });
                    this._panelSizes = _panelSizes;
                    this.prevSize = parseFloat(_panelSizes[0]).toFixed(4);
                }
            }
        }
    }
    resizeStart(event, index, isKeyDown) {
        this.gutterElement = event.currentTarget || event.target.parentElement;
        this.size = this.horizontal() ? DomHandler.getWidth(this.containerViewChild.nativeElement) : DomHandler.getHeight(this.containerViewChild.nativeElement);
        if (!isKeyDown) {
            this.dragging = true;
            this.startPos = this.horizontal() ? (event instanceof MouseEvent ? event.pageX : event.changedTouches[0].pageX) : event instanceof MouseEvent ? event.pageY : event.changedTouches[0].pageY;
        }
        this.prevPanelElement = this.gutterElement.previousElementSibling;
        this.nextPanelElement = this.gutterElement.nextElementSibling;
        if (isKeyDown) {
            this.prevPanelSize = this.horizontal() ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true);
            this.nextPanelSize = this.horizontal() ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true);
        }
        else {
            this.prevPanelSize = (100 * (this.horizontal() ? DomHandler.getOuterWidth(this.prevPanelElement, true) : DomHandler.getOuterHeight(this.prevPanelElement, true))) / this.size;
            this.nextPanelSize = (100 * (this.horizontal() ? DomHandler.getOuterWidth(this.nextPanelElement, true) : DomHandler.getOuterHeight(this.nextPanelElement, true))) / this.size;
        }
        this.prevPanelIndex = index;
        DomHandler.addClass(this.gutterElement, 'p-splitter-gutter-resizing');
        this.gutterElement.setAttribute('data-p-gutter-resizing', 'true');
        DomHandler.addClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.containerViewChild.nativeElement.setAttribute('data-p-resizing', 'true');
        this.onResizeStart.emit({ originalEvent: event, sizes: this._panelSizes });
    }
    onResize(event, step, isKeyDown) {
        let newPos, newPrevPanelSize, newNextPanelSize;
        if (isKeyDown) {
            if (this.horizontal()) {
                newPrevPanelSize = (100 * (this.prevPanelSize + step)) / this.size;
                newNextPanelSize = (100 * (this.nextPanelSize - step)) / this.size;
            }
            else {
                newPrevPanelSize = (100 * (this.prevPanelSize - step)) / this.size;
                newNextPanelSize = (100 * (this.nextPanelSize + step)) / this.size;
            }
        }
        else {
            if (this.horizontal())
                newPos = (event.pageX * 100) / this.size - (this.startPos * 100) / this.size;
            else
                newPos = (event.pageY * 100) / this.size - (this.startPos * 100) / this.size;
            newPrevPanelSize = this.prevPanelSize + newPos;
            newNextPanelSize = this.nextPanelSize - newPos;
        }
        this.prevSize = parseFloat(newPrevPanelSize).toFixed(4);
        if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
            this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            this._panelSizes[this.prevPanelIndex] = newPrevPanelSize;
            this._panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
        }
    }
    resizeEnd(event) {
        if (this.isStateful()) {
            this.saveState();
        }
        this.onResizeEnd.emit({ originalEvent: event, sizes: this._panelSizes });
        DomHandler.removeClass(this.gutterElement, 'p-splitter-gutter-resizing');
        DomHandler.removeClass(this.containerViewChild.nativeElement, 'p-splitter-resizing');
        this.clear();
    }
    onGutterMouseDown(event, index) {
        this.resizeStart(event, index);
        this.bindMouseListeners();
    }
    onGutterTouchStart(event, index) {
        if (event.cancelable) {
            this.resizeStart(event, index);
            this.bindTouchListeners();
            event.preventDefault();
        }
    }
    onGutterTouchMove(event) {
        this.onResize(event);
        event.preventDefault();
    }
    onGutterTouchEnd(event) {
        this.resizeEnd(event);
        this.unbindTouchListeners();
        if (event.cancelable)
            event.preventDefault();
    }
    repeat(event, index, step) {
        this.resizeStart(event, index, true);
        this.onResize(event, step, true);
    }
    setTimer(event, index, step) {
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, index, step);
        }, 40);
    }
    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    onGutterKeyUp(event) {
        this.clearTimer();
        this.resizeEnd(event);
    }
    onGutterKeyDown(event, index) {
        switch (event.code) {
            case 'ArrowLeft': {
                if (this.layout === 'horizontal') {
                    this.setTimer(event, index, this.step * -1);
                }
                event.preventDefault();
                break;
            }
            case 'ArrowRight': {
                if (this.layout === 'horizontal') {
                    this.setTimer(event, index, this.step);
                }
                event.preventDefault();
                break;
            }
            case 'ArrowDown': {
                if (this.layout === 'vertical') {
                    this.setTimer(event, index, this.step * -1);
                }
                event.preventDefault();
                break;
            }
            case 'ArrowUp': {
                if (this.layout === 'vertical') {
                    this.setTimer(event, index, this.step);
                }
                event.preventDefault();
                break;
            }
            default:
                //no op
                break;
        }
    }
    validateResize(newPrevPanelSize, newNextPanelSize) {
        const prevPanelIndex = this.prevPanelIndex;
        if (this.minSizes.length > prevPanelIndex && this.minSizes[prevPanelIndex] && this.minSizes[prevPanelIndex] > newPrevPanelSize) {
            return false;
        }
        const nextPanelIndex = this.prevPanelIndex + 1;
        if (this.minSizes.length > nextPanelIndex && this.minSizes[nextPanelIndex] && this.minSizes[nextPanelIndex] > newNextPanelSize) {
            return false;
        }
        return true;
    }
    bindMouseListeners() {
        if (!this.mouseMoveListener) {
            this.mouseMoveListener = this.renderer.listen(this.document, 'mousemove', (event) => {
                this.onResize(event);
            });
        }
        if (!this.mouseUpListener) {
            this.mouseUpListener = this.renderer.listen(this.document, 'mouseup', (event) => {
                this.resizeEnd(event);
                this.unbindMouseListeners();
            });
        }
    }
    bindTouchListeners() {
        if (!this.touchMoveListener) {
            this.touchMoveListener = this.renderer.listen(this.document, 'touchmove', (event) => {
                this.onResize(event.changedTouches[0]);
            });
        }
        if (!this.touchEndListener) {
            this.touchEndListener = this.renderer.listen(this.document, 'touchend', (event) => {
                this.resizeEnd(event);
                this.unbindTouchListeners();
            });
        }
    }
    unbindMouseListeners() {
        if (this.mouseMoveListener) {
            this.mouseMoveListener();
            this.mouseMoveListener = null;
        }
        if (this.mouseUpListener) {
            this.mouseUpListener();
            this.mouseUpListener = null;
        }
    }
    unbindTouchListeners() {
        if (this.touchMoveListener) {
            this.touchMoveListener();
            this.touchMoveListener = null;
        }
        if (this.touchEndListener) {
            this.touchEndListener();
            this.touchEndListener = null;
        }
    }
    clear() {
        this.dragging = false;
        this.size = null;
        this.startPos = null;
        this.prevPanelElement = null;
        this.nextPanelElement = null;
        this.prevPanelSize = null;
        this.nextPanelSize = null;
        this.gutterElement = null;
        this.prevPanelIndex = null;
    }
    isNested() {
        if (this.el.nativeElement) {
            let parent = this.el.nativeElement.parentElement;
            while (parent && !DomHandler.hasClass(parent, 'p-splitter')) {
                parent = parent.parentElement;
            }
            return parent !== null;
        }
        else {
            return false;
        }
    }
    isStateful() {
        return this.stateKey != null;
    }
    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            switch (this.stateStorage) {
                case 'local':
                    return this.window.localStorage;
                case 'session':
                    return this.window.sessionStorage;
                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        }
        else {
            throw new Error('Storage is not a available by default on the server.');
        }
    }
    saveState() {
        this.getStorage().setItem(this.stateKey, JSON.stringify(this._panelSizes));
    }
    restoreState() {
        const storage = this.getStorage();
        const stateString = storage.getItem(this.stateKey);
        if (stateString) {
            this._panelSizes = JSON.parse(stateString);
            let children = [...this.containerViewChild.nativeElement.children].filter((child) => DomHandler.hasClass(child, 'p-splitter-panel'));
            children.forEach((child, i) => {
                child.style.flexBasis = 'calc(' + this._panelSizes[i] + '% - ' + (this.panels.length - 1) * this.gutterSize + 'px)';
            });
            return true;
        }
        return false;
    }
    containerClass() {
        return {
            'p-splitter p-component': true,
            'p-splitter-horizontal': this.layout === 'horizontal',
            'p-splitter-vertical': this.layout === 'vertical'
        };
    }
    panelContainerClass() {
        return {
            'p-splitter-panel': true,
            'p-splitter-panel-nested': true
        };
    }
    gutterStyle() {
        if (this.horizontal())
            return { width: this.gutterSize + 'px' };
        else
            return { height: this.gutterSize + 'px' };
    }
    horizontal() {
        return this.layout === 'horizontal';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Splitter, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Splitter, selector: "p-splitter", inputs: { styleClass: "styleClass", panelStyleClass: "panelStyleClass", style: "style", panelStyle: "panelStyle", stateStorage: "stateStorage", stateKey: "stateKey", layout: "layout", gutterSize: ["gutterSize", "gutterSize", numberAttribute], step: ["step", "step", numberAttribute], minSizes: "minSizes", panelSizes: "panelSizes" }, outputs: { onResizeEnd: "onResizeEnd", onResizeStart: "onResizeStart" }, host: { properties: { "class.p-splitter-panel-nested": "nested" }, classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" [attr.data-pc-name]="'splitter'" [attr.data-p-gutter-resizing]="false" [attr.data-pc-section]="'root'">
            <ng-template ngFor let-panel [ngForOf]="panels" let-i="index">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle" tabindex="-1" [attr.data-pc-name]="'splitter'" [attr.data-pc-section]="'root'">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div
                    *ngIf="i !== panels.length - 1"
                    class="p-splitter-gutter"
                    role="separator"
                    tabindex="-1"
                    (mousedown)="onGutterMouseDown($event, i)"
                    (touchstart)="onGutterTouchStart($event, i)"
                    (touchmove)="onGutterTouchMove($event)"
                    (touchend)="onGutterTouchEnd($event, i)"
                    [attr.data-p-gutter-resizing]="false"
                    [attr.data-pc-section]="'gutter'"
                >
                    <div
                        class="p-splitter-gutter-handle"
                        tabindex="0"
                        [ngStyle]="gutterStyle()"
                        [attr.aria-orientation]="layout"
                        [attr.aria-valuenow]="prevSize"
                        [attr.data-pc-section]="'gutterhandle'"
                        (keyup)="onGutterKeyUp($event)"
                        (keydown)="onGutterKeyDown($event, i)"
                    ></div>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-splitter{display:flex;flex-wrap:nowrap}.p-splitter-vertical{flex-direction:column}.p-splitter-panel{overflow:hidden;flex-grow:1}.p-splitter-panel-nested{display:flex;min-width:0}.p-splitter-panel p-splitter{flex-grow:1}.p-splitter-panel .p-splitter{flex-grow:1;border:0 none}.p-splitter-gutter{flex-grow:0;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize}.p-splitter-horizontal.p-splitter-resizing{cursor:col-resize;-webkit-user-select:none;user-select:none}.p-splitter-horizontal>.p-splitter-gutter>.p-splitter-gutter-handle{height:24px;width:100%}.p-splitter-horizontal>.p-splitter-gutter{cursor:col-resize}.p-splitter-vertical.p-splitter-resizing{cursor:row-resize;-webkit-user-select:none;user-select:none}.p-splitter-vertical>.p-splitter-gutter{cursor:row-resize}.p-splitter-vertical>.p-splitter-gutter>.p-splitter-gutter-handle{width:24px;height:100%}.p-splitter-resizing .p-splitter-panel{pointer-events:none}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Splitter, decorators: [{
            type: Component,
            args: [{ selector: 'p-splitter', template: `
        <div #container [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" [attr.data-pc-name]="'splitter'" [attr.data-p-gutter-resizing]="false" [attr.data-pc-section]="'root'">
            <ng-template ngFor let-panel [ngForOf]="panels" let-i="index">
                <div [ngClass]="panelContainerClass()" [class]="panelStyleClass" [ngStyle]="panelStyle" tabindex="-1" [attr.data-pc-name]="'splitter'" [attr.data-pc-section]="'root'">
                    <ng-container *ngTemplateOutlet="panel"></ng-container>
                </div>
                <div
                    *ngIf="i !== panels.length - 1"
                    class="p-splitter-gutter"
                    role="separator"
                    tabindex="-1"
                    (mousedown)="onGutterMouseDown($event, i)"
                    (touchstart)="onGutterTouchStart($event, i)"
                    (touchmove)="onGutterTouchMove($event)"
                    (touchend)="onGutterTouchEnd($event, i)"
                    [attr.data-p-gutter-resizing]="false"
                    [attr.data-pc-section]="'gutter'"
                >
                    <div
                        class="p-splitter-gutter-handle"
                        tabindex="0"
                        [ngStyle]="gutterStyle()"
                        [attr.aria-orientation]="layout"
                        [attr.aria-valuenow]="prevSize"
                        [attr.data-pc-section]="'gutterhandle'"
                        (keyup)="onGutterKeyUp($event)"
                        (keydown)="onGutterKeyDown($event, i)"
                    ></div>
                </div>
            </ng-template>
        </div>
    `, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        class: 'p-element',
                        '[class.p-splitter-panel-nested]': 'nested'
                    }, styles: ["@layer primeng{.p-splitter{display:flex;flex-wrap:nowrap}.p-splitter-vertical{flex-direction:column}.p-splitter-panel{overflow:hidden;flex-grow:1}.p-splitter-panel-nested{display:flex;min-width:0}.p-splitter-panel p-splitter{flex-grow:1}.p-splitter-panel .p-splitter{flex-grow:1;border:0 none}.p-splitter-gutter{flex-grow:0;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize}.p-splitter-horizontal.p-splitter-resizing{cursor:col-resize;-webkit-user-select:none;user-select:none}.p-splitter-horizontal>.p-splitter-gutter>.p-splitter-gutter-handle{height:24px;width:100%}.p-splitter-horizontal>.p-splitter-gutter{cursor:col-resize}.p-splitter-vertical.p-splitter-resizing{cursor:row-resize;-webkit-user-select:none;user-select:none}.p-splitter-vertical>.p-splitter-gutter{cursor:row-resize}.p-splitter-vertical>.p-splitter-gutter>.p-splitter-gutter-handle{width:24px;height:100%}.p-splitter-resizing .p-splitter-panel{pointer-events:none}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }], propDecorators: { styleClass: [{
                type: Input
            }], panelStyleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], panelStyle: [{
                type: Input
            }], stateStorage: [{
                type: Input
            }], stateKey: [{
                type: Input
            }], layout: [{
                type: Input
            }], gutterSize: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], step: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], minSizes: [{
                type: Input
            }], panelSizes: [{
                type: Input
            }], onResizeEnd: [{
                type: Output
            }], onResizeStart: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container', { static: false }]
            }] } });
export class SplitterModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: SplitterModule, declarations: [Splitter], imports: [CommonModule], exports: [Splitter, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitterModule, imports: [CommonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitterModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Splitter, SharedModule],
                    declarations: [Splitter]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc3BsaXR0ZXIvc3BsaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQUUsdUJBQXVCLEVBQXFCLFNBQVMsRUFBRSxlQUFlLEVBQWMsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQXdCLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcFAsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBR3pDOzs7R0FHRztBQTJDSCxNQUFNLE9BQU8sUUFBUTtJQWlJYTtJQUNHO0lBQ3JCO0lBQ0Q7SUFDQztJQXBJWjs7O09BR0c7SUFDTSxVQUFVLENBQXFCO0lBQ3hDOzs7T0FHRztJQUNNLGVBQWUsQ0FBcUI7SUFDN0M7OztPQUdHO0lBQ00sS0FBSyxDQUE4QztJQUM1RDs7O09BR0c7SUFDTSxVQUFVLENBQThDO0lBQ2pFOzs7T0FHRztJQUNNLFlBQVksR0FBdUIsU0FBUyxDQUFDO0lBQ3REOzs7T0FHRztJQUNNLFFBQVEsR0FBOEIsSUFBSSxDQUFDO0lBQ3BEOzs7T0FHRztJQUNNLE1BQU0sR0FBdUIsWUFBWSxDQUFDO0lBQ25EOzs7T0FHRztJQUNvQyxVQUFVLEdBQVcsQ0FBQyxDQUFDO0lBQzlEOzs7T0FHRztJQUNvQyxJQUFJLEdBQVcsQ0FBQyxDQUFDO0lBQ3hEOzs7T0FHRztJQUNNLFFBQVEsR0FBYSxFQUFFLENBQUM7SUFDakM7OztPQUdHO0lBQ0gsSUFBYSxVQUFVO1FBQ25CLE9BQU8s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QTdIZCxVQUFVO3NCQUFsQixLQUFLO2dCQUtHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBS0csS0FBSztzQkFBYixLQUFLO2dCQUtHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBS0csWUFBWTtzQkFBcEIsS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQUtHLE1BQU07c0JBQWQsS0FBSztnQkFLaUMsVUFBVTtzQkFBaEQsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUU7Z0JBS0UsSUFBSTtzQkFBMUMsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUU7Z0JBSzVCLFFBQVE7c0JBQWhCLEtBQUs7Z0JBS08sVUFBVTtzQkFBdEIsS0FBSztnQkF1QkksV0FBVztzQkFBcEIsTUFBTTtnQkFNRyxhQUFhO3NCQUF0QixNQUFNO2dCQUV5QixTQUFTO3NCQUF4QyxlQUFlO3VCQUFDLGFBQWE7Z0JBRWEsa0JBQWtCO3NCQUE1RCxTQUFTO3VCQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0FBb2E3QyxNQUFNLE9BQU8sY0FBYzt1R0FBZCxjQUFjO3dHQUFkLGNBQWMsaUJBNWZkLFFBQVEsYUF3ZlAsWUFBWSxhQXhmYixRQUFRLEVBeWZHLFlBQVk7d0dBR3ZCLGNBQWMsWUFKYixZQUFZLEVBQ0YsWUFBWTs7MkZBR3ZCLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDO29CQUNqQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIENvbnRlbnRDaGlsZHJlbiwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBOZ01vZHVsZSwgT3V0cHV0LCBQTEFURk9STV9JRCwgUXVlcnlMaXN0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24sIG51bWJlckF0dHJpYnV0ZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IE51bGxhYmxlLCBWb2lkTGlzdGVuZXIgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuaW1wb3J0IHsgU3BsaXR0ZXJSZXNpemVFbmRFdmVudCwgU3BsaXR0ZXJSZXNpemVTdGFydEV2ZW50IH0gZnJvbSAnLi9zcGxpdHRlci5pbnRlcmZhY2UnO1xuLyoqXG4gKiBTcGxpdHRlciBpcyB1dGlsaXplZCB0byBzZXBhcmF0ZSBhbmQgcmVzaXplIHBhbmVscy5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zcGxpdHRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2F0dHIuZGF0YS1wYy1uYW1lXT1cIidzcGxpdHRlcidcIiBbYXR0ci5kYXRhLXAtZ3V0dGVyLXJlc2l6aW5nXT1cImZhbHNlXCIgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidyb290J1wiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1wYW5lbCBbbmdGb3JPZl09XCJwYW5lbHNcIiBsZXQtaT1cImluZGV4XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJwYW5lbENvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwicGFuZWxTdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwicGFuZWxTdHlsZVwiIHRhYmluZGV4PVwiLTFcIiBbYXR0ci5kYXRhLXBjLW5hbWVdPVwiJ3NwbGl0dGVyJ1wiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncm9vdCdcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInBhbmVsXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAqbmdJZj1cImkgIT09IHBhbmVscy5sZW5ndGggLSAxXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNwbGl0dGVyLWd1dHRlclwiXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJzZXBhcmF0b3JcIlxuICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJvbkd1dHRlck1vdXNlRG93bigkZXZlbnQsIGkpXCJcbiAgICAgICAgICAgICAgICAgICAgKHRvdWNoc3RhcnQpPVwib25HdXR0ZXJUb3VjaFN0YXJ0KCRldmVudCwgaSlcIlxuICAgICAgICAgICAgICAgICAgICAodG91Y2htb3ZlKT1cIm9uR3V0dGVyVG91Y2hNb3ZlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAodG91Y2hlbmQpPVwib25HdXR0ZXJUb3VjaEVuZCgkZXZlbnQsIGkpXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wLWd1dHRlci1yZXNpemluZ109XCJmYWxzZVwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInZ3V0dGVyJ1wiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtc3BsaXR0ZXItZ3V0dGVyLWhhbmRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiZ3V0dGVyU3R5bGUoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLW9yaWVudGF0aW9uXT1cImxheW91dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInByZXZTaXplXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInZ3V0dGVyaGFuZGxlJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAoa2V5dXApPVwib25HdXR0ZXJLZXlVcCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uR3V0dGVyS2V5RG93bigkZXZlbnQsIGkpXCJcbiAgICAgICAgICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIHN0eWxlVXJsczogWycuL3NwbGl0dGVyLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnLFxuICAgICAgICAnW2NsYXNzLnAtc3BsaXR0ZXItcGFuZWwtbmVzdGVkXSc6ICduZXN0ZWQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBTcGxpdHRlciB7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3Mgb2YgdGhlIHBhbmVsLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHBhbmVsU3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgcGFuZWwuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgcGFuZWxTdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHdoZXJlIGEgc3RhdGVmdWwgc3BsaXR0ZXIga2VlcHMgaXRzIHN0YXRlLCB2YWxpZCB2YWx1ZXMgYXJlICdzZXNzaW9uJyBmb3Igc2Vzc2lvblN0b3JhZ2UgYW5kICdsb2NhbCcgZm9yIGxvY2FsU3RvcmFnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdGF0ZVN0b3JhZ2U6IHN0cmluZyB8IHVuZGVmaW5lZCA9ICdzZXNzaW9uJztcbiAgICAvKipcbiAgICAgKiBTdG9yYWdlIGlkZW50aWZpZXIgb2YgYSBzdGF0ZWZ1bCBTcGxpdHRlci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdGF0ZUtleTogc3RyaW5nIHwgdW5kZWZpbmVkIHwgbnVsbCA9IG51bGw7XG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHBhbmVscy4gVmFsaWQgdmFsdWVzIGFyZSAnaG9yaXpvbnRhbCcgYW5kICd2ZXJ0aWNhbCcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGF5b3V0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSAnaG9yaXpvbnRhbCc7XG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgZGl2aWRlciBpbiBwaXhlbHMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgZ3V0dGVyU2l6ZTogbnVtYmVyID0gNDtcbiAgICAvKipcbiAgICAgKiBTdGVwIGZhY3RvciB0byBpbmNyZW1lbnQvZGVjcmVtZW50IHRoZSBzaXplIG9mIHRoZSBwYW5lbHMgd2hpbGUgcHJlc3NpbmcgdGhlIGFycm93IGtleXMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgc3RlcDogbnVtYmVyID0gNTtcbiAgICAvKipcbiAgICAgKiBNaW5pbXVtIHNpemUgb2YgdGhlIGVsZW1lbnRzIHJlbGF0aXZlIHRvIDEwMCUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbWluU2l6ZXM6IG51bWJlcltdID0gW107XG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgZWxlbWVudHMgcmVsYXRpdmUgdG8gMTAwJS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgcGFuZWxTaXplcygpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYW5lbFNpemVzO1xuICAgIH1cbiAgICBzZXQgcGFuZWxTaXplcyh2YWw6IG51bWJlcltdKSB7XG4gICAgICAgIHRoaXMuX3BhbmVsU2l6ZXMgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMuZWwgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50ICYmIHRoaXMucGFuZWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IFsuLi50aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5dLmZpbHRlcigoY2hpbGQpID0+IERvbUhhbmRsZXIuaGFzQ2xhc3MoY2hpbGQsICdwLXNwbGl0dGVyLXBhbmVsJykpO1xuICAgICAgICAgICAgbGV0IF9wYW5lbFNpemVzID0gW107XG5cbiAgICAgICAgICAgIHRoaXMucGFuZWxzLm1hcCgocGFuZWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcGFuZWxJbml0aWFsU2l6ZSA9IHRoaXMucGFuZWxTaXplcy5sZW5ndGggLSAxID49IGkgPyB0aGlzLnBhbmVsU2l6ZXNbaV0gOiBudWxsO1xuICAgICAgICAgICAgICAgIGxldCBwYW5lbFNpemUgPSBwYW5lbEluaXRpYWxTaXplID8/IDEwMCAvIHRoaXMucGFuZWxzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBfcGFuZWxTaXplc1tpXSA9IHBhbmVsU2l6ZTtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpXS5zdHlsZS5mbGV4QmFzaXMgPSAnY2FsYygnICsgcGFuZWxTaXplICsgJyUgLSAnICsgKHRoaXMucGFuZWxzLmxlbmd0aCAtIDEpICogdGhpcy5ndXR0ZXJTaXplICsgJ3B4KSc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiByZXNpemUgZW5kcy5cbiAgICAgKiBAcGFyYW0ge1NwbGl0dGVyUmVzaXplRW5kRXZlbnR9IGV2ZW50IC0gQ3VzdG9tIHBhbmVsIHJlc2l6ZSBlbmQgZXZlbnRcbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25SZXNpemVFbmQ6IEV2ZW50RW1pdHRlcjxTcGxpdHRlclJlc2l6ZUVuZEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8U3BsaXR0ZXJSZXNpemVFbmRFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiByZXNpemUgc3RhcnRzLlxuICAgICAqIEBwYXJhbSB7U3BsaXR0ZXJSZXNpemVTdGFydEV2ZW50fSBldmVudCAtIEN1c3RvbSBwYW5lbCByZXNpemUgc3RhcnQgZXZlbnRcbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPFNwbGl0dGVyUmVzaXplU3RhcnRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFNwbGl0dGVyUmVzaXplU3RhcnRFdmVudD4oKTtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzITogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+O1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNvbnRhaW5lclZpZXdDaGlsZDogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBuZXN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHBhbmVsczogYW55W10gPSBbXTtcblxuICAgIGRyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBtb3VzZU1vdmVMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgbW91c2VVcExpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICB0b3VjaE1vdmVMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgdG91Y2hFbmRMaXN0ZW5lcjogVm9pZExpc3RlbmVyO1xuXG4gICAgc2l6ZTogTnVsbGFibGU8bnVtYmVyPjtcblxuICAgIGd1dHRlckVsZW1lbnQ6IE51bGxhYmxlPEVsZW1lbnRSZWYgfCBIVE1MRWxlbWVudD47XG5cbiAgICBzdGFydFBvczogTnVsbGFibGU8bnVtYmVyPjtcblxuICAgIHByZXZQYW5lbEVsZW1lbnQ6IE51bGxhYmxlPEVsZW1lbnRSZWYgfCBIVE1MRWxlbWVudD47XG5cbiAgICBuZXh0UGFuZWxFbGVtZW50OiBOdWxsYWJsZTxFbGVtZW50UmVmIHwgSFRNTEVsZW1lbnQ+O1xuXG4gICAgbmV4dFBhbmVsU2l6ZTogTnVsbGFibGU8bnVtYmVyPjtcblxuICAgIHByZXZQYW5lbFNpemU6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBfcGFuZWxTaXplczogbnVtYmVyW10gPSBbXTtcblxuICAgIHByZXZQYW5lbEluZGV4OiBOdWxsYWJsZTxudW1iZXI+O1xuXG4gICAgdGltZXI6IGFueTtcblxuICAgIHByZXZTaXplOiBhbnk7XG5cbiAgICBwcml2YXRlIHdpbmRvdzogV2luZG93O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmXG4gICAgKSB7XG4gICAgICAgIHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldyBhcyBXaW5kb3c7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMubmVzdGVkID0gdGhpcy5pc05lc3RlZCgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BhbmVsJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbHMucHVzaChpdGVtLnRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYW5lbHMucHVzaChpdGVtLnRlbXBsYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhbmVscyAmJiB0aGlzLnBhbmVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbGl6ZWQgPSB0aGlzLnJlc3RvcmVTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gWy4uLnRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlbl0uZmlsdGVyKChjaGlsZCkgPT4gRG9tSGFuZGxlci5oYXNDbGFzcyhjaGlsZCwgJ3Atc3BsaXR0ZXItcGFuZWwnKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBfcGFuZWxTaXplcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFuZWxzLm1hcCgocGFuZWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYW5lbEluaXRpYWxTaXplID0gdGhpcy5wYW5lbFNpemVzLmxlbmd0aCAtIDEgPj0gaSA/IHRoaXMucGFuZWxTaXplc1tpXSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFuZWxTaXplID0gcGFuZWxJbml0aWFsU2l6ZSB8fCAxMDAgLyB0aGlzLnBhbmVscy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcGFuZWxTaXplc1tpXSA9IHBhbmVsU2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmZsZXhCYXNpcyA9ICdjYWxjKCcgKyBwYW5lbFNpemUgKyAnJSAtICcgKyAodGhpcy5wYW5lbHMubGVuZ3RoIC0gMSkgKiAodGhpcy5ndXR0ZXJTaXplIGFzIG51bWJlcikgKyAncHgpJztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplcyA9IF9wYW5lbFNpemVzO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldlNpemUgPSBwYXJzZUZsb2F0KF9wYW5lbFNpemVzWzBdKS50b0ZpeGVkKDQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2l6ZVN0YXJ0KGV2ZW50OiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCwgaW5kZXg6IG51bWJlciwgaXNLZXlEb3duPzogYm9vbGVhbikge1xuICAgICAgICB0aGlzLmd1dHRlckVsZW1lbnQgPSAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudCkgfHwgKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5ob3Jpem9udGFsKCkgPyBEb21IYW5kbGVyLmdldFdpZHRoKCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCBhcyBFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50KSA6IERvbUhhbmRsZXIuZ2V0SGVpZ2h0KCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCBhcyBFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgICBpZiAoIWlzS2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UG9zID0gdGhpcy5ob3Jpem9udGFsKCkgPyAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ID8gZXZlbnQucGFnZVggOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWCkgOiBldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgPyBldmVudC5wYWdlWSA6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2UGFuZWxFbGVtZW50ID0gdGhpcy5ndXR0ZXJFbGVtZW50LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIHRoaXMubmV4dFBhbmVsRWxlbWVudCA9IHRoaXMuZ3V0dGVyRWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGlzS2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5wcmV2UGFuZWxTaXplID0gdGhpcy5ob3Jpem9udGFsKCkgPyBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5wcmV2UGFuZWxFbGVtZW50LCB0cnVlKSA6IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5wcmV2UGFuZWxFbGVtZW50LCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFBhbmVsU2l6ZSA9IHRoaXMuaG9yaXpvbnRhbCgpID8gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMubmV4dFBhbmVsRWxlbWVudCwgdHJ1ZSkgOiBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMubmV4dFBhbmVsRWxlbWVudCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByZXZQYW5lbFNpemUgPSAoMTAwICogKHRoaXMuaG9yaXpvbnRhbCgpID8gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMucHJldlBhbmVsRWxlbWVudCwgdHJ1ZSkgOiBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMucHJldlBhbmVsRWxlbWVudCwgdHJ1ZSkpKSAvIHRoaXMuc2l6ZTtcbiAgICAgICAgICAgIHRoaXMubmV4dFBhbmVsU2l6ZSA9ICgxMDAgKiAodGhpcy5ob3Jpem9udGFsKCkgPyBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5uZXh0UGFuZWxFbGVtZW50LCB0cnVlKSA6IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5uZXh0UGFuZWxFbGVtZW50LCB0cnVlKSkpIC8gdGhpcy5zaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcmV2UGFuZWxJbmRleCA9IGluZGV4O1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZ3V0dGVyRWxlbWVudCwgJ3Atc3BsaXR0ZXItZ3V0dGVyLXJlc2l6aW5nJyk7XG4gICAgICAgIHRoaXMuZ3V0dGVyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcC1ndXR0ZXItcmVzaXppbmcnLCAndHJ1ZScpO1xuICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCBhcyBFbGVtZW50UmVmKS5uYXRpdmVFbGVtZW50LCAncC1zcGxpdHRlci1yZXNpemluZycpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1wLXJlc2l6aW5nJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgc2l6ZXM6IHRoaXMuX3BhbmVsU2l6ZXMgYXMgbnVtYmVyW10gfSk7XG4gICAgfVxuXG4gICAgb25SZXNpemUoZXZlbnQ6IE1vdXNlRXZlbnQsIHN0ZXA/OiBudW1iZXIsIGlzS2V5RG93bj86IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IG5ld1BvcywgbmV3UHJldlBhbmVsU2l6ZSwgbmV3TmV4dFBhbmVsU2l6ZTtcblxuICAgICAgICBpZiAoaXNLZXlEb3duKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsKCkpIHtcbiAgICAgICAgICAgICAgICBuZXdQcmV2UGFuZWxTaXplID0gKDEwMCAqICh0aGlzLnByZXZQYW5lbFNpemUgKyBzdGVwKSkgLyB0aGlzLnNpemU7XG4gICAgICAgICAgICAgICAgbmV3TmV4dFBhbmVsU2l6ZSA9ICgxMDAgKiAodGhpcy5uZXh0UGFuZWxTaXplIC0gc3RlcCkpIC8gdGhpcy5zaXplO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdQcmV2UGFuZWxTaXplID0gKDEwMCAqICh0aGlzLnByZXZQYW5lbFNpemUgLSBzdGVwKSkgLyB0aGlzLnNpemU7XG4gICAgICAgICAgICAgICAgbmV3TmV4dFBhbmVsU2l6ZSA9ICgxMDAgKiAodGhpcy5uZXh0UGFuZWxTaXplICsgc3RlcCkpIC8gdGhpcy5zaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCgpKSBuZXdQb3MgPSAoZXZlbnQucGFnZVggKiAxMDApIC8gdGhpcy5zaXplIC0gKHRoaXMuc3RhcnRQb3MgKiAxMDApIC8gdGhpcy5zaXplO1xuICAgICAgICAgICAgZWxzZSBuZXdQb3MgPSAoZXZlbnQucGFnZVkgKiAxMDApIC8gdGhpcy5zaXplIC0gKHRoaXMuc3RhcnRQb3MgKiAxMDApIC8gdGhpcy5zaXplO1xuXG4gICAgICAgICAgICBuZXdQcmV2UGFuZWxTaXplID0gKHRoaXMucHJldlBhbmVsU2l6ZSBhcyBudW1iZXIpICsgbmV3UG9zO1xuICAgICAgICAgICAgbmV3TmV4dFBhbmVsU2l6ZSA9ICh0aGlzLm5leHRQYW5lbFNpemUgYXMgbnVtYmVyKSAtIG5ld1BvcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJldlNpemUgPSBwYXJzZUZsb2F0KG5ld1ByZXZQYW5lbFNpemUpLnRvRml4ZWQoNCk7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsaWRhdGVSZXNpemUobmV3UHJldlBhbmVsU2l6ZSwgbmV3TmV4dFBhbmVsU2l6ZSkpIHtcbiAgICAgICAgICAgICh0aGlzLnByZXZQYW5lbEVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmZsZXhCYXNpcyA9ICdjYWxjKCcgKyBuZXdQcmV2UGFuZWxTaXplICsgJyUgLSAnICsgKHRoaXMucGFuZWxzLmxlbmd0aCAtIDEpICogdGhpcy5ndXR0ZXJTaXplICsgJ3B4KSc7XG4gICAgICAgICAgICAodGhpcy5uZXh0UGFuZWxFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5zdHlsZS5mbGV4QmFzaXMgPSAnY2FsYygnICsgbmV3TmV4dFBhbmVsU2l6ZSArICclIC0gJyArICh0aGlzLnBhbmVscy5sZW5ndGggLSAxKSAqIHRoaXMuZ3V0dGVyU2l6ZSArICdweCknO1xuICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplc1t0aGlzLnByZXZQYW5lbEluZGV4IGFzIG51bWJlcl0gPSBuZXdQcmV2UGFuZWxTaXplO1xuICAgICAgICAgICAgdGhpcy5fcGFuZWxTaXplc1sodGhpcy5wcmV2UGFuZWxJbmRleCBhcyBudW1iZXIpICsgMV0gPSBuZXdOZXh0UGFuZWxTaXplO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzaXplRW5kKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0YXRlZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uUmVzaXplRW5kLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgc2l6ZXM6IHRoaXMuX3BhbmVsU2l6ZXMgfSk7XG4gICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5ndXR0ZXJFbGVtZW50LCAncC1zcGxpdHRlci1ndXR0ZXItcmVzaXppbmcnKTtcbiAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcygodGhpcy5jb250YWluZXJWaWV3Q2hpbGQgYXMgRWxlbWVudFJlZikubmF0aXZlRWxlbWVudCwgJ3Atc3BsaXR0ZXItcmVzaXppbmcnKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgIH1cblxuICAgIG9uR3V0dGVyTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucmVzaXplU3RhcnQoZXZlbnQsIGluZGV4KTtcbiAgICAgICAgdGhpcy5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBvbkd1dHRlclRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50LmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplU3RhcnQoZXZlbnQsIGluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuYmluZFRvdWNoTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkd1dHRlclRvdWNoTW92ZShldmVudCkge1xuICAgICAgICB0aGlzLm9uUmVzaXplKGV2ZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkd1dHRlclRvdWNoRW5kKGV2ZW50OiBUb3VjaEV2ZW50KSB7XG4gICAgICAgIHRoaXMucmVzaXplRW5kKGV2ZW50KTtcbiAgICAgICAgdGhpcy51bmJpbmRUb3VjaExpc3RlbmVycygpO1xuXG4gICAgICAgIGlmIChldmVudC5jYW5jZWxhYmxlKSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHJlcGVhdChldmVudCwgaW5kZXgsIHN0ZXApIHtcbiAgICAgICAgdGhpcy5yZXNpemVTdGFydChldmVudCwgaW5kZXgsIHRydWUpO1xuICAgICAgICB0aGlzLm9uUmVzaXplKGV2ZW50LCBzdGVwLCB0cnVlKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lcihldmVudCwgaW5kZXgsIHN0ZXApIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0KGV2ZW50LCBpbmRleCwgc3RlcCk7XG4gICAgICAgIH0sIDQwKTtcbiAgICB9XG5cbiAgICBjbGVhclRpbWVyKCkge1xuICAgICAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25HdXR0ZXJLZXlVcChldmVudCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICAgICAgdGhpcy5yZXNpemVFbmQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uR3V0dGVyS2V5RG93bihldmVudCwgaW5kZXgpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGF5b3V0ID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lcihldmVudCwgaW5kZXgsIHRoaXMuc3RlcCAqIC0xKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0Jzoge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxheW91dCA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VGltZXIoZXZlbnQsIGluZGV4LCB0aGlzLnN0ZXApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXlvdXQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUaW1lcihldmVudCwgaW5kZXgsIHRoaXMuc3RlcCAqIC0xKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlICdBcnJvd1VwJzoge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxheW91dCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFRpbWVyKGV2ZW50LCBpbmRleCwgdGhpcy5zdGVwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vbm8gb3BcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhbGlkYXRlUmVzaXplKG5ld1ByZXZQYW5lbFNpemU6IG51bWJlciwgbmV3TmV4dFBhbmVsU2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHByZXZQYW5lbEluZGV4ID0gdGhpcy5wcmV2UGFuZWxJbmRleDtcbiAgICAgICAgaWYgKHRoaXMubWluU2l6ZXMubGVuZ3RoID4gcHJldlBhbmVsSW5kZXggJiYgdGhpcy5taW5TaXplc1twcmV2UGFuZWxJbmRleF0gJiYgdGhpcy5taW5TaXplc1twcmV2UGFuZWxJbmRleF0gPiBuZXdQcmV2UGFuZWxTaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXh0UGFuZWxJbmRleCA9IHRoaXMucHJldlBhbmVsSW5kZXggKyAxO1xuICAgICAgICBpZiAodGhpcy5taW5TaXplcy5sZW5ndGggPiBuZXh0UGFuZWxJbmRleCAmJiB0aGlzLm1pblNpemVzW25leHRQYW5lbEluZGV4XSAmJiB0aGlzLm1pblNpemVzW25leHRQYW5lbEluZGV4XSA+IG5ld05leHRQYW5lbFNpemUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGJpbmRNb3VzZUxpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKCF0aGlzLm1vdXNlTW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlTW92ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5kb2N1bWVudCwgJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25SZXNpemUoZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubW91c2VVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlVXBMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVFbmQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kTW91c2VMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFRvdWNoTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMudG91Y2hNb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAndG91Y2htb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZShldmVudC5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50b3VjaEVuZExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnRvdWNoRW5kTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAndG91Y2hlbmQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUVuZChldmVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJpbmRUb3VjaExpc3RlbmVycygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRNb3VzZUxpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMubW91c2VNb3ZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMubW91c2VNb3ZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW91c2VVcExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlVXBMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZVVwTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kVG91Y2hMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnRvdWNoTW92ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLnRvdWNoTW92ZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLnRvdWNoTW92ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRvdWNoRW5kTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMudG91Y2hFbmRMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy50b3VjaEVuZExpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXZQYW5lbEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLm5leHRQYW5lbEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXZQYW5lbFNpemUgPSBudWxsO1xuICAgICAgICB0aGlzLm5leHRQYW5lbFNpemUgPSBudWxsO1xuICAgICAgICB0aGlzLmd1dHRlckVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXZQYW5lbEluZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICBpc05lc3RlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgd2hpbGUgKHBhcmVudCAmJiAhRG9tSGFuZGxlci5oYXNDbGFzcyhwYXJlbnQsICdwLXNwbGl0dGVyJykpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudCAhPT0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzU3RhdGVmdWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlS2V5ICE9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0U3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZVN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdsb2NhbCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndpbmRvdy5sb2NhbFN0b3JhZ2U7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdzZXNzaW9uJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2luZG93LnNlc3Npb25TdG9yYWdlO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMuc3RhdGVTdG9yYWdlICsgJyBpcyBub3QgYSB2YWxpZCB2YWx1ZSBmb3IgdGhlIHN0YXRlIHN0b3JhZ2UsIHN1cHBvcnRlZCB2YWx1ZXMgYXJlIFwibG9jYWxcIiBhbmQgXCJzZXNzaW9uXCIuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JhZ2UgaXMgbm90IGEgYXZhaWxhYmxlIGJ5IGRlZmF1bHQgb24gdGhlIHNlcnZlci4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNhdmVTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nZXRTdG9yYWdlKCkuc2V0SXRlbSh0aGlzLnN0YXRlS2V5IGFzIHN0cmluZywgSlNPTi5zdHJpbmdpZnkodGhpcy5fcGFuZWxTaXplcykpO1xuICAgIH1cblxuICAgIHJlc3RvcmVTdGF0ZSgpIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMuZ2V0U3RvcmFnZSgpO1xuICAgICAgICBjb25zdCBzdGF0ZVN0cmluZyA9IHN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0YXRlS2V5IGFzIHN0cmluZyk7XG5cbiAgICAgICAgaWYgKHN0YXRlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9wYW5lbFNpemVzID0gSlNPTi5wYXJzZShzdGF0ZVN0cmluZyk7XG4gICAgICAgICAgICBsZXQgY2hpbGRyZW4gPSBbLi4uKHRoaXMuY29udGFpbmVyVmlld0NoaWxkIGFzIEVsZW1lbnRSZWYpLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5dLmZpbHRlcigoY2hpbGQpID0+IERvbUhhbmRsZXIuaGFzQ2xhc3MoY2hpbGQsICdwLXNwbGl0dGVyLXBhbmVsJykpO1xuICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZC5zdHlsZS5mbGV4QmFzaXMgPSAnY2FsYygnICsgdGhpcy5fcGFuZWxTaXplc1tpXSArICclIC0gJyArICh0aGlzLnBhbmVscy5sZW5ndGggLSAxKSAqIHRoaXMuZ3V0dGVyU2l6ZSArICdweCknO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3Atc3BsaXR0ZXIgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3Atc3BsaXR0ZXItaG9yaXpvbnRhbCc6IHRoaXMubGF5b3V0ID09PSAnaG9yaXpvbnRhbCcsXG4gICAgICAgICAgICAncC1zcGxpdHRlci12ZXJ0aWNhbCc6IHRoaXMubGF5b3V0ID09PSAndmVydGljYWwnXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcGFuZWxDb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLXNwbGl0dGVyLXBhbmVsJzogdHJ1ZSxcbiAgICAgICAgICAgICdwLXNwbGl0dGVyLXBhbmVsLW5lc3RlZCc6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBndXR0ZXJTdHlsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCgpKSByZXR1cm4geyB3aWR0aDogdGhpcy5ndXR0ZXJTaXplICsgJ3B4JyB9O1xuICAgICAgICBlbHNlIHJldHVybiB7IGhlaWdodDogdGhpcy5ndXR0ZXJTaXplICsgJ3B4JyB9O1xuICAgIH1cblxuICAgIGhvcml6b250YWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxheW91dCA9PT0gJ2hvcml6b250YWwnO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU3BsaXR0ZXIsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbU3BsaXR0ZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNwbGl0dGVyTW9kdWxlIHt9XG4iXX0=