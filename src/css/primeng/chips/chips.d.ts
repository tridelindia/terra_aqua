import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Nullable } from 'primeng/ts-helpers';
import { ChipsAddEvent, ChipsClickEvent, ChipsContextMenuEvent, ChipsRemoveEvent } from './chips.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/inputtext";
import * as i3 from "primeng/api";
import * as i4 from "primeng/autofocus";
import * as i5 from "primeng/icons/timescircle";
import * as i6 from "primeng/icons/times";
export declare const CHIPS_VALUE_ACCESSOR: any;
/**
 * Chips groups a collection of contents in tabs.
 * @group Components
 */
export declare class Chips implements AfterContentInit, ControlValueAccessor {
    private document;
    el: ElementRef;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * Name of the property to display on a chip.
     * @group Props
     */
    field: string | undefined;
    /**
     * Advisory information to display on input.
     * @group Props
     */
    placeholder: string | undefined;
    /**
     * Maximum number of entries allowed.
     * @group Props
     */
    max: number | undefined;
    /**
     * Maximum length of a chip.
     * @group Props
     */
    maxLength: number | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
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
     * Whether to allow duplicate values or not.
     * @group Props
     */
    allowDuplicate: boolean;
    /**
     * Defines whether duplication check should be case-sensitive
     * @group Props
     */
    caseSensitiveDuplication: boolean;
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the input field.
     * @group Props
     */
    inputStyleClass: string | undefined;
    /**
     * Whether to add an item on tab key press.
     * @group Props
     */
    addOnTab: boolean | undefined;
    /**
     * Whether to add an item when the input loses focus.
     * @group Props
     */
    addOnBlur: boolean | undefined;
    /**
     * Separator char to add an item when pressed in addition to the enter key.
     * @group Props
     */
    separator: string | RegExp | undefined;
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear: boolean;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus: boolean | undefined;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant: 'filled' | 'outlined';
    /**
     * Callback to invoke on chip add.
     * @param {ChipsAddEvent} event - Custom chip add event.
     * @group Emits
     */
    onAdd: EventEmitter<ChipsAddEvent>;
    /**
     * Callback to invoke on chip remove.
     * @param {ChipsRemoveEvent} event - Custom chip remove event.
     * @group Emits
     */
    onRemove: EventEmitter<ChipsRemoveEvent>;
    /**
     * Callback to invoke on focus of input field.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus: EventEmitter<Event>;
    /**
     * Callback to invoke on blur of input field.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur: EventEmitter<Event>;
    /**
     * Callback to invoke on chip clicked.
     * @param {ChipsClickEvent} event - Custom chip click event.
     * @group Emits
     */
    onChipClick: EventEmitter<ChipsClickEvent>;
    /**
     * Callback to invoke on chip contextmenu.
     * @param {ChipsClickEvent} event - Custom chip contextmenu event.
     * @group Emits
     */
    onChipContextMenu: EventEmitter<ChipsContextMenuEvent>;
    /**
     * Callback to invoke on clear token clicked.
     * @group Emits
     */
    onClear: EventEmitter<any>;
    inputViewChild: ElementRef;
    containerViewChild: ElementRef;
    templates: QueryList<any>;
    itemTemplate: Nullable<TemplateRef<any>>;
    removeTokenIconTemplate: Nullable<TemplateRef<any>>;
    clearIconTemplate: Nullable<TemplateRef<any>>;
    value: any;
    onModelChange: Function;
    onModelTouched: Function;
    valueChanged: Nullable<boolean>;
    id: string;
    focused: Nullable<boolean>;
    focusedIndex: Nullable<number>;
    filled: Nullable<boolean>;
    get focusedOptionId(): string;
    get isMaxedOut(): boolean;
    constructor(document: Document, el: ElementRef, cd: ChangeDetectorRef, config: PrimeNGConfig);
    ngAfterContentInit(): void;
    onWrapperClick(): void;
    onContainerFocus(): void;
    onContainerBlur(): void;
    onContainerKeyDown(event: any): void;
    onArrowLeftKeyOn(): void;
    onArrowRightKeyOn(): void;
    onBackspaceKeyOn(event: any): void;
    onInput(): void;
    onPaste(event: any): void;
    updateFilledState(): void;
    onItemClick(event: Event, item: any): void;
    onItemContextMenu(event: Event, item: any): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    resolveFieldData(data: any, field: string): any;
    onInputFocus(event: FocusEvent): void;
    onInputBlur(event: FocusEvent): void;
    removeItem(event: Event, index: number): void;
    addItem(event: Event, item: string, preventDefault: boolean): void;
    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    clear(): void;
    onKeyDown(event: any): void;
    updateMaxedOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Chips, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Chips, "p-chips", never, { "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "field": { "alias": "field"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "max": { "alias": "max"; "required": false; }; "maxLength": { "alias": "maxLength"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "allowDuplicate": { "alias": "allowDuplicate"; "required": false; }; "caseSensitiveDuplication": { "alias": "caseSensitiveDuplication"; "required": false; }; "inputStyle": { "alias": "inputStyle"; "required": false; }; "inputStyleClass": { "alias": "inputStyleClass"; "required": false; }; "addOnTab": { "alias": "addOnTab"; "required": false; }; "addOnBlur": { "alias": "addOnBlur"; "required": false; }; "separator": { "alias": "separator"; "required": false; }; "showClear": { "alias": "showClear"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; }, { "onAdd": "onAdd"; "onRemove": "onRemove"; "onFocus": "onFocus"; "onBlur": "onBlur"; "onChipClick": "onChipClick"; "onChipContextMenu": "onChipContextMenu"; "onClear": "onClear"; }, ["templates"], never, false, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_max: unknown;
    static ngAcceptInputType_tabindex: unknown;
    static ngAcceptInputType_allowDuplicate: unknown;
    static ngAcceptInputType_caseSensitiveDuplication: unknown;
    static ngAcceptInputType_addOnTab: unknown;
    static ngAcceptInputType_addOnBlur: unknown;
    static ngAcceptInputType_showClear: unknown;
    static ngAcceptInputType_autofocus: unknown;
}
export declare class ChipsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ChipsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ChipsModule, [typeof Chips], [typeof i1.CommonModule, typeof i2.InputTextModule, typeof i3.SharedModule, typeof i4.AutoFocusModule, typeof i5.TimesCircleIcon, typeof i6.TimesIcon], [typeof Chips, typeof i2.InputTextModule, typeof i3.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ChipsModule>;
}
