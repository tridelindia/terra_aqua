import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, NgModule, Output, PLATFORM_ID, ViewChild, ViewEncapsulation, booleanAttribute, forwardRef, numberAttribute } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'primeng/dom';
import { AutoFocusModule } from 'primeng/autofocus';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/autofocus";
export const SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
/**
 * Slider is a component to provide input with a drag handle.
 * @group Components
 */
export class Slider {
    document;
    platformId;
    el;
    renderer;
    ngZone;
    cd;
    /**
     * When enabled, displays an animation on click of the slider bar.
     * @group Props
     */
    animate;
    /**
     * When present, it specifies that the element should be disabled.
     * @group Props
     */
    disabled;
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
     * Orientation of the slider.
     * @group Props
     */
    orientation = 'horizontal';
    /**
     * Step factor to increment/decrement the value.
     * @group Props
     */
    step;
    /**
     * When specified, allows two boundary values to be picked.
     * @group Props
     */
    range;
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
    tabindex = 0;
    /**
     * When present, it specifies that the component should automatically get focus on load.
     * @group Props
     */
    autofocus;
    /**
     * Callback to invoke on value change.
     * @param {SliderChangeEvent} event - Custom value change event.
     * @group Emits
     */
    onChange = new EventEmitter();
    /**
     * Callback to invoke when slide ended.
     * @param {SliderSlideEndEvent} event - Custom slide end event.
     * @group Emits
     */
    onSlideEnd = new EventEmitter();
    sliderHandle;
    sliderHandleStart;
    sliderHandleEnd;
    value;
    values;
    handleValue;
    handleValues = [];
    diff;
    offset;
    bottom;
    onModelChange = () => { };
    onModelTouched = () => { };
    dragging;
    dragListener;
    mouseupListener;
    initX;
    initY;
    barWidth;
    barHeight;
    sliderHandleClick;
    handleIndex = 0;
    startHandleValue;
    startx;
    starty;
    constructor(document, platformId, el, renderer, ngZone, cd) {
        this.document = document;
        this.platformId = platformId;
        this.el = el;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.cd = cd;
    }
    onMouseDown(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        this.bindDragListeners();
        event.target.focus();
        event.preventDefault();
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }
    onDragStart(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0];
        this.startHandleValue = this.range ? this.handleValues[index] : this.handleValue;
        this.dragging = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        if (this.orientation === 'horizontal') {
            this.startx = parseInt(touchobj.clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        }
        else {
            this.starty = parseInt(touchobj.clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
        event.preventDefault();
    }
    onDrag(event) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0], handleValue = 0;
        if (this.orientation === 'horizontal') {
            handleValue = Math.floor(((parseInt(touchobj.clientX, 10) - this.startx) * 100) / this.barWidth) + this.startHandleValue;
        }
        else {
            handleValue = Math.floor(((this.starty - parseInt(touchobj.clientY, 10)) * 100) / this.barHeight) + this.startHandleValue;
        }
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    }
    onDragEnd(event) {
        if (this.disabled) {
            return;
        }
        this.dragging = false;
        if (this.range)
            this.onSlideEnd.emit({ originalEvent: event, values: this.values });
        else
            this.onSlideEnd.emit({ originalEvent: event, value: this.value });
        if (this.animate) {
            DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }
    onBarClick(event) {
        if (this.disabled) {
            return;
        }
        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
            if (this.range)
                this.onSlideEnd.emit({ originalEvent: event, values: this.values });
            else
                this.onSlideEnd.emit({ originalEvent: event, value: this.value });
        }
        this.sliderHandleClick = false;
    }
    onKeyDown(event, index) {
        this.handleIndex = index;
        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.decrementValue(event, index);
                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                this.incrementValue(event, index);
                event.preventDefault();
                break;
            case 'PageDown':
                this.decrementValue(event, index, true);
                event.preventDefault();
                break;
            case 'PageUp':
                this.incrementValue(event, index, true);
                event.preventDefault();
                break;
            case 'Home':
                this.updateValue(this.min, event);
                event.preventDefault();
                break;
            case 'End':
                this.updateValue(this.max, event);
                event.preventDefault();
                break;
            case 'Tab':
                this.onDragEnd(event);
                break;
            default:
                break;
        }
    }
    decrementValue(event, index, pageKey = false) {
        let newValue;
        if (this.range) {
            if (this.step)
                newValue = this.values[index] - this.step;
            else
                newValue = this.values[index] - 1;
        }
        else {
            if (this.step)
                newValue = this.value - this.step;
            else if (!this.step && pageKey)
                newValue = this.value - 10;
            else
                newValue = this.value - 1;
        }
        this.updateValue(newValue, event);
        event.preventDefault();
    }
    incrementValue(event, index, pageKey = false) {
        let newValue;
        if (this.range) {
            if (this.step)
                newValue = this.values[index] + this.step;
            else
                newValue = this.values[index] + 1;
        }
        else {
            if (this.step)
                newValue = this.value + this.step;
            else if (!this.step && pageKey)
                newValue = this.value + 10;
            else
                newValue = this.value + 1;
        }
        this.updateValue(newValue, event);
        event.preventDefault();
    }
    handleChange(event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }
    bindDragListeners() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                const documentTarget = this.el ? this.el.nativeElement.ownerDocument : this.document;
                if (!this.dragListener) {
                    this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                        if (this.dragging) {
                            this.ngZone.run(() => {
                                this.handleChange(event);
                            });
                        }
                    });
                }
                if (!this.mouseupListener) {
                    this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                        if (this.dragging) {
                            this.dragging = false;
                            this.ngZone.run(() => {
                                if (this.range)
                                    this.onSlideEnd.emit({ originalEvent: event, values: this.values });
                                else
                                    this.onSlideEnd.emit({ originalEvent: event, value: this.value });
                                if (this.animate) {
                                    DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
            this.dragListener = null;
        }
        if (this.mouseupListener) {
            this.mouseupListener();
            this.mouseupListener = null;
        }
    }
    setValueFromHandle(event, handleValue) {
        let newValue = this.getValueFromHandle(handleValue);
        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, this.values[this.handleIndex]);
            }
            else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        }
        else {
            if (this.step) {
                this.handleStepChange(newValue, this.value);
            }
            else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }
        this.cd.markForCheck();
    }
    handleStepChange(newValue, oldValue) {
        let diff = newValue - oldValue;
        let val = oldValue;
        let _step = this.step;
        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / _step - oldValue / _step) * _step;
        }
        else if (diff > 0) {
            val = oldValue + Math.floor(newValue / _step - oldValue / _step) * _step;
        }
        this.updateValue(val);
        this.updateHandleValue();
    }
    writeValue(value) {
        if (this.range)
            this.values = value || [0, 0];
        else
            this.value = value || 0;
        this.updateHandleValue();
        this.updateDiffAndOffset();
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
    get rangeStartLeft() {
        if (!this.isVertical())
            return this.handleValues[0] > 100 ? 100 + '%' : this.handleValues[0] + '%';
        return null;
    }
    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }
    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }
    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    updateDomData() {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }
    calculateHandleValue(event) {
        if (this.orientation === 'horizontal')
            return ((event.pageX - this.initX) * 100) / this.barWidth;
        else
            return ((this.initY + this.barHeight - event.pageY) * 100) / this.barHeight;
    }
    updateHandleValue() {
        if (this.range) {
            this.handleValues[0] = ((this.values[0] < this.min ? 0 : this.values[0] - this.min) * 100) / (this.max - this.min);
            this.handleValues[1] = ((this.values[1] > this.max ? 100 : this.values[1] - this.min) * 100) / (this.max - this.min);
        }
        else {
            if (this.value < this.min)
                this.handleValue = 0;
            else if (this.value > this.max)
                this.handleValue = 100;
            else
                this.handleValue = ((this.value - this.min) * 100) / (this.max - this.min);
        }
        if (this.step) {
            this.updateDiffAndOffset();
        }
    }
    updateDiffAndOffset() {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }
    getDiff() {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }
    getOffset() {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }
    updateValue(val, event) {
        if (this.range) {
            let value = val;
            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                }
                else if (value > this.values[1]) {
                    if (value > this.max) {
                        value = this.max;
                        this.handleValues[0] = 100;
                    }
                }
                this.sliderHandleStart?.nativeElement.focus();
            }
            else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                    this.offset = this.handleValues[1];
                }
                else if (value < this.min) {
                    value = this.min;
                    this.handleValues[1] = 0;
                }
                else if (value < this.values[0]) {
                    this.offset = this.handleValues[1];
                }
                this.sliderHandleEnd?.nativeElement.focus();
            }
            if (this.step) {
                this.updateHandleValue();
            }
            else {
                this.updateDiffAndOffset();
            }
            this.values[this.handleIndex] = this.getNormalizedValue(value);
            let newValues = [this.minVal, this.maxVal];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event, values: this.values });
        }
        else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            }
            else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }
            this.value = this.getNormalizedValue(val);
            this.onModelChange(this.value);
            this.onChange.emit({ event: event, value: this.value });
            this.sliderHandle?.nativeElement.focus();
        }
        this.updateHandleValue();
    }
    getValueFromHandle(handleValue) {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }
    getDecimalsCount(value) {
        if (value && Math.floor(value) !== value)
            return value.toString().split('.')[1].length || 0;
        return 0;
    }
    getNormalizedValue(val) {
        let decimalsCount = this.getDecimalsCount(this.step);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        }
        else {
            return Math.floor(val);
        }
    }
    ngOnDestroy() {
        this.unbindDragListeners();
    }
    get minVal() {
        return Math.min(this.values[1], this.values[0]);
    }
    get maxVal() {
        return Math.max(this.values[1], this.values[0]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Slider, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Slider, selector: "p-slider", inputs: { animate: ["animate", "animate", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], min: ["min", "min", numberAttribute], max: ["max", "max", numberAttribute], orientation: "orientation", step: ["step", "step", numberAttribute], range: ["range", "range", booleanAttribute], style: "style", styleClass: "styleClass", ariaLabel: "ariaLabel", ariaLabelledBy: "ariaLabelledBy", tabindex: ["tabindex", "tabindex", numberAttribute], autofocus: ["autofocus", "autofocus", booleanAttribute] }, outputs: { onChange: "onChange", onSlideEnd: "onSlideEnd" }, host: { classAttribute: "p-element" }, providers: [SLIDER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "sliderHandle", first: true, predicate: ["sliderHandle"], descendants: true }, { propertyName: "sliderHandleStart", first: true, predicate: ["sliderHandleStart"], descendants: true }, { propertyName: "sliderHandleEnd", first: true, predicate: ["sliderHandleEnd"], descendants: true }], ngImport: i0, template: `
        <div
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }"
            (click)="onBarClick($event)"
            [attr.data-pc-name]="'slider'"
            [attr.data-pc-section]="'root'"
        >
            <span
                *ngIf="range && orientation == 'horizontal'"
                class="p-slider-range"
                [ngStyle]="{ left: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
                [attr.data-pc-section]="'range'"
            ></span>
            <span
                *ngIf="range && orientation == 'vertical'"
                class="p-slider-range"
                [ngStyle]="{ bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
                [attr.data-pc-section]="'range'"
            ></span>
            <span *ngIf="!range && orientation == 'vertical'" class="p-slider-range" [attr.data-pc-section]="'range'" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="!range && orientation == 'horizontal'" class="p-slider-range" [attr.data-pc-section]="'range'" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                *ngIf="!range"
                #sliderHandle
                class="p-slider-handle"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                (touchstart)="onDragStart($event)"
                (touchmove)="onDrag($event)"
                (touchend)="onDragEnd($event)"
                (mousedown)="onMouseDown($event)"
                (keydown)="onKeyDown($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'handle'"
                pAutoFocus
                [autofocus]="autofocus"
            ></span>
            <span
                *ngIf="range"
                #sliderHandleStart
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeStartLeft, bottom: rangeStartBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 0 }"
                (keydown)="onKeyDown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onDragStart($event, 0)"
                (touchmove)="onDrag($event, 0)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[0] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'startHandler'"
                pAutoFocus
                [autofocus]="autofocus"
            ></span>
            <span
                *ngIf="range"
                #sliderHandleEnd
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeEndLeft, bottom: rangeEndBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 1 }"
                (keydown)="onKeyDown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onDragStart($event, 1)"
                (touchmove)="onDrag($event, 1)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[1] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'endHandler'"
            ></span>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.AutoFocus, selector: "[pAutoFocus]", inputs: ["autofocus"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Slider, decorators: [{
            type: Component,
            args: [{ selector: 'p-slider', template: `
        <div
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }"
            (click)="onBarClick($event)"
            [attr.data-pc-name]="'slider'"
            [attr.data-pc-section]="'root'"
        >
            <span
                *ngIf="range && orientation == 'horizontal'"
                class="p-slider-range"
                [ngStyle]="{ left: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
                [attr.data-pc-section]="'range'"
            ></span>
            <span
                *ngIf="range && orientation == 'vertical'"
                class="p-slider-range"
                [ngStyle]="{ bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
                [attr.data-pc-section]="'range'"
            ></span>
            <span *ngIf="!range && orientation == 'vertical'" class="p-slider-range" [attr.data-pc-section]="'range'" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="!range && orientation == 'horizontal'" class="p-slider-range" [attr.data-pc-section]="'range'" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                *ngIf="!range"
                #sliderHandle
                class="p-slider-handle"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                (touchstart)="onDragStart($event)"
                (touchmove)="onDrag($event)"
                (touchend)="onDragEnd($event)"
                (mousedown)="onMouseDown($event)"
                (keydown)="onKeyDown($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'handle'"
                pAutoFocus
                [autofocus]="autofocus"
            ></span>
            <span
                *ngIf="range"
                #sliderHandleStart
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeStartLeft, bottom: rangeStartBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 0 }"
                (keydown)="onKeyDown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onDragStart($event, 0)"
                (touchmove)="onDrag($event, 0)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[0] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'startHandler'"
                pAutoFocus
                [autofocus]="autofocus"
            ></span>
            <span
                *ngIf="range"
                #sliderHandleEnd
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeEndLeft, bottom: rangeEndBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 1 }"
                (keydown)="onKeyDown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onDragStart($event, 1)"
                (touchmove)="onDrag($event, 1)"
                (touchend)="onDragEnd($event)"
                [attr.tabindex]="disabled ? null : tabindex"
                role="slider"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[1] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
                [attr.aria-label]="ariaLabel"
                [attr.aria-orientation]="orientation"
                [attr.data-pc-section]="'endHandler'"
            ></span>
        </div>
    `, providers: [SLIDER_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}}\n"] }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }], propDecorators: { animate: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], min: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], max: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], range: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], autofocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onChange: [{
                type: Output
            }], onSlideEnd: [{
                type: Output
            }], sliderHandle: [{
                type: ViewChild,
                args: ['sliderHandle']
            }], sliderHandleStart: [{
                type: ViewChild,
                args: ['sliderHandleStart']
            }], sliderHandleEnd: [{
                type: ViewChild,
                args: ['sliderHandleEnd']
            }] } });
export class SliderModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: SliderModule, declarations: [Slider], imports: [CommonModule, AutoFocusModule], exports: [Slider] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SliderModule, imports: [CommonModule, AutoFocusModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, AutoFocusModule],
                    exports: [Slider],
                    declarations: [Slider]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RSxPQUFPLEVBQ0gsdUJBQXVCLEVBRXZCLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBR1IsTUFBTSxFQUNOLFdBQVcsRUFFWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsZUFBZSxFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7QUFHcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDdEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFDRjs7O0dBR0c7QUF5R0gsTUFBTSxPQUFPLE1BQU07SUFnSWU7SUFDRztJQUN0QjtJQUNBO0lBQ0M7SUFDRDtJQXBJWDs7O09BR0c7SUFDcUMsT0FBTyxDQUFzQjtJQUNyRTs7O09BR0c7SUFDcUMsUUFBUSxDQUFzQjtJQUN0RTs7O09BR0c7SUFDb0MsR0FBRyxHQUFXLENBQUMsQ0FBQztJQUN2RDs7O09BR0c7SUFDb0MsR0FBRyxHQUFXLEdBQUcsQ0FBQztJQUN6RDs7O09BR0c7SUFDTSxXQUFXLEdBQThCLFlBQVksQ0FBQztJQUMvRDs7O09BR0c7SUFDb0MsSUFB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Z0JBS0csU0FBUztzQkFBaEQsS0FBSzt1QkFBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRTtnQkFNNUIsUUFBUTtzQkFBakIsTUFBTTtnQkFNRyxVQUFVO3NCQUFuQixNQUFNO2dCQUVvQixZQUFZO3NCQUF0QyxTQUFTO3VCQUFDLGNBQWM7Z0JBRU8saUJBQWlCO3NCQUFoRCxTQUFTO3VCQUFDLG1CQUFtQjtnQkFFQSxlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjs7QUFnZmhDLE1BQU0sT0FBTyxZQUFZO3VHQUFaLFlBQVk7d0dBQVosWUFBWSxpQkFua0JaLE1BQU0sYUErakJMLFlBQVksRUFBRSxlQUFlLGFBL2pCOUIsTUFBTTt3R0Fta0JOLFlBQVksWUFKWCxZQUFZLEVBQUUsZUFBZTs7MkZBSTlCLFlBQVk7a0JBTHhCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQztvQkFDeEMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUNqQixZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUM7aUJBQ3pCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5qZWN0LFxuICAgIElucHV0LFxuICAgIE5nTW9kdWxlLFxuICAgIE5nWm9uZSxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT3V0cHV0LFxuICAgIFBMQVRGT1JNX0lELFxuICAgIFJlbmRlcmVyMixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgICBmb3J3YXJkUmVmLFxuICAgIG51bWJlckF0dHJpYnV0ZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBOdWxsYWJsZSwgVm9pZExpc3RlbmVyIH0gZnJvbSAncHJpbWVuZy90cy1oZWxwZXJzJztcbmltcG9ydCB7IEF1dG9Gb2N1c01vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXV0b2ZvY3VzJztcbmltcG9ydCB7IFNsaWRlckNoYW5nZUV2ZW50LCBTbGlkZXJTbGlkZUVuZEV2ZW50IH0gZnJvbSAnLi9zbGlkZXIuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNvbnN0IFNMSURFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWRlciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIFNsaWRlciBpcyBhIGNvbXBvbmVudCB0byBwcm92aWRlIGlucHV0IHdpdGggYSBkcmFnIGhhbmRsZS5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1zbGlkZXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXZcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJzdHlsZUNsYXNzXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3Atc2xpZGVyIHAtY29tcG9uZW50JzogdHJ1ZSwgJ3AtZGlzYWJsZWQnOiBkaXNhYmxlZCwgJ3Atc2xpZGVyLWhvcml6b250YWwnOiBvcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcsICdwLXNsaWRlci12ZXJ0aWNhbCc6IG9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcsICdwLXNsaWRlci1hbmltYXRlJzogYW5pbWF0ZSB9XCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbkJhckNsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgW2F0dHIuZGF0YS1wYy1uYW1lXT1cIidzbGlkZXInXCJcbiAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncm9vdCdcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICpuZ0lmPVwicmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtc2xpZGVyLXJhbmdlXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJ7IGxlZnQ6IG9mZnNldCAhPT0gbnVsbCAmJiBvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCArICclJyA6IGhhbmRsZVZhbHVlc1swXSArICclJywgd2lkdGg6IGRpZmYgPyBkaWZmICsgJyUnIDogaGFuZGxlVmFsdWVzWzFdIC0gaGFuZGxlVmFsdWVzWzBdICsgJyUnIH1cIlxuICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncmFuZ2UnXCJcbiAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICpuZ0lmPVwicmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJ1wiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwieyBib3R0b206IG9mZnNldCAhPT0gbnVsbCAmJiBvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCArICclJyA6IGhhbmRsZVZhbHVlc1swXSArICclJywgaGVpZ2h0OiBkaWZmID8gZGlmZiArICclJyA6IGhhbmRsZVZhbHVlc1sxXSAtIGhhbmRsZVZhbHVlc1swXSArICclJyB9XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ3JhbmdlJ1wiXG4gICAgICAgICAgICA+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhcmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJ1wiIGNsYXNzPVwicC1zbGlkZXItcmFuZ2VcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ3JhbmdlJ1wiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBoYW5kbGVWYWx1ZSArICclJyB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhcmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnXCIgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncmFuZ2UnXCIgW25nU3R5bGVdPVwieyB3aWR0aDogaGFuZGxlVmFsdWUgKyAnJScgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgKm5nSWY9XCIhcmFuZ2VcIlxuICAgICAgICAgICAgICAgICNzbGlkZXJIYW5kbGVcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtc2xpZGVyLWhhbmRsZVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRyYW5zaXRpb25dPVwiZHJhZ2dpbmcgPyAnbm9uZScgOiBudWxsXCJcbiAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJ7IGxlZnQ6IG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJyA/IGhhbmRsZVZhbHVlICsgJyUnIDogbnVsbCwgYm90dG9tOiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnID8gaGFuZGxlVmFsdWUgKyAnJScgOiBudWxsIH1cIlxuICAgICAgICAgICAgICAgICh0b3VjaHN0YXJ0KT1cIm9uRHJhZ1N0YXJ0KCRldmVudClcIlxuICAgICAgICAgICAgICAgICh0b3VjaG1vdmUpPVwib25EcmFnKCRldmVudClcIlxuICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvbkRyYWdFbmQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJvbk1vdXNlRG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIHJvbGU9XCJzbGlkZXJcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1vcmllbnRhdGlvbl09XCJvcmllbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidoYW5kbGUnXCJcbiAgICAgICAgICAgICAgICBwQXV0b0ZvY3VzXG4gICAgICAgICAgICAgICAgW2F1dG9mb2N1c109XCJhdXRvZm9jdXNcIlxuICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgI3NsaWRlckhhbmRsZVN0YXJ0XG4gICAgICAgICAgICAgICAgW3N0eWxlLnRyYW5zaXRpb25dPVwiZHJhZ2dpbmcgPyAnbm9uZScgOiBudWxsXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtc2xpZGVyLWhhbmRsZVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwieyBsZWZ0OiByYW5nZVN0YXJ0TGVmdCwgYm90dG9tOiByYW5nZVN0YXJ0Qm90dG9tIH1cIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3Atc2xpZGVyLWhhbmRsZS1hY3RpdmUnOiBoYW5kbGVJbmRleCA9PSAwIH1cIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQsIDApXCJcbiAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudCwgMClcIlxuICAgICAgICAgICAgICAgICh0b3VjaHN0YXJ0KT1cIm9uRHJhZ1N0YXJ0KCRldmVudCwgMClcIlxuICAgICAgICAgICAgICAgICh0b3VjaG1vdmUpPVwib25EcmFnKCRldmVudCwgMClcIlxuICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvbkRyYWdFbmQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIHJvbGU9XCJzbGlkZXJcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMF0gOiBudWxsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1vcmllbnRhdGlvbl09XCJvcmllbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidzdGFydEhhbmRsZXInXCJcbiAgICAgICAgICAgICAgICBwQXV0b0ZvY3VzXG4gICAgICAgICAgICAgICAgW2F1dG9mb2N1c109XCJhdXRvZm9jdXNcIlxuICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgI3NsaWRlckhhbmRsZUVuZFxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uXT1cImRyYWdnaW5nID8gJ25vbmUnIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1oYW5kbGVcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgbGVmdDogcmFuZ2VFbmRMZWZ0LCBib3R0b206IHJhbmdlRW5kQm90dG9tIH1cIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3Atc2xpZGVyLWhhbmRsZS1hY3RpdmUnOiBoYW5kbGVJbmRleCA9PSAxIH1cIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQsIDEpXCJcbiAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudCwgMSlcIlxuICAgICAgICAgICAgICAgICh0b3VjaHN0YXJ0KT1cIm9uRHJhZ1N0YXJ0KCRldmVudCwgMSlcIlxuICAgICAgICAgICAgICAgICh0b3VjaG1vdmUpPVwib25EcmFnKCRldmVudCwgMSlcIlxuICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvbkRyYWdFbmQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIHJvbGU9XCJzbGlkZXJcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMV0gOiBudWxsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1vcmllbnRhdGlvbl09XCJvcmllbnRhdGlvblwiXG4gICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidlbmRIYW5kbGVyJ1wiXG4gICAgICAgICAgICA+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIHByb3ZpZGVyczogW1NMSURFUl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9zbGlkZXIuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlciBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIFdoZW4gZW5hYmxlZCwgZGlzcGxheXMgYW4gYW5pbWF0aW9uIG9uIGNsaWNrIG9mIHRoZSBzbGlkZXIgYmFyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBhbmltYXRlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZW4gcHJlc2VudCwgaXQgc3BlY2lmaWVzIHRoYXQgdGhlIGVsZW1lbnQgc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBkaXNhYmxlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBNaW5pbnVtIGJvdW5kYXJ5IHZhbHVlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlIH0pIG1pbjogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIGJvdW5kYXJ5IHZhbHVlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlIH0pIG1heDogbnVtYmVyID0gMTAwO1xuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSBzbGlkZXIuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gICAgLyoqXG4gICAgICogU3RlcCBmYWN0b3IgdG8gaW5jcmVtZW50L2RlY3JlbWVudCB0aGUgdmFsdWUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgc3RlcDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZW4gc3BlY2lmaWVkLCBhbGxvd3MgdHdvIGJvdW5kYXJ5IHZhbHVlcyB0byBiZSBwaWNrZWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHJhbmdlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBzdHJpbmcgdGhhdCBsYWJlbHMgdGhlIGlucHV0IGZvciBhY2Nlc3NpYmlsaXR5LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIEVzdGFibGlzaGVzIHJlbGF0aW9uc2hpcHMgYmV0d2VlbiB0aGUgY29tcG9uZW50IGFuZCBsYWJlbChzKSB3aGVyZSBpdHMgdmFsdWUgc2hvdWxkIGJlIG9uZSBvciBtb3JlIGVsZW1lbnQgSURzLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogSW5kZXggb2YgdGhlIGVsZW1lbnQgaW4gdGFiYmluZyBvcmRlci5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSB0YWJpbmRleDogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBXaGVuIHByZXNlbnQsIGl0IHNwZWNpZmllcyB0aGF0IHRoZSBjb21wb25lbnQgc2hvdWxkIGF1dG9tYXRpY2FsbHkgZ2V0IGZvY3VzIG9uIGxvYWQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIGF1dG9mb2N1czogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugb24gdmFsdWUgY2hhbmdlLlxuICAgICAqIEBwYXJhbSB7U2xpZGVyQ2hhbmdlRXZlbnR9IGV2ZW50IC0gQ3VzdG9tIHZhbHVlIGNoYW5nZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxTbGlkZXJDaGFuZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFNsaWRlckNoYW5nZUV2ZW50PigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHNsaWRlIGVuZGVkLlxuICAgICAqIEBwYXJhbSB7U2xpZGVyU2xpZGVFbmRFdmVudH0gZXZlbnQgLSBDdXN0b20gc2xpZGUgZW5kIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvblNsaWRlRW5kOiBFdmVudEVtaXR0ZXI8U2xpZGVyU2xpZGVFbmRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFNsaWRlclNsaWRlRW5kRXZlbnQ+KCk7XG5cbiAgICBAVmlld0NoaWxkKCdzbGlkZXJIYW5kbGUnKSBzbGlkZXJIYW5kbGU6IE51bGxhYmxlPEVsZW1lbnRSZWY+O1xuXG4gICAgQFZpZXdDaGlsZCgnc2xpZGVySGFuZGxlU3RhcnQnKSBzbGlkZXJIYW5kbGVTdGFydDogTnVsbGFibGU8RWxlbWVudFJlZj47XG5cbiAgICBAVmlld0NoaWxkKCdzbGlkZXJIYW5kbGVFbmQnKSBzbGlkZXJIYW5kbGVFbmQ6IE51bGxhYmxlPEVsZW1lbnRSZWY+O1xuXG4gICAgcHVibGljIHZhbHVlOiBOdWxsYWJsZTxudW1iZXI+O1xuXG4gICAgcHVibGljIHZhbHVlczogTnVsbGFibGU8bnVtYmVyW10+O1xuXG4gICAgcHVibGljIGhhbmRsZVZhbHVlOiBOdWxsYWJsZTxudW1iZXI+O1xuXG4gICAgcHVibGljIGhhbmRsZVZhbHVlczogbnVtYmVyW10gPSBbXTtcblxuICAgIGRpZmY6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBvZmZzZXQ6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBib3R0b206IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBwdWJsaWMgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHB1YmxpYyBkcmFnZ2luZzogTnVsbGFibGU8Ym9vbGVhbj47XG5cbiAgICBwdWJsaWMgZHJhZ0xpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBwdWJsaWMgbW91c2V1cExpc3RlbmVyOiBWb2lkTGlzdGVuZXI7XG5cbiAgICBwdWJsaWMgaW5pdFg6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBwdWJsaWMgaW5pdFk6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBwdWJsaWMgYmFyV2lkdGg6IE51bGxhYmxlPG51bWJlcj47XG5cbiAgICBwdWJsaWMgYmFySGVpZ2h0OiBOdWxsYWJsZTxudW1iZXI+O1xuXG4gICAgcHVibGljIHNsaWRlckhhbmRsZUNsaWNrOiBOdWxsYWJsZTxib29sZWFuPjtcblxuICAgIHB1YmxpYyBoYW5kbGVJbmRleDogbnVtYmVyID0gMDtcblxuICAgIHB1YmxpYyBzdGFydEhhbmRsZVZhbHVlOiBhbnk7XG5cbiAgICBwdWJsaWMgc3RhcnR4OiBOdWxsYWJsZTxudW1iZXI+O1xuXG4gICAgcHVibGljIHN0YXJ0eTogTnVsbGFibGU8bnVtYmVyPjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCxcbiAgICAgICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgICApIHt9XG5cbiAgICBvbk1vdXNlRG93bihldmVudDogRXZlbnQsIGluZGV4PzogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEb21EYXRhKCk7XG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlQ2xpY2sgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5yYW5nZSAmJiB0aGlzLmhhbmRsZVZhbHVlcyAmJiB0aGlzLmhhbmRsZVZhbHVlc1swXSA9PT0gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKHRoaXMuaGFuZGxlSW5kZXggYXMgYW55KSA9IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iaW5kRHJhZ0xpc3RlbmVycygpO1xuICAgICAgICAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZvY3VzKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyYWdTdGFydChldmVudDogVG91Y2hFdmVudCwgaW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaG9iaiA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgICB0aGlzLnN0YXJ0SGFuZGxlVmFsdWUgPSB0aGlzLnJhbmdlID8gdGhpcy5oYW5kbGVWYWx1ZXNbaW5kZXggYXMgbnVtYmVyXSA6IHRoaXMuaGFuZGxlVmFsdWU7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5yYW5nZSAmJiB0aGlzLmhhbmRsZVZhbHVlcyAmJiB0aGlzLmhhbmRsZVZhbHVlc1swXSA9PT0gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVJbmRleCA9IGluZGV4IGFzIG51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR4ID0gcGFyc2VJbnQoKHRvdWNob2JqIGFzIGFueSkuY2xpZW50WCwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR5ID0gcGFyc2VJbnQoKHRvdWNob2JqIGFzIGFueSkuY2xpZW50WSwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uRHJhZyhldmVudDogVG91Y2hFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvdWNob2JqID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sXG4gICAgICAgICAgICBoYW5kbGVWYWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgocGFyc2VJbnQoKHRvdWNob2JqIGFzIGFueSkuY2xpZW50WCwgMTApIC0gKHRoaXMuc3RhcnR4IGFzIG51bWJlcikpICogMTAwKSAvICh0aGlzLmJhcldpZHRoIGFzIG51bWJlcikpICsgdGhpcy5zdGFydEhhbmRsZVZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgoKHRoaXMuc3RhcnR5IGFzIG51bWJlcikgLSBwYXJzZUludCgodG91Y2hvYmogYXMgYW55KS5jbGllbnRZLCAxMCkpICogMTAwKSAvICh0aGlzLmJhckhlaWdodCBhcyBudW1iZXIpKSArIHRoaXMuc3RhcnRIYW5kbGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWVGcm9tSGFuZGxlKGV2ZW50LCBoYW5kbGVWYWx1ZSk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkRyYWdFbmQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZSkgdGhpcy5vblNsaWRlRW5kLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgdmFsdWVzOiB0aGlzLnZhbHVlcyBhcyBudW1iZXJbXSB9KTtcbiAgICAgICAgZWxzZSB0aGlzLm9uU2xpZGVFbmQuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZSBhcyBudW1iZXIgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkJhckNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnNsaWRlckhhbmRsZUNsaWNrKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURvbURhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHRoaXMub25TbGlkZUVuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXMgYXMgbnVtYmVyW10gfSk7XG4gICAgICAgICAgICBlbHNlIHRoaXMub25TbGlkZUVuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlOiB0aGlzLnZhbHVlIGFzIG51bWJlciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlQ2xpY2sgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbktleURvd24oZXZlbnQsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSBpbmRleDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGVjcmVtZW50VmFsdWUoZXZlbnQsIGluZGV4KTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIHRoaXMuaW5jcmVtZW50VmFsdWUoZXZlbnQsIGluZGV4KTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdQYWdlRG93bic6XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNyZW1lbnRWYWx1ZShldmVudCwgaW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ1BhZ2VVcCc6XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnRWYWx1ZShldmVudCwgaW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ0hvbWUnOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUodGhpcy5taW4sIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdFbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUodGhpcy5tYXgsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdUYWInOlxuICAgICAgICAgICAgICAgIHRoaXMub25EcmFnRW5kKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlY3JlbWVudFZhbHVlKGV2ZW50LCBpbmRleCwgcGFnZUtleSA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCkgbmV3VmFsdWUgPSB0aGlzLnZhbHVlc1tpbmRleF0gLSB0aGlzLnN0ZXA7XG4gICAgICAgICAgICBlbHNlIG5ld1ZhbHVlID0gdGhpcy52YWx1ZXNbaW5kZXhdIC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXApIG5ld1ZhbHVlID0gdGhpcy52YWx1ZSAtIHRoaXMuc3RlcDtcbiAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLnN0ZXAgJiYgcGFnZUtleSkgbmV3VmFsdWUgPSB0aGlzLnZhbHVlIC0gMTA7XG4gICAgICAgICAgICBlbHNlIG5ld1ZhbHVlID0gdGhpcy52YWx1ZSAtIDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKG5ld1ZhbHVlLCBldmVudCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaW5jcmVtZW50VmFsdWUoZXZlbnQsIGluZGV4LCBwYWdlS2V5ID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwKSBuZXdWYWx1ZSA9IHRoaXMudmFsdWVzW2luZGV4XSArIHRoaXMuc3RlcDtcbiAgICAgICAgICAgIGVsc2UgbmV3VmFsdWUgPSB0aGlzLnZhbHVlc1tpbmRleF0gKyAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCkgbmV3VmFsdWUgPSB0aGlzLnZhbHVlICsgdGhpcy5zdGVwO1xuICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuc3RlcCAmJiBwYWdlS2V5KSBuZXdWYWx1ZSA9IHRoaXMudmFsdWUgKyAxMDtcbiAgICAgICAgICAgIGVsc2UgbmV3VmFsdWUgPSB0aGlzLnZhbHVlICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVDaGFuZ2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGxldCBoYW5kbGVWYWx1ZSA9IHRoaXMuY2FsY3VsYXRlSGFuZGxlVmFsdWUoZXZlbnQpO1xuICAgICAgICB0aGlzLnNldFZhbHVlRnJvbUhhbmRsZShldmVudCwgaGFuZGxlVmFsdWUpO1xuICAgIH1cblxuICAgIGJpbmREcmFnTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiB0aGlzLmRvY3VtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRyYWdMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1vdXNldXBMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdXNldXBMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnbW91c2V1cCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHRoaXMub25TbGlkZUVuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXMgYXMgbnVtYmVyW10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5vblNsaWRlRW5kLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgdmFsdWU6IHRoaXMudmFsdWUgYXMgbnVtYmVyIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLCAncC1zbGlkZXItYW5pbWF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRHJhZ0xpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW91c2V1cExpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNldXBMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5tb3VzZXVwTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0VmFsdWVGcm9tSGFuZGxlKGV2ZW50OiBFdmVudCwgaGFuZGxlVmFsdWU6IGFueSkge1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbUhhbmRsZShoYW5kbGVWYWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0ZXBDaGFuZ2UobmV3VmFsdWUsICh0aGlzLnZhbHVlcyBhcyBhbnkpW3RoaXMuaGFuZGxlSW5kZXhdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbdGhpcy5oYW5kbGVJbmRleF0gPSBoYW5kbGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKG5ld1ZhbHVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTdGVwQ2hhbmdlKG5ld1ZhbHVlLCB0aGlzLnZhbHVlIGFzIGFueSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSBoYW5kbGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKG5ld1ZhbHVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGhhbmRsZVN0ZXBDaGFuZ2UobmV3VmFsdWU6IG51bWJlciwgb2xkVmFsdWU6IG51bWJlcikge1xuICAgICAgICBsZXQgZGlmZiA9IG5ld1ZhbHVlIC0gb2xkVmFsdWU7XG4gICAgICAgIGxldCB2YWwgPSBvbGRWYWx1ZTtcbiAgICAgICAgbGV0IF9zdGVwID0gdGhpcy5zdGVwIGFzIG51bWJlcjtcblxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIHZhbCA9IG9sZFZhbHVlICsgTWF0aC5jZWlsKG5ld1ZhbHVlIC8gX3N0ZXAgLSBvbGRWYWx1ZSAvIF9zdGVwKSAqIF9zdGVwO1xuICAgICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICB2YWwgPSBvbGRWYWx1ZSArIE1hdGguZmxvb3IobmV3VmFsdWUgLyBfc3RlcCAtIG9sZFZhbHVlIC8gX3N0ZXApICogX3N0ZXA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHZhbCk7XG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHRoaXMudmFsdWVzID0gdmFsdWUgfHwgWzAsIDBdO1xuICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaWZmQW5kT2Zmc2V0KCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldCByYW5nZVN0YXJ0TGVmdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmVydGljYWwoKSkgcmV0dXJuIHRoaXMuaGFuZGxlVmFsdWVzWzBdID4gMTAwID8gMTAwICsgJyUnIDogdGhpcy5oYW5kbGVWYWx1ZXNbMF0gKyAnJSc7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCByYW5nZVN0YXJ0Qm90dG9tKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmhhbmRsZVZhbHVlc1swXSArICclJyA6ICdhdXRvJztcbiAgICB9XG5cbiAgICBnZXQgcmFuZ2VFbmRMZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyBudWxsIDogdGhpcy5oYW5kbGVWYWx1ZXNbMV0gKyAnJSc7XG4gICAgfVxuXG4gICAgZ2V0IHJhbmdlRW5kQm90dG9tKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmhhbmRsZVZhbHVlc1sxXSArICclJyA6ICdhdXRvJztcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICB1cGRhdGVEb21EYXRhKCk6IHZvaWQge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5pbml0WCA9IHJlY3QubGVmdCArIERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICB0aGlzLmluaXRZID0gcmVjdC50b3AgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICB0aGlzLmJhcldpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmJhckhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlVmFsdWUoZXZlbnQ6IEV2ZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykgcmV0dXJuICgoKGV2ZW50IGFzIE1vdXNlRXZlbnQpLnBhZ2VYIC0gKHRoaXMuaW5pdFggYXMgbnVtYmVyKSkgKiAxMDApIC8gKHRoaXMuYmFyV2lkdGggYXMgbnVtYmVyKTtcbiAgICAgICAgZWxzZSByZXR1cm4gKCgodGhpcy5pbml0WSBhcyBudW1iZXIpICsgKHRoaXMuYmFySGVpZ2h0IGFzIG51bWJlcikgLSAoZXZlbnQgYXMgTW91c2VFdmVudCkucGFnZVkpICogMTAwKSAvICh0aGlzLmJhckhlaWdodCBhcyBudW1iZXIpO1xuICAgIH1cblxuICAgIHVwZGF0ZUhhbmRsZVZhbHVlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPSAoKCh0aGlzLnZhbHVlcyBhcyBudW1iZXJbXSlbMF0gPCB0aGlzLm1pbiA/IDAgOiAodGhpcy52YWx1ZXMgYXMgbnVtYmVyW10pWzBdIC0gdGhpcy5taW4pICogMTAwKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzFdID0gKCgodGhpcy52YWx1ZXMgYXMgbnVtYmVyW10pWzFdID4gdGhpcy5tYXggPyAxMDAgOiAodGhpcy52YWx1ZXMgYXMgbnVtYmVyW10pWzFdIC0gdGhpcy5taW4pICogMTAwKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgodGhpcy52YWx1ZSBhcyBudW1iZXIpIDwgdGhpcy5taW4pIHRoaXMuaGFuZGxlVmFsdWUgPSAwO1xuICAgICAgICAgICAgZWxzZSBpZiAoKHRoaXMudmFsdWUgYXMgbnVtYmVyKSA+IHRoaXMubWF4KSB0aGlzLmhhbmRsZVZhbHVlID0gMTAwO1xuICAgICAgICAgICAgZWxzZSB0aGlzLmhhbmRsZVZhbHVlID0gKCgodGhpcy52YWx1ZSBhcyBudW1iZXIpIC0gdGhpcy5taW4pICogMTAwKSAvICh0aGlzLm1heCAtIHRoaXMubWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRGlmZkFuZE9mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlRGlmZkFuZE9mZnNldCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaWZmID0gdGhpcy5nZXREaWZmKCk7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5nZXRPZmZzZXQoKTtcbiAgICB9XG5cbiAgICBnZXREaWZmKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLmhhbmRsZVZhbHVlc1swXSAtIHRoaXMuaGFuZGxlVmFsdWVzWzFdKTtcbiAgICB9XG5cbiAgICBnZXRPZmZzZXQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMuaGFuZGxlVmFsdWVzWzBdLCB0aGlzLmhhbmRsZVZhbHVlc1sxXSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVmFsdWUodmFsOiBudW1iZXIsIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHZhbDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlSW5kZXggPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzBdID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gKHRoaXMudmFsdWVzIGFzIG51bWJlcltdKVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzBdID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlU3RhcnQ/Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5oYW5kbGVWYWx1ZXNbMV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzFdID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlIDwgKHRoaXMudmFsdWVzIGFzIG51bWJlcltdKVswXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMuaGFuZGxlVmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlckhhbmRsZUVuZD8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVWYWx1ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZURpZmZBbmRPZmZzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgKHRoaXMudmFsdWVzIGFzIG51bWJlcltdKVt0aGlzLmhhbmRsZUluZGV4XSA9IHRoaXMuZ2V0Tm9ybWFsaXplZFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGxldCBuZXdWYWx1ZXMgPSBbdGhpcy5taW5WYWwsIHRoaXMubWF4VmFsXTtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZShuZXdWYWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHsgZXZlbnQ6IGV2ZW50IGFzIEV2ZW50LCB2YWx1ZXM6IHRoaXMudmFsdWVzIGFzIG51bWJlcltdIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHZhbCA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbCA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy5tYXg7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IDEwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0Tm9ybWFsaXplZFZhbHVlKHZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7IGV2ZW50OiBldmVudCBhcyBFdmVudCwgdmFsdWU6IHRoaXMudmFsdWUgfSk7XG4gICAgICAgICAgICB0aGlzLnNsaWRlckhhbmRsZT8ubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICB9XG5cbiAgICBnZXRWYWx1ZUZyb21IYW5kbGUoaGFuZGxlVmFsdWU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAodGhpcy5tYXggLSB0aGlzLm1pbikgKiAoaGFuZGxlVmFsdWUgLyAxMDApICsgdGhpcy5taW47XG4gICAgfVxuXG4gICAgZ2V0RGVjaW1hbHNDb3VudCh2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIE1hdGguZmxvb3IodmFsdWUpICE9PSB2YWx1ZSkgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXS5sZW5ndGggfHwgMDtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgZ2V0Tm9ybWFsaXplZFZhbHVlKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGRlY2ltYWxzQ291bnQgPSB0aGlzLmdldERlY2ltYWxzQ291bnQodGhpcy5zdGVwIGFzIG51bWJlcik7XG4gICAgICAgIGlmIChkZWNpbWFsc0NvdW50ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuICtwYXJzZUZsb2F0KHZhbC50b1N0cmluZygpKS50b0ZpeGVkKGRlY2ltYWxzQ291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodmFsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZERyYWdMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBnZXQgbWluVmFsKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oKHRoaXMudmFsdWVzIGFzIG51bWJlcltdKVsxXSwgKHRoaXMudmFsdWVzIGFzIG51bWJlcltdKVswXSk7XG4gICAgfVxuICAgIGdldCBtYXhWYWwoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgodGhpcy52YWx1ZXMgYXMgbnVtYmVyW10pWzFdLCAodGhpcy52YWx1ZXMgYXMgbnVtYmVyW10pWzBdKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQXV0b0ZvY3VzTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2xpZGVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTbGlkZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlck1vZHVsZSB7fVxuIl19