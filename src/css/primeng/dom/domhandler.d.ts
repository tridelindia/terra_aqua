/**
 * @dynamic is for runtime initializing DomHandler.browser
 *
 * If delete below comment, we can see this error message:
 *  Metadata collected contains an error that will be reported at runtime:
 *  Only initialized variables and constants can be referenced
 *  because the value of this variable is needed by the template compiler.
 */
export declare class DomHandler {
    static zindex: number;
    private static calculatedScrollbarWidth;
    private static calculatedScrollbarHeight;
    private static browser;
    static addClass(element: any, className: string): void;
    static addMultipleClasses(element: any, className: string): void;
    static removeClass(element: any, className: string): void;
    static removeMultipleClasses(element: any, classNames: any): void;
    static hasClass(element: any, className: string): boolean;
    static siblings(element: any): any;
    static find(element: any, selector: string): any[];
    static findSingle(element: any, selector: string): any;
    static index(element: any): number;
    static indexWithinGroup(element: any, attributeName: string): number;
    static appendOverlay(overlay: any, target: any, appendTo?: any): void;
    static alignOverlay(overlay: any, target: any, appendTo?: any, calculateMinWidth?: boolean): void;
    static relativePosition(element: any, target: any, gutter?: boolean): void;
    static absolutePosition(element: any, target: any, gutter?: boolean): void;
    static getParents(element: any, parents?: any): any;
    static getScrollableParents(element: any): any[];
    static getHiddenElementOuterHeight(element: any): number;
    static getHiddenElementOuterWidth(element: any): number;
    static getHiddenElementDimensions(element: any): any;
    static scrollInView(container: any, item: any): void;
    static fadeIn(element: any, duration: number): void;
    static fadeOut(element: any, ms: any): void;
    static getWindowScrollTop(): number;
    static getWindowScrollLeft(): number;
    static matches(element: any, selector: string): boolean;
    static getOuterWidth(el: any, margin?: any): any;
    static getHorizontalPadding(el: any): number;
    static getHorizontalMargin(el: any): number;
    static innerWidth(el: any): any;
    static width(el: any): any;
    static getInnerHeight(el: any): any;
    static getOuterHeight(el: any, margin?: any): any;
    static getHeight(el: HTMLElement): number;
    static getWidth(el: HTMLElement): number;
    static getViewport(): any;
    static getOffset(el: any): {
        top: any;
        left: any;
    };
    static replaceElementWith(element: any, replacementElement: any): any;
    static getUserAgent(): string;
    static isIE(): boolean;
    static isIOS(): boolean;
    static isAndroid(): boolean;
    static isTouchDevice(): boolean;
    static appendChild(element: any, target: any): void;
    static removeChild(element: any, target: any): void;
    static removeElement(element: Element): void;
    static isElement(obj: any): boolean;
    static calculateScrollbarWidth(el?: HTMLElement): number;
    static calculateScrollbarHeight(): number;
    static invokeElementMethod(element: any, methodName: string, args?: any[]): void;
    static clearSelection(): void;
    static getBrowser(): any;
    static resolveUserAgent(): {
        browser: string;
        version: string;
    };
    static isInteger(value: any): boolean;
    static isHidden(element: HTMLElement): boolean;
    static isVisible(element: HTMLElement): boolean;
    static isExist(element: HTMLElement): ParentNode;
    static focus(element: HTMLElement, options?: FocusOptions): void;
    static getFocusableSelectorString(selector?: string): string;
    static getFocusableElements(element: any, selector?: string): any[];
    static getFocusableElement(element: any, selector?: string): any | null;
    static getFirstFocusableElement(element: any, selector?: string): any;
    static getLastFocusableElement(element: any, selector: any): any;
    static getNextFocusableElement(element: HTMLElement, reverse?: boolean): any;
    static generateZIndex(): number;
    static getSelection(): any;
    static getTargetElement(target: any, el?: HTMLElement): any;
    static isClient(): boolean;
    static getAttribute(element: any, name: any): any;
    static calculateBodyScrollbarWidth(): number;
    static blockBodyScroll(className?: string): void;
    static unblockBodyScroll(className?: string): void;
    static createElement(type: any, attributes?: {}, ...children: any[]): any;
    static setAttribute(element: any, attribute: string, value: any): void;
    static setAttributes(element: any, attributes?: {}): void;
    static isFocusableElement(element: any, selector?: string): any;
}
