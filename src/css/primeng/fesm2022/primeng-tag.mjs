import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ContentChildren, NgModule } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';

/**
 * Tag component is used to categorize content.
 * @group Components
 */
class Tag {
    cd;
    /**
     * Inline style of the component.
     * @group Props
     */
    get style() {
        return this._style;
    }
    set style(value) {
        this._style = value;
        this.cd.markForCheck();
    }
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass;
    /**
     * Severity type of the tag.
     * @group Props
     */
    severity;
    /**
     * Value to display inside the tag.
     * @group Props
     */
    value;
    /**
     * Icon of the tag to display next to the value.
     * @group Props
     */
    icon;
    /**
     * Whether the corners of the tag are rounded.
     * @group Props
     */
    rounded;
    templates;
    iconTemplate;
    _style;
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'icon':
                    this.iconTemplate = item.template;
                    break;
            }
        });
    }
    constructor(cd) {
        this.cd = cd;
    }
    containerClass() {
        return {
            'p-tag p-component': true,
            [`p-tag-${this.severity}`]: this.severity,
            'p-tag-rounded': this.rounded
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Tag, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Tag, selector: "p-tag", inputs: { style: "style", styleClass: "styleClass", severity: "severity", value: "value", icon: "icon", rounded: ["rounded", "rounded", booleanAttribute] }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-content></ng-content>
            <ng-container *ngIf="!iconTemplate">
                <span class="p-tag-icon" [ngClass]="icon" *ngIf="icon"></span>
            </ng-container>
            <span class="p-tag-icon" *ngIf="iconTemplate">
                <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
            </span>
            <span class="p-tag-value">{{ value }}</span>
        </span>
    `, isInline: true, styles: ["@layer primeng{.p-tag{display:inline-flex;align-items:center;justify-content:center}.p-tag-icon,.p-tag-value,.p-tag-icon.pi{line-height:1.5}.p-tag.p-tag-rounded{border-radius:10rem}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Tag, decorators: [{
            type: Component,
            args: [{ selector: 'p-tag', template: `
        <span [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">
            <ng-content></ng-content>
            <ng-container *ngIf="!iconTemplate">
                <span class="p-tag-icon" [ngClass]="icon" *ngIf="icon"></span>
            </ng-container>
            <span class="p-tag-icon" *ngIf="iconTemplate">
                <ng-template *ngTemplateOutlet="iconTemplate"></ng-template>
            </span>
            <span class="p-tag-value">{{ value }}</span>
        </span>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-tag{display:inline-flex;align-items:center;justify-content:center}.p-tag-icon,.p-tag-value,.p-tag-icon.pi{line-height:1.5}.p-tag.p-tag-rounded{border-radius:10rem}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], icon: [{
                type: Input
            }], rounded: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
class TagModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TagModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: TagModule, declarations: [Tag], imports: [CommonModule, SharedModule], exports: [Tag, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TagModule, imports: [CommonModule, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: TagModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Tag, SharedModule],
                    declarations: [Tag]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Tag, TagModule };
//# sourceMappingURL=primeng-tag.mjs.map
