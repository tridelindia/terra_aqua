import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export const OVERLAY_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Overlay),
    multi: true
};
const showOverlayContentAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{showTransitionParams}}')]);
const hideOverlayContentAnimation = animation([animate('{{hideTransitionParams}}', style({ transform: '{{transform}}', opacity: 0 }))]);
/**
 * This API allows overlay components to be controlled from the PrimeNGConfig. In this way, all overlay components in the application can have the same behavior.
 * @group Components
 */
export class Overlay {
    document;
    platformId;
    el;
    renderer;
    config;
    overlayService;
    cd;
    zone;
    /**
     * The visible property is an input that determines the visibility of the component.
     * @defaultValue false
     * @group Props
     */
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.modalVisible) {
            this.modalVisible = true;
        }
    }
    /**
     * The mode property is an input that determines the overlay mode type or string.
     * @defaultValue null
     * @group Props
     */
    get mode() {
        return this._mode || this.overlayOptions?.mode;
    }
    set mode(value) {
        this._mode = value;
    }
    /**
     * The style property is an input that determines the style object for the component.
     * @defaultValue null
     * @group Props
     */
    get style() {
        return ObjectUtils.merge(this._style, this.modal ? this.overlayResponsiveOptions?.style : this.overlayOptions?.style);
    }
    set style(value) {
        this._style = value;
    }
    /**
     * The styleClass property is an input that determines the CSS class(es) for the component.
     * @defaultValue null
     * @group Props
     */
    get styleClass() {
        return ObjectUtils.merge(this._styleClass, this.modal ? this.overlayResponsiveOptions?.styleClass : this.overlayOptions?.styleClass);
    }
    set styleClass(value) {
        this._styleClass = value;
    }
    /**
     * The contentStyle property is an input that determines the style object for the content of the component.
     * @defaultValue null
     * @group Props
     */
    get contentStyle() {
        return ObjectUtils.merge(this._contentStyle, this.modal ? this.overlayResponsiveOptions?.contentStyle : this.overlayOptions?.contentStyle);
    }
    set contentStyle(value) {
        this._contentStyle = value;
    }
    /**
     * The contentStyleClass property is an input that determines the CSS class(es) for the content of the component.
     * @defaultValue null
     * @group Props
     */
    get contentStyleClass() {
        return ObjectUtils.merge(this._contentStyleClass, this.modal ? this.overlayResponsiveOptions?.contentStyleClass : this.overlayOptions?.contentStyleClass);
    }
    set contentStyleClass(value) {
        this._contentStyleClass = value;
    }
    /**
     * The target property is an input that specifies the target element or selector for the component.
     * @defaultValue null
     * @group Props
     */
    get target() {
        const value = this._target || this.overlayOptions?.target;
        return value === undefined ? '@prev' : value;
    }
    set target(value) {
        this._target = value;
    }
    /**
     * Overlay can be mounted into its location, body or DOM element instance using this option.
     * @defaultValue null
     * @group Props
     */
    get appendTo() {
        return this._appendTo || this.overlayOptions?.appendTo;
    }
    set appendTo(value) {
        this._appendTo = value;
    }
    /**
     * The autoZIndex determines whether to automatically manage layering. Its default value is 'false'.
     * @defaultValue false
     * @group Props
     */
    get autoZIndex() {
        const value = this._autoZIndex || this.overlayOptions?.autoZIndex;
        return value === undefined ? true : value;
    }
    set autoZIndex(value) {
        this._autoZIndex = value;
    }
    /**
     * The baseZIndex is base zIndex value to use in layering.
     * @defaultValue null
     * @group Props
     */
    get baseZIndex() {
        const value = this._baseZIndex || this.overlayOptions?.baseZIndex;
        return value === undefined ? 0 : value;
    }
    set baseZIndex(value) {
        this._baseZIndex = value;
    }
    /**
     * Transition options of the show or hide animation.
     * @defaultValue .12s cubic-bezier(0, 0, 0.2, 1)
     * @group Props
     */
    get showTransitionOptions() {
        const value = this._showTransitionOptions || this.overlayOptions?.showTransitionOptions;
        return value === undefined ? '.12s cubic-bezier(0, 0, 0.2, 1)' : value;
    }
    set showTransitionOptions(value) {
        this._showTransitionOptions = value;
    }
    /**
     * The hideTransitionOptions property is an input that determines the CSS transition options for hiding the component.
     * @defaultValue .1s linear
     * @group Props
     */
    get hideTransitionOptions() {
        const value = this._hideTransitionOptions || this.overlayOptions?.hideTransitionOptions;
        return value === undefined ? '.1s linear' : value;
    }
    set hideTransitionOptions(value) {
        this._hideTransitionOptions = value;
    }
    /**
     * The listener property is an input that specifies the listener object for the component.
     * @defaultValue null
     * @group Props
     */
    get listener() {
        return this._listener || this.overlayOptions?.listener;
    }
    set listener(value) {
        this._listener = value;
    }
    /**
     * It is the option used to determine in which mode it should appear according to the given media or breakpoint.
     * @defaultValue null
     * @group Props
     */
    get responsive() {
        return this._responsive || this.overlayOptions?.responsive;
    }
    set responsive(val) {
        this._responsive = val;
    }
    /**
     * The options property is an input that specifies the overlay options for the component.
     * @defaultValue null
     * @group Props
     */
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
    }
    /**
     * This EventEmitter is used to notify changes in the visibility state of a component.
     * @param {Boolean} boolean - Value of visibility as boolean.
     * @group Emits
     */
    visibleChange = new EventEmitter();
    /**
     * Callback to invoke before the overlay is shown.
     * @param {OverlayOnBeforeShowEvent} event - Custom overlay before show event.
     * @group Emits
     */
    onBeforeShow = new EventEmitter();
    /**
     * Callback to invoke when the overlay is shown.
     * @param {OverlayOnShowEvent} event - Custom overlay show event.
     * @group Emits
     */
    onShow = new EventEmitter();
    /**
     * Callback to invoke before the overlay is hidden.
     * @param {OverlayOnBeforeHideEvent} event - Custom overlay before hide event.
     * @group Emits
     */
    onBeforeHide = new EventEmitter();
    /**
     * Callback to invoke when the overlay is hidden
     * @param {OverlayOnHideEvent} event - Custom hide event.
     * @group Emits
     */
    onHide = new EventEmitter();
    /**
     * Callback to invoke when the animation is started.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onAnimationStart = new EventEmitter();
    /**
     * Callback to invoke when the animation is done.
     * @param {AnimationEvent} event - Animation event.
     * @group Emits
     */
    onAnimationDone = new EventEmitter();
    templates;
    overlayViewChild;
    contentViewChild;
    contentTemplate;
    _visible = false;
    _mode;
    _style;
    _styleClass;
    _contentStyle;
    _contentStyleClass;
    _target;
    _appendTo;
    _autoZIndex;
    _baseZIndex;
    _showTransitionOptions;
    _hideTransitionOptions;
    _listener;
    _responsive;
    _options;
    modalVisible = false;
    isOverlayClicked = false;
    isOverlayContentClicked = false;
    scrollHandler;
    documentClickListener;
    documentResizeListener;
    documentKeyboardListener;
    window;
    transformOptions = {
        default: 'scaleY(0.8)',
        center: 'scale(0.7)',
        top: 'translate3d(0px, -100%, 0px)',
        'top-start': 'translate3d(0px, -100%, 0px)',
        'top-end': 'translate3d(0px, -100%, 0px)',
        bottom: 'translate3d(0px, 100%, 0px)',
        'bottom-start': 'translate3d(0px, 100%, 0px)',
        'bottom-end': 'translate3d(0px, 100%, 0px)',
        left: 'translate3d(-100%, 0px, 0px)',
        'left-start': 'translate3d(-100%, 0px, 0px)',
        'left-end': 'translate3d(-100%, 0px, 0px)',
        right: 'translate3d(100%, 0px, 0px)',
        'right-start': 'translate3d(100%, 0px, 0px)',
        'right-end': 'translate3d(100%, 0px, 0px)'
    };
    get modal() {
        if (isPlatformBrowser(this.platformId)) {
            return this.mode === 'modal' || (this.overlayResponsiveOptions && this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace('@media', '') || `(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches);
        }
    }
    get overlayMode() {
        return this.mode || (this.modal ? 'modal' : 'overlay');
    }
    get overlayOptions() {
        return { ...this.config?.overlayOptions, ...this.options }; // TODO: Improve performance
    }
    get overlayResponsiveOptions() {
        return { ...this.overlayOptions?.responsive, ...this.responsive }; // TODO: Improve performance
    }
    get overlayResponsiveDirection() {
        return this.overlayResponsiveOptions?.direction || 'center';
    }
    get overlayEl() {
        return this.overlayViewChild?.nativeElement;
    }
    get contentEl() {
        return this.contentViewChild?.nativeElement;
    }
    get targetEl() {
        return DomHandler.getTargetElement(this.target, this.el?.nativeElement);
    }
    constructor(document, platformId, el, renderer, config, overlayService, cd, zone) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.config = config;
        this.overlayService = overlayService;
        this.cd = cd;
        this.zone = zone;
        this.window = this.document.defaultView;
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                // TODO: new template types may be added.
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    show(overlay, isFocus = false) {
        this.onVisibleChange(true);
        this.handleEvents('onShow', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        isFocus && DomHandler.focus(this.targetEl);
        this.modal && DomHandler.addClass(this.document?.body, 'p-overflow-hidden');
    }
    hide(overlay, isFocus = false) {
        if (!this.visible) {
            return;
        }
        else {
            this.onVisibleChange(false);
            this.handleEvents('onHide', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
            isFocus && DomHandler.focus(this.targetEl);
            this.modal && DomHandler.removeClass(this.document?.body, 'p-overflow-hidden');
        }
    }
    alignOverlay() {
        !this.modal && DomHandler.alignOverlay(this.overlayEl, this.targetEl, this.appendTo);
    }
    onVisibleChange(visible) {
        this._visible = visible;
        this.visibleChange.emit(visible);
    }
    onOverlayClick() {
        this.isOverlayClicked = true;
    }
    onOverlayContentClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.targetEl
        });
        this.isOverlayContentClicked = true;
    }
    onOverlayContentAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.handleEvents('onBeforeShow', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                if (this.autoZIndex) {
                    ZIndexUtils.set(this.overlayMode, this.overlayEl, this.baseZIndex + this.config?.zIndex[this.overlayMode]);
                }
                DomHandler.appendOverlay(this.overlayEl, this.appendTo === 'body' ? this.document.body : this.appendTo, this.appendTo);
                this.alignOverlay();
                break;
            case 'void':
                this.handleEvents('onBeforeHide', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                this.modal && DomHandler.addClass(this.overlayEl, 'p-component-overlay-leave');
                break;
        }
        this.handleEvents('onAnimationStart', event);
    }
    onOverlayContentAnimationDone(event) {
        const container = this.overlayEl || event.element.parentElement;
        switch (event.toState) {
            case 'visible':
                if (this.visible) {
                    this.show(container, true);
                }
                this.bindListeners();
                break;
            case 'void':
                if (!this.visible) {
                    this.hide(container, true);
                    this.modalVisible = false;
                    this.unbindListeners();
                    DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
                    ZIndexUtils.clear(container);
                    this.cd.markForCheck();
                    break;
                }
        }
        this.handleEvents('onAnimationDone', event);
    }
    handleEvents(name, params) {
        this[name].emit(params);
        this.options && this.options[name] && this.options[name](params);
        this.config?.overlayOptions && (this.config?.overlayOptions)[name] && (this.config?.overlayOptions)[name](params);
    }
    bindListeners() {
        this.unbindListeners();
        this.bindScrollListener();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindDocumentKeyboardListener();
    }
    unbindListeners() {
        this.unbindScrollListener();
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindDocumentKeyboardListener();
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.targetEl, (event) => {
                const valid = this.listener ? this.listener(event, { type: 'scroll', mode: this.overlayMode, valid: true }) : true;
                valid && this.hide(event, true);
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                const isTargetClicked = this.targetEl && (this.targetEl.isSameNode(event.target) || (!this.isOverlayClicked && this.targetEl.contains(event.target)));
                const isOutsideClicked = !isTargetClicked && !this.isOverlayContentClicked;
                const valid = this.listener ? this.listener(event, { type: 'outside', mode: this.overlayMode, valid: event.which !== 3 && isOutsideClicked }) : isOutsideClicked;
                valid && this.hide(event);
                this.isOverlayClicked = this.isOverlayContentClicked = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                const valid = this.listener ? this.listener(event, { type: 'resize', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                valid && this.hide(event, true);
            });
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    bindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            this.documentKeyboardListener = this.renderer.listen(this.window, 'keydown', (event) => {
                if (this.overlayOptions.hideOnEscape === false || event.code !== 'Escape') {
                    return;
                }
                const valid = this.listener ? this.listener(event, { type: 'keydown', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                if (valid) {
                    this.zone.run(() => {
                        this.hide(event, true);
                    });
                }
            });
        });
    }
    unbindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            this.documentKeyboardListener();
            this.documentKeyboardListener = null;
        }
    }
    ngOnDestroy() {
        this.hide(this.overlayEl, true);
        if (this.overlayEl) {
            DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
            ZIndexUtils.clear(this.overlayEl);
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.unbindListeners();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Overlay, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: Overlay, selector: "p-overlay", inputs: { visible: "visible", mode: "mode", style: "style", styleClass: "styleClass", contentStyle: "contentStyle", contentStyleClass: "contentStyleClass", target: "target", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", listener: "listener", responsive: "responsive", options: "options" }, outputs: { visibleChange: "visibleChange", onBeforeShow: "onBeforeShow", onShow: "onShow", onBeforeHide: "onBeforeHide", onHide: "onHide", onAnimationStart: "onAnimationStart", onAnimationDone: "onAnimationDone" }, host: { classAttribute: "p-element" }, providers: [OVERLAY_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick()"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Overlay, decorators: [{
            type: Component,
            args: [{ selector: 'p-overlay', template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick()"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [OVERLAY_VALUE_ACCESSOR], host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { visible: [{
                type: Input
            }], mode: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], contentStyle: [{
                type: Input
            }], contentStyleClass: [{
                type: Input
            }], target: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], listener: [{
                type: Input
            }], responsive: [{
                type: Input
            }], options: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onBeforeShow: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onBeforeHide: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onAnimationStart: [{
                type: Output
            }], onAnimationDone: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }] } });
export class OverlayModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OverlayModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: OverlayModule, declarations: [Overlay], imports: [CommonModule, SharedModule], exports: [Overlay, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OverlayModule, imports: [CommonModule, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OverlayModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Overlay, SharedModule],
                    declarations: [Overlay]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9vdmVybGF5L292ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQWtCLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDNUUsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBR1IsTUFBTSxFQUNOLFdBQVcsRUFJWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ3BCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBOEosYUFBYSxFQUE0QixZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDaFAsT0FBTyxFQUFFLDZCQUE2QixFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4RSxPQUFPLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUd6RCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBUTtJQUN2QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ3RDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQUcsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENB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LFlBSlosWUFBWSxFQUFFLFlBQVksRUFDakIsWUFBWTs7MkZBR3RCLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztvQkFDaEMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIGFuaW1hdGlvbiwgQW5pbWF0aW9uRXZlbnQsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyLCB1c2VBbmltYXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIGZvcndhcmRSZWYsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3V0cHV0LFxuICAgIFBMQVRGT1JNX0lELFxuICAgIFF1ZXJ5TGlzdCxcbiAgICBSZW5kZXJlcjIsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBPdmVybGF5TW9kZVR5cGUsIE92ZXJsYXlPbkJlZm9yZUhpZGVFdmVudCwgT3ZlcmxheU9uQmVmb3JlU2hvd0V2ZW50LCBPdmVybGF5T25IaWRlRXZlbnQsIE92ZXJsYXlPblNob3dFdmVudCwgT3ZlcmxheU9wdGlvbnMsIE92ZXJsYXlTZXJ2aWNlLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBWb2lkTGlzdGVuZXIgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuXG5leHBvcnQgY29uc3QgT1ZFUkxBWV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE92ZXJsYXkpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG5jb25zdCBzaG93T3ZlcmxheUNvbnRlbnRBbmltYXRpb24gPSBhbmltYXRpb24oW3N0eWxlKHsgdHJhbnNmb3JtOiAne3t0cmFuc2Zvcm19fScsIG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoJ3t7c2hvd1RyYW5zaXRpb25QYXJhbXN9fScpXSk7XG5cbmNvbnN0IGhpZGVPdmVybGF5Q29udGVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbihbYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319Jywgc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3RyYW5zZm9ybX19Jywgb3BhY2l0eTogMCB9KSldKTtcbi8qKlxuICogVGhpcyBBUEkgYWxsb3dzIG92ZXJsYXkgY29tcG9uZW50cyB0byBiZSBjb250cm9sbGVkIGZyb20gdGhlIFByaW1lTkdDb25maWcuIEluIHRoaXMgd2F5LCBhbGwgb3ZlcmxheSBjb21wb25lbnRzIGluIHRoZSBhcHBsaWNhdGlvbiBjYW4gaGF2ZSB0aGUgc2FtZSBiZWhhdmlvci5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1vdmVybGF5JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICAqbmdJZj1cIm1vZGFsVmlzaWJsZVwiXG4gICAgICAgICAgICAjb3ZlcmxheVxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdwLW92ZXJsYXkgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbW9kYWwgcC1jb21wb25lbnQtb3ZlcmxheSBwLWNvbXBvbmVudC1vdmVybGF5LWVudGVyJzogbW9kYWwsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1jZW50ZXInOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3AnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3RvcCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3Atc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3RvcC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS10b3AtZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3AtZW5kJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbSc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbS1zdGFydCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnYm90dG9tLXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWJvdHRvbS1lbmQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbS1lbmQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbGVmdCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1sZWZ0LXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdsZWZ0LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWxlZnQtZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdsZWZ0LWVuZCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1yaWdodCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAncmlnaHQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktcmlnaHQtc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0LXN0YXJ0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LXJpZ2h0LWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAncmlnaHQtZW5kJ1xuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25PdmVybGF5Q2xpY2soKVwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAqbmdJZj1cInZpc2libGVcIlxuICAgICAgICAgICAgICAgICNjb250ZW50XG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiY29udGVudFN0eWxlXCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwiY29udGVudFN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwLW92ZXJsYXktY29udGVudCdcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbk92ZXJsYXlDb250ZW50Q2xpY2soJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW0BvdmVybGF5Q29udGVudEFuaW1hdGlvbl09XCJ7IHZhbHVlOiAndmlzaWJsZScsIHBhcmFtczogeyBzaG93VHJhbnNpdGlvblBhcmFtczogc2hvd1RyYW5zaXRpb25PcHRpb25zLCBoaWRlVHJhbnNpdGlvblBhcmFtczogaGlkZVRyYW5zaXRpb25PcHRpb25zLCB0cmFuc2Zvcm06IHRyYW5zZm9ybU9wdGlvbnNbbW9kYWwgPyBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA6ICdkZWZhdWx0J10gfSB9XCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlDb250ZW50QW5pbWF0aW9uLnN0YXJ0KT1cIm9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoQG92ZXJsYXlDb250ZW50QW5pbWF0aW9uLmRvbmUpPVwib25PdmVybGF5Q29udGVudEFuaW1hdGlvbkRvbmUoJGV2ZW50KVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB7IG1vZGU6IG92ZXJsYXlNb2RlIH0gfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW3RyaWdnZXIoJ292ZXJsYXlDb250ZW50QW5pbWF0aW9uJywgW3RyYW5zaXRpb24oJzplbnRlcicsIFt1c2VBbmltYXRpb24oc2hvd092ZXJsYXlDb250ZW50QW5pbWF0aW9uKV0pLCB0cmFuc2l0aW9uKCc6bGVhdmUnLCBbdXNlQW5pbWF0aW9uKGhpZGVPdmVybGF5Q29udGVudEFuaW1hdGlvbildKV0pXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHByb3ZpZGVyczogW09WRVJMQVlfVkFMVUVfQUNDRVNTT1JdLFxuICAgIHN0eWxlVXJsczogWycuL292ZXJsYXkuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE92ZXJsYXkgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIFRoZSB2aXNpYmxlIHByb3BlcnR5IGlzIGFuIGlucHV0IHRoYXQgZGV0ZXJtaW5lcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBkZWZhdWx0VmFsdWUgZmFsc2VcbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gICAgfVxuICAgIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSAmJiAhdGhpcy5tb2RhbFZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgbW9kZSBwcm9wZXJ0eSBpcyBhbiBpbnB1dCB0aGF0IGRldGVybWluZXMgdGhlIG92ZXJsYXkgbW9kZSB0eXBlIG9yIHN0cmluZy5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIG51bGxcbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgbW9kZSgpOiBPdmVybGF5TW9kZVR5cGUgfCBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZSB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5tb2RlO1xuICAgIH1cbiAgICBzZXQgbW9kZSh2YWx1ZTogT3ZlcmxheU1vZGVUeXBlIHwgc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX21vZGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHN0eWxlIHByb3BlcnR5IGlzIGFuIGlucHV0IHRoYXQgZGV0ZXJtaW5lcyB0aGUgc3R5bGUgb2JqZWN0IGZvciB0aGUgY29tcG9uZW50LlxuICAgICAqIEBkZWZhdWx0VmFsdWUgbnVsbFxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBzdHlsZSgpOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX3N0eWxlLCB0aGlzLm1vZGFsID8gdGhpcy5vdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnM/LnN0eWxlIDogdGhpcy5vdmVybGF5T3B0aW9ucz8uc3R5bGUpO1xuICAgIH1cbiAgICBzZXQgc3R5bGUodmFsdWU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIHN0eWxlQ2xhc3MgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBkZXRlcm1pbmVzIHRoZSBDU1MgY2xhc3MoZXMpIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAqIEBkZWZhdWx0VmFsdWUgbnVsbFxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBzdHlsZUNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5tZXJnZSh0aGlzLl9zdHlsZUNsYXNzLCB0aGlzLm1vZGFsID8gdGhpcy5vdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnM/LnN0eWxlQ2xhc3MgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5zdHlsZUNsYXNzKTtcbiAgICB9XG4gICAgc2V0IHN0eWxlQ2xhc3ModmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9zdHlsZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjb250ZW50U3R5bGUgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBkZXRlcm1pbmVzIHRoZSBzdHlsZSBvYmplY3QgZm9yIHRoZSBjb250ZW50IG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQGRlZmF1bHRWYWx1ZSBudWxsXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IGNvbnRlbnRTdHlsZSgpOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX2NvbnRlbnRTdHlsZSwgdGhpcy5tb2RhbCA/IHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zPy5jb250ZW50U3R5bGUgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5jb250ZW50U3R5bGUpO1xuICAgIH1cbiAgICBzZXQgY29udGVudFN0eWxlKHZhbHVlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZSA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGVudFN0eWxlQ2xhc3MgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBkZXRlcm1pbmVzIHRoZSBDU1MgY2xhc3MoZXMpIGZvciB0aGUgY29udGVudCBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBkZWZhdWx0VmFsdWUgbnVsbFxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBjb250ZW50U3R5bGVDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fY29udGVudFN0eWxlQ2xhc3MsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uY29udGVudFN0eWxlQ2xhc3MgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5jb250ZW50U3R5bGVDbGFzcyk7XG4gICAgfVxuICAgIHNldCBjb250ZW50U3R5bGVDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSB0YXJnZXQgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBzcGVjaWZpZXMgdGhlIHRhcmdldCBlbGVtZW50IG9yIHNlbGVjdG9yIGZvciB0aGUgY29tcG9uZW50LlxuICAgICAqIEBkZWZhdWx0VmFsdWUgbnVsbFxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCB0YXJnZXQoKTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdGFyZ2V0IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LnRhcmdldDtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnQHByZXYnIDogdmFsdWU7XG4gICAgfVxuICAgIHNldCB0YXJnZXQodmFsdWU6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE92ZXJsYXkgY2FuIGJlIG1vdW50ZWQgaW50byBpdHMgbG9jYXRpb24sIGJvZHkgb3IgRE9NIGVsZW1lbnQgaW5zdGFuY2UgdXNpbmcgdGhpcyBvcHRpb24uXG4gICAgICogQGRlZmF1bHRWYWx1ZSBudWxsXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IGFwcGVuZFRvKCk6ICdib2R5JyB8IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGVuZFRvIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmFwcGVuZFRvO1xuICAgIH1cbiAgICBzZXQgYXBwZW5kVG8odmFsdWU6ICdib2R5JyB8IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2FwcGVuZFRvID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBhdXRvWkluZGV4IGRldGVybWluZXMgd2hldGhlciB0byBhdXRvbWF0aWNhbGx5IG1hbmFnZSBsYXllcmluZy4gSXRzIGRlZmF1bHQgdmFsdWUgaXMgJ2ZhbHNlJy5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIGZhbHNlXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IGF1dG9aSW5kZXgoKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fYXV0b1pJbmRleCB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5hdXRvWkluZGV4O1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiB2YWx1ZTtcbiAgICB9XG4gICAgc2V0IGF1dG9aSW5kZXgodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYXV0b1pJbmRleCA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZVpJbmRleCBpcyBiYXNlIHpJbmRleCB2YWx1ZSB0byB1c2UgaW4gbGF5ZXJpbmcuXG4gICAgICogQGRlZmF1bHRWYWx1ZSBudWxsXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IGJhc2VaSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9iYXNlWkluZGV4IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmJhc2VaSW5kZXg7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgYmFzZVpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2Jhc2VaSW5kZXggPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbiBvcHRpb25zIG9mIHRoZSBzaG93IG9yIGhpZGUgYW5pbWF0aW9uLlxuICAgICAqIEBkZWZhdWx0VmFsdWUgLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKVxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBzaG93VHJhbnNpdGlvbk9wdGlvbnMoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9zaG93VHJhbnNpdGlvbk9wdGlvbnMgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uc2hvd1RyYW5zaXRpb25PcHRpb25zO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcuMTJzIGN1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgc2hvd1RyYW5zaXRpb25PcHRpb25zKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fc2hvd1RyYW5zaXRpb25PcHRpb25zID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBoaWRlVHJhbnNpdGlvbk9wdGlvbnMgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBkZXRlcm1pbmVzIHRoZSBDU1MgdHJhbnNpdGlvbiBvcHRpb25zIGZvciBoaWRpbmcgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIC4xcyBsaW5lYXJcbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgaGlkZVRyYW5zaXRpb25PcHRpb25zKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5faGlkZVRyYW5zaXRpb25PcHRpb25zIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmhpZGVUcmFuc2l0aW9uT3B0aW9ucztcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnLjFzIGxpbmVhcicgOiB2YWx1ZTtcbiAgICB9XG4gICAgc2V0IGhpZGVUcmFuc2l0aW9uT3B0aW9ucyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2hpZGVUcmFuc2l0aW9uT3B0aW9ucyA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgbGlzdGVuZXIgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBzcGVjaWZpZXMgdGhlIGxpc3RlbmVyIG9iamVjdCBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIG51bGxcbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgbGlzdGVuZXIoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/Lmxpc3RlbmVyO1xuICAgIH1cbiAgICBzZXQgbGlzdGVuZXIodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJdCBpcyB0aGUgb3B0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGluIHdoaWNoIG1vZGUgaXQgc2hvdWxkIGFwcGVhciBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIG1lZGlhIG9yIGJyZWFrcG9pbnQuXG4gICAgICogQGRlZmF1bHRWYWx1ZSBudWxsXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IHJlc3BvbnNpdmUoKTogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNpdmUgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8ucmVzcG9uc2l2ZTtcbiAgICB9XG4gICAgc2V0IHJlc3BvbnNpdmUodmFsOiBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fcmVzcG9uc2l2ZSA9IHZhbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgcHJvcGVydHkgaXMgYW4gaW5wdXQgdGhhdCBzcGVjaWZpZXMgdGhlIG92ZXJsYXkgb3B0aW9ucyBmb3IgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZGVmYXVsdFZhbHVlIG51bGxcbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgb3B0aW9ucygpOiBPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xuICAgIH1cbiAgICBzZXQgb3B0aW9ucyh2YWw6IE92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB2YWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgRXZlbnRFbWl0dGVyIGlzIHVzZWQgdG8gbm90aWZ5IGNoYW5nZXMgaW4gdGhlIHZpc2liaWxpdHkgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBib29sZWFuIC0gVmFsdWUgb2YgdmlzaWJpbGl0eSBhcyBib29sZWFuLlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSB2aXNpYmxlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIGJlZm9yZSB0aGUgb3ZlcmxheSBpcyBzaG93bi5cbiAgICAgKiBAcGFyYW0ge092ZXJsYXlPbkJlZm9yZVNob3dFdmVudH0gZXZlbnQgLSBDdXN0b20gb3ZlcmxheSBiZWZvcmUgc2hvdyBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8T3ZlcmxheU9uQmVmb3JlU2hvd0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheU9uQmVmb3JlU2hvd0V2ZW50PigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHRoZSBvdmVybGF5IGlzIHNob3duLlxuICAgICAqIEBwYXJhbSB7T3ZlcmxheU9uU2hvd0V2ZW50fSBldmVudCAtIEN1c3RvbSBvdmVybGF5IHNob3cgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPE92ZXJsYXlPblNob3dFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE92ZXJsYXlPblNob3dFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2UgYmVmb3JlIHRoZSBvdmVybGF5IGlzIGhpZGRlbi5cbiAgICAgKiBAcGFyYW0ge092ZXJsYXlPbkJlZm9yZUhpZGVFdmVudH0gZXZlbnQgLSBDdXN0b20gb3ZlcmxheSBiZWZvcmUgaGlkZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVIaWRlOiBFdmVudEVtaXR0ZXI8T3ZlcmxheU9uQmVmb3JlSGlkZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8T3ZlcmxheU9uQmVmb3JlSGlkZUV2ZW50PigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHRoZSBvdmVybGF5IGlzIGhpZGRlblxuICAgICAqIEBwYXJhbSB7T3ZlcmxheU9uSGlkZUV2ZW50fSBldmVudCAtIEN1c3RvbSBoaWRlIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkhpZGU6IEV2ZW50RW1pdHRlcjxPdmVybGF5T25IaWRlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxPdmVybGF5T25IaWRlRXZlbnQ+KCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBzdGFydGVkLlxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uRXZlbnR9IGV2ZW50IC0gQW5pbWF0aW9uIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbkFuaW1hdGlvblN0YXJ0OiBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGRvbmUuXG4gICAgICogQHBhcmFtIHtBbmltYXRpb25FdmVudH0gZXZlbnQgLSBBbmltYXRpb24gZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uQW5pbWF0aW9uRG9uZTogRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBAVmlld0NoaWxkKCdvdmVybGF5Jykgb3ZlcmxheVZpZXdDaGlsZDogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgX3Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9tb2RlOiBPdmVybGF5TW9kZVR5cGUgfCBzdHJpbmc7XG5cbiAgICBfc3R5bGU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbiAgICBfc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2NvbnRlbnRTdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAgIF9jb250ZW50U3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX3RhcmdldDogYW55O1xuXG4gICAgX2FwcGVuZFRvOiAnYm9keScgfCBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAgIF9hdXRvWkluZGV4OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgX2Jhc2VaSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAgIF9zaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIF9oaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIF9saXN0ZW5lcjogYW55O1xuXG4gICAgX3Jlc3BvbnNpdmU6IFJlc3BvbnNpdmVPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgIF9vcHRpb25zOiBPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAgIG1vZGFsVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgaXNPdmVybGF5Q2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgaXNPdmVybGF5Q29udGVudENsaWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHNjcm9sbEhhbmRsZXI6IGFueTtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgZG9jdW1lbnRSZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgcHJpdmF0ZSBkb2N1bWVudEtleWJvYXJkTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIHByaXZhdGUgd2luZG93OiBXaW5kb3cgfCBudWxsO1xuXG4gICAgcHJvdGVjdGVkIHRyYW5zZm9ybU9wdGlvbnM6IGFueSA9IHtcbiAgICAgICAgZGVmYXVsdDogJ3NjYWxlWSgwLjgpJyxcbiAgICAgICAgY2VudGVyOiAnc2NhbGUoMC43KScsXG4gICAgICAgIHRvcDogJ3RyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDBweCknLFxuICAgICAgICAndG9wLXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDBweCknLFxuICAgICAgICAndG9wLWVuZCc6ICd0cmFuc2xhdGUzZCgwcHgsIC0xMDAlLCAwcHgpJyxcbiAgICAgICAgYm90dG9tOiAndHJhbnNsYXRlM2QoMHB4LCAxMDAlLCAwcHgpJyxcbiAgICAgICAgJ2JvdHRvbS1zdGFydCc6ICd0cmFuc2xhdGUzZCgwcHgsIDEwMCUsIDBweCknLFxuICAgICAgICAnYm90dG9tLWVuZCc6ICd0cmFuc2xhdGUzZCgwcHgsIDEwMCUsIDBweCknLFxuICAgICAgICBsZWZ0OiAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdsZWZ0LXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwcHgsIDBweCknLFxuICAgICAgICAnbGVmdC1lbmQnOiAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgIHJpZ2h0OiAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgJ3JpZ2h0LXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKDEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdyaWdodC1lbmQnOiAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJ1xuICAgIH07XG5cbiAgICBnZXQgbW9kYWwoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb2RlID09PSAnbW9kYWwnIHx8ICh0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucyAmJiB0aGlzLndpbmRvdz8ubWF0Y2hNZWRpYSh0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucy5tZWRpYT8ucmVwbGFjZSgnQG1lZGlhJywgJycpIHx8IGAobWF4LXdpZHRoOiAke3RoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zLmJyZWFrcG9pbnR9KWApLm1hdGNoZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlNb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlIHx8ICh0aGlzLm1vZGFsID8gJ21vZGFsJyA6ICdvdmVybGF5Jyk7XG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlPcHRpb25zKCk6IE92ZXJsYXlPcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zLCAuLi50aGlzLm9wdGlvbnMgfTsgLy8gVE9ETzogSW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgIH1cblxuICAgIGdldCBvdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnMoKTogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5vdmVybGF5T3B0aW9ucz8ucmVzcG9uc2l2ZSwgLi4udGhpcy5yZXNwb25zaXZlIH07IC8vIFRPRE86IEltcHJvdmUgcGVyZm9ybWFuY2VcbiAgICB9XG5cbiAgICBnZXQgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uZGlyZWN0aW9uIHx8ICdjZW50ZXInO1xuICAgIH1cblxuICAgIGdldCBvdmVybGF5RWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm92ZXJsYXlWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0IGNvbnRlbnRFbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXQgdGFyZ2V0RWwoKSB7XG4gICAgICAgIHJldHVybiBEb21IYW5kbGVyLmdldFRhcmdldEVsZW1lbnQodGhpcy50YXJnZXQsIHRoaXMuZWw/Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgY29uZmlnOiBQcmltZU5HQ29uZmlnLFxuICAgICAgICBwdWJsaWMgb3ZlcmxheVNlcnZpY2U6IE92ZXJsYXlTZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxuICAgICkge1xuICAgICAgICB0aGlzLndpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcz8uZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IG5ldyB0ZW1wbGF0ZSB0eXBlcyBtYXkgYmUgYWRkZWQuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvdyhvdmVybGF5PzogSFRNTEVsZW1lbnQsIGlzRm9jdXM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZSh0cnVlKTtcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2hvdycsIHsgb3ZlcmxheTogb3ZlcmxheSB8fCB0aGlzLm92ZXJsYXlFbCwgdGFyZ2V0OiB0aGlzLnRhcmdldEVsLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlIH0pO1xuXG4gICAgICAgIGlzRm9jdXMgJiYgRG9tSGFuZGxlci5mb2N1cyh0aGlzLnRhcmdldEVsKTtcbiAgICAgICAgdGhpcy5tb2RhbCAmJiBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZG9jdW1lbnQ/LmJvZHksICdwLW92ZXJmbG93LWhpZGRlbicpO1xuICAgIH1cblxuICAgIGhpZGUob3ZlcmxheT86IEhUTUxFbGVtZW50LCBpc0ZvY3VzOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlKGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkhpZGUnLCB7IG92ZXJsYXk6IG92ZXJsYXkgfHwgdGhpcy5vdmVybGF5RWwsIHRhcmdldDogdGhpcy50YXJnZXRFbCwgbW9kZTogdGhpcy5vdmVybGF5TW9kZSB9KTtcbiAgICAgICAgICAgIGlzRm9jdXMgJiYgRG9tSGFuZGxlci5mb2N1cyh0aGlzLnRhcmdldEVsKTtcbiAgICAgICAgICAgIHRoaXMubW9kYWwgJiYgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmRvY3VtZW50Py5ib2R5LCAncC1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsaWduT3ZlcmxheSgpIHtcbiAgICAgICAgIXRoaXMubW9kYWwgJiYgRG9tSGFuZGxlci5hbGlnbk92ZXJsYXkodGhpcy5vdmVybGF5RWwsIHRoaXMudGFyZ2V0RWwsIHRoaXMuYXBwZW5kVG8pO1xuICAgIH1cblxuICAgIG9uVmlzaWJsZUNoYW5nZSh2aXNpYmxlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdCh2aXNpYmxlKTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlDbGljaygpIHtcbiAgICAgICAgdGhpcy5pc092ZXJsYXlDbGlja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlDb250ZW50Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5U2VydmljZS5hZGQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMudGFyZ2V0RWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pc092ZXJsYXlDb250ZW50Q2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q29udGVudEFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkJlZm9yZVNob3cnLCB7IG92ZXJsYXk6IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCh0aGlzLm92ZXJsYXlNb2RlLCB0aGlzLm92ZXJsYXlFbCwgdGhpcy5iYXNlWkluZGV4ICsgdGhpcy5jb25maWc/LnpJbmRleFt0aGlzLm92ZXJsYXlNb2RlXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRPdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLmFwcGVuZFRvID09PSAnYm9keScgPyB0aGlzLmRvY3VtZW50LmJvZHkgOiB0aGlzLmFwcGVuZFRvLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsaWduT3ZlcmxheSgpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkJlZm9yZUhpZGUnLCB7IG92ZXJsYXk6IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5vdmVybGF5RWwsICdwLWNvbXBvbmVudC1vdmVybGF5LWxlYXZlJyk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkFuaW1hdGlvblN0YXJ0JywgZXZlbnQpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLm92ZXJsYXlFbCB8fCBldmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdyhjb250YWluZXIsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoY29udGFpbmVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFwcGVuZE92ZXJsYXkodGhpcy5vdmVybGF5RWwsIHRoaXMudGFyZ2V0RWwsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcihjb250YWluZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkFuaW1hdGlvbkRvbmUnLCBldmVudCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXZlbnRzKG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtuYW1lXS5lbWl0KHBhcmFtcyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyAmJiAodGhpcy5vcHRpb25zIGFzIGFueSlbbmFtZV0gJiYgKHRoaXMub3B0aW9ucyBhcyBhbnkpW25hbWVdKHBhcmFtcyk7XG4gICAgICAgIHRoaXMuY29uZmlnPy5vdmVybGF5T3B0aW9ucyAmJiAodGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zIGFzIGFueSlbbmFtZV0gJiYgKHRoaXMuY29uZmlnPy5vdmVybGF5T3B0aW9ucyBhcyBhbnkpW25hbWVdKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgYmluZExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy51bmJpbmRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IG5ldyBDb25uZWN0ZWRPdmVybGF5U2Nyb2xsSGFuZGxlcih0aGlzLnRhcmdldEVsLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ3Njcm9sbCcsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiB0cnVlIH0pIDogdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZhbGlkICYmIHRoaXMuaGlkZShldmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVGFyZ2V0Q2xpY2tlZCA9IHRoaXMudGFyZ2V0RWwgJiYgKHRoaXMudGFyZ2V0RWwuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8ICghdGhpcy5pc092ZXJsYXlDbGlja2VkICYmIHRoaXMudGFyZ2V0RWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzT3V0c2lkZUNsaWNrZWQgPSAhaXNUYXJnZXRDbGlja2VkICYmICF0aGlzLmlzT3ZlcmxheUNvbnRlbnRDbGlja2VkO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ291dHNpZGUnLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlLCB2YWxpZDogZXZlbnQud2hpY2ggIT09IDMgJiYgaXNPdXRzaWRlQ2xpY2tlZCB9KSA6IGlzT3V0c2lkZUNsaWNrZWQ7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNPdmVybGF5Q2xpY2tlZCA9IHRoaXMuaXNPdmVybGF5Q29udGVudENsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMud2luZG93LCAncmVzaXplJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSB0aGlzLmxpc3RlbmVyID8gdGhpcy5saXN0ZW5lcihldmVudCwgeyB0eXBlOiAncmVzaXplJywgbW9kZTogdGhpcy5vdmVybGF5TW9kZSwgdmFsaWQ6ICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKSB9KSA6ICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKTtcblxuICAgICAgICAgICAgICAgIHZhbGlkICYmIHRoaXMuaGlkZShldmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEtleWJvYXJkTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy53aW5kb3csICdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3ZlcmxheU9wdGlvbnMuaGlkZU9uRXNjYXBlID09PSBmYWxzZSB8fCBldmVudC5jb2RlICE9PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSB0aGlzLmxpc3RlbmVyID8gdGhpcy5saXN0ZW5lcihldmVudCwgeyB0eXBlOiAna2V5ZG93bicsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkgfSkgOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudEtleWJvYXJkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMub3ZlcmxheUVsLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vdmVybGF5RWwpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy50YXJnZXRFbCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLm92ZXJsYXlFbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZXhwb3J0czogW092ZXJsYXksIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbT3ZlcmxheV1cbn0pXG5leHBvcnQgY2xhc3MgT3ZlcmxheU1vZHVsZSB7fVxuIl19