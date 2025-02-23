import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { BlockableUI, PrimeNGConfig, ScrollerOptions, TreeDragDropService, TreeNode } from 'primeng/api';
import { Scroller } from 'primeng/scroller';
import { Subscription } from 'rxjs';
import { Nullable } from 'primeng/ts-helpers';
import { TreeFilterEvent, TreeLazyLoadEvent, TreeNodeCollapseEvent, TreeNodeContextMenuSelectEvent, TreeNodeDropEvent, TreeNodeExpandEvent, TreeNodeSelectEvent, TreeNodeUnSelectEvent, TreeScrollEvent, TreeScrollIndexChangeEvent } from './tree.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/scroller";
import * as i5 from "primeng/icons/check";
import * as i6 from "primeng/icons/chevrondown";
import * as i7 from "primeng/icons/chevronright";
import * as i8 from "primeng/icons/minus";
import * as i9 from "primeng/icons/search";
import * as i10 from "primeng/icons/spinner";
import * as i11 from "primeng/icons/plus";
export declare class UITreeNode implements OnInit {
    static ICON_CLASS: string;
    rowNode: any;
    node: TreeNode<any> | undefined;
    parentNode: TreeNode<any> | undefined;
    root: boolean | undefined;
    index: number | undefined;
    firstChild: boolean | undefined;
    lastChild: boolean | undefined;
    level: number | undefined;
    indentation: number | undefined;
    itemSize: number | undefined;
    loadingMode: string;
    tree: Tree;
    timeout: any;
    draghoverPrev: boolean | undefined;
    draghoverNext: boolean | undefined;
    draghoverNode: boolean | undefined;
    get ariaSelected(): boolean;
    get ariaChecked(): boolean;
    constructor(tree: Tree);
    ngOnInit(): void;
    getIcon(): string;
    isLeaf(): boolean;
    toggle(event: Event): void;
    expand(event: Event): void;
    collapse(event: Event): void;
    onNodeClick(event: MouseEvent): void;
    onNodeKeydown(event: KeyboardEvent): void;
    onNodeTouchEnd(): void;
    onNodeRightClick(event: MouseEvent): void;
    isSelected(): boolean;
    isSameNode(event: any): any;
    onDropPoint(event: DragEvent, position: number): void;
    processPointDrop(event: any): void;
    createDropPointEventMetadata(position: number): {
        dragNode: TreeNode<any>;
        dragNodeIndex: number;
        dragNodeSubNodes: TreeNode<any>[];
        dropNode: TreeNode<any>;
        index: number;
        position: number;
    };
    onDropPointDragOver(event: any): void;
    onDropPointDragEnter(event: Event, position: number): void;
    onDropPointDragLeave(event: Event): void;
    onDragStart(event: any): void;
    onDragStop(event: any): void;
    onDropNodeDragOver(event: any): void;
    onDropNode(event: any): void;
    createDropNodeEventMetadata(): {
        dragNode: TreeNode<any>;
        dragNodeIndex: number;
        dragNodeSubNodes: TreeNode<any>[];
        dropNode: TreeNode<any>;
    };
    processNodeDrop(event: any): void;
    onDropNodeDragEnter(event: any): void;
    onDropNodeDragLeave(event: any): void;
    onKeyDown(event: KeyboardEvent): void;
    onArrowUp(event: KeyboardEvent): void;
    onArrowDown(event: KeyboardEvent): void;
    onArrowRight(event: KeyboardEvent): void;
    onArrowLeft(event: KeyboardEvent): boolean;
    isActionableElement(event: any): boolean;
    onEnter(event: KeyboardEvent): void;
    setAllNodesTabIndexes(): void;
    setTabIndexForSelectionMode(event: any, nodeTouched: any): void;
    findNextSiblingOfAncestor(nodeElement: any): any;
    findLastVisibleDescendant(nodeElement: any): any;
    getParentNodeElement(nodeElement: HTMLElement | Element): HTMLElement;
    focusNode(element: any): void;
    focusRowChange(firstFocusableRow: any, currentFocusedRow: any, lastVisibleDescendant?: any): void;
    focusVirtualNode(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UITreeNode, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UITreeNode, "p-treeNode", never, { "rowNode": { "alias": "rowNode"; "required": false; }; "node": { "alias": "node"; "required": false; }; "parentNode": { "alias": "parentNode"; "required": false; }; "root": { "alias": "root"; "required": false; }; "index": { "alias": "index"; "required": false; }; "firstChild": { "alias": "firstChild"; "required": false; }; "lastChild": { "alias": "lastChild"; "required": false; }; "level": { "alias": "level"; "required": false; }; "indentation": { "alias": "indentation"; "required": false; }; "itemSize": { "alias": "itemSize"; "required": false; }; "loadingMode": { "alias": "loadingMode"; "required": false; }; }, {}, never, never, false, never>;
    static ngAcceptInputType_root: unknown;
    static ngAcceptInputType_index: unknown;
    static ngAcceptInputType_firstChild: unknown;
    static ngAcceptInputType_lastChild: unknown;
    static ngAcceptInputType_level: unknown;
    static ngAcceptInputType_indentation: unknown;
    static ngAcceptInputType_itemSize: unknown;
}
/**
 * Tree is used to display hierarchical data.
 * @group Components
 */
export declare class Tree implements OnInit, AfterContentInit, OnChanges, OnDestroy, BlockableUI {
    el: ElementRef;
    dragDropService: TreeDragDropService;
    config: PrimeNGConfig;
    private cd;
    /**
     * An array of treenodes.
     * @group Props
     */
    value: TreeNode<any> | TreeNode<any>[] | any[] | any;
    /**
     * Defines the selection mode.
     * @group Props
     */
    selectionMode: 'single' | 'multiple' | 'checkbox' | null | undefined;
    /**
     * Loading mode display.
     * @group Props
     */
    loadingMode: 'mask' | 'icon';
    /**
     * A single treenode instance or an array to refer to the selections.
     * @group Props
     */
    selection: any;
    /**
     * Inline style of the component.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Style class of the component.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Context menu instance.
     * @group Props
     */
    contextMenu: any;
    /**
     * Defines the orientation of the tree, valid values are 'vertical' and 'horizontal'.
     * @group Props
     */
    layout: string;
    /**
     * Scope of the draggable nodes to match a droppableScope.
     * @group Props
     */
    draggableScope: any;
    /**
     * Scope of the droppable nodes to match a draggableScope.
     * @group Props
     */
    droppableScope: any;
    /**
     * Whether the nodes are draggable.
     * @group Props
     */
    draggableNodes: boolean | undefined;
    /**
     * Whether the nodes are droppable.
     * @group Props
     */
    droppableNodes: boolean | undefined;
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    metaKeySelection: boolean;
    /**
     * Whether checkbox selections propagate to ancestor nodes.
     * @group Props
     */
    propagateSelectionUp: boolean;
    /**
     * Whether checkbox selections propagate to descendant nodes.
     * @group Props
     */
    propagateSelectionDown: boolean;
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    loading: boolean | undefined;
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    loadingIcon: string | undefined;
    /**
     * Text to display when there is no data.
     * @group Props
     */
    emptyMessage: string;
    /**
     * Used to define a string that labels the tree.
     * @group Props
     */
    ariaLabel: string | undefined;
    /**
     * Defines a string that labels the toggler icon for accessibility.
     * @group Props
     */
    togglerAriaLabel: string | undefined;
    /**
     * Establishes relationships between the component and label(s) where its value should be one or more element IDs.
     * @group Props
     */
    ariaLabelledBy: string | undefined;
    /**
     * When enabled, drop can be accepted or rejected based on condition defined at onNodeDrop.
     * @group Props
     */
    validateDrop: boolean | undefined;
    /**
     * When specified, displays an input field to filter the items.
     * @group Props
     */
    filter: boolean | undefined;
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    filterBy: string;
    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    filterMode: string;
    /**
     * Placeholder text to show when filter input is empty.
     * @group Props
     */
    filterPlaceholder: string | undefined;
    /**
     * Values after the tree nodes are filtered.
     * @group Props
     */
    filteredNodes: TreeNode<any>[] | undefined | null;
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    filterLocale: string | undefined;
    /**
     * Height of the scrollable viewport.
     * @group Props
     */
    scrollHeight: string | undefined;
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    lazy: boolean;
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    virtualScroll: boolean | undefined;
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    virtualScrollItemSize: number | undefined;
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    virtualScrollOptions: ScrollerOptions | undefined;
    /**
     * Indentation factor for spacing of the nested node when virtual scrolling is enabled.
     * @group Props
     */
    indentation: number;
    /**
     * Custom templates of the component.
     * @group Props
     */
    _templateMap: any;
    /**
     * Function to optimize the node list rendering, default algorithm checks for object identity.
     * @group Props
     */
    trackBy: Function;
    /**
     * Height of the node.
     * @group Props
     * @deprecated use virtualScrollItemSize property instead.
     */
    _virtualNodeHeight: number | undefined;
    get virtualNodeHeight(): number | undefined;
    set virtualNodeHeight(val: number | undefined);
    /**
     * Callback to invoke on selection change.
     * @param {(TreeNode<any> | TreeNode<any>[] | null)} event - Custom selection change event.
     * @group Emits
     */
    selectionChange: EventEmitter<TreeNode<any> | TreeNode<any>[] | null>;
    /**
     * Callback to invoke when a node is selected.
     * @param {TreeNodeSelectEvent} event - Node select event.
     * @group Emits
     */
    onNodeSelect: EventEmitter<TreeNodeSelectEvent>;
    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeNodeUnSelectEvent} event - Node unselect event.
     * @group Emits
     */
    onNodeUnselect: EventEmitter<TreeNodeUnSelectEvent>;
    /**
     * Callback to invoke when a node is expanded.
     * @param {TreeNodeExpandEvent} event - Node expand event.
     * @group Emits
     */
    onNodeExpand: EventEmitter<TreeNodeExpandEvent>;
    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeNodeCollapseEvent} event - Node collapse event.
     * @group Emits
     */
    onNodeCollapse: EventEmitter<TreeNodeCollapseEvent>;
    /**
     * Callback to invoke when a node is selected with right click.
     * @param {onNodeContextMenuSelect} event - Node context menu select event.
     * @group Emits
     */
    onNodeContextMenuSelect: EventEmitter<TreeNodeContextMenuSelectEvent>;
    /**
     * Callback to invoke when a node is dropped.
     * @param {TreeNodeDropEvent} event - Node drop event.
     * @group Emits
     */
    onNodeDrop: EventEmitter<TreeNodeDropEvent>;
    /**
     * Callback to invoke in lazy mode to load new data.
     * @param {TreeLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    onLazyLoad: EventEmitter<TreeLazyLoadEvent>;
    /**
     * Callback to invoke in virtual scroll mode when scroll position changes.
     * @param {TreeScrollEvent} event - Custom scroll event.
     * @group Emits
     */
    onScroll: EventEmitter<TreeScrollEvent>;
    /**
     * Callback to invoke in virtual scroll mode when scroll position and item's range in view changes.
     * @param {TreeScrollIndexChangeEvent} event - Scroll index change event.
     * @group Emits
     */
    onScrollIndexChange: EventEmitter<TreeScrollIndexChangeEvent>;
    /**
     * Callback to invoke when data is filtered.
     * @param {TreeFilterEvent} event - Custom filter event.
     * @group Emits
     */
    onFilter: EventEmitter<TreeFilterEvent>;
    templates: Nullable<QueryList<any>>;
    filterViewChild: Nullable<ElementRef>;
    scroller: Nullable<Scroller>;
    wrapperViewChild: Nullable<ElementRef>;
    serializedValue: Nullable<TreeNode<any>[]>;
    headerTemplate: Nullable<TemplateRef<any>>;
    footerTemplate: Nullable<TemplateRef<any>>;
    loaderTemplate: Nullable<TemplateRef<any>>;
    emptyMessageTemplate: Nullable<TemplateRef<any>>;
    togglerIconTemplate: Nullable<TemplateRef<any>>;
    checkboxIconTemplate: Nullable<TemplateRef<any>>;
    loadingIconTemplate: Nullable<TemplateRef<any>>;
    filterIconTemplate: Nullable<TemplateRef<any>>;
    nodeTouched: boolean | undefined | null;
    dragNodeTree: Tree | undefined | null;
    dragNode: TreeNode<any> | undefined | null;
    dragNodeSubNodes: TreeNode<any>[] | undefined | null;
    dragNodeIndex: number | undefined | null;
    dragNodeScope: any;
    dragHover: boolean | undefined | null;
    dragStartSubscription: Subscription | undefined | null;
    dragStopSubscription: Subscription | undefined | null;
    constructor(el: ElementRef, dragDropService: TreeDragDropService, config: PrimeNGConfig, cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(simpleChange: SimpleChanges): void;
    get horizontal(): boolean;
    get emptyMessageLabel(): string;
    ngAfterContentInit(): void;
    updateSerializedValue(): void;
    serializeNodes(parent: TreeNode<any> | null, nodes: TreeNode<any>[] | any, level: number, visible: boolean): void;
    onNodeClick(event: Event, node: TreeNode): void;
    onNodeTouchEnd(): void;
    onNodeRightClick(event: MouseEvent, node: TreeNode<any>): void;
    findIndexInSelection(node: TreeNode): any;
    syncNodeOption(node: TreeNode, parentNodes: TreeNode<any>[], option: any, value?: any): void;
    hasFilteredNodes(): number;
    hasFilterActive(): boolean;
    getNodeWithKey(key: string, nodes: TreeNode<any>[]): TreeNode<any> | undefined;
    propagateUp(node: TreeNode, select: boolean): void;
    propagateDown(node: TreeNode, select: boolean): void;
    filterUnselectableChildren(node: TreeNode): TreeNode;
    isSelected(node: TreeNode): boolean;
    isSingleSelectionMode(): boolean;
    isMultipleSelectionMode(): boolean;
    isCheckboxSelectionMode(): boolean;
    isNodeLeaf(node: TreeNode): boolean;
    getRootNode(): any;
    getTemplateForNode(node: TreeNode): TemplateRef<any> | null;
    onDragOver(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    processTreeDrop(dragNode: TreeNode, dragNodeIndex: number): void;
    onDragEnter(): void;
    onDragLeave(event: DragEvent): void;
    allowDrop(dragNode: TreeNode, dropNode: TreeNode<any> | null, dragNodeScope: any, dropPoint?: 'node' | 'between'): boolean;
    isValidDragScope(dragScope: any): boolean;
    _filter(value: string): void;
    /**
     * Resets filter.
     * @group Method
     */
    resetFilter(): void;
    /**
     * Scrolls to virtual index.
     * @param {number} number - Index to be scrolled.
     * @group Method
     */
    scrollToVirtualIndex(index: number): void;
    /**
     * Scrolls to virtual index.
     * @param {ScrollToOptions} options - Scroll options.
     * @group Method
     */
    scrollTo(options: any): void;
    findFilteredNodes(node: TreeNode, paramsWithoutNode: any): boolean;
    isFilterMatched(node: TreeNode, params: any): boolean;
    getIndex(options: any, index: number): any;
    getBlockableElement(): HTMLElement;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Tree, [null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Tree, "p-tree", never, { "value": { "alias": "value"; "required": false; }; "selectionMode": { "alias": "selectionMode"; "required": false; }; "loadingMode": { "alias": "loadingMode"; "required": false; }; "selection": { "alias": "selection"; "required": false; }; "style": { "alias": "style"; "required": false; }; "styleClass": { "alias": "styleClass"; "required": false; }; "contextMenu": { "alias": "contextMenu"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; "draggableScope": { "alias": "draggableScope"; "required": false; }; "droppableScope": { "alias": "droppableScope"; "required": false; }; "draggableNodes": { "alias": "draggableNodes"; "required": false; }; "droppableNodes": { "alias": "droppableNodes"; "required": false; }; "metaKeySelection": { "alias": "metaKeySelection"; "required": false; }; "propagateSelectionUp": { "alias": "propagateSelectionUp"; "required": false; }; "propagateSelectionDown": { "alias": "propagateSelectionDown"; "required": false; }; "loading": { "alias": "loading"; "required": false; }; "loadingIcon": { "alias": "loadingIcon"; "required": false; }; "emptyMessage": { "alias": "emptyMessage"; "required": false; }; "ariaLabel": { "alias": "ariaLabel"; "required": false; }; "togglerAriaLabel": { "alias": "togglerAriaLabel"; "required": false; }; "ariaLabelledBy": { "alias": "ariaLabelledBy"; "required": false; }; "validateDrop": { "alias": "validateDrop"; "required": false; }; "filter": { "alias": "filter"; "required": false; }; "filterBy": { "alias": "filterBy"; "required": false; }; "filterMode": { "alias": "filterMode"; "required": false; }; "filterPlaceholder": { "alias": "filterPlaceholder"; "required": false; }; "filteredNodes": { "alias": "filteredNodes"; "required": false; }; "filterLocale": { "alias": "filterLocale"; "required": false; }; "scrollHeight": { "alias": "scrollHeight"; "required": false; }; "lazy": { "alias": "lazy"; "required": false; }; "virtualScroll": { "alias": "virtualScroll"; "required": false; }; "virtualScrollItemSize": { "alias": "virtualScrollItemSize"; "required": false; }; "virtualScrollOptions": { "alias": "virtualScrollOptions"; "required": false; }; "indentation": { "alias": "indentation"; "required": false; }; "_templateMap": { "alias": "_templateMap"; "required": false; }; "trackBy": { "alias": "trackBy"; "required": false; }; "virtualNodeHeight": { "alias": "virtualNodeHeight"; "required": false; }; }, { "selectionChange": "selectionChange"; "onNodeSelect": "onNodeSelect"; "onNodeUnselect": "onNodeUnselect"; "onNodeExpand": "onNodeExpand"; "onNodeCollapse": "onNodeCollapse"; "onNodeContextMenuSelect": "onNodeContextMenuSelect"; "onNodeDrop": "onNodeDrop"; "onLazyLoad": "onLazyLoad"; "onScroll": "onScroll"; "onScrollIndexChange": "onScrollIndexChange"; "onFilter": "onFilter"; }, ["templates"], never, false, never>;
    static ngAcceptInputType_draggableNodes: unknown;
    static ngAcceptInputType_droppableNodes: unknown;
    static ngAcceptInputType_metaKeySelection: unknown;
    static ngAcceptInputType_propagateSelectionUp: unknown;
    static ngAcceptInputType_propagateSelectionDown: unknown;
    static ngAcceptInputType_loading: unknown;
    static ngAcceptInputType_validateDrop: unknown;
    static ngAcceptInputType_filter: unknown;
    static ngAcceptInputType_lazy: unknown;
    static ngAcceptInputType_virtualScroll: unknown;
    static ngAcceptInputType_virtualScrollItemSize: unknown;
    static ngAcceptInputType_indentation: unknown;
}
export declare class TreeModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TreeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TreeModule, [typeof Tree, typeof UITreeNode], [typeof i1.CommonModule, typeof i2.SharedModule, typeof i3.RippleModule, typeof i4.ScrollerModule, typeof i5.CheckIcon, typeof i6.ChevronDownIcon, typeof i7.ChevronRightIcon, typeof i8.MinusIcon, typeof i9.SearchIcon, typeof i10.SpinnerIcon, typeof i11.PlusIcon], [typeof Tree, typeof i2.SharedModule, typeof i4.ScrollerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TreeModule>;
}
