import { AfterContentInit, AfterViewInit, ElementRef, EventEmitter, OnDestroy, QueryList, TemplateRef } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';
/**
 * Button directive is an extension to button component.
 * @group Components
 */
export declare class ButtonDirective implements AfterViewInit, OnDestroy {
    el: ElementRef;
    private document;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos: ButtonIconPosition;
    /**
     * Uses to pass attributes to the loading icon's DOM element.
     * @group Props
     */
    loadingIcon: string | undefined;
    /**
     * Text of the button.
     * @group Props
     */
    get label(): string | undefined;
    set label(val: string);
    /**
     * Name of the icon.
     * @group Props
     */
    get icon(): string;
    set icon(val: string);
    /**
     * Whether the button is in loading state.
     * @group Props
     */
    get loading(): boolean;
    set loading(val: boolean);
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
    _label: string | undefined;
    _icon: string | undefined;
    _loading: boolean;
    initialized: boolean | undefined;
    private get htmlElement();
    private _internalClasses;
    constructor(el: ElementRef, document: Document);
    ngAfterViewInit(): void;
    getStyleClass(): string[];
    setStyleClass(): void;
    createLabel(): void;
    createIcon(): void;
    updateLabel(): void;
    updateIcon(): void;
    getIconClass(): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ButtonDirective, "[pButton]", never, { "iconPos": { "alias": "iconPos"; "required": false; }; "loadingIcon": { "alias": "loadingIcon"; "required": false; }; "label": { "alias": "label"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "raised": { "alias": "raised"; "required": false; }; "rounded": { "alias": "rounded"; "required": false; }; "text": { "alias": "text"; "required": false; }; "outlined": { "alias": "outlined"; "required": false; }; "size": { "alias": "size"; "required": false; }; "plain": { "alias": "plain"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_raised: unknown;
    static ngAcceptInputType_rounded: unknown;
    static ngAcceptInputType_text: unknown;
    static ngAcceptInputType_outlined: unknown;
    static ngAcceptInputType_plain: unknown;
}
/**
 * Button is an extension to standard button element with icons and theming.
 * @group Components
 */
export declare class Button implements AfterContentInit {
    el: ElementRef;
    /**
     * Type of the button.
     * @group Props
     */
    type: string;
    /**
     * Position of the icon.
     * @group Props
     */
    iconPos: ButtonIconPosition;
    /**
     * Name of the icon.
     * @group Props
     */
    icon: string | undefined;
    /**
     * Value of the badge.
     * @group Props
     */
    badge: string | undefined;
    /**
     * Uses to pass attributes to the label's DOM element.
     * @group Props
     */
    label: string | undefined;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Whether the button is in loading state.
     * @group Props
     */
    loading: boolean;
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon: string | undefined;
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
     * Add a plain textual class to the button without a background initially.
     * @group Props
     */
    plain: boolean;
    /**
     * Defines the style of the button.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
    /**
     * Add a border class without a background initially.
     * @group Props
     */
    outlined: boolean;
    /**
     * Add a link style to the button.
     * @group Props
     */
    link: boolean;
    /**
     * Add a tabindex to the button.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * Defines the size of the button.
     * @group Props
     */
    size: 'small' | 'large' | undefined;
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
     * Style class of the badge.
     * @group Props
     */
    badgeClass: string | undefined;
    /**
     * Used to define a string that autocomplete attribute the current element.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    /**
     * Callback to execute when button is clicked.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (click).
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    onClick: EventEmitter<MouseEvent>;
    /**
     * Callback to execute when button is focused.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (focus).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    onFocus: EventEmitter<FocusEvent>;
    /**
     * Callback to execute when button loses focus.
     * This event is intended to be used with the <p-button> component. Using a regular <button> element, use (blur).
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    onBlur: EventEmitter<FocusEvent>;
    contentTemplate: TemplateRef<any> | undefined;
    loadingIconTemplate: TemplateRef<any> | undefined;
    iconTemplate: TemplateRef<any> | undefined;
    templates: QueryList<PrimeTemplate> | undefined;
    constructor(el: ElementRef);
    spinnerIconClass(): string;
    iconClass(): {
        'p-button-icon': boolean;
        'p-button-icon-left': string;
        'p-button-icon-right': string;
        'p-button-icon-top': string;
        'p-button-icon-bottom': string;
    };
    get buttonClass(): {
        [x: string]: string | boolean;
        'p-button p-component': boolean;
        'p-button-icon-only': boolean;
        'p-button-vertical': string;
        'p-button-loading': boolean;
        'p-button-loading-label-only': boolean;
        'p-button-link': boolean;
        'p-button-raised': boolean;
        'p-button-rounded': boolean;
        'p-button-text': boolean;
        'p-button-outlined': boolean;
        'p-button-sm': boolean;
        'p-button-lg': boolean;
        'p-button-plain': boolean;
    };
    ngAfterContentInit(): void;
    badgeStyleClass(): {
        'p-badge p-component': boolean;
        'p-badge-no-gutter': boolean;
    };
    /**
     * Applies focus.
     * @group Method
     */
    focus(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Button, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Button, "p-button", never, { "type": { "alias": "type"; "required": false; }; "iconPos": { "alias": "iconPos"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "badge": { "alias": "badge"; "required": false; }; "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "loadingIcon": { "alias": "loadingIcon"; "required": false; }; "raised": { "alias": "raised"; "required": false; }; "rounded": { "alias": "rounded"; "required": false; }; "text": { "alias": "text"; "required": false; }; "plain": { "alias": "plain"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "outlined": { "alias": "outlined"; "required": false; }; "link": { "alias": "link"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "size": { "alias": "size"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "badgeClass": { "alias": "badgeClass"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; }, { "onClick": "onClick"; "onFocus": "onFocus"; "onBlur": "onBlur"; }, ["templates"], ["*"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_loading: unknown;
    static ngAcceptInputType_raised: unknown;
    static ngAcceptInputType_rounded: unknown;
    static ngAcceptInputType_text: unknown;
    static ngAcceptInputType_plain: unknown;
    static ngAcceptInputType_outlined: unknown;
    static ngAcceptInputType_link: unknown;
    static ngAcceptInputType_tabindex: unknown;
    static ngAcceptInputType_autofocus: unknown;
}
export declare class ButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ButtonModule, never, [typeof ButtonDirective, typeof Button], [typeof ButtonDirective, typeof Button, typeof i1.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ButtonModule>;
}
export {};
