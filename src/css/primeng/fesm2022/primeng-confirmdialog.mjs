import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';
import * as i2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, booleanAttribute, numberAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ContentChild, ViewChild, ContentChildren, NgModule } from '@angular/core';
import * as i1 from 'primeng/api';
import { ConfirmEventType, TranslationKeys, Footer, PrimeTemplate, SharedModule } from 'primeng/api';
import * as i3 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';
import * as i4 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import { UniqueComponentId, ZIndexUtils } from 'primeng/utils';

const showAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{transition}}', style({ transform: 'none', opacity: 1 }))]);
const hideAnimation = animation([animate('{{transition}}', style({ transform: '{{transform}}', opacity: 0 }))]);
/**
 * ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.
 * @group Components
 */
class ConfirmDialog {
    el;
    renderer;
    confirmationService;
    zone;
    cd;
    config;
    document;
    /**
     * Title text of the dialog.
     * @group Props
     */
    header;
    /**
     * Icon to display next to message.
     * @group Props
     */
    icon;
    /**
     * Message of the confirmation.
     * @group Props
     */
    message;
    /**
     * Inline style of the element.
     * @group Props
     */
    get style() {
        return this._style;
    }
    set style(value) {
        this._style = value;
        this.cd.markForCheck();
    }
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Specify the CSS class(es) for styling the mask element
     * @group Props
     */
    maskStyleClass;
    /**
     * Icon of the accept button.
     * @group Props
     */
    acceptIcon;
    /**
     * Label of the accept button.
     * @group Props
     */
    acceptLabel;
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    closeAriaLabel;
    /**
     * Defines a string that labels the accept button for accessibility.
     * @group Props
     */
    acceptAriaLabel;
    /**
     * Visibility of the accept button.
     * @group Props
     */
    acceptVisible = true;
    /**
     * Icon of the reject button.
     * @group Props
     */
    rejectIcon;
    /**
     * Label of the reject button.
     * @group Props
     */
    rejectLabel;
    /**
     * Defines a string that labels the reject button for accessibility.
     * @group Props
     */
    rejectAriaLabel;
    /**
     * Visibility of the reject button.
     * @group Props
     */
    rejectVisible = true;
    /**
     * Style class of the accept button.
     * @group Props
     */
    acceptButtonStyleClass;
    /**
     * Style class of the reject button.
     * @group Props
     */
    rejectButtonStyleClass;
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    closeOnEscape = true;
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    dismissableMask;
    /**
     * Determines whether scrolling behavior should be blocked within the component.
     * @group Props
     */
    blockScroll = true;
    /**
     * When enabled dialog is displayed in RTL direction.
     * @group Props
     */
    rtl = false;
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    closable = true;
    /**
     *  Target element to attach the dialog, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo;
    /**
     * Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs.
     * @group Props
     */
    key;
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    autoZIndex = true;
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = 0;
    /**
     * Transition options of the animation.
     * @group Props
     */
    transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * When enabled, can only focus on elements inside the confirm dialog.
     * @group Props
     */
    focusTrap = true;
    /**
     * Element to receive the focus when the dialog gets visible.
     * @group Props
     */
    defaultFocus = 'accept';
    /**
     * Object literal to define widths per screen size.
     * @group Props
     */
    breakpoints;
    /**
     * Current visible state as a boolean.
     * @group Props
     */
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.maskVisible) {
            this.maskVisible = true;
        }
        this.cd.markForCheck();
    }
    /**
     *  Allows getting the position of the component.
     * @group Props
     */
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        switch (value) {
            case 'top-left':
            case 'bottom-left':
            case 'left':
                this.transformOptions = 'translate3d(-100%, 0px, 0px)';
                break;
            case 'top-right':
            case 'bottom-right':
            case 'right':
                this.transformOptions = 'translate3d(100%, 0px, 0px)';
                break;
            case 'bottom':
                this.transformOptions = 'translate3d(0px, 100%, 0px)';
                break;
            case 'top':
                this.transformOptions = 'translate3d(0px, -100%, 0px)';
                break;
            default:
                this.transformOptions = 'scale(0.7)';
                break;
        }
    }
    /**
     * Callback to invoke when dialog is hidden.
     * @param {ConfirmEventType} enum - Custom confirm event.
     * @group Emits
     */
    onHide = new EventEmitter();
    footer;
    contentViewChild;
    templates;
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                case 'footer':
                    this.footerTemplate = item.template;
                    break;
                case 'message':
                    this.messageTemplate = item.template;
                    break;
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
                case 'rejecticon':
                    this.rejectIconTemplate = item.template;
                    break;
                case 'accepticon':
                    this.acceptIconTemplate = item.template;
                    break;
                case 'headless':
                    this.headlessTemplate = item.template;
                    break;
            }
        });
    }
    headerTemplate;
    footerTemplate;
    rejectIconTemplate;
    acceptIconTemplate;
    messageTemplate;
    iconTemplate;
    headlessTemplate;
    confirmation;
    _visible;
    _style;
    maskVisible;
    documentEscapeListener;
    container;
    wrapper;
    contentContainer;
    subscription;
    maskClickListener;
    preWidth;
    _position = 'center';
    transformOptions = 'scale(0.7)';
    styleElement;
    id = UniqueComponentId();
    ariaLabelledBy = this.getAriaLabelledBy();
    confirmationOptions;
    translationSubscription;
    constructor(el, renderer, confirmationService, zone, cd, config, document) {
        this.el = el;
        this.renderer = renderer;
        this.confirmationService = confirmationService;
        this.zone = zone;
        this.cd = cd;
        this.config = config;
        this.document = document;
        this.subscription = this.confirmationService.requireConfirmation$.subscribe((confirmation) => {
            if (!confirmation) {
                this.hide();
                return;
            }
            if (confirmation.key === this.key) {
                this.confirmation = confirmation;
                this.confirmationOptions = {
                    message: this.confirmation.message || this.message,
                    icon: this.confirmation.icon || this.icon,
                    header: this.confirmation.header || this.header,
                    rejectVisible: this.confirmation.rejectVisible == null ? this.rejectVisible : this.confirmation.rejectVisible,
                    acceptVisible: this.confirmation.acceptVisible == null ? this.acceptVisible : this.confirmation.acceptVisible,
                    acceptLabel: this.confirmation.acceptLabel || this.acceptLabel,
                    rejectLabel: this.confirmation.rejectLabel || this.rejectLabel,
                    acceptIcon: this.confirmation.acceptIcon || this.acceptIcon,
                    rejectIcon: this.confirmation.rejectIcon || this.rejectIcon,
                    acceptButtonStyleClass: this.confirmation.acceptButtonStyleClass || this.acceptButtonStyleClass,
                    rejectButtonStyleClass: this.confirmation.rejectButtonStyleClass || this.rejectButtonStyleClass,
                    defaultFocus: this.confirmation.defaultFocus || this.defaultFocus,
                    blockScroll: this.confirmation.blockScroll === false || this.confirmation.blockScroll === true ? this.confirmation.blockScroll : this.blockScroll,
                    closeOnEscape: this.confirmation.closeOnEscape === false || this.confirmation.closeOnEscape === true ? this.confirmation.closeOnEscape : this.closeOnEscape,
                    dismissableMask: this.confirmation.dismissableMask === false || this.confirmation.dismissableMask === true ? this.confirmation.dismissableMask : this.dismissableMask
                };
                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }
                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }
                this.visible = true;
            }
        });
    }
    ngOnInit() {
        if (this.breakpoints) {
            this.createStyle();
        }
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            if (this.visible) {
                this.cd.markForCheck();
            }
        });
    }
    getAriaLabelledBy() {
        return this.header !== null ? UniqueComponentId() + '_header' : null;
    }
    option(name) {
        const source = this.confirmationOptions || this;
        if (source.hasOwnProperty(name)) {
            return source[name];
        }
        return undefined;
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container?.parentElement;
                this.contentContainer = DomHandler.findSingle(this.container, '.p-dialog-content');
                this.container?.setAttribute(this.id, '');
                this.appendContainer();
                this.moveOnTop();
                this.bindGlobalListeners();
                this.enableModality();
                const element = this.getElementToFocus();
                if (element) {
                    element.focus();
                }
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    getElementToFocus() {
        switch (this.option('defaultFocus')) {
            case 'accept':
                return DomHandler.findSingle(this.container, '.p-confirm-dialog-accept');
            case 'reject':
                return DomHandler.findSingle(this.container, '.p-confirm-dialog-reject');
            case 'close':
                return DomHandler.findSingle(this.container, '.p-dialog-header-close');
            case 'none':
                return null;
            //backward compatibility
            default:
                return DomHandler.findSingle(this.container, '.p-confirm-dialog-accept');
        }
    }
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                this.document.body.appendChild(this.wrapper);
            else
                DomHandler.appendChild(this.wrapper, this.appendTo);
        }
    }
    restoreAppend() {
        if (this.wrapper && this.appendTo) {
            this.el.nativeElement.appendChild(this.wrapper);
        }
    }
    enableModality() {
        if (this.option('blockScroll')) {
            DomHandler.addClass(this.document.body, 'p-overflow-hidden');
        }
        if (this.option('dismissableMask')) {
            this.maskClickListener = this.renderer.listen(this.wrapper, 'mousedown', (event) => {
                if (this.wrapper && this.wrapper.isSameNode(event.target)) {
                    this.close(event);
                }
            });
        }
    }
    disableModality() {
        this.maskVisible = false;
        if (this.option('blockScroll')) {
            DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        }
        if (this.dismissableMask) {
            this.unbindMaskClickListener();
        }
        if (this.container && !this.cd['destroyed']) {
            this.cd.detectChanges();
        }
    }
    createStyle() {
        if (!this.styleElement) {
            this.styleElement = this.document.createElement('style');
            this.styleElement.type = 'text/css';
            DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            this.document.head.appendChild(this.styleElement);
            let innerHTML = '';
            for (let breakpoint in this.breakpoints) {
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-dialog[${this.id}] {
                            width: ${this.breakpoints[breakpoint]} !important;
                        }
                    }
                `;
            }
            this.styleElement.innerHTML = innerHTML;
        }
    }
    close(event) {
        if (this.confirmation?.rejectEvent) {
            this.confirmation.rejectEvent.emit(ConfirmEventType.CANCEL);
        }
        this.hide(ConfirmEventType.CANCEL);
        event.preventDefault();
    }
    hide(type) {
        this.onHide.emit(type);
        this.visible = false;
        this.confirmation = null;
        this.confirmationOptions = null;
    }
    moveOnTop() {
        if (this.autoZIndex) {
            ZIndexUtils.set('modal', this.container, this.baseZIndex + this.config.zIndex.modal);
            this.wrapper.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
        }
    }
    getMaskClass() {
        let maskClass = { 'p-dialog-mask p-component-overlay': true, 'p-dialog-mask-scrollblocker': this.blockScroll };
        maskClass[this.getPositionClass().toString()] = true;
        return maskClass;
    }
    getPositionClass() {
        const positions = ['left', 'right', 'top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'];
        const pos = positions.find((item) => item === this.position);
        return pos ? `p-dialog-${pos}` : '';
    }
    bindGlobalListeners() {
        if ((this.option('closeOnEscape') && this.closable) || (this.focusTrap && !this.documentEscapeListener)) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
                if (event.which == 27 && this.option('closeOnEscape') && this.closable) {
                    if (parseInt(this.container.style.zIndex) === ZIndexUtils.get(this.container) && this.visible) {
                        this.close(event);
                    }
                }
                if (event.which === 9 && this.focusTrap) {
                    event.preventDefault();
                    let focusableElements = DomHandler.getFocusableElements(this.container);
                    if (focusableElements && focusableElements.length > 0) {
                        if (!focusableElements[0].ownerDocument.activeElement) {
                            focusableElements[0].focus();
                        }
                        else {
                            let focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
                            if (event.shiftKey) {
                                if (focusedIndex == -1 || focusedIndex === 0)
                                    focusableElements[focusableElements.length - 1].focus();
                                else
                                    focusableElements[focusedIndex - 1].focus();
                            }
                            else {
                                if (focusedIndex == -1 || focusedIndex === focusableElements.length - 1)
                                    focusableElements[0].focus();
                                else
                                    focusableElements[focusedIndex + 1].focus();
                            }
                        }
                    }
                }
            });
        }
    }
    unbindGlobalListeners() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }
    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }
    onOverlayHide() {
        if (this.container && this.autoZIndex) {
            ZIndexUtils.clear(this.container);
        }
        this.disableModality();
        this.unbindGlobalListeners();
        this.container = null;
    }
    destroyStyle() {
        if (this.styleElement) {
            this.document.head.removeChild(this.styleElement);
            this.styleElement = null;
        }
    }
    ngOnDestroy() {
        this.restoreAppend();
        this.onOverlayHide();
        this.subscription.unsubscribe();
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
        this.destroyStyle();
    }
    accept() {
        if (this.confirmation && this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }
        this.hide(ConfirmEventType.ACCEPT);
    }
    reject() {
        if (this.confirmation && this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit(ConfirmEventType.REJECT);
        }
        this.hide(ConfirmEventType.REJECT);
    }
    get acceptButtonLabel() {
        return this.option('acceptLabel') || this.config.getTranslation(TranslationKeys.ACCEPT);
    }
    get rejectButtonLabel() {
        return this.option('rejectLabel') || this.config.getTranslation(TranslationKeys.REJECT);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialog, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.ConfirmationService }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: ConfirmDialog, selector: "p-confirmDialog", inputs: { header: "header", icon: "icon", message: "message", style: "style", styleClass: "styleClass", maskStyleClass: "maskStyleClass", acceptIcon: "acceptIcon", acceptLabel: "acceptLabel", closeAriaLabel: "closeAriaLabel", acceptAriaLabel: "acceptAriaLabel", acceptVisible: ["acceptVisible", "acceptVisible", booleanAttribute], rejectIcon: "rejectIcon", rejectLabel: "rejectLabel", rejectAriaLabel: "rejectAriaLabel", rejectVisible: ["rejectVisible", "rejectVisible", booleanAttribute], acceptButtonStyleClass: "acceptButtonStyleClass", rejectButtonStyleClass: "rejectButtonStyleClass", closeOnEscape: ["closeOnEscape", "closeOnEscape", booleanAttribute], dismissableMask: ["dismissableMask", "dismissableMask", booleanAttribute], blockScroll: ["blockScroll", "blockScroll", booleanAttribute], rtl: ["rtl", "rtl", booleanAttribute], closable: ["closable", "closable", booleanAttribute], appendTo: "appendTo", key: "key", autoZIndex: ["autoZIndex", "autoZIndex", booleanAttribute], baseZIndex: ["baseZIndex", "baseZIndex", numberAttribute], transitionOptions: "transitionOptions", focusTrap: ["focusTrap", "focusTrap", booleanAttribute], defaultFocus: "defaultFocus", breakpoints: "breakpoints", visible: "visible", position: "position" }, outputs: { onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "footer", first: true, predicate: Footer, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div [class]="maskStyleClass" [ngClass]="getMaskClass()" *ngIf="maskVisible">
            <div
                [ngClass]="{ 'p-dialog p-confirm-dialog p-component': true, 'p-dialog-rtl': rtl }"
                [ngStyle]="style"
                [class]="styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: transitionOptions } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="alertdialog"
                *ngIf="visible"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-modal]="true"
            >
                <ng-container *ngIf="headlessTemplate; else notHeadless">
                    <ng-container *ngTemplateOutlet="headlessTemplate; context: { $implicit: confirmation }"></ng-container>
                </ng-container>
                <ng-template #notHeadless>
                    <div class="p-dialog-header" *ngIf="headerTemplate">
                        <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    </div>
                    <div class="p-dialog-header" *ngIf="!headerTemplate">
                        <span class="p-dialog-title" [id]="ariaLabelledBy" *ngIf="option('header')">{{ option('header') }}</span>
                        <div class="p-dialog-header-icons">
                            <button *ngIf="closable" type="button" role="button" [attr.aria-label]="closeAriaLabel" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-close p-link': true }" (click)="close($event)" (keydown.enter)="close($event)">
                                <TimesIcon />
                            </button>
                        </div>
                    </div>
                    <div #content class="p-dialog-content">
                        <i [ngClass]="'p-confirm-dialog-icon'" [class]="option('icon')" *ngIf="!iconTemplate && option('icon')"></i>
                        <ng-container *ngIf="iconTemplate">
                            <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                        </ng-container>
                        <span class="p-confirm-dialog-message" *ngIf="!messageTemplate" [innerHTML]="option('message')"></span>
                        <ng-container *ngIf="messageTemplate">
                            <ng-template *ngTemplateOutlet="messageTemplate; context: { $implicit: confirmation }"></ng-template>
                        </ng-container>
                    </div>
                    <div class="p-dialog-footer" *ngIf="footer || footerTemplate">
                        <ng-content select="p-footer"></ng-content>
                        <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                    </div>
                    <div class="p-dialog-footer" *ngIf="!footer && !footerTemplate">
                        <button
                            type="button"
                            pRipple
                            pButton
                            [label]="rejectButtonLabel"
                            (click)="reject()"
                            [ngClass]="'p-confirm-dialog-reject'"
                            [class]="option('rejectButtonStyleClass')"
                            *ngIf="option('rejectVisible')"
                            [attr.aria-label]="rejectAriaLabel"
                        >
                            <ng-container *ngIf="!rejectIconTemplate">
                                <i *ngIf="option('rejectIcon')" [class]="option('rejectIcon')"></i>
                                <TimesIcon *ngIf="!option('rejectIcon')" [styleClass]="'p-button-icon-left'" />
                            </ng-container>
                            <span *ngIf="rejectIconTemplate" class="p-button-icon-left">
                                <ng-template *ngTemplateOutlet="rejectIconTemplate"></ng-template>
                            </span>
                        </button>
                        <button
                            type="button"
                            pRipple
                            pButton
                            [label]="acceptButtonLabel"
                            (click)="accept()"
                            [ngClass]="'p-confirm-dialog-accept'"
                            [class]="option('acceptButtonStyleClass')"
                            *ngIf="option('acceptVisible')"
                            [attr.aria-label]="acceptAriaLabel"
                        >
                            <ng-container *ngIf="!acceptIconTemplate">
                                <i *ngIf="option('acceptIcon')" [class]="option('acceptIcon')"></i>
                                <CheckIcon *ngIf="!option('acceptIcon')" [styleClass]="'p-button-icon-left'" />
                            </ng-container>
                            <span *ngIf="acceptIconTemplate" class="p-button-icon-left">
                                <ng-template *ngTemplateOutlet="acceptIconTemplate"></ng-template>
                            </span>
                        </button>
                    </div>
                </ng-template>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{-webkit-transition:none;transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i3.ButtonDirective), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading", "severity", "raised", "rounded", "text", "outlined", "size", "plain"] }, { kind: "directive", type: i0.forwardRef(() => i4.Ripple), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(() => TimesIcon), selector: "TimesIcon" }, { kind: "component", type: i0.forwardRef(() => CheckIcon), selector: "CheckIcon" }], animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialog, decorators: [{
            type: Component,
            args: [{ selector: 'p-confirmDialog', template: `
        <div [class]="maskStyleClass" [ngClass]="getMaskClass()" *ngIf="maskVisible">
            <div
                [ngClass]="{ 'p-dialog p-confirm-dialog p-component': true, 'p-dialog-rtl': rtl }"
                [ngStyle]="style"
                [class]="styleClass"
                [@animation]="{ value: 'visible', params: { transform: transformOptions, transition: transitionOptions } }"
                (@animation.start)="onAnimationStart($event)"
                (@animation.done)="onAnimationEnd($event)"
                role="alertdialog"
                *ngIf="visible"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-modal]="true"
            >
                <ng-container *ngIf="headlessTemplate; else notHeadless">
                    <ng-container *ngTemplateOutlet="headlessTemplate; context: { $implicit: confirmation }"></ng-container>
                </ng-container>
                <ng-template #notHeadless>
                    <div class="p-dialog-header" *ngIf="headerTemplate">
                        <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    </div>
                    <div class="p-dialog-header" *ngIf="!headerTemplate">
                        <span class="p-dialog-title" [id]="ariaLabelledBy" *ngIf="option('header')">{{ option('header') }}</span>
                        <div class="p-dialog-header-icons">
                            <button *ngIf="closable" type="button" role="button" [attr.aria-label]="closeAriaLabel" [ngClass]="{ 'p-dialog-header-icon p-dialog-header-close p-link': true }" (click)="close($event)" (keydown.enter)="close($event)">
                                <TimesIcon />
                            </button>
                        </div>
                    </div>
                    <div #content class="p-dialog-content">
                        <i [ngClass]="'p-confirm-dialog-icon'" [class]="option('icon')" *ngIf="!iconTemplate && option('icon')"></i>
                        <ng-container *ngIf="iconTemplate">
                            <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
                        </ng-container>
                        <span class="p-confirm-dialog-message" *ngIf="!messageTemplate" [innerHTML]="option('message')"></span>
                        <ng-container *ngIf="messageTemplate">
                            <ng-template *ngTemplateOutlet="messageTemplate; context: { $implicit: confirmation }"></ng-template>
                        </ng-container>
                    </div>
                    <div class="p-dialog-footer" *ngIf="footer || footerTemplate">
                        <ng-content select="p-footer"></ng-content>
                        <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
                    </div>
                    <div class="p-dialog-footer" *ngIf="!footer && !footerTemplate">
                        <button
                            type="button"
                            pRipple
                            pButton
                            [label]="rejectButtonLabel"
                            (click)="reject()"
                            [ngClass]="'p-confirm-dialog-reject'"
                            [class]="option('rejectButtonStyleClass')"
                            *ngIf="option('rejectVisible')"
                            [attr.aria-label]="rejectAriaLabel"
                        >
                            <ng-container *ngIf="!rejectIconTemplate">
                                <i *ngIf="option('rejectIcon')" [class]="option('rejectIcon')"></i>
                                <TimesIcon *ngIf="!option('rejectIcon')" [styleClass]="'p-button-icon-left'" />
                            </ng-container>
                            <span *ngIf="rejectIconTemplate" class="p-button-icon-left">
                                <ng-template *ngTemplateOutlet="rejectIconTemplate"></ng-template>
                            </span>
                        </button>
                        <button
                            type="button"
                            pRipple
                            pButton
                            [label]="acceptButtonLabel"
                            (click)="accept()"
                            [ngClass]="'p-confirm-dialog-accept'"
                            [class]="option('acceptButtonStyleClass')"
                            *ngIf="option('acceptVisible')"
                            [attr.aria-label]="acceptAriaLabel"
                        >
                            <ng-container *ngIf="!acceptIconTemplate">
                                <i *ngIf="option('acceptIcon')" [class]="option('acceptIcon')"></i>
                                <CheckIcon *ngIf="!option('acceptIcon')" [styleClass]="'p-button-icon-left'" />
                            </ng-container>
                            <span *ngIf="acceptIconTemplate" class="p-button-icon-left">
                                <ng-template *ngTemplateOutlet="acceptIconTemplate"></ng-template>
                            </span>
                        </button>
                    </div>
                </ng-template>
            </div>
        </div>
    `, animations: [trigger('animation', [transition('void => visible', [useAnimation(showAnimation)]), transition('visible => void', [useAnimation(hideAnimation)])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-dialog-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none}.p-dialog-mask.p-component-overlay{pointer-events:auto}.p-dialog{display:flex;flex-direction:column;pointer-events:auto;max-height:90%;transform:scale(1);position:relative}.p-dialog-content{overflow-y:auto;flex-grow:1}.p-dialog-header{display:flex;align-items:center;justify-content:space-between;flex-shrink:0}.p-dialog-draggable .p-dialog-header{cursor:move}.p-dialog-footer{flex-shrink:0}.p-dialog .p-dialog-header-icons{display:flex;align-items:center}.p-dialog .p-dialog-header-icon{display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}.p-fluid .p-dialog-footer .p-button{width:auto}.p-dialog-top .p-dialog,.p-dialog-bottom .p-dialog,.p-dialog-left .p-dialog,.p-dialog-right .p-dialog,.p-dialog-top-left .p-dialog,.p-dialog-top-right .p-dialog,.p-dialog-bottom-left .p-dialog,.p-dialog-bottom-right .p-dialog{margin:.75rem;transform:translateZ(0)}.p-dialog-maximized{-webkit-transition:none;transition:none;transform:none;width:100vw!important;height:100vh!important;top:0!important;left:0!important;max-height:100%;height:100%}.p-dialog-maximized .p-dialog-content{flex-grow:1}.p-dialog-left{justify-content:flex-start}.p-dialog-right{justify-content:flex-end}.p-dialog-top{align-items:flex-start}.p-dialog-top-left{justify-content:flex-start;align-items:flex-start}.p-dialog-top-right{justify-content:flex-end;align-items:flex-start}.p-dialog-bottom{align-items:flex-end}.p-dialog-bottom-left{justify-content:flex-start;align-items:flex-end}.p-dialog-bottom-right{justify-content:flex-end;align-items:flex-end}.p-dialog .p-resizable-handle{position:absolute;font-size:.1px;display:block;cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}.p-confirm-dialog .p-dialog-content{display:flex;align-items:center}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.ConfirmationService }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { header: [{
                type: Input
            }], icon: [{
                type: Input
            }], message: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], maskStyleClass: [{
                type: Input
            }], acceptIcon: [{
                type: Input
            }], acceptLabel: [{
                type: Input
            }], closeAriaLabel: [{
                type: Input
            }], acceptAriaLabel: [{
                type: Input
            }], acceptVisible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rejectIcon: [{
                type: Input
            }], rejectLabel: [{
                type: Input
            }], rejectAriaLabel: [{
                type: Input
            }], rejectVisible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], acceptButtonStyleClass: [{
                type: Input
            }], rejectButtonStyleClass: [{
                type: Input
            }], closeOnEscape: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], dismissableMask: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], blockScroll: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rtl: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], closable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], appendTo: [{
                type: Input
            }], key: [{
                type: Input
            }], autoZIndex: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], baseZIndex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], transitionOptions: [{
                type: Input
            }], focusTrap: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], defaultFocus: [{
                type: Input
            }], breakpoints: [{
                type: Input
            }], visible: [{
                type: Input
            }], position: [{
                type: Input
            }], onHide: [{
                type: Output
            }], footer: [{
                type: ContentChild,
                args: [Footer]
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class ConfirmDialogModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialogModule, declarations: [ConfirmDialog], imports: [CommonModule, ButtonModule, RippleModule, TimesIcon, CheckIcon], exports: [ConfirmDialog, ButtonModule, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialogModule, imports: [CommonModule, ButtonModule, RippleModule, TimesIcon, CheckIcon, ButtonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ConfirmDialogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, RippleModule, TimesIcon, CheckIcon],
                    exports: [ConfirmDialog, ButtonModule, SharedModule],
                    declarations: [ConfirmDialog]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ConfirmDialog, ConfirmDialogModule };
//# sourceMappingURL=primeng-confirmdialog.mjs.map
