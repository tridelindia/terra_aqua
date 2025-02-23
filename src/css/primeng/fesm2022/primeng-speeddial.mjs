import * as i1 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, signal, PLATFORM_ID, numberAttribute, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import * as i5 from '@angular/router';
import { RouterModule } from '@angular/router';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import { PlusIcon } from 'primeng/icons/plus';
import * as i3 from 'primeng/ripple';
import { RippleModule } from 'primeng/ripple';
import * as i4 from 'primeng/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { UniqueComponentId } from 'primeng/utils';
import { asapScheduler } from 'rxjs';

/**
 * When pressed, a floating action button can display multiple primary actions that can be performed on a page.
 * @group Components
 */
class SpeedDial {
    platformId;
    el;
    cd;
    document;
    renderer;
    /**
     * List of items id.
     * @group Props
     */
    id;
    /**
     * MenuModel instance to define the action items.
     * @group Props
     */
    model = null;
    /**
     * Specifies the visibility of the overlay.
     * @defaultValue false
     * @group Props
     */
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible) {
            this.bindDocumentClickListener();
        }
        else {
            this.unbindDocumentClickListener();
        }
    }
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Style class of the element.
     * @group Props
     */
    className;
    /**
     * Specifies the opening direction of actions.
     * @gruop Props
     */
    direction = 'up';
    /**
     * Transition delay step for each action item.
     * @group Props
     */
    transitionDelay = 30;
    /**
     * Specifies the opening type of actions.
     * @group Props
     */
    type = 'linear';
    /**
     * Radius for *circle types.
     * @group Props
     */
    radius = 0;
    /**
     * Whether to show a mask element behind the speeddial.
     * @group Props
     */
    mask = false;
    /**
     * Whether the component is disabled.
     * @group Props
     */
    disabled = false;
    /**
     * Whether the actions close when clicked outside.
     * @group Props
     */
    hideOnClickOutside = true;
    /**
     * Inline style of the button element.
     * @group Props
     */
    buttonStyle;
    /**
     * Style class of the button element.
     * @group Props
     */
    buttonClassName;
    /**
     * Inline style of the mask element.
     * @group Props
     */
    maskStyle;
    /**
     * Style class of the mask element.
     * @group Props
     */
    maskClassName;
    /**
     * Show icon of the button element.
     * @group Props
     */
    showIcon;
    /**
     * Hide icon of the button element.
     * @group Props
     */
    hideIcon;
    /**
     * Defined to rotate showIcon when hideIcon is not present.
     * @group Props
     */
    rotateAnimation = true;
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    ariaLabel;
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Fired when the visibility of element changed.
     * @param {boolean} boolean - Visibility value.
     * @group Emits
     */
    onVisibleChange = new EventEmitter();
    /**
     * Fired when the visibility of element changed.
     * @param {boolean} boolean - Visibility value.
     * @group Emits
     */
    visibleChange = new EventEmitter();
    /**
     * Fired when the button element clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = new EventEmitter();
    /**
     * Fired when the actions are visible.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onShow = new EventEmitter();
    /**
     * Fired when the actions are hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onHide = new EventEmitter();
    container;
    list;
    templates;
    buttonTemplate;
    itemTemplate;
    isItemClicked = false;
    _visible = false;
    documentClickListener;
    focusedOptionIndex = signal(null);
    focused = false;
    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null;
    }
    constructor(platformId, el, cd, document, renderer) {
        this.platformId = platformId;
        this.el = el;
        this.cd = cd;
        this.document = document;
        this.renderer = renderer;
    }
    ngOnInit() {
        this.id = this.id || UniqueComponentId();
    }
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.type !== 'linear') {
                const button = DomHandler.findSingle(this.container?.nativeElement, '.p-speeddial-button');
                const firstItem = DomHandler.findSingle(this.list?.nativeElement, '.p-speeddial-item');
                if (button && firstItem) {
                    const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                    const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                    this.list?.nativeElement.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                    this.list?.nativeElement.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
                }
            }
        }
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'button':
                    this.buttonTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    show() {
        this.onVisibleChange.emit(true);
        this.visibleChange.emit(true);
        this._visible = true;
        this.onShow.emit();
        this.bindDocumentClickListener();
        this.cd.markForCheck();
    }
    hide() {
        this.onVisibleChange.emit(false);
        this.visibleChange.emit(false);
        this._visible = false;
        this.onHide.emit();
        this.unbindDocumentClickListener();
        this.cd.markForCheck();
    }
    onButtonClick(event) {
        this.visible ? this.hide() : this.show();
        this.onClick.emit(event);
        this.isItemClicked = true;
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
        this.hide();
        this.isItemClicked = true;
    }
    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDown(event);
                break;
            case 'ArrowUp':
                this.onArrowUp(event);
                break;
            case 'ArrowLeft':
                this.onArrowLeft(event);
                break;
            case 'ArrowRight':
                this.onArrowRight(event);
                break;
            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;
            case 'Escape':
                this.onEscapeKey(event);
                break;
            case 'Home':
                this.onHomeKey(event);
                break;
            case 'End':
                this.onEndKey(event);
                break;
            default:
                break;
        }
    }
    onFocus(event) {
        this.focused = true;
    }
    onBlur(event) {
        this.focused = false;
        asapScheduler.schedule(() => this.focusedOptionIndex.set(-1));
    }
    onArrowUp(event) {
        if (this.direction === 'up') {
            this.navigateNextItem(event);
        }
        else if (this.direction === 'down') {
            this.navigatePrevItem(event);
        }
        else {
            this.navigateNextItem(event);
        }
    }
    onArrowDown(event) {
        if (this.direction === 'up') {
            this.navigatePrevItem(event);
        }
        else if (this.direction === 'down') {
            this.navigateNextItem(event);
        }
        else {
            this.navigatePrevItem(event);
        }
    }
    onArrowLeft(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];
        if (leftValidDirections.includes(this.direction)) {
            this.navigateNextItem(event);
        }
        else if (rightValidDirections.includes(this.direction)) {
            this.navigatePrevItem(event);
        }
        else {
            this.navigatePrevItem(event);
        }
    }
    onArrowRight(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];
        if (leftValidDirections.includes(this.direction)) {
            this.navigatePrevItem(event);
        }
        else if (rightValidDirections.includes(this.direction)) {
            this.navigateNextItem(event);
        }
        else {
            this.navigateNextItem(event);
        }
    }
    onEndKey(event) {
        event.preventDefault();
        this.focusedOptionIndex.set(-1);
        this.navigatePrevItem(event);
    }
    onHomeKey(event) {
        event.preventDefault();
        this.focusedOptionIndex.set(-1);
        this.navigateNextItem(event);
    }
    onEnterKey(event) {
        const items = DomHandler.find(this.container.nativeElement, '[data-pc-section="menuitem"]');
        const itemIndex = [...items].findIndex((item) => item.id === this.focusedOptionIndex());
        this.onItemClick(event, this.model[itemIndex]);
        this.onBlur(event);
        const buttonEl = DomHandler.findSingle(this.container.nativeElement, 'button');
        buttonEl && DomHandler.focus(buttonEl);
    }
    onEscapeKey(event) {
        this.hide();
        const buttonEl = DomHandler.findSingle(this.container.nativeElement, 'button');
        buttonEl && DomHandler.focus(buttonEl);
    }
    onTogglerKeydown(event) {
        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.onTogglerArrowDown(event);
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                this.onTogglerArrowUp(event);
                break;
            case 'Escape':
                this.onEscapeKey(event);
                break;
            default:
                break;
        }
    }
    onTogglerArrowUp(event) {
        this.focused = true;
        DomHandler.focus(this.list.nativeElement);
        this.show();
        this.navigatePrevItem(event);
        event.preventDefault();
    }
    onTogglerArrowDown(event) {
        this.focused = true;
        DomHandler.focus(this.list.nativeElement);
        this.show();
        this.navigateNextItem(event);
        event.preventDefault();
    }
    navigateNextItem(event) {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());
        this.changeFocusedOptionIndex(optionIndex);
        event.preventDefault();
    }
    navigatePrevItem(event) {
        const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());
        this.changeFocusedOptionIndex(optionIndex);
        event.preventDefault();
    }
    findPrevOptionIndex(index) {
        const items = DomHandler.find(this.container.nativeElement, '[data-pc-section="menuitem"]');
        const filteredItems = [...items].filter((item) => !DomHandler.hasClass(DomHandler.findSingle(item, 'a'), 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[filteredItems.length - 1].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);
        matchedOptionIndex = index === -1 ? filteredItems.length - 1 : matchedOptionIndex - 1;
        return matchedOptionIndex;
    }
    findNextOptionIndex(index) {
        const items = DomHandler.find(this.container.nativeElement, '[data-pc-section="menuitem"]');
        const filteredItems = [...items].filter((item) => !DomHandler.hasClass(DomHandler.findSingle(item, 'a'), 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[0].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);
        matchedOptionIndex = index === -1 ? 0 : matchedOptionIndex + 1;
        return matchedOptionIndex;
    }
    changeFocusedOptionIndex(index) {
        const items = DomHandler.find(this.container.nativeElement, '[data-pc-section="menuitem"]');
        const filteredItems = [...items].filter((item) => !DomHandler.hasClass(DomHandler.findSingle(item, 'a'), 'p-disabled'));
        if (filteredItems[index]) {
            this.focusedOptionIndex.set(filteredItems[index].getAttribute('id'));
        }
    }
    calculatePointStyle(index) {
        const type = this.type;
        if (type !== 'linear') {
            const length = this.model.length;
            const radius = this.radius || length * 20;
            if (type === 'circle') {
                const step = (2 * Math.PI) / length;
                return {
                    left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                    top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`
                };
            }
            else if (type === 'semi-circle') {
                const direction = this.direction;
                const step = Math.PI / (length - 1);
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down') {
                    return { left: x, top: y };
                }
                else if (direction === 'left') {
                    return { right: y, top: x };
                }
                else if (direction === 'right') {
                    return { left: y, top: x };
                }
            }
            else if (type === 'quarter-circle') {
                const direction = this.direction;
                const step = Math.PI / (2 * (length - 1));
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up-left') {
                    return { right: x, bottom: y };
                }
                else if (direction === 'up-right') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down-left') {
                    return { right: y, top: x };
                }
                else if (direction === 'down-right') {
                    return { left: y, top: x };
                }
            }
        }
        return {};
    }
    calculateTransitionDelay(index) {
        const length = this.model.length;
        return (this.visible ? index : length - index - 1) * this.transitionDelay;
    }
    containerClass() {
        return {
            ['p-speeddial p-component' + ` p-speeddial-${this.type}`]: true,
            [`p-speeddial-direction-${this.direction}`]: this.type !== 'circle',
            'p-speeddial-opened': this.visible,
            'p-disabled': this.disabled
        };
    }
    buttonClass() {
        return {
            'p-speeddial-button p-button-rounded': true,
            'p-speeddial-rotate': this.rotateAnimation && !this.hideIcon,
            [this.buttonClassName]: true
        };
    }
    get buttonIconClass() {
        return (!this.visible && this.showIcon) || !this.hideIcon ? this.showIcon : this.hideIcon;
    }
    getItemStyle(index) {
        const transitionDelay = this.calculateTransitionDelay(index);
        const pointStyle = this.calculatePointStyle(index);
        return {
            transitionDelay: `${transitionDelay}ms`,
            ...pointStyle
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !this.disabled && !item.disabled;
    }
    isOutsideClicked(event) {
        return this.container && !(this.container.nativeElement.isSameNode(event.target) || this.container.nativeElement.contains(event.target) || this.isItemClicked);
    }
    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener && this.hideOnClickOutside) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.visible && this.isOutsideClicked(event)) {
                        this.hide();
                    }
                    this.isItemClicked = false;
                });
            }
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentClickListener();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpeedDial, deps: [{ token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: SpeedDial, selector: "p-speedDial", inputs: { id: "id", model: "model", visible: "visible", style: "style", className: "className", direction: "direction", transitionDelay: ["transitionDelay", "transitionDelay", numberAttribute], type: "type", radius: ["radius", "radius", numberAttribute], mask: ["mask", "mask", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], hideOnClickOutside: ["hideOnClickOutside", "hideOnClickOutside", booleanAttribute], buttonStyle: "buttonStyle", buttonClassName: "buttonClassName", maskStyle: "maskStyle", maskClassName: "maskClassName", showIcon: "showIcon", hideIcon: "hideIcon", rotateAnimation: ["rotateAnimation", "rotateAnimation", booleanAttribute], ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy" }, outputs: { onVisibleChange: "onVisibleChange", visibleChange: "visibleChange", onClick: "onClick", onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass()" [class]="className" [ngStyle]="style" [attr.data-pc-name]="'speeddial'" [attr.data-pc-section]="'root'">
            <button
                pRipple
                pButton
                class="p-button-icon-only"
                [ngStyle]="buttonStyle"
                [icon]="buttonIconClass"
                [ngClass]="buttonClass()"
                [disabled]="disabled"
                [attr.aria-expanded]="visible"
                [attr.aria-haspopup]="true"
                [attr.aria-controls]="id + '_list'"
                [attr.aria-label]="ariaLabel"
                [attr.aria-labelledby]="ariaLabelledBy"
                (click)="onButtonClick($event)"
                (keydown)="onTogglerKeydown($event)"
                [attr.data-pc-name]="'button'"
            >
                <PlusIcon *ngIf="!showIcon && !buttonTemplate" />
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul
                #list
                class="p-speeddial-list"
                role="menu"
                [id]="id + '_list'"
                (focus)="onFocus($event)"
                (focusout)="onBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                [tabindex]="-1"
                [attr.data-pc-section]="'menu'"
            >
                <li
                    *ngFor="let item of model; let i = index"
                    [ngStyle]="getItemStyle(i)"
                    class="p-speeddial-item"
                    pTooltip
                    [tooltipOptions]="item.tooltipOptions"
                    [ngClass]="{ 'p-hidden': item.visible === false, 'p-focus': focusedOptionId == id + '_' + i }"
                    [id]="id + '_' + i"
                    [attr.aria-controls]="id + '_item'"
                    role="menuitem"
                    [attr.data-pc-section]="'menuitem'"
                >
                    <ng-container *ngIf="itemTemplate">
                        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="!itemTemplate">
                        <a
                            *ngIf="isClickableRouterLink(item); else elseBlock"
                            pRipple
                            [routerLink]="item.routerLink"
                            [queryParams]="item.queryParams"
                            class="p-speeddial-action"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            role="menuitem"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                            (click)="onItemClick($event, item)"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment"
                            [skipLocationChange]="item.skipLocationChange"
                            [replaceUrl]="item.replaceUrl"
                            [state]="item.state"
                            [attr.aria-label]="item.label"
                            [attr.data-pc-section]="'action'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                        <ng-template #elseBlock>
                            <a
                                [attr.href]="item.url || null"
                                class="p-speeddial-action"
                                role="menuitem"
                                pRipple
                                (click)="onItemClick($event, item)"
                                [ngClass]="{ 'p-disabled': item.disabled }"
                                (keydown.enter)="onItemClick($event, item, i)"
                                [attr.target]="item.target"
                                [attr.data-pc-section]="'action'"
                                [attr.aria-label]="item.label"
                                [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                            >
                                <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                            </a>
                        </ng-template>
                    </ng-container>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, isInline: true, styles: ["@layer primeng{.p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial:not(.p-speeddial-opened){pointer-events:none}.p-speeddial:not(.p-speeddial-opened) .p-speeddial-button{pointer-events:auto}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i1.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i2.ButtonDirective), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading", "severity", "raised", "rounded", "text", "outlined", "size", "plain"] }, { kind: "directive", type: i0.forwardRef(() => i3.Ripple), selector: "[pRipple]" }, { kind: "directive", type: i0.forwardRef(() => i4.Tooltip), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "directive", type: i0.forwardRef(() => i5.RouterLink), selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i0.forwardRef(() => PlusIcon), selector: "PlusIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpeedDial, decorators: [{
            type: Component,
            args: [{ selector: 'p-speedDial', template: `
        <div #container [ngClass]="containerClass()" [class]="className" [ngStyle]="style" [attr.data-pc-name]="'speeddial'" [attr.data-pc-section]="'root'">
            <button
                pRipple
                pButton
                class="p-button-icon-only"
                [ngStyle]="buttonStyle"
                [icon]="buttonIconClass"
                [ngClass]="buttonClass()"
                [disabled]="disabled"
                [attr.aria-expanded]="visible"
                [attr.aria-haspopup]="true"
                [attr.aria-controls]="id + '_list'"
                [attr.aria-label]="ariaLabel"
                [attr.aria-labelledby]="ariaLabelledBy"
                (click)="onButtonClick($event)"
                (keydown)="onTogglerKeydown($event)"
                [attr.data-pc-name]="'button'"
            >
                <PlusIcon *ngIf="!showIcon && !buttonTemplate" />
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul
                #list
                class="p-speeddial-list"
                role="menu"
                [id]="id + '_list'"
                (focus)="onFocus($event)"
                (focusout)="onBlur($event)"
                (keydown)="onKeyDown($event)"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                [tabindex]="-1"
                [attr.data-pc-section]="'menu'"
            >
                <li
                    *ngFor="let item of model; let i = index"
                    [ngStyle]="getItemStyle(i)"
                    class="p-speeddial-item"
                    pTooltip
                    [tooltipOptions]="item.tooltipOptions"
                    [ngClass]="{ 'p-hidden': item.visible === false, 'p-focus': focusedOptionId == id + '_' + i }"
                    [id]="id + '_' + i"
                    [attr.aria-controls]="id + '_item'"
                    role="menuitem"
                    [attr.data-pc-section]="'menuitem'"
                >
                    <ng-container *ngIf="itemTemplate">
                        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
                    </ng-container>
                    <ng-container *ngIf="!itemTemplate">
                        <a
                            *ngIf="isClickableRouterLink(item); else elseBlock"
                            pRipple
                            [routerLink]="item.routerLink"
                            [queryParams]="item.queryParams"
                            class="p-speeddial-action"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            role="menuitem"
                            [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                            (click)="onItemClick($event, item)"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                            [fragment]="item.fragment"
                            [queryParamsHandling]="item.queryParamsHandling"
                            [preserveFragment]="item.preserveFragment"
                            [skipLocationChange]="item.skipLocationChange"
                            [replaceUrl]="item.replaceUrl"
                            [state]="item.state"
                            [attr.aria-label]="item.label"
                            [attr.data-pc-section]="'action'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                        <ng-template #elseBlock>
                            <a
                                [attr.href]="item.url || null"
                                class="p-speeddial-action"
                                role="menuitem"
                                pRipple
                                (click)="onItemClick($event, item)"
                                [ngClass]="{ 'p-disabled': item.disabled }"
                                (keydown.enter)="onItemClick($event, item, i)"
                                [attr.target]="item.target"
                                [attr.data-pc-section]="'action'"
                                [attr.aria-label]="item.label"
                                [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                            >
                                <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                            </a>
                        </ng-template>
                    </ng-container>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial:not(.p-speeddial-opened){pointer-events:none}.p-speeddial:not(.p-speeddial-opened) .p-speeddial-button{pointer-events:auto}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}}\n"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }], propDecorators: { id: [{
                type: Input
            }], model: [{
                type: Input
            }], visible: [{
                type: Input
            }], style: [{
                type: Input
            }], className: [{
                type: Input
            }], direction: [{
                type: Input
            }], transitionDelay: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], type: [{
                type: Input
            }], radius: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], mask: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], hideOnClickOutside: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], buttonStyle: [{
                type: Input
            }], buttonClassName: [{
                type: Input
            }], maskStyle: [{
                type: Input
            }], maskClassName: [{
                type: Input
            }], showIcon: [{
                type: Input
            }], hideIcon: [{
                type: Input
            }], rotateAnimation: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], onVisibleChange: [{
                type: Output
            }], visibleChange: [{
                type: Output
            }], onClick: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], list: [{
                type: ViewChild,
                args: ['list']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class SpeedDialModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpeedDialModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: SpeedDialModule, declarations: [SpeedDial], imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon], exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpeedDialModule, imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon, SharedModule, ButtonModule, TooltipModule, RouterModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpeedDialModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, PlusIcon],
                    exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule],
                    declarations: [SpeedDial]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SpeedDial, SpeedDialModule };
//# sourceMappingURL=primeng-speeddial.mjs.map
