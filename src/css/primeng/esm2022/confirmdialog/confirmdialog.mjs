import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, ViewChild, ViewEncapsulation, booleanAttribute, numberAttribute } from '@angular/core';
import { ConfirmEventType, Footer, PrimeTemplate, SharedModule, TranslationKeys } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import { CheckIcon } from 'primeng/icons/check';
import { TimesIcon } from 'primeng/icons/times';
import { RippleModule } from 'primeng/ripple';
import { UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/button";
import * as i4 from "primeng/ripple";
const showAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{transition}}', style({ transform: 'none', opacity: 1 }))]);
const hideAnimation = animation([animate('{{transition}}', style({ transform: '{{transform}}', opacity: 0 }))]);
/**
 * ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.
 * @group Components
 */
export class ConfirmDialog {
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
export class ConfirmDialogModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9jb25maXJtZGlhbG9nL2NvbmZpcm1kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFrQixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFFZixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBSVIsTUFBTSxFQUlOLFNBQVMsRUFDVCxpQkFBaUIsRUFFakIsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFxQyxNQUFNLEVBQWlCLGFBQWEsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3ZKLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQUcvRCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE9BQU8s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bkIsS0FBSztnQkFLTyxPQUFPO3NCQUFuQixLQUFLO2dCQWdCTyxRQUFRO3NCQUFwQixLQUFLO2dCQWtDSSxNQUFNO3NCQUFmLE1BQU07Z0JBRWUsTUFBTTtzQkFBM0IsWUFBWTt1QkFBQyxNQUFNO2dCQUVFLGdCQUFnQjtzQkFBckMsU0FBUzt1QkFBQyxTQUFTO2dCQUVZLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTs7QUFpYWxDLE1BQU0sT0FBTyxtQkFBbUI7dUdBQW5CLG1CQUFtQjt3R0FBbkIsbUJBQW1CLGlCQTFuQm5CLGFBQWEsYUFzbkJaLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxTQUFTLGFBdG5CL0QsYUFBYSxFQXVuQkcsWUFBWSxFQUFFLFlBQVk7d0dBRzFDLG1CQUFtQixZQUpsQixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUMvQyxZQUFZLEVBQUUsWUFBWTs7MkZBRzFDLG1CQUFtQjtrQkFML0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO29CQUN6RSxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztvQkFDcEQsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDO2lCQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFuaW1hdGlvbkV2ZW50LCBhbmltYXRlLCBhbmltYXRpb24sIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyLCB1c2VBbmltYXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBOZ1pvbmUsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFJlbmRlcmVyMixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgVmlld1JlZixcbiAgICBib29sZWFuQXR0cmlidXRlLFxuICAgIG51bWJlckF0dHJpYnV0ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbmZpcm1FdmVudFR5cGUsIENvbmZpcm1hdGlvbiwgQ29uZmlybWF0aW9uU2VydmljZSwgRm9vdGVyLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUsIFRyYW5zbGF0aW9uS2V5cyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBDaGVja0ljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL2NoZWNrJztcbmltcG9ydCB7IFRpbWVzSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvdGltZXMnO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgTnVsbGFibGUgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuaW1wb3J0IHsgVW5pcXVlQ29tcG9uZW50SWQsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuY29uc3Qgc2hvd0FuaW1hdGlvbiA9IGFuaW1hdGlvbihbc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3RyYW5zZm9ybX19Jywgb3BhY2l0eTogMCB9KSwgYW5pbWF0ZSgne3t0cmFuc2l0aW9ufX0nLCBzdHlsZSh7IHRyYW5zZm9ybTogJ25vbmUnLCBvcGFjaXR5OiAxIH0pKV0pO1xuXG5jb25zdCBoaWRlQW5pbWF0aW9uID0gYW5pbWF0aW9uKFthbmltYXRlKCd7e3RyYW5zaXRpb259fScsIHN0eWxlKHsgdHJhbnNmb3JtOiAne3t0cmFuc2Zvcm19fScsIG9wYWNpdHk6IDAgfSkpXSk7XG4vKipcbiAqIENvbmZpcm1EaWFsb2cgdXNlcyBhIERpYWxvZyBVSSB0aGF0IGlzIGludGVncmF0ZWQgd2l0aCB0aGUgQ29uZmlybWF0aW9uIEFQSS5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jb25maXJtRGlhbG9nJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtjbGFzc109XCJtYXNrU3R5bGVDbGFzc1wiIFtuZ0NsYXNzXT1cImdldE1hc2tDbGFzcygpXCIgKm5nSWY9XCJtYXNrVmlzaWJsZVwiPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlhbG9nIHAtY29uZmlybS1kaWFsb2cgcC1jb21wb25lbnQnOiB0cnVlLCAncC1kaWFsb2ctcnRsJzogcnRsIH1cIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgW0BhbmltYXRpb25dPVwieyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgdHJhbnNmb3JtOiB0cmFuc2Zvcm1PcHRpb25zLCB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uT3B0aW9ucyB9IH1cIlxuICAgICAgICAgICAgICAgIChAYW5pbWF0aW9uLnN0YXJ0KT1cIm9uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBhbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICByb2xlPVwiYWxlcnRkaWFsb2dcIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwidmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLW1vZGFsXT1cInRydWVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJoZWFkbGVzc1RlbXBsYXRlOyBlbHNlIG5vdEhlYWRsZXNzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkbGVzc1RlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogY29uZmlybWF0aW9uIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI25vdEhlYWRsZXNzPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kaWFsb2ctaGVhZGVyXCIgKm5nSWY9XCJoZWFkZXJUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1kaWFsb2ctaGVhZGVyXCIgKm5nSWY9XCIhaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1kaWFsb2ctdGl0bGVcIiBbaWRdPVwiYXJpYUxhYmVsbGVkQnlcIiAqbmdJZj1cIm9wdGlvbignaGVhZGVyJylcIj57eyBvcHRpb24oJ2hlYWRlcicpIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZGlhbG9nLWhlYWRlci1pY29uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJjbG9zYWJsZVwiIHR5cGU9XCJidXR0b25cIiByb2xlPVwiYnV0dG9uXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJjbG9zZUFyaWFMYWJlbFwiIFtuZ0NsYXNzXT1cInsgJ3AtZGlhbG9nLWhlYWRlci1pY29uIHAtZGlhbG9nLWhlYWRlci1jbG9zZSBwLWxpbmsnOiB0cnVlIH1cIiAoY2xpY2spPVwiY2xvc2UoJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cImNsb3NlKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRpbWVzSWNvbiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICNjb250ZW50IGNsYXNzPVwicC1kaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgW25nQ2xhc3NdPVwiJ3AtY29uZmlybS1kaWFsb2ctaWNvbidcIiBbY2xhc3NdPVwib3B0aW9uKCdpY29uJylcIiAqbmdJZj1cIiFpY29uVGVtcGxhdGUgJiYgb3B0aW9uKCdpY29uJylcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwiaWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWNvbmZpcm0tZGlhbG9nLW1lc3NhZ2VcIiAqbmdJZj1cIiFtZXNzYWdlVGVtcGxhdGVcIiBbaW5uZXJIVE1MXT1cIm9wdGlvbignbWVzc2FnZScpXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1lc3NhZ2VUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm1lc3NhZ2VUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGNvbmZpcm1hdGlvbiB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZGlhbG9nLWZvb3RlclwiICpuZ0lmPVwiZm9vdGVyIHx8IGZvb3RlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWZvb3RlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmb290ZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZGlhbG9nLWZvb3RlclwiICpuZ0lmPVwiIWZvb3RlciAmJiAhZm9vdGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsYWJlbF09XCJyZWplY3RCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cInJlamVjdCgpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIncC1jb25maXJtLWRpYWxvZy1yZWplY3QnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwib3B0aW9uKCdyZWplY3RCdXR0b25TdHlsZUNsYXNzJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwib3B0aW9uKCdyZWplY3RWaXNpYmxlJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwicmVqZWN0QXJpYUxhYmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIXJlamVjdEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSAqbmdJZj1cIm9wdGlvbigncmVqZWN0SWNvbicpXCIgW2NsYXNzXT1cIm9wdGlvbigncmVqZWN0SWNvbicpXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGltZXNJY29uICpuZ0lmPVwiIW9wdGlvbigncmVqZWN0SWNvbicpXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtYnV0dG9uLWljb24tbGVmdCdcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwicmVqZWN0SWNvblRlbXBsYXRlXCIgY2xhc3M9XCJwLWJ1dHRvbi1pY29uLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwicmVqZWN0SWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsYWJlbF09XCJhY2NlcHRCdXR0b25MYWJlbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImFjY2VwdCgpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIncC1jb25maXJtLWRpYWxvZy1hY2NlcHQnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwib3B0aW9uKCdhY2NlcHRCdXR0b25TdHlsZUNsYXNzJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwib3B0aW9uKCdhY2NlcHRWaXNpYmxlJylcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYWNjZXB0QXJpYUxhYmVsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWFjY2VwdEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSAqbmdJZj1cIm9wdGlvbignYWNjZXB0SWNvbicpXCIgW2NsYXNzXT1cIm9wdGlvbignYWNjZXB0SWNvbicpXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q2hlY2tJY29uICpuZ0lmPVwiIW9wdGlvbignYWNjZXB0SWNvbicpXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtYnV0dG9uLWljb24tbGVmdCdcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiYWNjZXB0SWNvblRlbXBsYXRlXCIgY2xhc3M9XCJwLWJ1dHRvbi1pY29uLWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwiYWNjZXB0SWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdhbmltYXRpb24nLCBbdHJhbnNpdGlvbigndm9pZCA9PiB2aXNpYmxlJywgW3VzZUFuaW1hdGlvbihzaG93QW5pbWF0aW9uKV0pLCB0cmFuc2l0aW9uKCd2aXNpYmxlID0+IHZvaWQnLCBbdXNlQW5pbWF0aW9uKGhpZGVBbmltYXRpb24pXSldKV0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi4vZGlhbG9nL2RpYWxvZy5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgQ29uZmlybURpYWxvZyBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICAvKipcbiAgICAgKiBUaXRsZSB0ZXh0IG9mIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgaGVhZGVyOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogSWNvbiB0byBkaXNwbGF5IG5leHQgdG8gbWVzc2FnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBpY29uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogTWVzc2FnZSBvZiB0aGUgY29uZmlybWF0aW9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIG1lc3NhZ2U6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlKCk6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGU7XG4gICAgfVxuICAgIHNldCBzdHlsZSh2YWx1ZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGFzcyBvZiB0aGUgZWxlbWVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3BlY2lmeSB0aGUgQ1NTIGNsYXNzKGVzKSBmb3Igc3R5bGluZyB0aGUgbWFzayBlbGVtZW50XG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbWFza1N0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJY29uIG9mIHRoZSBhY2NlcHQgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGFjY2VwdEljb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBMYWJlbCBvZiB0aGUgYWNjZXB0IGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBhY2NlcHRMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBzdHJpbmcgdGhhdCBsYWJlbHMgdGhlIGNsb3NlIGJ1dHRvbiBmb3IgYWNjZXNzaWJpbGl0eS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBjbG9zZUFyaWFMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBzdHJpbmcgdGhhdCBsYWJlbHMgdGhlIGFjY2VwdCBidXR0b24gZm9yIGFjY2Vzc2liaWxpdHkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYWNjZXB0QXJpYUxhYmVsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVmlzaWJpbGl0eSBvZiB0aGUgYWNjZXB0IGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgYWNjZXB0VmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogSWNvbiBvZiB0aGUgcmVqZWN0IGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSByZWplY3RJY29uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogTGFiZWwgb2YgdGhlIHJlamVjdCBidXR0b24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgcmVqZWN0TGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGEgc3RyaW5nIHRoYXQgbGFiZWxzIHRoZSByZWplY3QgYnV0dG9uIGZvciBhY2Nlc3NpYmlsaXR5LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHJlamVjdEFyaWFMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFZpc2liaWxpdHkgb2YgdGhlIHJlamVjdCBidXR0b24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHJlamVjdFZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIG9mIHRoZSBhY2NlcHQgYnV0dG9uLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGFjY2VwdEJ1dHRvblN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgcmVqZWN0IGJ1dHRvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSByZWplY3RCdXR0b25TdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIGlmIHByZXNzaW5nIGVzY2FwZSBrZXkgc2hvdWxkIGhpZGUgdGhlIGRpYWxvZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgY2xvc2VPbkVzY2FwZTogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIGlmIGNsaWNraW5nIHRoZSBtb2RhbCBiYWNrZ3JvdW5kIHNob3VsZCBoaWRlIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGRpc21pc3NhYmxlTWFzazogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgc2Nyb2xsaW5nIGJlaGF2aW9yIHNob3VsZCBiZSBibG9ja2VkIHdpdGhpbiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBibG9ja1Njcm9sbDogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogV2hlbiBlbmFibGVkIGRpYWxvZyBpcyBkaXNwbGF5ZWQgaW4gUlRMIGRpcmVjdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcnRsOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQWRkcyBhIGNsb3NlIGljb24gdG8gdGhlIGhlYWRlciB0byBoaWRlIHRoZSBkaWFsb2cuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGNsb3NhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgICAvKipcbiAgICAgKiAgVGFyZ2V0IGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBkaWFsb2csIHZhbGlkIHZhbHVlcyBhcmUgXCJib2R5XCIgb3IgYSBsb2NhbCBuZy10ZW1wbGF0ZSB2YXJpYWJsZSBvZiBhbm90aGVyIGVsZW1lbnQgKG5vdGU6IHVzZSBiaW5kaW5nIHdpdGggYnJhY2tldHMgZm9yIHRlbXBsYXRlIHZhcmlhYmxlcywgZS5nLiBbYXBwZW5kVG9dPVwibXlkaXZcIiBmb3IgYSBkaXYgZWxlbWVudCBoYXZpbmcgI215ZGl2IGFzIHZhcmlhYmxlIG5hbWUpLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWYgfCBUZW1wbGF0ZVJlZjxhbnk+IHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB8IGFueTtcbiAgICAvKipcbiAgICAgKiBPcHRpb25hbCBrZXkgdG8gbWF0Y2ggdGhlIGtleSBvZiBjb25maXJtIG9iamVjdCwgbmVjZXNzYXJ5IHRvIHVzZSB3aGVuIGNvbXBvbmVudCB0cmVlIGhhcyBtdWx0aXBsZSBjb25maXJtIGRpYWxvZ3MuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkga2V5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBhdXRvbWF0aWNhbGx5IG1hbmFnZSBsYXllcmluZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogQmFzZSB6SW5kZXggdmFsdWUgdG8gdXNlIGluIGxheWVyaW5nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlIH0pIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbiBvcHRpb25zIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG4gICAgLyoqXG4gICAgICogV2hlbiBlbmFibGVkLCBjYW4gb25seSBmb2N1cyBvbiBlbGVtZW50cyBpbnNpZGUgdGhlIGNvbmZpcm0gZGlhbG9nLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBmb2N1c1RyYXA6IGJvb2xlYW4gPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIEVsZW1lbnQgdG8gcmVjZWl2ZSB0aGUgZm9jdXMgd2hlbiB0aGUgZGlhbG9nIGdldHMgdmlzaWJsZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBkZWZhdWx0Rm9jdXM6ICdhY2NlcHQnIHwgJ3JlamVjdCcgfCAnY2xvc2UnIHwgJ25vbmUnID0gJ2FjY2VwdCc7XG4gICAgLyoqXG4gICAgICogT2JqZWN0IGxpdGVyYWwgdG8gZGVmaW5lIHdpZHRocyBwZXIgc2NyZWVuIHNpemUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYnJlYWtwb2ludHM6IGFueTtcbiAgICAvKipcbiAgICAgKiBDdXJyZW50IHZpc2libGUgc3RhdGUgYXMgYSBib29sZWFuLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCB2aXNpYmxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgIH1cbiAgICBzZXQgdmlzaWJsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSAmJiAhdGhpcy5tYXNrVmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5tYXNrVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAgQWxsb3dzIGdldHRpbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IHBvc2l0aW9uKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgICB9XG4gICAgc2V0IHBvc2l0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSB2YWx1ZTtcblxuICAgICAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybU9wdGlvbnMgPSAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0b3AtcmlnaHQnOlxuICAgICAgICAgICAgY2FzZSAnYm90dG9tLXJpZ2h0JzpcbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zZm9ybU9wdGlvbnMgPSAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1PcHRpb25zID0gJ3RyYW5zbGF0ZTNkKDBweCwgMTAwJSwgMHB4KSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtT3B0aW9ucyA9ICd0cmFuc2xhdGUzZCgwcHgsIC0xMDAlLCAwcHgpJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1PcHRpb25zID0gJ3NjYWxlKDAuNyknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gZGlhbG9nIGlzIGhpZGRlbi5cbiAgICAgKiBAcGFyYW0ge0NvbmZpcm1FdmVudFR5cGV9IGVudW0gLSBDdXN0b20gY29uZmlybSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8Q29uZmlybUV2ZW50VHlwZT4gPSBuZXcgRXZlbnRFbWl0dGVyPENvbmZpcm1FdmVudFR5cGU+KCk7XG5cbiAgICBAQ29udGVudENoaWxkKEZvb3RlcikgZm9vdGVyOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50Vmlld0NoaWxkOiBOdWxsYWJsZTxFbGVtZW50UmVmPjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbWVzc2FnZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3JlamVjdGljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlamVjdEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYWNjZXB0aWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWNjZXB0SWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkbGVzcyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGVhZGxlc3NUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoZWFkZXJUZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICBmb290ZXJUZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICByZWplY3RJY29uVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgYWNjZXB0SWNvblRlbXBsYXRlOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIG1lc3NhZ2VUZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICBpY29uVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgaGVhZGxlc3NUZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICBjb25maXJtYXRpb246IE51bGxhYmxlPENvbmZpcm1hdGlvbj47XG5cbiAgICBfdmlzaWJsZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIF9zdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAgIG1hc2tWaXNpYmxlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gICAgZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcjogYW55O1xuXG4gICAgY29udGFpbmVyOiBOdWxsYWJsZTxIVE1MRGl2RWxlbWVudD47XG5cbiAgICB3cmFwcGVyOiBOdWxsYWJsZTxIVE1MRWxlbWVudD47XG5cbiAgICBjb250ZW50Q29udGFpbmVyOiBOdWxsYWJsZTxIVE1MRGl2RWxlbWVudD47XG5cbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIG1hc2tDbGlja0xpc3RlbmVyOiBGdW5jdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbiAgICBwcmVXaWR0aDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgX3Bvc2l0aW9uOiBzdHJpbmcgPSAnY2VudGVyJztcblxuICAgIHRyYW5zZm9ybU9wdGlvbnM6IGFueSA9ICdzY2FsZSgwLjcpJztcblxuICAgIHN0eWxlRWxlbWVudDogYW55O1xuXG4gICAgaWQgPSBVbmlxdWVDb21wb25lbnRJZCgpO1xuXG4gICAgYXJpYUxhYmVsbGVkQnk6IHN0cmluZyA9IHRoaXMuZ2V0QXJpYUxhYmVsbGVkQnkoKTtcblxuICAgIGNvbmZpcm1hdGlvbk9wdGlvbnM6IE51bGxhYmxlPENvbmZpcm1hdGlvbj47XG5cbiAgICB0cmFuc2xhdGlvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgY29uZmlybWF0aW9uU2VydmljZTogQ29uZmlybWF0aW9uU2VydmljZSxcbiAgICAgICAgcHVibGljIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50XG4gICAgKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5jb25maXJtYXRpb25TZXJ2aWNlLnJlcXVpcmVDb25maXJtYXRpb24kLnN1YnNjcmliZSgoY29uZmlybWF0aW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZpcm1hdGlvbi5rZXkgPT09IHRoaXMua2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24gPSBjb25maXJtYXRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmNvbmZpcm1hdGlvbi5tZXNzYWdlIHx8IHRoaXMubWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogdGhpcy5jb25maXJtYXRpb24uaWNvbiB8fCB0aGlzLmljb24sXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogdGhpcy5jb25maXJtYXRpb24uaGVhZGVyIHx8IHRoaXMuaGVhZGVyLFxuICAgICAgICAgICAgICAgICAgICByZWplY3RWaXNpYmxlOiB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RWaXNpYmxlID09IG51bGwgPyB0aGlzLnJlamVjdFZpc2libGUgOiB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RWaXNpYmxlLFxuICAgICAgICAgICAgICAgICAgICBhY2NlcHRWaXNpYmxlOiB0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRWaXNpYmxlID09IG51bGwgPyB0aGlzLmFjY2VwdFZpc2libGUgOiB0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRWaXNpYmxlLFxuICAgICAgICAgICAgICAgICAgICBhY2NlcHRMYWJlbDogdGhpcy5jb25maXJtYXRpb24uYWNjZXB0TGFiZWwgfHwgdGhpcy5hY2NlcHRMYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0TGFiZWw6IHRoaXMuY29uZmlybWF0aW9uLnJlamVjdExhYmVsIHx8IHRoaXMucmVqZWN0TGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdEljb246IHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEljb24gfHwgdGhpcy5hY2NlcHRJY29uLFxuICAgICAgICAgICAgICAgICAgICByZWplY3RJY29uOiB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RJY29uIHx8IHRoaXMucmVqZWN0SWNvbixcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0QnV0dG9uU3R5bGVDbGFzczogdGhpcy5jb25maXJtYXRpb24uYWNjZXB0QnV0dG9uU3R5bGVDbGFzcyB8fCB0aGlzLmFjY2VwdEJ1dHRvblN0eWxlQ2xhc3MsXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdEJ1dHRvblN0eWxlQ2xhc3M6IHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEJ1dHRvblN0eWxlQ2xhc3MgfHwgdGhpcy5yZWplY3RCdXR0b25TdHlsZUNsYXNzLFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Rm9jdXM6IHRoaXMuY29uZmlybWF0aW9uLmRlZmF1bHRGb2N1cyB8fCB0aGlzLmRlZmF1bHRGb2N1cyxcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tTY3JvbGw6IHRoaXMuY29uZmlybWF0aW9uLmJsb2NrU2Nyb2xsID09PSBmYWxzZSB8fCB0aGlzLmNvbmZpcm1hdGlvbi5ibG9ja1Njcm9sbCA9PT0gdHJ1ZSA/IHRoaXMuY29uZmlybWF0aW9uLmJsb2NrU2Nyb2xsIDogdGhpcy5ibG9ja1Njcm9sbCxcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VPbkVzY2FwZTogdGhpcy5jb25maXJtYXRpb24uY2xvc2VPbkVzY2FwZSA9PT0gZmFsc2UgfHwgdGhpcy5jb25maXJtYXRpb24uY2xvc2VPbkVzY2FwZSA9PT0gdHJ1ZSA/IHRoaXMuY29uZmlybWF0aW9uLmNsb3NlT25Fc2NhcGUgOiB0aGlzLmNsb3NlT25Fc2NhcGUsXG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlTWFzazogdGhpcy5jb25maXJtYXRpb24uZGlzbWlzc2FibGVNYXNrID09PSBmYWxzZSB8fCB0aGlzLmNvbmZpcm1hdGlvbi5kaXNtaXNzYWJsZU1hc2sgPT09IHRydWUgPyB0aGlzLmNvbmZpcm1hdGlvbi5kaXNtaXNzYWJsZU1hc2sgOiB0aGlzLmRpc21pc3NhYmxlTWFza1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtYXRpb24uYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRFdmVudC5zdWJzY3JpYmUodGhpcy5jb25maXJtYXRpb24uYWNjZXB0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtYXRpb24ucmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RFdmVudC5zdWJzY3JpYmUodGhpcy5jb25maXJtYXRpb24ucmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25TdWJzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy50cmFuc2xhdGlvbk9ic2VydmVyLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0QXJpYUxhYmVsbGVkQnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhlYWRlciAhPT0gbnVsbCA/IFVuaXF1ZUNvbXBvbmVudElkKCkgKyAnX2hlYWRlcicgOiBudWxsO1xuICAgIH1cblxuICAgIG9wdGlvbihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc291cmNlOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0gdGhpcy5jb25maXJtYXRpb25PcHRpb25zIHx8IHRoaXM7XG4gICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2VbbmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gZXZlbnQuZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmNvbnRhaW5lcj8ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRDb250YWluZXIgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXIsICcucC1kaWFsb2ctY29udGVudCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyPy5zZXRBdHRyaWJ1dGUodGhpcy5pZCwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwZW5kQ29udGFpbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlT25Ub3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1vZGFsaXR5KCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50VG9Gb2N1cygpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEVsZW1lbnRUb0ZvY3VzKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMub3B0aW9uKCdkZWZhdWx0Rm9jdXMnKSkge1xuICAgICAgICAgICAgY2FzZSAnYWNjZXB0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCAnLnAtY29uZmlybS1kaWFsb2ctYWNjZXB0Jyk7XG5cbiAgICAgICAgICAgIGNhc2UgJ3JlamVjdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lciwgJy5wLWNvbmZpcm0tZGlhbG9nLXJlamVjdCcpO1xuXG4gICAgICAgICAgICBjYXNlICdjbG9zZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lciwgJy5wLWRpYWxvZy1oZWFkZXItY2xvc2UnKTtcblxuICAgICAgICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIC8vYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCAnLnAtY29uZmlybS1kaWFsb2ctYWNjZXB0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmRDb250YWluZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKSB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyIGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIGVsc2UgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZUFwcGVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMud3JhcHBlciAmJiB0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy53cmFwcGVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU1vZGFsaXR5KCkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb24oJ2Jsb2NrU2Nyb2xsJykpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5kb2N1bWVudC5ib2R5LCAncC1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbignZGlzbWlzc2FibGVNYXNrJykpIHtcbiAgICAgICAgICAgIHRoaXMubWFza0NsaWNrTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLndyYXBwZXIsICdtb3VzZWRvd24nLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLndyYXBwZXIgJiYgdGhpcy53cmFwcGVyLmlzU2FtZU5vZGUoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVNb2RhbGl0eSgpIHtcbiAgICAgICAgdGhpcy5tYXNrVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbignYmxvY2tTY3JvbGwnKSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmRvY3VtZW50LmJvZHksICdwLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlzbWlzc2FibGVNYXNrKSB7XG4gICAgICAgICAgICB0aGlzLnVuYmluZE1hc2tDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgISh0aGlzLmNkIGFzIFZpZXdSZWYpWydkZXN0cm95ZWQnXSkge1xuICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTdHlsZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0eWxlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudC50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIERvbUhhbmRsZXIuc2V0QXR0cmlidXRlKHRoaXMuc3R5bGVFbGVtZW50LCAnbm9uY2UnLCB0aGlzLmNvbmZpZz8uY3NwKCk/Lm5vbmNlKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCh0aGlzLnN0eWxlRWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBicmVha3BvaW50IGluIHRoaXMuYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgICAgICBpbm5lckhUTUwgKz0gYFxuICAgICAgICAgICAgICAgICAgICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiAke2JyZWFrcG9pbnR9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAucC1kaWFsb2dbJHt0aGlzLmlkfV0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAke3RoaXMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF19ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9zZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlybWF0aW9uPy5yZWplY3RFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQuZW1pdChDb25maXJtRXZlbnRUeXBlLkNBTkNFTCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoQ29uZmlybUV2ZW50VHlwZS5DQU5DRUwpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGhpZGUodHlwZT86IENvbmZpcm1FdmVudFR5cGUpIHtcbiAgICAgICAgdGhpcy5vbkhpZGUuZW1pdCh0eXBlKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uZmlybWF0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb25PcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICBtb3ZlT25Ub3AoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnbW9kYWwnLCB0aGlzLmNvbnRhaW5lciwgdGhpcy5iYXNlWkluZGV4ICsgdGhpcy5jb25maWcuekluZGV4Lm1vZGFsKTtcbiAgICAgICAgICAgICg8SFRNTEVsZW1lbnQ+dGhpcy53cmFwcGVyKS5zdHlsZS56SW5kZXggPSBTdHJpbmcocGFyc2VJbnQoKDxIVE1MRGl2RWxlbWVudD50aGlzLmNvbnRhaW5lcikuc3R5bGUuekluZGV4LCAxMCkgLSAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldE1hc2tDbGFzcygpIHtcbiAgICAgICAgbGV0IG1hc2tDbGFzczogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7ICdwLWRpYWxvZy1tYXNrIHAtY29tcG9uZW50LW92ZXJsYXknOiB0cnVlLCAncC1kaWFsb2ctbWFzay1zY3JvbGxibG9ja2VyJzogdGhpcy5ibG9ja1Njcm9sbCB9O1xuICAgICAgICBtYXNrQ2xhc3NbdGhpcy5nZXRQb3NpdGlvbkNsYXNzKCkudG9TdHJpbmcoKV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gbWFza0NsYXNzO1xuICAgIH1cblxuICAgIGdldFBvc2l0aW9uQ2xhc3MoKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JywgJ2JvdHRvbScsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXTtcbiAgICAgICAgY29uc3QgcG9zID0gcG9zaXRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0gPT09IHRoaXMucG9zaXRpb24pO1xuXG4gICAgICAgIHJldHVybiBwb3MgPyBgcC1kaWFsb2ctJHtwb3N9YCA6ICcnO1xuICAgIH1cblxuICAgIGJpbmRHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICgodGhpcy5vcHRpb24oJ2Nsb3NlT25Fc2NhcGUnKSAmJiB0aGlzLmNsb3NhYmxlKSB8fCAodGhpcy5mb2N1c1RyYXAgJiYgIXRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAnZG9jdW1lbnQnO1xuXG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMjcgJiYgdGhpcy5vcHRpb24oJ2Nsb3NlT25Fc2NhcGUnKSAmJiB0aGlzLmNsb3NhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCgodGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpLnN0eWxlLnpJbmRleCkgPT09IFpJbmRleFV0aWxzLmdldCh0aGlzLmNvbnRhaW5lcikgJiYgdGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gOSAmJiB0aGlzLmZvY3VzVHJhcCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IERvbUhhbmRsZXIuZ2V0Rm9jdXNhYmxlRWxlbWVudHModGhpcy5jb250YWluZXIgYXMgSFRNTERpdkVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50cyAmJiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvY3VzYWJsZUVsZW1lbnRzWzBdLm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb2N1c2VkSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5pbmRleE9mKGZvY3VzYWJsZUVsZW1lbnRzWzBdLm93bmVyRG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZWRJbmRleCA9PSAtMSB8fCBmb2N1c2VkSW5kZXggPT09IDApIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNlZEluZGV4IC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9jdXNlZEluZGV4ID09IC0xIHx8IGZvY3VzZWRJbmRleCA9PT0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSkgZm9jdXNhYmxlRWxlbWVudHNbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2VkSW5kZXggKyAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kR2xvYmFsTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRNYXNrQ2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMubWFza0NsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubWFza0NsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMubWFza0NsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PdmVybGF5SGlkZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5jb250YWluZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlTW9kYWxpdHkoKTtcbiAgICAgICAgdGhpcy51bmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3lTdHlsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3R5bGVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQodGhpcy5zdHlsZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5zdHlsZUVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMucmVzdG9yZUFwcGVuZCgpO1xuICAgICAgICB0aGlzLm9uT3ZlcmxheUhpZGUoKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgICAgICBpZiAodGhpcy50cmFuc2xhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXN0cm95U3R5bGUoKTtcbiAgICB9XG5cbiAgICBhY2NlcHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbiAmJiB0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24uYWNjZXB0RXZlbnQuZW1pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oaWRlKENvbmZpcm1FdmVudFR5cGUuQUNDRVBUKTtcbiAgICB9XG5cbiAgICByZWplY3QoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbiAmJiB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQuZW1pdChDb25maXJtRXZlbnRUeXBlLlJFSkVDVCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmhpZGUoQ29uZmlybUV2ZW50VHlwZS5SRUpFQ1QpO1xuICAgIH1cblxuICAgIGdldCBhY2NlcHRCdXR0b25MYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb24oJ2FjY2VwdExhYmVsJykgfHwgdGhpcy5jb25maWcuZ2V0VHJhbnNsYXRpb24oVHJhbnNsYXRpb25LZXlzLkFDQ0VQVCk7XG4gICAgfVxuXG4gICAgZ2V0IHJlamVjdEJ1dHRvbkxhYmVsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbigncmVqZWN0TGFiZWwnKSB8fCB0aGlzLmNvbmZpZy5nZXRUcmFuc2xhdGlvbihUcmFuc2xhdGlvbktleXMuUkVKRUNUKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQnV0dG9uTW9kdWxlLCBSaXBwbGVNb2R1bGUsIFRpbWVzSWNvbiwgQ2hlY2tJY29uXSxcbiAgICBleHBvcnRzOiBbQ29uZmlybURpYWxvZywgQnV0dG9uTW9kdWxlLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0NvbmZpcm1EaWFsb2ddXG59KVxuZXhwb3J0IGNsYXNzIENvbmZpcm1EaWFsb2dNb2R1bGUge31cbiJdfQ==