import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostListener, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation, booleanAttribute, numberAttribute } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ChevronLeftIcon } from 'primeng/icons/chevronleft';
import { ChevronRightIcon } from 'primeng/icons/chevronright';
import { TimesIcon } from 'primeng/icons/times';
import { WindowMaximizeIcon } from 'primeng/icons/windowmaximize';
import { WindowMinimizeIcon } from 'primeng/icons/windowminimize';
import { RippleModule } from 'primeng/ripple';
import { UniqueComponentId, ZIndexUtils } from 'primeng/utils';
import { FocusTrapModule } from 'primeng/focustrap';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/focustrap";
/**
 * Galleria is an advanced content gallery component.
 * @group Components
 */
export class Galleria {
    document;
    platformId;
    element;
    cd;
    config;
    /**
     * Index of the first item.
     * @group Props
     */
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    /**
     * Whether to display the component on fullscreen.
     * @group Props
     */
    fullScreen = false;
    /**
     * Unique identifier of the element.
     * @group Props
     */
    id;
    /**
     * An array of objects to display.
     * @group Props
     */
    value;
    /**
     * Number of items per page.
     * @group Props
     */
    numVisible = 3;
    /**
     * An array of options for responsive design.
     * @see {GalleriaResponsiveOptions}
     * @group Props
     */
    responsiveOptions;
    /**
     * Whether to display navigation buttons in item section.
     * @group Props
     */
    showItemNavigators = false;
    /**
     * Whether to display navigation buttons in thumbnail container.
     * @group Props
     */
    showThumbnailNavigators = true;
    /**
     * Whether to display navigation buttons on item hover.
     * @group Props
     */
    showItemNavigatorsOnHover = false;
    /**
     * When enabled, item is changed on indicator hover.
     * @group Props
     */
    changeItemOnIndicatorHover = false;
    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    circular = false;
    /**
     * Items are displayed with a slideshow in autoPlay mode.
     * @group Props
     */
    autoPlay = false;
    /**
     * When enabled, autorun should stop by click.
     * @group Props
     */
    shouldStopAutoplayByClick = true;
    /**
     * Time in milliseconds to scroll items.
     * @group Props
     */
    transitionInterval = 4000;
    /**
     * Whether to display thumbnail container.
     * @group Props
     */
    showThumbnails = true;
    /**
     * Position of thumbnails.
     * @group Props
     */
    thumbnailsPosition = 'bottom';
    /**
     * Height of the viewport in vertical thumbnail.
     * @group Props
     */
    verticalThumbnailViewPortHeight = '300px';
    /**
     * Whether to display indicator container.
     * @group Props
     */
    showIndicators = false;
    /**
     * When enabled, indicator container is displayed on item container.
     * @group Props
     */
    showIndicatorsOnItem = false;
    /**
     * Position of indicators.
     * @group Props
     */
    indicatorsPosition = 'bottom';
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    baseZIndex = 0;
    /**
     * Style class of the mask on fullscreen mode.
     * @group Props
     */
    maskClass;
    /**
     * Style class of the component on fullscreen mode. Otherwise, the 'class' property can be used.
     * @group Props
     */
    containerClass;
    /**
     * Inline style of the component on fullscreen mode. Otherwise, the 'style' property can be used.
     * @group Props
     */
    containerStyle;
    /**
     * Transition options of the show animation.
     * @group Props
     */
    showTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    hideTransitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Specifies the visibility of the mask on fullscreen mode.
     * @group Props
     */
    get visible() {
        return this._visible;
    }
    set visible(visible) {
        this._visible = visible;
        if (this._visible && !this.maskVisible) {
            this.maskVisible = true;
        }
    }
    /**
     * Callback to invoke on active index change.
     * @param {number} number - Active index.
     * @group Emits
     */
    activeIndexChange = new EventEmitter();
    /**
     * Callback to invoke on visiblity change.
     * @param {boolean} boolean - Visible value.
     * @group Emits
     */
    visibleChange = new EventEmitter();
    mask;
    container;
    templates;
    _visible = false;
    _activeIndex = 0;
    headerFacet;
    footerFacet;
    indicatorFacet;
    captionFacet;
    closeIconTemplate;
    previousThumbnailIconTemplate;
    nextThumbnailIconTemplate;
    itemPreviousIconTemplate;
    itemNextIconTemplate;
    maskVisible = false;
    numVisibleLimit = 0;
    constructor(document, platformId, element, cd, config) {
        this.document = document;
        this.platformId = platformId;
        this.element = element;
        this.cd = cd;
        this.config = config;
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerFacet = item.template;
                    break;
                case 'footer':
                    this.footerFacet = item.template;
                    break;
                case 'indicator':
                    this.indicatorFacet = item.template;
                    break;
                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;
                case 'itemnexticon':
                    this.itemNextIconTemplate = item.template;
                    break;
                case 'itempreviousicon':
                    this.itemPreviousIconTemplate = item.template;
                    break;
                case 'previousthumbnailicon':
                    this.previousThumbnailIconTemplate = item.template;
                    break;
                case 'nextthumbnailicon':
                    this.nextThumbnailIconTemplate = item.template;
                    break;
                case 'caption':
                    this.captionFacet = item.template;
                    break;
            }
        });
    }
    ngOnChanges(simpleChanges) {
        if (simpleChanges.value && simpleChanges.value.currentValue?.length < this.numVisible) {
            this.numVisibleLimit = simpleChanges.value.currentValue.length;
        }
        else {
            this.numVisibleLimit = 0;
        }
    }
    onMaskHide() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
    onActiveItemChange(index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeIndexChange.emit(index);
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.enableModality();
                setTimeout(() => {
                    DomHandler.focus(DomHandler.findSingle(this.container.nativeElement, '[data-pc-section="closebutton"]'));
                }, 25);
                break;
            case 'void':
                DomHandler.addClass(this.mask?.nativeElement, 'p-component-overlay-leave');
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                this.disableModality();
                break;
        }
    }
    enableModality() {
        DomHandler.blockBodyScroll();
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.set('modal', this.mask.nativeElement, this.baseZIndex || this.config.zIndex.modal);
        }
    }
    disableModality() {
        DomHandler.unblockBodyScroll();
        this.maskVisible = false;
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.clear(this.mask.nativeElement);
        }
    }
    ngOnDestroy() {
        if (this.fullScreen) {
            DomHandler.removeClass(this.document.body, 'p-overflow-hidden');
        }
        if (this.mask) {
            this.disableModality();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Galleria, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Galleria, selector: "p-galleria", inputs: { activeIndex: "activeIndex", fullScreen: ["fullScreen", "fullScreen", booleanAttribute], id: "id", value: "value", numVisible: ["numVisible", "numVisible", numberAttribute], responsiveOptions: "responsiveOptions", showItemNavigators: ["showItemNavigators", "showItemNavigators", booleanAttribute], showThumbnailNavigators: ["showThumbnailNavigators", "showThumbnailNavigators", booleanAttribute], showItemNavigatorsOnHover: ["showItemNavigatorsOnHover", "showItemNavigatorsOnHover", booleanAttribute], changeItemOnIndicatorHover: ["changeItemOnIndicatorHover", "changeItemOnIndicatorHover", booleanAttribute], circular: ["circular", "circular", booleanAttribute], autoPlay: ["autoPlay", "autoPlay", booleanAttribute], shouldStopAutoplayByClick: ["shouldStopAutoplayByClick", "shouldStopAutoplayByClick", booleanAttribute], transitionInterval: ["transitionInterval", "transitionInterval", numberAttribute], showThumbnails: ["showThumbnails", "showThumbnails", booleanAttribute], thumbnailsPosition: "thumbnailsPosition", verticalThumbnailViewPortHeight: "verticalThumbnailViewPortHeight", showIndicators: ["showIndicators", "showIndicators", booleanAttribute], showIndicatorsOnItem: ["showIndicatorsOnItem", "showIndicatorsOnItem", booleanAttribute], indicatorsPosition: "indicatorsPosition", baseZIndex: ["baseZIndex", "baseZIndex", numberAttribute], maskClass: "maskClass", containerClass: "containerClass", containerStyle: "containerStyle", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", visible: "visible" }, outputs: { activeIndexChange: "activeIndexChange", visibleChange: "visibleChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "mask", first: true, predicate: ["mask"], descendants: true }, { propertyName: "container", first: true, predicate: ["container"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <div *ngIf="fullScreen; else windowed" #container>
            <div
                *ngIf="maskVisible"
                #mask
                [ngClass]="{ 'p-galleria-mask p-component-overlay p-component-overlay-enter': true, 'p-galleria-visible': this.visible }"
                [class]="maskClass"
                [attr.role]="fullScreen ? 'dialog' : 'region'"
                [attr.aria-modal]="fullScreen ? 'true' : undefined"
            >
                <p-galleriaContent
                    *ngIf="visible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [numVisible]="numVisibleLimit || numVisible"
                    (maskHide)="onMaskHide()"
                    (activeItemChange)="onActiveItemChange($event)"
                    [ngStyle]="containerStyle"
                    [fullScreen]="fullScreen"
                ></p-galleriaContent>
            </div>
        </div>

        <ng-template #windowed>
            <p-galleriaContent [value]="value" [activeIndex]="activeIndex" [numVisible]="numVisibleLimit || numVisible" (activeItemChange)="onActiveItemChange($event)"></p-galleriaContent>
        </ng-template>
    `, isInline: true, styles: ["@layer primeng{.p-galleria-content{display:flex;flex-direction:column}.p-galleria-item-wrapper{display:flex;flex-direction:column;position:relative}.p-galleria-item-container{position:relative;display:flex;height:100%}.p-galleria-item-nav{position:absolute;top:50%;margin-top:-.5rem;display:inline-flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-item-prev{left:0;border-top-left-radius:0;border-bottom-left-radius:0}.p-galleria-item-next{right:0;border-top-right-radius:0;border-bottom-right-radius:0}.p-galleria-item{display:flex;justify-content:center;align-items:center;height:100%;width:100%}.p-galleria-item-nav-onhover .p-galleria-item-nav{pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav,.p-galleria-item-nav-onhover .p-galleria-item-nav-focused{pointer-events:all;opacity:1}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav.p-disabled{pointer-events:none}.p-galleria-caption{position:absolute;bottom:0;left:0;width:100%}.p-galleria-thumbnail-wrapper{display:flex;flex-direction:column;overflow:auto;flex-shrink:0}.p-galleria-thumbnail-prev,.p-galleria-thumbnail-next{align-self:center;flex:0 0 auto;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-galleria-thumbnail-prev span,.p-galleria-thumbnail-next span{display:flex;justify-content:center;align-items:center}.p-galleria-thumbnail-container{display:flex;flex-direction:row}.p-galleria-thumbnail-items-container{overflow:hidden;width:100%}.p-galleria-thumbnail-items{display:flex}.p-galleria-thumbnail-item{overflow:auto;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5}.p-galleria-thumbnail-item:hover{opacity:1;transition:opacity .3s}.p-galleria-thumbnail-item-current{opacity:1}.p-galleria-thumbnails-left .p-galleria-content,.p-galleria-thumbnails-right .p-galleria-content,.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-right .p-galleria-item-wrapper{flex-direction:row}.p-galleria-thumbnails-left p-galleriaitem,.p-galleria-thumbnails-top p-galleriaitem{order:2}.p-galleria-thumbnails-left p-galleriathumbnails,.p-galleria-thumbnails-top p-galleriathumbnails{order:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-container,.p-galleria-thumbnails-right .p-galleria-thumbnail-container{flex-direction:column;flex-grow:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-items,.p-galleria-thumbnails-right .p-galleria-thumbnail-items{flex-direction:column;height:100%}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-right .p-galleria-thumbnail-wrapper{height:100%}.p-galleria-indicators{display:flex;align-items:center;justify-content:center}.p-galleria-indicator>button{display:inline-flex;align-items:center}.p-galleria-indicators-left .p-galleria-item-wrapper,.p-galleria-indicators-right .p-galleria-item-wrapper{flex-direction:row;align-items:center}.p-galleria-indicators-left .p-galleria-item-container,.p-galleria-indicators-top .p-galleria-item-container{order:2}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-top .p-galleria-indicators{order:1}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-right .p-galleria-indicators{flex-direction:column}.p-galleria-indicator-onitem .p-galleria-indicators{position:absolute;display:flex;z-index:1}.p-galleria-indicator-onitem.p-galleria-indicators-top .p-galleria-indicators{top:0;left:0;width:100%;align-items:flex-start}.p-galleria-indicator-onitem.p-galleria-indicators-right .p-galleria-indicators{right:0;top:0;height:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-bottom .p-galleria-indicators{bottom:0;left:0;width:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-left .p-galleria-indicators{left:0;top:0;height:100%;align-items:flex-start}.p-galleria-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:transparent;transition-property:background-color}.p-galleria-close{position:absolute;top:0;right:0;display:flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-mask .p-galleria-item-nav{position:fixed;top:50%;margin-top:-.5rem}.p-galleria-mask.p-galleria-mask-leave{background-color:transparent}.p-items-hidden .p-galleria-thumbnail-item{visibility:hidden}.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active{visibility:visible}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(() => GalleriaContent), selector: "p-galleriaContent", inputs: ["activeIndex", "value", "numVisible", "fullScreen"], outputs: ["maskHide", "activeItemChange"] }], animations: [
            trigger('animation', [
                transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
            ])
        ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Galleria, decorators: [{
            type: Component,
            args: [{ selector: 'p-galleria', template: `
        <div *ngIf="fullScreen; else windowed" #container>
            <div
                *ngIf="maskVisible"
                #mask
                [ngClass]="{ 'p-galleria-mask p-component-overlay p-component-overlay-enter': true, 'p-galleria-visible': this.visible }"
                [class]="maskClass"
                [attr.role]="fullScreen ? 'dialog' : 'region'"
                [attr.aria-modal]="fullScreen ? 'true' : undefined"
            >
                <p-galleriaContent
                    *ngIf="visible"
                    [@animation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions } }"
                    (@animation.start)="onAnimationStart($event)"
                    (@animation.done)="onAnimationEnd($event)"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [numVisible]="numVisibleLimit || numVisible"
                    (maskHide)="onMaskHide()"
                    (activeItemChange)="onActiveItemChange($event)"
                    [ngStyle]="containerStyle"
                    [fullScreen]="fullScreen"
                ></p-galleriaContent>
            </div>
        </div>

        <ng-template #windowed>
            <p-galleriaContent [value]="value" [activeIndex]="activeIndex" [numVisible]="numVisibleLimit || numVisible" (activeItemChange)="onActiveItemChange($event)"></p-galleriaContent>
        </ng-template>
    `, animations: [
                        trigger('animation', [
                            transition('void => visible', [style({ transform: 'scale(0.7)', opacity: 0 }), animate('{{showTransitionParams}}')]),
                            transition('visible => void', [animate('{{hideTransitionParams}}', style({ transform: 'scale(0.7)', opacity: 0 }))])
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-galleria-content{display:flex;flex-direction:column}.p-galleria-item-wrapper{display:flex;flex-direction:column;position:relative}.p-galleria-item-container{position:relative;display:flex;height:100%}.p-galleria-item-nav{position:absolute;top:50%;margin-top:-.5rem;display:inline-flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-item-prev{left:0;border-top-left-radius:0;border-bottom-left-radius:0}.p-galleria-item-next{right:0;border-top-right-radius:0;border-bottom-right-radius:0}.p-galleria-item{display:flex;justify-content:center;align-items:center;height:100%;width:100%}.p-galleria-item-nav-onhover .p-galleria-item-nav{pointer-events:none;opacity:0;transition:opacity .2s ease-in-out}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav,.p-galleria-item-nav-onhover .p-galleria-item-nav-focused{pointer-events:all;opacity:1}.p-galleria-item-nav-onhover .p-galleria-item-wrapper:hover .p-galleria-item-nav.p-disabled{pointer-events:none}.p-galleria-caption{position:absolute;bottom:0;left:0;width:100%}.p-galleria-thumbnail-wrapper{display:flex;flex-direction:column;overflow:auto;flex-shrink:0}.p-galleria-thumbnail-prev,.p-galleria-thumbnail-next{align-self:center;flex:0 0 auto;display:flex;justify-content:center;align-items:center;overflow:hidden;position:relative}.p-galleria-thumbnail-prev span,.p-galleria-thumbnail-next span{display:flex;justify-content:center;align-items:center}.p-galleria-thumbnail-container{display:flex;flex-direction:row}.p-galleria-thumbnail-items-container{overflow:hidden;width:100%}.p-galleria-thumbnail-items{display:flex}.p-galleria-thumbnail-item{overflow:auto;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.5}.p-galleria-thumbnail-item:hover{opacity:1;transition:opacity .3s}.p-galleria-thumbnail-item-current{opacity:1}.p-galleria-thumbnails-left .p-galleria-content,.p-galleria-thumbnails-right .p-galleria-content,.p-galleria-thumbnails-left .p-galleria-item-wrapper,.p-galleria-thumbnails-right .p-galleria-item-wrapper{flex-direction:row}.p-galleria-thumbnails-left p-galleriaitem,.p-galleria-thumbnails-top p-galleriaitem{order:2}.p-galleria-thumbnails-left p-galleriathumbnails,.p-galleria-thumbnails-top p-galleriathumbnails{order:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-container,.p-galleria-thumbnails-right .p-galleria-thumbnail-container{flex-direction:column;flex-grow:1}.p-galleria-thumbnails-left .p-galleria-thumbnail-items,.p-galleria-thumbnails-right .p-galleria-thumbnail-items{flex-direction:column;height:100%}.p-galleria-thumbnails-left .p-galleria-thumbnail-wrapper,.p-galleria-thumbnails-right .p-galleria-thumbnail-wrapper{height:100%}.p-galleria-indicators{display:flex;align-items:center;justify-content:center}.p-galleria-indicator>button{display:inline-flex;align-items:center}.p-galleria-indicators-left .p-galleria-item-wrapper,.p-galleria-indicators-right .p-galleria-item-wrapper{flex-direction:row;align-items:center}.p-galleria-indicators-left .p-galleria-item-container,.p-galleria-indicators-top .p-galleria-item-container{order:2}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-top .p-galleria-indicators{order:1}.p-galleria-indicators-left .p-galleria-indicators,.p-galleria-indicators-right .p-galleria-indicators{flex-direction:column}.p-galleria-indicator-onitem .p-galleria-indicators{position:absolute;display:flex;z-index:1}.p-galleria-indicator-onitem.p-galleria-indicators-top .p-galleria-indicators{top:0;left:0;width:100%;align-items:flex-start}.p-galleria-indicator-onitem.p-galleria-indicators-right .p-galleria-indicators{right:0;top:0;height:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-bottom .p-galleria-indicators{bottom:0;left:0;width:100%;align-items:flex-end}.p-galleria-indicator-onitem.p-galleria-indicators-left .p-galleria-indicators{left:0;top:0;height:100%;align-items:flex-start}.p-galleria-mask{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:transparent;transition-property:background-color}.p-galleria-close{position:absolute;top:0;right:0;display:flex;justify-content:center;align-items:center;overflow:hidden}.p-galleria-mask .p-galleria-item-nav{position:fixed;top:50%;margin-top:-.5rem}.p-galleria-mask.p-galleria-mask-leave{background-color:transparent}.p-items-hidden .p-galleria-thumbnail-item{visibility:hidden}.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active{visibility:visible}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }], propDecorators: { activeIndex: [{
                type: Input
            }], fullScreen: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], id: [{
                type: Input
            }], value: [{
                type: Input
            }], numVisible: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], responsiveOptions: [{
                type: Input
            }], showItemNavigators: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showThumbnailNavigators: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showItemNavigatorsOnHover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], changeItemOnIndicatorHover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], circular: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autoPlay: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], shouldStopAutoplayByClick: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], transitionInterval: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], showThumbnails: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], thumbnailsPosition: [{
                type: Input
            }], verticalThumbnailViewPortHeight: [{
                type: Input
            }], showIndicators: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showIndicatorsOnItem: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], indicatorsPosition: [{
                type: Input
            }], baseZIndex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], maskClass: [{
                type: Input
            }], containerClass: [{
                type: Input
            }], containerStyle: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], visible: [{
                type: Input
            }], activeIndexChange: [{
                type: Output
            }], visibleChange: [{
                type: Output
            }], mask: [{
                type: ViewChild,
                args: ['mask']
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class GalleriaContent {
    galleria;
    cd;
    differs;
    config;
    elementRef;
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    value = [];
    numVisible;
    fullScreen;
    maskHide = new EventEmitter();
    activeItemChange = new EventEmitter();
    closeButton;
    id;
    _activeIndex = 0;
    slideShowActive = true;
    interval;
    styleClass;
    differ;
    constructor(galleria, cd, differs, config, elementRef) {
        this.galleria = galleria;
        this.cd = cd;
        this.differs = differs;
        this.config = config;
        this.elementRef = elementRef;
        this.id = this.galleria.id || UniqueComponentId();
        this.differ = this.differs.find(this.galleria).create();
    }
    // For custom fullscreen
    handleFullscreenChange(event) {
        if (document?.fullscreenElement === this.elementRef.nativeElement?.children[0]) {
            this.fullScreen = true;
        }
        else {
            this.fullScreen = false;
        }
    }
    ngDoCheck() {
        if (isPlatformBrowser(this.galleria.platformId)) {
            const changes = this.differ.diff(this.galleria);
            if (changes && changes.forEachItem.length > 0) {
                // Because we change the properties of the parent component,
                // and the children take our entity from the injector.
                // We can tell the children to redraw themselves when we change the properties of the parent component.
                // Since we have an onPush strategy
                this.cd.markForCheck();
            }
        }
    }
    galleriaClass() {
        const thumbnailsPosClass = this.galleria.showThumbnails && this.getPositionClass('p-galleria-thumbnails', this.galleria.thumbnailsPosition);
        const indicatorPosClass = this.galleria.showIndicators && this.getPositionClass('p-galleria-indicators', this.galleria.indicatorsPosition);
        return (this.galleria.containerClass ? this.galleria.containerClass + ' ' : '') + (thumbnailsPosClass ? thumbnailsPosClass + ' ' : '') + (indicatorPosClass ? indicatorPosClass + ' ' : '');
    }
    startSlideShow() {
        if (isPlatformBrowser(this.galleria.platformId)) {
            this.interval = setInterval(() => {
                let activeIndex = this.galleria.circular && this.value.length - 1 === this.activeIndex ? 0 : this.activeIndex + 1;
                this.onActiveIndexChange(activeIndex);
                this.activeIndex = activeIndex;
            }, this.galleria.transitionInterval);
            this.slideShowActive = true;
        }
    }
    stopSlideShow() {
        if (this.galleria.autoPlay && !this.galleria.shouldStopAutoplayByClick) {
            return;
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.slideShowActive = false;
    }
    getPositionClass(preClassName, position) {
        const positions = ['top', 'left', 'bottom', 'right'];
        const pos = positions.find((item) => item === position);
        return pos ? `${preClassName}-${pos}` : '';
    }
    isVertical() {
        return this.galleria.thumbnailsPosition === 'left' || this.galleria.thumbnailsPosition === 'right';
    }
    onActiveIndexChange(index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeItemChange.emit(this.activeIndex);
        }
    }
    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaContent, deps: [{ token: Galleria }, { token: i0.ChangeDetectorRef }, { token: i0.KeyValueDiffers }, { token: i1.PrimeNGConfig }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: GalleriaContent, selector: "p-galleriaContent", inputs: { activeIndex: "activeIndex", value: "value", numVisible: ["numVisible", "numVisible", numberAttribute], fullScreen: ["fullScreen", "fullScreen", booleanAttribute] }, outputs: { maskHide: "maskHide", activeItemChange: "activeItemChange" }, host: { listeners: { "document:fullscreenchange": "handleFullscreenChange($event)" } }, viewQueries: [{ propertyName: "closeButton", first: true, predicate: ["closeButton"], descendants: true }], ngImport: i0, template: `
        <div
            [attr.id]="id"
            [attr.role]="'region'"
            *ngIf="value && value.length > 0"
            [ngClass]="{
                'p-galleria p-component': true,
                'p-galleria-fullscreen': this.galleria.fullScreen,
                'p-galleria-indicator-onitem': this.galleria.showIndicatorsOnItem,
                'p-galleria-item-nav-onhover': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen
            }"
            [ngStyle]="!galleria.fullScreen ? galleria.containerStyle : {}"
            [class]="galleriaClass()"
            pFocusTrap
            [pFocusTrapDisabled]="!fullScreen"
        >
            <button *ngIf="galleria.fullScreen" type="button" class="p-galleria-close p-link" (click)="maskHide.emit()" pRipple [attr.aria-label]="closeAriaLabel()" [attr.data-pc-section]="'closebutton'">
                <TimesIcon *ngIf="!galleria.closeIconTemplate" [styleClass]="'p-galleria-close-icon'" />
                <ng-template *ngTemplateOutlet="galleria.closeIconTemplate"></ng-template>
            </button>
            <div *ngIf="galleria.templates && galleria.headerFacet" class="p-galleria-header">
                <p-galleriaItemSlot type="header" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
            <div class="p-galleria-content" [attr.aria-live]="galleria.autoPlay ? 'polite' : 'off'">
                <p-galleriaItem
                    [id]="id"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [circular]="galleria.circular"
                    [templates]="galleria.templates"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover"
                    [indicatorFacet]="galleria.indicatorFacet"
                    [captionFacet]="galleria.captionFacet"
                    [showItemNavigators]="galleria.showItemNavigators"
                    [autoPlay]="galleria.autoPlay"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaItem>

                <p-galleriaThumbnails
                    *ngIf="galleria.showThumbnails"
                    [containerId]="id"
                    [value]="value"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [activeIndex]="activeIndex"
                    [templates]="galleria.templates"
                    [numVisible]="numVisible"
                    [responsiveOptions]="galleria.responsiveOptions"
                    [circular]="galleria.circular"
                    [isVertical]="isVertical()"
                    [contentHeight]="galleria.verticalThumbnailViewPortHeight"
                    [showThumbnailNavigators]="galleria.showThumbnailNavigators"
                    [slideShowActive]="slideShowActive"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaThumbnails>
            </div>
            <div *ngIf="galleria.templates && galleria.footerFacet" class="p-galleria-footer">
                <p-galleriaItemSlot type="footer" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i3.Ripple), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(() => TimesIcon), selector: "TimesIcon" }, { kind: "directive", type: i0.forwardRef(() => i4.FocusTrap), selector: "[pFocusTrap]", inputs: ["pFocusTrapDisabled"] }, { kind: "component", type: i0.forwardRef(() => GalleriaItemSlot), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }, { kind: "component", type: i0.forwardRef(() => GalleriaItem), selector: "p-galleriaItem", inputs: ["id", "circular", "value", "showItemNavigators", "showIndicators", "slideShowActive", "changeItemOnIndicatorHover", "autoPlay", "templates", "indicatorFacet", "captionFacet", "activeIndex"], outputs: ["startSlideShow", "stopSlideShow", "onActiveIndexChange"] }, { kind: "component", type: i0.forwardRef(() => GalleriaThumbnails), selector: "p-galleriaThumbnails", inputs: ["containerId", "value", "isVertical", "slideShowActive", "circular", "responsiveOptions", "contentHeight", "showThumbnailNavigators", "templates", "numVisible", "activeIndex"], outputs: ["onActiveIndexChange", "stopSlideShow"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaContent',
                    template: `
        <div
            [attr.id]="id"
            [attr.role]="'region'"
            *ngIf="value && value.length > 0"
            [ngClass]="{
                'p-galleria p-component': true,
                'p-galleria-fullscreen': this.galleria.fullScreen,
                'p-galleria-indicator-onitem': this.galleria.showIndicatorsOnItem,
                'p-galleria-item-nav-onhover': this.galleria.showItemNavigatorsOnHover && !this.galleria.fullScreen
            }"
            [ngStyle]="!galleria.fullScreen ? galleria.containerStyle : {}"
            [class]="galleriaClass()"
            pFocusTrap
            [pFocusTrapDisabled]="!fullScreen"
        >
            <button *ngIf="galleria.fullScreen" type="button" class="p-galleria-close p-link" (click)="maskHide.emit()" pRipple [attr.aria-label]="closeAriaLabel()" [attr.data-pc-section]="'closebutton'">
                <TimesIcon *ngIf="!galleria.closeIconTemplate" [styleClass]="'p-galleria-close-icon'" />
                <ng-template *ngTemplateOutlet="galleria.closeIconTemplate"></ng-template>
            </button>
            <div *ngIf="galleria.templates && galleria.headerFacet" class="p-galleria-header">
                <p-galleriaItemSlot type="header" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
            <div class="p-galleria-content" [attr.aria-live]="galleria.autoPlay ? 'polite' : 'off'">
                <p-galleriaItem
                    [id]="id"
                    [value]="value"
                    [activeIndex]="activeIndex"
                    [circular]="galleria.circular"
                    [templates]="galleria.templates"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [showIndicators]="galleria.showIndicators"
                    [changeItemOnIndicatorHover]="galleria.changeItemOnIndicatorHover"
                    [indicatorFacet]="galleria.indicatorFacet"
                    [captionFacet]="galleria.captionFacet"
                    [showItemNavigators]="galleria.showItemNavigators"
                    [autoPlay]="galleria.autoPlay"
                    [slideShowActive]="slideShowActive"
                    (startSlideShow)="startSlideShow()"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaItem>

                <p-galleriaThumbnails
                    *ngIf="galleria.showThumbnails"
                    [containerId]="id"
                    [value]="value"
                    (onActiveIndexChange)="onActiveIndexChange($event)"
                    [activeIndex]="activeIndex"
                    [templates]="galleria.templates"
                    [numVisible]="numVisible"
                    [responsiveOptions]="galleria.responsiveOptions"
                    [circular]="galleria.circular"
                    [isVertical]="isVertical()"
                    [contentHeight]="galleria.verticalThumbnailViewPortHeight"
                    [showThumbnailNavigators]="galleria.showThumbnailNavigators"
                    [slideShowActive]="slideShowActive"
                    (stopSlideShow)="stopSlideShow()"
                ></p-galleriaThumbnails>
            </div>
            <div *ngIf="galleria.templates && galleria.footerFacet" class="p-galleria-footer">
                <p-galleriaItemSlot type="footer" [templates]="galleria.templates"></p-galleriaItemSlot>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: () => [{ type: Galleria }, { type: i0.ChangeDetectorRef }, { type: i0.KeyValueDiffers }, { type: i1.PrimeNGConfig }, { type: i0.ElementRef }], propDecorators: { activeIndex: [{
                type: Input
            }], value: [{
                type: Input
            }], numVisible: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], fullScreen: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], maskHide: [{
                type: Output
            }], activeItemChange: [{
                type: Output
            }], closeButton: [{
                type: ViewChild,
                args: ['closeButton']
            }], handleFullscreenChange: [{
                type: HostListener,
                args: ['document:fullscreenchange', ['$event']]
            }] } });
export class GalleriaItemSlot {
    templates;
    index;
    get item() {
        return this._item;
    }
    set item(item) {
        this._item = item;
        if (this.templates) {
            this.templates.forEach((item) => {
                if (item.getType() === this.type) {
                    switch (this.type) {
                        case 'item':
                        case 'caption':
                        case 'thumbnail':
                            this.context = { $implicit: this.item };
                            this.contentTemplate = item.template;
                            break;
                    }
                }
            });
        }
    }
    type;
    contentTemplate;
    context;
    _item;
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            if (item.getType() === this.type) {
                switch (this.type) {
                    case 'item':
                    case 'caption':
                    case 'thumbnail':
                        this.context = { $implicit: this.item };
                        this.contentTemplate = item.template;
                        break;
                    case 'indicator':
                        this.context = { $implicit: this.index };
                        this.contentTemplate = item.template;
                        break;
                    default:
                        this.context = {};
                        this.contentTemplate = item.template;
                        break;
                }
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaItemSlot, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: GalleriaItemSlot, selector: "p-galleriaItemSlot", inputs: { templates: "templates", index: ["index", "index", numberAttribute], item: "item", type: "type" }, ngImport: i0, template: `
        <ng-container *ngIf="contentTemplate">
            <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaItemSlot, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaItemSlot',
                    template: `
        <ng-container *ngIf="contentTemplate">
            <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        </ng-container>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], propDecorators: { templates: [{
                type: Input
            }], index: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], item: [{
                type: Input
            }], type: [{
                type: Input
            }] } });
export class GalleriaItem {
    galleria;
    id;
    circular = false;
    value;
    showItemNavigators = false;
    showIndicators = true;
    slideShowActive = true;
    changeItemOnIndicatorHover = true;
    autoPlay = false;
    templates;
    indicatorFacet;
    captionFacet;
    startSlideShow = new EventEmitter();
    stopSlideShow = new EventEmitter();
    onActiveIndexChange = new EventEmitter();
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._activeIndex = activeIndex;
    }
    get activeItem() {
        return this.value && this.value[this._activeIndex];
    }
    _activeIndex = 0;
    leftButtonFocused = false;
    rightButtonFocused = false;
    constructor(galleria) {
        this.galleria = galleria;
    }
    ngOnChanges({ autoPlay }) {
        if (autoPlay?.currentValue) {
            this.startSlideShow.emit();
        }
        if (autoPlay && autoPlay.currentValue === false) {
            this.stopTheSlideShow();
        }
    }
    next() {
        let nextItemIndex = this.activeIndex + 1;
        let activeIndex = this.circular && this.value.length - 1 === this.activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }
    prev() {
        let prevItemIndex = this.activeIndex !== 0 ? this.activeIndex - 1 : 0;
        let activeIndex = this.circular && this.activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }
    onButtonFocus(pos) {
        if (pos === 'left') {
            this.leftButtonFocused = true;
        }
        else
            this.rightButtonFocused = true;
    }
    onButtonBlur(pos) {
        if (pos === 'left') {
            this.leftButtonFocused = false;
        }
        else
            this.rightButtonFocused = false;
    }
    stopTheSlideShow() {
        if (this.slideShowActive && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }
    navForward(e) {
        this.stopTheSlideShow();
        this.next();
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e) {
        this.stopTheSlideShow();
        this.prev();
        if (e && e.cancelable) {
            e.preventDefault();
        }
    }
    onIndicatorClick(index) {
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
    }
    onIndicatorMouseEnter(index) {
        if (this.changeItemOnIndicatorHover) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        }
    }
    onIndicatorKeyDown(event, index) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.stopTheSlideShow();
                this.onActiveIndexChange.emit(index);
                event.preventDefault();
                break;
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                break;
            default:
                break;
        }
    }
    isNavForwardDisabled() {
        return !this.circular && this.activeIndex === this.value.length - 1;
    }
    isNavBackwardDisabled() {
        return !this.circular && this.activeIndex === 0;
    }
    isIndicatorItemActive(index) {
        return this.activeIndex === index;
    }
    ariaSlideLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slide : undefined;
    }
    ariaSlideNumber(value) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slideNumber.replace(/{slideNumber}/g, value) : undefined;
    }
    ariaPageLabel(value) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel.replace(/{page}/g, value) : undefined;
    }
    ariaNextNavigationLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.next : undefined;
    }
    ariaPreviousNavigationLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.previous : undefined;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaItem, deps: [{ token: Galleria }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: GalleriaItem, selector: "p-galleriaItem", inputs: { id: "id", circular: ["circular", "circular", booleanAttribute], value: "value", showItemNavigators: ["showItemNavigators", "showItemNavigators", booleanAttribute], showIndicators: ["showIndicators", "showIndicators", booleanAttribute], slideShowActive: ["slideShowActive", "slideShowActive", booleanAttribute], changeItemOnIndicatorHover: ["changeItemOnIndicatorHover", "changeItemOnIndicatorHover", booleanAttribute], autoPlay: ["autoPlay", "autoPlay", booleanAttribute], templates: "templates", indicatorFacet: "indicatorFacet", captionFacet: "captionFacet", activeIndex: "activeIndex" }, outputs: { startSlideShow: "startSlideShow", stopSlideShow: "stopSlideShow", onActiveIndexChange: "onActiveIndexChange" }, usesOnChanges: true, ngImport: i0, template: `
        <div class="p-galleria-item-wrapper">
            <div class="p-galleria-item-container">
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-prev p-galleria-item-nav p-link': true, 'p-galleria-item-nav-focused': leftButtonFocused, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                    (focus)="onButtonFocus('left')"
                    (blur)="onButtonBlur('left')"
                    [attr.aria-label]="ariaPreviousNavigationLabel()"
                >
                    <ChevronLeftIcon *ngIf="!galleria.itemPreviousIconTemplate" [styleClass]="'p-galleria-item-prev-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate"></ng-template>
                </button>
                <div [id]="id + '_item_' + activeIndex" role="group" [attr.aria-label]="ariaSlideNumber(activeIndex + 1)" [attr.aria-roledescription]="ariaSlideLabel()" [style.width]="'100%'">
                    <p-galleriaItemSlot type="item" [item]="activeItem" [templates]="templates" class="p-galleria-item"></p-galleriaItemSlot>
                </div>
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-next p-galleria-item-nav p-link': true, 'p-galleria-item-nav-focused': rightButtonFocused, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                    (focus)="onButtonFocus('right')"
                    (blur)="onButtonBlur('right')"
                    [attr.aria-label]="ariaNextNavigationLabel()"
                >
                    <ChevronRightIcon *ngIf="!galleria.itemNextIconTemplate" [styleClass]="'p-galleria-item-next-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-caption" *ngIf="captionFacet">
                    <p-galleriaItemSlot type="caption" [item]="activeItem" [templates]="templates"></p-galleriaItemSlot>
                </div>
            </div>
            <ul *ngIf="showIndicators" class="p-galleria-indicators p-reset">
                <li
                    *ngFor="let item of value; let index = index"
                    tabindex="0"
                    (click)="onIndicatorClick(index)"
                    (mouseenter)="onIndicatorMouseEnter(index)"
                    (keydown)="onIndicatorKeyDown($event, index)"
                    [ngClass]="{ 'p-galleria-indicator': true, 'p-highlight': isIndicatorItemActive(index) }"
                    [attr.aria-label]="ariaPageLabel(index + 1)"
                    [attr.aria-selected]="activeIndex === index"
                    [attr.aria-controls]="id + '_item_' + index"
                >
                    <button type="button" tabIndex="-1" class="p-link" *ngIf="!indicatorFacet"></button>
                    <p-galleriaItemSlot type="indicator" [index]="index" [templates]="templates"></p-galleriaItemSlot>
                </li>
            </ul>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i3.Ripple), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(() => ChevronRightIcon), selector: "ChevronRightIcon" }, { kind: "component", type: i0.forwardRef(() => ChevronLeftIcon), selector: "ChevronLeftIcon" }, { kind: "component", type: i0.forwardRef(() => GalleriaItemSlot), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaItem',
                    template: `
        <div class="p-galleria-item-wrapper">
            <div class="p-galleria-item-container">
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-prev p-galleria-item-nav p-link': true, 'p-galleria-item-nav-focused': leftButtonFocused, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                    (focus)="onButtonFocus('left')"
                    (blur)="onButtonBlur('left')"
                    [attr.aria-label]="ariaPreviousNavigationLabel()"
                >
                    <ChevronLeftIcon *ngIf="!galleria.itemPreviousIconTemplate" [styleClass]="'p-galleria-item-prev-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemPreviousIconTemplate"></ng-template>
                </button>
                <div [id]="id + '_item_' + activeIndex" role="group" [attr.aria-label]="ariaSlideNumber(activeIndex + 1)" [attr.aria-roledescription]="ariaSlideLabel()" [style.width]="'100%'">
                    <p-galleriaItemSlot type="item" [item]="activeItem" [templates]="templates" class="p-galleria-item"></p-galleriaItemSlot>
                </div>
                <button
                    *ngIf="showItemNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-item-next p-galleria-item-nav p-link': true, 'p-galleria-item-nav-focused': rightButtonFocused, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                    (focus)="onButtonFocus('right')"
                    (blur)="onButtonBlur('right')"
                    [attr.aria-label]="ariaNextNavigationLabel()"
                >
                    <ChevronRightIcon *ngIf="!galleria.itemNextIconTemplate" [styleClass]="'p-galleria-item-next-icon'" />
                    <ng-template *ngTemplateOutlet="galleria.itemNextIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-caption" *ngIf="captionFacet">
                    <p-galleriaItemSlot type="caption" [item]="activeItem" [templates]="templates"></p-galleriaItemSlot>
                </div>
            </div>
            <ul *ngIf="showIndicators" class="p-galleria-indicators p-reset">
                <li
                    *ngFor="let item of value; let index = index"
                    tabindex="0"
                    (click)="onIndicatorClick(index)"
                    (mouseenter)="onIndicatorMouseEnter(index)"
                    (keydown)="onIndicatorKeyDown($event, index)"
                    [ngClass]="{ 'p-galleria-indicator': true, 'p-highlight': isIndicatorItemActive(index) }"
                    [attr.aria-label]="ariaPageLabel(index + 1)"
                    [attr.aria-selected]="activeIndex === index"
                    [attr.aria-controls]="id + '_item_' + index"
                >
                    <button type="button" tabIndex="-1" class="p-link" *ngIf="!indicatorFacet"></button>
                    <p-galleriaItemSlot type="indicator" [index]="index" [templates]="templates"></p-galleriaItemSlot>
                </li>
            </ul>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: () => [{ type: Galleria }], propDecorators: { id: [{
                type: Input
            }], circular: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], value: [{
                type: Input
            }], showItemNavigators: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showIndicators: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], slideShowActive: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], changeItemOnIndicatorHover: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autoPlay: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], templates: [{
                type: Input
            }], indicatorFacet: [{
                type: Input
            }], captionFacet: [{
                type: Input
            }], startSlideShow: [{
                type: Output
            }], stopSlideShow: [{
                type: Output
            }], onActiveIndexChange: [{
                type: Output
            }], activeIndex: [{
                type: Input
            }] } });
export class GalleriaThumbnails {
    galleria;
    document;
    platformId;
    renderer;
    cd;
    containerId;
    value;
    isVertical = false;
    slideShowActive = false;
    circular = false;
    responsiveOptions;
    contentHeight = '300px';
    showThumbnailNavigators = true;
    templates;
    onActiveIndexChange = new EventEmitter();
    stopSlideShow = new EventEmitter();
    itemsContainer;
    get numVisible() {
        return this._numVisible;
    }
    set numVisible(numVisible) {
        this._numVisible = numVisible;
        this._oldNumVisible = this.d_numVisible;
        this.d_numVisible = numVisible;
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(activeIndex) {
        this._oldactiveIndex = this._activeIndex;
        this._activeIndex = activeIndex;
    }
    index;
    startPos = null;
    thumbnailsStyle = null;
    sortedResponsiveOptions = null;
    totalShiftedItems = 0;
    page = 0;
    documentResizeListener;
    _numVisible = 0;
    d_numVisible = 0;
    _oldNumVisible = 0;
    _activeIndex = 0;
    _oldactiveIndex = 0;
    constructor(galleria, document, platformId, renderer, cd) {
        this.galleria = galleria;
        this.document = document;
        this.platformId = platformId;
        this.renderer = renderer;
        this.cd = cd;
    }
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.createStyle();
            if (this.responsiveOptions) {
                this.bindDocumentListeners();
            }
        }
    }
    ngAfterContentChecked() {
        let totalShiftedItems = this.totalShiftedItems;
        if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && this.itemsContainer) {
            if (this._activeIndex <= this.getMedianItemIndex()) {
                totalShiftedItems = 0;
            }
            else if (this.value.length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            }
            else if (this.value.length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex() + 1;
            }
            else {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex();
            }
            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }
            if (this.itemsContainer && this.itemsContainer.nativeElement) {
                this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            }
            if (this._oldactiveIndex !== this._activeIndex) {
                DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
                this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
            }
            this._oldactiveIndex = this._activeIndex;
            this._oldNumVisible = this.d_numVisible;
        }
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.calculatePosition();
        }
    }
    createStyle() {
        if (!this.thumbnailsStyle) {
            this.thumbnailsStyle = this.document.createElement('style');
            this.document.body.appendChild(this.thumbnailsStyle);
        }
        let innerHTML = `
            #${this.containerId} .p-galleria-thumbnail-item {
                flex: 1 0 ${100 / this.d_numVisible}%
            }
        `;
        if (this.responsiveOptions) {
            this.sortedResponsiveOptions = [...this.responsiveOptions];
            this.sortedResponsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result = null;
                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string')
                    result = value1.localeCompare(value2, undefined, { numeric: true });
                else
                    result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                return -1 * result;
            });
            for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                let res = this.sortedResponsiveOptions[i];
                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.containerId} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }
        this.thumbnailsStyle.innerHTML = innerHTML;
        DomHandler.setAttribute(this.thumbnailsStyle, 'nonce', this.galleria.config?.csp()?.nonce);
    }
    calculatePosition() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.itemsContainer && this.sortedResponsiveOptions) {
                let windowWidth = window.innerWidth;
                let matchedResponsiveData = {
                    numVisible: this._numVisible
                };
                for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    let res = this.sortedResponsiveOptions[i];
                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
                if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                    this.d_numVisible = matchedResponsiveData.numVisible;
                    this.cd.markForCheck();
                }
            }
        }
    }
    getTabIndex(index) {
        return this.isItemActive(index) ? 0 : null;
    }
    navForward(e) {
        this.stopTheSlideShow();
        let nextItemIndex = this._activeIndex + 1;
        if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || this.circular)) {
            this.step(-1);
        }
        let activeIndex = this.circular && this.value.length - 1 === this._activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    navBackward(e) {
        this.stopTheSlideShow();
        let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
        let diff = prevItemIndex + this.totalShiftedItems;
        if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || this.circular)) {
            this.step(1);
        }
        let activeIndex = this.circular && this._activeIndex === 0 ? this.value.length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onItemClick(index) {
        this.stopTheSlideShow();
        let selectedItemIndex = index;
        if (selectedItemIndex !== this._activeIndex) {
            const diff = selectedItemIndex + this.totalShiftedItems;
            let dir = 0;
            if (selectedItemIndex < this._activeIndex) {
                dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();
                if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
                    this.step(dir);
                }
            }
            else {
                dir = this.getMedianItemIndex() - diff;
                if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
                    this.step(dir);
                }
            }
            this.activeIndex = selectedItemIndex;
            this.onActiveIndexChange.emit(this.activeIndex);
        }
    }
    onThumbnailKeydown(event, index) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.onItemClick(index);
            event.preventDefault();
        }
        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;
            case 'ArrowLeft':
                this.onLeftKey();
                break;
            case 'Home':
                this.onHomeKey();
                event.preventDefault();
                break;
            case 'End':
                this.onEndKey();
                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                break;
            case 'Tab':
                this.onTabKey();
                break;
            default:
                break;
        }
    }
    onRightKey() {
        const indicators = DomHandler.find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
        const activeIndex = this.findFocusedIndicatorIndex();
        this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
    }
    onLeftKey() {
        const activeIndex = this.findFocusedIndicatorIndex();
        this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
    }
    onHomeKey() {
        const activeIndex = this.findFocusedIndicatorIndex();
        this.changedFocusedIndicator(activeIndex, 0);
    }
    onEndKey() {
        const indicators = DomHandler.find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
        const activeIndex = this.findFocusedIndicatorIndex();
        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }
    onTabKey() {
        const indicators = [...DomHandler.find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const highlightedIndex = indicators.findIndex((ind) => DomHandler.getAttribute(ind, 'data-p-active') === true);
        const activeIndicator = DomHandler.findSingle(this.itemsContainer.nativeElement, '[tabindex="0"]');
        const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);
        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }
    findFocusedIndicatorIndex() {
        const indicators = [...DomHandler.find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const activeIndicator = DomHandler.findSingle(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"] > [tabindex="0"]');
        return indicators.findIndex((ind) => ind === activeIndicator.parentElement);
    }
    changedFocusedIndicator(prevInd, nextInd) {
        const indicators = DomHandler.find(this.itemsContainer.nativeElement, '[data-pc-section="thumbnailitem"]');
        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }
    step(dir) {
        let totalShiftedItems = this.totalShiftedItems + dir;
        if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > this.value.length - 1) {
            totalShiftedItems = this.d_numVisible - this.value.length;
        }
        else if (dir > 0 && totalShiftedItems > 0) {
            totalShiftedItems = 0;
        }
        if (this.circular) {
            if (dir < 0 && this.value.length - 1 === this._activeIndex) {
                totalShiftedItems = 0;
            }
            else if (dir > 0 && this._activeIndex === 0) {
                totalShiftedItems = this.d_numVisible - this.value.length;
            }
        }
        if (this.itemsContainer) {
            DomHandler.removeClass(this.itemsContainer.nativeElement, 'p-items-hidden');
            this.itemsContainer.nativeElement.style.transform = this.isVertical ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            this.itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }
        this.totalShiftedItems = totalShiftedItems;
    }
    stopTheSlideShow() {
        if (this.slideShowActive && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }
    changePageOnTouch(e, diff) {
        if (diff < 0) {
            // left
            this.navForward(e);
        }
        else {
            // right
            this.navBackward(e);
        }
    }
    getTotalPageNumber() {
        return this.value.length > this.d_numVisible ? this.value.length - this.d_numVisible + 1 : 0;
    }
    getMedianItemIndex() {
        let index = Math.floor(this.d_numVisible / 2);
        return this.d_numVisible % 2 ? index : index - 1;
    }
    onTransitionEnd() {
        if (this.itemsContainer && this.itemsContainer.nativeElement) {
            DomHandler.addClass(this.itemsContainer.nativeElement, 'p-items-hidden');
            this.itemsContainer.nativeElement.style.transition = '';
        }
    }
    onTouchEnd(e) {
        let touchobj = e.changedTouches[0];
        if (this.isVertical) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        }
        else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }
    onTouchMove(e) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }
    onTouchStart(e) {
        let touchobj = e.changedTouches[0];
        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }
    isNavBackwardDisabled() {
        return (!this.circular && this._activeIndex === 0) || this.value.length <= this.d_numVisible;
    }
    isNavForwardDisabled() {
        return (!this.circular && this._activeIndex === this.value.length - 1) || this.value.length <= this.d_numVisible;
    }
    firstItemAciveIndex() {
        return this.totalShiftedItems * -1;
    }
    lastItemActiveIndex() {
        return this.firstItemAciveIndex() + this.d_numVisible - 1;
    }
    isItemActive(index) {
        return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
    }
    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView || 'window';
            this.documentResizeListener = this.renderer.listen(window, 'resize', () => {
                this.calculatePosition();
            });
        }
    }
    unbindDocumentListeners() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    ngOnDestroy() {
        if (this.responsiveOptions) {
            this.unbindDocumentListeners();
        }
        if (this.thumbnailsStyle) {
            this.thumbnailsStyle.parentNode?.removeChild(this.thumbnailsStyle);
        }
    }
    ariaPrevButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.prevPageLabel : undefined;
    }
    ariaNextButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.nextPageLabel : undefined;
    }
    ariaPageLabel(value) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel.replace(/{page}/g, value) : undefined;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaThumbnails, deps: [{ token: Galleria }, { token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: GalleriaThumbnails, selector: "p-galleriaThumbnails", inputs: { containerId: "containerId", value: "value", isVertical: ["isVertical", "isVertical", booleanAttribute], slideShowActive: ["slideShowActive", "slideShowActive", booleanAttribute], circular: ["circular", "circular", booleanAttribute], responsiveOptions: "responsiveOptions", contentHeight: "contentHeight", showThumbnailNavigators: "showThumbnailNavigators", templates: "templates", numVisible: "numVisible", activeIndex: "activeIndex" }, outputs: { onActiveIndexChange: "onActiveIndexChange", stopSlideShow: "stopSlideShow" }, viewQueries: [{ propertyName: "itemsContainer", first: true, predicate: ["itemsContainer"], descendants: true }], ngImport: i0, template: `
        <div class="p-galleria-thumbnail-wrapper">
            <div class="p-galleria-thumbnail-container">
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-thumbnail-prev p-link': true, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaPrevButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.previousThumbnailIconTemplate">
                        <ChevronLeftIcon *ngIf="!isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                        <ChevronUpIcon *ngIf="isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-thumbnail-items-container" [ngStyle]="{ height: isVertical ? contentHeight : '' }">
                    <div #itemsContainer class="p-galleria-thumbnail-items" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" role="tablist">
                        <div
                            *ngFor="let item of value; let index = index"
                            [ngClass]="{
                                'p-galleria-thumbnail-item': true,
                                'p-galleria-thumbnail-item-current': activeIndex === index,
                                'p-galleria-thumbnail-item-active': isItemActive(index),
                                'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index,
                                'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index
                            }"
                            [attr.aria-selected]="activeIndex === index"
                            [attr.aria-controls]="containerId + '_item_' + index"
                            [attr.data-pc-section]="'thumbnailitem'"
                            [attr.data-p-active]="activeIndex === index"
                            (keydown)="onThumbnailKeydown($event, index)"
                        >
                            <div
                                class="p-galleria-thumbnail-item-content"
                                [attr.tabindex]="activeIndex === index ? 0 : -1"
                                [attr.aria-current]="activeIndex === index ? 'page' : undefined"
                                [attr.aria-label]="ariaPageLabel(index + 1)"
                                (click)="onItemClick(index)"
                                (touchend)="onItemClick(index)"
                                (keydown.enter)="onItemClick(index)"
                            >
                                <p-galleriaItemSlot type="thumbnail" [item]="item" [templates]="templates"></p-galleriaItemSlot>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-thumbnail-next p-link': true, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaNextButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.nextThumbnailIconTemplate">
                        <ChevronRightIcon *ngIf="!isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                        <ChevronDownIcon *ngIf="isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i3.Ripple), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(() => ChevronRightIcon), selector: "ChevronRightIcon" }, { kind: "component", type: i0.forwardRef(() => ChevronLeftIcon), selector: "ChevronLeftIcon" }, { kind: "component", type: i0.forwardRef(() => GalleriaItemSlot), selector: "p-galleriaItemSlot", inputs: ["templates", "index", "item", "type"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaThumbnails, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-galleriaThumbnails',
                    template: `
        <div class="p-galleria-thumbnail-wrapper">
            <div class="p-galleria-thumbnail-container">
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-thumbnail-prev p-link': true, 'p-disabled': this.isNavBackwardDisabled() }"
                    (click)="navBackward($event)"
                    [disabled]="isNavBackwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaPrevButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.previousThumbnailIconTemplate">
                        <ChevronLeftIcon *ngIf="!isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                        <ChevronUpIcon *ngIf="isVertical" [styleClass]="'p-galleria-thumbnail-prev-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.previousThumbnailIconTemplate"></ng-template>
                </button>
                <div class="p-galleria-thumbnail-items-container" [ngStyle]="{ height: isVertical ? contentHeight : '' }">
                    <div #itemsContainer class="p-galleria-thumbnail-items" (transitionend)="onTransitionEnd()" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" role="tablist">
                        <div
                            *ngFor="let item of value; let index = index"
                            [ngClass]="{
                                'p-galleria-thumbnail-item': true,
                                'p-galleria-thumbnail-item-current': activeIndex === index,
                                'p-galleria-thumbnail-item-active': isItemActive(index),
                                'p-galleria-thumbnail-item-start': firstItemAciveIndex() === index,
                                'p-galleria-thumbnail-item-end': lastItemActiveIndex() === index
                            }"
                            [attr.aria-selected]="activeIndex === index"
                            [attr.aria-controls]="containerId + '_item_' + index"
                            [attr.data-pc-section]="'thumbnailitem'"
                            [attr.data-p-active]="activeIndex === index"
                            (keydown)="onThumbnailKeydown($event, index)"
                        >
                            <div
                                class="p-galleria-thumbnail-item-content"
                                [attr.tabindex]="activeIndex === index ? 0 : -1"
                                [attr.aria-current]="activeIndex === index ? 'page' : undefined"
                                [attr.aria-label]="ariaPageLabel(index + 1)"
                                (click)="onItemClick(index)"
                                (touchend)="onItemClick(index)"
                                (keydown.enter)="onItemClick(index)"
                            >
                                <p-galleriaItemSlot type="thumbnail" [item]="item" [templates]="templates"></p-galleriaItemSlot>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    *ngIf="showThumbnailNavigators"
                    type="button"
                    [ngClass]="{ 'p-galleria-thumbnail-next p-link': true, 'p-disabled': this.isNavForwardDisabled() }"
                    (click)="navForward($event)"
                    [disabled]="isNavForwardDisabled()"
                    pRipple
                    [attr.aria-label]="ariaNextButtonLabel()"
                >
                    <ng-container *ngIf="!galleria.nextThumbnailIconTemplate">
                        <ChevronRightIcon *ngIf="!isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                        <ChevronDownIcon *ngIf="isVertical" [ngClass]="'p-galleria-thumbnail-next-icon'" />
                    </ng-container>
                    <ng-template *ngTemplateOutlet="galleria.nextThumbnailIconTemplate"></ng-template>
                </button>
            </div>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: () => [{ type: Galleria }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }], propDecorators: { containerId: [{
                type: Input
            }], value: [{
                type: Input
            }], isVertical: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], slideShowActive: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], circular: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], responsiveOptions: [{
                type: Input
            }], contentHeight: [{
                type: Input
            }], showThumbnailNavigators: [{
                type: Input
            }], templates: [{
                type: Input
            }], onActiveIndexChange: [{
                type: Output
            }], stopSlideShow: [{
                type: Output
            }], itemsContainer: [{
                type: ViewChild,
                args: ['itemsContainer']
            }], numVisible: [{
                type: Input
            }], activeIndex: [{
                type: Input
            }] } });
export class GalleriaModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: GalleriaModule, declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails], imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, FocusTrapModule], exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaModule, imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, FocusTrapModule, CommonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: GalleriaModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, RippleModule, TimesIcon, ChevronRightIcon, ChevronLeftIcon, WindowMaximizeIcon, WindowMinimizeIcon, FocusTrapModule],
                    exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule],
                    declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvZ2FsbGVyaWEvZ2FsbGVyaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFrQixPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVFLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFHZixZQUFZLEVBQ1osWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsUUFBUSxFQUlSLE1BQU0sRUFDTixXQUFXLEVBS1gsU0FBUyxFQUNULGlCQUFpQixFQUNqQixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWlCLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFB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a0IsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQy9JLFlBQVksRUFBaUYsWUFBWTs7MkZBRzFHLGNBQWM7a0JBTDFCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUM7b0JBQzFKLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxZQUFZLENBQUM7b0JBQ3BILFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixDQUFDO2lCQUNoRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFuaW1hdGlvbkV2ZW50LCBhbmltYXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBEb0NoZWNrLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEhvc3RMaXN0ZW5lcixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgS2V5VmFsdWVEaWZmZXJzLFxuICAgIE5nTW9kdWxlLFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE91dHB1dCxcbiAgICBQTEFURk9STV9JRCxcbiAgICBRdWVyeUxpc3QsXG4gICAgUmVuZGVyZXIyLFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIGJvb2xlYW5BdHRyaWJ1dGUsXG4gICAgbnVtYmVyQXR0cmlidXRlXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVOR0NvbmZpZywgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgRG9tSGFuZGxlciB9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7IENoZXZyb25MZWZ0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvY2hldnJvbmxlZnQnO1xuaW1wb3J0IHsgQ2hldnJvblJpZ2h0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvY2hldnJvbnJpZ2h0JztcbmltcG9ydCB7IFRpbWVzSWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvdGltZXMnO1xuaW1wb3J0IHsgV2luZG93TWF4aW1pemVJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy93aW5kb3dtYXhpbWl6ZSc7XG5pbXBvcnQgeyBXaW5kb3dNaW5pbWl6ZUljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL3dpbmRvd21pbmltaXplJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IFZvaWRMaXN0ZW5lciB9IGZyb20gJ3ByaW1lbmcvdHMtaGVscGVycyc7XG5pbXBvcnQgeyBVbmlxdWVDb21wb25lbnRJZCwgWkluZGV4VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IEdhbGxlcmlhUmVzcG9uc2l2ZU9wdGlvbnMgfSBmcm9tICcuL2dhbGxlcmlhLmludGVyZmFjZSc7XG5pbXBvcnQgeyBGb2N1c1RyYXBNb2R1bGUgfSBmcm9tICdwcmltZW5nL2ZvY3VzdHJhcCc7XG4vKipcbiAqIEdhbGxlcmlhIGlzIGFuIGFkdmFuY2VkIGNvbnRlbnQgZ2FsbGVyeSBjb21wb25lbnQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZ2FsbGVyaWEnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgKm5nSWY9XCJmdWxsU2NyZWVuOyBlbHNlIHdpbmRvd2VkXCIgI2NvbnRhaW5lcj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAqbmdJZj1cIm1hc2tWaXNpYmxlXCJcbiAgICAgICAgICAgICAgICAjbWFza1xuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZ2FsbGVyaWEtbWFzayBwLWNvbXBvbmVudC1vdmVybGF5IHAtY29tcG9uZW50LW92ZXJsYXktZW50ZXInOiB0cnVlLCAncC1nYWxsZXJpYS12aXNpYmxlJzogdGhpcy52aXNpYmxlIH1cIlxuICAgICAgICAgICAgICAgIFtjbGFzc109XCJtYXNrQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFthdHRyLnJvbGVdPVwiZnVsbFNjcmVlbiA/ICdkaWFsb2cnIDogJ3JlZ2lvbidcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbW9kYWxdPVwiZnVsbFNjcmVlbiA/ICd0cnVlJyA6IHVuZGVmaW5lZFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHAtZ2FsbGVyaWFDb250ZW50XG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwidmlzaWJsZVwiXG4gICAgICAgICAgICAgICAgICAgIFtAYW5pbWF0aW9uXT1cInsgdmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7IHNob3dUcmFuc2l0aW9uUGFyYW1zOiBzaG93VHJhbnNpdGlvbk9wdGlvbnMsIGhpZGVUcmFuc2l0aW9uUGFyYW1zOiBoaWRlVHJhbnNpdGlvbk9wdGlvbnMgfSB9XCJcbiAgICAgICAgICAgICAgICAgICAgKEBhbmltYXRpb24uc3RhcnQpPVwib25BbmltYXRpb25TdGFydCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKEBhbmltYXRpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICAgICAgICAgICAgICAgICAgW2FjdGl2ZUluZGV4XT1cImFjdGl2ZUluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgW251bVZpc2libGVdPVwibnVtVmlzaWJsZUxpbWl0IHx8IG51bVZpc2libGVcIlxuICAgICAgICAgICAgICAgICAgICAobWFza0hpZGUpPVwib25NYXNrSGlkZSgpXCJcbiAgICAgICAgICAgICAgICAgICAgKGFjdGl2ZUl0ZW1DaGFuZ2UpPVwib25BY3RpdmVJdGVtQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJjb250YWluZXJTdHlsZVwiXG4gICAgICAgICAgICAgICAgICAgIFtmdWxsU2NyZWVuXT1cImZ1bGxTY3JlZW5cIlxuICAgICAgICAgICAgICAgID48L3AtZ2FsbGVyaWFDb250ZW50PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjd2luZG93ZWQ+XG4gICAgICAgICAgICA8cC1nYWxsZXJpYUNvbnRlbnQgW3ZhbHVlXT1cInZhbHVlXCIgW2FjdGl2ZUluZGV4XT1cImFjdGl2ZUluZGV4XCIgW251bVZpc2libGVdPVwibnVtVmlzaWJsZUxpbWl0IHx8IG51bVZpc2libGVcIiAoYWN0aXZlSXRlbUNoYW5nZSk9XCJvbkFjdGl2ZUl0ZW1DaGFuZ2UoJGV2ZW50KVwiPjwvcC1nYWxsZXJpYUNvbnRlbnQ+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ2FuaW1hdGlvbicsIFtcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gdmlzaWJsZScsIFtzdHlsZSh7IHRyYW5zZm9ybTogJ3NjYWxlKDAuNyknLCBvcGFjaXR5OiAwIH0pLCBhbmltYXRlKCd7e3Nob3dUcmFuc2l0aW9uUGFyYW1zfX0nKV0pLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA9PiB2b2lkJywgW2FuaW1hdGUoJ3t7aGlkZVRyYW5zaXRpb25QYXJhbXN9fScsIHN0eWxlKHsgdHJhbnNmb3JtOiAnc2NhbGUoMC43KScsIG9wYWNpdHk6IDAgfSkpXSlcbiAgICAgICAgXSlcbiAgICBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vZ2FsbGVyaWEuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEdhbGxlcmlhIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAgIC8qKlxuICAgICAqIEluZGV4IG9mIHRoZSBmaXJzdCBpdGVtLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGdldCBhY3RpdmVJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSW5kZXg7XG4gICAgfVxuICAgIHNldCBhY3RpdmVJbmRleChhY3RpdmVJbmRleCkge1xuICAgICAgICB0aGlzLl9hY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgdGhlIGNvbXBvbmVudCBvbiBmdWxsc2NyZWVuLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBmdWxsU2NyZWVuOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogVW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIGVsZW1lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBvYmplY3RzIHRvIGRpc3BsYXkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdmFsdWU6IGFueVtdIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBpdGVtcyBwZXIgcGFnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSBudW1WaXNpYmxlOiBudW1iZXIgPSAzO1xuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIG9wdGlvbnMgZm9yIHJlc3BvbnNpdmUgZGVzaWduLlxuICAgICAqIEBzZWUge0dhbGxlcmlhUmVzcG9uc2l2ZU9wdGlvbnN9XG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgcmVzcG9uc2l2ZU9wdGlvbnM6IEdhbGxlcmlhUmVzcG9uc2l2ZU9wdGlvbnNbXSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgbmF2aWdhdGlvbiBidXR0b25zIGluIGl0ZW0gc2VjdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd0l0ZW1OYXZpZ2F0b3JzOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IG5hdmlnYXRpb24gYnV0dG9ucyBpbiB0aHVtYm5haWwgY29udGFpbmVyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzaG93VGh1bWJuYWlsTmF2aWdhdG9yczogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IG5hdmlnYXRpb24gYnV0dG9ucyBvbiBpdGVtIGhvdmVyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzaG93SXRlbU5hdmlnYXRvcnNPbkhvdmVyOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogV2hlbiBlbmFibGVkLCBpdGVtIGlzIGNoYW5nZWQgb24gaW5kaWNhdG9yIGhvdmVyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjaGFuZ2VJdGVtT25JbmRpY2F0b3JIb3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgaWYgc2Nyb2xsaW5nIHdvdWxkIGJlIGluZmluaXRlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjaXJjdWxhcjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIEl0ZW1zIGFyZSBkaXNwbGF5ZWQgd2l0aCBhIHNsaWRlc2hvdyBpbiBhdXRvUGxheSBtb2RlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBhdXRvUGxheTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIFdoZW4gZW5hYmxlZCwgYXV0b3J1biBzaG91bGQgc3RvcCBieSBjbGljay5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvdWxkU3RvcEF1dG9wbGF5QnlDbGljazogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gc2Nyb2xsIGl0ZW1zLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlIH0pIHRyYW5zaXRpb25JbnRlcnZhbDogbnVtYmVyID0gNDAwMDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgdGh1bWJuYWlsIGNvbnRhaW5lci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd1RodW1ibmFpbHM6IGJvb2xlYW4gPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIFBvc2l0aW9uIG9mIHRodW1ibmFpbHMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdGh1bWJuYWlsc1Bvc2l0aW9uOiAnYm90dG9tJyB8ICd0b3AnIHwgJ2xlZnQnIHwgJ3JpZ2h0JyB8IHVuZGVmaW5lZCA9ICdib3R0b20nO1xuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgdmlld3BvcnQgaW4gdmVydGljYWwgdGh1bWJuYWlsLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHZlcnRpY2FsVGh1bWJuYWlsVmlld1BvcnRIZWlnaHQ6IHN0cmluZyA9ICczMDBweCc7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBkaXNwbGF5IGluZGljYXRvciBjb250YWluZXIuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHNob3dJbmRpY2F0b3JzOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogV2hlbiBlbmFibGVkLCBpbmRpY2F0b3IgY29udGFpbmVyIGlzIGRpc3BsYXllZCBvbiBpdGVtIGNvbnRhaW5lci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd0luZGljYXRvcnNPbkl0ZW06IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBQb3NpdGlvbiBvZiBpbmRpY2F0b3JzLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGluZGljYXRvcnNQb3NpdGlvbjogJ2JvdHRvbScgfCAndG9wJyB8ICdsZWZ0JyB8ICdyaWdodCcgfCB1bmRlZmluZWQgPSAnYm90dG9tJztcbiAgICAvKipcbiAgICAgKiBCYXNlIHpJbmRleCB2YWx1ZSB0byB1c2UgaW4gbGF5ZXJpbmcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgYmFzZVpJbmRleDogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgbWFzayBvbiBmdWxsc2NyZWVuIG1vZGUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbWFza0NsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudCBvbiBmdWxsc2NyZWVuIG1vZGUuIE90aGVyd2lzZSwgdGhlICdjbGFzcycgcHJvcGVydHkgY2FuIGJlIHVzZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgY29udGFpbmVyQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGNvbXBvbmVudCBvbiBmdWxsc2NyZWVuIG1vZGUuIE90aGVyd2lzZSwgdGhlICdzdHlsZScgcHJvcGVydHkgY2FuIGJlIHVzZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgY29udGFpbmVyU3R5bGU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbiBvcHRpb25zIG9mIHRoZSBzaG93IGFuaW1hdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzaG93VHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG4gICAgLyoqXG4gICAgICogVHJhbnNpdGlvbiBvcHRpb25zIG9mIHRoZSBoaWRlIGFuaW1hdGlvbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBoaWRlVHJhbnNpdGlvbk9wdGlvbnM6IHN0cmluZyA9ICcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKSc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBtYXNrIG9uIGZ1bGxzY3JlZW4gbW9kZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gICAgfVxuICAgIHNldCB2aXNpYmxlKHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHZpc2libGU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUgJiYgIXRoaXMubWFza1Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMubWFza1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiBhY3RpdmUgaW5kZXggY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBBY3RpdmUgaW5kZXguXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIGFjdGl2ZUluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSBvbiB2aXNpYmxpdHkgY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbGVhbiAtIFZpc2libGUgdmFsdWUuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIHZpc2libGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAgIEBWaWV3Q2hpbGQoJ21hc2snKSBtYXNrOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJykgY29udGFpbmVyOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPiB8IHVuZGVmaW5lZDtcblxuICAgIF92aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfYWN0aXZlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBoZWFkZXJGYWNldDogYW55O1xuXG4gICAgZm9vdGVyRmFjZXQ6IGFueTtcblxuICAgIGluZGljYXRvckZhY2V0OiBhbnk7XG5cbiAgICBjYXB0aW9uRmFjZXQ6IGFueTtcblxuICAgIGNsb3NlSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgcHJldmlvdXNUaHVtYm5haWxJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBuZXh0VGh1bWJuYWlsSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgaXRlbVByZXZpb3VzSWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgaXRlbU5leHRJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBtYXNrVmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgbnVtVmlzaWJsZUxpbWl0ID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcHVibGljIHBsYXRmb3JtSWQ6IGFueSxcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWdcbiAgICApIHt9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzPy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oZWFkZXJGYWNldCA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZm9vdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb290ZXJGYWNldCA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaW5kaWNhdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3JGYWNldCA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY2xvc2VpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZUljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbW5leHRpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtTmV4dEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbXByZXZpb3VzaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVByZXZpb3VzSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwcmV2aW91c3RodW1ibmFpbGljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzVGh1bWJuYWlsSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICduZXh0dGh1bWJuYWlsaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRodW1ibmFpbEljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY2FwdGlvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FwdGlvbkZhY2V0ID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZXMudmFsdWUgJiYgc2ltcGxlQ2hhbmdlcy52YWx1ZS5jdXJyZW50VmFsdWU/Lmxlbmd0aCA8IHRoaXMubnVtVmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5udW1WaXNpYmxlTGltaXQgPSBzaW1wbGVDaGFuZ2VzLnZhbHVlLmN1cnJlbnRWYWx1ZS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm51bVZpc2libGVMaW1pdCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1hc2tIaWRlKCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52aXNpYmxlQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgIH1cblxuICAgIG9uQWN0aXZlSXRlbUNoYW5nZShpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUluZGV4ICE9PSBpbmRleCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleENoYW5nZS5lbWl0KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQW5pbWF0aW9uU3RhcnQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndmlzaWJsZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNb2RhbGl0eSgpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmZvY3VzKERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LCAnW2RhdGEtcGMtc2VjdGlvbj1cImNsb3NlYnV0dG9uXCJdJykpO1xuICAgICAgICAgICAgICAgIH0sIDI1KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAndm9pZCc6XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLm1hc2s/Lm5hdGl2ZUVsZW1lbnQsICdwLWNvbXBvbmVudC1vdmVybGF5LWxlYXZlJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVNb2RhbGl0eSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlTW9kYWxpdHkoKSB7XG4gICAgICAgIERvbUhhbmRsZXIuYmxvY2tCb2R5U2Nyb2xsKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFzaykge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuc2V0KCdtb2RhbCcsIHRoaXMubWFzay5uYXRpdmVFbGVtZW50LCB0aGlzLmJhc2VaSW5kZXggfHwgdGhpcy5jb25maWcuekluZGV4Lm1vZGFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVNb2RhbGl0eSgpIHtcbiAgICAgICAgRG9tSGFuZGxlci51bmJsb2NrQm9keVNjcm9sbCgpO1xuICAgICAgICB0aGlzLm1hc2tWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubWFzaykge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5tYXNrLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmZ1bGxTY3JlZW4pIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kb2N1bWVudC5ib2R5LCAncC1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1hc2spIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZU1vZGFsaXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1nYWxsZXJpYUNvbnRlbnQnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgIFthdHRyLmlkXT1cImlkXCJcbiAgICAgICAgICAgIFthdHRyLnJvbGVdPVwiJ3JlZ2lvbidcIlxuICAgICAgICAgICAgKm5nSWY9XCJ2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC1nYWxsZXJpYSBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ3AtZ2FsbGVyaWEtZnVsbHNjcmVlbic6IHRoaXMuZ2FsbGVyaWEuZnVsbFNjcmVlbixcbiAgICAgICAgICAgICAgICAncC1nYWxsZXJpYS1pbmRpY2F0b3Itb25pdGVtJzogdGhpcy5nYWxsZXJpYS5zaG93SW5kaWNhdG9yc09uSXRlbSxcbiAgICAgICAgICAgICAgICAncC1nYWxsZXJpYS1pdGVtLW5hdi1vbmhvdmVyJzogdGhpcy5nYWxsZXJpYS5zaG93SXRlbU5hdmlnYXRvcnNPbkhvdmVyICYmICF0aGlzLmdhbGxlcmlhLmZ1bGxTY3JlZW5cbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwiIWdhbGxlcmlhLmZ1bGxTY3JlZW4gPyBnYWxsZXJpYS5jb250YWluZXJTdHlsZSA6IHt9XCJcbiAgICAgICAgICAgIFtjbGFzc109XCJnYWxsZXJpYUNsYXNzKClcIlxuICAgICAgICAgICAgcEZvY3VzVHJhcFxuICAgICAgICAgICAgW3BGb2N1c1RyYXBEaXNhYmxlZF09XCIhZnVsbFNjcmVlblwiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJnYWxsZXJpYS5mdWxsU2NyZWVuXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicC1nYWxsZXJpYS1jbG9zZSBwLWxpbmtcIiAoY2xpY2spPVwibWFza0hpZGUuZW1pdCgpXCIgcFJpcHBsZSBbYXR0ci5hcmlhLWxhYmVsXT1cImNsb3NlQXJpYUxhYmVsKClcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2Nsb3NlYnV0dG9uJ1wiPlxuICAgICAgICAgICAgICAgIDxUaW1lc0ljb24gKm5nSWY9XCIhZ2FsbGVyaWEuY2xvc2VJY29uVGVtcGxhdGVcIiBbc3R5bGVDbGFzc109XCIncC1nYWxsZXJpYS1jbG9zZS1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwiZ2FsbGVyaWEuY2xvc2VJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiZ2FsbGVyaWEudGVtcGxhdGVzICYmIGdhbGxlcmlhLmhlYWRlckZhY2V0XCIgY2xhc3M9XCJwLWdhbGxlcmlhLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgIDxwLWdhbGxlcmlhSXRlbVNsb3QgdHlwZT1cImhlYWRlclwiIFt0ZW1wbGF0ZXNdPVwiZ2FsbGVyaWEudGVtcGxhdGVzXCI+PC9wLWdhbGxlcmlhSXRlbVNsb3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWdhbGxlcmlhLWNvbnRlbnRcIiBbYXR0ci5hcmlhLWxpdmVdPVwiZ2FsbGVyaWEuYXV0b1BsYXkgPyAncG9saXRlJyA6ICdvZmYnXCI+XG4gICAgICAgICAgICAgICAgPHAtZ2FsbGVyaWFJdGVtXG4gICAgICAgICAgICAgICAgICAgIFtpZF09XCJpZFwiXG4gICAgICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJ2YWx1ZVwiXG4gICAgICAgICAgICAgICAgICAgIFthY3RpdmVJbmRleF09XCJhY3RpdmVJbmRleFwiXG4gICAgICAgICAgICAgICAgICAgIFtjaXJjdWxhcl09XCJnYWxsZXJpYS5jaXJjdWxhclwiXG4gICAgICAgICAgICAgICAgICAgIFt0ZW1wbGF0ZXNdPVwiZ2FsbGVyaWEudGVtcGxhdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgKG9uQWN0aXZlSW5kZXhDaGFuZ2UpPVwib25BY3RpdmVJbmRleENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW3Nob3dJbmRpY2F0b3JzXT1cImdhbGxlcmlhLnNob3dJbmRpY2F0b3JzXCJcbiAgICAgICAgICAgICAgICAgICAgW2NoYW5nZUl0ZW1PbkluZGljYXRvckhvdmVyXT1cImdhbGxlcmlhLmNoYW5nZUl0ZW1PbkluZGljYXRvckhvdmVyXCJcbiAgICAgICAgICAgICAgICAgICAgW2luZGljYXRvckZhY2V0XT1cImdhbGxlcmlhLmluZGljYXRvckZhY2V0XCJcbiAgICAgICAgICAgICAgICAgICAgW2NhcHRpb25GYWNldF09XCJnYWxsZXJpYS5jYXB0aW9uRmFjZXRcIlxuICAgICAgICAgICAgICAgICAgICBbc2hvd0l0ZW1OYXZpZ2F0b3JzXT1cImdhbGxlcmlhLnNob3dJdGVtTmF2aWdhdG9yc1wiXG4gICAgICAgICAgICAgICAgICAgIFthdXRvUGxheV09XCJnYWxsZXJpYS5hdXRvUGxheVwiXG4gICAgICAgICAgICAgICAgICAgIFtzbGlkZVNob3dBY3RpdmVdPVwic2xpZGVTaG93QWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgKHN0YXJ0U2xpZGVTaG93KT1cInN0YXJ0U2xpZGVTaG93KClcIlxuICAgICAgICAgICAgICAgICAgICAoc3RvcFNsaWRlU2hvdyk9XCJzdG9wU2xpZGVTaG93KClcIlxuICAgICAgICAgICAgICAgID48L3AtZ2FsbGVyaWFJdGVtPlxuXG4gICAgICAgICAgICAgICAgPHAtZ2FsbGVyaWFUaHVtYm5haWxzXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiZ2FsbGVyaWEuc2hvd1RodW1ibmFpbHNcIlxuICAgICAgICAgICAgICAgICAgICBbY29udGFpbmVySWRdPVwiaWRcIlxuICAgICAgICAgICAgICAgICAgICBbdmFsdWVdPVwidmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAob25BY3RpdmVJbmRleENoYW5nZSk9XCJvbkFjdGl2ZUluZGV4Q2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbYWN0aXZlSW5kZXhdPVwiYWN0aXZlSW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICBbdGVtcGxhdGVzXT1cImdhbGxlcmlhLnRlbXBsYXRlc1wiXG4gICAgICAgICAgICAgICAgICAgIFtudW1WaXNpYmxlXT1cIm51bVZpc2libGVcIlxuICAgICAgICAgICAgICAgICAgICBbcmVzcG9uc2l2ZU9wdGlvbnNdPVwiZ2FsbGVyaWEucmVzcG9uc2l2ZU9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICBbY2lyY3VsYXJdPVwiZ2FsbGVyaWEuY2lyY3VsYXJcIlxuICAgICAgICAgICAgICAgICAgICBbaXNWZXJ0aWNhbF09XCJpc1ZlcnRpY2FsKClcIlxuICAgICAgICAgICAgICAgICAgICBbY29udGVudEhlaWdodF09XCJnYWxsZXJpYS52ZXJ0aWNhbFRodW1ibmFpbFZpZXdQb3J0SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgW3Nob3dUaHVtYm5haWxOYXZpZ2F0b3JzXT1cImdhbGxlcmlhLnNob3dUaHVtYm5haWxOYXZpZ2F0b3JzXCJcbiAgICAgICAgICAgICAgICAgICAgW3NsaWRlU2hvd0FjdGl2ZV09XCJzbGlkZVNob3dBY3RpdmVcIlxuICAgICAgICAgICAgICAgICAgICAoc3RvcFNsaWRlU2hvdyk9XCJzdG9wU2xpZGVTaG93KClcIlxuICAgICAgICAgICAgICAgID48L3AtZ2FsbGVyaWFUaHVtYm5haWxzPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiZ2FsbGVyaWEudGVtcGxhdGVzICYmIGdhbGxlcmlhLmZvb3RlckZhY2V0XCIgY2xhc3M9XCJwLWdhbGxlcmlhLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgIDxwLWdhbGxlcmlhSXRlbVNsb3QgdHlwZT1cImZvb3RlclwiIFt0ZW1wbGF0ZXNdPVwiZ2FsbGVyaWEudGVtcGxhdGVzXCI+PC9wLWdhbGxlcmlhSXRlbVNsb3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBHYWxsZXJpYUNvbnRlbnQgaW1wbGVtZW50cyBEb0NoZWNrIHtcbiAgICBASW5wdXQoKSBnZXQgYWN0aXZlSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUluZGV4O1xuICAgIH1cbiAgICBzZXQgYWN0aXZlSW5kZXgoYWN0aXZlSW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9hY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnlbXSA9IFtdO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgbnVtVmlzaWJsZTogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGZ1bGxTY3JlZW46IGJvb2xlYW47XG5cbiAgICBAT3V0cHV0KCkgbWFza0hpZGU6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBhY3RpdmVJdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2Nsb3NlQnV0dG9uJykgY2xvc2VCdXR0b246IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XG5cbiAgICBpZDogc3RyaW5nO1xuXG4gICAgX2FjdGl2ZUluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgc2xpZGVTaG93QWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIGludGVydmFsOiBhbnk7XG5cbiAgICBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBwcml2YXRlIGRpZmZlcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBnYWxsZXJpYTogR2FsbGVyaWEsXG4gICAgICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuICAgICAgICBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLFxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWZcbiAgICApIHtcbiAgICAgICAgdGhpcy5pZCA9IHRoaXMuZ2FsbGVyaWEuaWQgfHwgVW5pcXVlQ29tcG9uZW50SWQoKTtcbiAgICAgICAgdGhpcy5kaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmdhbGxlcmlhKS5jcmVhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgY3VzdG9tIGZ1bGxzY3JlZW5cbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpmdWxsc2NyZWVuY2hhbmdlJywgWyckZXZlbnQnXSlcbiAgICBoYW5kbGVGdWxsc2NyZWVuQ2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoZG9jdW1lbnQ/LmZ1bGxzY3JlZW5FbGVtZW50ID09PSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudD8uY2hpbGRyZW5bMF0pIHtcbiAgICAgICAgICAgIHRoaXMuZnVsbFNjcmVlbiA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZ1bGxTY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuZ2FsbGVyaWEucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmRpZmZlci5kaWZmKHRoaXMuZ2FsbGVyaWEgYXMgdW5rbm93biBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgICAgICAgICBpZiAoY2hhbmdlcyAmJiBjaGFuZ2VzLmZvckVhY2hJdGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHdlIGNoYW5nZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgcGFyZW50IGNvbXBvbmVudCxcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIGNoaWxkcmVuIHRha2Ugb3VyIGVudGl0eSBmcm9tIHRoZSBpbmplY3Rvci5cbiAgICAgICAgICAgICAgICAvLyBXZSBjYW4gdGVsbCB0aGUgY2hpbGRyZW4gdG8gcmVkcmF3IHRoZW1zZWx2ZXMgd2hlbiB3ZSBjaGFuZ2UgdGhlIHByb3BlcnRpZXMgb2YgdGhlIHBhcmVudCBjb21wb25lbnQuXG4gICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSBhbiBvblB1c2ggc3RyYXRlZ3lcbiAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2FsbGVyaWFDbGFzcygpIHtcbiAgICAgICAgY29uc3QgdGh1bWJuYWlsc1Bvc0NsYXNzID0gdGhpcy5nYWxsZXJpYS5zaG93VGh1bWJuYWlscyAmJiB0aGlzLmdldFBvc2l0aW9uQ2xhc3MoJ3AtZ2FsbGVyaWEtdGh1bWJuYWlscycsIHRoaXMuZ2FsbGVyaWEudGh1bWJuYWlsc1Bvc2l0aW9uIGFzIHN0cmluZyk7XG4gICAgICAgIGNvbnN0IGluZGljYXRvclBvc0NsYXNzID0gdGhpcy5nYWxsZXJpYS5zaG93SW5kaWNhdG9ycyAmJiB0aGlzLmdldFBvc2l0aW9uQ2xhc3MoJ3AtZ2FsbGVyaWEtaW5kaWNhdG9ycycsIHRoaXMuZ2FsbGVyaWEuaW5kaWNhdG9yc1Bvc2l0aW9uIGFzIHN0cmluZyk7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLmdhbGxlcmlhLmNvbnRhaW5lckNsYXNzID8gdGhpcy5nYWxsZXJpYS5jb250YWluZXJDbGFzcyArICcgJyA6ICcnKSArICh0aHVtYm5haWxzUG9zQ2xhc3MgPyB0aHVtYm5haWxzUG9zQ2xhc3MgKyAnICcgOiAnJykgKyAoaW5kaWNhdG9yUG9zQ2xhc3MgPyBpbmRpY2F0b3JQb3NDbGFzcyArICcgJyA6ICcnKTtcbiAgICB9XG5cbiAgICBzdGFydFNsaWRlU2hvdygpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuZ2FsbGVyaWEucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFjdGl2ZUluZGV4ID0gdGhpcy5nYWxsZXJpYS5jaXJjdWxhciAmJiB0aGlzLnZhbHVlLmxlbmd0aCAtIDEgPT09IHRoaXMuYWN0aXZlSW5kZXggPyAwIDogdGhpcy5hY3RpdmVJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlKGFjdGl2ZUluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXg7XG4gICAgICAgICAgICB9LCB0aGlzLmdhbGxlcmlhLnRyYW5zaXRpb25JbnRlcnZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMuc2xpZGVTaG93QWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3BTbGlkZVNob3coKSB7XG4gICAgICAgIGlmICh0aGlzLmdhbGxlcmlhLmF1dG9QbGF5ICYmICF0aGlzLmdhbGxlcmlhLnNob3VsZFN0b3BBdXRvcGxheUJ5Q2xpY2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZVNob3dBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXRQb3NpdGlvbkNsYXNzKHByZUNsYXNzTmFtZTogc3RyaW5nLCBwb3NpdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IFsndG9wJywgJ2xlZnQnLCAnYm90dG9tJywgJ3JpZ2h0J107XG4gICAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9ucy5maW5kKChpdGVtKSA9PiBpdGVtID09PSBwb3NpdGlvbik7XG5cbiAgICAgICAgcmV0dXJuIHBvcyA/IGAke3ByZUNsYXNzTmFtZX0tJHtwb3N9YCA6ICcnO1xuICAgIH1cblxuICAgIGlzVmVydGljYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbGxlcmlhLnRodW1ibmFpbHNQb3NpdGlvbiA9PT0gJ2xlZnQnIHx8IHRoaXMuZ2FsbGVyaWEudGh1bWJuYWlsc1Bvc2l0aW9uID09PSAncmlnaHQnO1xuICAgIH1cblxuICAgIG9uQWN0aXZlSW5kZXhDaGFuZ2UoaW5kZXg6IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVJbmRleCAhPT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlSW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvc2VBcmlhTGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhID8gdGhpcy5jb25maWcudHJhbnNsYXRpb24uYXJpYS5jbG9zZSA6IHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1nYWxsZXJpYUl0ZW1TbG90JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29udGVudFRlbXBsYXRlXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiBjb250ZXh0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgR2FsbGVyaWFJdGVtU2xvdCB7XG4gICAgQElucHV0KCkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSBpbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgQElucHV0KCkgZ2V0IGl0ZW0oKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW07XG4gICAgfVxuXG4gICAgc2V0IGl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIHRoaXMuX2l0ZW0gPSBpdGVtO1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5nZXRUeXBlKCkgPT09IHRoaXMudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjYXB0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RodW1ibmFpbCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0geyAkaW1wbGljaXQ6IHRoaXMuaXRlbSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgY29udGV4dDogYW55O1xuXG4gICAgX2l0ZW06IGFueTtcblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmdldFR5cGUoKSA9PT0gdGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NhcHRpb24nOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICd0aHVtYm5haWwnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0geyAkaW1wbGljaXQ6IHRoaXMuaXRlbSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaW5kaWNhdG9yJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IHsgJGltcGxpY2l0OiB0aGlzLmluZGV4IH07XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0ID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWdhbGxlcmlhSXRlbScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtZ2FsbGVyaWEtaXRlbS13cmFwcGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1nYWxsZXJpYS1pdGVtLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93SXRlbU5hdmlnYXRvcnNcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1nYWxsZXJpYS1pdGVtLXByZXYgcC1nYWxsZXJpYS1pdGVtLW5hdiBwLWxpbmsnOiB0cnVlLCAncC1nYWxsZXJpYS1pdGVtLW5hdi1mb2N1c2VkJzogbGVmdEJ1dHRvbkZvY3VzZWQsICdwLWRpc2FibGVkJzogdGhpcy5pc05hdkJhY2t3YXJkRGlzYWJsZWQoKSB9XCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm5hdkJhY2t3YXJkKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNOYXZCYWNrd2FyZERpc2FibGVkKClcIlxuICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIChmb2N1cyk9XCJvbkJ1dHRvbkZvY3VzKCdsZWZ0JylcIlxuICAgICAgICAgICAgICAgICAgICAoYmx1cik9XCJvbkJ1dHRvbkJsdXIoJ2xlZnQnKVwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYVByZXZpb3VzTmF2aWdhdGlvbkxhYmVsKClcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0SWNvbiAqbmdJZj1cIiFnYWxsZXJpYS5pdGVtUHJldmlvdXNJY29uVGVtcGxhdGVcIiBbc3R5bGVDbGFzc109XCIncC1nYWxsZXJpYS1pdGVtLXByZXYtaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJnYWxsZXJpYS5pdGVtUHJldmlvdXNJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxkaXYgW2lkXT1cImlkICsgJ19pdGVtXycgKyBhY3RpdmVJbmRleFwiIHJvbGU9XCJncm91cFwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYVNsaWRlTnVtYmVyKGFjdGl2ZUluZGV4ICsgMSlcIiBbYXR0ci5hcmlhLXJvbGVkZXNjcmlwdGlvbl09XCJhcmlhU2xpZGVMYWJlbCgpXCIgW3N0eWxlLndpZHRoXT1cIicxMDAlJ1wiPlxuICAgICAgICAgICAgICAgICAgICA8cC1nYWxsZXJpYUl0ZW1TbG90IHR5cGU9XCJpdGVtXCIgW2l0ZW1dPVwiYWN0aXZlSXRlbVwiIFt0ZW1wbGF0ZXNdPVwidGVtcGxhdGVzXCIgY2xhc3M9XCJwLWdhbGxlcmlhLWl0ZW1cIj48L3AtZ2FsbGVyaWFJdGVtU2xvdD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0l0ZW1OYXZpZ2F0b3JzXCJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZ2FsbGVyaWEtaXRlbS1uZXh0IHAtZ2FsbGVyaWEtaXRlbS1uYXYgcC1saW5rJzogdHJ1ZSwgJ3AtZ2FsbGVyaWEtaXRlbS1uYXYtZm9jdXNlZCc6IHJpZ2h0QnV0dG9uRm9jdXNlZCwgJ3AtZGlzYWJsZWQnOiB0aGlzLmlzTmF2Rm9yd2FyZERpc2FibGVkKCkgfVwiXG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJuYXZGb3J3YXJkKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNOYXZGb3J3YXJkRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgKGZvY3VzKT1cIm9uQnV0dG9uRm9jdXMoJ3JpZ2h0JylcIlxuICAgICAgICAgICAgICAgICAgICAoYmx1cik9XCJvbkJ1dHRvbkJsdXIoJ3JpZ2h0JylcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFOZXh0TmF2aWdhdGlvbkxhYmVsKClcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb24gKm5nSWY9XCIhZ2FsbGVyaWEuaXRlbU5leHRJY29uVGVtcGxhdGVcIiBbc3R5bGVDbGFzc109XCIncC1nYWxsZXJpYS1pdGVtLW5leHQtaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJnYWxsZXJpYS5pdGVtTmV4dEljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZ2FsbGVyaWEtY2FwdGlvblwiICpuZ0lmPVwiY2FwdGlvbkZhY2V0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxwLWdhbGxlcmlhSXRlbVNsb3QgdHlwZT1cImNhcHRpb25cIiBbaXRlbV09XCJhY3RpdmVJdGVtXCIgW3RlbXBsYXRlc109XCJ0ZW1wbGF0ZXNcIj48L3AtZ2FsbGVyaWFJdGVtU2xvdD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHVsICpuZ0lmPVwic2hvd0luZGljYXRvcnNcIiBjbGFzcz1cInAtZ2FsbGVyaWEtaW5kaWNhdG9ycyBwLXJlc2V0XCI+XG4gICAgICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIHZhbHVlOyBsZXQgaW5kZXggPSBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkluZGljYXRvckNsaWNrKGluZGV4KVwiXG4gICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uSW5kaWNhdG9yTW91c2VFbnRlcihpbmRleClcIlxuICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbkluZGljYXRvcktleURvd24oJGV2ZW50LCBpbmRleClcIlxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWdhbGxlcmlhLWluZGljYXRvcic6IHRydWUsICdwLWhpZ2hsaWdodCc6IGlzSW5kaWNhdG9ySXRlbUFjdGl2ZShpbmRleCkgfVwiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYVBhZ2VMYWJlbChpbmRleCArIDEpXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJhY3RpdmVJbmRleCA9PT0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImlkICsgJ19pdGVtXycgKyBpbmRleFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB0YWJJbmRleD1cIi0xXCIgY2xhc3M9XCJwLWxpbmtcIiAqbmdJZj1cIiFpbmRpY2F0b3JGYWNldFwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8cC1nYWxsZXJpYUl0ZW1TbG90IHR5cGU9XCJpbmRpY2F0b3JcIiBbaW5kZXhdPVwiaW5kZXhcIiBbdGVtcGxhdGVzXT1cInRlbXBsYXRlc1wiPjwvcC1nYWxsZXJpYUl0ZW1TbG90PlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIEdhbGxlcmlhSXRlbSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gICAgQElucHV0KCkgaWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjaXJjdWxhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgdmFsdWU6IGFueVtdIHwgdW5kZWZpbmVkO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHNob3dJdGVtTmF2aWdhdG9yczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHNob3dJbmRpY2F0b3JzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzbGlkZVNob3dBY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGNoYW5nZUl0ZW1PbkluZGljYXRvckhvdmVyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBhdXRvUGxheTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoKSBpbmRpY2F0b3JGYWNldDogYW55O1xuXG4gICAgQElucHV0KCkgY2FwdGlvbkZhY2V0OiBhbnk7XG5cbiAgICBAT3V0cHV0KCkgc3RhcnRTbGlkZVNob3c6IEV2ZW50RW1pdHRlcjxFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgc3RvcFNsaWRlU2hvdzogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkFjdGl2ZUluZGV4Q2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBJbnB1dCgpIGdldCBhY3RpdmVJbmRleCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSW5kZXg7XG4gICAgfVxuXG4gICAgc2V0IGFjdGl2ZUluZGV4KGFjdGl2ZUluZGV4KSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluZGV4ID0gYWN0aXZlSW5kZXg7XG4gICAgfVxuXG4gICAgZ2V0IGFjdGl2ZUl0ZW0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlICYmIHRoaXMudmFsdWVbdGhpcy5fYWN0aXZlSW5kZXhdO1xuICAgIH1cblxuICAgIF9hY3RpdmVJbmRleDogbnVtYmVyID0gMDtcblxuICAgIGxlZnRCdXR0b25Gb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICByaWdodEJ1dHRvbkZvY3VzZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBnYWxsZXJpYTogR2FsbGVyaWEpIHt9XG5cbiAgICBuZ09uQ2hhbmdlcyh7IGF1dG9QbGF5IH06IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGF1dG9QbGF5Py5jdXJyZW50VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRTbGlkZVNob3cuZW1pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF1dG9QbGF5ICYmIGF1dG9QbGF5LmN1cnJlbnRWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFRoZVNsaWRlU2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dCgpIHtcbiAgICAgICAgbGV0IG5leHRJdGVtSW5kZXggPSB0aGlzLmFjdGl2ZUluZGV4ICsgMTtcbiAgICAgICAgbGV0IGFjdGl2ZUluZGV4ID0gdGhpcy5jaXJjdWxhciAmJiAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aCAtIDEgPT09IHRoaXMuYWN0aXZlSW5kZXggPyAwIDogbmV4dEl0ZW1JbmRleDtcbiAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoYWN0aXZlSW5kZXgpO1xuICAgIH1cblxuICAgIHByZXYoKSB7XG4gICAgICAgIGxldCBwcmV2SXRlbUluZGV4ID0gdGhpcy5hY3RpdmVJbmRleCAhPT0gMCA/IHRoaXMuYWN0aXZlSW5kZXggLSAxIDogMDtcbiAgICAgICAgbGV0IGFjdGl2ZUluZGV4ID0gdGhpcy5jaXJjdWxhciAmJiB0aGlzLmFjdGl2ZUluZGV4ID09PSAwID8gKDxhbnlbXT50aGlzLnZhbHVlKS5sZW5ndGggLSAxIDogcHJldkl0ZW1JbmRleDtcbiAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoYWN0aXZlSW5kZXgpO1xuICAgIH1cblxuICAgIG9uQnV0dG9uRm9jdXMocG9zOiAnbGVmdCcgfCAncmlnaHQnKSB7XG4gICAgICAgIGlmIChwb3MgPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgdGhpcy5sZWZ0QnV0dG9uRm9jdXNlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB0aGlzLnJpZ2h0QnV0dG9uRm9jdXNlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25CdXR0b25CbHVyKHBvczogJ2xlZnQnIHwgJ3JpZ2h0Jykge1xuICAgICAgICBpZiAocG9zID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIHRoaXMubGVmdEJ1dHRvbkZvY3VzZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHRoaXMucmlnaHRCdXR0b25Gb2N1c2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RvcFRoZVNsaWRlU2hvdygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2xpZGVTaG93QWN0aXZlICYmIHRoaXMuc3RvcFNsaWRlU2hvdykge1xuICAgICAgICAgICAgdGhpcy5zdG9wU2xpZGVTaG93LmVtaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5hdkZvcndhcmQoZTogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLnN0b3BUaGVTbGlkZVNob3coKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG5cbiAgICAgICAgaWYgKGUgJiYgZS5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZCYWNrd2FyZChlOiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3RvcFRoZVNsaWRlU2hvdygpO1xuICAgICAgICB0aGlzLnByZXYoKTtcblxuICAgICAgICBpZiAoZSAmJiBlLmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5kaWNhdG9yQ2xpY2soaW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLnN0b3BUaGVTbGlkZVNob3coKTtcbiAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoaW5kZXgpO1xuICAgIH1cblxuICAgIG9uSW5kaWNhdG9yTW91c2VFbnRlcihpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYW5nZUl0ZW1PbkluZGljYXRvckhvdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaGVTbGlkZVNob3coKTtcbiAgICAgICAgICAgIHRoaXMub25BY3RpdmVJbmRleENoYW5nZS5lbWl0KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5kaWNhdG9yS2V5RG93bihldmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BUaGVTbGlkZVNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWN0aXZlSW5kZXhDaGFuZ2UuZW1pdChpbmRleCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc05hdkZvcndhcmREaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNpcmN1bGFyICYmIHRoaXMuYWN0aXZlSW5kZXggPT09ICg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gMTtcbiAgICB9XG5cbiAgICBpc05hdkJhY2t3YXJkRGlzYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jaXJjdWxhciAmJiB0aGlzLmFjdGl2ZUluZGV4ID09PSAwO1xuICAgIH1cblxuICAgIGlzSW5kaWNhdG9ySXRlbUFjdGl2ZShpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUluZGV4ID09PSBpbmRleDtcbiAgICB9XG5cbiAgICBhcmlhU2xpZGVMYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEgPyB0aGlzLmdhbGxlcmlhLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhLnNsaWRlIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFyaWFTbGlkZU51bWJlcih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYWxsZXJpYS5jb25maWcudHJhbnNsYXRpb24uYXJpYSA/IHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEuc2xpZGVOdW1iZXIucmVwbGFjZSgve3NsaWRlTnVtYmVyfS9nLCB2YWx1ZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJpYVBhZ2VMYWJlbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYWxsZXJpYS5jb25maWcudHJhbnNsYXRpb24uYXJpYSA/IHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEucGFnZUxhYmVsLnJlcGxhY2UoL3twYWdlfS9nLCB2YWx1ZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJpYU5leHROYXZpZ2F0aW9uTGFiZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbGxlcmlhLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhID8gdGhpcy5nYWxsZXJpYS5jb25maWcudHJhbnNsYXRpb24uYXJpYS5uZXh0IDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGFyaWFQcmV2aW91c05hdmlnYXRpb25MYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEgPyB0aGlzLmdhbGxlcmlhLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhLnByZXZpb3VzIDogdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWdhbGxlcmlhVGh1bWJuYWlscycsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInAtZ2FsbGVyaWEtdGh1bWJuYWlsLXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWdhbGxlcmlhLXRodW1ibmFpbC1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd1RodW1ibmFpbE5hdmlnYXRvcnNcIlxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1nYWxsZXJpYS10aHVtYm5haWwtcHJldiBwLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IHRoaXMuaXNOYXZCYWNrd2FyZERpc2FibGVkKCkgfVwiXG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJuYXZCYWNrd2FyZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImlzTmF2QmFja3dhcmREaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFQcmV2QnV0dG9uTGFiZWwoKVwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWdhbGxlcmlhLnByZXZpb3VzVGh1bWJuYWlsSWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvbkxlZnRJY29uICpuZ0lmPVwiIWlzVmVydGljYWxcIiBbc3R5bGVDbGFzc109XCIncC1nYWxsZXJpYS10aHVtYm5haWwtcHJldi1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvblVwSWNvbiAqbmdJZj1cImlzVmVydGljYWxcIiBbc3R5bGVDbGFzc109XCIncC1nYWxsZXJpYS10aHVtYm5haWwtcHJldi1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJnYWxsZXJpYS5wcmV2aW91c1RodW1ibmFpbEljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtZ2FsbGVyaWEtdGh1bWJuYWlsLWl0ZW1zLWNvbnRhaW5lclwiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBpc1ZlcnRpY2FsID8gY29udGVudEhlaWdodCA6ICcnIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAjaXRlbXNDb250YWluZXIgY2xhc3M9XCJwLWdhbGxlcmlhLXRodW1ibmFpbC1pdGVtc1wiICh0cmFuc2l0aW9uZW5kKT1cIm9uVHJhbnNpdGlvbkVuZCgpXCIgKHRvdWNoc3RhcnQpPVwib25Ub3VjaFN0YXJ0KCRldmVudClcIiAodG91Y2htb3ZlKT1cIm9uVG91Y2hNb3ZlKCRldmVudClcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIHZhbHVlOyBsZXQgaW5kZXggPSBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncC1nYWxsZXJpYS10aHVtYm5haWwtaXRlbSc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWdhbGxlcmlhLXRodW1ibmFpbC1pdGVtLWN1cnJlbnQnOiBhY3RpdmVJbmRleCA9PT0gaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWdhbGxlcmlhLXRodW1ibmFpbC1pdGVtLWFjdGl2ZSc6IGlzSXRlbUFjdGl2ZShpbmRleCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwLWdhbGxlcmlhLXRodW1ibmFpbC1pdGVtLXN0YXJ0JzogZmlyc3RJdGVtQWNpdmVJbmRleCgpID09PSBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3AtZ2FsbGVyaWEtdGh1bWJuYWlsLWl0ZW0tZW5kJzogbGFzdEl0ZW1BY3RpdmVJbmRleCgpID09PSBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiYWN0aXZlSW5kZXggPT09IGluZGV4XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImNvbnRhaW5lcklkICsgJ19pdGVtXycgKyBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIid0aHVtYm5haWxpdGVtJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wLWFjdGl2ZV09XCJhY3RpdmVJbmRleCA9PT0gaW5kZXhcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uVGh1bWJuYWlsS2V5ZG93bigkZXZlbnQsIGluZGV4KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtZ2FsbGVyaWEtdGh1bWJuYWlsLWl0ZW0tY29udGVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImFjdGl2ZUluZGV4ID09PSBpbmRleCA/IDAgOiAtMVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtY3VycmVudF09XCJhY3RpdmVJbmRleCA9PT0gaW5kZXggPyAncGFnZScgOiB1bmRlZmluZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFQYWdlTGFiZWwoaW5kZXggKyAxKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkl0ZW1DbGljayhpbmRleClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG91Y2hlbmQpPVwib25JdGVtQ2xpY2soaW5kZXgpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25JdGVtQ2xpY2soaW5kZXgpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwLWdhbGxlcmlhSXRlbVNsb3QgdHlwZT1cInRodW1ibmFpbFwiIFtpdGVtXT1cIml0ZW1cIiBbdGVtcGxhdGVzXT1cInRlbXBsYXRlc1wiPjwvcC1nYWxsZXJpYUl0ZW1TbG90PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93VGh1bWJuYWlsTmF2aWdhdG9yc1wiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWdhbGxlcmlhLXRodW1ibmFpbC1uZXh0IHAtbGluayc6IHRydWUsICdwLWRpc2FibGVkJzogdGhpcy5pc05hdkZvcndhcmREaXNhYmxlZCgpIH1cIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwibmF2Rm9yd2FyZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImlzTmF2Rm9yd2FyZERpc2FibGVkKClcIlxuICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYU5leHRCdXR0b25MYWJlbCgpXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhZ2FsbGVyaWEubmV4dFRodW1ibmFpbEljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodEljb24gKm5nSWY9XCIhaXNWZXJ0aWNhbFwiIFtuZ0NsYXNzXT1cIidwLWdhbGxlcmlhLXRodW1ibmFpbC1uZXh0LWljb24nXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaGV2cm9uRG93bkljb24gKm5nSWY9XCJpc1ZlcnRpY2FsXCIgW25nQ2xhc3NdPVwiJ3AtZ2FsbGVyaWEtdGh1bWJuYWlsLW5leHQtaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwiZ2FsbGVyaWEubmV4dFRodW1ibmFpbEljb25UZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBHYWxsZXJpYVRodW1ibmFpbHMgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgY29udGFpbmVySWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIEBJbnB1dCgpIHZhbHVlOiBhbnlbXSB8IHVuZGVmaW5lZDtcblxuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBpc1ZlcnRpY2FsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2xpZGVTaG93QWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgY2lyY3VsYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmVPcHRpb25zOiBHYWxsZXJpYVJlc3BvbnNpdmVPcHRpb25zW10gfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoKSBjb250ZW50SGVpZ2h0OiBzdHJpbmcgPSAnMzAwcHgnO1xuXG4gICAgQElucHV0KCkgc2hvd1RodW1ibmFpbE5hdmlnYXRvcnMgPSB0cnVlO1xuXG4gICAgQElucHV0KCkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBAT3V0cHV0KCkgb25BY3RpdmVJbmRleENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgc3RvcFNsaWRlU2hvdzogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJykgaXRlbXNDb250YWluZXI6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoKSBnZXQgbnVtVmlzaWJsZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVmlzaWJsZTtcbiAgICB9XG5cbiAgICBzZXQgbnVtVmlzaWJsZShudW1WaXNpYmxlKSB7XG4gICAgICAgIHRoaXMuX251bVZpc2libGUgPSBudW1WaXNpYmxlO1xuICAgICAgICB0aGlzLl9vbGROdW1WaXNpYmxlID0gdGhpcy5kX251bVZpc2libGU7XG4gICAgICAgIHRoaXMuZF9udW1WaXNpYmxlID0gbnVtVmlzaWJsZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYWN0aXZlSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUluZGV4O1xuICAgIH1cblxuICAgIHNldCBhY3RpdmVJbmRleChhY3RpdmVJbmRleCkge1xuICAgICAgICB0aGlzLl9vbGRhY3RpdmVJbmRleCA9IHRoaXMuX2FjdGl2ZUluZGV4O1xuICAgICAgICB0aGlzLl9hY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgIH1cblxuICAgIGluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBzdGFydFBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG5cbiAgICB0aHVtYm5haWxzU3R5bGU6IEhUTUxTdHlsZUVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIHNvcnRlZFJlc3BvbnNpdmVPcHRpb25zOiBHYWxsZXJpYVJlc3BvbnNpdmVPcHRpb25zW10gfCBudWxsID0gbnVsbDtcblxuICAgIHRvdGFsU2hpZnRlZEl0ZW1zOiBudW1iZXIgPSAwO1xuXG4gICAgcGFnZTogbnVtYmVyID0gMDtcblxuICAgIGRvY3VtZW50UmVzaXplTGlzdGVuZXI6IFZvaWRMaXN0ZW5lcjtcblxuICAgIF9udW1WaXNpYmxlOiBudW1iZXIgPSAwO1xuXG4gICAgZF9udW1WaXNpYmxlOiBudW1iZXIgPSAwO1xuXG4gICAgX29sZE51bVZpc2libGU6IG51bWJlciA9IDA7XG5cbiAgICBfYWN0aXZlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBfb2xkYWN0aXZlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGdhbGxlcmlhOiBHYWxsZXJpYSxcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsXG4gICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogYW55LFxuICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICAgKSB7fVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAgICAgbGV0IHRvdGFsU2hpZnRlZEl0ZW1zID0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcztcblxuICAgICAgICBpZiAoKHRoaXMuX29sZE51bVZpc2libGUgIT09IHRoaXMuZF9udW1WaXNpYmxlIHx8IHRoaXMuX29sZGFjdGl2ZUluZGV4ICE9PSB0aGlzLl9hY3RpdmVJbmRleCkgJiYgdGhpcy5pdGVtc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZUluZGV4IDw9IHRoaXMuZ2V0TWVkaWFuSXRlbUluZGV4KCkpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gdGhpcy5kX251bVZpc2libGUgKyB0aGlzLmdldE1lZGlhbkl0ZW1JbmRleCgpIDwgdGhpcy5fYWN0aXZlSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMuZF9udW1WaXNpYmxlIC0gKDxhbnlbXT50aGlzLnZhbHVlKS5sZW5ndGg7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gdGhpcy5kX251bVZpc2libGUgPCB0aGlzLl9hY3RpdmVJbmRleCAmJiB0aGlzLmRfbnVtVmlzaWJsZSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMuX2FjdGl2ZUluZGV4ICogLTEgKyB0aGlzLmdldE1lZGlhbkl0ZW1JbmRleCgpICsgMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSB0aGlzLl9hY3RpdmVJbmRleCAqIC0xICsgdGhpcy5nZXRNZWRpYW5JdGVtSW5kZXgoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRvdGFsU2hpZnRlZEl0ZW1zICE9PSB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA9IHRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0NvbnRhaW5lciAmJiB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdGhpcy5pc1ZlcnRpY2FsID8gYHRyYW5zbGF0ZTNkKDAsICR7dG90YWxTaGlmdGVkSXRlbXMgKiAoMTAwIC8gdGhpcy5kX251bVZpc2libGUpfSUsIDApYCA6IGB0cmFuc2xhdGUzZCgke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMCAvIHRoaXMuZF9udW1WaXNpYmxlKX0lLCAwLCAwKWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbGRhY3RpdmVJbmRleCAhPT0gdGhpcy5fYWN0aXZlSW5kZXgpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudCwgJ3AtaXRlbXMtaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDUwMG1zIGVhc2UgMHMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9vbGRhY3RpdmVJbmRleCA9IHRoaXMuX2FjdGl2ZUluZGV4O1xuICAgICAgICAgICAgdGhpcy5fb2xkTnVtVmlzaWJsZSA9IHRoaXMuZF9udW1WaXNpYmxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU3R5bGUoKSB7XG4gICAgICAgIGlmICghdGhpcy50aHVtYm5haWxzU3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMudGh1bWJuYWlsc1N0eWxlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGh1bWJuYWlsc1N0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAjJHt0aGlzLmNvbnRhaW5lcklkfSAucC1nYWxsZXJpYS10aHVtYm5haWwtaXRlbSB7XG4gICAgICAgICAgICAgICAgZmxleDogMSAwICR7MTAwIC8gdGhpcy5kX251bVZpc2libGV9JVxuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuXG4gICAgICAgIGlmICh0aGlzLnJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnRlZFJlc3BvbnNpdmVPcHRpb25zID0gWy4uLnRoaXMucmVzcG9uc2l2ZU9wdGlvbnNdO1xuICAgICAgICAgICAgdGhpcy5zb3J0ZWRSZXNwb25zaXZlT3B0aW9ucy5zb3J0KChkYXRhMSwgZGF0YTIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZTEgPSBkYXRhMS5icmVha3BvaW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlMiA9IGRhdGEyLmJyZWFrcG9pbnQ7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUxID09IG51bGwgJiYgdmFsdWUyICE9IG51bGwpIHJlc3VsdCA9IC0xO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlMSAhPSBudWxsICYmIHZhbHVlMiA9PSBudWxsKSByZXN1bHQgPSAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlMSA9PSBudWxsICYmIHZhbHVlMiA9PSBudWxsKSByZXN1bHQgPSAwO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZTEgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZTIgPT09ICdzdHJpbmcnKSByZXN1bHQgPSB2YWx1ZTEubG9jYWxlQ29tcGFyZSh2YWx1ZTIsIHVuZGVmaW5lZCwgeyBudW1lcmljOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0ID0gdmFsdWUxIDwgdmFsdWUyID8gLTEgOiB2YWx1ZTEgPiB2YWx1ZTIgPyAxIDogMDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAtMSAqIHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc29ydGVkUmVzcG9uc2l2ZU9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzID0gdGhpcy5zb3J0ZWRSZXNwb25zaXZlT3B0aW9uc1tpXTtcblxuICAgICAgICAgICAgICAgIGlubmVySFRNTCArPSBgXG4gICAgICAgICAgICAgICAgICAgIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6ICR7cmVzLmJyZWFrcG9pbnR9KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAjJHt0aGlzLmNvbnRhaW5lcklkfSAucC1nYWxsZXJpYS10aHVtYm5haWwtaXRlbSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMSAwICR7MTAwIC8gcmVzLm51bVZpc2libGV9JVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGh1bWJuYWlsc1N0eWxlLmlubmVySFRNTCA9IGlubmVySFRNTDtcbiAgICAgICAgRG9tSGFuZGxlci5zZXRBdHRyaWJ1dGUodGhpcy50aHVtYm5haWxzU3R5bGUsICdub25jZScsIHRoaXMuZ2FsbGVyaWEuY29uZmlnPy5jc3AoKT8ubm9uY2UpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVBvc2l0aW9uKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNDb250YWluZXIgJiYgdGhpcy5zb3J0ZWRSZXNwb25zaXZlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkUmVzcG9uc2l2ZURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIG51bVZpc2libGU6IHRoaXMuX251bVZpc2libGVcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNvcnRlZFJlc3BvbnNpdmVPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSB0aGlzLnNvcnRlZFJlc3BvbnNpdmVPcHRpb25zW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChyZXMuYnJlYWtwb2ludCwgMTApID49IHdpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUmVzcG9uc2l2ZURhdGEgPSByZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kX251bVZpc2libGUgIT09IG1hdGNoZWRSZXNwb25zaXZlRGF0YS5udW1WaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZF9udW1WaXNpYmxlID0gbWF0Y2hlZFJlc3BvbnNpdmVEYXRhLm51bVZpc2libGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0VGFiSW5kZXgoaW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0l0ZW1BY3RpdmUoaW5kZXgpID8gMCA6IG51bGw7XG4gICAgfVxuXG4gICAgbmF2Rm9yd2FyZChlOiBUb3VjaEV2ZW50IHwgTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLnN0b3BUaGVTbGlkZVNob3coKTtcblxuICAgICAgICBsZXQgbmV4dEl0ZW1JbmRleCA9IHRoaXMuX2FjdGl2ZUluZGV4ICsgMTtcbiAgICAgICAgaWYgKG5leHRJdGVtSW5kZXggKyB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zID4gdGhpcy5nZXRNZWRpYW5JdGVtSW5kZXgoKSAmJiAoLTEgKiB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zIDwgdGhpcy5nZXRUb3RhbFBhZ2VOdW1iZXIoKSAtIDEgfHwgdGhpcy5jaXJjdWxhcikpIHtcbiAgICAgICAgICAgIHRoaXMuc3RlcCgtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aXZlSW5kZXggPSB0aGlzLmNpcmN1bGFyICYmICg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gMSA9PT0gdGhpcy5fYWN0aXZlSW5kZXggPyAwIDogbmV4dEl0ZW1JbmRleDtcbiAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQoYWN0aXZlSW5kZXgpO1xuXG4gICAgICAgIGlmIChlLmNhbmNlbGFibGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5hdkJhY2t3YXJkKGU6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuc3RvcFRoZVNsaWRlU2hvdygpO1xuXG4gICAgICAgIGxldCBwcmV2SXRlbUluZGV4ID0gdGhpcy5fYWN0aXZlSW5kZXggIT09IDAgPyB0aGlzLl9hY3RpdmVJbmRleCAtIDEgOiAwO1xuICAgICAgICBsZXQgZGlmZiA9IHByZXZJdGVtSW5kZXggKyB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICBpZiAodGhpcy5kX251bVZpc2libGUgLSBkaWZmIC0gMSA+IHRoaXMuZ2V0TWVkaWFuSXRlbUluZGV4KCkgJiYgKC0xICogdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gMCB8fCB0aGlzLmNpcmN1bGFyKSkge1xuICAgICAgICAgICAgdGhpcy5zdGVwKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGl2ZUluZGV4ID0gdGhpcy5jaXJjdWxhciAmJiB0aGlzLl9hY3RpdmVJbmRleCA9PT0gMCA/ICg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gMSA6IHByZXZJdGVtSW5kZXg7XG4gICAgICAgIHRoaXMub25BY3RpdmVJbmRleENoYW5nZS5lbWl0KGFjdGl2ZUluZGV4KTtcblxuICAgICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc3RvcFRoZVNsaWRlU2hvdygpO1xuXG4gICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleCA9IGluZGV4O1xuICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggIT09IHRoaXMuX2FjdGl2ZUluZGV4KSB7XG4gICAgICAgICAgICBjb25zdCBkaWZmID0gc2VsZWN0ZWRJdGVtSW5kZXggKyB0aGlzLnRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgICAgICAgICAgbGV0IGRpciA9IDA7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtSW5kZXggPCB0aGlzLl9hY3RpdmVJbmRleCkge1xuICAgICAgICAgICAgICAgIGRpciA9IHRoaXMuZF9udW1WaXNpYmxlIC0gZGlmZiAtIDEgLSB0aGlzLmdldE1lZGlhbkl0ZW1JbmRleCgpO1xuICAgICAgICAgICAgICAgIGlmIChkaXIgPiAwICYmIC0xICogdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0ZXAoZGlyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpciA9IHRoaXMuZ2V0TWVkaWFuSXRlbUluZGV4KCkgLSBkaWZmO1xuICAgICAgICAgICAgICAgIGlmIChkaXIgPCAwICYmIC0xICogdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA8IHRoaXMuZ2V0VG90YWxQYWdlTnVtYmVyKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcChkaXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IHNlbGVjdGVkSXRlbUluZGV4O1xuICAgICAgICAgICAgdGhpcy5vbkFjdGl2ZUluZGV4Q2hhbmdlLmVtaXQodGhpcy5hY3RpdmVJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRodW1ibmFpbEtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50LmNvZGUgPT09ICdFbnRlcicgfHwgZXZlbnQuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgdGhpcy5vbkl0ZW1DbGljayhpbmRleCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChldmVudC5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmlnaHRLZXkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uTGVmdEtleSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdIb21lJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uSG9tZUtleSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0VuZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkVuZEtleSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdUYWInOlxuICAgICAgICAgICAgICAgIHRoaXMub25UYWJLZXkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uUmlnaHRLZXkoKSB7XG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LCAnW2RhdGEtcGMtc2VjdGlvbj1cInRodW1ibmFpbGl0ZW1cIl0nKTtcbiAgICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSB0aGlzLmZpbmRGb2N1c2VkSW5kaWNhdG9ySW5kZXgoKTtcblxuICAgICAgICB0aGlzLmNoYW5nZWRGb2N1c2VkSW5kaWNhdG9yKGFjdGl2ZUluZGV4LCBhY3RpdmVJbmRleCArIDEgPT09IGluZGljYXRvcnMubGVuZ3RoID8gaW5kaWNhdG9ycy5sZW5ndGggLSAxIDogYWN0aXZlSW5kZXggKyAxKTtcbiAgICB9XG5cbiAgICBvbkxlZnRLZXkoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gdGhpcy5maW5kRm9jdXNlZEluZGljYXRvckluZGV4KCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VkRm9jdXNlZEluZGljYXRvcihhY3RpdmVJbmRleCwgYWN0aXZlSW5kZXggLSAxIDw9IDAgPyAwIDogYWN0aXZlSW5kZXggLSAxKTtcbiAgICB9XG5cbiAgICBvbkhvbWVLZXkoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUluZGV4ID0gdGhpcy5maW5kRm9jdXNlZEluZGljYXRvckluZGV4KCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VkRm9jdXNlZEluZGljYXRvcihhY3RpdmVJbmRleCwgMCk7XG4gICAgfVxuXG4gICAgb25FbmRLZXkoKSB7XG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LCAnW2RhdGEtcGMtc2VjdGlvbj1cInRodW1ibmFpbGl0ZW1cIl0nKTtcbiAgICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSB0aGlzLmZpbmRGb2N1c2VkSW5kaWNhdG9ySW5kZXgoKTtcblxuICAgICAgICB0aGlzLmNoYW5nZWRGb2N1c2VkSW5kaWNhdG9yKGFjdGl2ZUluZGV4LCBpbmRpY2F0b3JzLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIG9uVGFiS2V5KCkge1xuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gWy4uLkRvbUhhbmRsZXIuZmluZCh0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQsICdbZGF0YS1wYy1zZWN0aW9uPVwidGh1bWJuYWlsaXRlbVwiXScpXTtcbiAgICAgICAgY29uc3QgaGlnaGxpZ2h0ZWRJbmRleCA9IGluZGljYXRvcnMuZmluZEluZGV4KChpbmQpID0+IERvbUhhbmRsZXIuZ2V0QXR0cmlidXRlKGluZCwgJ2RhdGEtcC1hY3RpdmUnKSA9PT0gdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlSW5kaWNhdG9yID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudCwgJ1t0YWJpbmRleD1cIjBcIl0nKTtcblxuICAgICAgICBjb25zdCBhY3RpdmVJbmRleCA9IGluZGljYXRvcnMuZmluZEluZGV4KChpbmQpID0+IGluZCA9PT0gYWN0aXZlSW5kaWNhdG9yLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgICAgIGluZGljYXRvcnNbYWN0aXZlSW5kZXhdLmNoaWxkcmVuWzBdLnRhYkluZGV4ID0gJy0xJztcbiAgICAgICAgaW5kaWNhdG9yc1toaWdobGlnaHRlZEluZGV4XS5jaGlsZHJlblswXS50YWJJbmRleCA9ICcwJztcbiAgICB9XG5cbiAgICBmaW5kRm9jdXNlZEluZGljYXRvckluZGV4KCkge1xuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gWy4uLkRvbUhhbmRsZXIuZmluZCh0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQsICdbZGF0YS1wYy1zZWN0aW9uPVwidGh1bWJuYWlsaXRlbVwiXScpXTtcbiAgICAgICAgY29uc3QgYWN0aXZlSW5kaWNhdG9yID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudCwgJ1tkYXRhLXBjLXNlY3Rpb249XCJ0aHVtYm5haWxpdGVtXCJdID4gW3RhYmluZGV4PVwiMFwiXScpO1xuXG4gICAgICAgIHJldHVybiBpbmRpY2F0b3JzLmZpbmRJbmRleCgoaW5kKSA9PiBpbmQgPT09IGFjdGl2ZUluZGljYXRvci5wYXJlbnRFbGVtZW50KTtcbiAgICB9XG5cbiAgICBjaGFuZ2VkRm9jdXNlZEluZGljYXRvcihwcmV2SW5kLCBuZXh0SW5kKSB7XG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LCAnW2RhdGEtcGMtc2VjdGlvbj1cInRodW1ibmFpbGl0ZW1cIl0nKTtcblxuICAgICAgICBpbmRpY2F0b3JzW3ByZXZJbmRdLmNoaWxkcmVuWzBdLnRhYkluZGV4ID0gJy0xJztcbiAgICAgICAgaW5kaWNhdG9yc1tuZXh0SW5kXS5jaGlsZHJlblswXS50YWJJbmRleCA9ICcwJztcbiAgICAgICAgaW5kaWNhdG9yc1tuZXh0SW5kXS5jaGlsZHJlblswXS5mb2N1cygpO1xuICAgIH1cblxuICAgIHN0ZXAoZGlyOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHRvdGFsU2hpZnRlZEl0ZW1zID0gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyArIGRpcjtcblxuICAgICAgICBpZiAoZGlyIDwgMCAmJiAtMSAqIHRvdGFsU2hpZnRlZEl0ZW1zICsgdGhpcy5kX251bVZpc2libGUgPiAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRvdGFsU2hpZnRlZEl0ZW1zID0gdGhpcy5kX251bVZpc2libGUgLSAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXIgPiAwICYmIHRvdGFsU2hpZnRlZEl0ZW1zID4gMCkge1xuICAgICAgICAgICAgdG90YWxTaGlmdGVkSXRlbXMgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2lyY3VsYXIpIHtcbiAgICAgICAgICAgIGlmIChkaXIgPCAwICYmICg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoIC0gMSA9PT0gdGhpcy5fYWN0aXZlSW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpciA+IDAgJiYgdGhpcy5fYWN0aXZlSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0b3RhbFNoaWZ0ZWRJdGVtcyA9IHRoaXMuZF9udW1WaXNpYmxlIC0gKDxhbnlbXT50aGlzLnZhbHVlKS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pdGVtc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQsICdwLWl0ZW1zLWhpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuaXNWZXJ0aWNhbCA/IGB0cmFuc2xhdGUzZCgwLCAke3RvdGFsU2hpZnRlZEl0ZW1zICogKDEwMCAvIHRoaXMuZF9udW1WaXNpYmxlKX0lLCAwKWAgOiBgdHJhbnNsYXRlM2QoJHt0b3RhbFNoaWZ0ZWRJdGVtcyAqICgxMDAgLyB0aGlzLmRfbnVtVmlzaWJsZSl9JSwgMCwgMClgO1xuICAgICAgICAgICAgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIDUwMG1zIGVhc2UgMHMnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyA9IHRvdGFsU2hpZnRlZEl0ZW1zO1xuICAgIH1cblxuICAgIHN0b3BUaGVTbGlkZVNob3coKSB7XG4gICAgICAgIGlmICh0aGlzLnNsaWRlU2hvd0FjdGl2ZSAmJiB0aGlzLnN0b3BTbGlkZVNob3cpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNsaWRlU2hvdy5lbWl0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VQYWdlT25Ub3VjaChlOiBUb3VjaEV2ZW50LCBkaWZmOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGRpZmYgPCAwKSB7XG4gICAgICAgICAgICAvLyBsZWZ0XG4gICAgICAgICAgICB0aGlzLm5hdkZvcndhcmQoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyByaWdodFxuICAgICAgICAgICAgdGhpcy5uYXZCYWNrd2FyZChlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFRvdGFsUGFnZU51bWJlcigpIHtcbiAgICAgICAgcmV0dXJuICg8YW55W10+dGhpcy52YWx1ZSkubGVuZ3RoID4gdGhpcy5kX251bVZpc2libGUgPyAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aCAtIHRoaXMuZF9udW1WaXNpYmxlICsgMSA6IDA7XG4gICAgfVxuXG4gICAgZ2V0TWVkaWFuSXRlbUluZGV4KCkge1xuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKHRoaXMuZF9udW1WaXNpYmxlIC8gMik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZF9udW1WaXNpYmxlICUgMiA/IGluZGV4IDogaW5kZXggLSAxO1xuICAgIH1cblxuICAgIG9uVHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXNDb250YWluZXIgJiYgdGhpcy5pdGVtc0NvbnRhaW5lci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuaXRlbXNDb250YWluZXIubmF0aXZlRWxlbWVudCwgJ3AtaXRlbXMtaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLml0ZW1zQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ub3VjaEVuZChlOiBUb3VjaEV2ZW50KSB7XG4gICAgICAgIGxldCB0b3VjaG9iaiA9IGUuY2hhbmdlZFRvdWNoZXNbMF07XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlT25Ub3VjaChlLCB0b3VjaG9iai5wYWdlWSAtICg8eyB4OiBudW1iZXI7IHk6IG51bWJlciB9PnRoaXMuc3RhcnRQb3MpLnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlT25Ub3VjaChlLCB0b3VjaG9iai5wYWdlWCAtICg8eyB4OiBudW1iZXI7IHk6IG51bWJlciB9PnRoaXMuc3RhcnRQb3MpLngpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ub3VjaE1vdmUoZTogVG91Y2hFdmVudCkge1xuICAgICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblRvdWNoU3RhcnQoZTogVG91Y2hFdmVudCkge1xuICAgICAgICBsZXQgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuXG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSB7XG4gICAgICAgICAgICB4OiB0b3VjaG9iai5wYWdlWCxcbiAgICAgICAgICAgIHk6IHRvdWNob2JqLnBhZ2VZXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNOYXZCYWNrd2FyZERpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gKCF0aGlzLmNpcmN1bGFyICYmIHRoaXMuX2FjdGl2ZUluZGV4ID09PSAwKSB8fCAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aCA8PSB0aGlzLmRfbnVtVmlzaWJsZTtcbiAgICB9XG5cbiAgICBpc05hdkZvcndhcmREaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuICghdGhpcy5jaXJjdWxhciAmJiB0aGlzLl9hY3RpdmVJbmRleCA9PT0gKDxhbnlbXT50aGlzLnZhbHVlKS5sZW5ndGggLSAxKSB8fCAoPGFueVtdPnRoaXMudmFsdWUpLmxlbmd0aCA8PSB0aGlzLmRfbnVtVmlzaWJsZTtcbiAgICB9XG5cbiAgICBmaXJzdEl0ZW1BY2l2ZUluZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3RhbFNoaWZ0ZWRJdGVtcyAqIC0xO1xuICAgIH1cblxuICAgIGxhc3RJdGVtQWN0aXZlSW5kZXgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpcnN0SXRlbUFjaXZlSW5kZXgoKSArIHRoaXMuZF9udW1WaXNpYmxlIC0gMTtcbiAgICB9XG5cbiAgICBpc0l0ZW1BY3RpdmUoaW5kZXg6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5maXJzdEl0ZW1BY2l2ZUluZGV4KCkgPD0gaW5kZXggJiYgdGhpcy5sYXN0SXRlbUFjdGl2ZUluZGV4KCkgPj0gaW5kZXg7XG4gICAgfVxuXG4gICAgYmluZERvY3VtZW50TGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldyB8fCAnd2luZG93JztcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHdpbmRvdywgJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50TGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRodW1ibmFpbHNTdHlsZSkge1xuICAgICAgICAgICAgdGhpcy50aHVtYm5haWxzU3R5bGUucGFyZW50Tm9kZT8ucmVtb3ZlQ2hpbGQodGhpcy50aHVtYm5haWxzU3R5bGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXJpYVByZXZCdXR0b25MYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEgPyB0aGlzLmdhbGxlcmlhLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhLnByZXZQYWdlTGFiZWwgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJpYU5leHRCdXR0b25MYWJlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEgPyB0aGlzLmdhbGxlcmlhLmNvbmZpZy50cmFuc2xhdGlvbi5hcmlhLm5leHRQYWdlTGFiZWwgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXJpYVBhZ2VMYWJlbCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYWxsZXJpYS5jb25maWcudHJhbnNsYXRpb24uYXJpYSA/IHRoaXMuZ2FsbGVyaWEuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEucGFnZUxhYmVsLnJlcGxhY2UoL3twYWdlfS9nLCB2YWx1ZSkgOiB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlLCBUaW1lc0ljb24sIENoZXZyb25SaWdodEljb24sIENoZXZyb25MZWZ0SWNvbiwgV2luZG93TWF4aW1pemVJY29uLCBXaW5kb3dNaW5pbWl6ZUljb24sIEZvY3VzVHJhcE1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbW1vbk1vZHVsZSwgR2FsbGVyaWEsIEdhbGxlcmlhQ29udGVudCwgR2FsbGVyaWFJdGVtU2xvdCwgR2FsbGVyaWFJdGVtLCBHYWxsZXJpYVRodW1ibmFpbHMsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbR2FsbGVyaWEsIEdhbGxlcmlhQ29udGVudCwgR2FsbGVyaWFJdGVtU2xvdCwgR2FsbGVyaWFJdGVtLCBHYWxsZXJpYVRodW1ibmFpbHNdXG59KVxuZXhwb3J0IGNsYXNzIEdhbGxlcmlhTW9kdWxlIHt9XG4iXX0=