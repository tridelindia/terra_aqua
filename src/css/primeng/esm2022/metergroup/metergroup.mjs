import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, NgModule, ViewEncapsulation, forwardRef, inject, ViewChild } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class MeterGroupLabel {
    value = null;
    labelPosition = 'end';
    labelOrientation = 'horizontal';
    min;
    max;
    iconTemplate;
    templates;
    get labelClass() {
        return {
            'p-metergroup-labels p-component': true,
            'p-metergroup-labels-vertical': this.labelOrientation === 'vertical',
            'p-metergroup-labels-horizontal': this.labelOrientation === 'horizontal'
        };
    }
    parentInstance = inject(forwardRef(() => MeterGroup));
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupLabel, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: MeterGroupLabel, selector: "p-meterGroupLabel", inputs: { value: "value", labelPosition: "labelPosition", labelOrientation: "labelOrientation", min: "min", max: "max", iconTemplate: "iconTemplate" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance?.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupLabel, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-meterGroupLabel',
                    template: `
        <ol [ngClass]="labelClass">
            <li *ngFor="let labelItem of value; let index = index; trackBy: parentInstance.trackByFn" class="p-metergroup-label">
                <ng-container *ngIf="!iconTemplate">
                    <i *ngIf="labelItem.icon" [class]="labelItem.icon" [ngClass]="{ 'p-metergroup-label-icon': true }" [ngStyle]="{ color: labelItem.color }"></i>
                    <span *ngIf="!labelItem.icon" class="p-metergroup-label-marker" [ngStyle]="{ backgroundColor: labelItem.color }"></span>
                </ng-container>
                <ng-container *ngTemplateOutlet="iconTemplate; context: { $implicit: labelItem, icon: labelItem.icon }"></ng-container>
                <span class="p-metergroup-label-text">{{ labelItem.label }} ({{ parentInstance?.percentValue(labelItem.value) }})</span>
            </li>
        </ol>
    `
                }]
        }], propDecorators: { value: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], labelOrientation: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], iconTemplate: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
/**
 * MeterGroup displays scalar measurements within a known range.
 * @group Components
 */
