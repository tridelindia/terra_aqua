import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';
import * as i2 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, PLATFORM_ID, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ContentChildren, ViewChild, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler, ConnectedOverlayScrollHandler } from 'primeng/dom';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';

const OVERLAY_VALUE_ACCESSOR = {
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
class Overlay {
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
class OverlayModule {
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

/**
 * Generated bundle index. Do not edit.
 */

export { OVERLAY_VALUE_ACCESSOR, Overlay, OverlayModule };
//# sourceMappingURL=primeng-overlay.mjs.map
