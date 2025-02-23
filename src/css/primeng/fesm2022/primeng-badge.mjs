import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, Inject, Input, booleanAttribute, Component, ChangeDetectionStrategy, ViewEncapsulation, NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { UniqueComponentId } from 'primeng/utils';

/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
class BadgeDirective {
    document;
    el;
    renderer;
    /**
     * When specified, disables the component.
     * @group Props
     */
    disabled;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value) {
        this._size = value;
        console.warn('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value;
    /**
     * Inline style of the element.
     * @group Props
     */
    badgeStyle;
    /**
     * Class of the element.
     * @group Props
     */
    badgeStyleClass;
    id;
    badgeEl;
    get activeElement() {
        return this.el.nativeElement.nodeName.indexOf('-') != -1 ? this.el.nativeElement.firstChild : this.el.nativeElement;
    }
    get canUpdateBadge() {
        return this.id && !this.disabled;
    }
    constructor(document, el, renderer) {
        this.document = document;
        this.el = el;
        this.renderer = renderer;
    }
    ngOnChanges({ value, size, severity, disabled, badgeStyle, badgeStyleClass }) {
        if (disabled) {
            this.toggleDisableState();
        }
        if (!this.canUpdateBadge) {
            return;
        }
        if (severity) {
            this.setSeverity(severity.previousValue);
        }
        if (size) {
            this.setSizeClasses();
        }
        if (value) {
            this.setValue();
        }
        if (badgeStyle || badgeStyleClass) {
            this.applyStyles();
        }
    }
    ngAfterViewInit() {
        this.id = UniqueComponentId() + '_badge';
        this.renderBadgeContent();
    }
    setValue(element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.value != null) {
            if (DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.removeClass(badge, 'p-badge-dot');
            }
            if (this.value && String(this.value).length === 1) {
                DomHandler.addClass(badge, 'p-badge-no-gutter');
            }
            else {
                DomHandler.removeClass(badge, 'p-badge-no-gutter');
            }
        }
        else {
            if (!DomHandler.hasClass(badge, 'p-badge-dot')) {
                DomHandler.addClass(badge, 'p-badge-dot');
            }
            DomHandler.removeClass(badge, 'p-badge-no-gutter');
        }
        badge.innerHTML = '';
        const badgeValue = this.value != null ? String(this.value) : '';
        this.renderer.appendChild(badge, this.document.createTextNode(badgeValue));
    }
    setSizeClasses(element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.badgeSize) {
            if (this.badgeSize === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }
            if (this.badgeSize === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        }
        else if (this.size && !this.badgeSize) {
            if (this.size === 'large') {
                DomHandler.addClass(badge, 'p-badge-lg');
                DomHandler.removeClass(badge, 'p-badge-xl');
            }
            if (this.size === 'xlarge') {
                DomHandler.addClass(badge, 'p-badge-xl');
                DomHandler.removeClass(badge, 'p-badge-lg');
            }
        }
        else {
            DomHandler.removeClass(badge, 'p-badge-lg');
            DomHandler.removeClass(badge, 'p-badge-xl');
        }
    }
    renderBadgeContent() {
        if (this.disabled) {
            return null;
        }
        const el = this.activeElement;
        const badge = this.document.createElement('span');
        badge.id = this.id;
        badge.className = 'p-badge p-component';
        this.setSeverity(null, badge);
        this.setSizeClasses(badge);
        this.setValue(badge);
        DomHandler.addClass(el, 'p-overlay-badge');
        this.renderer.appendChild(el, badge);
        this.badgeEl = badge;
        this.applyStyles();
    }
    applyStyles() {
        if (this.badgeEl && this.badgeStyle && typeof this.badgeStyle === 'object') {
            for (const [key, value] of Object.entries(this.badgeStyle)) {
                this.renderer.setStyle(this.badgeEl, key, value);
            }
        }
        if (this.badgeEl && this.badgeStyleClass) {
            this.badgeEl.classList.add(...this.badgeStyleClass.split(' '));
        }
    }
    setSeverity(oldSeverity, element) {
        const badge = element ?? this.document.getElementById(this.id);
        if (!badge) {
            return;
        }
        if (this.severity) {
            DomHandler.addClass(badge, `p-badge-${this.severity}`);
        }
        if (oldSeverity) {
            DomHandler.removeClass(badge, `p-badge-${oldSeverity}`);
        }
    }
    toggleDisableState() {
        if (!this.id) {
            return;
        }
        if (this.disabled) {
            const badge = this.activeElement?.querySelector(`#${this.id}`);
            if (badge) {
                this.renderer.removeChild(this.activeElement, badge);
            }
        }
        else {
            this.renderBadgeContent();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeDirective, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.1", type: BadgeDirective, selector: "[pBadge]", inputs: { disabled: ["badgeDisabled", "disabled"], badgeSize: "badgeSize", size: "size", severity: "severity", value: "value", badgeStyle: "badgeStyle", badgeStyleClass: "badgeStyleClass" }, host: { classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pBadge]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { disabled: [{
                type: Input,
                args: ['badgeDisabled']
            }], badgeSize: [{
                type: Input
            }], size: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], badgeStyle: [{
                type: Input
            }], badgeStyleClass: [{
                type: Input
            }] } });
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
class Badge {
    /**
     * Class of the element.
     * @group Props
     */
    styleClass;
    /**
     * Inline style of the element.
     * @group Props
     */
    style;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value;
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled = false;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value) {
        this._size = value;
        console.warn('size property is deprecated and will removed in v18, use badgeSize instead.');
    }
    get size() {
        return this._size;
    }
    _size;
    containerClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.value != undefined && String(this.value).length === 1,
            'p-badge-lg': this.badgeSize === 'large' || this.size === 'large',
            'p-badge-xl': this.badgeSize === 'xlarge' || this.size === 'xlarge',
            [`p-badge-${this.severity}`]: this.severity
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Badge, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Badge, selector: "p-badge", inputs: { styleClass: "styleClass", style: "style", badgeSize: "badgeSize", severity: "severity", value: "value", badgeDisabled: ["badgeDisabled", "badgeDisabled", booleanAttribute], size: "size" }, host: { classAttribute: "p-element" }, ngImport: i0, template: ` <span *ngIf="!badgeDisabled" [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">{{ value }}</span> `, isInline: true, styles: ["@layer primeng{.p-badge{display:inline-block;border-radius:10px;text-align:center;padding:0 .5rem}.p-overlay-badge{position:relative}.p-overlay-badge .p-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;margin:0}.p-badge-dot{width:.5rem;min-width:.5rem;height:.5rem;border-radius:50%;padding:0}.p-badge-no-gutter{padding:0;border-radius:50%}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Badge, decorators: [{
            type: Component,
            args: [{ selector: 'p-badge', template: ` <span *ngIf="!badgeDisabled" [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style">{{ value }}</span> `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-badge{display:inline-block;border-radius:10px;text-align:center;padding:0 .5rem}.p-overlay-badge{position:relative}.p-overlay-badge .p-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;margin:0}.p-badge-dot{width:.5rem;min-width:.5rem;height:.5rem;border-radius:50%;padding:0}.p-badge-no-gutter{padding:0;border-radius:50%}}\n"] }]
        }], propDecorators: { styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], badgeSize: [{
                type: Input
            }], severity: [{
                type: Input
            }], value: [{
                type: Input
            }], badgeDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], size: [{
                type: Input
            }] } });
class BadgeModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, declarations: [Badge, BadgeDirective], imports: [CommonModule], exports: [Badge, BadgeDirective, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, imports: [CommonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: BadgeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Badge, BadgeDirective, SharedModule],
                    declarations: [Badge, BadgeDirective]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Badge, BadgeDirective, BadgeModule };
//# sourceMappingURL=primeng-badge.mjs.map
