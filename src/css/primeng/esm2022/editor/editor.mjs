import { CommonModule, isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, PLATFORM_ID, ViewEncapsulation, afterNextRender, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Header, PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const EDITOR_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Editor),
    multi: true
};
/**
 * Editor groups a collection of contents in tabs.
 * @group Components
 */
export class Editor {
    el;
    platformId;
    /**
     * Inline style of the container.
     * @group Props
     */
    style;
    /**
     * Style class of the container.
     * @group Props
     */
    styleClass;
    /**
     * Placeholder text to show when editor is empty.
     * @group Props
     */
    placeholder;
    /**
     * Whitelist of formats to display, see here for available options.
     * @group Props
     */
    formats;
    /**
     * Modules configuration of Editor, see here for available options.
     * @group Props
     */
    modules;
    /**
     * DOM Element or a CSS selector for a DOM Element, within which the editor’s p elements (i.e. tooltips, etc.) should be confined. Currently, it only considers left and right boundaries.
     * @group Props
     */
    bounds;
    /**
     * DOM Element or a CSS selector for a DOM Element, specifying which container has the scrollbars (i.e. overflow-y: auto), if is has been changed from the default ql-editor with custom CSS. Necessary to fix scroll jumping bugs when Quill is set to auto grow its height, and another ancestor container is responsible from the scrolling..
     * @group Props
     */
    scrollingContainer;
    /**
     * Shortcut for debug. Note debug is a static method and will affect other instances of Quill editors on the page. Only warning and error messages are enabled by default.
     * @group Props
     */
    debug;
    /**
     * Whether to instantiate the editor to read-only mode.
     * @group Props
     */
    get readonly() {
        return this._readonly;
    }
    set readonly(val) {
        this._readonly = val;
        if (this.quill) {
            if (this._readonly)
                this.quill.disable();
            else
                this.quill.enable();
        }
    }
    /**
     * Callback to invoke when the quill modules are loaded.
     * @param {EditorInitEvent} event - custom event.
     * @group Emits
     */
    onInit = new EventEmitter();
    /**
     * Callback to invoke when text of editor changes.
     * @param {EditorTextChangeEvent} event - custom event.
     * @group Emits
     */
    onTextChange = new EventEmitter();
    /**
     * Callback to invoke when selection of the text changes.
     * @param {EditorSelectionChangeEvent} event - custom event.
     * @group Emits
     */
    onSelectionChange = new EventEmitter();
    templates;
    toolbar;
    value;
    _readonly = false;
    onModelChange = () => { };
    onModelTouched = () => { };
    quill;
    dynamicQuill;
    headerTemplate;
    quillElements;
    constructor(el, platformId) {
        this.el = el;
        this.platformId = platformId;
        /**
         * Read or write the DOM once, when initializing non-Angular (Quill) library.
         */
        afterNextRender(() => {
            this.initQuillElements();
            this.initQuillEditor();
        });
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerTemplate = item.template;
                    break;
            }
        });
    }
    writeValue(value) {
        this.value = value;
        if (this.quill) {
            if (value) {
                this.quill.setContents(this.quill.clipboard.convert(this.dynamicQuill.version.startsWith('2') ? { html: this.value } : this.value));
            }
            else {
                this.quill.setText('');
            }
        }
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    getQuill() {
        return this.quill;
    }
    initQuillEditor() {
        if (isPlatformServer(this.platformId)) {
            return;
        }
        /**
         * Importing Quill at top level, throws `document is undefined` error during when
         * building for SSR, so this dynamically loads quill when it's in browser module.
         */
        if (!this.dynamicQuill) {
            import('quill')
                .then((quillModule) => {
                this.dynamicQuill = quillModule.default;
                this.createQuillEditor();
            })
                .catch((e) => console.error(e.message));
        }
        else {
            this.createQuillEditor();
        }
    }
    createQuillEditor() {
        this.initQuillElements();
        const { toolbarElement, editorElement } = this.quillElements;
        let defaultModule = { toolbar: toolbarElement };
        let modules = this.modules ? { ...defaultModule, ...this.modules } : defaultModule;
        this.quill = new this.dynamicQuill(editorElement, {
            modules: modules,
            placeholder: this.placeholder,
            readOnly: this.readonly,
            theme: 'snow',
            formats: this.formats,
            bounds: this.bounds,
            debug: this.debug,
            scrollingContainer: this.scrollingContainer
        });
        const isQuill2 = this.dynamicQuill.version.startsWith('2');
        if (this.value) {
            this.quill.setContents(this.quill.clipboard.convert(isQuill2 ? { html: this.value } : this.value));
        }
        this.quill.on('text-change', (delta, oldContents, source) => {
            if (source === 'user') {
                let html = isQuill2 ? this.quill.getSemanticHTML() : DomHandler.findSingle(editorElement, '.ql-editor').innerHTML;
                let text = this.quill.getText().trim();
                if (html === '<p><br></p>') {
                    html = null;
                }
                this.onTextChange.emit({
                    htmlValue: html,
                    textValue: text,
                    delta: delta,
                    source: source
                });
                this.onModelChange(html);
                this.onModelTouched();
            }
        });
        this.quill.on('selection-change', (range, oldRange, source) => {
            this.onSelectionChange.emit({
                range: range,
                oldRange: oldRange,
                source: source
            });
        });
        this.onInit.emit({
            editor: this.quill
        });
    }
    initQuillElements() {
        if (!this.quillElements) {
            this.quillElements = {
                editorElement: DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-content'),
                toolbarElement: DomHandler.findSingle(this.el.nativeElement, 'div.p-editor-toolbar')
            };
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Editor, deps: [{ token: i0.ElementRef }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: Editor, selector: "p-editor", inputs: { style: "style", styleClass: "styleClass", placeholder: "placeholder", formats: "formats", modules: "modules", bounds: "bounds", scrollingContainer: "scrollingContainer", debug: "debug", readonly: "readonly" }, outputs: { onInit: "onInit", onTextChange: "onTextChange", onSelectionChange: "onSelectionChange" }, host: { classAttribute: "p-element" }, providers: [EDITOR_VALUE_ACCESSOR], queries: [{ propertyName: "toolbar", first: true, predicate: Header, descendants: true }, { propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [ngClass]="'p-editor-container'" [class]="styleClass">
            <div class="p-editor-toolbar" *ngIf="toolbar || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div class="p-editor-toolbar" *ngIf="!modules && !toolbar && !headerTemplate">
                <span class="ql-formats">
                    <select class="ql-header">
                        <option value="1">Heading</option>
                        <option value="2">Subheading</option>
                        <option selected>Normal</option>
                    </select>
                    <select class="ql-font">
                        <option selected>Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-bold" aria-label="Bold" type="button"></button>
                    <button class="ql-italic" aria-label="Italic" type="button"></button>
                    <button class="ql-underline" aria-label="Underline" type="button"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                    <select class="ql-align">
                        <option selected></option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                        <option value="justify">justify</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-link" aria-label="Insert Link" type="button"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-clean" aria-label="Remove Styles" type="button"></button>
                </span>
            </div>
            <div class="p-editor-content" [ngStyle]="style"></div>
        </div>
    `, isInline: true, styles: [".p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item{width:auto;height:auto}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Editor, decorators: [{
            type: Component,
            args: [{ selector: 'p-editor', template: `
        <div [ngClass]="'p-editor-container'" [class]="styleClass">
            <div class="p-editor-toolbar" *ngIf="toolbar || headerTemplate">
                <ng-content select="p-header"></ng-content>
                <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
            </div>
            <div class="p-editor-toolbar" *ngIf="!modules && !toolbar && !headerTemplate">
                <span class="ql-formats">
                    <select class="ql-header">
                        <option value="1">Heading</option>
                        <option value="2">Subheading</option>
                        <option selected>Normal</option>
                    </select>
                    <select class="ql-font">
                        <option selected>Sans Serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-bold" aria-label="Bold" type="button"></button>
                    <button class="ql-italic" aria-label="Italic" type="button"></button>
                    <button class="ql-underline" aria-label="Underline" type="button"></button>
                </span>
                <span class="ql-formats">
                    <select class="ql-color"></select>
                    <select class="ql-background"></select>
                </span>
                <span class="ql-formats">
                    <button class="ql-list" value="ordered" aria-label="Ordered List" type="button"></button>
                    <button class="ql-list" value="bullet" aria-label="Unordered List" type="button"></button>
                    <select class="ql-align">
                        <option selected></option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                        <option value="justify">justify</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button class="ql-link" aria-label="Insert Link" type="button"></button>
                    <button class="ql-image" aria-label="Insert Image" type="button"></button>
                    <button class="ql-code-block" aria-label="Insert Code Block" type="button"></button>
                </span>
                <span class="ql-formats">
                    <button class="ql-clean" aria-label="Remove Styles" type="button"></button>
                </span>
            </div>
            <div class="p-editor-content" [ngStyle]="style"></div>
        </div>
    `, providers: [EDITOR_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item{width:auto;height:auto}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], formats: [{
                type: Input
            }], modules: [{
                type: Input
            }], bounds: [{
                type: Input
            }], scrollingContainer: [{
                type: Input
            }], debug: [{
                type: Input
            }], readonly: [{
                type: Input
            }], onInit: [{
                type: Output
            }], onTextChange: [{
                type: Output
            }], onSelectionChange: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], toolbar: [{
                type: ContentChild,
                args: [Header]
            }] } });
export class EditorModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: EditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: EditorModule, declarations: [Editor], imports: [CommonModule], exports: [Editor, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: EditorModule, imports: [CommonModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: EditorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Editor, SharedModule],
                    declarations: [Editor]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2VkaXRvci9lZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2pFLE9BQU8sRUFFSCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBRWYsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBR1gsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixVQUFVLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7QUFJekMsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDdEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNkLENBQUM7QUFDRjs7O0dBR0c7QUE2REgsTUFBTSxPQUFPLE1BQU07SUFnR0o7SUFDc0I7SUFoR2pDOzs7T0FHRztJQUNNLEtBQUssQ0FBOEM7SUFDNUQ7OztPQUdHO0lBQ00sVUFBVSxDQUFxQjtJQUN4Qzs7O09BR0c7SUFDTSxXQUFXLENBQXFCO0lBQ3pDOzs7T0FHRztJQUNNLE9BQU8sQ0FBdUI7SUFDdkM7OztPQUdHO0lBQ00sT0FBTyxDQUFxQjtJQUNyQzs7O09BR0c7SUFDTSxNQUFNLENBQW1DO0lBQ2xEOzs7T0FHRztJQUNNLGtCQUFrQixDQUFtQztJQUM5RDs7O09B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QTVEbEIsU0FBUzsrQkFDSSxVQUFVLFlBQ1Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FpRFQsYUFDVSxDQUFDLHFCQUFxQixDQUFDLG1CQUNqQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUVoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBQy9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQjs7MEJBbUdJLE1BQU07MkJBQUMsV0FBVzt5Q0E1RmQsS0FBSztzQkFBYixLQUFLO2dCQUtHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBS0csV0FBVztzQkFBbkIsS0FBSztnQkFLRyxPQUFPO3NCQUFmLEtBQUs7Z0JBS0csT0FBTztzQkFBZixLQUFLO2dCQUtHLE1BQU07c0JBQWQsS0FBSztnQkFLRyxrQkFBa0I7c0JBQTFCLEtBQUs7Z0JBS0csS0FBSztzQkFBYixLQUFLO2dCQUtPLFFBQVE7c0JBQXBCLEtBQUs7Z0JBZ0JJLE1BQU07c0JBQWYsTUFBTTtnQkFNRyxZQUFZO3NCQUFyQixNQUFNO2dCQU1HLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFeUIsU0FBUztzQkFBeEMsZUFBZTt1QkFBQyxhQUFhO2dCQUVSLE9BQU87c0JBQTVCLFlBQVk7dUJBQUMsTUFBTTs7QUE2SnhCLE1BQU0sT0FBTyxZQUFZO3VHQUFaLFlBQVk7d0dBQVosWUFBWSxpQkExT1osTUFBTSxhQXNPTCxZQUFZLGFBdE9iLE1BQU0sRUF1T0csWUFBWTt3R0FHckIsWUFBWSxZQUpYLFlBQVksRUFDSixZQUFZOzsyRkFHckIsWUFBWTtrQkFMeEIsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7b0JBQy9CLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUsIGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdCxcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBPdXRwdXQsXG4gICAgUExBVEZPUk1fSUQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFRlbXBsYXRlUmVmLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uLFxuICAgIGFmdGVyTmV4dFJlbmRlcixcbiAgICBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgSGVhZGVyLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgTnVsbGFibGUgfSBmcm9tICdwcmltZW5nL3RzLWhlbHBlcnMnO1xuaW1wb3J0IHsgRWRpdG9ySW5pdEV2ZW50LCBFZGl0b3JTZWxlY3Rpb25DaGFuZ2VFdmVudCwgRWRpdG9yVGV4dENoYW5nZUV2ZW50IH0gZnJvbSAnLi9lZGl0b3IuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNvbnN0IEVESVRPUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVkaXRvciksXG4gICAgbXVsdGk6IHRydWVcbn07XG4vKipcbiAqIEVkaXRvciBncm91cHMgYSBjb2xsZWN0aW9uIG9mIGNvbnRlbnRzIGluIHRhYnMuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZWRpdG9yJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cIidwLWVkaXRvci1jb250YWluZXInXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWVkaXRvci10b29sYmFyXCIgKm5nSWY9XCJ0b29sYmFyIHx8IGhlYWRlclRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwicC1oZWFkZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImhlYWRlclRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWVkaXRvci10b29sYmFyXCIgKm5nSWY9XCIhbW9kdWxlcyAmJiAhdG9vbGJhciAmJiAhaGVhZGVyVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cInFsLWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjFcIj5IZWFkaW5nPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMlwiPlN1YmhlYWRpbmc8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+Tm9ybWFsPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtZm9udFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBzZWxlY3RlZD5TYW5zIFNlcmlmPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic2VyaWZcIj5TZXJpZjwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1vbm9zcGFjZVwiPk1vbm9zcGFjZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1ib2xkXCIgYXJpYS1sYWJlbD1cIkJvbGRcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1pdGFsaWNcIiBhcmlhLWxhYmVsPVwiSXRhbGljXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtdW5kZXJsaW5lXCIgYXJpYS1sYWJlbD1cIlVuZGVybGluZVwiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxbC1mb3JtYXRzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJxbC1jb2xvclwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtYmFja2dyb3VuZFwiPjwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWxpc3RcIiB2YWx1ZT1cIm9yZGVyZWRcIiBhcmlhLWxhYmVsPVwiT3JkZXJlZCBMaXN0XCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicWwtbGlzdFwiIHZhbHVlPVwiYnVsbGV0XCIgYXJpYS1sYWJlbD1cIlVub3JkZXJlZCBMaXN0XCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwicWwtYWxpZ25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gc2VsZWN0ZWQ+PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY2VudGVyXCI+Y2VudGVyPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmlnaHRcIj5yaWdodDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImp1c3RpZnlcIj5qdXN0aWZ5PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWxpbmtcIiBhcmlhLWxhYmVsPVwiSW5zZXJ0IExpbmtcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1pbWFnZVwiIGFyaWEtbGFiZWw9XCJJbnNlcnQgSW1hZ2VcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxbC1jb2RlLWJsb2NrXCIgYXJpYS1sYWJlbD1cIkluc2VydCBDb2RlIEJsb2NrXCIgdHlwZT1cImJ1dHRvblwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFsLWZvcm1hdHNcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInFsLWNsZWFuXCIgYXJpYS1sYWJlbD1cIlJlbW92ZSBTdHlsZXNcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1lZGl0b3ItY29udGVudFwiIFtuZ1N0eWxlXT1cInN0eWxlXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbRURJVE9SX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBzdHlsZVVybHM6IFsnLi9lZGl0b3IuY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgRWRpdG9yIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAgIC8qKlxuICAgICAqIElubGluZSBzdHlsZSBvZiB0aGUgY29udGFpbmVyLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlOiB7IFtrbGFzczogc3RyaW5nXTogYW55IH0gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFN0eWxlIGNsYXNzIG9mIHRoZSBjb250YWluZXIuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFBsYWNlaG9sZGVyIHRleHQgdG8gc2hvdyB3aGVuIGVkaXRvciBpcyBlbXB0eS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoaXRlbGlzdCBvZiBmb3JtYXRzIHRvIGRpc3BsYXksIHNlZSBoZXJlIGZvciBhdmFpbGFibGUgb3B0aW9ucy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBmb3JtYXRzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBNb2R1bGVzIGNvbmZpZ3VyYXRpb24gb2YgRWRpdG9yLCBzZWUgaGVyZSBmb3IgYXZhaWxhYmxlIG9wdGlvbnMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgbW9kdWxlczogb2JqZWN0IHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIERPTSBFbGVtZW50IG9yIGEgQ1NTIHNlbGVjdG9yIGZvciBhIERPTSBFbGVtZW50LCB3aXRoaW4gd2hpY2ggdGhlIGVkaXRvcuKAmXMgcCBlbGVtZW50cyAoaS5lLiB0b29sdGlwcywgZXRjLikgc2hvdWxkIGJlIGNvbmZpbmVkLiBDdXJyZW50bHksIGl0IG9ubHkgY29uc2lkZXJzIGxlZnQgYW5kIHJpZ2h0IGJvdW5kYXJpZXMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYm91bmRzOiBIVE1MRWxlbWVudCB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBET00gRWxlbWVudCBvciBhIENTUyBzZWxlY3RvciBmb3IgYSBET00gRWxlbWVudCwgc3BlY2lmeWluZyB3aGljaCBjb250YWluZXIgaGFzIHRoZSBzY3JvbGxiYXJzIChpLmUuIG92ZXJmbG93LXk6IGF1dG8pLCBpZiBpcyBoYXMgYmVlbiBjaGFuZ2VkIGZyb20gdGhlIGRlZmF1bHQgcWwtZWRpdG9yIHdpdGggY3VzdG9tIENTUy4gTmVjZXNzYXJ5IHRvIGZpeCBzY3JvbGwganVtcGluZyBidWdzIHdoZW4gUXVpbGwgaXMgc2V0IHRvIGF1dG8gZ3JvdyBpdHMgaGVpZ2h0LCBhbmQgYW5vdGhlciBhbmNlc3RvciBjb250YWluZXIgaXMgcmVzcG9uc2libGUgZnJvbSB0aGUgc2Nyb2xsaW5nLi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzY3JvbGxpbmdDb250YWluZXI6IEhUTUxFbGVtZW50IHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFNob3J0Y3V0IGZvciBkZWJ1Zy4gTm90ZSBkZWJ1ZyBpcyBhIHN0YXRpYyBtZXRob2QgYW5kIHdpbGwgYWZmZWN0IG90aGVyIGluc3RhbmNlcyBvZiBRdWlsbCBlZGl0b3JzIG9uIHRoZSBwYWdlLiBPbmx5IHdhcm5pbmcgYW5kIGVycm9yIG1lc3NhZ2VzIGFyZSBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZGVidWc6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGluc3RhbnRpYXRlIHRoZSBlZGl0b3IgdG8gcmVhZC1vbmx5IG1vZGUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IHJlYWRvbmx5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZG9ubHk7XG4gICAgfVxuICAgIHNldCByZWFkb25seSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fcmVhZG9ubHkgPSB2YWw7XG5cbiAgICAgICAgaWYgKHRoaXMucXVpbGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWFkb25seSkgdGhpcy5xdWlsbC5kaXNhYmxlKCk7XG4gICAgICAgICAgICBlbHNlIHRoaXMucXVpbGwuZW5hYmxlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gdGhlIHF1aWxsIG1vZHVsZXMgYXJlIGxvYWRlZC5cbiAgICAgKiBAcGFyYW0ge0VkaXRvckluaXRFdmVudH0gZXZlbnQgLSBjdXN0b20gZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uSW5pdDogRXZlbnRFbWl0dGVyPEVkaXRvckluaXRFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPEVkaXRvckluaXRFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiB0ZXh0IG9mIGVkaXRvciBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7RWRpdG9yVGV4dENoYW5nZUV2ZW50fSBldmVudCAtIGN1c3RvbSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25UZXh0Q2hhbmdlOiBFdmVudEVtaXR0ZXI8RWRpdG9yVGV4dENoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RWRpdG9yVGV4dENoYW5nZUV2ZW50PigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHNlbGVjdGlvbiBvZiB0aGUgdGV4dCBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSB7RWRpdG9yU2VsZWN0aW9uQ2hhbmdlRXZlbnR9IGV2ZW50IC0gY3VzdG9tIGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvblNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPEVkaXRvclNlbGVjdGlvbkNoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RWRpdG9yU2VsZWN0aW9uQ2hhbmdlRXZlbnQ+KCk7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlcyE6IFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPjtcblxuICAgIEBDb250ZW50Q2hpbGQoSGVhZGVyKSB0b29sYmFyOiBhbnk7XG5cbiAgICB2YWx1ZTogTnVsbGFibGU8c3RyaW5nPjtcblxuICAgIF9yZWFkb25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcXVpbGw6IGFueTtcblxuICAgIGR5bmFtaWNRdWlsbDogYW55O1xuXG4gICAgaGVhZGVyVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgcHJpdmF0ZSBxdWlsbEVsZW1lbnRzITogeyBlZGl0b3JFbGVtZW50OiBIVE1MRWxlbWVudDsgdG9vbGJhckVsZW1lbnQ6IEhUTUxFbGVtZW50IH07XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IG9iamVjdFxuICAgICkge1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVhZCBvciB3cml0ZSB0aGUgRE9NIG9uY2UsIHdoZW4gaW5pdGlhbGl6aW5nIG5vbi1Bbmd1bGFyIChRdWlsbCkgbGlicmFyeS5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVyTmV4dFJlbmRlcigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRRdWlsbEVsZW1lbnRzKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRRdWlsbEVkaXRvcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMucXVpbGwpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucXVpbGwuc2V0Q29udGVudHModGhpcy5xdWlsbC5jbGlwYm9hcmQuY29udmVydCh0aGlzLmR5bmFtaWNRdWlsbC52ZXJzaW9uLnN0YXJ0c1dpdGgoJzInKSA/IHsgaHRtbDogdGhpcy52YWx1ZSB9IDogdGhpcy52YWx1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnF1aWxsLnNldFRleHQoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBnZXRRdWlsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVpbGw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0UXVpbGxFZGl0b3IoKTogdm9pZCB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbXBvcnRpbmcgUXVpbGwgYXQgdG9wIGxldmVsLCB0aHJvd3MgYGRvY3VtZW50IGlzIHVuZGVmaW5lZGAgZXJyb3IgZHVyaW5nIHdoZW5cbiAgICAgICAgICogYnVpbGRpbmcgZm9yIFNTUiwgc28gdGhpcyBkeW5hbWljYWxseSBsb2FkcyBxdWlsbCB3aGVuIGl0J3MgaW4gYnJvd3NlciBtb2R1bGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXRoaXMuZHluYW1pY1F1aWxsKSB7XG4gICAgICAgICAgICBpbXBvcnQoJ3F1aWxsJylcbiAgICAgICAgICAgICAgICAudGhlbigocXVpbGxNb2R1bGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bmFtaWNRdWlsbCA9IHF1aWxsTW9kdWxlLmRlZmF1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUXVpbGxFZGl0b3IoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4gY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUXVpbGxFZGl0b3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlUXVpbGxFZGl0b3IoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdFF1aWxsRWxlbWVudHMoKTtcblxuICAgICAgICBjb25zdCB7IHRvb2xiYXJFbGVtZW50LCBlZGl0b3JFbGVtZW50IH0gPSB0aGlzLnF1aWxsRWxlbWVudHM7XG4gICAgICAgIGxldCBkZWZhdWx0TW9kdWxlID0geyB0b29sYmFyOiB0b29sYmFyRWxlbWVudCB9O1xuICAgICAgICBsZXQgbW9kdWxlcyA9IHRoaXMubW9kdWxlcyA/IHsgLi4uZGVmYXVsdE1vZHVsZSwgLi4udGhpcy5tb2R1bGVzIH0gOiBkZWZhdWx0TW9kdWxlO1xuICAgICAgICB0aGlzLnF1aWxsID0gbmV3IHRoaXMuZHluYW1pY1F1aWxsKGVkaXRvckVsZW1lbnQsIHtcbiAgICAgICAgICAgIG1vZHVsZXM6IG1vZHVsZXMsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy5wbGFjZWhvbGRlcixcbiAgICAgICAgICAgIHJlYWRPbmx5OiB0aGlzLnJlYWRvbmx5LFxuICAgICAgICAgICAgdGhlbWU6ICdzbm93JyxcbiAgICAgICAgICAgIGZvcm1hdHM6IHRoaXMuZm9ybWF0cyxcbiAgICAgICAgICAgIGJvdW5kczogdGhpcy5ib3VuZHMsXG4gICAgICAgICAgICBkZWJ1ZzogdGhpcy5kZWJ1ZyxcbiAgICAgICAgICAgIHNjcm9sbGluZ0NvbnRhaW5lcjogdGhpcy5zY3JvbGxpbmdDb250YWluZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgaXNRdWlsbDIgPSB0aGlzLmR5bmFtaWNRdWlsbC52ZXJzaW9uLnN0YXJ0c1dpdGgoJzInKTtcblxuICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5xdWlsbC5zZXRDb250ZW50cyh0aGlzLnF1aWxsLmNsaXBib2FyZC5jb252ZXJ0KGlzUXVpbGwyID8geyBodG1sOiB0aGlzLnZhbHVlIH0gOiB0aGlzLnZhbHVlKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1aWxsLm9uKCd0ZXh0LWNoYW5nZScsIChkZWx0YTogYW55LCBvbGRDb250ZW50czogYW55LCBzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3VzZXInKSB7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBpc1F1aWxsMiA/IHRoaXMucXVpbGwuZ2V0U2VtYW50aWNIVE1MKCkgOiBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZWRpdG9yRWxlbWVudCwgJy5xbC1lZGl0b3InKS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLnF1aWxsLmdldFRleHQoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKGh0bWwgPT09ICc8cD48YnI+PC9wPicpIHtcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vblRleHRDaGFuZ2UuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIGh0bWxWYWx1ZTogaHRtbCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFZhbHVlOiB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTogZGVsdGEsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UoaHRtbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnF1aWxsLm9uKCdzZWxlY3Rpb24tY2hhbmdlJywgKHJhbmdlOiBzdHJpbmcsIG9sZFJhbmdlOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgICAgIHJhbmdlOiByYW5nZSxcbiAgICAgICAgICAgICAgICBvbGRSYW5nZTogb2xkUmFuZ2UsXG4gICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uSW5pdC5lbWl0KHtcbiAgICAgICAgICAgIGVkaXRvcjogdGhpcy5xdWlsbFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRRdWlsbEVsZW1lbnRzKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMucXVpbGxFbGVtZW50cykge1xuICAgICAgICAgICAgdGhpcy5xdWlsbEVsZW1lbnRzID0ge1xuICAgICAgICAgICAgICAgIGVkaXRvckVsZW1lbnQ6IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdkaXYucC1lZGl0b3ItY29udGVudCcpLFxuICAgICAgICAgICAgICAgIHRvb2xiYXJFbGVtZW50OiBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnZGl2LnAtZWRpdG9yLXRvb2xiYXInKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRWRpdG9yLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0VkaXRvcl1cbn0pXG5leHBvcnQgY2xhc3MgRWRpdG9yTW9kdWxlIHt9XG4iXX0=