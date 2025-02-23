import { AfterViewInit, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
/**
 * Badge Directive is directive usage of badge component.
 * @group Components
 */
export declare class BadgeDirective implements OnChanges, AfterViewInit {
    private document;
    el: ElementRef;
    private renderer;
    /**
     * When specified, disables the component.
     * @group Props
     */
    disabled: boolean;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize: 'large' | 'xlarge' | undefined;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value: 'large' | 'xlarge');
    get size(): 'large' | 'xlarge';
    _size: 'large' | 'xlarge';
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | null | undefined;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value: string | number;
    /**
     * Inline style of the element.
     * @group Props
     */
    badgeStyle: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Class of the element.
     * @group Props
     */
    badgeStyleClass: string;
    private id;
    badgeEl: HTMLElement;
    private get activeElement();
    private get canUpdateBadge();
    constructor(document: Document, el: ElementRef, renderer: Renderer2);
    ngOnChanges({ value, size, severity, disabled, badgeStyle, badgeStyleClass }: SimpleChanges): void;
    ngAfterViewInit(): void;
    private setValue;
    private setSizeClasses;
    private renderBadgeContent;
    private applyStyles;
    private setSeverity;
    private toggleDisableState;
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BadgeDirective, "[pBadge]", never, { "disabled": { "alias": "badgeDisabled"; "required": false; }; "badgeSize": { "alias": "badgeSize"; "required": false; }; "size": { "alias": "size"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "value": { "alias": "value"; "required": false; }; "badgeStyle": { "alias": "badgeStyle"; "required": false; }; "badgeStyleClass": { "alias": "badgeStyleClass"; "required": false; }; }, {}, never, never, false, never>;
}
/**
 * Badge is a small status indicator for another element.
 * @group Components
 */
export declare class Badge {
    /**
     * Class of the element.
     * @group Props
     */
    styleClass: string | undefined;
    /**
     * Inline style of the element.
     * @group Props
     */
    style: {
        [klass: string]: any;
    } | null | undefined;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     */
    badgeSize: 'large' | 'xlarge' | undefined;
    /**
     * Severity type of the badge.
     * @group Props
     */
    severity: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;
    /**
     * Value to display inside the badge.
     * @group Props
     */
    value: string | number | null | undefined;
    /**
     * When specified, disables the component.
     * @group Props
     */
    badgeDisabled: boolean;
    /**
     * Size of the badge, valid options are "large" and "xlarge".
     * @group Props
     * @deprecated use badgeSize instead.
     */
    set size(value: 'large' | 'xlarge');
    get size(): 'large' | 'xlarge';
    _size: 'large' | 'xlarge';
    containerClass(): {
        [x: string]: boolean | "success" | "info" | "warning" | "danger" | "help" | "primary" | "secondary" | "contrast";
        'p-badge p-component': boolean;
        'p-badge-no-gutter': boolean;
        'p-badge-lg': boolean;
        'p-badge-xl': boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<Badge, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Badge, "p-badge", never, { "styleClass": { "alias": "styleClass"; "required": false; }; "style": { "alias": "style"; "required": false; }; "badgeSize": { "alias": "badgeSize"; "required": false; }; "severity": { "alias": "severity"; "required": false; }; "value": { "alias": "value"; "required": false; }; "badgeDisabled": { "alias": "badgeDisabled"; "required": false; }; "size": { "alias": "size"; "required": false; }; }, {}, never, never, false, never>;
    static ngAcceptInputType_badgeDisabled: unknown;
}
export declare class BadgeModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<BadgeModule, [typeof Badge, typeof BadgeDirective], [typeof i1.CommonModule], [typeof Badge, typeof BadgeDirective, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<BadgeModule>;
}
