import { DomHandler } from 'primeng/dom';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { inject, PLATFORM_ID, ElementRef, booleanAttribute, Directive, Input, NgModule } from '@angular/core';

/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
class FocusTrap {
    /**
     * When set as true, focus wouldn't be managed.
     * @group Props
     */
    pFocusTrapDisabled = false;
    platformId = inject(PLATFORM_ID);
    host = inject(ElementRef);
    document = inject(DOCUMENT);
    firstHiddenFocusableElement;
    lastHiddenFocusableElement;
    ngOnInit() {
        if (isPlatformBrowser(this.platformId) && !this.pFocusTrapDisabled) {
            !this.firstHiddenFocusableElement && !this.lastHiddenFocusableElement && this.createHiddenFocusableElements();
        }
    }
    ngOnChanges(changes) {
        if (changes.pFocusTrapDisabled && isPlatformBrowser(this.platformId)) {
            if (changes.pFocusTrapDisabled.currentValue) {
                this.removeHiddenFocusableElements();
            }
            else {
                this.createHiddenFocusableElements();
            }
        }
    }
    removeHiddenFocusableElements() {
        if (this.firstHiddenFocusableElement && this.firstHiddenFocusableElement.parentNode) {
            this.firstHiddenFocusableElement.parentNode.removeChild(this.firstHiddenFocusableElement);
        }
        if (this.lastHiddenFocusableElement && this.lastHiddenFocusableElement.parentNode) {
            this.lastHiddenFocusableElement.parentNode.removeChild(this.lastHiddenFocusableElement);
        }
    }
    getComputedSelector(selector) {
        return `:not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])${selector ?? ''}`;
    }
    createHiddenFocusableElements() {
        const tabindex = '0';
        const createFocusableElement = (onFocus) => {
            return DomHandler.createElement('span', {
                class: 'p-hidden-accessible p-hidden-focusable',
                tabindex,
                role: 'presentation',
                'data-p-hidden-accessible': true,
                'data-p-hidden-focusable': true,
                onFocus: onFocus?.bind(this)
            });
        };
        this.firstHiddenFocusableElement = createFocusableElement(this.onFirstHiddenElementFocus);
        this.lastHiddenFocusableElement = createFocusableElement(this.onLastHiddenElementFocus);
        this.firstHiddenFocusableElement.setAttribute('data-pc-section', 'firstfocusableelement');
        this.lastHiddenFocusableElement.setAttribute('data-pc-section', 'lastfocusableelement');
        this.host.nativeElement.prepend(this.firstHiddenFocusableElement);
        this.host.nativeElement.append(this.lastHiddenFocusableElement);
    }
    onFirstHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const focusableElement = relatedTarget === this.lastHiddenFocusableElement || !this.host.nativeElement?.contains(relatedTarget) ? DomHandler.getFirstFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : this.lastHiddenFocusableElement;
        DomHandler.focus(focusableElement);
    }
    onLastHiddenElementFocus(event) {
        const { currentTarget, relatedTarget } = event;
        const focusableElement = relatedTarget === this.firstHiddenFocusableElement || !this.host.nativeElement?.contains(relatedTarget) ? DomHandler.getLastFocusableElement(currentTarget.parentElement, ':not(.p-hidden-focusable)') : this.firstHiddenFocusableElement;
        DomHandler.focus(focusableElement);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: FocusTrap, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.1", type: FocusTrap, selector: "[pFocusTrap]", inputs: { pFocusTrapDisabled: ["pFocusTrapDisabled", "pFocusTrapDisabled", booleanAttribute] }, host: { classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: FocusTrap, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pFocusTrap]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], propDecorators: { pFocusTrapDisabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
class FocusTrapModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: FocusTrapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: FocusTrapModule, declarations: [FocusTrap], imports: [CommonModule], exports: [FocusTrap] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: FocusTrapModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: FocusTrapModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [FocusTrap],
                    declarations: [FocusTrap]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { FocusTrap, FocusTrapModule };
//# sourceMappingURL=primeng-focustrap.mjs.map
