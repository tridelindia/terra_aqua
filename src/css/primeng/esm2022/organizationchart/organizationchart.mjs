import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Inject, Input, NgModule, Output, ViewEncapsulation, booleanAttribute, forwardRef } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ChevronDownIcon } from 'primeng/icons/chevrondown';
import { ChevronUpIcon } from 'primeng/icons/chevronup';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class OrganizationChartNode {
    cd;
    node;
    root;
    first;
    last;
    collapsible;
    chart;
    subscription;
    constructor(chart, cd) {
        this.cd = cd;
        this.chart = chart;
        this.subscription = this.chart.selectionSource$.subscribe(() => {
            this.cd.markForCheck();
        });
    }
    get leaf() {
        if (this.node) {
            return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
        }
    }
    get colspan() {
        if (this.node) {
            return this.node.children && this.node.children.length ? this.node.children.length * 2 : null;
        }
    }
    onNodeClick(event, node) {
        this.chart.onNodeClick(event, node);
    }
    toggleNode(event, node) {
        node.expanded = !node.expanded;
        if (node.expanded)
            this.chart.onNodeExpand.emit({ originalEvent: event, node: this.node });
        else
            this.chart.onNodeCollapse.emit({ originalEvent: event, node: this.node });
        event.preventDefault();
    }
    isSelected() {
        return this.chart.isSelected(this.node);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartNode, deps: [{ token: forwardRef(() => OrganizationChart) }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: OrganizationChartNode, selector: "[pOrganizationChartNode]", inputs: { node: "node", root: ["root", "root", booleanAttribute], first: ["first", "first", booleanAttribute], last: ["last", "last", booleanAttribute], collapsible: ["collapsible", "collapsible", booleanAttribute] }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <tbody *ngIf="node" [attr.data-pc-section]="'body'">
            <tr [attr.data-pc-section]="'row'">
                <td [attr.colspan]="colspan" [attr.data-pc-section]="'cell'">
                    <div
                        [class]="node.styleClass"
                        [ngClass]="{ 'p-organizationchart-node-content': true, 'p-organizationchart-selectable-node': chart.selectionMode && node.selectable !== false, 'p-highlight': isSelected() }"
                        (click)="onNodeClick($event, node)"
                        [attr.data-pc-section]="'node'"
                    >
                        <div *ngIf="!chart.getTemplateForNode(node)">{{ node.label }}</div>
                        <div *ngIf="chart.getTemplateForNode(node)">
                            <ng-container *ngTemplateOutlet="chart.getTemplateForNode(node); context: { $implicit: node }"></ng-container>
                        </div>
                        <ng-container *ngIf="collapsible">
                            <a *ngIf="!leaf" tabindex="0" class="p-node-toggler" (click)="toggleNode($event, node)" (keydown.enter)="toggleNode($event, node)" (keydown.space)="toggleNode($event, node)" [attr.data-pc-section]="'nodeToggler'">
                                <ng-container *ngIf="!chart.togglerIconTemplate">
                                    <ChevronDownIcon *ngIf="node.expanded" [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                                    <ChevronUpIcon *ngIf="!node.expanded" [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                                </ng-container>
                                <span class="p-node-toggler-icon" *ngIf="chart.togglerIconTemplate" [attr.data-pc-section]="'nodeTogglerIcon'">
                                    <ng-template *ngTemplateOutlet="chart.togglerIconTemplate; context: { $implicit: node.expanded }"></ng-template>
                                </span>
                            </a>
                        </ng-container>
                    </div>
                </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
                <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                    <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
                </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
                <ng-container *ngIf="node.children && node.children.length === 1">
                    <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                        <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
                    </td>
                </ng-container>
                <ng-container *ngIf="node.children && node.children.length > 1">
                    <ng-template ngFor let-child [ngForOf]="node.children" let-first="first" let-last="last">
                        <td [attr.data-pc-section]="'lineLeft'" class="p-organizationchart-line-left" [ngClass]="{ 'p-organizationchart-line-top': !first }">&nbsp;</td>
                        <td [attr.data-pc-section]="'lineRight'" class="p-organizationchart-line-right" [ngClass]="{ 'p-organizationchart-line-top': !last }">&nbsp;</td>
                    </ng-template>
                </ng-container>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-nodes" [@childState]="'in'" [attr.data-pc-section]="'nodes'">
                <td *ngFor="let child of node.children" colspan="2" [attr.data-pc-section]="'nodeCell'">
                    <table class="p-organizationchart-table" pOrganizationChartNode [node]="child" [collapsible]="collapsible && node.children && node.children.length > 0"></table>
                </td>
            </tr>
        </tbody>
    `, isInline: true, styles: ["@layer primeng{.p-organizationchart-table{border-spacing:0;border-collapse:separate;margin:0 auto}.p-organizationchart-table>tbody>tr>td{text-align:center;vertical-align:top;padding:0 .75rem}.p-organizationchart-node-content{display:inline-block;position:relative}.p-organizationchart-node-content .p-node-toggler{position:absolute;bottom:-.75rem;margin-left:-.75rem;z-index:2;left:50%;-webkit-user-select:none;user-select:none;cursor:pointer;width:1.5rem;height:1.5rem}.p-organizationchart-node-content .p-node-toggler .p-node-toggler-icon{position:relative;top:.25rem}.p-organizationchart-line-down{margin:0 auto;height:20px;width:1px}.p-organizationchart-line-right,.p-organizationchart-line-left{border-radius:0}.p-organizationchart-selectable-node{cursor:pointer}.p-organizationchart .p-organizationchart-node-hidden{display:none}.p-organizationchart-preservespace .p-organizationchart-node-hidden{visibility:hidden;display:inherit}}\n"], dependencies: [{ kind: "directive", type: i0.forwardRef(() => i1.NgClass), selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgForOf), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgIf), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i0.forwardRef(() => i1.NgTemplateOutlet), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i0.forwardRef(() => ChevronDownIcon), selector: "ChevronDownIcon" }, { kind: "component", type: i0.forwardRef(() => ChevronUpIcon), selector: "ChevronUpIcon" }, { kind: "component", type: i0.forwardRef(() => OrganizationChartNode), selector: "[pOrganizationChartNode]", inputs: ["node", "root", "first", "last", "collapsible"] }], animations: [trigger('childState', [state('in', style({ opacity: 1 })), transition('void => *', [style({ opacity: 0 }), animate(150)]), transition('* => void', [animate(150, style({ opacity: 0 }))])])], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartNode, decorators: [{
            type: Component,
            args: [{ selector: '[pOrganizationChartNode]', template: `
        <tbody *ngIf="node" [attr.data-pc-section]="'body'">
            <tr [attr.data-pc-section]="'row'">
                <td [attr.colspan]="colspan" [attr.data-pc-section]="'cell'">
                    <div
                        [class]="node.styleClass"
                        [ngClass]="{ 'p-organizationchart-node-content': true, 'p-organizationchart-selectable-node': chart.selectionMode && node.selectable !== false, 'p-highlight': isSelected() }"
                        (click)="onNodeClick($event, node)"
                        [attr.data-pc-section]="'node'"
                    >
                        <div *ngIf="!chart.getTemplateForNode(node)">{{ node.label }}</div>
                        <div *ngIf="chart.getTemplateForNode(node)">
                            <ng-container *ngTemplateOutlet="chart.getTemplateForNode(node); context: { $implicit: node }"></ng-container>
                        </div>
                        <ng-container *ngIf="collapsible">
                            <a *ngIf="!leaf" tabindex="0" class="p-node-toggler" (click)="toggleNode($event, node)" (keydown.enter)="toggleNode($event, node)" (keydown.space)="toggleNode($event, node)" [attr.data-pc-section]="'nodeToggler'">
                                <ng-container *ngIf="!chart.togglerIconTemplate">
                                    <ChevronDownIcon *ngIf="node.expanded" [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                                    <ChevronUpIcon *ngIf="!node.expanded" [styleClass]="'p-node-toggler-icon'" [attr.data-pc-section]="'nodeTogglerIcon'" />
                                </ng-container>
                                <span class="p-node-toggler-icon" *ngIf="chart.togglerIconTemplate" [attr.data-pc-section]="'nodeTogglerIcon'">
                                    <ng-template *ngTemplateOutlet="chart.togglerIconTemplate; context: { $implicit: node.expanded }"></ng-template>
                                </span>
                            </a>
                        </ng-container>
                    </div>
                </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
                <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                    <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
                </td>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-lines" [@childState]="'in'" [attr.data-pc-section]="'lines'">
                <ng-container *ngIf="node.children && node.children.length === 1">
                    <td [attr.data-pc-section]="'lineCell'" [attr.colspan]="colspan">
                        <div [attr.data-pc-section]="'lineDown'" class="p-organizationchart-line-down"></div>
                    </td>
                </ng-container>
                <ng-container *ngIf="node.children && node.children.length > 1">
                    <ng-template ngFor let-child [ngForOf]="node.children" let-first="first" let-last="last">
                        <td [attr.data-pc-section]="'lineLeft'" class="p-organizationchart-line-left" [ngClass]="{ 'p-organizationchart-line-top': !first }">&nbsp;</td>
                        <td [attr.data-pc-section]="'lineRight'" class="p-organizationchart-line-right" [ngClass]="{ 'p-organizationchart-line-top': !last }">&nbsp;</td>
                    </ng-template>
                </ng-container>
            </tr>
            <tr [ngClass]="!leaf && node.expanded ? 'p-organizationchart-node-visible' : 'p-organizationchart-node-hidden'" class="p-organizationchart-nodes" [@childState]="'in'" [attr.data-pc-section]="'nodes'">
                <td *ngFor="let child of node.children" colspan="2" [attr.data-pc-section]="'nodeCell'">
                    <table class="p-organizationchart-table" pOrganizationChartNode [node]="child" [collapsible]="collapsible && node.children && node.children.length > 0"></table>
                </td>
            </tr>
        </tbody>
    `, animations: [trigger('childState', [state('in', style({ opacity: 1 })), transition('void => *', [style({ opacity: 0 }), animate(150)]), transition('* => void', [animate(150, style({ opacity: 0 }))])])], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, host: {
                        class: 'p-element'
                    }, styles: ["@layer primeng{.p-organizationchart-table{border-spacing:0;border-collapse:separate;margin:0 auto}.p-organizationchart-table>tbody>tr>td{text-align:center;vertical-align:top;padding:0 .75rem}.p-organizationchart-node-content{display:inline-block;position:relative}.p-organizationchart-node-content .p-node-toggler{position:absolute;bottom:-.75rem;margin-left:-.75rem;z-index:2;left:50%;-webkit-user-select:none;user-select:none;cursor:pointer;width:1.5rem;height:1.5rem}.p-organizationchart-node-content .p-node-toggler .p-node-toggler-icon{position:relative;top:.25rem}.p-organizationchart-line-down{margin:0 auto;height:20px;width:1px}.p-organizationchart-line-right,.p-organizationchart-line-left{border-radius:0}.p-organizationchart-selectable-node{cursor:pointer}.p-organizationchart .p-organizationchart-node-hidden{display:none}.p-organizationchart-preservespace .p-organizationchart-node-hidden{visibility:hidden;display:inherit}}\n"] }]
        }], ctorParameters: () => [{ type: OrganizationChart, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => OrganizationChart)]
                }] }, { type: i0.ChangeDetectorRef }], propDecorators: { node: [{
                type: Input
            }], root: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], first: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], last: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], collapsible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
/**
 * OrganizationChart visualizes hierarchical organization data.
 * @group Components
 */
export class OrganizationChart {
    el;
    cd;
    /**
     * An array of nested TreeNodes.
     * @group Props
     */
    value;
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
     * Defines the selection mode.
     * @group Props
     */
    selectionMode;
    /**
     * Whether the nodes can be expanded or toggled.
     * @group Props
     */
    collapsible;
    /**
     * Whether the space allocated by a node is preserved when hidden.
     * @group Props
     */
    preserveSpace = true;
    /**
     * A single treenode instance or an array to refer to the selections.
     * @group Props
     */
    get selection() {
        return this._selection;
    }
    set selection(val) {
        this._selection = val;
        if (this.initialized)
            this.selectionSource.next(null);
    }
    /**
     * Callback to invoke on selection change.
     * @param {*} any - selected value.
     * @group Emits
     */
    selectionChange = new EventEmitter();
    /**
     * Callback to invoke when a node is selected.
     * @param {OrganizationChartNodeSelectEvent} event - custom node select event.
     * @group Emits
     */
    onNodeSelect = new EventEmitter();
    /**
     * Callback to invoke when a node is unselected.
     * @param {OrganizationChartNodeUnSelectEvent} event - custom node unselect event.
     * @group Emits
     */
    onNodeUnselect = new EventEmitter();
    /**
     * Callback to invoke when a node is expanded.
     * @param {OrganizationChartNodeExpandEvent} event - custom node expand event.
     * @group Emits
     */
    onNodeExpand = new EventEmitter();
    /**
     * Callback to invoke when a node is collapsed.
     * @param {OrganizationChartNodeCollapseEvent} event - custom node collapse event.
     * @group Emits
     */
    onNodeCollapse = new EventEmitter();
    templates;
    templateMap;
    togglerIconTemplate;
    selectionSource = new Subject();
    _selection;
    initialized;
    selectionSource$ = this.selectionSource.asObservable();
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
    }
    get root() {
        return this.value && this.value.length ? this.value[0] : null;
    }
    ngAfterContentInit() {
        if (this.templates.length) {
            this.templateMap = {};
        }
        this.templates.forEach((item) => {
            if (item.getType() === 'togglericon') {
                this.togglerIconTemplate = item.template;
            }
            else {
                this.templateMap[item.getType()] = item.template;
            }
        });
        this.initialized = true;
    }
    getTemplateForNode(node) {
        if (this.templateMap)
            return node.type ? this.templateMap[node.type] : this.templateMap['default'];
        else
            return null;
    }
    onNodeClick(event, node) {
        let eventTarget = event.target;
        if (eventTarget.className && (DomHandler.hasClass(eventTarget, 'p-node-toggler') || DomHandler.hasClass(eventTarget, 'p-node-toggler-icon'))) {
            return;
        }
        else if (this.selectionMode) {
            if (node.selectable === false) {
                return;
            }
            let index = this.findIndexInSelection(node);
            let selected = index >= 0;
            if (this.selectionMode === 'single') {
                if (selected) {
                    this.selection = null;
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = node;
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            else if (this.selectionMode === 'multiple') {
                if (selected) {
                    this.selection = this.selection.filter((val, i) => i != index);
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = [...(this.selection || []), node];
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            this.selectionChange.emit(this.selection);
            this.selectionSource.next(null);
        }
    }
    findIndexInSelection(node) {
        let index = -1;
        if (this.selectionMode && this.selection) {
            if (this.selectionMode === 'single') {
                index = this.selection == node ? 0 : -1;
            }
            else if (this.selectionMode === 'multiple') {
                for (let i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    }
    isSelected(node) {
        return this.findIndexInSelection(node) != -1;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChart, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.0.1", type: OrganizationChart, selector: "p-organizationChart", inputs: { value: "value", style: "style", styleClass: "styleClass", selectionMode: "selectionMode", collapsible: ["collapsible", "collapsible", booleanAttribute], preserveSpace: ["preserveSpace", "preserveSpace", booleanAttribute], selection: "selection" }, outputs: { selectionChange: "selectionChange", onNodeSelect: "onNodeSelect", onNodeUnselect: "onNodeUnselect", onNodeExpand: "onNodeExpand", onNodeCollapse: "onNodeCollapse" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{ 'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace }" [attr.data-pc-section]="'root'">
            <table class="p-organizationchart-table" [collapsible]="collapsible" pOrganizationChartNode [node]="root" *ngIf="root"></table>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: OrganizationChartNode, selector: "[pOrganizationChartNode]", inputs: ["node", "root", "first", "last", "collapsible"] }], changeDetection: i0.ChangeDetectionStrategy.Default });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChart, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-organizationChart',
                    template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{ 'p-organizationchart p-component': true, 'p-organizationchart-preservespace': preserveSpace }" [attr.data-pc-section]="'root'">
            <table class="p-organizationchart-table" [collapsible]="collapsible" pOrganizationChartNode [node]="root" *ngIf="root"></table>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.Default,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }], propDecorators: { value: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], selectionMode: [{
                type: Input
            }], collapsible: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], preserveSpace: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], selection: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }], onNodeSelect: [{
                type: Output
            }], onNodeUnselect: [{
                type: Output
            }], onNodeExpand: [{
                type: Output
            }], onNodeCollapse: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class OrganizationChartModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartModule, declarations: [OrganizationChart, OrganizationChartNode], imports: [CommonModule, ChevronDownIcon, ChevronUpIcon, SharedModule], exports: [OrganizationChart, SharedModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartModule, imports: [CommonModule, ChevronDownIcon, ChevronUpIcon, SharedModule, SharedModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: OrganizationChartModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ChevronDownIcon, ChevronUpIcon, SharedModule],
                    exports: [OrganizationChart, SharedModule],
                    declarations: [OrganizationChart, OrganizationChartNode]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uY2hhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvb3JnYW5pemF0aW9uY2hhcnQvb3JnYW5pemF0aW9uY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFFBQVEsRUFFUixNQUFNLEVBR04saUJBQWlCLEVBQ2pCLGdCQUFnQixFQUNoQixVQUFVLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQVksTUFBTSxhQUFhLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXhELE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDOzs7QUFpRTdDLE1BQU0sT0FBTyxxQkFBcUI7SUFpQm5CO0lBaEJGLElBQUksQ0FBNEI7SUFFRCxJQUFJLENBQXNCO0lBRTFCLEtBQUssQ0FBc0I7SUFFM0IsSUFBSSxDQUFzQjtJQUUxQixXQUFXLENBQXNCO0lBRXpFLEtBQUssQ0FBb0I7SUFFekIsWUFBWSxDQUFlO0lBRTNCLFlBQ2lELEtBQXdCLEVBQzlELEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBRTVCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBMEIsQ0FB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QXZMdkIsaUJBQWlCLEVBekVqQixxQkFBcUIsYUE0UHBCLFlBQVksRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFlBQVksYUFuTDNELGlCQUFpQixFQW9MRyxZQUFZO3dHQUdoQyx1QkFBdUIsWUFKdEIsWUFBWSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUN2QyxZQUFZOzsyRkFHaEMsdUJBQXVCO2tCQUxuQyxRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDckUsT0FBTyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDO29CQUMxQyxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxxQkFBcUIsQ0FBQztpQkFDM0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT25EZXN0cm95LFxuICAgIE91dHB1dCxcbiAgICBRdWVyeUxpc3QsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgICBmb3J3YXJkUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlLCBUcmVlTm9kZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBDaGV2cm9uRG93bkljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL2NoZXZyb25kb3duJztcbmltcG9ydCB7IENoZXZyb25VcEljb24gfSBmcm9tICdwcmltZW5nL2ljb25zL2NoZXZyb251cCc7XG5pbXBvcnQgeyBOdWxsYWJsZSB9IGZyb20gJ3ByaW1lbmcvdHMtaGVscGVycyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZUNvbGxhcHNlRXZlbnQsIE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZUV4cGFuZEV2ZW50LCBPcmdhbml6YXRpb25DaGFydE5vZGVTZWxlY3RFdmVudCwgT3JnYW5pemF0aW9uQ2hhcnROb2RlVW5TZWxlY3RFdmVudCB9IGZyb20gJy4vb3JnYW5pemF0aW9uY2hhcnQuaW50ZXJmYWNlJztcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnW3BPcmdhbml6YXRpb25DaGFydE5vZGVdJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8dGJvZHkgKm5nSWY9XCJub2RlXCIgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidib2R5J1wiPlxuICAgICAgICAgICAgPHRyIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCIncm93J1wiPlxuICAgICAgICAgICAgICAgIDx0ZCBbYXR0ci5jb2xzcGFuXT1cImNvbHNwYW5cIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2NlbGwnXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJub2RlLnN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1vcmdhbml6YXRpb25jaGFydC1ub2RlLWNvbnRlbnQnOiB0cnVlLCAncC1vcmdhbml6YXRpb25jaGFydC1zZWxlY3RhYmxlLW5vZGUnOiBjaGFydC5zZWxlY3Rpb25Nb2RlICYmIG5vZGUuc2VsZWN0YWJsZSAhPT0gZmFsc2UsICdwLWhpZ2hsaWdodCc6IGlzU2VsZWN0ZWQoKSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbk5vZGVDbGljaygkZXZlbnQsIG5vZGUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbm9kZSdcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiIWNoYXJ0LmdldFRlbXBsYXRlRm9yTm9kZShub2RlKVwiPnt7IG5vZGUubGFiZWwgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJjaGFydC5nZXRUZW1wbGF0ZUZvck5vZGUobm9kZSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY2hhcnQuZ2V0VGVtcGxhdGVGb3JOb2RlKG5vZGUpOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogbm9kZSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2xsYXBzaWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWxlYWZcIiB0YWJpbmRleD1cIjBcIiBjbGFzcz1cInAtbm9kZS10b2dnbGVyXCIgKGNsaWNrKT1cInRvZ2dsZU5vZGUoJGV2ZW50LCBub2RlKVwiIChrZXlkb3duLmVudGVyKT1cInRvZ2dsZU5vZGUoJGV2ZW50LCBub2RlKVwiIChrZXlkb3duLnNwYWNlKT1cInRvZ2dsZU5vZGUoJGV2ZW50LCBub2RlKVwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbm9kZVRvZ2dsZXInXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY2hhcnQudG9nZ2xlckljb25UZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25Eb3duSWNvbiAqbmdJZj1cIm5vZGUuZXhwYW5kZWRcIiBbc3R5bGVDbGFzc109XCIncC1ub2RlLXRvZ2dsZXItaWNvbidcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ25vZGVUb2dnbGVySWNvbidcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENoZXZyb25VcEljb24gKm5nSWY9XCIhbm9kZS5leHBhbmRlZFwiIFtzdHlsZUNsYXNzXT1cIidwLW5vZGUtdG9nZ2xlci1pY29uJ1wiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbm9kZVRvZ2dsZXJJY29uJ1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbm9kZS10b2dnbGVyLWljb25cIiAqbmdJZj1cImNoYXJ0LnRvZ2dsZXJJY29uVGVtcGxhdGVcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ25vZGVUb2dnbGVySWNvbidcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cImNoYXJ0LnRvZ2dsZXJJY29uVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBub2RlLmV4cGFuZGVkIH1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPHRyIFtuZ0NsYXNzXT1cIiFsZWFmICYmIG5vZGUuZXhwYW5kZWQgPyAncC1vcmdhbml6YXRpb25jaGFydC1ub2RlLXZpc2libGUnIDogJ3Atb3JnYW5pemF0aW9uY2hhcnQtbm9kZS1oaWRkZW4nXCIgY2xhc3M9XCJwLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmVzXCIgW0BjaGlsZFN0YXRlXT1cIidpbidcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVzJ1wiPlxuICAgICAgICAgICAgICAgIDx0ZCBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVDZWxsJ1wiIFthdHRyLmNvbHNwYW5dPVwiY29sc3BhblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbGluZURvd24nXCIgY2xhc3M9XCJwLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmUtZG93blwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPHRyIFtuZ0NsYXNzXT1cIiFsZWFmICYmIG5vZGUuZXhwYW5kZWQgPyAncC1vcmdhbml6YXRpb25jaGFydC1ub2RlLXZpc2libGUnIDogJ3Atb3JnYW5pemF0aW9uY2hhcnQtbm9kZS1oaWRkZW4nXCIgY2xhc3M9XCJwLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmVzXCIgW0BjaGlsZFN0YXRlXT1cIidpbidcIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVzJ1wiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAxXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVDZWxsJ1wiIFthdHRyLmNvbHNwYW5dPVwiY29sc3BhblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVEb3duJ1wiIGNsYXNzPVwicC1vcmdhbml6YXRpb25jaGFydC1saW5lLWRvd25cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDFcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1jaGlsZCBbbmdGb3JPZl09XCJub2RlLmNoaWxkcmVuXCIgbGV0LWZpcnN0PVwiZmlyc3RcIiBsZXQtbGFzdD1cImxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ2xpbmVMZWZ0J1wiIGNsYXNzPVwicC1vcmdhbml6YXRpb25jaGFydC1saW5lLWxlZnRcIiBbbmdDbGFzc109XCJ7ICdwLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmUtdG9wJzogIWZpcnN0IH1cIj4mbmJzcDs8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbGluZVJpZ2h0J1wiIGNsYXNzPVwicC1vcmdhbml6YXRpb25jaGFydC1saW5lLXJpZ2h0XCIgW25nQ2xhc3NdPVwieyAncC1vcmdhbml6YXRpb25jaGFydC1saW5lLXRvcCc6ICFsYXN0IH1cIj4mbmJzcDs8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDx0ciBbbmdDbGFzc109XCIhbGVhZiAmJiBub2RlLmV4cGFuZGVkID8gJ3Atb3JnYW5pemF0aW9uY2hhcnQtbm9kZS12aXNpYmxlJyA6ICdwLW9yZ2FuaXphdGlvbmNoYXJ0LW5vZGUtaGlkZGVuJ1wiIGNsYXNzPVwicC1vcmdhbml6YXRpb25jaGFydC1ub2Rlc1wiIFtAY2hpbGRTdGF0ZV09XCInaW4nXCIgW2F0dHIuZGF0YS1wYy1zZWN0aW9uXT1cIidub2RlcydcIj5cbiAgICAgICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW5cIiBjb2xzcGFuPVwiMlwiIFthdHRyLmRhdGEtcGMtc2VjdGlvbl09XCInbm9kZUNlbGwnXCI+XG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInAtb3JnYW5pemF0aW9uY2hhcnQtdGFibGVcIiBwT3JnYW5pemF0aW9uQ2hhcnROb2RlIFtub2RlXT1cImNoaWxkXCIgW2NvbGxhcHNpYmxlXT1cImNvbGxhcHNpYmxlICYmIG5vZGUuY2hpbGRyZW4gJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAwXCI+PC90YWJsZT5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgPC90Ym9keT5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdjaGlsZFN0YXRlJywgW3N0YXRlKCdpbicsIHN0eWxlKHsgb3BhY2l0eTogMSB9KSksIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIFtzdHlsZSh7IG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoMTUwKV0pLCB0cmFuc2l0aW9uKCcqID0+IHZvaWQnLCBbYW5pbWF0ZSgxNTAsIHN0eWxlKHsgb3BhY2l0eTogMCB9KSldKV0pXSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgICBzdHlsZVVybHM6IFsnLi9vcmdhbml6YXRpb25jaGFydC5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgT3JnYW5pemF0aW9uQ2hhcnROb2RlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBub2RlOiBUcmVlTm9kZTxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgQElucHV0KHsgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlIH0pIHJvb3Q6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgZmlyc3Q6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgbGFzdDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjb2xsYXBzaWJsZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAgIGNoYXJ0OiBPcmdhbml6YXRpb25DaGFydDtcblxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPcmdhbml6YXRpb25DaGFydCkpIGNoYXJ0OiBPcmdhbml6YXRpb25DaGFydCxcbiAgICAgICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICAgICkge1xuICAgICAgICB0aGlzLmNoYXJ0ID0gY2hhcnQgYXMgT3JnYW5pemF0aW9uQ2hhcnQ7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5jaGFydC5zZWxlY3Rpb25Tb3VyY2UkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQgbGVhZigpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMubm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5sZWFmID09IGZhbHNlID8gZmFsc2UgOiAhKHRoaXMubm9kZS5jaGlsZHJlbiAmJiB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjb2xzcGFuKCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmNoaWxkcmVuICYmIHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggPyB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoICogMiA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk5vZGVDbGljayhldmVudDogRXZlbnQsIG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIHRoaXMuY2hhcnQub25Ob2RlQ2xpY2soZXZlbnQsIG5vZGUpO1xuICAgIH1cblxuICAgIHRvZ2dsZU5vZGUoZXZlbnQ6IEV2ZW50LCBub2RlOiBUcmVlTm9kZSkge1xuICAgICAgICBub2RlLmV4cGFuZGVkID0gIW5vZGUuZXhwYW5kZWQ7XG4gICAgICAgIGlmIChub2RlLmV4cGFuZGVkKSB0aGlzLmNoYXJ0Lm9uTm9kZUV4cGFuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIG5vZGU6IDxUcmVlTm9kZT50aGlzLm5vZGUgfSk7XG4gICAgICAgIGVsc2UgdGhpcy5jaGFydC5vbk5vZGVDb2xsYXBzZS5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIG5vZGU6IDxUcmVlTm9kZT50aGlzLm5vZGUgfSk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBpc1NlbGVjdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGFydC5pc1NlbGVjdGVkKHRoaXMubm9kZSBhcyBUcmVlTm9kZSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxufVxuLyoqXG4gKiBPcmdhbml6YXRpb25DaGFydCB2aXN1YWxpemVzIGhpZXJhcmNoaWNhbCBvcmdhbml6YXRpb24gZGF0YS5cbiAqIEBncm91cCBDb21wb25lbnRzXG4gKi9cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1vcmdhbml6YXRpb25DaGFydCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nQ2xhc3NdPVwieyAncC1vcmdhbml6YXRpb25jaGFydCBwLWNvbXBvbmVudCc6IHRydWUsICdwLW9yZ2FuaXphdGlvbmNoYXJ0LXByZXNlcnZlc3BhY2UnOiBwcmVzZXJ2ZVNwYWNlIH1cIiBbYXR0ci5kYXRhLXBjLXNlY3Rpb25dPVwiJ3Jvb3QnXCI+XG4gICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJwLW9yZ2FuaXphdGlvbmNoYXJ0LXRhYmxlXCIgW2NvbGxhcHNpYmxlXT1cImNvbGxhcHNpYmxlXCIgcE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZSBbbm9kZV09XCJyb290XCIgKm5nSWY9XCJyb290XCI+PC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIE9yZ2FuaXphdGlvbkNoYXJ0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgbmVzdGVkIFRyZWVOb2Rlcy5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSB2YWx1ZTogVHJlZU5vZGVbXSB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBJbmxpbmUgc3R5bGUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzdHlsZTogeyBba2xhc3M6IHN0cmluZ106IGFueSB9IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBTdHlsZSBjbGFzcyBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHRoZSBzZWxlY3Rpb24gbW9kZS5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoKSBzZWxlY3Rpb25Nb2RlOiAnc2luZ2xlJyB8ICdtdWx0aXBsZScgfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIG5vZGVzIGNhbiBiZSBleHBhbmRlZCBvciB0b2dnbGVkLlxuICAgICAqIEBncm91cCBQcm9wc1xuICAgICAqL1xuICAgIEBJbnB1dCh7IHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZSB9KSBjb2xsYXBzaWJsZTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBzcGFjZSBhbGxvY2F0ZWQgYnkgYSBub2RlIGlzIHByZXNlcnZlZCB3aGVuIGhpZGRlbi5cbiAgICAgKiBAZ3JvdXAgUHJvcHNcbiAgICAgKi9cbiAgICBASW5wdXQoeyB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGUgfSkgcHJlc2VydmVTcGFjZTogYm9vbGVhbiA9IHRydWU7XG4gICAgLyoqXG4gICAgICogQSBzaW5nbGUgdHJlZW5vZGUgaW5zdGFuY2Ugb3IgYW4gYXJyYXkgdG8gcmVmZXIgdG8gdGhlIHNlbGVjdGlvbnMuXG4gICAgICogQGdyb3VwIFByb3BzXG4gICAgICovXG4gICAgQElucHV0KCkgZ2V0IHNlbGVjdGlvbigpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uKHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHZhbDtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkgdGhpcy5zZWxlY3Rpb25Tb3VyY2UubmV4dChudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIG9uIHNlbGVjdGlvbiBjaGFuZ2UuXG4gICAgICogQHBhcmFtIHsqfSBhbnkgLSBzZWxlY3RlZCB2YWx1ZS5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiBhIG5vZGUgaXMgc2VsZWN0ZWQuXG4gICAgICogQHBhcmFtIHtPcmdhbml6YXRpb25DaGFydE5vZGVTZWxlY3RFdmVudH0gZXZlbnQgLSBjdXN0b20gbm9kZSBzZWxlY3QgZXZlbnQuXG4gICAgICogQGdyb3VwIEVtaXRzXG4gICAgICovXG4gICAgQE91dHB1dCgpIG9uTm9kZVNlbGVjdDogRXZlbnRFbWl0dGVyPE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZVNlbGVjdEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8T3JnYW5pemF0aW9uQ2hhcnROb2RlU2VsZWN0RXZlbnQ+KCk7XG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgdG8gaW52b2tlIHdoZW4gYSBub2RlIGlzIHVuc2VsZWN0ZWQuXG4gICAgICogQHBhcmFtIHtPcmdhbml6YXRpb25DaGFydE5vZGVVblNlbGVjdEV2ZW50fSBldmVudCAtIGN1c3RvbSBub2RlIHVuc2VsZWN0IGV2ZW50LlxuICAgICAqIEBncm91cCBFbWl0c1xuICAgICAqL1xuICAgIEBPdXRwdXQoKSBvbk5vZGVVbnNlbGVjdDogRXZlbnRFbWl0dGVyPE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZVVuU2VsZWN0RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxPcmdhbml6YXRpb25DaGFydE5vZGVVblNlbGVjdEV2ZW50PigpO1xuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIHRvIGludm9rZSB3aGVuIGEgbm9kZSBpcyBleHBhbmRlZC5cbiAgICAgKiBAcGFyYW0ge09yZ2FuaXphdGlvbkNoYXJ0Tm9kZUV4cGFuZEV2ZW50fSBldmVudCAtIGN1c3RvbSBub2RlIGV4cGFuZCBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25Ob2RlRXhwYW5kOiBFdmVudEVtaXR0ZXI8T3JnYW5pemF0aW9uQ2hhcnROb2RlRXhwYW5kRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxPcmdhbml6YXRpb25DaGFydE5vZGVFeHBhbmRFdmVudD4oKTtcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0byBpbnZva2Ugd2hlbiBhIG5vZGUgaXMgY29sbGFwc2VkLlxuICAgICAqIEBwYXJhbSB7T3JnYW5pemF0aW9uQ2hhcnROb2RlQ29sbGFwc2VFdmVudH0gZXZlbnQgLSBjdXN0b20gbm9kZSBjb2xsYXBzZSBldmVudC5cbiAgICAgKiBAZ3JvdXAgRW1pdHNcbiAgICAgKi9cbiAgICBAT3V0cHV0KCkgb25Ob2RlQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxPcmdhbml6YXRpb25DaGFydE5vZGVDb2xsYXBzZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8T3JnYW5pemF0aW9uQ2hhcnROb2RlQ29sbGFwc2VFdmVudD4oKTtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBOdWxsYWJsZTxRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4+O1xuXG4gICAgcHVibGljIHRlbXBsYXRlTWFwOiBhbnk7XG5cbiAgICB0b2dnbGVySWNvblRlbXBsYXRlOiBOdWxsYWJsZTxUZW1wbGF0ZVJlZjxhbnk+PjtcblxuICAgIHByaXZhdGUgc2VsZWN0aW9uU291cmNlID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gICAgX3NlbGVjdGlvbjogYW55O1xuXG4gICAgaW5pdGlhbGl6ZWQ6IE51bGxhYmxlPGJvb2xlYW4+O1xuXG4gICAgc2VsZWN0aW9uU291cmNlJCA9IHRoaXMuc2VsZWN0aW9uU291cmNlLmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICAgICAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICAgICkge31cblxuICAgIGdldCByb290KCk6IFRyZWVOb2RlPGFueT4gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggPyB0aGlzLnZhbHVlWzBdIDogbnVsbDtcbiAgICB9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIGlmICgodGhpcy50ZW1wbGF0ZXMgYXMgUXVlcnlMaXN0PFByaW1lVGVtcGxhdGU+KS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVNYXAgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgICh0aGlzLnRlbXBsYXRlcyBhcyBRdWVyeUxpc3Q8UHJpbWVUZW1wbGF0ZT4pLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmdldFR5cGUoKSA9PT0gJ3RvZ2dsZXJpY29uJykge1xuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlckljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGVtcGxhdGVNYXBbaXRlbS5nZXRUeXBlKCldID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0VGVtcGxhdGVGb3JOb2RlKG5vZGU6IFRyZWVOb2RlKTogVGVtcGxhdGVSZWY8YW55PiB8IG51bGwge1xuICAgICAgICBpZiAodGhpcy50ZW1wbGF0ZU1hcCkgcmV0dXJuIG5vZGUudHlwZSA/IHRoaXMudGVtcGxhdGVNYXBbbm9kZS50eXBlXSA6IHRoaXMudGVtcGxhdGVNYXBbJ2RlZmF1bHQnXTtcbiAgICAgICAgZWxzZSByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBvbk5vZGVDbGljayhldmVudDogRXZlbnQsIG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIGxldCBldmVudFRhcmdldCA9IDxFbGVtZW50PmV2ZW50LnRhcmdldDtcblxuICAgICAgICBpZiAoZXZlbnRUYXJnZXQuY2xhc3NOYW1lICYmIChEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50VGFyZ2V0LCAncC1ub2RlLXRvZ2dsZXInKSB8fCBEb21IYW5kbGVyLmhhc0NsYXNzKGV2ZW50VGFyZ2V0LCAncC1ub2RlLXRvZ2dsZXItaWNvbicpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuc2VsZWN0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24obm9kZSk7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSBpbmRleCA+PSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnc2luZ2xlJykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlVW5zZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBub2RlOiBub2RlIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5vZGVTZWxlY3QuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBub2RlOiBub2RlIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKCh2YWw6IGFueSwgaTogbnVtYmVyKSA9PiBpICE9IGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5vZGVVbnNlbGVjdC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIG5vZGU6IG5vZGUgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSBbLi4uKHRoaXMuc2VsZWN0aW9uIHx8IFtdKSwgbm9kZV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlU2VsZWN0LmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgbm9kZTogbm9kZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25Tb3VyY2UubmV4dChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRJbmRleEluU2VsZWN0aW9uKG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSAmJiB0aGlzLnNlbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IHRoaXMuc2VsZWN0aW9uID09IG5vZGUgPyAwIDogLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uW2ldID09IG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIGlzU2VsZWN0ZWQobm9kZTogVHJlZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24obm9kZSkgIT0gLTE7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENoZXZyb25Eb3duSWNvbiwgQ2hldnJvblVwSWNvbiwgU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbT3JnYW5pemF0aW9uQ2hhcnQsIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbT3JnYW5pemF0aW9uQ2hhcnQsIE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZV1cbn0pXG5leHBvcnQgY2xhc3MgT3JnYW5pemF0aW9uQ2hhcnRNb2R1bGUge31cbiJdfQ==