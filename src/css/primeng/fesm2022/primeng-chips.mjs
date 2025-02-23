import * as i2 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, booleanAttribute, numberAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, ViewChild, ContentChildren, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i1 from 'primeng/api';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i3 from 'primeng/autofocus';
import { AutoFocusModule } from 'primeng/autofocus';
import { TimesIcon } from 'primeng/icons/times';
import { TimesCircleIcon } from 'primeng/icons/timescircle';
import { InputTextModule } from 'primeng/inputtext';
import { UniqueComponentId } from 'primeng/utils';

const CHIPS_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Chips),
    multi: true
};
/**
 * Chips groups a collection of contents in tabs.
 * @group Components
 */
class Chips {
    document;
    el;
    cd;
    config;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Style class of the element.
     * @group Props
     */
    styleClass;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled;
    /**
     * Name of the property to display on a chip.
     * @group Props
     */
    field;
    /**
     * Advisory information to display on input.
     * @group Props
     */
    placeholder;
    /**
     * Maximum number of entries allowed.
     * @group Props
     */
    max;
    /**
     * Maximum length of a chip.
     * @group Props
     */
    maxLength;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex;
    /**
     * Identifier of the focus input to match a label defined for the component.
     * @group Props
     */
    inputId;
    /**
     * Whether to allow duplicate values or not.
     * @group Props
     */
    allowDuplicate = true;
    /**
     * Defines whether duplication check should be case-sensitive
     * @group Props
     */
    caseSensitiveDuplication = true;
    /**
     * Inline style of the input field.
     * @group Props
     */
    inputStyle;
    /**
     * Style class of the input field.
     * @group Props
     */
    inputStyleClass;
    /**
     * Whether to add an item on tab key press.
     * @group Props
     */
    addOnTab;
    /**
     * Whether to add an item when the input loses focus.
     * @group Props
     */
    addOnBlur;
    /**
     * Separator char to add an item when pressed in addition to the enter key.
     * @group Props
     */
    separator;
    /**
     * When enabled, a clear icon is displayed to clear the value.
     * @group Props
     */
    showClear = false;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant = 'outlined';
    /**
     * Callback to invoke on chip add.
     * @param {ChipsAddEvent} event - Custom chip add event.
     * @group Emits
     */
    onAdd = new EventEmitter();
    /**
     * Callback to invoke on chip remove.
     * @param {ChipsRemoveEvent} event - Custom chip remove event.
     * @group Emits
     */
    onRemove = new EventEmitter();
    /**
     * Callback to invoke on focus of input field.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = new EventEmitter();
    /**
     * Callback to invoke on blur of input field.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = new EventEmitter();
    /**
     * Callback to invoke on chip clicked.
     * @param {ChipsClickEvent} event - Custom chip click event.
     * @group Emits
     */
    onChipClick = new EventEmitter();
    /**
     * Callback to invoke on chip contextmenu.
     * @param {ChipsClickEvent} event - Custom chip contextmenu event.
     * @group Emits
     */
    onChipContextMenu = new EventEmitter();
    /**
     * Callback to invoke on clear token clicked.
     * @group Emits
     */
    onClear = new EventEmitter();
    inputViewChild;
    containerViewChild;
    templates;
    itemTemplate;
    removeTokenIconTemplate;
    clearIconTemplate;
    value;
    onModelChange = () => { };
    onModelTouched = () => { };
    valueChanged;
    id = UniqueComponentId();
    focused;
    focusedIndex;
    filled;
    get focusedOptionId() {
        return this.focusedIndex !== null ? `${this.id}_chips_item_${this.focusedIndex}` : null;
    }
    get isMaxedOut() {
        return this.max && this.value && this.max === this.value.length;
    }
    constructor(document, el, cd, config) {
        this.document = document;
        this.el = el;
        this.cd = cd;
        this.config = config;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'removetokenicon':
                    this.removeTokenIconTemplate = item.template;
                    break;
                case 'clearicon':
                    this.clearIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
        this.updateFilledState();
    }
    onWrapperClick() {
        this.inputViewChild?.nativeElement.focus();
    }
    onContainerFocus() {
        this.focused = true;
    }
    onContainerBlur() {
        this.focusedIndex = -1;
        this.focused = false;
    }
    onContainerKeyDown(event) {
        switch (event.code) {
            case 'ArrowLeft':
                this.onArrowLeftKeyOn();
                break;
            case 'ArrowRight':
                this.onArrowRightKeyOn();
                break;
            case 'Backspace':
                this.onBackspaceKeyOn(event);
                break;
            case 'Space':
                if (this.focusedIndex !== null && this.value && this.value.length > 0) {
                    this.onItemClick(event, this.value[this.focusedIndex]);
                }
                break;
            default:
                break;
        }
    }
    onArrowLeftKeyOn() {
        if (this.inputViewChild.nativeElement.value.length === 0 && this.value && this.value.length > 0) {
            this.focusedIndex = this.focusedIndex === null ? this.value.length - 1 : this.focusedIndex - 1;
            if (this.focusedIndex < 0)
                this.focusedIndex = 0;
        }
    }
    onArrowRightKeyOn() {
        if (this.inputViewChild.nativeElement.value.length === 0 && this.value && this.value.length > 0) {
            if (this.focusedIndex === this.value.length - 1) {
                this.focusedIndex = null;
                this.inputViewChild?.nativeElement.focus();
            }
            else {
                this.focusedIndex++;
            }
        }
    }
    onBackspaceKeyOn(event) {
        if (this.focusedIndex !== null) {
            this.removeItem(event, this.focusedIndex);
        }
    }
    onInput() {
        this.updateFilledState();
        this.focusedIndex = null;
    }
    onPaste(event) {
        if (!this.disabled) {
            if (this.separator) {
                const pastedData = (event.clipboardData || this.document.defaultView['clipboardData']).getData('Text');
                pastedData.split(this.separator).forEach((val) => {
                    this.addItem(event, val, true);
                });
                this.inputViewChild.nativeElement.value = '';
            }
            this.updateFilledState();
        }
    }
    updateFilledState() {
        if (!this.value || this.value.length === 0) {
            this.filled = this.inputViewChild && this.inputViewChild.nativeElement && this.inputViewChild.nativeElement.value != '';
        }
        else {
            this.filled = true;
        }
    }
    onItemClick(event, item) {
        this.onChipClick.emit({
            originalEvent: event,
            value: item
        });
    }
    onItemContextMenu(event, item) {
        this.onChipContextMenu.emit({
            originalEvent: event,
            value: item
        });
    }
    writeValue(value) {
        this.value = value;
        this.updateMaxedOut();
        this.updateFilledState();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    resolveFieldData(data, field) {
        if (data && field) {
            if (field.indexOf('.') == -1) {
                return data[field];
            }
            else {
                let fields = field.split('.');
                let value = data;
                for (var i = 0, len = fields.length; i < len; ++i) {
                    value = value[fields[i]];
                }
                return value;
            }
        }
        else {
            return null;
        }
    }
    onInputFocus(event) {
        this.focused = true;
        this.focusedIndex = null;
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focused = false;
        this.focusedIndex = null;
        if (this.addOnBlur && this.inputViewChild.nativeElement.value) {
            this.addItem(event, this.inputViewChild.nativeElement.value, false);
        }
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    removeItem(event, index) {
        if (this.disabled) {
            return;
        }
        let removedItem = this.value[index];
        this.value = this.value.filter((val, i) => i != index);
        this.focusedIndex = null;
        this.inputViewChild.nativeElement.focus();
        this.onModelChange(this.value);
        this.onRemove.emit({
            originalEvent: event,
            value: removedItem
        });
        this.updateFilledState();
        this.updateMaxedOut();
    }
    addItem(event, item, preventDefault) {
        this.value = this.value || [];
        if (item && item.trim().length) {
            const newItemIsDuplicate = this.caseSensitiveDuplication ? this.value.includes(item) : this.value.some((val) => val.toLowerCase() === item.toLowerCase());
            if ((this.allowDuplicate || !newItemIsDuplicate) && !this.isMaxedOut) {
                this.value = [...this.value, item];
                this.onModelChange(this.value);
                this.onAdd.emit({
                    originalEvent: event,
                    value: item
                });
            }
        }
        this.updateFilledState();
        this.updateMaxedOut();
        this.inputViewChild.nativeElement.value = '';
        if (preventDefault) {
            event.preventDefault();
        }
    }
    /**
     * Callback to invoke on filter reset.
     * @group Method
     */
    clear() {
        this.value = null;
        this.updateFilledState();
        this.onModelChange(this.value);
        this.updateMaxedOut();
        this.onClear.emit();
    }
    onKeyDown(event) {
        const inputValue = event.target.value;
        switch (event.code) {
            case 'Backspace':
                if (inputValue.length === 0 && this.value && this.value.length > 0) {
                    if (this.focusedIndex !== null) {
                        this.removeItem(event, this.focusedIndex);
                    }
                    else
                        this.removeItem(event, this.value.length - 1);
                }
                break;
            case 'Enter':
            case 'NumpadEnter':
                if (inputValue && inputValue.trim().length && !this.isMaxedOut) {
                    this.addItem(event, inputValue, true);
                }
                break;
            case 'Tab':
                if (this.addOnTab && inputValue && inputValue.trim().length && !this.isMaxedOut) {
                    this.addItem(event, inputValue, true);
                    event.preventDefault();
                }
                break;
            case 'ArrowLeft':
                if (inputValue.length === 0 && this.value && this.value.length > 0) {
                    this.containerViewChild?.nativeElement.focus();
                }
                break;
            case 'ArrowRight':
                event.stopPropagation();
                break;
            default:
                if (this.separator) {
                    if (this.separator === event.key || event.key.match(this.separator)) {
                        this.addItem(event, inputValue, true);
                    }
                }
                break;
        }
    }
    updateMaxedOut() {
        if (this.inputViewChild && this.inputViewChild.nativeElement) {
            if (this.isMaxedOut) {
                // Calling `blur` is necessary because firefox does not call `onfocus` events
                // for disabled inputs, unlike chromium browsers.
                this.inputViewChild.nativeElement.blur();
                this.inputViewChild.nativeElement.disabled = true;
            }
            else {
                if (this.disabled) {
                    this.inputViewChild.nativeElement.blur();
                }
                this.inputViewChild.nativeElement.disabled = this.disabled || false;
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Chips, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Chips, selector: "p-chips", inputs: { style: "style", styleClass: "styleClass", disabled: ["disabled", "disabled", booleanAttribute], field: "field", placeholder: "placeholder", max: ["max", "max", numberAttribute], maxLength: "maxLength", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy", tabindex: ["tabindex", "tabindex", numberAttribute], inputId: "inputId", allowDuplicate: ["allowDuplicate", "allowDuplicate", booleanAttribute], caseSensitiveDuplication: ["caseSensitiveDuplication", "caseSensitiveDuplication", booleanAttribute], inputStyle: "inputStyle", inputStyleClass: "inputStyleClass", addOnTab: ["addOnTab", "addOnTab", booleanAttribute], addOnBlur: ["addOnBlur", "addOnBlur", booleanAttribute], separator: "separator", showClear: ["showClear", "showClear", booleanAttribute], autofocus: ["autofocus", "autofocus", booleanAttribute], variant: "variant" }, outputs: { onAdd: "onAdd", onRemove: "onRemove", onFocus: "onFocus", onBlur: "onBlur", onChipClick: "onChipClick", onChipContextMenu: "onChipContextMenu", onClear: "onClear" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "focused", "class.p-chips-clearable": "showClear" }, classAttribute: "p-element p-inputwrapper" }, providers: [CHIPS_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "inputViewChild", first: true, predicate: ["inputtext"], descendants: true }, { propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div
            [ngClass]="{
                'p-chips p-component p-input-wrapper': true,
                'p-disabled': disabled,
                'p-focus': focused,
                'p-inputwrapper-filled': (value && value.length) || (this.inputViewChild?.nativeElement.value && this.inputViewChild?.nativeElement.value.length),
                'p-inputwrapper-focus': focused
            }"
            [ngStyle]="style"
            [class]="styleClass"
            [attr.data-pc-name]="'chips'"
            [attr.data-pc-section]="'root'"
        >
            <ul
                #container
                [ngClass]="{ 'p-inputtext p-chips-multiple-container': true, 'p-variant-filled': variant === 'filled' || config.inputStyle() === 'filled' }"
                tabindex="-1"
                role="listbox"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                [attr.aria-orientation]="'horizontal'"
                (click)="onWrapperClick()"
                (focus)="onContainerFocus()"
                (blur)="onContainerBlur()"
                (keydown)="onContainerKeyDown($event)"
                [attr.data-pc-section]="'container'"
            >
                <li
                    #token
                    *ngFor="let item of value; let i = index"
                    [attr.id]="id + '_chips_item_' + i"
                    role="option"
                    [attr.ariaLabel]="item"
                    [attr.aria-selected]="true"
                    [attr.aria-setsize]="value.length"
                    [attr.aria-posinset]="i + 1"
                    [attr.data-p-focused]="focusedIndex === i"
                    [ngClass]="{ 'p-chips-token': true, 'p-focus': focusedIndex === i }"
                    (click)="onItemClick($event, item)"
                    (contextmenu)="onItemContextMenu($event, item)"
                    [attr.data-pc-section]="'token'"
                >
                    <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                    <span *ngIf="!itemTemplate" class="p-chips-token-label" [attr.data-pc-section]="'label'">{{ field ? resolveFieldData(item, field) : item }}</span>
                    <ng-container *ngIf="!disabled">
                        <TimesCircleIcon [styleClass]="'p-chips-token-icon'" *ngIf="!removeTokenIconTemplate" (click)="removeItem($event, i)" [attr.data-pc-section]="'removeTokenIcon'" [attr.aria-hidden]="true" />
                        <span *ngIf="removeTokenIconTemplate" class="p-chips-token-icon" (click)="removeItem($event, i)" [attr.data-pc-section]="'removeTokenIcon'" [attr.aria-hidden]="true">
                            <ng-template *ngTemplateOutlet="removeTokenIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </li>
                <li class="p-chips-input-token" [ngClass]="{ 'p-chips-clearable': showClear && !disabled }" [attr.data-pc-section]="'inputToken'" role="option">
                    <input
                        #inputtext
                        type="text"
                        [attr.id]="inputId"
                        [attr.maxlength]="maxLength"
                        [attr.placeholder]="value && value.length ? null : placeholder"
                        [attr.tabindex]="tabindex"
                        (keydown)="onKeyDown($event)"
                        (input)="onInput()"
                        (paste)="onPaste($event)"
                        (focus)="onInputFocus($event)"
                        (blur)="onInputBlur($event)"
                        [disabled]="disabled || isMaxedOut"
                        [ngStyle]="inputStyle"
                        [class]="inputStyleClass"
                        pAutoFocus
                        [autofocus]="autofocus"
                    />
                </li>
                <li *ngIf="value != null && filled && !disabled && showClear">
                    <TimesIcon *ngIf="!clearIconTemplate" [styleClass]="'p-chips-clear-icon'" (click)="clear()" />
                    <span *ngIf="clearIconTemplate" class="p-chips-clear-icon" (click)="clear()">
                        <ng-template *ngTemplateOutlet="clearIconTemplate"></ng-template>
                    </span>
                </li>
            </ul>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-chips{display:inline-flex}.p-chips-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-chips-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto;max-width:100%}.p-chips-token-label{min-width:0%;overflow:auto}.p-chips-token-label::-webkit-scrollbar{display:none}.p-chips-input-token{flex:1 1 auto;display:inline-flex}.p-chips-token-icon{cursor:pointer}.p-chips-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-chips{display:flex}.p-chips-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-chips-clearable .p-inputtext{position:relative}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i0.forwardRef(() => i3.AutoFocus), selector: "[pAutoFocus]", inputs: ["autofocus"] }, { kind: "component", type: i0.forwardRef(() => TimesCircleIcon), selector: "TimesCircleIcon" }, { kind: "component", type: i0.forwardRef(() => TimesIcon), selector: "TimesIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Chips, decorators: [{
            type: Component,
            args: [{ selector: 'p-chips', template: `
        <div
            [ngClass]="{
                'p-chips p-component p-input-wrapper': true,
                'p-disabled': disabled,
                'p-focus': focused,
                'p-inputwrapper-filled': (value && value.length) || (this.inputViewChild?.nativeElement.value && this.inputViewChild?.nativeElement.value.length),
                'p-inputwrapper-focus': focused
            }"
            [ngStyle]="style"
            [class]="styleClass"
            [attr.data-pc-name]="'chips'"
            [attr.data-pc-section]="'root'"
        >
            <ul
                #container
                [ngClass]="{ 'p-inputtext p-chips-multiple-container': true, 'p-variant-filled': variant === 'filled' || config.inputStyle() === 'filled' }"
                tabindex="-1"
                role="listbox"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-activedescendant]="focused ? focusedOptionId : undefined"
                [attr.aria-orientation]="'horizontal'"
                (click)="onWrapperClick()"
                (focus)="onContainerFocus()"
                (blur)="onContainerBlur()"
                (keydown)="onContainerKeyDown($event)"
                [attr.data-pc-section]="'container'"
            >
                <li
                    #token
                    *ngFor="let item of value; let i = index"
                    [attr.id]="id + '_chips_item_' + i"
                    role="option"
                    [attr.ariaLabel]="item"
                    [attr.aria-selected]="true"
                    [attr.aria-setsize]="value.length"
                    [attr.aria-posinset]="i + 1"
                    [attr.data-p-focused]="focusedIndex === i"
                    [ngClass]="{ 'p-chips-token': true, 'p-focus': focusedIndex === i }"
                    (click)="onItemClick($event, item)"
                    (contextmenu)="onItemContextMenu($event, item)"
                    [attr.data-pc-section]="'token'"
                >
                    <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container>
                    <span *ngIf="!itemTemplate" class="p-chips-token-label" [attr.data-pc-section]="'label'">{{ field ? resolveFieldData(item, field) : item }}</span>
                    <ng-container *ngIf="!disabled">
                        <TimesCircleIcon [styleClass]="'p-chips-token-icon'" *ngIf="!removeTokenIconTemplate" (click)="removeItem($event, i)" [attr.data-pc-section]="'removeTokenIcon'" [attr.aria-hidden]="true" />
                        <span *ngIf="removeTokenIconTemplate" class="p-chips-token-icon" (click)="removeItem($event, i)" [attr.data-pc-section]="'removeTokenIcon'" [attr.aria-hidden]="true">
                            <ng-template *ngTemplateOutlet="removeTokenIconTemplate"></ng-template>
                        </span>
                    </ng-container>
                </li>
                <li class="p-chips-input-token" [ngClass]="{ 'p-chips-clearable': showClear && !disabled }" [attr.data-pc-section]="'inputToken'" role="option">
                    <input
                        #inputtext
                        type="text"
                        [attr.id]="inputId"
                        [attr.maxlength]="maxLength"
                        [attr.placeholder]="value && value.length ? null : placeholder"
                        [attr.tabindex]="tabindex"
                        (keydown)="onKeyDown($event)"
                        (input)="onInput()"
                        (paste)="onPaste($event)"
                        (focus)="onInputFocus($event)"
                        (blur)="onInputBlur($event)"
                        [disabled]="disabled || isMaxedOut"
                        [ngStyle]="inputStyle"
                        [class]="inputStyleClass"
                        pAutoFocus
                        [autofocus]="autofocus"
                    />
                </li>
                <li *ngIf="value != null && filled && !disabled && showClear">
                    <TimesIcon *ngIf="!clearIconTemplate" [styleClass]="'p-chips-clear-icon'" (click)="clear()" />
                    <span *ngIf="clearIconTemplate" class="p-chips-clear-icon" (click)="clear()">
                        <ng-template *ngTemplateOutlet="clearIconTemplate"></ng-template>
                    </span>
                </li>
            </ul>
        </div>
    `, host: {
                        class: 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': 'focused',
                        '[class.p-chips-clearable]': 'showClear'
                    }, providers: [CHIPS_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, styles: ["@layer primeng{.p-chips{display:inline-flex}.p-chips-multiple-container{margin:0;padding:0;list-style-type:none;cursor:text;overflow:hidden;display:flex;align-items:center;flex-wrap:wrap}.p-chips-token{cursor:default;display:inline-flex;align-items:center;flex:0 0 auto;max-width:100%}.p-chips-token-label{min-width:0%;overflow:auto}.p-chips-token-label::-webkit-scrollbar{display:none}.p-chips-input-token{flex:1 1 auto;display:inline-flex}.p-chips-token-icon{cursor:pointer}.p-chips-input-token input{border:0 none;outline:0 none;background-color:transparent;margin:0;padding:0;box-shadow:none;border-radius:0;width:100%}.p-fluid .p-chips{display:flex}.p-chips-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-chips-clearable .p-inputtext{position:relative}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }], propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], field: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], max: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], maxLength: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], inputId: [{
                type: Input
            }], allowDuplicate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], caseSensitiveDuplication: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], inputStyle: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], addOnTab: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], addOnBlur: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], separator: [{
                type: Input
            }], showClear: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], variant: [{
                type: Input
            }], onAdd: [{
                type: Output
            }], onRemove: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onChipClick: [{
                type: Output
            }], onChipContextMenu: [{
                type: Output
            }], onClear: [{
                type: Output
            }], inputViewChild: [{
                type: ViewChild,
                args: ['inputtext']
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class ChipsModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: ChipsModule, declarations: [Chips], imports: [CommonModule, InputTextModule, SharedModule, AutoFocusModule, TimesCircleIcon, TimesIcon], exports: [Chips, InputTextModule, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ChipsModule, imports: [CommonModule, InputTextModule, SharedModule, AutoFocusModule, TimesCircleIcon, TimesIcon, InputTextModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule, SharedModule, AutoFocusModule, TimesCircleIcon, TimesIcon],
                    exports: [Chips, InputTextModule, SharedModule],
                    declarations: [Chips]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CHIPS_VALUE_ACCESSOR, Chips, ChipsModule };
//# sourceMappingURL=primeng-chips.mjs.map