export class MeterGroup {
    /**
     * Current value of the metergroup.
     * @group Props
     */
    value;
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
     * Specifies the layout of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    orientation = 'horizontal';
    /**
     * Specifies the label position of the component, valid values are 'start' and 'end'.
     * @group Props
     */
    labelPosition = 'end';
    /**
     * Specifies the label orientation of the component, valid values are 'horizontal' and 'vertical'.
     * @group Props
     */
    labelOrientation = 'horizontal';
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
    templates;
    get vertical() {
        return this.orientation === 'vertical';
    }
    get containerClass() {
        return {
            'p-metergroup p-component': true,
            'p-metergroup-horizontal': this.orientation === 'horizontal',
            'p-metergroup-vertical': this.orientation === 'vertical'
        };
    }
    labelTemplate;
    meterTemplate;
    endTemplate;
    startTemplate;
    iconTemplate;
    container;
    ngAfterViewInit() {
        const _container = this.container.nativeElement;
        const height = DomHandler.getOuterHeight(_container);
        this.vertical && (_container.style.height = height + 'px');
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'label':
                    this.labelTemplate = item.template;
                    break;
                case 'meter':
                    this.meterTemplate = item.template;
                    break;
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
                default:
                    break;
            }
        });
    }
    percent(meter = 0) {
        const percentOfItem = ((meter - this.min) / (this.max - this.min)) * 100;
        return Math.round(Math.max(0, Math.min(100, percentOfItem)));
    }
    percentValue(meter) {
        return this.percent(meter) + '%';
    }
    meterStyle(val) {
        return {
            backgroundColor: val.color,
            width: this.orientation === 'horizontal' && this.percentValue(val.value),
            height: this.orientation === 'vertical' && this.percentValue(val.value)
        };
    }
    totalPercent() {
        return this.percent(this.value.reduce((total, val) => total + val.value, 0));
    }
    percentages() {
        let sum = 0;
        const sumsArray = [];
        this.value.forEach((item) => {
            sum += item.value;
            sumsArray.push(sum);
        });
        return sumsArray;
    }
    trackByFn(index) {
        return index;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroup, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.1", type: MeterGroup, selector: "p-meterGroup", inputs: { value: "value", min: "min", max: "max", orientation: "orientation", labelPosition: "labelPosition", labelOrientation: "labelOrientation", style: "style", styleClass: "styleClass" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ElementRef }], ngImport: i0, template: `
        <div #container [ngClass]="containerClass" role="meter" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if (labelPosition === 'start') {
                <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container *ngTemplateOutlet="meterTemplate; context: { $implicit: meterItem, index: index, orientation: this.orientation, class: 'p-metergroup-meter', size: percentValue(meterItem.value), totalPercent: totalPercent() }">
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate && meterItem.value > 0">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if (labelPosition === 'end') {
                <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: MeterGroupLabel, selector: "p-meterGroupLabel", inputs: ["value", "labelPosition", "labelOrientation", "min", "max", "iconTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroup, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-meterGroup',
                    template: `
        <div #container [ngClass]="containerClass" role="meter" [attr.aria-valuemin]="min" [attr.aria-valuemax]="max" [attr.aria-valuenow]="totalPercent()" [ngStyle]="style" [class]="styleClass">
            @if (labelPosition === 'start') {
                <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
            <ng-container *ngTemplateOutlet="startTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            <div class="p-metergroup-meters">
                <ng-container *ngFor="let meterItem of value; let index = index; trackBy: trackByFn">
                    <ng-container *ngTemplateOutlet="meterTemplate; context: { $implicit: meterItem, index: index, orientation: this.orientation, class: 'p-metergroup-meter', size: percentValue(meterItem.value), totalPercent: totalPercent() }">
                    </ng-container>
                    <ng-container *ngIf="!meterTemplate && meterItem.value > 0">
                        <span class="p-metergroup-meter" [ngStyle]="meterStyle(meterItem)"></span>
                    </ng-container>
                </ng-container>
            </div>
            <ng-container *ngTemplateOutlet="endTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            @if (labelPosition === 'end') {
                <p-meterGroupLabel *ngIf="!labelTemplate" [value]="value" [labelPosition]="labelPosition" [labelOrientation]="labelOrientation" [min]="min" [max]="max" [iconTemplate]="iconTemplate" />
                <ng-container *ngTemplateOutlet="labelTemplate; context: { $implicit: value, totalPercent: totalPercent(), percentages: percentages() }"></ng-container>
            }
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }]
        }], propDecorators: { value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], orientation: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], labelOrientation: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], container: [{
                type: ViewChild,
                args: ['container', { read: ElementRef }]
            }] } });
export class MeterGroupModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupModule, declarations: [MeterGroup, MeterGroupLabel], imports: [CommonModule, SharedModule], exports: [MeterGroup, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupModule, imports: [CommonModule, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: MeterGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [MeterGroup, SharedModule],
                    declarations: [MeterGroup, MeterGroupLabel]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0ZXJncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZXRlcmdyb3VwL21ldGVyZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBMEIsaUJBQWlCLEVBQVUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDck4sT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBa0J6QyxNQUFNLE9BQU8sZUFBZTtJQUNmLEtBQUssR0FBVSxJQUFJLENBQUM7SUFFcEIsYUFBYSxHQUFvQixLQUFLLENBQUM7SUFFdkMsZ0JBQWdCLEdBQThCLFlBQVksQ0FBQztJQUUzRCxHQUFHLENBQVM7SUFFWixHQUFHLENBQVM7SUFFWixZQUFZLENBQStCO0lBRXBCLFNBQVMsQ0FBdUM7SUFFaEYsSUFBSSxVQUFVO1FBQ1YsT0FBTztZQUNILGlDQUFpQyxFQUFFLElBQUk7WUFDdkMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixLQUFLLFVBQVU7WUFDcEUsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixLQUFLLFlBQVk7U0FDM0UsQ0FBQztJQUNOLENBQUM7SUFFRCxjQUFjLEdBQWUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3VHQXZCekQsZUFBZTsyRkFBZixlQUFlLDJPQWFQLGFBQWEsNkJBMUJwQjs7Ozs7Ozs7Ozs7S0FXVDs7MkZBRVEsZUFBZTtrQkFmM0IsU0FBUzttQkFBQztv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Q0FBQztpQkFDOUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgQ29udGVudENoaWxkcmVuLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdNb2R1bGUsIFF1ZXJ5TGlzdCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9uLCBlZmZlY3QsIGZvcndhcmRSZWYsIGluamVjdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgTWV0ZXJJdGVtIH0gZnJvbSAnLi9tZXRlcmdyb3VwLmludGVyZmFjZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1tZXRlckdyb3VwTGFiZWwnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxvbCBbbmdDbGFzc109XCJsYWJlbENsYXNzXCI+XG4gICAgICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGxhYmVsSXRlbSBvZiB2YWx1ZTsgbGV0IGluZGV4ID0gaW5kZXg7IHRyYWNrQnk6IHBhcmVudEluc3RhbmNlLnRyYWNrQnlGblwiIGNsYXNzPVwicC1tZXRlcmdyb3VwLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPGkgKm5nSWY9XCJsYWJlbEl0ZW0uaWNvblwiIFtjbGFzc109XCJsYWJlbEl0ZW0uaWNvblwiIFtuZ0NsYXNzXT1cInsgJ3AtbWV0ZXJncm91cC1sYWJlbC1pY29uJzogdHJ1ZSB9XCIgW25nU3R5bGVdPVwieyBjb2xvcjogbGFiZWxJdGVtLmNvbG9yIH1cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIWxhYmVsSXRlbS5pY29uXCIgY2xhc3M9XCJwLW1ldGVyZ3JvdXAtbGFiZWwtbWFya2VyXCIgW25nU3R5bGVdPVwieyBiYWNrZ3JvdW5kQ29sb3I6IGxhYmVsSXRlbS5jb2xvciB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpY29uVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBsYWJlbEl0ZW0sIGljb246IGxhYmVsSXRlbS5pY29uIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWV0ZXJncm91cC1sYWJlbC10ZXh0XCI+e3sgbGFiZWxJdGVtLmxhYmVsIH19ICh7eyBwYXJlbnRJbnN0YW5jZT8ucGVyY2VudFZhbHVlKGxhYmVsSXRlbS52YWx1ZSkgfX0pPC9zcGFuPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgPC9vbD5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIE1ldGVyR3JvdXBMYWJlbCB7XG4gICAgQElucHV0KCkgdmFsdWU6IGFueVtdID0gbnVsbDtcblxuICAgIEBJbnB1dCgpIGxhYmVsUG9zaXRpb246ICdzdGFydCcgfCAnZW5kJyA9ICdlbmQnO1xuXG4gICAgQElucHV0KCkgbGFiZWxPcmllbnRhdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcblxuICAgIEBJbnB1dCgpIG1pbjogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4gfCB1bmRlZmluZWQ7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+IHwgdW5kZWZpbmVkO1xuXG4gICAgZ2V0IGxhYmVsQ2xhc3MoKTogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3AtbWV0ZXJncm91cC1sYWJlbHMgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3AtbWV0ZXJncm91cC1sYWJlbHMtdmVydGljYWwnOiB0aGlzLmxhYmVsT3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICAncC1tZXRlcmdyb3VwLWxhYmVscy1ob3Jpem9udGFsJzogdGhpcy5sYWJlbE9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwYXJlbnRJbnN0YW5jZTogTWV0ZXJHcm91cCA9IGluamVjdChmb3J3YXJkUmVmKCgpID0+IE1ldGVyR3JvdXApKTtcbn1cbi8qKlxuICogTWV0ZXJHcm91cCBkaXNwbGF5cyBzY2FsYXIgbWVhc3VyZW1lbnRzIHdpdGhpbiBhIGtub3duIHJhbmdlLlxuICogQGdyb3VwIENvbXBvbmVudHNcbiAqL1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLW1ldGVyR3JvdXAnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgI2NvbnRhaW5lciBbbmdDbGFzc109XCJjb250YWluZXJDbGFzc1wiIHJvbGU9XCJtZXRlclwiIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInRvdGFsUGVyY2VudCgpXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgQGlmIChsYWJlbFBvc2l0aW9uID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgPHAtbWV0ZXJHcm91cExhYmVsICpuZ0lmPVwiIWxhYmVsVGVtcGxhdGVcIiBbdmFsdWVdPVwidmFsdWVcIiBbbGFiZWxQb3NpdGlvbl09XCJsYWJlbFBvc2l0aW9uXCIgW2xhYmVsT3JpZW50YXRpb25dPVwibGFiZWxPcmllbnRhdGlvblwiIFttaW5dPVwibWluXCIgW21heF09XCJtYXhcIiBbaWNvblRlbXBsYXRlXT1cImljb25UZW1wbGF0ZVwiIC8+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxhYmVsVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWx1ZSwgdG90YWxQZXJjZW50OiB0b3RhbFBlcmNlbnQoKSwgcGVyY2VudGFnZXM6IHBlcmNlbnRhZ2VzKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInN0YXJ0VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiB2YWx1ZSwgdG90YWxQZXJjZW50OiB0b3RhbFBlcmNlbnQoKSwgcGVyY2VudGFnZXM6IHBlcmNlbnRhZ2VzKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWV0ZXJncm91cC1tZXRlcnNcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBtZXRlckl0ZW0gb2YgdmFsdWU7IGxldCBpbmRleCA9IGluZGV4OyB0cmFja0J5OiB0cmFja0J5Rm5cIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIm1ldGVyVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBtZXRlckl0ZW0sIGluZGV4OiBpbmRleCwgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sIGNsYXNzOiAncC1tZXRlcmdyb3VwLW1ldGVyJywgc2l6ZTogcGVyY2VudFZhbHVlKG1ldGVySXRlbS52YWx1ZSksIHRvdGFsUGVyY2VudDogdG90YWxQZXJjZW50KCkgfVwiPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFtZXRlclRlbXBsYXRlICYmIG1ldGVySXRlbS52YWx1ZSA+IDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZXRlcmdyb3VwLW1ldGVyXCIgW25nU3R5bGVdPVwibWV0ZXJTdHlsZShtZXRlckl0ZW0pXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVuZFRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogdmFsdWUsIHRvdGFsUGVyY2VudDogdG90YWxQZXJjZW50KCksIHBlcmNlbnRhZ2VzOiBwZXJjZW50YWdlcygpIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIEBpZiAobGFiZWxQb3NpdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICAgICAgICA8cC1tZXRlckdyb3VwTGFiZWwgKm5nSWY9XCIhbGFiZWxUZW1wbGF0ZVwiIFt2YWx1ZV09XCJ2YWx1ZVwiIFtsYWJlbFBvc2l0aW9uXT1cImxhYmVsUG9zaXRpb25cIiBbbGFiZWxPcmllbnRhdGlvbl09XCJsYWJlbE9yaWVudGF0aW9uXCIgW21pbl09XCJtaW5cIiBbbWF4XT1cIm1heFwiIFtpY29uVGVtcGxhdGVdPVwiaWNvblRlbXBsYXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwibGFiZWxUZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IHZhbHVlLCB0b3RhbFBlcmNlbnQ6IHRvdGFsUGVyY2VudCgpLCBwZXJjZW50YWdlczogcGVyY2VudGFnZXMoKSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBNZXRlckdyb3VwIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgLyoqXG4gICAgICogQ3VycmVudCB2YWx1ZSBvZiB0aGUgbWV0ZXJncm91cC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSB2YWx1ZTogTWV0ZXJJdGVtW10gfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogTWluaW51bSBib3VuZGFyeSB2YWx1ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBtaW46IG51bWJlciA9IDA7XG4gICAgLyoqXG4gICAgICogTWF4aW11bSBib3VuZGFyeSB2YWx1ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBtYXg6IG51bWJlciA9IDEwMDtcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGxheW91dCBvZiB0aGUgY29tcG9uZW50LCB2YWxpZCB2YWx1ZXMgYXJlICdob3Jpem9udGFsJyBhbmQgJ3ZlcnRpY2FsJy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcbiAgICAvKipcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGxhYmVsIHBvc2l0aW9uIG9mIHRoZSBjb21wb25lbnQsIHZhbGlkIHZhbHVlcyBhcmUgJ3N0YXJ0JyBhbmQgJ2VuZCcuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbGFiZWxQb3NpdGlvbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ2VuZCc7XG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSBsYWJlbCBvcmllbnRhdGlvbiBvZiB0aGUgY29tcG9uZW50LCB2YWxpZCB2YWx1ZXMgYXJlICdob3Jpem9udGFsJyBhbmQgJ3ZlcnRpY2FsJy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBsYWJlbE9yaWVudGF0aW9uOiBzdHJpbmcgPSAnaG9yaXpvbnRhbCc7XG4gICAgLyoqXG4gICAgICogSW5saW5lIHN0eWxlIG9mIHRoZSBlbGVtZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIG9mIHRoZSBlbGVtZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4gfCB1bmRlZmluZWQ7XG5cbiAgICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGdldCBjb250YWluZXJDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLW1ldGVyZ3JvdXAgcC1jb21wb25lbnQnOiB0cnVlLFxuICAgICAgICAgICAgJ3AtbWV0ZXJncm91cC1ob3Jpem9udGFsJzogdGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnLFxuICAgICAgICAgICAgJ3AtbWV0ZXJncm91cC12ZXJ0aWNhbCc6IHRoaXMub3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgbWV0ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIGVuZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgc3RhcnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIGljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIGNvbnN0IF9jb250YWluZXIgPSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KF9jb250YWluZXIpO1xuICAgICAgICB0aGlzLnZlcnRpY2FsICYmIChfY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCcpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdsYWJlbCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFiZWxUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21ldGVyJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBlcmNlbnQobWV0ZXIgPSAwKSB7XG4gICAgICAgIGNvbnN0IHBlcmNlbnRPZkl0ZW0gPSAoKG1ldGVyIC0gdGhpcy5taW4pIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pKSAqIDEwMDtcblxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHBlcmNlbnRPZkl0ZW0pKSk7XG4gICAgfVxuXG4gICAgcGVyY2VudFZhbHVlKG1ldGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBlcmNlbnQobWV0ZXIpICsgJyUnO1xuICAgIH1cblxuICAgIG1ldGVyU3R5bGUodmFsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHZhbC5jb2xvcixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcgJiYgdGhpcy5wZXJjZW50VmFsdWUodmFsLnZhbHVlKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyAmJiB0aGlzLnBlcmNlbnRWYWx1ZSh2YWwudmFsdWUpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdG90YWxQZXJjZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZXJjZW50KHRoaXMudmFsdWUucmVkdWNlKCh0b3RhbCwgdmFsKSA9PiB0b3RhbCArIHZhbC52YWx1ZSwgMCkpO1xuICAgIH1cblxuICAgIHBlcmNlbnRhZ2VzKCkge1xuICAgICAgICBsZXQgc3VtID0gMDtcbiAgICAgICAgY29uc3Qgc3Vtc0FycmF5ID0gW107XG5cbiAgICAgICAgdGhpcy52YWx1ZS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzdW0gKz0gaXRlbS52YWx1ZTtcbiAgICAgICAgICAgIHN1bXNBcnJheS5wdXNoKHN1bSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzdW1zQXJyYXk7XG4gICAgfVxuXG4gICAgdHJhY2tCeUZuKGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZXhwb3J0czogW01ldGVyR3JvdXAsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbTWV0ZXJHcm91cCwgTWV0ZXJHcm91cExhYmVsXVxufSlcbmV4cG9ydCBjbGFzcyBNZXRlckdyb3VwTW9kdWxlIHt9XG4iXX0=