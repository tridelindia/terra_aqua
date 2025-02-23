import { AnimationEvent } from '@angular/animations';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnInit, QueryList, Renderer2, Signal, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FilterService, OverlayOptions, OverlayService, PrimeNGConfig, PrimeTemplate } from 'primeng/api';
import { Overlay } from 'primeng/overlay';
import { Scroller } from 'primeng/scroller';
import { ScrollerOptions } from 'primeng/api';
import { Nullable } from 'primeng/ts-helpers';
import { MultiSelectRemoveEvent, MultiSelectFilterOptions, MultiSelectFilterEvent, MultiSelectBlurEvent, MultiSelectChangeEvent, MultiSelectFocusEvent, MultiSelectLazyLoadEvent, MultiSelectSelectAllChangeEvent } from './multiselect.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/overlay";
import * as i3 from "primeng/api";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/ripple";
import * as i6 from "primeng/scroller";
import * as i7 from "primeng/autofocus";
import * as i8 from "primeng/icons/check";
import * as i9 from "primeng/icons/search";
import * as i10 from "primeng/icons/timescircle";
import * as i11 from "primeng/icons/times";
import * as i12 from "primeng/icons/chevrondown";
import * as i13 from "primeng/icons/minus";
export declare const MULTISELECT_VALUE_ACCESSOR: any;
export declare class MultiSelectItem {
    config: PrimeNGConfig;
    id: string | undefined;
    option: any;
    selected: boolean | undefined;
    label: string | undefined;
    disabled: boolean | undefined;
    itemSize: number | undefined;
    focused: boolean | undefined;
    ariaPosInset: string | undefined;
    ariaSetSize: string | undefined;
    template: TemplateRef<any> | undefined;
    checkIconTemplate: TemplateRef<any> | undefined;
    itemCheckboxIconTemplate: TemplateRef<any> | undefined;
    onClick: EventEmitter<any>;
    onMouseEnter: EventEmitter<any>;
    constructor(config: PrimeNGConfig);
    onOptionClick(event: Event): void;
    onOptionMouseEnter(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MultiSelectItem, "p-multiSelectItem", never, { "id": { "alias": "id"; "required": false; }; "option": { "alias": "option"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "label": { "alias": "label"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "itemSize": { "alias": "itemSize"; "required": false; }; "focused": { "alias": "focused"; "required": false; }; "ariaPosInset": { "alias": "ariaPosInset"; "required": false; }; "ariaSetSize": { "alias": "ariaSetSize"; "required": false; }; "template": { "alias": "template"; "required": false; }; "checkIconTemplate": { "alias": "checkIconTemplate"; "required": false; }; "itemCheckboxIconTemplate": { "alias": "itemCheckboxIconTemplate"; "required": false; }; }, { "onClick": "onClick"; "onMouseEnter": "onMouseEnter"; }, never, never, false, never>;
    static ngAcceptInputType_selected: unknown;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_itemSize: unknown;
    static ngAcceptInputType_focused: unknown;
}
/**
 * MultiSelect is used to select multiple items from a collection.
 * @group Components
 */
export declare class MultiSelect implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, ControlValueAccessor {
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    zone: NgZone;
    filterService: FilterService;
    config: PrimeNGConfig;
    overlayService: OverlayService;
    /**
     * Unique identifier of the component
     * @group Props
     */
    id: string | undefined;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel: string | undefined;
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
     * Inline style of the overlay panel.
     * @group Props
     */
    panelStyle: any;
    /**
     * Style class of the overlay panel element.
     * @group Props
     */
    panelStyleClass: string | undefined;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId: string | undefined;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled: boolean | undefined;
    /**
     * When present, it specifies that the component cannot be edited.
     * @group Props
     */
    readonly: boolean | undefined;
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    group: boolean | undefined;
    /**
     * When specified, displays an input field to filter the items on keyup.
     * @group Props
     */
    filter: boolean;
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    filterPlaceHolder: string | undefined;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale: string | undefined;
    /**
     * Specifies the visibility of the options panel.
     * @group Props
     */
    overlayVisible: boolean | undefined;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex: number | undefined;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant: 'filled' | 'outlined';
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey: string | undefined;
    /**
     * Name of the input element.
     * @group Props
     */
    name: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * Whether to show labels of selected item labels or use default label.
     * @group Props
     * @defaultValue true
     */
    set displaySelectedLabel(val: boolean);
    get displaySelectedLabel(): boolean;
    /**
     * Decides how many selected item labels to show at most.
     * @group Props
     * @defaultValue 3
     */
    set maxSelectedLabels(val: number | null | undefined);
    get maxSelectedLabels(): number | null | undefined;
    /**
     * Decides how many selected item labels to show at most.
     * @group Props
     */
    selectionLimit: number | null | undefined;
    /**
     * Label to display after exceeding max selected labels e.g. ({0} items selected), defaults "ellipsis" keyword to indicate a text-overflow.
     * @group Props
     */
    selectedItemsLabel: string | undefined;
    /**
     * Whether to show the checkbox at header to toggle all items at once.
     * @group Props
     */
    showToggleAll: boolean;
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    emptyFilterMessage: string;
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    emptyMessage: string;
    /**
     * Clears the filter value when hiding the dropdown.
     * @group Props
     */
    resetFilterOnHide: boolean;
    /**
     * Icon class of the dropdown icon.
     * @group Props
     */
    dropdownIcon: string | undefined;
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel: string | undefined;
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue: string | undefined;
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled: string | undefined;
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    optionGroupLabel: string | undefined;
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    optionGroupChildren: string;
    /**
     * Whether to show the header.
     * @group Props
     */
    showHeader: boolean;
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy: string | undefined;
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    scrollHeight: string;
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy: boolean;
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll: boolean | undefined;
    /**
     * Whether the multiselect is in loading state.
     * @group Props
     */
    loading: boolean | undefined;
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize: number | undefined;
    /**
     * Icon to display in loading state.
     * @group Props
     */
    loadingIcon: string | undefined;
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions: ScrollerOptions | undefined;
    /**
     * Whether to use overlay API feature. The properties of overlay API can be used like an object in it.
     * @group Props
     */
    overlayOptions: OverlayOptions | undefined;
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    ariaFilterLabel: string | undefined;
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    filterMatchMode: 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte';
    /**
     * Advisory information to display in a tooltip on hover.
     * @group Props
     */
    tooltip: string;
    /**
     * Position of the tooltip.
     * @group Props
     */
    tooltipPosition: 'top' | 'left' | 'right' | 'bottom';
    /**
     * Type of CSS position.
     * @group Props
     */
    tooltipPositionStyle: string;
    /**
     * Style class of the tooltip.
     * @group Props
     */
    tooltipStyleClass: string | undefined;
    /**
     * Applies focus to the filter element when the overlay is shown.
     * @group Props
     */
    autofocusFilter: boolean;
    /**
     * Defines how the selected items are displayed.
     * @group Props
     */
    display: string | 'comma' | 'chip';
    /**
     * Defines the autocomplete is active.
     * @group Props
     */
    autocomplete: string;
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
     * @deprecated since v14.2.0, use overlayOptions property instead.
     * Whether to automatically manage layering.
     * @group Props
     */
    get autoZIndex(): boolean | undefined;
    set autoZIndex(val: boolean | undefined);
    /**
     * @deprecated since v14.2.0, use overlayOptions property instead.
     * Base zIndex value to use in layering.
     * @group Props
     */
    get baseZIndex(): number | undefined;
    set baseZIndex(val: number | undefined);
    /**
     * Transition options of the show animation.
     * @group Props
     * @deprecated since v14.2.0, use overlayOptions property instead.
     */
    get showTransitionOptions(): string | undefined;
    set showTransitionOptions(val: string | undefined);
    /**
     * Transition options of the hide animation.
     * @group Props
     * @deprecated since v14.2.0, use overlayOptions property instead.
     */
    get hideTransitionOptions(): string | undefined;
    set hideTransitionOptions(val: string | undefined);
    /**
     * Label to display when there are no selections.
     * @group Props
     * @deprecated Use placeholder instead.
     */
    set defaultLabel(val: string | undefined);
    get defaultLabel(): string | undefined;
    /**
     * Label to display when there are no selections.
     * @group Props
     */
    set placeholder(val: string | undefined);
    get placeholder(): Signal<string | undefined>;
    /**
     * An array of objects to display as the available options.
     * @group Props
     */
    get options(): any[] | undefined;
    set options(val: any[] | undefined);
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    get filterValue(): string | undefined | null;
    set filterValue(val: string | undefined | null);
    /**
     * Item size of item to be virtual scrolled.
     * @group Props
     * @deprecated use virtualScrollItemSize property instead.
     */
    get itemSize(): number | undefined;
    set itemSize(val: number | undefined);
    /**
     * Whether all data is selected.
     * @group Props
     */
    get selectAll(): boolean | undefined | null;
    set selectAll(value: boolean | undefined | null);
    /**
     * Indicates whether to focus on options when hovering over them, defaults to optionLabel.
     * @group Props
     */
    focusOnHover: boolean;
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    filterFields: any[] | undefined;
    /**
     * Determines if the option will be selected on focus.
     * @group Props
     */
    selectOnFocus: boolean;
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    autoOptionFocus: boolean;
    /**
     * Callback to invoke when value changes.
     * @param {MultiSelectChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange: EventEmitter<MultiSelectChangeEvent>;
    /**
     * Callback to invoke when data is filtered.
     * @param {MultiSelectFilterEvent} event - Custom filter event.
     * @group Emits
     */
    onFilter: EventEmitter<MultiSelectFilterEvent>;
    /**
     * Callback to invoke when multiselect receives focus.
     * @param {MultiSelectFocusEvent} event - Custom focus event.
     * @group Emits
     */
    onFocus: EventEmitter<MultiSelectFocusEvent>;
    /**
     * Callback to invoke when multiselect loses focus.
     * @param {MultiSelectBlurEvent} event - Custom blur event.
     * @group Emits
     */
    onBlur: EventEmitter<MultiSelectBlurEvent>;
    /**
     * Callback to invoke when component is clicked.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onClick: EventEmitter<Event>;
    /**
     * Callback to invoke when input field is cleared.
     * @group Emits
     */
    onClear: EventEmitter<void>;
    /**
     * Callback to invoke when overlay panel becomes visible.
     * @group Emits
     */
    onPanelShow: EventEmitter<void>;
    /**
     * Callback to invoke when overlay panel becomes hidden.
     * @group Emits
     */
    onPanelHide: EventEmitter<void>;
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectLazyLoadEvent} event - Lazy load event.
     * @group Emits
     */
    onLazyLoad: EventEmitter<MultiSelectLazyLoadEvent>;
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {MultiSelectRemoveEvent} event - Remove event.
     * @group Emits
     */
    onRemove: EventEmitter<MultiSelectRemoveEvent>;
    /**
     * Callback to invoke when all data is selected.
     * @param {MultiSelectSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    onSelectAllChange: EventEmitter<MultiSelectSelectAllChangeEvent>;
    containerViewChild: Nullable<ElementRef>;
    overlayViewChild: Nullable<Overlay>;
    filterInputChild: Nullable<ElementRef>;
    focusInputViewChild: Nullable<ElementRef>;
    itemsViewChild: Nullable<ElementRef>;
    scroller: Nullable<Scroller>;
    lastHiddenFocusableElementOnOverlay: Nullable<ElementRef>;
    firstHiddenFocusableElementOnOverlay: Nullable<ElementRef>;
    headerCheckboxViewChild: Nullable<ElementRef>;
    footerFacet: any;
    headerFacet: any;
    templates: Nullable<QueryList<PrimeTemplate>>;
    searchValue: Nullable<string>;
    searchTimeout: any;
    _selectAll: boolean | undefined | null;
    _autoZIndex: boolean | undefined;
    _baseZIndex: number | undefined;
    _showTransitionOptions: string | undefined;
    _hideTransitionOptions: string | undefined;
    _defaultLabel: string | undefined;
    _placeholder: import("@angular/core").WritableSignal<string>;
    _itemSize: number | undefined;
    _selectionLimit: number | undefined;
    _disableTooltip: boolean;
    value: any[];
    _filteredOptions: any[] | undefined | null;
    onModelChange: Function;
    onModelTouched: Function;
    valuesAsString: string | undefined;
    focus: boolean | undefined;
    filtered: boolean | undefined;
    itemTemplate: TemplateRef<any> | undefined;
    groupTemplate: TemplateRef<any> | undefined;
    loaderTemplate: TemplateRef<any> | undefined;
    headerTemplate: TemplateRef<any> | undefined;
    filterTemplate: TemplateRef<any> | undefined;
    footerTemplate: TemplateRef<any> | undefined;
    emptyFilterTemplate: TemplateRef<any> | undefined;
    emptyTemplate: TemplateRef<any> | undefined;
    selectedItemsTemplate: TemplateRef<any> | undefined;
    checkIconTemplate: TemplateRef<any> | undefined;
    loadingIconTemplate: TemplateRef<any> | undefined;
    filterIconTemplate: TemplateRef<any> | undefined;
    removeTokenIconTemplate: TemplateRef<any> | undefined;
    closeIconTemplate: TemplateRef<any> | undefined;
    clearIconTemplate: TemplateRef<any> | undefined;
    dropdownIconTemplate: TemplateRef<any> | undefined;
    itemCheckboxIconTemplate: TemplateRef<any> | undefined;
    headerCheckboxIconTemplate: TemplateRef<any> | undefined;
    headerCheckboxFocus: boolean | undefined;
    filterOptions: MultiSelectFilterOptions | undefined;
    preventModelTouched: boolean | undefined;
    preventDocumentDefault: boolean | undefined;
    focused: boolean;
    itemsWrapper: any;
    _displaySelectedLabel: boolean;
    _maxSelectedLabels: number;
    modelValue: import("@angular/core").WritableSignal<any>;
    _filterValue: import("@angular/core").WritableSignal<any>;
    _options: import("@angular/core").WritableSignal<any[]>;
    startRangeIndex: import("@angular/core").WritableSignal<number>;
    focusedOptionIndex: import("@angular/core").WritableSignal<number>;
    selectedOptions: any;
    clickInProgress: boolean;
    get containerClass(): {
        'p-multiselect p-component p-inputwrapper': boolean;
        'p-disabled': boolean;
        'p-multiselect-clearable': boolean;
        'p-multiselect-chip': boolean;
        'p-focus': boolean;
        'p-variant-filled': boolean;
    };
    get inputClass(): {
        'p-multiselect-label p-inputtext': boolean;
        'p-placeholder': boolean;
        'p-multiselect-label-empty': boolean;
    };
    get panelClass(): {
        'p-multiselect-panel p-component': boolean;
        'p-input-filled': boolean;
        'p-ripple-disabled': boolean;
    };
    get labelClass(): {
        'p-multiselect-label': boolean;
        'p-placeholder': boolean;
        'p-multiselect-label-empty': boolean;
    };
    get emptyMessageLabel(): string;
    get emptyFilterMessageLabel(): string;
    get filled(): boolean;
    get isVisibleClearIcon(): boolean | undefined;
    get toggleAllAriaLabel(): string;
    get closeAriaLabel(): string;
    get listLabel(): string;
    private getAllVisibleAndNonVisibleOptions;
    visibleOptions: Signal<any>;
    label: Signal<any>;
    chipSelectedItems: Signal<any>;
    constructor(el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef, zone: NgZone, filterService: FilterService, config: PrimeNGConfig, overlayService: OverlayService);
    ngOnInit(): void;
    maxSelectionLimitReached(): boolean;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    flatOptions(options: any): any;
    autoUpdateModel(): void;
    /**
     * Updates the model value.
     * @group Method
     */
    updateModel(value: any, event?: any): void;
    onInputClick(event: any): void;
    onOptionSelect(event: any, isFocus?: boolean, index?: number): void;
    findSelectedOptionIndex(): any;
    onOptionSelectRange(event: any, start?: number, end?: number): void;
    searchFields(): string[];
    findNearestSelectedOptionIndex(index: any, firstCheckUp?: boolean): any;
    findPrevSelectedOptionIndex(index: any): number;
    findFirstFocusedOptionIndex(): any;
    findFirstOptionIndex(): any;
    findFirstSelectedOptionIndex(): any;
    findNextSelectedOptionIndex(index: any): any;
    equalityKey(): string;
    hasSelectedOption(): boolean;
    isSelectionAllDisabled(): boolean;
    isValidSelectedOption(option: any): any;
    isOptionGroup(option: any): any;
    isValidOption(option: any): boolean;
    isOptionDisabled(option: any): any;
    isSelected(option: any): any;
    isOptionMatched(option: any): any;
    isEmpty(): boolean;
    getOptionIndex(index: any, scrollerOptions: any): any;
    getAriaPosInset(index: any): any;
    get ariaSetSize(): any;
    getLabelByValue(value: any): any;
    getSelectedItemsLabel(): any;
    getOptionLabel(option: any): any;
    getOptionValue(option: any): any;
    getOptionGroupLabel(optionGroup: any): any;
    getOptionGroupChildren(optionGroup: any): any;
    onKeyDown(event: KeyboardEvent): void;
    onFilterKeyDown(event: KeyboardEvent): void;
    onArrowLeftKey(event: KeyboardEvent, pressedInInputText?: boolean): void;
    onArrowDownKey(event: any): void;
    onArrowUpKey(event: any, pressedInInputText?: boolean): void;
    onHomeKey(event: any, pressedInInputText?: boolean): void;
    onEndKey(event: any, pressedInInputText?: boolean): void;
    onPageDownKey(event: any): void;
    onPageUpKey(event: any): void;
    onEnterKey(event: any): void;
    onEscapeKey(event: any): void;
    onDeleteKey(event: KeyboardEvent): void;
    onTabKey(event: any, pressedInInputText?: boolean): void;
    onShiftKey(): void;
    onContainerClick(event: any): void;
    onFirstHiddenFocus(event: any): void;
    onInputFocus(event: Event): void;
    onInputBlur(event: Event): void;
    onFilterInputChange(event: KeyboardEvent): void;
    onLastHiddenFocus(event: any): void;
    onOptionMouseEnter(event: any, index: any): void;
    onHeaderCheckboxKeyDown(event: any): void;
    onremoveTokenIconKeyDown(event: any, item: any): void;
    onFilterBlur(event: any): void;
    onHeaderCheckboxFocus(): void;
    onHeaderCheckboxBlur(): void;
    onToggleAll(event: any): void;
    changeFocusedOptionIndex(event: any, index: any): void;
    get virtualScrollerDisabled(): boolean;
    scrollInView(index?: number): void;
    get focusedOptionId(): string;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    allSelected(): any;
    partialSelected(): boolean;
    /**
     * Displays the panel.
     * @group Method
     */
    show(isFocus?: any): void;
    /**
     * Hides the panel.
     * @group Method
     */
    hide(isFocus?: any): void;
    onOverlayAnimationStart(event: AnimationEvent): void;
    resetFilter(): void;
    close(event: Event): void;
    clear(event: Event): void;
    labelContainerMouseLeave(): void;
    removeOption(optionValue: any, event: any): void;
    findNextItem(item: any): HTMLElement | null;
    findPrevItem(item: any): HTMLElement | null;
    findNextOptionIndex(index: any): any;
    findPrevOptionIndex(index: any): any;
    findLastSelectedOptionIndex(): number;
    findLastFocusedOptionIndex(): number;
    findLastOptionIndex(): number;
    searchOptions(event: any, char: any): boolean;
    activateFilter(): void;
    hasFocusableElements(): boolean;
    hasFilter(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelect, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MultiSelect, "p-multiSelect", never, { "id": { "alias": "id"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "panelStyle": { "alias": "panelStyle"; "required": false; }; "panelStyleClass": { "alias": "panelStyleClass"; "required": false; }; "inputId": { "alias": "inputId"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "readonly": { "alias": "readonly"; "required": false; }; "group": { "alias": "group"; "required": false; }; "filter": { "alias": "filter"; "required": false; }; "filterPlaceHolder": { "alias": "filterPlaceHolder"; "required": false; }; "filterLocale": { "alias": "filterLocale"; "required": false; }; "overlayVisible": { "alias": "overlayVisible"; "required": false; }; "tabindex": { "alias": "tabindex"; "required": false; }; "variant": { "alias": "variant"; "required": false; }; "appendTo": { "alias": "appendTo"; "required": false; }; "dataKey": { "alias": "dataKey"; "required": false; }; "name": { "alias": "name"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "displaySelectedLabel": { "alias": "displaySelectedLabel"; "required": false; }; "maxSelectedLabels": { "alias": "maxSelectedLabels"; "required": false; }; "selectionLimit": { "alias": "selectionLimit"; "required": false; }; "selectedItemsLabel": { "alias": "selectedItemsLabel"; "required": false; }; "showToggleAll": { "alias": "showToggleAll"; "required": false; }; "emptyFilterMessage": { "alias": "emptyFilterMessage"; "required": false; }; "emptyMessage": { "alias": "emptyMessage"; "required": false; }; "resetFilterOnHide": { "alias": "resetFilterOnHide"; "required": false; }; "dropdownIcon": { "alias": "dropdownIcon"; "required": false; }; "optionLabel": { "alias": "optionLabel"; "required": false; }; "optionValue": { "alias": "optionValue"; "required": false; }; "optionDisabled": { "alias": "optionDisabled"; "required": false; }; "optionGroupLabel": { "alias": "optionGroupLabel"; "required": false; }; "optionGroupChildren": { "alias": "optionGroupChildren"; "required": false; }; "showHeader": { "alias": "showHeader"; "required": false; }; "filterBy": { "alias": "filterBy"; "required": false; }; "scrollHeight": { "alias": "scrollHeight"; "required": false; }; "lazy": { "alias": "lazy"; "required": false; }; "virtualScroll": { "alias": "virtualScroll"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "virtualScrollItemSize": { "alias": "virtualScrollItemSize"; "required": false; }; "loadingIcon": { "alias": "loadingIcon"; "required": false; }; "virtualScrollOptions": { "alias": "virtualScrollOptions"; "required": false; }; "overlayOptions": { "alias": "overlayOptions"; "required": false; }; "ariaFilterLabel": { "alias": "ariaFilterLabel"; "required": false; }; "filterMatchMode": { "alias": "filterMatchMode"; "required": false; }; "tooltip": { "alias": "tooltip"; "required": false; }; "tooltipPosition": { "alias": "tooltipPosition"; "required": false; }; "tooltipPositionStyle": { "alias": "tooltipPositionStyle"; "required": false; }; "tooltipStyleClass": { "alias": "tooltipStyleClass"; "required": false; }; "autofocusFilter": { "alias": "autofocusFilter"; "required": false; }; "display": { "alias": "display"; "required": false; }; "autocomplete": { "alias": "autocomplete"; "required": false; }; "showClear": { "alias": "showClear"; "required": false; }; "autofocus": { "alias": "autofocus"; "required": false; }; "autoZIndex": { "alias": "autoZIndex"; "required": false; }; "baseZIndex": { "alias": "baseZIndex"; "required": false; }; "showTransitionOptions": { "alias": "showTransitionOptions"; "required": false; }; "hideTransitionOptions": { "alias": "hideTransitionOptions"; "required": false; }; "defaultLabel": { "alias": "defaultLabel"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "options": { "alias": "options"; "required": false; }; "filterValue": { "alias": "filterValue"; "required": false; }; "itemSize": { "alias": "itemSize"; "required": false; }; "selectAll": { "alias": "selectAll"; "required": false; }; "focusOnHover": { "alias": "focusOnHover"; "required": false; }; "filterFields": { "alias": "filterFields"; "required": false; }; "selectOnFocus": { "alias": "selectOnFocus"; "required": false; }; "autoOptionFocus": { "alias": "autoOptionFocus"; "required": false; }; }, { "onChange": "onChange"; "onFilter": "onFilter"; "onFocus": "onFocus"; "onBlur": "onBlur"; "onClick": "onClick"; "onClear": "onClear"; "onPanelShow": "onPanelShow"; "onPanelHide": "onPanelHide"; "onLazyLoad": "onLazyLoad"; "onRemove": "onRemove"; "onSelectAllChange": "onSelectAllChange"; }, ["footerFacet", "headerFacet", "templates"], ["p-header", "p-footer"], false, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_readonly: unknown;
    static ngAcceptInputType_group: unknown;
    static ngAcceptInputType_filter: unknown;
    static ngAcceptInputType_overlayVisible: unknown;
    static ngAcceptInputType_tabindex: unknown;
    static ngAcceptInputType_selectionLimit: unknown;
    static ngAcceptInputType_showToggleAll: unknown;
    static ngAcceptInputType_resetFilterOnHide: unknown;
    static ngAcceptInputType_showHeader: unknown;
    static ngAcceptInputType_lazy: unknown;
    static ngAcceptInputType_virtualScroll: unknown;
    static ngAcceptInputType_loading: unknown;
    static ngAcceptInputType_virtualScrollItemSize: unknown;
    static ngAcceptInputType_autofocusFilter: unknown;
    static ngAcceptInputType_showClear: unknown;
    static ngAcceptInputType_autofocus: unknown;
    static ngAcceptInputType_focusOnHover: unknown;
    static ngAcceptInputType_selectOnFocus: unknown;
    static ngAcceptInputType_autoOptionFocus: unknown;
}
export declare class MultiSelectModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiSelectModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MultiSelectModule, [typeof MultiSelect, typeof MultiSelectItem], [typeof i1.CommonModule, typeof i2.OverlayModule, typeof i3.SharedModule, typeof i4.TooltipModule, typeof i5.RippleModule, typeof i6.ScrollerModule, typeof i7.AutoFocusModule, typeof i8.CheckIcon, typeof i9.SearchIcon, typeof i10.TimesCircleIcon, typeof i11.TimesIcon, typeof i12.ChevronDownIcon, typeof i8.CheckIcon, typeof i13.MinusIcon], [typeof MultiSelect, typeof i2.OverlayModule, typeof i3.SharedModule, typeof i6.ScrollerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MultiSelectModule>;
}
