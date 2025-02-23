import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

/**
 * Divider is used to separate contents.
 * @group Components
 */
class Divider {
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
     * Specifies the orientation.
     * @group Props
     */
    layout = 'horizontal';
    /**
     * Border style type.
     * @group Props
     */
    type = 'solid';
    /**
     * Alignment of the content.
     * @group Props
     */
    align;
    containerClass() {
        return {
            'p-divider p-component': true,
            'p-divider-horizontal': this.layout === 'horizontal',
            'p-divider-vertical': this.layout === 'vertical',
            'p-divider-solid': this.type === 'solid',
            'p-divider-dashed': this.type === 'dashed',
            'p-divider-dotted': this.type === 'dotted',
            'p-divider-left': this.layout === 'horizontal' && (!this.align || this.align === 'left'),
            'p-divider-center': (this.layout === 'horizontal' && this.align === 'center') || (this.layout === 'vertical' && (!this.align || this.align === 'center')),
            'p-divider-right': this.layout === 'horizontal' && this.align === 'right',
            'p-divider-top': this.layout === 'vertical' && this.align === 'top',
            'p-divider-bottom': this.layout === 'vertical' && this.align === 'bottom'
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Divider, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: Divider, selector: "p-divider", inputs: { style: "style", styleClass: "styleClass", layout: "layout", type: "type", align: "align" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" role="separator" [attr.aria-orientation]="layout" [attr.data-pc-name]="'divider'">
            <div class="p-divider-content">
                <ng-content></ng-content>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-divider-horizontal{display:flex;width:100%;position:relative;align-items:center}.p-divider-horizontal:before{position:absolute;display:block;top:50%;left:0;width:100%;content:\"\"}.p-divider-horizontal.p-divider-left{justify-content:flex-start}.p-divider-horizontal.p-divider-right{justify-content:flex-end}.p-divider-horizontal.p-divider-center{justify-content:center}.p-divider-content{z-index:1}.p-divider-vertical{min-height:100%;margin:0 1rem;display:flex;position:relative;justify-content:center}.p-divider-vertical:before{position:absolute;display:block;top:0;left:50%;height:100%;content:\"\"}.p-divider-vertical.p-divider-top{align-items:flex-start}.p-divider-vertical.p-divider-center{align-items:center}.p-divider-vertical.p-divider-bottom{align-items:flex-end}.p-divider-solid.p-divider-horizontal:before{border-top-style:solid}.p-divider-solid.p-divider-vertical:before{border-left-style:solid}.p-divider-dashed.p-divider-horizontal:before{border-top-style:dashed}.p-divider-dashed.p-divider-vertical:before{border-left-style:dashed}.p-divider-dotted.p-divider-horizontal:before{border-top-style:dotted}.p-divider-dotted.p-divider-vertical:before{border-left-style:dotted}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Divider, decorators: [{
            type: Component,
            args: [{ selector: 'p-divider', template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" role="separator" [attr.aria-orientation]="layout" [attr.data-pc-name]="'divider'">
            <div class="p-divider-content">
                <ng-content></ng-content>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-divider-horizontal{display:flex;width:100%;position:relative;align-items:center}.p-divider-horizontal:before{position:absolute;display:block;top:50%;left:0;width:100%;content:\"\"}.p-divider-horizontal.p-divider-left{justify-content:flex-start}.p-divider-horizontal.p-divider-right{justify-content:flex-end}.p-divider-horizontal.p-divider-center{justify-content:center}.p-divider-content{z-index:1}.p-divider-vertical{min-height:100%;margin:0 1rem;display:flex;position:relative;justify-content:center}.p-divider-vertical:before{position:absolute;display:block;top:0;left:50%;height:100%;content:\"\"}.p-divider-vertical.p-divider-top{align-items:flex-start}.p-divider-vertical.p-divider-center{align-items:center}.p-divider-vertical.p-divider-bottom{align-items:flex-end}.p-divider-solid.p-divider-horizontal:before{border-top-style:solid}.p-divider-solid.p-divider-vertical:before{border-left-style:solid}.p-divider-dashed.p-divider-horizontal:before{border-top-style:dashed}.p-divider-dashed.p-divider-vertical:before{border-left-style:dashed}.p-divider-dotted.p-divider-horizontal:before{border-top-style:dotted}.p-divider-dotted.p-divider-vertical:before{border-left-style:dotted}}\n"] }]
        }], propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], layout: [{
                type: Input
            }], type: [{
                type: Input
            }], align: [{
                type: Input
            }] } });
class DividerModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DividerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: DividerModule, declarations: [Divider], imports: [CommonModule], exports: [Divider] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DividerModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: DividerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Divider],
                    declarations: [Divider]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Divider, DividerModule };
//# sourceMappingURL=primeng-divider.mjs.map
