import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, ContentChildren, NgModule } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import * as i2 from 'primeng/inputtext';
import { InputTextModule } from 'primeng/inputtext';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i3 from 'primeng/autofocus';
import { AutoFocusModule } from 'primeng/autofocus';

const INPUT_OTP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputOtp),
    multi: true
};
/**
 * Input Otp is used to enter one time passwords.
 * @group Components
 */
class InputOtp {
    cd;
    /**
     * When present, it specifies that the component should have invalid state style.
     * @group Props
     */
    invalid = false;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled = false;
    /**
     * When present, it specifies that an input field is read-only.
     * @group Props
     */
    readonly = false;
    /**
     * Specifies the input variant of the component.
     * @group Props
     */
    variant = 'outlined';
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = null;
    /**
     * Number of characters to initiate.
     * @group Props
     */
    length = 4;
    /**
     * Mask pattern.
     * @group Props
     */
    mask = false;
    /**
     * When present, it specifies that an input field is integer-only.
     * @group Props
     */
    integerOnly = false;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Callback to invoke on value change.
     * @group Emits
     */
    onChange = new EventEmitter();
    /**
     * Callback to invoke when the component receives focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onFocus = new EventEmitter();
    /**
     * Callback to invoke when the component loses focus.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    onBlur = new EventEmitter();
    templates;
    inputTemplate;
    tokens = [];
    onModelChange = () => { };
    onModelTouched = () => { };
    value;
    get inputMode() {
        return this.integerOnly ? 'numeric' : 'text';
    }
    get inputType() {
        return this.mask ? 'password' : 'text';
    }
    constructor(cd) {
        this.cd = cd;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;
                default:
                    this.inputTemplate = item.template;
                    break;
            }
        });
    }
    getToken(index) {
        return this.tokens[index];
    }
    getTemplateEvents(index) {
        return {
            input: (event) => this.onInput(event, index),
            keydown: (event) => this.onKeyDown(event),
            focus: (event) => this.onFocus.emit(event),
            blur: (event) => this.onBlur.emit(event),
            paste: (event) => this.onPaste(event)
        };
    }
    onInput(event, index) {
        this.tokens[index] = event.target.value;
        this.updateModel(event);
        if (event.inputType === 'deleteContentBackward') {
            this.moveToPrev(event);
        }
        else if (event.inputType === 'insertText' || event.inputType === 'deleteContentForward') {
            this.moveToNext(event);
        }
    }
    updateModel(event) {
        const newValue = this.tokens.join('');
        this.onModelChange(newValue);
        this.onChange.emit({
            originalEvent: event,
            value: newValue
        });
    }
    writeValue(value) {
        if (value) {
            if (Array.isArray(value) && value.length > 0) {
                this.value = value.slice(0, this.length);
            }
            else {
                this.value = value.toString().split('').slice(0, this.length);
            }
        }
        else {
            this.value = value;
        }
        this.updateTokens();
        this.cd.markForCheck();
    }
    updateTokens() {
        if (this.value !== null && this.value !== undefined) {
            if (Array.isArray(this.value)) {
                this.tokens = [...this.value];
            }
            else {
                this.tokens = this.value.toString().split('');
            }
        }
        else {
            this.tokens = [];
        }
    }
    getModelValue(i) {
        return this.tokens[i - 1] || '';
    }
    getAutofocus(i) {
        if (i === 1) {
            return this.autofocus;
        }
        return false;
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    moveToPrev(event) {
        let prevInput = this.findPrevInput(event.target);
        if (prevInput) {
            prevInput.focus();
            prevInput.select();
        }
    }
    moveToNext(event) {
        let nextInput = this.findNextInput(event.target);
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }
    findNextInput(element) {
        let nextElement = element.nextElementSibling;
        if (!nextElement)
            return;
        return nextElement.nodeName === 'INPUT' ? nextElement : this.findNextInput(nextElement);
    }
    findPrevInput(element) {
        let prevElement = element.previousElementSibling;
        if (!prevElement)
            return;
        return prevElement.nodeName === 'INPUT' ? prevElement : this.findPrevInput(prevElement);
    }
    onInputFocus(event) {
        event.target.select();
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.onBlur.emit(event);
    }
    onKeyDown(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        switch (event.key) {
            case 'ArrowLeft':
                this.moveToPrev(event);
                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                break;
            case 'Backspace':
                if (event.target.value.length === 0) {
                    this.moveToPrev(event);
                    event.preventDefault();
                }
                break;
            case 'ArrowRight':
                this.moveToNext(event);
                event.preventDefault();
                break;
            case 'Tab':
                break;
            default:
                if ((this.integerOnly && !((event.code.startsWith('Digit') || event.code.startsWith('Numpad')) && Number(event.key) >= 0 && Number(event.key) <= 9)) || (this.tokens.join('').length >= this.length && event.code !== 'Delete')) {
                    event.preventDefault();
                }
                break;
        }
    }
    onPaste(event) {
        if (!this.disabled && !this.readonly) {
            let paste = event.clipboardData.getData('text');
            if (paste.length) {
                let pastedCode = paste.substring(0, this.length);
                if (!this.integerOnly || !isNaN(pastedCode)) {
                    this.tokens = pastedCode.split('');
                    this.updateModel(event);
                }
            }
            event.preventDefault();
        }
    }
    getRange(n) {
        return Array.from({ length: n }, (_, index) => index + 1);
    }
    trackByFn(index) {
        return index;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: InputOtp, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: InputOtp, selector: "p-inputOtp", inputs: { invalid: "invalid", disabled: "disabled", readonly: "readonly", variant: "variant", tabindex: "tabindex", length: "length", mask: "mask", integerOnly: "integerOnly", autofocus: ["autofocus", "autofocus", booleanAttribute] }, outputs: { onChange: "onChange", onFocus: "onFocus", onBlur: "onBlur" }, host: { classAttribute: "p-inputotp p-component" }, providers: [INPUT_OTP_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <ng-container *ngFor="let i of getRange(length); trackBy: trackByFn">
            <ng-container *ngIf="!inputTemplate">
                <input
                    type="text"
                    pInputText
                    [value]="getModelValue(i)"
                    [maxLength]="1"
                    [type]="inputType"
                    class="p-inputotp-input"
                    [inputmode]="inputMode"
                    [variant]="variant"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    [invalid]="invalid"
                    [tabindex]="tabindex"
                    [unstyled]="unstyled"
                    (input)="onInput($event, i - 1)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (paste)="onPaste($event)"
                    (keydown)="onKeyDown($event)"
                    pAutoFocus
                    [autofocus]="getAutofocus(i)"
                />
            </ng-container>
            <ng-container *ngIf="inputTemplate">
                <ng-container *ngTemplateOutlet="inputTemplate; context: { $implicit: getToken(i - 1), events: getTemplateEvents(i - 1), index: i }"> </ng-container>
            </ng-container>
        </ng-container>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.InputText, selector: "[pInputText]", inputs: ["variant"] }, { kind: "directive", type: i3.AutoFocus, selector: "[pAutoFocus]", inputs: ["autofocus"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: InputOtp, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-inputOtp',
                    template: `
        <ng-container *ngFor="let i of getRange(length); trackBy: trackByFn">
            <ng-container *ngIf="!inputTemplate">
                <input
                    type="text"
                    pInputText
                    [value]="getModelValue(i)"
                    [maxLength]="1"
                    [type]="inputType"
                    class="p-inputotp-input"
                    [inputmode]="inputMode"
                    [variant]="variant"
                    [readonly]="readonly"
                    [disabled]="disabled"
                    [invalid]="invalid"
                    [tabindex]="tabindex"
                    [unstyled]="unstyled"
                    (input)="onInput($event, i - 1)"
                    (focus)="onInputFocus($event)"
                    (blur)="onInputBlur($event)"
                    (paste)="onPaste($event)"
                    (keydown)="onKeyDown($event)"
                    pAutoFocus
                    [autofocus]="getAutofocus(i)"
                />
            </ng-container>
            <ng-container *ngIf="inputTemplate">
                <ng-container *ngTemplateOutlet="inputTemplate; context: { $implicit: getToken(i - 1), events: getTemplateEvents(i - 1), index: i }"> </ng-container>
            </ng-container>
        </ng-container>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-inputotp p-component'
                    },
                    providers: [INPUT_OTP_VALUE_ACCESSOR]
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { invalid: [{
                type: Input
            }], disabled: [{
                type: Input
            }], readonly: [{
                type: Input
            }], variant: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], length: [{
                type: Input
            }], mask: [{
                type: Input
            }], integerOnly: [{
                type: Input
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onChange: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class InputOtpModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: InputOtpModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: InputOtpModule, declarations: [InputOtp], imports: [CommonModule, SharedModule, InputTextModule, AutoFocusModule], exports: [InputOtp, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: InputOtpModule, imports: [CommonModule, SharedModule, InputTextModule, AutoFocusModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: InputOtpModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule, InputTextModule, AutoFocusModule],
                    exports: [InputOtp, SharedModule],
                    declarations: [InputOtp]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { INPUT_OTP_VALUE_ACCESSOR, InputOtp, InputOtpModule };
//# sourceMappingURL=primeng-inputotp.mjs.map
