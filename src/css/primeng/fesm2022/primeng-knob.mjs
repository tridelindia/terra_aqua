import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { forwardRef, EventEmitter, numberAttribute, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Inject, Input, Output, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const KNOB_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Knob),
    multi: true
};
/**
 * Knob is a form component to define number inputs with a dial.
 * @group Components
 */
class Knob {
    document;
    renderer;
    cd;
    el;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass;
    /**
     * Inline style of the component.
     * @group Props
     */
    style;
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    ariaLabel;
    /**
     * Specifies one or more IDs in the DOM that labels the input field.
     * @group Props
     */
    ariaLabelledBy;
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    tabindex = 0;
    /**
     * Background of the value.
     * @group Props
     */
    valueColor = 'var(--primary-color, Black)';
    /**
     * Background color of the range.
     * @group Props
     */
    rangeColor = 'var(--surface-border, LightGray)';
    /**
     * Color of the value text.
     * @group Props
     */
    textColor = 'var(--text-color-secondary, Black)';
    /**
     * Template string of the value.
     * @group Props
     */
    valueTemplate = '{value}';
    /**
     * Name of the input element.
     * @group Props
     */
    name;
    /**
     * Size of the component in pixels.
     * @group Props
     */
    size = 100;
    /**
     * Step factor to increment/decrement the value.
     * @group Props
     */
    step = 1;
    /**
     * Mininum boundary value.
     * @group Props
     */
    min = 0;
    /**
     * Maximum boundary value.
     * @group Props
     */
    max = 100;
    /**
     * Width of the knob stroke.
     * @group Props
     */
    strokeWidth = 14;
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    disabled;
    /**
     * Whether the show the value inside the knob.
     * @group Props
     */
    showValue = true;
    /**
     * When present, it specifies that the component value cannot be edited.
     * @group Props
     */
    readonly = false;
    /**
     * Callback to invoke on value change.
     * @param {number} value - New value.
     * @group Emits
     */
    onChange = new EventEmitter();
    radius = 40;
    midX = 50;
    midY = 50;
    minRadians = (4 * Math.PI) / 3;
    maxRadians = -Math.PI / 3;
    value = 0;
    windowMouseMoveListener;
    windowMouseUpListener;
    windowTouchMoveListener;
    windowTouchEndListener;
    onModelChange = () => { };
    onModelTouched = () => { };
    constructor(document, renderer, cd, el) {
        this.document = document;
        this.renderer = renderer;
        this.cd = cd;
        this.el = el;
    }
    mapRange(x, inMin, inMax, outMin, outMax) {
        return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
    onClick(event) {
        if (!this.disabled && !this.readonly) {
            this.updateValue(event.offsetX, event.offsetY);
        }
    }
    updateValue(offsetX, offsetY) {
        let dx = offsetX - this.size / 2;
        let dy = this.size / 2 - offsetY;
        let angle = Math.atan2(dy, dx);
        let start = -Math.PI / 2 - Math.PI / 6;
        this.updateModel(angle, start);
    }
    updateModel(angle, start) {
        let mappedValue;
        if (angle > this.maxRadians)
            mappedValue = this.mapRange(angle, this.minRadians, this.maxRadians, this.min, this.max);
        else if (angle < start)
            mappedValue = this.mapRange(angle + 2 * Math.PI, this.minRadians, this.maxRadians, this.min, this.max);
        else
            return;
        let newValue = Math.round((mappedValue - this.min) / this.step) * this.step + this.min;
        this.value = newValue;
        this.onModelChange(this.value);
        this.onChange.emit(this.value);
    }
    onMouseDown(event) {
        if (!this.disabled && !this.readonly) {
            const window = this.document.defaultView || 'window';
            this.windowMouseMoveListener = this.renderer.listen(window, 'mousemove', this.onMouseMove.bind(this));
            this.windowMouseUpListener = this.renderer.listen(window, 'mouseup', this.onMouseUp.bind(this));
            event.preventDefault();
        }
    }
    onMouseUp(event) {
        if (!this.disabled && !this.readonly) {
            if (this.windowMouseMoveListener) {
                this.windowMouseMoveListener();
                this.windowMouseUpListener = null;
            }
            if (this.windowMouseUpListener) {
                this.windowMouseUpListener();
                this.windowMouseMoveListener = null;
            }
            event.preventDefault();
        }
    }
    onTouchStart(event) {
        if (!this.disabled && !this.readonly) {
            const window = this.document.defaultView || 'window';
            this.windowTouchMoveListener = this.renderer.listen(window, 'touchmove', this.onTouchMove.bind(this));
            this.windowTouchEndListener = this.renderer.listen(window, 'touchend', this.onTouchEnd.bind(this));
            event.preventDefault();
        }
    }
    onTouchEnd(event) {
        if (!this.disabled && !this.readonly) {
            if (this.windowTouchMoveListener) {
                this.windowTouchMoveListener();
            }
            if (this.windowTouchEndListener) {
                this.windowTouchEndListener();
            }
            this.windowTouchMoveListener = null;
            this.windowTouchEndListener = null;
            event.preventDefault();
        }
    }
    onMouseMove(event) {
        if (!this.disabled && !this.readonly) {
            this.updateValue(event.offsetX, event.offsetY);
            event.preventDefault();
        }
    }
    onTouchMove(event) {
        if (!this.disabled && !this.readonly && event instanceof TouchEvent && event.touches.length === 1) {
            const rect = this.el.nativeElement.children[0].getBoundingClientRect();
            const touch = event.targetTouches.item(0);
            if (touch) {
                const offsetX = touch.clientX - rect.left;
                const offsetY = touch.clientY - rect.top;
                this.updateValue(offsetX, offsetY);
            }
        }
    }
    updateModelValue(newValue) {
        if (newValue > this.max)
            this.value = this.max;
        else if (newValue < this.min)
            this.value = this.min;
        else
            this.value = newValue;
        this.onModelChange(this.value);
        this.onChange.emit(this.value);
    }
    onKeyDown(event) {
        if (!this.disabled && !this.readonly) {
            switch (event.code) {
                case 'ArrowRight':
                case 'ArrowUp': {
                    event.preventDefault();
                    this.updateModelValue(this._value + 1);
                    break;
                }
                case 'ArrowLeft':
                case 'ArrowDown': {
                    event.preventDefault();
                    this.updateModelValue(this._value - 1);
                    break;
                }
                case 'Home': {
                    event.preventDefault();
                    this.updateModelValue(this.min);
                    break;
                }
                case 'End': {
                    event.preventDefault();
                    this.updateModelValue(this.max);
                    break;
                }
                case 'PageUp': {
                    event.preventDefault();
                    this.updateModelValue(this._value + 10);
                    break;
                }
                case 'PageDown': {
                    event.preventDefault();
                    this.updateModelValue(this._value - 10);
                    break;
                }
            }
        }
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
    containerClass() {
        return {
            'p-knob p-component': true,
            'p-disabled': this.disabled
        };
    }
    rangePath() {
        return `M ${this.minX()} ${this.minY()} A ${this.radius} ${this.radius} 0 1 1 ${this.maxX()} ${this.maxY()}`;
    }
    valuePath() {
        return `M ${this.zeroX()} ${this.zeroY()} A ${this.radius} ${this.radius} 0 ${this.largeArc()} ${this.sweep()} ${this.valueX()} ${this.valueY()}`;
    }
    zeroRadians() {
        if (this.min > 0 && this.max > 0)
            return this.mapRange(this.min, this.min, this.max, this.minRadians, this.maxRadians);
        else
            return this.mapRange(0, this.min, this.max, this.minRadians, this.maxRadians);
    }
    valueRadians() {
        return this.mapRange(this._value, this.min, this.max, this.minRadians, this.maxRadians);
    }
    minX() {
        return this.midX + Math.cos(this.minRadians) * this.radius;
    }
    minY() {
        return this.midY - Math.sin(this.minRadians) * this.radius;
    }
    maxX() {
        return this.midX + Math.cos(this.maxRadians) * this.radius;
    }
    maxY() {
        return this.midY - Math.sin(this.maxRadians) * this.radius;
    }
    zeroX() {
        return this.midX + Math.cos(this.zeroRadians()) * this.radius;
    }
    zeroY() {
        return this.midY - Math.sin(this.zeroRadians()) * this.radius;
    }
    valueX() {
        return this.midX + Math.cos(this.valueRadians()) * this.radius;
    }
    valueY() {
        return this.midY - Math.sin(this.valueRadians()) * this.radius;
    }
    largeArc() {
        return Math.abs(this.zeroRadians() - this.valueRadians()) < Math.PI ? 0 : 1;
    }
    sweep() {
        return this.valueRadians() > this.zeroRadians() ? 0 : 1;
    }
    valueToDisplay() {
        return this.valueTemplate.replace('{value}', this._value.toString());
    }
    get _value() {
        return this.value != null ? this.value : this.min;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Knob, deps: [{ token: DOCUMENT }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Knob, selector: "p-knob", inputs: { styleClass: "styleClass", style: "style", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy", tabindex: ["tabindex", "tabindex", numberAttribute], valueColor: "valueColor", rangeColor: "rangeColor", textColor: "textColor", valueTemplate: "valueTemplate", name: "name", size: ["size", "size", numberAttribute], step: ["step", "step", numberAttribute], min: ["min", "min", numberAttribute], max: ["max", "max", numberAttribute], strokeWidth: ["strokeWidth", "strokeWidth", numberAttribute], disabled: ["disabled", "disabled", booleanAttribute], showValue: ["showValue", "showValue", booleanAttribute], readonly: ["readonly", "readonly", booleanAttribute] }, outputs: { onChange: "onChange" }, host: { classAttribute: "p-element" }, providers: [KNOB_VALUE_ACCESSOR], ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" [attr.data-pc-name]="'knob'" [attr.data-pc-section]="'root'">
            <svg
                viewBox="0 0 100 100"
                role="slider"
                [style.width]="size + 'px'"
                [style.height]="size + 'px'"
                (click)="onClick($event)"
                (keydown)="onKeyDown($event)"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
                [attr.aria-valuemin]="min"
                [attr.aria-valuemax]="max"
                [attr.aria-valuenow]="_value"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.tabindex]="readonly || disabled ? -1 : tabindex"
                [attr.data-pc-section]="'svg'"
            >
                <path [attr.d]="rangePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="rangeColor" class="p-knob-range"></path>
                <path [attr.d]="valuePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="valueColor" class="p-knob-value"></path>
                <text *ngIf="showValue" [attr.x]="50" [attr.y]="57" text-anchor="middle" [attr.fill]="textColor" class="p-knob-text" [attr.name]="name">{{ valueToDisplay() }}</text>
            </svg>
        </div>
    `, isInline: true, styles: ["@keyframes dash-frame{to{stroke-dashoffset:0}}@layer primeng{.p-knob-range{fill:none;transition:stroke .1s ease-in}.p-knob-value{animation-name:dash-frame;animation-fill-mode:forwards;fill:none}.p-knob-text{font-size:1.3rem;text-align:center}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Knob, decorators: [{
            type: Component,
            args: [{ selector: 'p-knob', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" [attr.data-pc-name]="'knob'" [attr.data-pc-section]="'root'">
            <svg
                viewBox="0 0 100 100"
                role="slider"
                [style.width]="size + 'px'"
                [style.height]="size + 'px'"
                (click)="onClick($event)"
                (keydown)="onKeyDown($event)"
                (mousedown)="onMouseDown($event)"
                (mouseup)="onMouseUp($event)"
                (touchstart)="onTouchStart($event)"
                (touchend)="onTouchEnd($event)"
                [attr.aria-valuemin]="min"
                [attr.aria-valuemax]="max"
                [attr.aria-valuenow]="_value"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.tabindex]="readonly || disabled ? -1 : tabindex"
                [attr.data-pc-section]="'svg'"
            >
                <path [attr.d]="rangePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="rangeColor" class="p-knob-range"></path>
                <path [attr.d]="valuePath()" [attr.stroke-width]="strokeWidth" [attr.stroke]="valueColor" class="p-knob-value"></path>
                <text *ngIf="showValue" [attr.x]="50" [attr.y]="57" text-anchor="middle" [attr.fill]="textColor" class="p-knob-text" [attr.name]="name">{{ valueToDisplay() }}</text>
            </svg>
        </div>
    `, providers: [KNOB_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@keyframes dash-frame{to{stroke-dashoffset:0}}@layer primeng{.p-knob-range{fill:none;transition:stroke .1s ease-in}.p-knob-value{animation-name:dash-frame;animation-fill-mode:forwards;fill:none}.p-knob-text{font-size:1.3rem;text-align:center}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], valueColor: [{
                type: Input
            }], rangeColor: [{
                type: Input
            }], textColor: [{
                type: Input
            }], valueTemplate: [{
                type: Input
            }], name: [{
                type: Input
            }], size: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], step: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], min: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], max: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], strokeWidth: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showValue: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], readonly: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onChange: [{
                type: Output
            }] } });
class KnobModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: KnobModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: KnobModule, declarations: [Knob], imports: [CommonModule], exports: [Knob] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: KnobModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: KnobModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Knob],
                    declarations: [Knob]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { KNOB_VALUE_ACCESSOR, Knob, KnobModule };
//# sourceMappingURL=primeng-knob.mjs.map
