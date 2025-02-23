import { trigger, transition, style, animate } from '@angular/animations';
import * as i2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ViewChild, ContentChildren, HostListener, NgModule } from '@angular/core';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { EyeIcon } from 'primeng/icons/eye';
import { RefreshIcon } from 'primeng/icons/refresh';
import { SearchMinusIcon } from 'primeng/icons/searchminus';
import { SearchPlusIcon } from 'primeng/icons/searchplus';
import { TimesIcon } from 'primeng/icons/times';
import { UndoIcon } from 'primeng/icons/undo';
import { ZIndexUtils } from 'primeng/utils';
import * as i3 from 'primeng/focustrap';
import { FocusTrapModule } from 'primeng/focustrap';

/**
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 * @group Components
 */
class Image {
    document;
    config;
    cd;
    el;
    /**
     * Style class of the image element.
     * @group Props
     */
    imageClass;
    /**
     * Inline style of the image element.
     * @group Props
     */
    imageStyle;
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * The source path for the main image.
     * @group Props
     */
    src;
    /**
     * The srcset definition for the main image.
     * @group Props
     */
    srcSet;
    /**
     * The sizes definition for the main image.
     * @group Props
     */
    sizes;
    /**
     * The source path for the preview image.
     * @group Props
     */
    previewImageSrc;
    /**
     * The srcset definition for the preview image.
     * @group Props
     */
    previewImageSrcSet;
    /**
     * The sizes definition for the preview image.
     * @group Props
     */
    previewImageSizes;
    /**
     * Attribute of the preview image element.
     * @group Props
     */
    alt;
    /**
     * Attribute of the image element.
     * @group Props
     */
    width;
    /**
     * Attribute of the image element.
     * @group Props
     */
    height;
    /**
     * Attribute of the image element.
     * @group Props
     */
    loading;
    /**
     * Target element to attach the dialog, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo;
    /**
     * Controls the preview functionality.
     * @group Props
     */
    preview = false;
    /**
     * Transition options of the show animation
     * @group Props
     */
    showTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Transition options of the hide animation
     * @group Props
     */
    hideTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Triggered when the preview overlay is shown.
     * @group Emits
     */
    onShow = new EventEmitter();
    /**
     * Triggered when the preview overlay is hidden.
     * @group Emits
     */
    onHide = new EventEmitter();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onImageError = new EventEmitter();
    mask;
    previewButton;
    closeButton;
    templates;
    indicatorTemplate;
    rotateRightIconTemplate;
    rotateLeftIconTemplate;
    zoomOutIconTemplate;
    zoomInIconTemplate;
    closeIconTemplate;
    maskVisible = false;
    previewVisible = false;
    rotate = 0;
    scale = 1;
    previewClick = false;
    container;
    wrapper;
    get isZoomOutDisabled() {
        return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
    }
    get isZoomInDisabled() {
        return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
    }
    zoomSettings = {
        default: 1,
        step: 0.1,
        max: 1.5,
        min: 0.5
    };
    constructor(document, config, cd, el) {
        this.document = document;
        this.config = config;
        this.cd = cd;
        this.el = el;
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'indicator':
                    this.indicatorTemplate = item.template;
                    break;
                case 'rotaterighticon':
                    this.rotateRightIconTemplate = item.template;
                    break;
                case 'rotatelefticon':
                    this.rotateLeftIconTemplate = item.template;
                    break;
                case 'zoomouticon':
                    this.zoomOutIconTemplate = item.template;
                    break;
                case 'zoominicon':
                    this.zoomInIconTemplate = item.template;
                    break;
                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;
                default:
                    this.indicatorTemplate = item.template;
                    break;
            }
        });
    }
    onImageClick() {
        if (this.preview) {
            this.maskVisible = true;
            this.previewVisible = true;
            DomHandler.blockBodyScroll();
        }
    }
    onMaskClick() {
        if (!this.previewClick) {
            this.closePreview();
        }
        this.previewClick = false;
    }
    onMaskKeydown(event) {
        switch (event.code) {
            case 'Escape':
                this.onMaskClick();
                setTimeout(() => {
                    DomHandler.focus(this.previewButton.nativeElement);
                }, 25);
                event.preventDefault();
                break;
            default:
                break;
        }
    }
    onPreviewImageClick() {
        this.previewClick = true;
    }
    rotateRight() {
        this.rotate += 90;
        this.previewClick = true;
    }
    rotateLeft() {
        this.rotate -= 90;
        this.previewClick = true;
    }
    zoomIn() {
        this.scale = this.scale + this.zoomSettings.step;
        this.previewClick = true;
    }
    zoomOut() {
        this.scale = this.scale - this.zoomSettings.step;
        this.previewClick = true;
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container?.parentElement;
                this.appendContainer();
                this.moveOnTop();
                setTimeout(() => {
                    DomHandler.focus(this.closeButton.nativeElement);
                }, 25);
                break;
            case 'void':
                DomHandler.addClass(this.wrapper, 'p-component-overlay-leave');
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                ZIndexUtils.clear(this.wrapper);
                this.maskVisible = false;
                this.container = null;
                this.wrapper = null;
                this.cd.markForCheck();
                this.onHide.emit({});
                break;
            case 'visible':
                this.onShow.emit({});
                break;
        }
    }
    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper, this.config.zIndex.modal);
    }
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                this.document.body.appendChild(this.wrapper);
            else
                DomHandler.appendChild(this.wrapper, this.appendTo);
        }
    }
    imagePreviewStyle() {
        return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
    }
    get zoomImageAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomImage : undefined;
    }
    containerClass() {
        return {
            'p-image p-component': true,
            'p-image-preview-container': this.preview
        };
    }
    handleToolbarClick(event) {
        event.stopPropagation();
    }
    closePreview() {
        this.previewVisible = false;
        this.rotate = 0;
        this.scale = this.zoomSettings.default;
        DomHandler.unblockBodyScroll();
    }
    imageError(event) {
        this.onImageError.emit(event);
    }
    rightAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateRight : undefined;
    }
    leftAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateLeft : undefined;
    }
    zoomInAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomIn : undefined;
    }
    zoomOutAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomOut : undefined;
    }
    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }
    onKeydownHandler(event) {
        if (this.previewVisible) {
            this.closePreview();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Image, deps: [{ token: DOCUMENT }, { token: i1.PrimeNGConfig }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Image, selector: "p-image", inputs: { imageClass: "imageClass", imageStyle: "imageStyle", styleClass: "styleClass", style: "style", src: "src", srcSet: "srcSet", sizes: "sizes", previewImageSrc: "previewImageSrc", previewImageSrcSet: "previewImageSrcSet", previewImageSizes: "previewImageSizes", alt: "alt", width: "width", height: "height", loading: "loading", appendTo: "appendTo", preview: ["preview", "preview", booleanAttribute], showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions" }, outputs: { onShow: "onShow", onHide: "onHide", onImageError: "onImageError" }, host: { listeners: { "document:keydown.escape": "onKeydownHandler($event)" }, classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "mask", first: true, predicate: ["mask"], descendants: true }, { propertyName: "previewButton", first: true, predicate: ["previewButton"], descendants: true }, { propertyName: "closeButton", first: true, predicate: ["closeButton"], descendants: true }], ngImport: i0, template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.srcset]="srcSet" [attr.sizes]="sizes" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [attr.loading]="loading" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)" />
            <button *ngIf="preview" [attr.aria-label]="zoomImageAriaLabel" type="button" class="p-image-preview-indicator" (click)="onImageClick()" #previewButton [ngStyle]="{ height: height + 'px', width: width + 'px', border: 'none' }">
                <ng-container *ngIf="indicatorTemplate; else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <EyeIcon [styleClass]="'p-image-preview-icon'" />
                </ng-template>
            </button>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" [attr.aria-modal]="maskVisible" role="dialog" (click)="onMaskClick()" (keydown)="onMaskKeydown($event)" pFocusTrap>
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button" [attr.aria-label]="rightAriaLabel()">
                        <RefreshIcon *ngIf="!rotateRightIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button" [attr.aria-label]="leftAriaLabel()">
                        <UndoIcon *ngIf="!rotateLeftIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled" [attr.aria-label]="zoomOutAriaLabel()">
                        <SearchMinusIcon *ngIf="!zoomOutIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled" [attr.aria-label]="zoomInAriaLabel()">
                        <SearchPlusIcon *ngIf="!zoomInIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()" [attr.aria-label]="closeAriaLabel()" #closeButton>
                        <TimesIcon *ngIf="!closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate"></ng-template>
                    </button>
                </div>
                <div
                    *ngIf="previewVisible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                >
                    <img [attr.src]="previewImageSrc ? previewImageSrc : src" [attr.srcset]="previewImageSrcSet" [attr.sizes]="previewImageSizes" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()" />
                </div>
            </div>
        </span>
    `, isInline: true, styles: ["@layer primeng{.p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block;line-height:0}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;outline:none;border:none;padding:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon.pi{font-size:1.5rem}.p-image-preview-icon.p-icon{scale:1.5}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(() => RefreshIcon), selector: "RefreshIcon" }, { kind: "component", type: i0.forwardRef(() => EyeIcon), selector: "EyeIcon" }, { kind: "component", type: i0.forwardRef(() => UndoIcon), selector: "UndoIcon" }, { kind: "component", type: i0.forwardRef(() => SearchMinusIcon), selector: "SearchMinusIcon" }, { kind: "component", type: i0.forwardRef(() => SearchPlusIcon), selector: "SearchPlusIcon" }, { kind: "component", type: i0.forwardRef(() => TimesIcon), selector: "TimesIcon" }, { kind: "directive", type: i0.forwardRef(() => i3.FocusTrap), selector: "[pFocusTrap]", inputs: ["pFocusTrapDisabled"] }], animations: [
            trigger('animation', [
                transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
            ])
        ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Image, decorators: [{
            type: Component,
            args: [{ selector: 'p-image', template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <img [attr.src]="src" [attr.srcset]="srcSet" [attr.sizes]="sizes" [attr.alt]="alt" [attr.width]="width" [attr.height]="height" [attr.loading]="loading" [ngStyle]="imageStyle" [class]="imageClass" (error)="imageError($event)" />
            <button *ngIf="preview" [attr.aria-label]="zoomImageAriaLabel" type="button" class="p-image-preview-indicator" (click)="onImageClick()" #previewButton [ngStyle]="{ height: height + 'px', width: width + 'px', border: 'none' }">
                <ng-container *ngIf="indicatorTemplate; else defaultTemplate">
                    <ng-container *ngTemplateOutlet="indicatorTemplate"></ng-container>
                </ng-container>
                <ng-template #defaultTemplate>
                    <EyeIcon [styleClass]="'p-image-preview-icon'" />
                </ng-template>
            </button>
            <div #mask class="p-image-mask p-component-overlay p-component-overlay-enter" *ngIf="maskVisible" [attr.aria-modal]="maskVisible" role="dialog" (click)="onMaskClick()" (keydown)="onMaskKeydown($event)" pFocusTrap>
                <div class="p-image-toolbar" (click)="handleToolbarClick($event)">
                    <button class="p-image-action p-link" (click)="rotateRight()" type="button" [attr.aria-label]="rightAriaLabel()">
                        <RefreshIcon *ngIf="!rotateRightIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateRightIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="rotateLeft()" type="button" [attr.aria-label]="leftAriaLabel()">
                        <UndoIcon *ngIf="!rotateLeftIconTemplate" />
                        <ng-template *ngTemplateOutlet="rotateLeftIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomOut()" type="button" [disabled]="isZoomOutDisabled" [attr.aria-label]="zoomOutAriaLabel()">
                        <SearchMinusIcon *ngIf="!zoomOutIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomOutIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" (click)="zoomIn()" type="button" [disabled]="isZoomInDisabled" [attr.aria-label]="zoomInAriaLabel()">
                        <SearchPlusIcon *ngIf="!zoomInIconTemplate" />
                        <ng-template *ngTemplateOutlet="zoomInIconTemplate"></ng-template>
                    </button>
                    <button class="p-image-action p-link" type="button" (click)="closePreview()" [attr.aria-label]="closeAriaLabel()" #closeButton>
                        <TimesIcon *ngIf="!closeIconTemplate" />
                        <ng-template *ngTemplateOutlet="closeIconTemplate"></ng-template>
                    </button>
                </div>
                <div
                    *ngIf="previewVisible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                >
                    <img [attr.src]="previewImageSrc ? previewImageSrc : src" [attr.srcset]="previewImageSrcSet" [attr.sizes]="previewImageSizes" class="p-image-preview" [ngStyle]="imagePreviewStyle()" (click)="onPreviewImageClick()" />
                </div>
            </div>
        </span>
    `, animations: [
                        trigger('animation', [
                            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-image-mask{display:flex;align-items:center;justify-content:center}.p-image-preview-container{position:relative;display:inline-block;line-height:0}.p-image-preview-indicator{position:absolute;left:0;top:0;width:100%;height:100%;outline:none;border:none;padding:0;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}.p-image-preview-icon.pi{font-size:1.5rem}.p-image-preview-icon.p-icon{scale:1.5}.p-image-preview-container:hover>.p-image-preview-indicator{opacity:1;cursor:pointer}.p-image-preview-container>img{cursor:pointer}.p-image-toolbar{position:absolute;top:0;right:0;display:flex;z-index:1}.p-image-action.p-link{display:flex;justify-content:center;align-items:center}.p-image-action.p-link[disabled]{opacity:.5}.p-image-preview{transition:transform .15s;max-width:100vw;max-height:100vh}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.PrimeNGConfig }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }], propDecorators: { imageClass: [{
                type: Input
            }], imageStyle: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], src: [{
                type: Input
            }], srcSet: [{
                type: Input
            }], sizes: [{
                type: Input
            }], previewImageSrc: [{
                type: Input
            }], previewImageSrcSet: [{
                type: Input
            }], previewImageSizes: [{
                type: Input
            }], alt: [{
                type: Input
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }], loading: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], preview: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onImageError: [{
                type: Output
            }], mask: [{
                type: ViewChild,
                args: ['mask']
            }], previewButton: [{
                type: ViewChild,
                args: ['previewButton']
            }], closeButton: [{
                type: ViewChild,
                args: ['closeButton']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onKeydownHandler: [{
                type: HostListener,
                args: ['document:keydown.escape', ['$event']]
            }] } });
class ImageModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ImageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: ImageModule, declarations: [Image], imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrapModule], exports: [Image, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ImageModule, imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrapModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ImageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrapModule],
                    exports: [Image, SharedModule],
                    declarations: [Image]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Image, ImageModule };
//# sourceMappingURL=primeng-image.mjs.map
