import { ElementRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { MenuItem, PrimeTemplate, TooltipOptions } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';
import { ButtonProps, MenuButtonProps } from './splitbutton.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/tieredmenu";
import * as i4 from "primeng/autofocus";
import * as i5 from "primeng/icons/chevrondown";
type SplitButtonIconPosition = 'left' | 'right';
/**
 * SplitButton groups a set of commands in an overlay with a default command.
 * @group Components
 */
export declare class SplitButton {
    /**
     * MenuModel instance to define the overlay items.
     * @group Props
     */
    model: MenuItem[] | undefined;
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
    /**
     * Add a shadow to indicate elevation.
     * @group Props
     */
    raised: boolean;
    /**
     * Add a circular border radius to the button.
     * @group Props
     */
    rounded: boolean;
    /**
     * Add a textual class to the button without a background initially.
     * @group Props
     */
    text: boolean;
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined: boolean;
    /**
     * Defines the size of the button.
     * @group Props
     */
    size: 'small' | 'large' | undefined | null;
    /**
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain: boolean;
    /**
     * Name of the icon.
     * @group Props
     */
    icon: string | undefined;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos: SplitButtonIconPosition;
    /**
     * Text of the button.
     * @group Props
     */
    label: string | undefined;
    /**
     * Tooltip for the main button.
     * @group Props
     */
    tooltip: string | undefined;
    /**
     * Tooltip options for the main button.
     * @group Props
     */
    tooltipOptions: TooltipOptions | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Inline style of the overlay menu.
     * @group Props
     */
    menuStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the overlay menu.
     * @group Props
     */
    menuStyleClass: string | undefined;
    /**
     *  Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * Indicates the direction of the element.
     * @group Props
     */
    dir: string | undefined;
    /**
     * Defines a string that labels the expand button for accessibility.
     * @group Props
     */
    expandAriaLabel: string | undefined;
    /**
     * Transition options of the show animation.
     * @group Props
     */
    showTransitionOptions: string;
    /**
     * Transition options of the hide animation.
     * @group Props
     */
    hideTransitionOptions: string;
    /**
     * Button Props
     */
    buttonProps: ButtonProps | undefined;
    /**
     * Menu Button Props
     */
    menuButtonProps: MenuButtonProps | undefined;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    set disabled(v: boolean | undefined);
    get disabled(): boolean | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * When present, it specifies that the menu button element should be disabled.
     * @group Props
     */
    set menuButtonDisabled(v: boolean | undefined);
    get menuButtonDisabled(): boolean | undefined;
    /**
     * When present, it specifies that the button element should be disabled.
     * @group Props
     */
    set buttonDisabled(v: boolean | undefined);
    get buttonDisabled(): boolean;
    /**
     * Callback to invoke when default command button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick: EventEmitter<MouseEvent>;
    /**
     * Callback to invoke when overlay menu is hidden.
     * @group Emits
     */
    onMenuHide: EventEmitter<any>;
    /**
     * Callback to invoke when overlay menu is shown.
     * @group Emits
     */
    onMenuShow: EventEmitter<any>;
    /**
     * Callback to invoke when dropdown button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onDropdownClick: EventEmitter<MouseEvent>;
    containerViewChild: ElementRef | undefined;
    buttonViewChild: ElementRef | undefined;
    menu: TieredMenu | undefined;
    templates: QueryList<PrimeTemplate> | undefined;
    contentTemplate: TemplateRef<any> | undefined;
    dropdownIconTemplate: TemplateRef<any> | undefined;
    ariaId: string | undefined;
    isExpanded: import("@angular/core").WritableSignal<boolean>;
    private _disabled;
    private _buttonDisabled;
    private _menuButtonDisabled;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    get containerClass(): {
        [x: string]: boolean | "small" | "large";
        'p-splitbutton p-component': boolean;
        'p-button-raised': boolean;
        'p-button-rounded': boolean;
        'p-button-outlined': boolean;
        'p-button-text': boolean;
        'p-button-plain': boolean;
    };
    onDefaultButtonClick(event: MouseEvent): void;
    onDropdownButtonClick(event?: MouseEvent): void;
    onDropdownButtonKeydown(event: KeyboardEvent): void;
    onHide(): void;
    onShow(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitButton, "p-splitButton", never, { "model": { "alias": "model"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "raised": { "alias": "raised"; "required": false; }; "rounded": { "alias": "rounded"; "required": false; }; "text": { "alias": "text"; "required": false; }; "outlined": { "alias": "outlined"; "required": false; }; "size": { "alias": "size"; "required": false; }; "plain": { "alias": "plain"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "iconPos": { "alias": "iconPos"; "required": false; }; "label": { "alias": "label"; "required": false; }; "tooltip": { "alias": "tooltip"; "required": false; }; "tooltipOptions": { "alias": "tooltipOptions"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "menuStyle": { "alias": "menuStyle"; "required": false; }; "menuStyleClass": { "alias": "menuStyleClass"; "required": false; }; "appendTo": { "alias": "appendTo"; "required": false; }; "dir": { "alias": "dir"; "required": false; }; "expandAriaLabel": { "alias": "expandAriaLabel"; "required": false; }; "showTransitionOptions": { "alias": "showTransitionOptions"; "required": false; }; "hideTransitionOptions": { "alias": "hideTransitionOptions"; "required": false; }; "buttonProps": { "alias": "buttonProps"; "required": false; }; "menuButtonProps": { "alias": "menuButtonProps"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "menuButtonDisabled": { "alias": "menuButtonDisabled"; "required": false; }; "buttonDisabled": { "alias": "buttonDisabled"; "required": false; }; }, { "onClick": "onClick"; "onMenuHide": "onMenuHide"; "onMenuShow": "onMenuShow"; "onDropdownClick": "onDropdownClick"; }, ["templates"], never, false, never>;
    static ngAcceptInputType_raised: unknown;
    static ngAcceptInputType_rounded: unknown;
    static ngAcceptInputType_text: unknown;
    static ngAcceptInputType_outlined: unknown;
    static ngAcceptInputType_plain: unknown;
    static ngAcceptInputType_autofocus: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_tabindex: unknown;
}
export declare class SplitButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SplitButtonModule, [typeof SplitButton], [typeof i1.CommonModule, typeof i2.ButtonModule, typeof i3.TieredMenuModule, typeof i4.AutoFocusModule, typeof i5.ChevronDownIcon], [typeof SplitButton, typeof i2.ButtonModule, typeof i3.TieredMenuModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SplitButtonModule>;
}
export {};
