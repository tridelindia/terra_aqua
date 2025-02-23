import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, signal, booleanAttribute, numberAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import * as i2 from 'primeng/button';
import { ButtonModule } from 'primeng/button';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import * as i3 from 'primeng/tieredmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { UniqueComponentId } from 'primeng/utils';
import * as i5 from 'primeng/autofocus';
import { AutoFocusModule } from 'primeng/autofocus';
import * as i4 from 'primeng/tooltip';

/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
class SplitButton {
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    model;
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity;
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    raised = false;
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    rounded = false;
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    text = false;
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined = false;
    /**
     * Defines the size of the button.
     * @group Props
     */
    size = null;
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain = false;
    /**
     * Name of the icon.
     * @group Props
     */
    icon;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos = 'left';
    /**
     * Text of the button.
     * @group Props
     */
    label;
    /**
     * Tooltip for the main button.
     * @group Props
     */
    tooltip;
    /**
     * Tooltip options for the main button.
     * @group Props
     */
    tooltipOptions;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    menuStyle;
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    menuStyleClass;
    /**
     *  Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo;
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    dir;
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    expandAriaLabel;
    /**
     * Transition options of the show animation.
     * @group Props
     */
    showTransitionOptions = '.12s cubic-bezier(0, 0, 0.2, 1)';
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    hideTransitionOptions = '.1s linear';
    /**
     * Button Props
     */
    buttonProps;
    /**
     * Menu Button Props
     */
    menuButtonProps;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    set disabled(v) {
        this._disabled = v;
        this._buttonDisabled = v;
        this.menuButtonDisabled = v;
    }
    get disabled() {
        return this._disabled;
    }
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex;
    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    set menuButtonDisabled(v) {
        if (this.disabled) {
            this._menuButtonDisabled = this.disabled;
        }
        else
            this._menuButtonDisabled = v;
    }
    get menuButtonDisabled() {
        return this._menuButtonDisabled;
    }
    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    set buttonDisabled(v) {
        if (this.disabled) {
            this.buttonDisabled = this.disabled;
        }
        else
            this._buttonDisabled = v;
    }
    get buttonDisabled() {
        return this._buttonDisabled;
    }
    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick = new EventEmitter();
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    onMenuHide = new EventEmitter();
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    onMenuShow = new EventEmitter();
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onDropdownClick = new EventEmitter();
    containerViewChild;
    buttonViewChild;
    menu;
    templates;
    contentTemplate;
    dropdownIconTemplate;
    ariaId;
    isExpanded = signal(false);
    _disabled;
    _buttonDisabled;
    _menuButtonDisabled;
    ngOnInit() {
        this.ariaId = UniqueComponentId();
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'dropdownicon':
                    this.dropdownIconTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    get containerClass() {
        const cls = {
            'p-splitbutton p-component': true,
            'p-button-raised': this.raised,
            'p-button-rounded': this.rounded,
            'p-button-outlined': this.outlined,
            'p-button-text': this.text,
            'p-button-plain': this.plain,
            [`p-button-${this.size === 'small' ? 'sm' : 'lg'}`]: this.size
        };
        return { ...cls };
    }
    onDefaultButtonClick(event) {
        this.onClick.emit(event);
        this.menu.hide();
    }
    onDropdownButtonClick(event) {
        this.onDropdownClick.emit(event);
        this.menu?.toggle({ currentTarget: this.containerViewChild?.nativeElement, relativeAlign: this.appendTo == null });
    }
    onDropdownButtonKeydown(event) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.onDropdownButtonClick();
            event.preventDefault();
        }
    }
    onHide() {
        this.isExpanded.set(false);
        this.onMenuHide.emit();
    }
    onShow() {
        this.isExpanded.set(true);
        this.onMenuShow.emit();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitButton, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: SplitButton, selector: "p-splitButton", inputs: { model: "model", severity: "severity", raised: ["raised", "raised", booleanAttribute], rounded: ["rounded", "rounded", booleanAttribute], text: ["text", "text", booleanAttribute], outlined: ["outlined", "outlined", booleanAttribute], size: "size", plain: ["plain", "plain", booleanAttribute], icon: "icon", iconPos: "iconPos", label: "label", tooltip: "tooltip", tooltipOptions: "tooltipOptions", style: "style", styleClass: "styleClass", menuStyle: "menuStyle", menuStyleClass: "menuStyleClass", appendTo: "appendTo", dir: "dir", expandAriaLabel: "expandAriaLabel", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", buttonProps: "buttonProps", menuButtonProps: "menuButtonProps", autofocus: ["autofocus", "autofocus", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], tabindex: ["tabindex", "tabindex", numberAttribute], menuButtonDisabled: "menuButtonDisabled", buttonDisabled: "buttonDisabled" }, outputs: { onClick: "onClick", onMenuHide: "onMenuHide", onMenuShow: "onMenuShow", onDropdownClick: "onDropdownClick" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }, { propertyName: "buttonViewChild", first: true, predicate: ["defaultbtn"], descendants: true }, { propertyName: "menu", first: true, predicate: ["menu"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass" [class]="styleClass" [ngStyle]="style">
            <ng-container *ngIf="contentTemplate; else defaultButton">
                <button
                    class="p-splitbutton-defaultbutton"
                    type="button"
                    pButton
                    [severity]="severity"
                    [text]="text"
                    [outlined]="outlined"
                    [size]="size"
                    [icon]="icon"
                    [iconPos]="iconPos"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="disabled"
                    [attr.tabindex]="tabindex"
                    [ariaLabel]="buttonProps?.['ariaLabel'] || label"
                    pAutoFocus
                    [autofocus]="autofocus"
                    [pTooltip]="tooltip"
                    [tooltipOptions]="tooltipOptions"
                >
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </button>
            </ng-container>
            <ng-template #defaultButton>
                <button
                    #defaultbtn
                    class="p-splitbutton-defaultbutton"
                    type="button"
                    pButton
                    [severity]="severity"
                    [text]="text"
                    [outlined]="outlined"
                    [size]="size"
                    [icon]="icon"
                    [iconPos]="iconPos"
                    [label]="label"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="buttonDisabled"
                    [attr.tabindex]="tabindex"
                    [ariaLabel]="buttonProps?.['ariaLabel']"
                    pAutoFocus
                    [autofocus]="autofocus"
                    [pTooltip]="tooltip"
                    [tooltipOptions]="tooltipOptions"
                ></button>
            </ng-template>
            <button
                type="button"
                pButton
                [size]="size"
                [severity]="severity"
                [text]="text"
                [outlined]="outlined"
                class="p-splitbutton-menubutton p-button-icon-only"
                (click)="onDropdownButtonClick($event)"
                (keydown)="onDropdownButtonKeydown($event)"
                [disabled]="menuButtonDisabled"
                [ariaLabel]="menuButtonProps?.['ariaLabel'] || expandAriaLabel"
                [attr.aria-haspopup]="menuButtonProps?.['ariaHasPopup'] || true"
                [attr.aria-expanded]="menuButtonProps?.['ariaExpanded'] || isExpanded()"
                [attr.aria-controls]="menuButtonProps?.['ariaControls'] || ariaId"
            >
                <ChevronDownIcon *ngIf="!dropdownIconTemplate" />
                <ng-template *ngTemplateOutlet="dropdownIconTemplate"></ng-template>
            </button>
            <p-tieredMenu
                [id]="ariaId"
                #menu
                [popup]="true"
                [model]="model"
                [style]="menuStyle"
                [styleClass]="menuStyleClass"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onHide)="onHide()"
                (onShow)="onShow()"
            ></p-tieredMenu>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-splitbutton{display:inline-flex;position:relative}.p-splitbutton .p-splitbutton-defaultbutton,.p-splitbutton.p-button-rounded>.p-splitbutton-defaultbutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-defaultbutton.p-button{flex:1 1 auto;border-top-right-radius:0;border-bottom-right-radius:0;border-right:0 none}.p-splitbutton-menubutton,.p-splitbutton.p-button-rounded>.p-splitbutton-menubutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-menubutton.p-button{display:flex;align-items:center;justify-content:center;border-top-left-radius:0;border-bottom-left-radius:0}.p-splitbutton .p-menu{min-width:100%}.p-fluid .p-splitbutton{display:flex}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i1.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i2.ButtonDirective), selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading", "severity", "raised", "rounded", "text", "outlined", "size", "plain"] }, { kind: "component", type: i0.forwardRef(() => i3.TieredMenu), selector: "p-tieredMenu", inputs: ["model", "popup", "style", "styleClass", "appendTo", "autoZIndex", "baseZIndex", "autoDisplay", "showTransitionOptions", "hideTransitionOptions", "id", "ariaLabel", "ariaLabelledBy", "disabled", "tabindex"], outputs: ["onShow", "onHide"] }, { kind: "directive", type: i0.forwardRef(() => i4.Tooltip), selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "hideOnEscape", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "directive", type: i0.forwardRef(() => i5.AutoFocus), selector: "[pAutoFocus]", inputs: ["autofocus"] }, { kind: "component", type: i0.forwardRef(() => ChevronDownIcon), selector: "ChevronDownIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitButton, decorators: [{
            type: Component,
            args: [{ selector: 'p-splitButton', template: `
        <div #container [ngClass]="containerClass" [class]="styleClass" [ngStyle]="style">
            <ng-container *ngIf="contentTemplate; else defaultButton">
                <button
                    class="p-splitbutton-defaultbutton"
                    type="button"
                    pButton
                    [severity]="severity"
                    [text]="text"
                    [outlined]="outlined"
                    [size]="size"
                    [icon]="icon"
                    [iconPos]="iconPos"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="disabled"
                    [attr.tabindex]="tabindex"
                    [ariaLabel]="buttonProps?.['ariaLabel'] || label"
                    pAutoFocus
                    [autofocus]="autofocus"
                    [pTooltip]="tooltip"
                    [tooltipOptions]="tooltipOptions"
                >
                    <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                </button>
            </ng-container>
            <ng-template #defaultButton>
                <button
                    #defaultbtn
                    class="p-splitbutton-defaultbutton"
                    type="button"
                    pButton
                    [severity]="severity"
                    [text]="text"
                    [outlined]="outlined"
                    [size]="size"
                    [icon]="icon"
                    [iconPos]="iconPos"
                    [label]="label"
                    (click)="onDefaultButtonClick($event)"
                    [disabled]="buttonDisabled"
                    [attr.tabindex]="tabindex"
                    [ariaLabel]="buttonProps?.['ariaLabel']"
                    pAutoFocus
                    [autofocus]="autofocus"
                    [pTooltip]="tooltip"
                    [tooltipOptions]="tooltipOptions"
                ></button>
            </ng-template>
            <button
                type="button"
                pButton
                [size]="size"
                [severity]="severity"
                [text]="text"
                [outlined]="outlined"
                class="p-splitbutton-menubutton p-button-icon-only"
                (click)="onDropdownButtonClick($event)"
                (keydown)="onDropdownButtonKeydown($event)"
                [disabled]="menuButtonDisabled"
                [ariaLabel]="menuButtonProps?.['ariaLabel'] || expandAriaLabel"
                [attr.aria-haspopup]="menuButtonProps?.['ariaHasPopup'] || true"
                [attr.aria-expanded]="menuButtonProps?.['ariaExpanded'] || isExpanded()"
                [attr.aria-controls]="menuButtonProps?.['ariaControls'] || ariaId"
            >
                <ChevronDownIcon *ngIf="!dropdownIconTemplate" />
                <ng-template *ngTemplateOutlet="dropdownIconTemplate"></ng-template>
            </button>
            <p-tieredMenu
                [id]="ariaId"
                #menu
                [popup]="true"
                [model]="model"
                [style]="menuStyle"
                [styleClass]="menuStyleClass"
                [appendTo]="appendTo"
                [showTransitionOptions]="showTransitionOptions"
                [hideTransitionOptions]="hideTransitionOptions"
                (onHide)="onHide()"
                (onShow)="onShow()"
            ></p-tieredMenu>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-splitbutton{display:inline-flex;position:relative}.p-splitbutton .p-splitbutton-defaultbutton,.p-splitbutton.p-button-rounded>.p-splitbutton-defaultbutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-defaultbutton.p-button{flex:1 1 auto;border-top-right-radius:0;border-bottom-right-radius:0;border-right:0 none}.p-splitbutton-menubutton,.p-splitbutton.p-button-rounded>.p-splitbutton-menubutton.p-button,.p-splitbutton.p-button-outlined>.p-splitbutton-menubutton.p-button{display:flex;align-items:center;justify-content:center;border-top-left-radius:0;border-bottom-left-radius:0}.p-splitbutton .p-menu{min-width:100%}.p-fluid .p-splitbutton{display:flex}}\n"] }]
        }], propDecorators: { model: [{
                type: Input
            }], severity: [{
                type: Input
            }], raised: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], rounded: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], text: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], outlined: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], size: [{
                type: Input
            }], plain: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], icon: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], label: [{
                type: Input
            }], tooltip: [{
                type: Input
            }], tooltipOptions: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], menuStyle: [{
                type: Input
            }], menuStyleClass: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], dir: [{
                type: Input
            }], expandAriaLabel: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], buttonProps: [{
                type: Input
            }], menuButtonProps: [{
                type: Input
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], menuButtonDisabled: [{
                type: Input,
                args: ['menuButtonDisabled']
            }], buttonDisabled: [{
                type: Input
            }], onClick: [{
                type: Output
            }], onMenuHide: [{
                type: Output
            }], onMenuShow: [{
                type: Output
            }], onDropdownClick: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], buttonViewChild: [{
                type: ViewChild,
                args: ['defaultbtn']
            }], menu: [{
                type: ViewChild,
                args: ['menu']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class SplitButtonModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: SplitButtonModule, declarations: [SplitButton], imports: [CommonModule, ButtonModule, TieredMenuModule, AutoFocusModule, ChevronDownIcon], exports: [SplitButton, ButtonModule, TieredMenuModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitButtonModule, imports: [CommonModule, ButtonModule, TieredMenuModule, AutoFocusModule, ChevronDownIcon, ButtonModule, TieredMenuModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SplitButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, TieredMenuModule, AutoFocusModule, ChevronDownIcon],
                    exports: [SplitButton, ButtonModule, TieredMenuModule],
                    declarations: [SplitButton]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { SplitButton, SplitButtonModule };
//# sourceMappingURL=primeng-splitbutton.mjs.map
