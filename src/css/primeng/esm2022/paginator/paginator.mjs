import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, ViewEncapsulation, booleanAttribute, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AngleDoubleLeftIcon } from 'primeng/icons/angledoubleleft';
import { AngleDoubleRightIcon } from 'primeng/icons/angledoubleright';
import { AngleLeftIcon } from 'primeng/icons/angleleft';
import { AngleRightIcon } from 'primeng/icons/angleright';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
import * as i3 from "primeng/dropdown";
import * as i4 from "primeng/inputnumber";
import * as i5 from "@angular/forms";
import * as i6 from "primeng/ripple";
/**
 * Paginator is a generic component to display content in paged format.
 * @group Components
 */
export class Paginator {
    cd;
    config;
    /**
     * Number of page links to display.
     * @group Props
     */
    pageLinkSize = 5;
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
     * Whether to show it even there is only one page.
     * @group Props
     */
    alwaysShow = true;
    /**
     * Target element to attach the dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    dropdownAppendTo;
    /**
     * Template instance to inject into the left side of the paginator.
     * @param {PaginatorState} context - Paginator state.
     * @group Props
     */
    templateLeft;
    /**
     * Template instance to inject into the right side of the paginator.
     * @param {PaginatorState} context - Paginator state.
     * @group Props
     */
    templateRight;
    /**
     * Target element to attach the dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    appendTo;
    /**
     * Dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    dropdownScrollHeight = '200px';
    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    currentPageReportTemplate = '{currentPage} of {totalPages}';
    /**
     * Whether to display current page report.
     * @group Props
     */
    showCurrentPageReport;
    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    showFirstLastIcon = true;
    /**
     * Number of total records.
     * @group Props
     */
    totalRecords = 0;
    /**
     * Data count to display per page.
     * @group Props
     */
    rows = 0;
    /**
     * Array of integer/object values to display inside rows per page dropdown. A object that have 'showAll' key can be added to it to show all data. Exp; [10,20,30,{showAll:'All'}]
     * @group Props
     */
    rowsPerPageOptions;
    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    showJumpToPageDropdown;
    /**
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    showJumpToPageInput;
    /**
     * Template instance to inject into the jump to page dropdown item inside in the paginator.
     * @param {Object} context - item instance.
     * @group Props
     */
    jumpToPageItemTemplate;
    /**
     * Whether to show page links.
     * @group Props
     */
    showPageLinks = true;
    /**
     * Locale to be used in formatting.
     * @group Props
     */
    locale;
    /**
     * Template instance to inject into the rows per page dropdown item inside in the paginator.
     * @param {Object} context - item instance.
     * @group Props
     */
    dropdownItemTemplate;
    /**
     * Zero-relative number of the first row to be displayed.
     * @group Props
     */
    get first() {
        return this._first;
    }
    set first(val) {
        this._first = val;
    }
    /**
     * Callback to invoke when page changes, the event object contains information about the new state.
     * @param {PaginatorState} event - Paginator state.
     * @group Emits
     */
    onPageChange = new EventEmitter();
    templates;
    dropdownIconTemplate;
    firstPageLinkIconTemplate;
    previousPageLinkIconTemplate;
    lastPageLinkIconTemplate;
    nextPageLinkIconTemplate;
    pageLinks;
    pageItems;
    rowsPerPageItems;
    paginatorState;
    _first = 0;
    _page = 0;
    constructor(cd, config) {
        this.cd = cd;
        this.config = config;
    }
    ngOnInit() {
        this.updatePaginatorState();
    }
    getAriaLabel(labelType) {
        return this.config.translation.aria ? this.config.translation.aria[labelType] : undefined;
    }
    getPageAriaLabel(value) {
        return this.config.translation.aria ? this.config.translation.aria.pageLabel.replace(/{page}/g, `${value}`) : undefined;
    }
    getLocalization(digit) {
        const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [i, d]));
        if (digit > 9) {
            const numbers = String(digit).split('');
            return numbers.map((number) => index.get(Number(number))).join('');
        }
        else {
            return index.get(digit);
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'dropdownicon':
                    this.dropdownIconTemplate = item.template;
                    break;
                case 'firstpagelinkicon':
                    this.firstPageLinkIconTemplate = item.template;
                    break;
                case 'previouspagelinkicon':
                    this.previousPageLinkIconTemplate = item.template;
                    break;
                case 'lastpagelinkicon':
                    this.lastPageLinkIconTemplate = item.template;
                    break;
                case 'nextpagelinkicon':
                    this.nextPageLinkIconTemplate = item.template;
                    break;
            }
        });
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.totalRecords) {
            this.updatePageLinks();
            this.updatePaginatorState();
            this.updateFirst();
            this.updateRowsPerPageOptions();
        }
        if (simpleChange.first) {
            this._first = simpleChange.first.currentValue;
            this.updatePageLinks();
            this.updatePaginatorState();
        }
        if (simpleChange.rows) {
            this.updatePageLinks();
            this.updatePaginatorState();
        }
        if (simpleChange.rowsPerPageOptions) {
            this.updateRowsPerPageOptions();
        }
        if (simpleChange.pageLinkSize) {
            this.updatePageLinks();
        }
    }
    updateRowsPerPageOptions() {
        if (this.rowsPerPageOptions) {
            this.rowsPerPageItems = [];
            for (let opt of this.rowsPerPageOptions) {
                if (typeof opt == 'object' && opt['showAll']) {
                    this.rowsPerPageItems.unshift({ label: opt['showAll'], value: this.totalRecords });
                }
                else {
                    this.rowsPerPageItems.push({ label: String(this.getLocalization(opt)), value: opt });
                }
            }
        }
    }
    isFirstPage() {
        return this.getPage() === 0;
    }
    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }
    getPageCount() {
        return Math.ceil(this.totalRecords / this.rows);
    }
    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(), visiblePages = Math.min(this.pageLinkSize, numberOfPages);
        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)), end = Math.min(numberOfPages - 1, start + visiblePages - 1);
        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);
        return [start, end];
    }
    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(), start = boundaries[0], end = boundaries[1];
        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
        if (this.showJumpToPageDropdown) {
            this.pageItems = [];
            for (let i = 0; i < this.getPageCount(); i++) {
                this.pageItems.push({ label: String(i + 1), value: i });
            }
        }
    }
    changePage(p) {
        var pc = this.getPageCount();
        if (p >= 0 && p < pc) {
            this._first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();
            this.onPageChange.emit(state);
            this.updatePaginatorState();
        }
    }
    updateFirst() {
        const page = this.getPage();
        if (page > 0 && this.totalRecords && this.first >= this.totalRecords) {
            Promise.resolve(null).then(() => this.changePage(page - 1));
        }
    }
    getPage() {
        return Math.floor(this.first / this.rows);
    }
    changePageToFirst(event) {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }
        event.preventDefault();
    }
    changePageToPrev(event) {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }
    changePageToNext(event) {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }
    changePageToLast(event) {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }
        event.preventDefault();
    }
    onPageLinkClick(event, page) {
        this.changePage(page);
        event.preventDefault();
    }
    onRppChange(event) {
        this.changePage(this.getPage());
    }
    onPageDropdownChange(event) {
        this.changePage(event.value);
    }
    updatePaginatorState() {
        this.paginatorState = {
            page: this.getPage(),
            pageCount: this.getPageCount(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        };
    }
    empty() {
        return this.getPageCount() === 0;
    }
    currentPage() {
        return this.getPageCount() > 0 ? this.getPage() + 1 : 0;
    }
    get currentPageReport() {
        return this.currentPageReportTemplate
            .replace('{currentPage}', String(this.currentPage()))
            .replace('{totalPages}', String(this.getPageCount()))
            .replace('{first}', String(this.totalRecords > 0 ? this._first + 1 : 0))
            .replace('{last}', String(Math.min(this._first + this.rows, this.totalRecords)))
            .replace('{rows}', String(this.rows))
            .replace('{totalRecords}', String(this.totalRecords));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Paginator, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: Paginator, selector: "p-paginator", inputs: { pageLinkSize: ["pageLinkSize", "pageLinkSize", numberAttribute], style: "style", styleClass: "styleClass", alwaysShow: ["alwaysShow", "alwaysShow", booleanAttribute], dropdownAppendTo: "dropdownAppendTo", templateLeft: "templateLeft", templateRight: "templateRight", appendTo: "appendTo", dropdownScrollHeight: "dropdownScrollHeight", currentPageReportTemplate: "currentPageReportTemplate", showCurrentPageReport: ["showCurrentPageReport", "showCurrentPageReport", booleanAttribute], showFirstLastIcon: ["showFirstLastIcon", "showFirstLastIcon", booleanAttribute], totalRecords: ["totalRecords", "totalRecords", numberAttribute], rows: ["rows", "rows", numberAttribute], rowsPerPageOptions: "rowsPerPageOptions", showJumpToPageDropdown: ["showJumpToPageDropdown", "showJumpToPageDropdown", booleanAttribute], showJumpToPageInput: ["showJumpToPageInput", "showJumpToPageInput", booleanAttribute], jumpToPageItemTemplate: "jumpToPageItemTemplate", showPageLinks: ["showPageLinks", "showPageLinks", booleanAttribute], locale: "locale", dropdownItemTemplate: "dropdownItemTemplate", first: "first" }, outputs: { onPageChange: "onPageChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], usesOnChanges: true, ngImport: i0, template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'p-paginator p-component'" *ngIf="alwaysShow ? true : pageLinks && pageLinks.length > 1" [attr.data-pc-section]="'paginator'" [attr.data-pc-section]="'root'">
            <div class="p-paginator-left-content" *ngIf="templateLeft" [attr.data-pc-section]="'start'">
                <ng-container *ngTemplateOutlet="templateLeft; context: { $implicit: paginatorState }"></ng-container>
            </div>
            <span class="p-paginator-current" *ngIf="showCurrentPageReport">{{ currentPageReport }}</span>
            <button
                *ngIf="showFirstLastIcon"
                type="button"
                [disabled]="isFirstPage() || empty()"
                (click)="changePageToFirst($event)"
                pRipple
                class="p-paginator-first p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isFirstPage() || empty() }"
                [attr.aria-label]="getAriaLabel('firstPageLabel')"
            >
                <AngleDoubleLeftIcon *ngIf="!firstPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="firstPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="firstPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <button
                type="button"
                [disabled]="isFirstPage() || empty()"
                (click)="changePageToPrev($event)"
                pRipple
                class="p-paginator-prev p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isFirstPage() || empty() }"
                [attr.aria-label]="getAriaLabel('prevPageLabel')"
            >
                <AngleLeftIcon *ngIf="!previousPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="previousPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="previousPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <span class="p-paginator-pages" *ngIf="showPageLinks">
                <button
                    type="button"
                    *ngFor="let pageLink of pageLinks"
                    class="p-paginator-page p-paginator-element p-link"
                    [ngClass]="{ 'p-highlight': pageLink - 1 == getPage() }"
                    [attr.aria-label]="getPageAriaLabel(pageLink)"
                    [attr.aria-current]="pageLink - 1 == getPage() ? 'page' : undefined"
                    (click)="onPageLinkClick($event, pageLink - 1)"
                    pRipple
                >
                    {{ getLocalization(pageLink) }}
                </button>
            </span>
            <p-dropdown
                [options]="pageItems"
                [ngModel]="getPage()"
                *ngIf="showJumpToPageDropdown"
                [disabled]="empty()"
                [attr.aria-label]="getAriaLabel('jumpToPageDropdownLabel')"
                styleClass="p-paginator-page-options"
                (onChange)="onPageDropdownChange($event)"
                [appendTo]="dropdownAppendTo"
                [scrollHeight]="dropdownScrollHeight"
            >
                <ng-template pTemplate="selectedItem">{{ currentPageReport }}</ng-template>
                <ng-container *ngIf="jumpToPageItemTemplate">
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="jumpToPageItemTemplate; context: { $implicit: item }"> </ng-container>
                    </ng-template>
                </ng-container>
                <ng-template pTemplate="dropdownicon" *ngIf="dropdownIconTemplate">
                    <ng-container *ngTemplateOutlet="dropdownIconTemplate"></ng-container>
                </ng-template>
            </p-dropdown>
            <button
                type="button"
                [disabled]="isLastPage() || empty()"
                (click)="changePageToNext($event)"
                pRipple
                class="p-paginator-next p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isLastPage() || empty() }"
                [attr.aria-label]="getAriaLabel('nextPageLabel')"
            >
                <AngleRightIcon *ngIf="!nextPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="nextPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="nextPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <button
                *ngIf="showFirstLastIcon"
                type="button"
                [disabled]="isLastPage() || empty()"
                (click)="changePageToLast($event)"
                pRipple
                class="p-paginator-last p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isLastPage() || empty() }"
                [attr.aria-label]="getAriaLabel('lastPageLabel')"
            >
                <AngleDoubleRightIcon *ngIf="!lastPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="lastPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="lastPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <p-inputNumber *ngIf="showJumpToPageInput" [ngModel]="currentPage()" class="p-paginator-page-input" [disabled]="empty()" (ngModelChange)="changePage($event - 1)"></p-inputNumber>
            <p-dropdown
                [options]="rowsPerPageItems"
                [(ngModel)]="rows"
                *ngIf="rowsPerPageOptions"
                styleClass="p-paginator-rpp-options"
                [disabled]="empty()"
                (onChange)="onRppChange($event)"
                [appendTo]="dropdownAppendTo"
                [scrollHeight]="dropdownScrollHeight"
                [ariaLabel]="getAriaLabel('rowsPerPageLabel')"
            >
                <ng-container *ngIf="dropdownItemTemplate">
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="dropdownItemTemplate; context: { $implicit: item }"> </ng-container>
                    </ng-template>
                </ng-container>
                <ng-template pTemplate="dropdownicon" *ngIf="dropdownIconTemplate">
                    <ng-container *ngTemplateOutlet="dropdownIconTemplate"></ng-container>
                </ng-template>
            </p-dropdown>
            <div class="p-paginator-right-content" *ngIf="templateRight" [attr.data-pc-section]="'end'">
                <ng-container *ngTemplateOutlet="templateRight; context: { $implicit: paginatorState }"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: ["@layer primeng{.p-paginator{display:flex;align-items:center;justify-content:center;flex-wrap:wrap}.p-paginator-left-content{margin-right:auto}.p-paginator-right-content{margin-left:auto}.p-paginator-page,.p-paginator-next,.p-paginator-last,.p-paginator-first,.p-paginator-prev,.p-paginator-current{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;-webkit-user-select:none;user-select:none;overflow:hidden;position:relative}.p-paginator-element:focus{z-index:1;position:relative}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i2.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i0.forwardRef(() => i2.NgStyle), selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i0.forwardRef(() => i3.Dropdown), selector: "p-dropdown", inputs: ["id", "scrollHeight", "filter", "name", "style", "panelStyle", "styleClass", "panelStyleClass", "readonly", "required", "editable", "appendTo", "tabindex", "placeholder", "loadingIcon", "filterPlaceholder", "filterLocale", "variant", "inputId", "dataKey", "filterBy", "filterFields", "autofocus", "resetFilterOnHide", "checkmark", "dropdownIcon", "loading", "optionLabel", "optionValue", "optionDisabled", "optionGroupLabel", "optionGroupChildren", "autoDisplayFirst", "group", "showClear", "emptyFilterMessage", "emptyMessage", "lazy", "virtualScroll", "virtualScrollItemSize", "virtualScrollOptions", "overlayOptions", "ariaFilterLabel", "ariaLabel", "ariaLabelledBy", "filterMatchMode", "maxlength", "tooltip", "tooltipPosition", "tooltipPositionStyle", "tooltipStyleClass", "focusOnHover", "selectOnFocus", "autoOptionFocus", "autofocusFilter", "autoShowPanelOnPrintableCharacterKeyDown", "disabled", "itemSize", "autoZIndex", "baseZIndex", "showTransitionOptions", "hideTransitionOptions", "filterValue", "options"], outputs: ["onChange", "onFilter", "onFocus", "onBlur", "onClick", "onShow", "onHide", "onClear", "onLazyLoad"] }, { kind: "directive", type: i0.forwardRef(() => i1.PrimeTemplate), selector: "[pTemplate]", inputs: ["type", "pTemplate"] }, { kind: "component", type: i0.forwardRef(() => i4.InputNumber), selector: "p-inputNumber", inputs: ["showButtons", "format", "buttonLayout", "inputId", "styleClass", "style", "placeholder", "size", "maxlength", "tabindex", "title", "ariaLabelledBy", "ariaLabel", "ariaRequired", "name", "required", "autocomplete", "min", "max", "incrementButtonClass", "decrementButtonClass", "incrementButtonIcon", "decrementButtonIcon", "readonly", "step", "allowEmpty", "locale", "localeMatcher", "mode", "currency", "currencyDisplay", "useGrouping", "variant", "minFractionDigits", "maxFractionDigits", "prefix", "suffix", "inputStyle", "inputStyleClass", "showClear", "autofocus", "disabled"], outputs: ["onInput", "onFocus", "onBlur", "onKeyDown", "onClear"] }, { kind: "directive", type: i0.forwardRef(() => i5.NgControlStatus), selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i0.forwardRef(() => i5.NgModel), selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i0.forwardRef(() => i6.Ripple), selector: "[pRipple]" }, { kind: "component", type: i0.forwardRef(() => AngleDoubleLeftIcon), selector: "AngleDoubleLeftIcon" }, { kind: "component", type: i0.forwardRef(() => AngleDoubleRightIcon), selector: "AngleDoubleRightIcon" }, { kind: "component", type: i0.forwardRef(() => AngleLeftIcon), selector: "AngleLeftIcon" }, { kind: "component", type: i0.forwardRef(() => AngleRightIcon), selector: "AngleRightIcon" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: Paginator, decorators: [{
            type: Component,
            args: [{ selector: 'p-paginator', template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'p-paginator p-component'" *ngIf="alwaysShow ? true : pageLinks && pageLinks.length > 1" [attr.data-pc-section]="'paginator'" [attr.data-pc-section]="'root'">
            <div class="p-paginator-left-content" *ngIf="templateLeft" [attr.data-pc-section]="'start'">
                <ng-container *ngTemplateOutlet="templateLeft; context: { $implicit: paginatorState }"></ng-container>
            </div>
            <span class="p-paginator-current" *ngIf="showCurrentPageReport">{{ currentPageReport }}</span>
            <button
                *ngIf="showFirstLastIcon"
                type="button"
                [disabled]="isFirstPage() || empty()"
                (click)="changePageToFirst($event)"
                pRipple
                class="p-paginator-first p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isFirstPage() || empty() }"
                [attr.aria-label]="getAriaLabel('firstPageLabel')"
            >
                <AngleDoubleLeftIcon *ngIf="!firstPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="firstPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="firstPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <button
                type="button"
                [disabled]="isFirstPage() || empty()"
                (click)="changePageToPrev($event)"
                pRipple
                class="p-paginator-prev p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isFirstPage() || empty() }"
                [attr.aria-label]="getAriaLabel('prevPageLabel')"
            >
                <AngleLeftIcon *ngIf="!previousPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="previousPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="previousPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <span class="p-paginator-pages" *ngIf="showPageLinks">
                <button
                    type="button"
                    *ngFor="let pageLink of pageLinks"
                    class="p-paginator-page p-paginator-element p-link"
                    [ngClass]="{ 'p-highlight': pageLink - 1 == getPage() }"
                    [attr.aria-label]="getPageAriaLabel(pageLink)"
                    [attr.aria-current]="pageLink - 1 == getPage() ? 'page' : undefined"
                    (click)="onPageLinkClick($event, pageLink - 1)"
                    pRipple
                >
                    {{ getLocalization(pageLink) }}
                </button>
            </span>
            <p-dropdown
                [options]="pageItems"
                [ngModel]="getPage()"
                *ngIf="showJumpToPageDropdown"
                [disabled]="empty()"
                [attr.aria-label]="getAriaLabel('jumpToPageDropdownLabel')"
                styleClass="p-paginator-page-options"
                (onChange)="onPageDropdownChange($event)"
                [appendTo]="dropdownAppendTo"
                [scrollHeight]="dropdownScrollHeight"
            >
                <ng-template pTemplate="selectedItem">{{ currentPageReport }}</ng-template>
                <ng-container *ngIf="jumpToPageItemTemplate">
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="jumpToPageItemTemplate; context: { $implicit: item }"> </ng-container>
                    </ng-template>
                </ng-container>
                <ng-template pTemplate="dropdownicon" *ngIf="dropdownIconTemplate">
                    <ng-container *ngTemplateOutlet="dropdownIconTemplate"></ng-container>
                </ng-template>
            </p-dropdown>
            <button
                type="button"
                [disabled]="isLastPage() || empty()"
                (click)="changePageToNext($event)"
                pRipple
                class="p-paginator-next p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isLastPage() || empty() }"
                [attr.aria-label]="getAriaLabel('nextPageLabel')"
            >
                <AngleRightIcon *ngIf="!nextPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="nextPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="nextPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <button
                *ngIf="showFirstLastIcon"
                type="button"
                [disabled]="isLastPage() || empty()"
                (click)="changePageToLast($event)"
                pRipple
                class="p-paginator-last p-paginator-element p-link"
                [ngClass]="{ 'p-disabled': isLastPage() || empty() }"
                [attr.aria-label]="getAriaLabel('lastPageLabel')"
            >
                <AngleDoubleRightIcon *ngIf="!lastPageLinkIconTemplate" [styleClass]="'p-paginator-icon'" />
                <span class="p-paginator-icon" *ngIf="lastPageLinkIconTemplate">
                    <ng-template *ngTemplateOutlet="lastPageLinkIconTemplate"></ng-template>
                </span>
            </button>
            <p-inputNumber *ngIf="showJumpToPageInput" [ngModel]="currentPage()" class="p-paginator-page-input" [disabled]="empty()" (ngModelChange)="changePage($event - 1)"></p-inputNumber>
            <p-dropdown
                [options]="rowsPerPageItems"
                [(ngModel)]="rows"
                *ngIf="rowsPerPageOptions"
                styleClass="p-paginator-rpp-options"
                [disabled]="empty()"
                (onChange)="onRppChange($event)"
                [appendTo]="dropdownAppendTo"
                [scrollHeight]="dropdownScrollHeight"
                [ariaLabel]="getAriaLabel('rowsPerPageLabel')"
            >
                <ng-container *ngIf="dropdownItemTemplate">
                    <ng-template let-item pTemplate="item">
                        <ng-container *ngTemplateOutlet="dropdownItemTemplate; context: { $implicit: item }"> </ng-container>
                    </ng-template>
                </ng-container>
                <ng-template pTemplate="dropdownicon" *ngIf="dropdownIconTemplate">
                    <ng-container *ngTemplateOutlet="dropdownIconTemplate"></ng-container>
                </ng-template>
            </p-dropdown>
            <div class="p-paginator-right-content" *ngIf="templateRight" [attr.data-pc-section]="'end'">
                <ng-container *ngTemplateOutlet="templateRight; context: { $implicit: paginatorState }"></ng-container>
            </div>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-paginator{display:flex;align-items:center;justify-content:center;flex-wrap:wrap}.p-paginator-left-content{margin-right:auto}.p-paginator-right-content{margin-left:auto}.p-paginator-page,.p-paginator-next,.p-paginator-last,.p-paginator-first,.p-paginator-prev,.p-paginator-current{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;-webkit-user-select:none;user-select:none;overflow:hidden;position:relative}.p-paginator-element:focus{z-index:1;position:relative}}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.PrimeNGConfig }], propDecorators: { pageLinkSize: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], alwaysShow: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], dropdownAppendTo: [{
                type: Input
            }], templateLeft: [{
                type: Input
            }], templateRight: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], dropdownScrollHeight: [{
                type: Input
            }], currentPageReportTemplate: [{
                type: Input
            }], showCurrentPageReport: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showFirstLastIcon: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], totalRecords: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], rows: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }], rowsPerPageOptions: [{
                type: Input
            }], showJumpToPageDropdown: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], showJumpToPageInput: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], jumpToPageItemTemplate: [{
                type: Input
            }], showPageLinks: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], locale: [{
                type: Input
            }], dropdownItemTemplate: [{
                type: Input
            }], first: [{
                type: Input
            }], onPageChange: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class PaginatorModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PaginatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: PaginatorModule, declarations: [Paginator], imports: [CommonModule, DropdownModule, InputNumberModule, FormsModule, SharedModule, RippleModule, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon], exports: [Paginator, DropdownModule, InputNumberModule, FormsModule, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PaginatorModule, imports: [CommonModule, DropdownModule, InputNumberModule, FormsModule, SharedModule, RippleModule, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon, DropdownModule, InputNumberModule, FormsModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PaginatorModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, DropdownModule, InputNumberModule, FormsModule, SharedModule, RippleModule, AngleDoubleLeftIcon, AngleDoubleRightIcon, AngleLeftIcon, AngleRightIcon],
                    exports: [Paginator, DropdownModule, InputNumberModule, FormsModule, SharedModule],
                    declarations: [Paginator]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFFSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFHUixNQUFNLEVBSU4saUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixlQUFlLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQXVCLGFBQWEsRUFBYyxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0YsT0FBTyxFQUF1QixjQUFjLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN2RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7QUFHOUM7OztHQUdHO0FBdUlILE1BQU0sT0FBTyxTQUFTO0lBd0pOO0lBQ0E7SUF4Slo7OztPQUdHO0lBQ29DLFlBQVksR0FBVyxDQUFDLENBQUM7SUFDaEU7OztPQUdHO0lBQ00sS0FBSyxDQUE4QztJQUM1RDs7O09BR0c7SUFDTSxVQUFVLENBQXFCO0lBQ3hDOzs7T0FHRztJQUNxQyxVQUFVLEdB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WUFBWTs7MkZBR3hFLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDO29CQUM3SyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7b0JBQ2xGLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztpQkFDNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENoYW5nZURldGVjdG9yUmVmLFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgICBudW1iZXJBdHRyaWJ1dGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFyaWEsIFByaW1lTkdDb25maWcsIFByaW1lVGVtcGxhdGUsIFNlbGVjdEl0ZW0sIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERyb3Bkb3duQ2hhbmdlRXZlbnQsIERyb3Bkb3duTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9kcm9wZG93bic7XG5pbXBvcnQgeyBBbmdsZURvdWJsZUxlZnRJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hbmdsZWRvdWJsZWxlZnQnO1xuaW1wb3J0IHsgQW5nbGVEb3VibGVSaWdodEljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL2FuZ2xlZG91YmxlcmlnaHQnO1xuaW1wb3J0IHsgQW5nbGVMZWZ0SWNvbiB9IGZyb20gJ3ByaW1lbmcvaWNvbnMvYW5nbGVsZWZ0JztcbmltcG9ydCB7IEFuZ2xlUmlnaHRJY29uIH0gZnJvbSAncHJpbWVuZy9pY29ucy9hbmdsZXJpZ2h0JztcbmltcG9ydCB7IElucHV0TnVtYmVyTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9pbnB1dG51bWJlcic7XG5pbXBvcnQgeyBSaXBwbGVNb2R1bGUgfSBmcm9tICdwcmltZW5nL3JpcHBsZSc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJ3ByaW1lbmcvdHMtaGVscGVycyc7XG5pbXBvcnQgeyBQYWdpbmF0b3JTdGF0ZSB9IGZyb20gJy4vcGFnaW5hdG9yLmludGVyZmFjZSc7XG4vKipcbiAqIFBhZ2luYXRvciBpcyBhIGdlbmVyaWMgY29tcG9uZW50IHRvIGRpc3BsYXkgY29udGVudCBpbiBwYWdlZCBmb3JtYXQuXG4gKiBAZ3JvdXAgQ29tcG9uZW50c1xuICovXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtcGFnaW5hdG9yJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbbmdDbGFzc109XCIncC1wYWdpbmF0b3IgcC1jb21wb25lbnQnXCIgKm5nSWY9XCJhbHdheXNTaG93ID8gdHJ1ZSA6IHBhZ2VMaW5rcyAmJiBwYWdlTGlua3MubGVuZ3RoID4gMVwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncGFnaW5hdG9yJ1wiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncm9vdCdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXBhZ2luYXRvci1sZWZ0LWNvbnRlbnRcIiAqbmdJZj1cInRlbXBsYXRlTGVmdFwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInc3RhcnQnXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlTGVmdDsgY29udGV4dDogeyAkaW1wbGljaXQ6IHBhZ2luYXRvclN0YXRlIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1jdXJyZW50XCIgKm5nSWY9XCJzaG93Q3VycmVudFBhZ2VSZXBvcnRcIj57eyBjdXJyZW50UGFnZVJlcG9ydCB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RJY29uXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNGaXJzdFBhZ2UoKSB8fCBlbXB0eSgpXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hhbmdlUGFnZVRvRmlyc3QoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgIGNsYXNzPVwicC1wYWdpbmF0b3ItZmlyc3QgcC1wYWdpbmF0b3ItZWxlbWVudCBwLWxpbmtcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlzYWJsZWQnOiBpc0ZpcnN0UGFnZSgpIHx8IGVtcHR5KCkgfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJnZXRBcmlhTGFiZWwoJ2ZpcnN0UGFnZUxhYmVsJylcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxBbmdsZURvdWJsZUxlZnRJY29uICpuZ0lmPVwiIWZpcnN0UGFnZUxpbmtJY29uVGVtcGxhdGVcIiBbc3R5bGVDbGFzc109XCIncC1wYWdpbmF0b3ItaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1wYWdpbmF0b3ItaWNvblwiICpuZ0lmPVwiZmlyc3RQYWdlTGlua0ljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJmaXJzdFBhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNGaXJzdFBhZ2UoKSB8fCBlbXB0eSgpXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hhbmdlUGFnZVRvUHJldigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBhZ2luYXRvci1wcmV2IHAtcGFnaW5hdG9yLWVsZW1lbnQgcC1saW5rXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWRpc2FibGVkJzogaXNGaXJzdFBhZ2UoKSB8fCBlbXB0eSgpIH1cIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZ2V0QXJpYUxhYmVsKCdwcmV2UGFnZUxhYmVsJylcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxBbmdsZUxlZnRJY29uICpuZ0lmPVwiIXByZXZpb3VzUGFnZUxpbmtJY29uVGVtcGxhdGVcIiBbc3R5bGVDbGFzc109XCIncC1wYWdpbmF0b3ItaWNvbidcIiAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1wYWdpbmF0b3ItaWNvblwiICpuZ0lmPVwicHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwcmV2aW91c1BhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1wYWdpbmF0b3ItcGFnZXNcIiAqbmdJZj1cInNob3dQYWdlTGlua3NcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgcGFnZUxpbmsgb2YgcGFnZUxpbmtzXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBhZ2luYXRvci1wYWdlIHAtcGFnaW5hdG9yLWVsZW1lbnQgcC1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1oaWdobGlnaHQnOiBwYWdlTGluayAtIDEgPT0gZ2V0UGFnZSgpIH1cIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImdldFBhZ2VBcmlhTGFiZWwocGFnZUxpbmspXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1jdXJyZW50XT1cInBhZ2VMaW5rIC0gMSA9PSBnZXRQYWdlKCkgPyAncGFnZScgOiB1bmRlZmluZWRcIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25QYWdlTGlua0NsaWNrKCRldmVudCwgcGFnZUxpbmsgLSAxKVwiXG4gICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt7IGdldExvY2FsaXphdGlvbihwYWdlTGluaykgfX1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxwLWRyb3Bkb3duXG4gICAgICAgICAgICAgICAgW29wdGlvbnNdPVwicGFnZUl0ZW1zXCJcbiAgICAgICAgICAgICAgICBbbmdNb2RlbF09XCJnZXRQYWdlKClcIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0p1bXBUb1BhZ2VEcm9wZG93blwiXG4gICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImVtcHR5KClcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZ2V0QXJpYUxhYmVsKCdqdW1wVG9QYWdlRHJvcGRvd25MYWJlbCcpXCJcbiAgICAgICAgICAgICAgICBzdHlsZUNsYXNzPVwicC1wYWdpbmF0b3ItcGFnZS1vcHRpb25zXCJcbiAgICAgICAgICAgICAgICAob25DaGFuZ2UpPVwib25QYWdlRHJvcGRvd25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW2FwcGVuZFRvXT1cImRyb3Bkb3duQXBwZW5kVG9cIlxuICAgICAgICAgICAgICAgIFtzY3JvbGxIZWlnaHRdPVwiZHJvcGRvd25TY3JvbGxIZWlnaHRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJzZWxlY3RlZEl0ZW1cIj57eyBjdXJyZW50UGFnZVJlcG9ydCB9fTwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImp1bXBUb1BhZ2VJdGVtVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1pdGVtIHBUZW1wbGF0ZT1cIml0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJqdW1wVG9QYWdlSXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogaXRlbSB9XCI+IDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBwVGVtcGxhdGU9XCJkcm9wZG93bmljb25cIiAqbmdJZj1cImRyb3Bkb3duSWNvblRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJkcm9wZG93bkljb25UZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L3AtZHJvcGRvd24+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImlzTGFzdFBhZ2UoKSB8fCBlbXB0eSgpXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hhbmdlUGFnZVRvTmV4dCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXBhZ2luYXRvci1uZXh0IHAtcGFnaW5hdG9yLWVsZW1lbnQgcC1saW5rXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLWRpc2FibGVkJzogaXNMYXN0UGFnZSgpIHx8IGVtcHR5KCkgfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJnZXRBcmlhTGFiZWwoJ25leHRQYWdlTGFiZWwnKVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEFuZ2xlUmlnaHRJY29uICpuZ0lmPVwiIW5leHRQYWdlTGlua0ljb25UZW1wbGF0ZVwiIFtzdHlsZUNsYXNzXT1cIidwLXBhZ2luYXRvci1pY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXBhZ2luYXRvci1pY29uXCIgKm5nSWY9XCJuZXh0UGFnZUxpbmtJY29uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwibmV4dFBhZ2VMaW5rSWNvblRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RJY29uXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiaXNMYXN0UGFnZSgpIHx8IGVtcHR5KClcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJjaGFuZ2VQYWdlVG9MYXN0KCRldmVudClcIlxuICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtcGFnaW5hdG9yLWxhc3QgcC1wYWdpbmF0b3ItZWxlbWVudCBwLWxpbmtcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlzYWJsZWQnOiBpc0xhc3RQYWdlKCkgfHwgZW1wdHkoKSB9XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImdldEFyaWFMYWJlbCgnbGFzdFBhZ2VMYWJlbCcpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8QW5nbGVEb3VibGVSaWdodEljb24gKm5nSWY9XCIhbGFzdFBhZ2VMaW5rSWNvblRlbXBsYXRlXCIgW3N0eWxlQ2xhc3NdPVwiJ3AtcGFnaW5hdG9yLWljb24nXCIgLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtcGFnaW5hdG9yLWljb25cIiAqbmdJZj1cImxhc3RQYWdlTGlua0ljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsYXN0UGFnZUxpbmtJY29uVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHAtaW5wdXROdW1iZXIgKm5nSWY9XCJzaG93SnVtcFRvUGFnZUlucHV0XCIgW25nTW9kZWxdPVwiY3VycmVudFBhZ2UoKVwiIGNsYXNzPVwicC1wYWdpbmF0b3ItcGFnZS1pbnB1dFwiIFtkaXNhYmxlZF09XCJlbXB0eSgpXCIgKG5nTW9kZWxDaGFuZ2UpPVwiY2hhbmdlUGFnZSgkZXZlbnQgLSAxKVwiPjwvcC1pbnB1dE51bWJlcj5cbiAgICAgICAgICAgIDxwLWRyb3Bkb3duXG4gICAgICAgICAgICAgICAgW29wdGlvbnNdPVwicm93c1BlclBhZ2VJdGVtc1wiXG4gICAgICAgICAgICAgICAgWyhuZ01vZGVsKV09XCJyb3dzXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cInJvd3NQZXJQYWdlT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgc3R5bGVDbGFzcz1cInAtcGFnaW5hdG9yLXJwcC1vcHRpb25zXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZW1wdHkoKVwiXG4gICAgICAgICAgICAgICAgKG9uQ2hhbmdlKT1cIm9uUnBwQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFthcHBlbmRUb109XCJkcm9wZG93bkFwcGVuZFRvXCJcbiAgICAgICAgICAgICAgICBbc2Nyb2xsSGVpZ2h0XT1cImRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbYXJpYUxhYmVsXT1cImdldEFyaWFMYWJlbCgncm93c1BlclBhZ2VMYWJlbCcpXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZHJvcGRvd25JdGVtVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1pdGVtIHBUZW1wbGF0ZT1cIml0ZW1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJkcm9wZG93bkl0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0gfVwiPiA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgcFRlbXBsYXRlPVwiZHJvcGRvd25pY29uXCIgKm5nSWY9XCJkcm9wZG93bkljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiZHJvcGRvd25JY29uVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9wLWRyb3Bkb3duPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtcGFnaW5hdG9yLXJpZ2h0LWNvbnRlbnRcIiAqbmdJZj1cInRlbXBsYXRlUmlnaHRcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2VuZCdcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGVSaWdodDsgY29udGV4dDogeyAkaW1wbGljaXQ6IHBhZ2luYXRvclN0YXRlIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vcGFnaW5hdG9yLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBQYWdpbmF0b3IgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyB7XG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIHBhZ2UgbGlua3MgdG8gZGlzcGxheS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZSB9KSBwYWdlTGlua1NpemU6IG51bWJlciA9IDU7XG4gICAgLyoqXG4gICAgICogSW5saW5lIHN0eWxlIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgc3R5bGU6IHsgW2tsYXNzOiBzdHJpbmddOiBhbnkgfSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogU3R5bGUgY2xhc3Mgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBzaG93IGl0IGV2ZW4gdGhlcmUgaXMgb25seSBvbmUgcGFnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgYWx3YXlzU2hvdzogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogVGFyZ2V0IGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBkcm9wZG93biBvdmVybGF5LCB2YWxpZCB2YWx1ZXMgYXJlIFwiYm9keVwiIG9yIGEgbG9jYWwgbmctdGVtcGxhdGUgdmFyaWFibGUgb2YgYW5vdGhlciBlbGVtZW50IChub3RlOiB1c2UgYmluZGluZyB3aXRoIGJyYWNrZXRzIGZvciB0ZW1wbGF0ZSB2YXJpYWJsZXMsIGUuZy4gW2FwcGVuZFRvXT1cIm15ZGl2XCIgZm9yIGEgZGl2IGVsZW1lbnQgaGF2aW5nICNteWRpdiBhcyB2YXJpYWJsZSBuYW1lKS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBkcm9wZG93bkFwcGVuZFRvOiBIVE1MRWxlbWVudCB8IEVsZW1lbnRSZWYgfCBUZW1wbGF0ZVJlZjxhbnk+IHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB8IGFueTtcbiAgICAvKipcbiAgICAgKiBUZW1wbGF0ZSBpbnN0YW5jZSB0byBpbmplY3QgaW50byB0aGUgbGVmdCBzaWRlIG9mIHRoZSBwYWdpbmF0b3IuXG4gICAgICogQHBhcmFtIHtQYWdpbmF0b3JTdGF0ZX0gY29udGV4dCAtIFBhZ2luYXRvciBzdGF0ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSB0ZW1wbGF0ZUxlZnQ6IFRlbXBsYXRlUmVmPFBhZ2luYXRvclN0YXRlPiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBUZW1wbGF0ZSBpbnN0YW5jZSB0byBpbmplY3QgaW50byB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgcGFnaW5hdG9yLlxuICAgICAqIEBwYXJhbSB7UGFnaW5hdG9yU3RhdGV9IGNvbnRleHQgLSBQYWdpbmF0b3Igc3RhdGUuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgdGVtcGxhdGVSaWdodDogVGVtcGxhdGVSZWY8UGFnaW5hdG9yU3RhdGU+IHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFRhcmdldCBlbGVtZW50IHRvIGF0dGFjaCB0aGUgZHJvcGRvd24gb3ZlcmxheSwgdmFsaWQgdmFsdWVzIGFyZSBcImJvZHlcIiBvciBhIGxvY2FsIG5nLXRlbXBsYXRlIHZhcmlhYmxlIG9mIGFub3RoZXIgZWxlbWVudCAobm90ZTogdXNlIGJpbmRpbmcgd2l0aCBicmFja2V0cyBmb3IgdGVtcGxhdGUgdmFyaWFibGVzLCBlLmcuIFthcHBlbmRUb109XCJteWRpdlwiIGZvciBhIGRpdiBlbGVtZW50IGhhdmluZyAjbXlkaXYgYXMgdmFyaWFibGUgbmFtZSkuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgYXBwZW5kVG86IEhUTUxFbGVtZW50IHwgRWxlbWVudFJlZiB8IFRlbXBsYXRlUmVmPGFueT4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkIHwgYW55O1xuICAgIC8qKlxuICAgICAqIERyb3Bkb3duIGhlaWdodCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLCBhIHNjcm9sbGJhciBpcyBkZWZpbmVkIGlmIGhlaWdodCBvZiBsaXN0IGV4Y2VlZHMgdGhpcyB2YWx1ZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBkcm9wZG93blNjcm9sbEhlaWdodDogc3RyaW5nID0gJzIwMHB4JztcbiAgICAvKipcbiAgICAgKiBUZW1wbGF0ZSBvZiB0aGUgY3VycmVudCBwYWdlIHJlcG9ydCBlbGVtZW50LiBBdmFpbGFibGUgcGxhY2Vob2xkZXJzIGFyZSB7Y3VycmVudFBhZ2V9LHt0b3RhbFBhZ2VzfSx7cm93c30se2ZpcnN0fSx7bGFzdH0gYW5kIHt0b3RhbFJlY29yZHN9XG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgY3VycmVudFBhZ2VSZXBvcnRUZW1wbGF0ZTogc3RyaW5nID0gJ3tjdXJyZW50UGFnZX0gb2Yge3RvdGFsUGFnZXN9JztcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgY3VycmVudCBwYWdlIHJlcG9ydC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd0N1cnJlbnRQYWdlUmVwb3J0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZW4gZW5hYmxlZCwgaWNvbnMgYXJlIGRpc3BsYXllZCBvbiBwYWdpbmF0b3IgdG8gZ28gZmlyc3QgYW5kIGxhc3QgcGFnZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd0ZpcnN0TGFzdEljb246IGJvb2xlYW4gPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiB0b3RhbCByZWNvcmRzLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogbnVtYmVyQXR0cmlidXRlIH0pIHRvdGFsUmVjb3JkczogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBEYXRhIGNvdW50IHRvIGRpc3BsYXkgcGVyIHBhZ2UuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBudW1iZXJBdHRyaWJ1dGUgfSkgcm93czogbnVtYmVyID0gMDtcbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiBpbnRlZ2VyL29iamVjdCB2YWx1ZXMgdG8gZGlzcGxheSBpbnNpZGUgcm93cyBwZXIgcGFnZSBkcm9wZG93bi4gQSBvYmplY3QgdGhhdCBoYXZlICdzaG93QWxsJyBrZXkgY2FuIGJlIGFkZGVkIHRvIGl0IHRvIHNob3cgYWxsIGRhdGEuIEV4cDsgWzEwLDIwLDMwLHtzaG93QWxsOidBbGwnfV1cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSByb3dzUGVyUGFnZU9wdGlvbnM6IGFueVtdIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSBhIGRyb3Bkb3duIHRvIG5hdmlnYXRlIHRvIGFueSBwYWdlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzaG93SnVtcFRvUGFnZURyb3Bkb3duOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gZGlzcGxheSBhIGlucHV0IHRvIG5hdmlnYXRlIHRvIGFueSBwYWdlLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBzaG93SnVtcFRvUGFnZUlucHV0OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFRlbXBsYXRlIGluc3RhbmNlIHRvIGluamVjdCBpbnRvIHRoZSBqdW1wIHRvIHBhZ2UgZHJvcGRvd24gaXRlbSBpbnNpZGUgaW4gdGhlIHBhZ2luYXRvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29udGV4dCAtIGl0ZW0gaW5zdGFuY2UuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkganVtcFRvUGFnZUl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IGFueSB9PiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIHNob3cgcGFnZSBsaW5rcy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgc2hvd1BhZ2VMaW5rczogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogTG9jYWxlIHRvIGJlIHVzZWQgaW4gZm9ybWF0dGluZy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBUZW1wbGF0ZSBpbnN0YW5jZSB0byBpbmplY3QgaW50byB0aGUgcm93cyBwZXIgcGFnZSBkcm9wZG93biBpdGVtIGluc2lkZSBpbiB0aGUgcGFnaW5hdG9yLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gaXRlbSBpbnN0YW5jZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBkcm9wZG93bkl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IGFueSB9PiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBaZXJvLXJlbGF0aXZlIG51bWJlciBvZiB0aGUgZmlyc3Qgcm93IHRvIGJlIGRpc3BsYXllZC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBnZXQgZmlyc3QoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0O1xuICAgIH1cbiAgICBzZXQgZmlyc3QodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fZmlyc3QgPSB2YWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIHBhZ2UgY2hhbmdlcywgdGhlIGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbmV3IHN0YXRlLlxuICAgICAqIEBwYXJhbSB7UGFnaW5hdG9yU3RhdGV9IGV2ZW50IC0gUGFnaW5hdG9yIHN0YXRlLlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvblBhZ2VDaGFuZ2U6IEV2ZW50RW1pdHRlcjxQYWdpbmF0b3JTdGF0ZT4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2luYXRvclN0YXRlPigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IE51bGxhYmxlPFF1ZXJ5TGlzdDxhbnk+PjtcblxuICAgIGRyb3Bkb3duSWNvblRlbXBsYXRlOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIGZpcnN0UGFnZUxpbmtJY29uVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgcHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZTogTnVsbGFibGU8VGVtcGxhdGVSZWY8YW55Pj47XG5cbiAgICBsYXN0UGFnZUxpbmtJY29uVGVtcGxhdGU6IE51bGxhYmxlPFRlbXBsYXRlUmVmPGFueT4+O1xuXG4gICAgbmV4dFBhZ2VMaW5rSWNvblRlbXBsYXRlOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIHBhZ2VMaW5rczogbnVtYmVyW10gfCB1bmRlZmluZWQ7XG5cbiAgICBwYWdlSXRlbXM6IFNlbGVjdEl0ZW1bXSB8IHVuZGVmaW5lZDtcblxuICAgIHJvd3NQZXJQYWdlSXRlbXM6IFNlbGVjdEl0ZW1bXSB8IHVuZGVmaW5lZDtcblxuICAgIHBhZ2luYXRvclN0YXRlOiBhbnk7XG5cbiAgICBfZmlyc3Q6IG51bWJlciA9IDA7XG5cbiAgICBfcGFnZTogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgcHJpdmF0ZSBjb25maWc6IFByaW1lTkdDb25maWdcbiAgICApIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIGdldEFyaWFMYWJlbChsYWJlbFR5cGU6IGtleW9mIEFyaWEpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudHJhbnNsYXRpb24uYXJpYSA/IHRoaXMuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWFbbGFiZWxUeXBlXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRQYWdlQXJpYUxhYmVsKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcudHJhbnNsYXRpb24uYXJpYSA/IHRoaXMuY29uZmlnLnRyYW5zbGF0aW9uLmFyaWEucGFnZUxhYmVsLnJlcGxhY2UoL3twYWdlfS9nLCBgJHt2YWx1ZX1gKSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBnZXRMb2NhbGl6YXRpb24oZGlnaXQ6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG51bWVyYWxzID0gWy4uLm5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLmxvY2FsZSwgeyB1c2VHcm91cGluZzogZmFsc2UgfSkuZm9ybWF0KDk4NzY1NDMyMTApXS5yZXZlcnNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbmV3IE1hcChudW1lcmFscy5tYXAoKGQsIGkpID0+IFtpLCBkXSkpO1xuICAgICAgICBpZiAoZGlnaXQgPiA5KSB7XG4gICAgICAgICAgICBjb25zdCBudW1iZXJzID0gU3RyaW5nKGRpZ2l0KS5zcGxpdCgnJyk7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVycy5tYXAoKG51bWJlcikgPT4gaW5kZXguZ2V0KE51bWJlcihudW1iZXIpKSkuam9pbignJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXguZ2V0KGRpZ2l0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgKHRoaXMudGVtcGxhdGVzIGFzIFF1ZXJ5TGlzdDxQcmltZVRlbXBsYXRlPikuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Ryb3Bkb3duaWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcGRvd25JY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpcnN0cGFnZWxpbmtpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdFBhZ2VMaW5rSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwcmV2aW91c3BhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNQYWdlTGlua0ljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGFzdHBhZ2VsaW5raWNvbic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFBhZ2VMaW5rSWNvblRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICduZXh0cGFnZWxpbmtpY29uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0UGFnZUxpbmtJY29uVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoc2ltcGxlQ2hhbmdlOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudG90YWxSZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGaXJzdCgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3dzUGVyUGFnZU9wdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuZmlyc3QpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpcnN0ID0gc2ltcGxlQ2hhbmdlLmZpcnN0LmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRvclN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnJvd3MpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZUxpbmtzKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRvclN0YXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnJvd3NQZXJQYWdlT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3dzUGVyUGFnZU9wdGlvbnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UucGFnZUxpbmtTaXplKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUm93c1BlclBhZ2VPcHRpb25zKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yb3dzUGVyUGFnZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMucm93c1BlclBhZ2VJdGVtcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgb3B0IG9mIHRoaXMucm93c1BlclBhZ2VPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQgPT0gJ29iamVjdCcgJiYgb3B0WydzaG93QWxsJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzUGVyUGFnZUl0ZW1zLnVuc2hpZnQoeyBsYWJlbDogb3B0WydzaG93QWxsJ10sIHZhbHVlOiB0aGlzLnRvdGFsUmVjb3JkcyB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd3NQZXJQYWdlSXRlbXMucHVzaCh7IGxhYmVsOiBTdHJpbmcodGhpcy5nZXRMb2NhbGl6YXRpb24ob3B0KSksIHZhbHVlOiBvcHQgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhZ2UoKSA9PT0gMDtcbiAgICB9XG5cbiAgICBpc0xhc3RQYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQYWdlKCkgPT09IHRoaXMuZ2V0UGFnZUNvdW50KCkgLSAxO1xuICAgIH1cblxuICAgIGdldFBhZ2VDb3VudCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMudG90YWxSZWNvcmRzIC8gdGhpcy5yb3dzKTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQYWdlTGlua0JvdW5kYXJpZXMoKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgICAgIGxldCBudW1iZXJPZlBhZ2VzID0gdGhpcy5nZXRQYWdlQ291bnQoKSxcbiAgICAgICAgICAgIHZpc2libGVQYWdlcyA9IE1hdGgubWluKHRoaXMucGFnZUxpbmtTaXplLCBudW1iZXJPZlBhZ2VzKTtcblxuICAgICAgICAvL2NhbGN1bGF0ZSByYW5nZSwga2VlcCBjdXJyZW50IGluIG1pZGRsZSBpZiBuZWNlc3NhcnlcbiAgICAgICAgbGV0IHN0YXJ0ID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKHRoaXMuZ2V0UGFnZSgpIC0gdmlzaWJsZVBhZ2VzIC8gMikpLFxuICAgICAgICAgICAgZW5kID0gTWF0aC5taW4obnVtYmVyT2ZQYWdlcyAtIDEsIHN0YXJ0ICsgdmlzaWJsZVBhZ2VzIC0gMSk7XG5cbiAgICAgICAgLy9jaGVjayB3aGVuIGFwcHJvYWNoaW5nIHRvIGxhc3QgcGFnZVxuICAgICAgICB2YXIgZGVsdGEgPSB0aGlzLnBhZ2VMaW5rU2l6ZSAtIChlbmQgLSBzdGFydCArIDEpO1xuICAgICAgICBzdGFydCA9IE1hdGgubWF4KDAsIHN0YXJ0IC0gZGVsdGEpO1xuXG4gICAgICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gICAgfVxuXG4gICAgdXBkYXRlUGFnZUxpbmtzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhZ2VMaW5rcyA9IFtdO1xuICAgICAgICBsZXQgYm91bmRhcmllcyA9IHRoaXMuY2FsY3VsYXRlUGFnZUxpbmtCb3VuZGFyaWVzKCksXG4gICAgICAgICAgICBzdGFydCA9IGJvdW5kYXJpZXNbMF0sXG4gICAgICAgICAgICBlbmQgPSBib3VuZGFyaWVzWzFdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wYWdlTGlua3MucHVzaChpICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaG93SnVtcFRvUGFnZURyb3Bkb3duKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VJdGVtcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdldFBhZ2VDb3VudCgpOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VJdGVtcy5wdXNoKHsgbGFiZWw6IFN0cmluZyhpICsgMSksIHZhbHVlOiBpIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZShwOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdmFyIHBjID0gdGhpcy5nZXRQYWdlQ291bnQoKTtcblxuICAgICAgICBpZiAocCA+PSAwICYmIHAgPCBwYykge1xuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLnJvd3MgKiBwO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IHAsXG4gICAgICAgICAgICAgICAgZmlyc3Q6IHRoaXMuZmlyc3QsXG4gICAgICAgICAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudDogcGNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uUGFnZUNoYW5nZS5lbWl0KHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUZpcnN0KCk6IHZvaWQge1xuICAgICAgICBjb25zdCBwYWdlID0gdGhpcy5nZXRQYWdlKCk7XG4gICAgICAgIGlmIChwYWdlID4gMCAmJiB0aGlzLnRvdGFsUmVjb3JkcyAmJiB0aGlzLmZpcnN0ID49IHRoaXMudG90YWxSZWNvcmRzKSB7XG4gICAgICAgICAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLmNoYW5nZVBhZ2UocGFnZSAtIDEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFBhZ2UoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5maXJzdCAvIHRoaXMucm93cyk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZVRvRmlyc3QoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0ZpcnN0UGFnZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UoMCk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb1ByZXYoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlUGFnZSh0aGlzLmdldFBhZ2UoKSAtIDEpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb05leHQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlUGFnZSh0aGlzLmdldFBhZ2UoKSArIDEpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb0xhc3QoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0xhc3RQYWdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZSh0aGlzLmdldFBhZ2VDb3VudCgpIC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uUGFnZUxpbmtDbGljayhldmVudDogRXZlbnQsIHBhZ2U6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgb25ScHBDaGFuZ2UoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hhbmdlUGFnZSh0aGlzLmdldFBhZ2UoKSk7XG4gICAgfVxuXG4gICAgb25QYWdlRHJvcGRvd25DaGFuZ2UoZXZlbnQ6IERyb3Bkb3duQ2hhbmdlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKGV2ZW50LnZhbHVlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVQYWdpbmF0b3JTdGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYWdpbmF0b3JTdGF0ZSA9IHtcbiAgICAgICAgICAgIHBhZ2U6IHRoaXMuZ2V0UGFnZSgpLFxuICAgICAgICAgICAgcGFnZUNvdW50OiB0aGlzLmdldFBhZ2VDb3VudCgpLFxuICAgICAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICAgICAgZmlyc3Q6IHRoaXMuZmlyc3QsXG4gICAgICAgICAgICB0b3RhbFJlY29yZHM6IHRoaXMudG90YWxSZWNvcmRzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhZ2VDb3VudCgpID09PSAwO1xuICAgIH1cblxuICAgIGN1cnJlbnRQYWdlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhZ2VDb3VudCgpID4gMCA/IHRoaXMuZ2V0UGFnZSgpICsgMSA6IDA7XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYWdlUmVwb3J0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlUmVwb3J0VGVtcGxhdGVcbiAgICAgICAgICAgIC5yZXBsYWNlKCd7Y3VycmVudFBhZ2V9JywgU3RyaW5nKHRoaXMuY3VycmVudFBhZ2UoKSkpXG4gICAgICAgICAgICAucmVwbGFjZSgne3RvdGFsUGFnZXN9JywgU3RyaW5nKHRoaXMuZ2V0UGFnZUNvdW50KCkpKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tmaXJzdH0nLCBTdHJpbmcodGhpcy50b3RhbFJlY29yZHMgPiAwID8gdGhpcy5fZmlyc3QgKyAxIDogMCkpXG4gICAgICAgICAgICAucmVwbGFjZSgne2xhc3R9JywgU3RyaW5nKE1hdGgubWluKHRoaXMuX2ZpcnN0ICsgdGhpcy5yb3dzLCB0aGlzLnRvdGFsUmVjb3JkcykpKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tyb3dzfScsIFN0cmluZyh0aGlzLnJvd3MpKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3t0b3RhbFJlY29yZHN9JywgU3RyaW5nKHRoaXMudG90YWxSZWNvcmRzKSk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIERyb3Bkb3duTW9kdWxlLCBJbnB1dE51bWJlck1vZHVsZSwgRm9ybXNNb2R1bGUsIFNoYXJlZE1vZHVsZSwgUmlwcGxlTW9kdWxlLCBBbmdsZURvdWJsZUxlZnRJY29uLCBBbmdsZURvdWJsZVJpZ2h0SWNvbiwgQW5nbGVMZWZ0SWNvbiwgQW5nbGVSaWdodEljb25dLFxuICAgIGV4cG9ydHM6IFtQYWdpbmF0b3IsIERyb3Bkb3duTW9kdWxlLCBJbnB1dE51bWJlck1vZHVsZSwgRm9ybXNNb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbUGFnaW5hdG9yXVxufSlcbmV4cG9ydCBjbGFzcyBQYWdpbmF0b3JNb2R1bGUge31cbiJdfQ==