import { DomHandler } from 'primeng/dom';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Input, NgModule, inject, booleanAttribute, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Focus Trap keeps focus within a certain DOM element while tabbing.
 * @group Components
 */
export class FocusTrap {
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
export class FocusTrapModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2ZvY3VzdHJhcC9mb2N1c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsRUFBaUIsTUFBTSxlQUFlLENBQUM7O0FBRTdIOzs7R0FHRztBQU9ILE1BQU0sT0FBTyxTQUFTO0lBQ2xCOzs7T0FHRztJQUNxQyxrQkFBa0IsR0FBWSxLQUFLLENBQUM7SUFFNUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVqQyxJQUFJLEdBQWUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXRDLFFBQVEsR0FBYSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFdEMsMkJBQTJCLENBQWU7SUFFMUMsMEJBQTBCLENBQWU7SUFFekMsUUFBUTtRQUNKLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDakUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLElBQUksSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7UUFDbEgsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDOUIsSUFBSSxPQUFPLENBQUMsa0JBQWtCLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbkUsSUFBSSxPQUFPLENBQUMsa0JB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Q0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDO1FBRTlPLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN2QyxDQUFDO3VHQXBGUSxTQUFTOzJGQUFULFNBQVMsdUdBS0UsZ0JBQWdCOzsyRkFMM0IsU0FBUztrQkFOckIsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsSUFBSSxFQUFFO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjtpQkFDSjs4QkFNMkMsa0JBQWtCO3NCQUF6RCxLQUFLO3VCQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFOztBQXVGMUMsTUFBTSxPQUFPLGVBQWU7dUdBQWYsZUFBZTt3R0FBZixlQUFlLGlCQTVGZixTQUFTLGFBd0ZSLFlBQVksYUF4RmIsU0FBUzt3R0E0RlQsZUFBZSxZQUpkLFlBQVk7OzJGQUliLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ3BCLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlLCBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdNb2R1bGUsIGluamVjdCwgYm9vbGVhbkF0dHJpYnV0ZSwgUExBVEZPUk1fSUQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBGb2N1cyBUcmFwIGtlZXBzIGZvY3VzIHdpdGhpbiBhIGNlcnRhaW4gRE9NIGVsZW1lbnQgd2hpbGUgdGFiYmluZy5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW3BGb2N1c1RyYXBdJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRm9jdXNUcmFwIHtcbiAgICAvKipcbiAgICAgKiBXaGVuIHNldCBhcyB0cnVlLCBmb2N1cyB3b3VsZG4ndCBiZSBtYW5hZ2VkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBwRm9jdXNUcmFwRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHBsYXRmb3JtSWQgPSBpbmplY3QoUExBVEZPUk1fSUQpO1xuXG4gICAgaG9zdDogRWxlbWVudFJlZiA9IGluamVjdChFbGVtZW50UmVmKTtcblxuICAgIGRvY3VtZW50OiBEb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cbiAgICBmaXJzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQhOiBIVE1MRWxlbWVudDtcblxuICAgIGxhc3RIaWRkZW5Gb2N1c2FibGVFbGVtZW50ITogSFRNTEVsZW1lbnQ7XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiYgIXRoaXMucEZvY3VzVHJhcERpc2FibGVkKSB7XG4gICAgICAgICAgICAhdGhpcy5maXJzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQgJiYgIXRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQgJiYgdGhpcy5jcmVhdGVIaWRkZW5Gb2N1c2FibGVFbGVtZW50cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoY2hhbmdlcy5wRm9jdXNUcmFwRGlzYWJsZWQgJiYgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgICAgaWYgKGNoYW5nZXMucEZvY3VzVHJhcERpc2FibGVkLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlSGlkZGVuRm9jdXNhYmxlRWxlbWVudHMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVIaWRkZW5Gb2N1c2FibGVFbGVtZW50cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlSGlkZGVuRm9jdXNhYmxlRWxlbWVudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudCAmJiB0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RIaWRkZW5Gb2N1c2FibGVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmxhc3RIaWRkZW5Gb2N1c2FibGVFbGVtZW50ICYmIHRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdGhpcy5sYXN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvbXB1dGVkU2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGA6bm90KC5wLWhpZGRlbi1mb2N1c2FibGUpOm5vdChbZGF0YS1wLWhpZGRlbi1mb2N1c2FibGU9XCJ0cnVlXCJdKSR7c2VsZWN0b3IgPz8gJyd9YDtcbiAgICB9XG5cbiAgICBjcmVhdGVIaWRkZW5Gb2N1c2FibGVFbGVtZW50cygpIHtcbiAgICAgICAgY29uc3QgdGFiaW5kZXggPSAnMCc7XG5cbiAgICAgICAgY29uc3QgY3JlYXRlRm9jdXNhYmxlRWxlbWVudCA9IChvbkZvY3VzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5jcmVhdGVFbGVtZW50KCdzcGFuJywge1xuICAgICAgICAgICAgICAgIGNsYXNzOiAncC1oaWRkZW4tYWNjZXNzaWJsZSBwLWhpZGRlbi1mb2N1c2FibGUnLFxuICAgICAgICAgICAgICAgIHRhYmluZGV4LFxuICAgICAgICAgICAgICAgIHJvbGU6ICdwcmVzZW50YXRpb24nLFxuICAgICAgICAgICAgICAgICdkYXRhLXAtaGlkZGVuLWFjY2Vzc2libGUnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkYXRhLXAtaGlkZGVuLWZvY3VzYWJsZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgb25Gb2N1czogb25Gb2N1cz8uYmluZCh0aGlzKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5maXJzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQgPSBjcmVhdGVGb2N1c2FibGVFbGVtZW50KHRoaXMub25GaXJzdEhpZGRlbkVsZW1lbnRGb2N1cyk7XG4gICAgICAgIHRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQgPSBjcmVhdGVGb2N1c2FibGVFbGVtZW50KHRoaXMub25MYXN0SGlkZGVuRWxlbWVudEZvY3VzKTtcblxuICAgICAgICB0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGMtc2VjdGlvbicsICdmaXJzdGZvY3VzYWJsZWVsZW1lbnQnKTtcbiAgICAgICAgdGhpcy5sYXN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGMtc2VjdGlvbicsICdsYXN0Zm9jdXNhYmxlZWxlbWVudCcpO1xuXG4gICAgICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LnByZXBlbmQodGhpcy5maXJzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmhvc3QubmF0aXZlRWxlbWVudC5hcHBlbmQodGhpcy5sYXN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgb25GaXJzdEhpZGRlbkVsZW1lbnRGb2N1cyhldmVudCkge1xuICAgICAgICBjb25zdCB7IGN1cnJlbnRUYXJnZXQsIHJlbGF0ZWRUYXJnZXQgfSA9IGV2ZW50O1xuICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQgPT09IHRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQgfHwgIXRoaXMuaG9zdC5uYXRpdmVFbGVtZW50Py5jb250YWlucyhyZWxhdGVkVGFyZ2V0KSA/IERvbUhhbmRsZXIuZ2V0Rmlyc3RGb2N1c2FibGVFbGVtZW50KGN1cnJlbnRUYXJnZXQucGFyZW50RWxlbWVudCwgJzpub3QoLnAtaGlkZGVuLWZvY3VzYWJsZSknKSA6IHRoaXMubGFzdEhpZGRlbkZvY3VzYWJsZUVsZW1lbnQ7XG5cbiAgICAgICAgRG9tSGFuZGxlci5mb2N1cyhmb2N1c2FibGVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBvbkxhc3RIaWRkZW5FbGVtZW50Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VGFyZ2V0LCByZWxhdGVkVGFyZ2V0IH0gPSBldmVudDtcbiAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudCA9XG4gICAgICAgICAgICByZWxhdGVkVGFyZ2V0ID09PSB0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudCB8fCAhdGhpcy5ob3N0Lm5hdGl2ZUVsZW1lbnQ/LmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQpID8gRG9tSGFuZGxlci5nZXRMYXN0Rm9jdXNhYmxlRWxlbWVudChjdXJyZW50VGFyZ2V0LnBhcmVudEVsZW1lbnQsICc6bm90KC5wLWhpZGRlbi1mb2N1c2FibGUpJykgOiB0aGlzLmZpcnN0SGlkZGVuRm9jdXNhYmxlRWxlbWVudDtcblxuICAgICAgICBEb21IYW5kbGVyLmZvY3VzKGZvY3VzYWJsZUVsZW1lbnQpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRm9jdXNUcmFwXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtGb2N1c1RyYXBdXG59KVxuZXhwb3J0IGNsYXNzIEZvY3VzVHJhcE1vZHVsZSB7fVxuIl19