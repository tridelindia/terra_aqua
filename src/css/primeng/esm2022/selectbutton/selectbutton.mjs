import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, NgModule, Output, ViewChild, ViewEncapsulation, booleanAttribute, forwardRef, numberAttribute } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';
import { AutoFocusModule } from 'primeng/autofocus';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
import * as i3 from "primeng/autofocus";
export const SELECTBUTTON_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectButton),
    multi: true
};
/**
 * SelectButton is used to choose single or multiple items from a list using buttons.
 * @group Components
 */
export class SelectButton {
    cd;
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    options;
    /**
     * Name of the label field of an option.
     * @group Props
     */
    optionLabel;
    /**
     * Name of the value field of an option.
     * @group Props
     */
    optionValue;
    /**
     * Name of the disabled field of an option.
     * @group Props
     */
    optionDisabled;
    /**
     * Whether selection can be cleared.
     * @group Props
     */
    unselectable = false;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = 0;
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    multiple;
    /**
     * Whether selection can not be cleared.
     * @group Props
     */
    allowEmpty = true;
    /**
     * Inline style of the component.
     * @group Props
     */
    style;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled;
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    dataKey;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Callback to invoke on input click.
     * @param {SelectButtonOptionClickEvent} event - Custom click event.
     * @group Emits
     */
    onOptionClick = new EventEmitter();
    /**
     * Callback to invoke on selection change.
     * @param {SelectButtonChangeEvent} event - Custom change event.
     * @group Emits
     */
    onChange = new EventEmitter();
    container;
    itemTemplate;
    get selectButtonTemplate() {
        return this.itemTemplate?.template;
    }
    get equalityKey() {
        return this.optionValue ? null : this.dataKey;
    }
    value;
    onModelChange = () => { };
    onModelTouched = () => { };
    focusedIndex = 0;
    constructor(cd) {
        this.cd = cd;
    }
    getOptionLabel(option) {
        return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option.label != undefined ? option.label : option;
    }
    getOptionValue(option) {
        return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : this.optionLabel || option.value === undefined ? option : option.value;
    }
    isOptionDisabled(option) {
        return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : option.disabled !== undefined ? option.disabled : false;
    }
    writeValue(value) {
        this.value = value;
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
    onOptionSelect(event, option, index) {
        if (this.disabled || this.isOptionDisabled(option)) {
            return;
        }
        let selected = this.isSelected(option);
        if (selected && this.unselectable) {
            return;
        }
        let optionValue = this.getOptionValue(option);
        let newValue;
        if (this.multiple) {
            if (selected)
                newValue = this.value.filter((val) => !ObjectUtils.equals(val, optionValue, this.equalityKey));
            else
                newValue = this.value ? [...this.value, optionValue] : [optionValue];
        }
        else {
            if (selected && !this.allowEmpty) {
                return;
            }
            newValue = selected ? null : optionValue;
        }
        this.focusedIndex = index;
        this.value = newValue;
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
        this.onOptionClick.emit({
            originalEvent: event,
            option: option,
            index: index
        });
    }
    onKeyDown(event, option, index) {
        switch (event.code) {
            case 'Space': {
                this.onOptionSelect(event, option, index);
                event.preventDefault();
                break;
            }
            case 'ArrowDown':
            case 'ArrowRight': {
                this.changeTabIndexes(event, 'next');
                event.preventDefault();
                break;
            }
            case 'ArrowUp':
            case 'ArrowLeft': {
                this.changeTabIndexes(event, 'prev');
                event.preventDefault();
                break;
            }
            default:
                //no op
                break;
        }
    }
    changeTabIndexes(event, direction) {
        let firstTabableChild, index;
        for (let i = 0; i <= this.container.nativeElement.children.length - 1; i++) {
            if (this.container.nativeElement.children[i].getAttribute('tabindex') === '0')
                firstTabableChild = { elem: this.container.nativeElement.children[i], index: i };
        }
        if (direction === 'prev') {
            if (firstTabableChild.index === 0)
                index = this.container.nativeElement.children.length - 1;
            else
                index = firstTabableChild.index - 1;
        }
        else {
            if (firstTabableChild.index === this.container.nativeElement.children.length - 1)
                index = 0;
            else
                index = firstTabableChild.index + 1;
        }
        this.focusedIndex = index;
        this.container.nativeElement.children[index].focus();
    }
    onFocus(event, index) {
        this.focusedIndex = index;
    }
    onBlur() {
        this.onModelTouched();
    }
    removeOption(option) {
        this.value = this.value.filter((val) => !ObjectUtils.equals(val, this.getOptionValue(option), this.dataKey));
    }
    isSelected(option) {
        let selected = false;
        const optionValue = this.getOptionValue(option);
        if (this.multiple) {
            if (this.value && Array.isArray(this.value)) {
                for (let val of this.value) {
                    if (ObjectUtils.equals(val, optionValue, this.dataKey)) {
                        selected = true;
                        break;
                    }
                }
            }
        }
        else {
            selected = ObjectUtils.equals(this.getOptionValue(option), this.value, this.equalityKey);
        }
        return selected;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SelectButton, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: SelectButton, selector: "p-selectButton", inputs: { options: "options", optionLabel: "optionLabel", optionValue: "optionValue", optionDisabled: "optionDisabled", unselectable: ["unselectable", "unselectable", booleanAttribute], tabindex: ["tabindex", "tabindex", numberAttribute], multiple: ["multiple", "multiple", booleanAttribute], allowEmpty: ["allowEmpty", "allowEmpty", booleanAttribute], style: "style", styleClass: "styleClass", ariaLabelledBy: "ariaLabelledBy", disabled: ["disabled", "disabled", booleanAttribute], dataKey: "dataKey", autofocus: ["autofocus", "autofocus", booleanAttribute] }, outputs: { onOptionClick: "onOptionClick", onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [SELECTBUTTON_VALUE_ACCESSOR], queries: [{ propertyName: "itemTemplate", first: true, predicate: PrimeTemplate, descendants: true }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-selectbutton p-buttonset p-component'" [ngStyle]="style" [class]="styleClass" role="group" [attr.aria-labelledby]="ariaLabelledBy" [attr.data-pc-name]="'selectbutton'" [attr.data-pc-section]="'root'">
            <div
                *ngFor="let option of options; let i = index"
                pRipple
                [attr.tabindex]="i === focusedIndex && !disabled ? '0' : '-1'"
                [attr.aria-label]="option.label"
                [role]="multiple ? 'checkbox' : 'radio'"
                [attr.aria-checked]="isSelected(option)"
                [attr.aria-disabled]="optionDisabled"
                class="p-button p-component"
                [class]="option.styleClass"
                [ngClass]="{ 'p-highlight': isSelected(option), 'p-disabled': disabled || isOptionDisabled(option), 'p-button-icon-only': option.icon && !getOptionLabel(option) }"
                (click)="onOptionSelect($event, option, i)"
                (keydown)="onKeyDown($event, option, i)"
                [attr.title]="option.title"
                (focus)="onFocus($event, i)"
                (blur)="onBlur()"
                [attr.aria-labelledby]="this.getOptionLabel(option)"
                [attr.data-pc-section]="'button'"
                pAutoFocus
                [autofocus]="autofocus"
            >
                <ng-container *ngIf="!itemTemplate; else customcontent">
                    <span [ngClass]="'p-button-icon p-button-icon-left'" [class]="option.icon" *ngIf="option.icon" [attr.data-pc-section]="'icon'"></span>
                    <span class="p-button-label" [attr.data-pc-section]="'label'">{{ getOptionLabel(option) }}</span>
                </ng-container>
                <ng-template #customcontent>
                    <ng-container *ngTemplateOutlet="selectButtonTemplate; context: { $implicit: option, index: i }"></ng-container>
                </ng-template>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default;pointer-events:none}.p-button-icon-only{justify-content:center}.p-button-icon-only:after{content:\"p\";visibility:hidden;clip:rect(0 0 0 0);width:0}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-button-group .p-button{margin:0}.p-button-group .p-button:focus,.p-button-group p-button:focus .p-button,.p-buttonset .p-button:focus,.p-buttonset p-button:focus .p-button{position:relative;z-index:1}.p-button-group .p-button:not(:last-child),.p-button-group .p-button:not(:last-child):hover,.p-button-group p-button:not(:last-child) .p-button,.p-button-group p-button:not(:last-child) .p-button:hover,.p-buttonset .p-button:not(:last-child),.p-buttonset .p-button:not(:last-child):hover,.p-buttonset p-button:not(:last-child) .p-button,.p-buttonset p-button:not(:last-child) .p-button:hover{border-right:0 none}.p-button-group .p-button:not(:first-of-type):not(:last-of-type),.p-button-group p-button:not(:first-of-type):not(:last-of-type) .p-button,.p-buttonset .p-button:not(:first-of-type):not(:last-of-type),.p-buttonset p-button:not(:first-of-type):not(:last-of-type) .p-button{border-radius:0}.p-button-group .p-button:first-of-type:not(:only-of-type),.p-button-group p-button:first-of-type:not(:only-of-type) .p-button,.p-buttonset .p-button:first-of-type:not(:only-of-type),.p-buttonset p-button:first-of-type:not(:only-of-type) .p-button{border-top-right-radius:0;border-bottom-right-radius:0}.p-button-group .p-button:last-of-type:not(:only-of-type),.p-button-group p-button:last-of-type:not(:only-of-type) .p-button,.p-buttonset .p-button:last-of-type:not(:only-of-type),.p-buttonset p-button:last-of-type:not(:only-of-type) .p-button{border-top-left-radius:0;border-bottom-left-radius:0}p-button[iconpos=right] spinnericon{order:1}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i3.AutoFocus, selector: "[pAutoFocus]", inputs: ["autofocus"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SelectButton, decorators: [{
            type: Component,
            args: [{ selector: 'p-selectButton', template: `
        <div #container [ngClass]="'p-selectbutton p-buttonset p-component'" [ngStyle]="style" [class]="styleClass" role="group" [attr.aria-labelledby]="ariaLabelledBy" [attr.data-pc-name]="'selectbutton'" [attr.data-pc-section]="'root'">
            <div
                *ngFor="let option of options; let i = index"
                pRipple
                [attr.tabindex]="i === focusedIndex && !disabled ? '0' : '-1'"
                [attr.aria-label]="option.label"
                [role]="multiple ? 'checkbox' : 'radio'"
                [attr.aria-checked]="isSelected(option)"
                [attr.aria-disabled]="optionDisabled"
                class="p-button p-component"
                [class]="option.styleClass"
                [ngClass]="{ 'p-highlight': isSelected(option), 'p-disabled': disabled || isOptionDisabled(option), 'p-button-icon-only': option.icon && !getOptionLabel(option) }"
                (click)="onOptionSelect($event, option, i)"
                (keydown)="onKeyDown($event, option, i)"
                [attr.title]="option.title"
                (focus)="onFocus($event, i)"
                (blur)="onBlur()"
                [attr.aria-labelledby]="this.getOptionLabel(option)"
                [attr.data-pc-section]="'button'"
                pAutoFocus
                [autofocus]="autofocus"
            >
                <ng-container *ngIf="!itemTemplate; else customcontent">
                    <span [ngClass]="'p-button-icon p-button-icon-left'" [class]="option.icon" *ngIf="option.icon" [attr.data-pc-section]="'icon'"></span>
                    <span class="p-button-label" [attr.data-pc-section]="'label'">{{ getOptionLabel(option) }}</span>
                </ng-container>
                <ng-template #customcontent>
                    <ng-container *ngTemplateOutlet="selectButtonTemplate; context: { $implicit: option, index: i }"></ng-container>
                </ng-template>
            </div>
        </div>
    `, providers: [SELECTBUTTON_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-button{margin:0;display:inline-flex;cursor:pointer;-webkit-user-select:none;user-select:none;align-items:center;vertical-align:bottom;text-align:center;overflow:hidden;position:relative}.p-button-label{flex:1 1 auto}.p-button-icon-right{order:1}.p-button:disabled{cursor:default;pointer-events:none}.p-button-icon-only{justify-content:center}.p-button-icon-only:after{content:\"p\";visibility:hidden;clip:rect(0 0 0 0);width:0}.p-button-vertical{flex-direction:column}.p-button-icon-bottom{order:2}.p-button-group .p-button{margin:0}.p-button-group .p-button:focus,.p-button-group p-button:focus .p-button,.p-buttonset .p-button:focus,.p-buttonset p-button:focus .p-button{position:relative;z-index:1}.p-button-group .p-button:not(:last-child),.p-button-group .p-button:not(:last-child):hover,.p-button-group p-button:not(:last-child) .p-button,.p-button-group p-button:not(:last-child) .p-button:hover,.p-buttonset .p-button:not(:last-child),.p-buttonset .p-button:not(:last-child):hover,.p-buttonset p-button:not(:last-child) .p-button,.p-buttonset p-button:not(:last-child) .p-button:hover{border-right:0 none}.p-button-group .p-button:not(:first-of-type):not(:last-of-type),.p-button-group p-button:not(:first-of-type):not(:last-of-type) .p-button,.p-buttonset .p-button:not(:first-of-type):not(:last-of-type),.p-buttonset p-button:not(:first-of-type):not(:last-of-type) .p-button{border-radius:0}.p-button-group .p-button:first-of-type:not(:only-of-type),.p-button-group p-button:first-of-type:not(:only-of-type) .p-button,.p-buttonset .p-button:first-of-type:not(:only-of-type),.p-buttonset p-button:first-of-type:not(:only-of-type) .p-button{border-top-right-radius:0;border-bottom-right-radius:0}.p-button-group .p-button:last-of-type:not(:only-of-type),.p-button-group p-button:last-of-type:not(:only-of-type) .p-button,.p-buttonset .p-button:last-of-type:not(:only-of-type),.p-buttonset p-button:last-of-type:not(:only-of-type) .p-button{border-top-left-radius:0;border-bottom-left-radius:0}p-button[iconpos=right] spinnericon{order:1}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { options: [{
                type: Input
            }], optionLabel: [{
                type: Input
            }], optionValue: [{
                type: Input
            }], optionDisabled: [{
                type: Input
            }], unselectable: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], multiple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], allowEmpty: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], dataKey: [{
                type: Input
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onOptionClick: [{
                type: Output
            }], onChange: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], itemTemplate: [{
                type: ContentChild,
                args: [PrimeTemplate]
            }] } });
export class SelectButtonModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SelectButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: SelectButtonModule, declarations: [SelectButton], imports: [CommonModule, RippleModule, SharedModule, AutoFocusModule], exports: [SelectButton, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SelectButtonModule, imports: [CommonModule, RippleModule, SharedModule, AutoFocusModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SelectButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule, SharedModule, AutoFocusModule],
                    exports: [SelectButton, SharedModule],
                    declarations: [SelectButton]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0YnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NlbGVjdGJ1dHRvbi9zZWxlY3RidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBcUIsU0FBUyxFQUFFLFlBQVksRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQWUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDalAsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7QUFHcEQsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQVE7SUFDNUMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztJQUMzQyxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFDRjs7O0dBR0c7QUE0Q0gsTUFBTSxPQUFPLFlBQVk7SUF3R0Y7SUF2R25COzs7T0FHRztJQUNNLE9BQU8sQ0FBb0I7SUFDcEM7OztPQUdHO0lBQ00sV0FBVyxDQUFxQjtJQUN6Qzs7O09BR0c7SUFDTSxXQUFXLENBQXFCO0lBQ3pDOzs7T0FHRztJQUNNLGNBQWMsQ0FBcUI7SUFDNUM7OztPQUdHO0lBQ3FDLFlBQVksR0FBWSxL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QUs7dUJBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBTTVCLGFBQWE7c0JBQXRCLE1BQU07Z0JBTUcsUUFBUTtzQkFBakIsTUFBTTtnQkFFaUIsU0FBUztzQkFBaEMsU0FBUzt1QkFBQyxXQUFXO2dCQUVPLFlBQVk7c0JBQXhDLFlBQVk7dUJBQUMsYUFBYTs7QUFpTC9CLE1BQU0sT0FBTyxrQkFBa0I7dUdBQWxCLGtCQUFrQjt3R0FBbEIsa0JBQWtCLGlCQXZRbEIsWUFBWSxhQW1RWCxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLGFBblExRCxZQUFZLEVBb1FHLFlBQVk7d0dBRzNCLGtCQUFrQixZQUpqQixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQzNDLFlBQVk7OzJGQUczQixrQkFBa0I7a0JBTDlCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDO29CQUNwRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUNyQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nTW9kdWxlLCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uLCBib29sZWFuQXR0cmlidXRlLCBmb3J3YXJkUmVmLCBudW1iZXJBdHRyaWJ1dGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IFJpcHBsZU1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvcmlwcGxlJztcbmltcG9ydCB7IE51bGxhYmxlIH0gZnJvbSAncHJpbWVuZy90cy1oZWxwZXJzJztcbmltcG9ydCB7IE9iamVjdFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQgeyBBdXRvRm9jdXNNb2R1bGUgfSBmcm9tICdwcmltZW5nL2F1dG9mb2N1cyc7XG5pbXBvcnQgeyBTZWxlY3RCdXR0b25DaGFuZ2VFdmVudCwgU2VsZWN0QnV0dG9uT3B0aW9uQ2xpY2tFdmVudCB9IGZyb20gJy4vc2VsZWN0YnV0dG9uLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RCVVRUT05fVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTZWxlY3RCdXR0b24pLFxuICAgIG11bHRpOiB0cnVlXG59O1xuLyoqXG4gKiBTZWxlY3RCdXR0b24gaXMgdXNlZCB0byBjaG9vc2Ugc2luZ2xlIG9yIG11bHRpcGxlIGl0ZW1zIGZyb20gYSBsaXN0IHVzaW5nIGJ1dHRvbnMuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2VsZWN0QnV0dG9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICNjb250YWluZXIgW25nQ2xhc3NdPVwiJ3Atc2VsZWN0YnV0dG9uIHAtYnV0dG9uc2V0IHAtY29tcG9uZW50J1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiByb2xlPVwiZ3JvdXBcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiBbYXR0ci5kYXRhLXBjLW5hbWVdPVwiJ3NlbGVjdGJ1dHRvbidcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ3Jvb3QnXCI+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IG9wdGlvbiBvZiBvcHRpb25zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiaSA9PT0gZm9jdXNlZEluZGV4ICYmICFkaXNhYmxlZCA/ICcwJyA6ICctMSdcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwib3B0aW9uLmxhYmVsXCJcbiAgICAgICAgICAgICAgICBbcm9sZV09XCJtdWx0aXBsZSA/ICdjaGVja2JveCcgOiAncmFkaW8nXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWNoZWNrZWRdPVwiaXNTZWxlY3RlZChvcHRpb24pXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWRpc2FibGVkXT1cIm9wdGlvbkRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtYnV0dG9uIHAtY29tcG9uZW50XCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwib3B0aW9uLnN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtaGlnaGxpZ2h0JzogaXNTZWxlY3RlZChvcHRpb24pLCAncC1kaXNhYmxlZCc6IGRpc2FibGVkIHx8IGlzT3B0aW9uRGlzYWJsZWQob3B0aW9uKSwgJ3AtYnV0dG9uLWljb24tb25seSc6IG9wdGlvbi5pY29uICYmICFnZXRPcHRpb25MYWJlbChvcHRpb24pIH1cIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbk9wdGlvblNlbGVjdCgkZXZlbnQsIG9wdGlvbiwgaSlcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQsIG9wdGlvbiwgaSlcIlxuICAgICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cIm9wdGlvbi50aXRsZVwiXG4gICAgICAgICAgICAgICAgKGZvY3VzKT1cIm9uRm9jdXMoJGV2ZW50LCBpKVwiXG4gICAgICAgICAgICAgICAgKGJsdXIpPVwib25CbHVyKClcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJ0aGlzLmdldE9wdGlvbkxhYmVsKG9wdGlvbilcIlxuICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInYnV0dG9uJ1wiXG4gICAgICAgICAgICAgICAgcEF1dG9Gb2N1c1xuICAgICAgICAgICAgICAgIFthdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWl0ZW1UZW1wbGF0ZTsgZWxzZSBjdXN0b21jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIFtuZ0NsYXNzXT1cIidwLWJ1dHRvbi1pY29uIHAtYnV0dG9uLWljb24tbGVmdCdcIiBbY2xhc3NdPVwib3B0aW9uLmljb25cIiAqbmdJZj1cIm9wdGlvbi5pY29uXCIgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidpY29uJ1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLWJ1dHRvbi1sYWJlbFwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbGFiZWwnXCI+e3sgZ2V0T3B0aW9uTGFiZWwob3B0aW9uKSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2N1c3RvbWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzZWxlY3RCdXR0b25UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IG9wdGlvbiwgaW5kZXg6IGkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBwcm92aWRlcnM6IFtTRUxFQ1RCVVRUT05fVkFMVUVfQUNDRVNTT1JdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4uL2J1dHRvbi9idXR0b24uY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdEJ1dHRvbiBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBzZWxlY3RpdGVtcyB0byBkaXNwbGF5IGFzIHRoZSBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBvcHRpb25zOiBhbnlbXSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBsYWJlbCBmaWVsZCBvZiBhbiBvcHRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgb3B0aW9uTGFiZWw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSB2YWx1ZSBmaWVsZCBvZiBhbiBvcHRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgb3B0aW9uVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBkaXNhYmxlZCBmaWVsZCBvZiBhbiBvcHRpb24uXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgb3B0aW9uRGlzYWJsZWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHNlbGVjdGlvbiBjYW4gYmUgY2xlYXJlZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgdW5zZWxlY3RhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGFiYmluZyBvcmRlci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSB0YWJpbmRleDogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBXaGVuIHNwZWNpZmllZCwgYWxsb3dzIHNlbGVjdGluZyBtdWx0aXBsZSB2YWx1ZXMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIG11bHRpcGxlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgc2VsZWN0aW9uIGNhbiBub3QgYmUgY2xlYXJlZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgYWxsb3dFbXB0eTogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogSW5saW5lIHN0eWxlIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBFc3RhYmxpc2hlcyByZWxhdGlvbnNoaXBzIGJldHdlZW4gdGhlIGNvbXBvbmVudCBhbmQgbGFiZWwocykgd2hlcmUgaXRzIHZhbHVlIHNob3VsZCBiZSBvbmUgb3IgbW9yZSBlbGVtZW50IElEcy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZW4gcHJlc2VudCwgaXQgc3BlY2lmaWVzIHRoYXQgdGhlIGVsZW1lbnQgc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBkaXNhYmxlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBBIHByb3BlcnR5IHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGEgdmFsdWUgaW4gb3B0aW9ucy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBkYXRhS2V5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hlbiBwcmVzZW50LCBpdCBzcGVjaWZpZXMgdGhhdCB0aGUgY29tcG9uZW50IHNob3VsZCBhdXRvbWF0aWNhbGx5IGdldCBmb2N1cyBvbiBsb2FkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBhdXRvZm9jdXM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIG9uIGlucHV0IGNsaWNrLlxuICAgICAqIEBwYXJhbSB7U2VsZWN0QnV0dG9uT3B0aW9uQ2xpY2tFdmVudH0gZXZlbnQgLSBDdXN0b20gY2xpY2sgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uT3B0aW9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxTZWxlY3RCdXR0b25PcHRpb25DbGlja0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8U2VsZWN0QnV0dG9uT3B0aW9uQ2xpY2tFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugb24gc2VsZWN0aW9uIGNoYW5nZS5cbiAgICAgKiBAcGFyYW0ge1NlbGVjdEJ1dHRvbkNoYW5nZUV2ZW50fSBldmVudCAtIEN1c3RvbSBjaGFuZ2UgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8U2VsZWN0QnV0dG9uQ2hhbmdlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxTZWxlY3RCdXR0b25DaGFuZ2VFdmVudD4oKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lcjogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBAQ29udGVudENoaWxkKFByaW1lVGVtcGxhdGUpIGl0ZW1UZW1wbGF0ZSE6IFByaW1lVGVtcGxhdGU7XG5cbiAgICBwdWJsaWMgZ2V0IHNlbGVjdEJ1dHRvblRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtVGVtcGxhdGU/LnRlbXBsYXRlO1xuICAgIH1cblxuICAgIGdldCBlcXVhbGl0eUtleSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uVmFsdWUgPyBudWxsIDogdGhpcy5kYXRhS2V5O1xuICAgIH1cblxuICAgIHZhbHVlOiBhbnk7XG5cbiAgICBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgb25Nb2RlbFRvdWNoZWQ6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBmb2N1c2VkSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gICAgZ2V0T3B0aW9uTGFiZWwob3B0aW9uOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uTGFiZWwgPyBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG9wdGlvbiwgdGhpcy5vcHRpb25MYWJlbCkgOiBvcHRpb24ubGFiZWwgIT0gdW5kZWZpbmVkID8gb3B0aW9uLmxhYmVsIDogb3B0aW9uO1xuICAgIH1cblxuICAgIGdldE9wdGlvblZhbHVlKG9wdGlvbjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvblZhbHVlID8gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShvcHRpb24sIHRoaXMub3B0aW9uVmFsdWUpIDogdGhpcy5vcHRpb25MYWJlbCB8fCBvcHRpb24udmFsdWUgPT09IHVuZGVmaW5lZCA/IG9wdGlvbiA6IG9wdGlvbi52YWx1ZTtcbiAgICB9XG5cbiAgICBpc09wdGlvbkRpc2FibGVkKG9wdGlvbjogYW55KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbkRpc2FibGVkID8gT2JqZWN0VXRpbHMucmVzb2x2ZUZpZWxkRGF0YShvcHRpb24sIHRoaXMub3B0aW9uRGlzYWJsZWQpIDogb3B0aW9uLmRpc2FibGVkICE9PSB1bmRlZmluZWQgPyBvcHRpb24uZGlzYWJsZWQgOiBmYWxzZTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBvbk9wdGlvblNlbGVjdChldmVudCwgb3B0aW9uLCBpbmRleCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLmlzT3B0aW9uRGlzYWJsZWQob3B0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5pc1NlbGVjdGVkKG9wdGlvbik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkICYmIHRoaXMudW5zZWxlY3RhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb3B0aW9uVmFsdWUgPSB0aGlzLmdldE9wdGlvblZhbHVlKG9wdGlvbik7XG4gICAgICAgIGxldCBuZXdWYWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSBuZXdWYWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKCh2YWwpID0+ICFPYmplY3RVdGlscy5lcXVhbHModmFsLCBvcHRpb25WYWx1ZSwgdGhpcy5lcXVhbGl0eUtleSkpO1xuICAgICAgICAgICAgZWxzZSBuZXdWYWx1ZSA9IHRoaXMudmFsdWUgPyBbLi4udGhpcy52YWx1ZSwgb3B0aW9uVmFsdWVdIDogW29wdGlvblZhbHVlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZCAmJiAhdGhpcy5hbGxvd0VtcHR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3VmFsdWUgPSBzZWxlY3RlZCA/IG51bGwgOiBvcHRpb25WYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm9jdXNlZEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMub25PcHRpb25DbGljay5lbWl0KHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgb3B0aW9uOiBvcHRpb24sXG4gICAgICAgICAgICBpbmRleDogaW5kZXhcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb25LZXlEb3duKGV2ZW50LCBvcHRpb24sIGluZGV4KSB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnU3BhY2UnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk9wdGlvblNlbGVjdChldmVudCwgb3B0aW9uLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVRhYkluZGV4ZXMoZXZlbnQsICduZXh0Jyk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG5cbiAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVRhYkluZGV4ZXMoZXZlbnQsICdwcmV2Jyk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvL25vIG9wXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VUYWJJbmRleGVzKGV2ZW50LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgbGV0IGZpcnN0VGFiYWJsZUNoaWxkLCBpbmRleDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5baV0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnMCcpIGZpcnN0VGFiYWJsZUNoaWxkID0geyBlbGVtOiB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNoaWxkcmVuW2ldLCBpbmRleDogaSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RUYWJhYmxlQ2hpbGQuaW5kZXggPT09IDApIGluZGV4ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGggLSAxO1xuICAgICAgICAgICAgZWxzZSBpbmRleCA9IGZpcnN0VGFiYWJsZUNoaWxkLmluZGV4IC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRhYmFibGVDaGlsZC5pbmRleCA9PT0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSBpbmRleCA9IDA7XG4gICAgICAgICAgICBlbHNlIGluZGV4ID0gZmlyc3RUYWJhYmxlQ2hpbGQuaW5kZXggKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb2N1c2VkSW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5jaGlsZHJlbltpbmRleF0uZm9jdXMoKTtcbiAgICB9XG5cbiAgICBvbkZvY3VzKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLmZvY3VzZWRJbmRleCA9IGluZGV4O1xuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgIH1cblxuICAgIHJlbW92ZU9wdGlvbihvcHRpb246IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZS5maWx0ZXIoKHZhbDogYW55KSA9PiAhT2JqZWN0VXRpbHMuZXF1YWxzKHZhbCwgdGhpcy5nZXRPcHRpb25WYWx1ZShvcHRpb24pLCB0aGlzLmRhdGFLZXkpKTtcbiAgICB9XG5cbiAgICBpc1NlbGVjdGVkKG9wdGlvbjogYW55KSB7XG4gICAgICAgIGxldCBzZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IHRoaXMuZ2V0T3B0aW9uVmFsdWUob3B0aW9uKTtcblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHZhbCBvZiB0aGlzLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3RVdGlscy5lcXVhbHModmFsLCBvcHRpb25WYWx1ZSwgdGhpcy5kYXRhS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IE9iamVjdFV0aWxzLmVxdWFscyh0aGlzLmdldE9wdGlvblZhbHVlKG9wdGlvbiksIHRoaXMudmFsdWUsIHRoaXMuZXF1YWxpdHlLZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSaXBwbGVNb2R1bGUsIFNoYXJlZE1vZHVsZSwgQXV0b0ZvY3VzTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2VsZWN0QnV0dG9uLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1NlbGVjdEJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0QnV0dG9uTW9kdWxlIHt9XG4iXX0=