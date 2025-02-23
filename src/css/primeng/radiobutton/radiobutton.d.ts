import { ChangeDetectorRef, ElementRef, EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Nullable } from 'primeng/ts-helpers';
import { PrimeNGConfig } from 'primeng/api';
import { RadioButtonClickEvent } from './radiobutton.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/autofocus";
export declare const RADIO_VALUE_ACCESSOR: any;
export declare class RadioControlRegistry {
    private accessors;
    add(control: NgControl, accessor: RadioButton): void;
    remove(accessor: RadioButton): void;
    select(accessor: RadioButton): void;
    private isSameGroup;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlRegistry, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RadioControlRegistry>;
}
/**
 * RadioButton is an extension to standard radio button element with theming.
 * @group Components
 */
export declare class RadioButton implements ControlValueAccessor, OnInit, OnDestroy {
    cd: ChangeDetectorRef;
    private injector;
    private registry;
    config: PrimeNGConfig;
    /**
     * Value of the radiobutton.
     * @group Props
     */
    value: any;
    /**
     * The name of the form control.
     * @group Props
     */
    formControlName: string | undefined;
    /**
     * Name of the radiobutton group.
     * @group Props
     */
    name: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Label of the radiobutton.
     * @group Props
     */
    label: string | undefined;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant: 'filled' | 'outlined';
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * Used to define a string that labels the input element.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Inline style of the component.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Style class of the label.
     * @group Props
     */
    labelStyleClass: string | undefined;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    /**
     * Callback to invoke on radio button click.
     * @param {RadioButtonClickEvent} event - Custom click event.
     * @group Emits
     */
    onClick: EventEmitter<RadioButtonClickEvent>;
    /**
     * Callback to invoke when the receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus: EventEmitter<Event>;
    /**
     * Callback to invoke when the loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur: EventEmitter<Event>;
    inputViewChild: ElementRef;
    onModelChange: Function;
    onModelTouched: Function;
    checked: Nullable<boolean>;
    focused: Nullable<boolean>;
    control: Nullable<NgControl>;
    constructor(cd: ChangeDetectorRef, injector: Injector, registry: RadioControlRegistry, config: PrimeNGConfig);
    ngOnInit(): void;
    handleClick(event: Event, radioButton: HTMLElement, focus: boolean): void;
    select(event: Event): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    onInputFocus(event: Event): void;
    onInputBlur(event: Event): void;
    /**
     * Applies focus to input field.
     * @group Method
     */
    focus(): void;
    ngOnDestroy(): void;
    private checkName;
    private throwNameError;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RadioButton, "p-radioButton", never, { "value": { "alias": "value"; "required": false; }; "formControlName": { "alias": "formControlName"; "required": false; }; "name": { "alias": "name"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "label": { "alias": "label"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "labelStyleClass": { "alias": "labelStyleClass"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; }, { "onClick": "onClick"; "onFocus": "onFocus"; "onBlur": "onBlur"; }, never, never, false, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_tabindex: unknown;
    static ngAcceptInputType_autofocus: unknown;
}
export declare class RadioButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<RadioButtonModule, [typeof RadioButton], [typeof i1.CommonModule, typeof i2.AutoFocusModule], [typeof RadioButton]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<RadioButtonModule>;
}
