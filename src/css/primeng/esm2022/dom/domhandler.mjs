/**
 * @dynamic is for runtime initializing DomHandler.browser
 *
 * If delete below comment, we can see this error message:
 *  Metadata collected contains an error that will be reported at runtime:
 *  Only initialized variables and constants can be referenced
 *  because the value of this variable is needed by the template compiler.
 */
// @dynamic
export class DomHandler {
    static zindex = 1000;
    static calculatedScrollbarWidth = null;
    static calculatedScrollbarHeight = null;
    static browser;
    static addClass(element, className) {
        if (element && className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        }
    }
    static addMultipleClasses(element, className) {
        if (element && className) {
            if (element.classList) {
                let styles = className.trim().split(' ');
                for (let i = 0; i < styles.length; i++) {
                    element.classList.add(styles[i]);
                }
            }
            else {
                let styles = className.split(' ');
                for (let i = 0; i < styles.length; i++) {
                    element.className += ' ' + styles[i];
                }
            }
        }
    }
    static removeClass(element, className) {
        if (element && className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    static removeMultipleClasses(element, classNames) {
        if (element && classNames) {
            [classNames]
                .flat()
                .filter(Boolean)
                .forEach((cNames) => cNames.split(' ').forEach((className) => this.removeClass(element, className)));
        }
    }
    static hasClass(element, className) {
        if (element && className) {
            if (element.classList)
                return element.classList.contains(className);
            else
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
        return false;
    }
    static siblings(element) {
        return Array.prototype.filter.call(element.parentNode.children, function (child) {
            return child !== element;
        });
    }
    static find(element, selector) {
        return Array.from(element.querySelectorAll(selector));
    }
    static findSingle(element, selector) {
        return this.isElement(element) ? element.querySelector(selector) : null;
    }
    static index(element) {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static indexWithinGroup(element, attributeName) {
        let children = element.parentNode ? element.parentNode.childNodes : [];
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].attributes && children[i].attributes[attributeName] && children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static appendOverlay(overlay, target, appendTo = 'self') {
        if (appendTo !== 'self' && overlay && target) {
            this.appendChild(overlay, target);
        }
    }
    static alignOverlay(overlay, target, appendTo = 'self', calculateMinWidth = true) {
        if (overlay && target) {
            if (calculateMinWidth) {
                overlay.style.minWidth = `${DomHandler.getOuterWidth(target)}px`;
            }
            if (appendTo === 'self') {
                this.relativePosition(overlay, target);
            }
            else {
                this.absolutePosition(overlay, target);
            }
        }
    }
    static relativePosition(element, target, gutter = true) {
        const getClosestRelativeElement = (el) => {
            if (!el)
                return;
            return getComputedStyle(el).getPropertyValue('position') === 'relative' ? el : getClosestRelativeElement(el.parentElement);
        };
        const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        const targetHeight = target.offsetHeight ?? target.getBoundingClientRect().height;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = this.getWindowScrollTop();
        const windowScrollLeft = this.getWindowScrollLeft();
        const viewport = this.getViewport();
        const relativeElement = getClosestRelativeElement(element);
        const relativeElementOffset = relativeElement?.getBoundingClientRect() || { top: -1 * windowScrollTop, left: -1 * windowScrollLeft };
        let top, left;
        if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
            top = targetOffset.top - relativeElementOffset.top - elementDimensions.height;
            element.style.transformOrigin = 'bottom';
            if (targetOffset.top + top < 0) {
                top = -1 * targetOffset.top;
            }
        }
        else {
            top = targetHeight + targetOffset.top - relativeElementOffset.top;
            element.style.transformOrigin = 'top';
        }
        const horizontalOverflow = targetOffset.left + elementDimensions.width - viewport.width;
        const targetLeftOffsetInSpaceOfRelativeElement = targetOffset.left - relativeElementOffset.left;
        if (elementDimensions.width > viewport.width) {
            // element wider then viewport and cannot fit on screen (align at left side of viewport)
            left = (targetOffset.left - relativeElementOffset.left) * -1;
        }
        else if (horizontalOverflow > 0) {
            // element wider then viewport but can be fit on screen (align at right side of viewport)
            left = targetLeftOffsetInSpaceOfRelativeElement - horizontalOverflow;
        }
        else {
            // element fits on screen (align with target)
            left = targetOffset.left - relativeElementOffset.left;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
        gutter && (element.style.marginTop = origin === 'bottom' ? 'calc(var(--p-anchor-gutter) * -1)' : 'calc(var(--p-anchor-gutter))');
    }
    static absolutePosition(element, target, gutter = true) {
        const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        const elementOuterHeight = elementDimensions.height;
        const elementOuterWidth = elementDimensions.width;
        const targetOuterHeight = target.offsetHeight ?? target.getBoundingClientRect().height;
        const targetOuterWidth = target.offsetWidth ?? target.getBoundingClientRect().width;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = this.getWindowScrollTop();
        const windowScrollLeft = this.getWindowScrollLeft();
        const viewport = this.getViewport();
        let top, left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
            element.style.transformOrigin = 'bottom';
            if (top < 0) {
                top = windowScrollTop;
            }
        }
        else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
            element.style.transformOrigin = 'top';
        }
        if (targetOffset.left + elementOuterWidth > viewport.width)
            left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
        else
            left = targetOffset.left + windowScrollLeft;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
        gutter && (element.style.marginTop = origin === 'bottom' ? 'calc(var(--p-anchor-gutter) * -1)' : 'calc(var(--p-anchor-gutter))');
    }
    static getParents(element, parents = []) {
        return element['parentNode'] === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
    }
    static getScrollableParents(element) {
        let scrollableParents = [];
        if (element) {
            let parents = this.getParents(element);
            const overflowRegex = /(auto|scroll)/;
            const overflowCheck = (node) => {
                let styleDeclaration = window['getComputedStyle'](node, null);
                return overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowX')) || overflowRegex.test(styleDeclaration.getPropertyValue('overflowY'));
            };
            for (let parent of parents) {
                let scrollSelectors = parent.nodeType === 1 && parent.dataset['scrollselectors'];
                if (scrollSelectors) {
                    let selectors = scrollSelectors.split(',');
                    for (let selector of selectors) {
                        let el = this.findSingle(parent, selector);
                        if (el && overflowCheck(el)) {
                            scrollableParents.push(el);
                        }
                    }
                }
                if (parent.nodeType !== 9 && overflowCheck(parent)) {
                    scrollableParents.push(parent);
                }
            }
        }
        return scrollableParents;
    }
    static getHiddenElementOuterHeight(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementHeight;
    }
    static getHiddenElementOuterWidth(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementWidth;
    }
    static getHiddenElementDimensions(element) {
        let dimensions = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    }
    static scrollInView(container, item) {
        let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);
        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if (offset + itemHeight > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }
    static fadeIn(element, duration) {
        element.style.opacity = 0;
        let last = +new Date();
        let opacity = 0;
        let tick = function () {
            opacity = +element.style.opacity.replace(',', '.') + (new Date().getTime() - last) / duration;
            element.style.opacity = opacity;
            last = +new Date();
            if (+opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };
        tick();
    }
    static fadeOut(element, ms) {
        var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
        let fading = setInterval(() => {
            opacity = opacity - gap;
            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
            }
            element.style.opacity = opacity;
        }, interval);
    }
    static getWindowScrollTop() {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
    static getWindowScrollLeft() {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }
    static matches(element, selector) {
        var p = Element.prototype;
        var f = p['matches'] ||
            p.webkitMatchesSelector ||
            p['mozMatchesSelector'] ||
            p['msMatchesSelector'] ||
            function (s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };
        return f.call(element, selector);
    }
    static getOuterWidth(el, margin) {
        let width = el.offsetWidth;
        if (margin) {
            let style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        return width;
    }
    static getHorizontalPadding(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    static getHorizontalMargin(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    static innerWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static width(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static getInnerHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        return height;
    }
    static getOuterHeight(el, margin) {
        let height = el.offsetHeight;
        if (margin) {
            let style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
    }
    static getHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        return height;
    }
    static getWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return width;
    }
    static getViewport() {
        let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    }
    static getOffset(el) {
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
            left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
        };
    }
    static replaceElementWith(element, replacementElement) {
        let parentNode = element.parentNode;
        if (!parentNode)
            throw `Can't replace element`;
        return parentNode.replaceChild(replacementElement, element);
    }
    static getUserAgent() {
        if (navigator && this.isClient()) {
            return navigator.userAgent;
        }
    }
    static isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return true;
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return true;
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return true;
        }
        // other browser
        return false;
    }
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
    }
    static isAndroid() {
        return /(android)/i.test(navigator.userAgent);
    }
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    static appendChild(element, target) {
        if (this.isElement(target))
            target.appendChild(element);
        else if (target && target.el && target.el.nativeElement)
            target.el.nativeElement.appendChild(element);
        else
            throw 'Cannot append ' + target + ' to ' + element;
    }
    static removeChild(element, target) {
        if (this.isElement(target))
            target.removeChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.removeChild(element);
        else
            throw 'Cannot remove ' + element + ' from ' + target;
    }
    static removeElement(element) {
        if (!('remove' in Element.prototype))
            element.parentNode.removeChild(element);
        else
            element.remove();
    }
    static isElement(obj) {
        return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
    static calculateScrollbarWidth(el) {
        if (el) {
            let style = getComputedStyle(el);
            return el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
        }
        else {
            if (this.calculatedScrollbarWidth !== null)
                return this.calculatedScrollbarWidth;
            let scrollDiv = document.createElement('div');
            scrollDiv.className = 'p-scrollbar-measure';
            document.body.appendChild(scrollDiv);
            let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            this.calculatedScrollbarWidth = scrollbarWidth;
            return scrollbarWidth;
        }
    }
    static calculateScrollbarHeight() {
        if (this.calculatedScrollbarHeight !== null)
            return this.calculatedScrollbarHeight;
        let scrollDiv = document.createElement('div');
        scrollDiv.className = 'p-scrollbar-measure';
        document.body.appendChild(scrollDiv);
        let scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
        document.body.removeChild(scrollDiv);
        this.calculatedScrollbarWidth = scrollbarHeight;
        return scrollbarHeight;
    }
    static invokeElementMethod(element, methodName, args) {
        element[methodName].apply(element, args);
    }
    static clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
                window.getSelection().removeAllRanges();
            }
        }
        else if (document['selection'] && document['selection'].empty) {
            try {
                document['selection'].empty();
            }
            catch (error) {
                //ignore IE bug
            }
        }
    }
    static getBrowser() {
        if (!this.browser) {
            let matched = this.resolveUserAgent();
            this.browser = {};
            if (matched.browser) {
                this.browser[matched.browser] = true;
                this.browser['version'] = matched.version;
            }
            if (this.browser['chrome']) {
                this.browser['webkit'] = true;
            }
            else if (this.browser['webkit']) {
                this.browser['safari'] = true;
            }
        }
        return this.browser;
    }
    static resolveUserAgent() {
        let ua = navigator.userAgent.toLowerCase();
        let match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) || [];
        return {
            browser: match[1] || '',
            version: match[2] || '0'
        };
    }
    static isInteger(value) {
        if (Number.isInteger) {
            return Number.isInteger(value);
        }
        else {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        }
    }
    static isHidden(element) {
        return !element || element.offsetParent === null;
    }
    static isVisible(element) {
        return element && element.offsetParent != null;
    }
    static isExist(element) {
        return element !== null && typeof element !== 'undefined' && element.nodeName && element.parentNode;
    }
    static focus(element, options) {
        element && document.activeElement !== element && element.focus(options);
    }
    static getFocusableSelectorString(selector = '') {
        return `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`;
    }
    static getFocusableElements(element, selector = '') {
        let focusableElements = this.find(element, this.getFocusableSelectorString(selector));
        let visibleFocusableElements = [];
        for (let focusableElement of focusableElements) {
            const computedStyle = getComputedStyle(focusableElement);
            if (this.isVisible(focusableElement) && computedStyle.display != 'none' && computedStyle.visibility != 'hidden')
                visibleFocusableElements.push(focusableElement);
        }
        return visibleFocusableElements;
    }
    static getFocusableElement(element, selector = '') {
        let focusableElement = this.findSingle(element, this.getFocusableSelectorString(selector));
        if (focusableElement) {
            const computedStyle = getComputedStyle(focusableElement);
            if (this.isVisible(focusableElement) && computedStyle.display != 'none' && computedStyle.visibility != 'hidden')
                return focusableElement;
        }
        return null;
    }
    static getFirstFocusableElement(element, selector = '') {
        const focusableElements = this.getFocusableElements(element, selector);
        return focusableElements.length > 0 ? focusableElements[0] : null;
    }
    static getLastFocusableElement(element, selector) {
        const focusableElements = this.getFocusableElements(element, selector);
        return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
    }
    static getNextFocusableElement(element, reverse = false) {
        const focusableElements = DomHandler.getFocusableElements(element);
        let index = 0;
        if (focusableElements && focusableElements.length > 0) {
            const focusedIndex = focusableElements.indexOf(focusableElements[0].ownerDocument.activeElement);
            if (reverse) {
                if (focusedIndex == -1 || focusedIndex === 0) {
                    index = focusableElements.length - 1;
                }
                else {
                    index = focusedIndex - 1;
                }
            }
            else if (focusedIndex != -1 && focusedIndex !== focusableElements.length - 1) {
                index = focusedIndex + 1;
            }
        }
        return focusableElements[index];
    }
    static generateZIndex() {
        this.zindex = this.zindex || 999;
        return ++this.zindex;
    }
    static getSelection() {
        if (window.getSelection)
            return window.getSelection().toString();
        else if (document.getSelection)
            return document.getSelection().toString();
        else if (document['selection'])
            return document['selection'].createRange().text;
        return null;
    }
    static getTargetElement(target, el) {
        if (!target)
            return null;
        switch (target) {
            case 'document':
                return document;
            case 'window':
                return window;
            case '@next':
                return el?.nextElementSibling;
            case '@prev':
                return el?.previousElementSibling;
            case '@parent':
                return el?.parentElement;
            case '@grandparent':
                return el?.parentElement.parentElement;
            default:
                const type = typeof target;
                if (type === 'string') {
                    return document.querySelector(target);
                }
                else if (type === 'object' && target.hasOwnProperty('nativeElement')) {
                    return this.isExist(target.nativeElement) ? target.nativeElement : undefined;
                }
                const isFunction = (obj) => !!(obj && obj.constructor && obj.call && obj.apply);
                const element = isFunction(target) ? target() : target;
                return (element && element.nodeType === 9) || this.isExist(element) ? element : null;
        }
    }
    static isClient() {
        return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    }
    static getAttribute(element, name) {
        if (element) {
            const value = element.getAttribute(name);
            if (!isNaN(value)) {
                return +value;
            }
            if (value === 'true' || value === 'false') {
                return value === 'true';
            }
            return value;
        }
        return undefined;
    }
    static calculateBodyScrollbarWidth() {
        return window.innerWidth - document.documentElement.offsetWidth;
    }
    static blockBodyScroll(className = 'p-overflow-hidden') {
        document.body.style.setProperty('--scrollbar-width', this.calculateBodyScrollbarWidth() + 'px');
        this.addClass(document.body, className);
    }
    static unblockBodyScroll(className = 'p-overflow-hidden') {
        document.body.style.removeProperty('--scrollbar-width');
        this.removeClass(document.body, className);
    }
    static createElement(type, attributes = {}, ...children) {
        if (type) {
            const element = document.createElement(type);
            this.setAttributes(element, attributes);
            element.append(...children);
            return element;
        }
        return undefined;
    }
    static setAttribute(element, attribute = '', value) {
        if (this.isElement(element) && value !== null && value !== undefined) {
            element.setAttribute(attribute, value);
        }
    }
    static setAttributes(element, attributes = {}) {
        if (this.isElement(element)) {
            const computedStyles = (rule, value) => {
                const styles = element?.$attrs?.[rule] ? [element?.$attrs?.[rule]] : [];
                return [value].flat().reduce((cv, v) => {
                    if (v !== null && v !== undefined) {
                        const type = typeof v;
                        if (type === 'string' || type === 'number') {
                            cv.push(v);
                        }
                        else if (type === 'object') {
                            const _cv = Array.isArray(v)
                                ? computedStyles(rule, v)
                                : Object.entries(v).map(([_k, _v]) => (rule === 'style' && (!!_v || _v === 0) ? `${_k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${_v}` : !!_v ? _k : undefined));
                            cv = _cv.length ? cv.concat(_cv.filter((c) => !!c)) : cv;
                        }
                    }
                    return cv;
                }, styles);
            };
            Object.entries(attributes).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    const matchedEvent = key.match(/^on(.+)/);
                    if (matchedEvent) {
                        element.addEventListener(matchedEvent[1].toLowerCase(), value);
                    }
                    else if (key === 'pBind') {
                        this.setAttributes(element, value);
                    }
                    else {
                        value = key === 'class' ? [...new Set(computedStyles('class', value))].join(' ').trim() : key === 'style' ? computedStyles('style', value).join(';').trim() : value;
                        (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
                        element.setAttribute(key, value);
                    }
                }
            });
        }
    }
    static isFocusableElement(element, selector = '') {
        return this.isElement(element)
            ? element.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${selector}`)
            : false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9kb20vZG9taGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsV0FBVztBQUNYLE1BQU0sT0FBTyxVQUFVO0lBQ1osTUFBTSxDQUFDLE1BQU0sR0FBVyxJQUFJLENBQUM7SUFFNUIsTUFBTSxDQUFDLHdCQUF3QixHQUFXLElBQUksQ0FBQztJQUUvQyxNQUFNLENBQUMseUJBQXlCLEdBQVcsSUFBSSxDQUFDO0lBRWhELE1BQU0sQ0FBQyxPQUFPLENBQU07SUFFckIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7UUFDbEQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsU0FBUztnQkFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7Z0JBQ25ELE9BQU8sQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7UUFDNUQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3BCLElBQUksTUFBTSxHQUFhLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO1lBQ0wsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksTUFBTSxHQUFhLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3JDLE9BQU8sQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBWSxFQUFFLFNBQWlCO1FBQ3JELElBQUksT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksT0FBTyxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7O2dCQUN0RCxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEksQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMscUJBQXFCLENBQUMsT0FBTyxFQUFFLFVBQVU7UUFDbkQsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxVQUFVLENBQUM7aUJBQ1AsSUFBSSxFQUFFO2lCQUNOLE1BQU0sQ0FBQyxPQUFPLENBQUM7aUJBQ2YsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLENBQUM7SUFDTCxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7UUFDbEQsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFLENBQUM7WUFDdkIsSUFBSSxPQUFPLENBQUMsU0FBUztnQkFBRSxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztnQkFDL0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hGLENBQUM7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFZO1FBQy9CLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsS0FBSztZQUMzRSxPQUFPLEtBQUssS0FBSyxPQUFPLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFZLEVBQUUsUUFBZ0I7UUFDN0MsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQVksRUFBRSxRQUFnQjtRQUNuRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUM1RSxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFZO1FBQzVCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO1FBQzdDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdkMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTztnQkFBRSxPQUFPLEdBQUcsQ0FBQztZQUN2QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQztnQkFBRSxHQUFHLEVBQUUsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBWSxFQUFFLGFBQXFCO1FBQzlELElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdkUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPO2dCQUFFLE9BQU8sR0FBRyxDQUFDO1lBQ3ZDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQztnQkFBRSxHQUFHLEVBQUUsQ0FBQztRQUM1RyxDQUFDO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQVksRUFBRSxNQUFXLEVBQUUsV0FBZ0IsTUFBTTtRQUN6RSxJQUFJLFFBQVEsS0FBSyxNQUFNLElBQUksT0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDTCxDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFZLEVBQUUsTUFBVyxFQUFFLFdBQWdCLE1BQU0sRUFBRSxvQkFBNkIsSUFBSTtRQUMzRyxJQUFJLE9BQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNwQixJQUFJLGlCQUFpQixFQUFFLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3JFLENBQUM7WUFFRCxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxDQUFDO2lCQUFNLENBQUM7Z0JBQ0osSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE1BQVcsRUFBRSxTQUFrQixJQUFJO1FBQzVFLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsRUFBRTtnQkFBRSxPQUFPO1lBRWhCLE9BQU8sZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMvSCxDQUFDLENBQUM7UUFFRixNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pKLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ2xGLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2xELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNELE1BQU0scUJBQXFCLEdBQUcsZUFBZSxFQUFFLHFCQUFxQixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3JJLElBQUksR0FBVyxFQUFFLElBQVksQ0FBQztRQUU5QixJQUFJLFlBQVksQ0FBQyxHQUFHLEdBQUcsWUFBWSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDL0UsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUMsR0FBRyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztZQUM5RSxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7WUFDekMsSUFBSSxZQUFZLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUM7YUFBTSxDQUFDO1lBQ0osR0FBRyxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsR0FBRyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQztZQUNsRSxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDMUMsQ0FBQztRQUVELE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUN4RixNQUFNLHdDQUF3QyxHQUFHLFlBQVksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDO1FBQ2hHLElBQUksaUJBQWlCLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQyx3RkFBd0Y7WUFDeEYsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDO2FBQU0sSUFBSSxrQkFBa0IsR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoQyx5RkFBeUY7WUFDekYsSUFBSSxHQUFHLHdDQUF3QyxHQUFHLGtCQUFrQixDQUFDO1FBQ3pFLENBQUM7YUFBTSxDQUFDO1lBQ0osNkNBQTZDO1lBQzdDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQztRQUMxRCxDQUFDO1FBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3JJLENBQUM7SUFFTSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBWSxFQUFFLE1BQVcsRUFBRSxTQUFrQixJQUFJO1FBQzVFLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekosTUFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7UUFDcEQsTUFBTSxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7UUFDbEQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUN2RixNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3BGLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3BELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ2xELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDcEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksR0FBVyxFQUFFLElBQVksQ0FBQztRQUU5QixJQUFJLFlBQVksQ0FBQyxHQUFHLEdBQUcsaUJBQWlCLEdBQUcsa0JBQWtCLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlFLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxHQUFHLGVBQWUsR0FBRyxrQkFBa0IsQ0FBQztZQUM5RCxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7WUFFekMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxHQUFHLGVBQWUsQ0FBQztZQUMxQixDQUFDO1FBQ0wsQ0FBQzthQUFNLENBQUM7WUFDSixHQUFHLEdBQUcsaUJBQWlCLEdBQUcsWUFBWSxDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUM7WUFDN0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzFDLENBQUM7UUFFRCxJQUFJLFlBQVksQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLEtBQUs7WUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksR0FBRyxnQkFBZ0IsR0FBRyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDOztZQUN2SixJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztRQUVqRCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDckksQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBWSxFQUFFLFVBQWUsRUFBRTtRQUM3QyxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hJLENBQUM7SUFFRCxNQUFNLENBQUMsb0JBQW9CLENBQUMsT0FBWTtRQUNwQyxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUUzQixJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1YsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN2QyxNQUFNLGFBQWEsR0FBRyxlQUFlLENBQUM7WUFDdEMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtnQkFDaEMsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlELE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDek4sQ0FBQyxDQUFDO1lBRUYsS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNqRixJQUFJLGVBQWUsRUFBRSxDQUFDO29CQUNsQixJQUFJLFNBQVMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRSxDQUFDO3dCQUM3QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDM0MsSUFBSSxFQUFFLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7NEJBQzFCLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDL0IsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztvQkFDakQsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxPQUFPLGlCQUFpQixDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNLENBQUMsMkJBQTJCLENBQUMsT0FBWTtRQUNsRCxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ2hDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUVyQyxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRU0sTUFBTSxDQUFDLDBCQUEwQixDQUFDLE9BQVk7UUFDakQsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUNoQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFFckMsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVNLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxPQUFZO1FBQ2pELElBQUksVUFBVSxHQUFRLEVBQUUsQ0FBQztRQUN6QixPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ2hDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN2QyxVQUFVLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDekMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUVyQyxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSTtRQUN0QyxJQUFJLGNBQWMsR0FBVyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVGLElBQUksU0FBUyxHQUFXLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxlQUFlLEdBQVcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekYsSUFBSSxVQUFVLEdBQVcsZUFBZSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDN0gsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDO1FBQzNDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFM0MsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDYixTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUMsQ0FBQzthQUFNLElBQUksTUFBTSxHQUFHLFVBQVUsR0FBRyxhQUFhLEVBQUUsQ0FBQztZQUM3QyxTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsYUFBYSxHQUFHLFVBQVUsQ0FBQztRQUN2RSxDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQWdCO1FBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUUxQixJQUFJLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksSUFBSSxHQUFHO1lBQ1AsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQzlGLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNoQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBRW5CLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsQ0FBQyxNQUFNLENBQUMscUJBQXFCLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFGLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLElBQUksT0FBTyxHQUFHLENBQUMsRUFDWCxRQUFRLEdBQUcsRUFBRSxFQUNiLFFBQVEsR0FBRyxFQUFFLEVBQ2IsR0FBRyxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFOUIsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUMxQixPQUFPLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUV4QixJQUFJLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDZixPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBRUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3BDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLGtCQUFrQjtRQUM1QixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO1FBQ25DLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxtQkFBbUI7UUFDN0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUNuQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFnQjtRQUMzQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUNELENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDWixDQUFDLENBQUMscUJBQXFCO1lBQ3ZCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztZQUN2QixDQUFDLENBQUMsbUJBQW1CLENBQUM7WUFDdEIsVUFBVSxDQUFDO2dCQUNQLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLENBQUMsQ0FBQztRQUNOLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLE1BQU87UUFDbkMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztRQUUzQixJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1QsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1FBQ2pDLElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFTSxNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUNoQyxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDM0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDM0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN4RSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1FBQzNCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6RSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsTUFBTztRQUNwQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBRTdCLElBQUksTUFBTSxFQUFFLENBQUM7WUFDVCxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQyxNQUFNLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFlO1FBQ25DLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDN0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVsSixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFlO1FBQ2xDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7UUFDM0IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFakMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVqSixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sTUFBTSxDQUFDLFdBQVc7UUFDckIsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUNaLENBQUMsR0FBRyxRQUFRLEVBQ1osQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQ3JCLENBQUMsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFDcEQsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDO1FBRTVELE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3RCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBRXRDLE9BQU87WUFDSCxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO1lBQzFHLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7U0FDakgsQ0FBQztJQUNOLENBQUM7SUFFTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBWSxFQUFFLGtCQUF1QjtRQUNsRSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxVQUFVO1lBQUUsTUFBTSx1QkFBdUIsQ0FBQztRQUMvQyxPQUFPLFVBQVUsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZO1FBQ3RCLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQy9CLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFJO1FBQ2QsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7UUFFcEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNYLDBDQUEwQztZQUMxQyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyQyxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNkLGlDQUFpQztZQUNqQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ1gseUNBQXlDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxnQkFBZ0I7UUFDaEIsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLO1FBQ2YsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUztRQUNuQixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYTtRQUN2QixPQUFPLGNBQWMsSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBWSxFQUFFLE1BQVc7UUFDL0MsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWE7WUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7O1lBQ2pHLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFDNUQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBWSxFQUFFLE1BQVc7UUFDL0MsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkQsSUFBSSxNQUFNLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYTtZQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7WUFDdkYsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztJQUM5RCxDQUFDO0lBRU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFnQjtRQUN4QyxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUN6RSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBUTtRQUM1QixPQUFPLE9BQU8sV0FBVyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7SUFDbkwsQ0FBQztJQUVNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxFQUFnQjtRQUNsRCxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ0wsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsT0FBTyxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDcEgsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLElBQUksQ0FBQyx3QkFBd0IsS0FBSyxJQUFJO2dCQUFFLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDO1lBRWpGLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztZQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVyQyxJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFDbkUsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFckMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLGNBQWMsQ0FBQztZQUUvQyxPQUFPLGNBQWMsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyx3QkFBd0I7UUFDbEMsSUFBSSxJQUFJLENBQUMseUJBQXlCLEtBQUssSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDO1FBRW5GLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztRQUM1QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVyQyxJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7UUFDdEUsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLGVBQWUsQ0FBQztRQUVoRCxPQUFPLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQVksRUFBRSxVQUFrQixFQUFFLElBQVk7UUFDM0UsT0FBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxjQUFjO1FBQ3hCLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3RCLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM5QixNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEMsQ0FBQztpQkFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzFKLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUM1QyxDQUFDO1FBQ0wsQ0FBQzthQUFNLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5RCxJQUFJLENBQUM7Z0JBQ0QsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xDLENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLGVBQWU7WUFDbkIsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVU7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUVsQixJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDOUMsQ0FBQztZQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQyxDQUFDO2lCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU0sTUFBTSxDQUFDLGdCQUFnQjtRQUMxQixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUNMLHVCQUF1QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksb0NBQW9DLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLCtCQUErQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU1TyxPQUFPO1lBQ0gsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRztTQUMzQixDQUFDO0lBQ04sQ0FBQztJQUVNLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSztRQUN6QixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUM7UUFDdkYsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQW9CO1FBQ3ZDLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBb0I7UUFDeEMsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7SUFDbkQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBb0I7UUFDdEMsT0FBTyxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDeEcsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBb0IsRUFBRSxPQUFzQjtRQUM1RCxPQUFPLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRU0sTUFBTSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsR0FBRyxFQUFFO1FBQ2xELE9BQU8sMkZBQTJGLFFBQVE7NkhBQ1csUUFBUTtpR0FDcEMsUUFBUTtrR0FDUCxRQUFRO29HQUNOLFFBQVE7c0dBQ04sUUFBUTs2R0FDRCxRQUFRO3dHQUNiLFFBQVE7cUdBQ1gsUUFBUSxFQUFFLENBQUM7SUFDNUcsQ0FBQztJQUVNLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxHQUFHLEVBQUU7UUFDckQsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUV0RixJQUFJLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUVsQyxLQUFLLElBQUksZ0JBQWdCLElBQUksaUJBQWlCLEVBQUUsQ0FBQztZQUM3QyxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxPQUFPLElBQUksTUFBTSxJQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksUUFBUTtnQkFBRSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNySyxDQUFDO1FBRUQsT0FBTyx3QkFBd0IsQ0FBQztJQUNwQyxDQUFDO0lBRU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxRQUFRLEdBQUcsRUFBRTtRQUNwRCxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQixNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxPQUFPLElBQUksTUFBTSxJQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksUUFBUTtnQkFBRSxPQUFPLGdCQUFnQixDQUFDO1FBQzdJLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxRQUFRLEdBQUcsRUFBRTtRQUN6RCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdkUsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RFLENBQUM7SUFFTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsT0FBTyxFQUFFLFFBQVE7UUFDbkQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXZFLE9BQU8saUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDakcsQ0FBQztJQUVNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxPQUFvQixFQUFFLE9BQU8sR0FBRyxLQUFLO1FBQ3ZFLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksaUJBQWlCLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3BELE1BQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakcsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDVixJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQzNDLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO3FCQUFNLENBQUM7b0JBQ0osS0FBSyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDO2lCQUFNLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksS0FBSyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzdFLEtBQUssR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNqQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRU0sTUFBTSxDQUFDLFlBQVk7UUFDdEIsSUFBSSxNQUFNLENBQUMsWUFBWTtZQUFFLE9BQU8sTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQzVELElBQUksUUFBUSxDQUFDLFlBQVk7WUFBRSxPQUFPLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNyRSxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFBRSxPQUFPLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFFaEYsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFXLEVBQUUsRUFBZ0I7UUFDeEQsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLElBQUksQ0FBQztRQUV6QixRQUFRLE1BQU0sRUFBRSxDQUFDO1lBQ2IsS0FBSyxVQUFVO2dCQUNYLE9BQU8sUUFBUSxDQUFDO1lBQ3BCLEtBQUssUUFBUTtnQkFDVCxPQUFPLE1BQU0sQ0FBQztZQUNsQixLQUFLLE9BQU87Z0JBQ1IsT0FBTyxFQUFFLEVBQUUsa0JBQWtCLENBQUM7WUFDbEMsS0FBSyxPQUFPO2dCQUNSLE9BQU8sRUFBRSxFQUFFLHNCQUFzQixDQUFDO1lBQ3RDLEtBQUssU0FBUztnQkFDVixPQUFPLEVBQUUsRUFBRSxhQUFhLENBQUM7WUFDN0IsS0FBSyxjQUFjO2dCQUNmLE9BQU8sRUFBRSxFQUFFLGFBQWEsQ0FBQyxhQUFhLENBQUM7WUFDM0M7Z0JBQ0ksTUFBTSxJQUFJLEdBQUcsT0FBTyxNQUFNLENBQUM7Z0JBRTNCLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDO29CQUNwQixPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLENBQUM7cUJBQU0sSUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztvQkFDckUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNqRixDQUFDO2dCQUVELE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckYsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUV2RCxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDN0YsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUTtRQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUk7UUFDcEMsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2xCLENBQUM7WUFFRCxJQUFJLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRSxDQUFDO2dCQUN4QyxPQUFPLEtBQUssS0FBSyxNQUFNLENBQUM7WUFDNUIsQ0FBQztZQUVELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRU0sTUFBTSxDQUFDLDJCQUEyQjtRQUNyQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7SUFDcEUsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLG1CQUFtQjtRQUN6RCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTSxNQUFNLENBQUMsaUJBQWlCLENBQUMsU0FBUyxHQUFHLG1CQUFtQjtRQUMzRCxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsR0FBRyxRQUFRO1FBQzFELElBQUksSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTdDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztZQUU1QixPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO1FBRUQsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsR0FBRyxFQUFFLEVBQUUsS0FBSztRQUNyRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDbkUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUcsRUFBRTtRQUNoRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUMxQixNQUFNLGNBQWMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDbkMsTUFBTSxNQUFNLEdBQUcsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBRXhFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7d0JBQ2hDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO3dCQUV0QixJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRSxDQUFDOzRCQUN6QyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNmLENBQUM7NkJBQU0sSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7NEJBQzNCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dDQUN4QixDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0NBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7NEJBRTlLLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBQzdELENBQUM7b0JBQ0wsQ0FBQztvQkFFRCxPQUFPLEVBQUUsQ0FBQztnQkFDZCxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDZixDQUFDLENBQUM7WUFFRixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBRTFDLElBQUksWUFBWSxFQUFFLENBQUM7d0JBQ2YsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDbkUsQ0FBQzt5QkFBTSxJQUFJLEdBQUcsS0FBSyxPQUFPLEVBQUUsQ0FBQzt3QkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7eUJBQU0sQ0FBQzt3QkFDSixLQUFLLEdBQUcsR0FBRyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3QkFDcEssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO3dCQUN6RSxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDckMsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxHQUFHLEVBQUU7UUFDbkQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUMxQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQywyRkFBMkYsUUFBUTtxSUFDSSxRQUFRO3lHQUNwQyxRQUFROzBHQUNQLFFBQVE7NEdBQ04sUUFBUTs4R0FDTixRQUFRO3FIQUNELFFBQVEsRUFBRSxDQUFDO1lBQ3BILENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGR5bmFtaWMgaXMgZm9yIHJ1bnRpbWUgaW5pdGlhbGl6aW5nIERvbUhhbmRsZXIuYnJvd3NlclxuICpcbiAqIElmIGRlbGV0ZSBiZWxvdyBjb21tZW50LCB3ZSBjYW4gc2VlIHRoaXMgZXJyb3IgbWVzc2FnZTpcbiAqICBNZXRhZGF0YSBjb2xsZWN0ZWQgY29udGFpbnMgYW4gZXJyb3IgdGhhdCB3aWxsIGJlIHJlcG9ydGVkIGF0IHJ1bnRpbWU6XG4gKiAgT25seSBpbml0aWFsaXplZCB2YXJpYWJsZXMgYW5kIGNvbnN0YW50cyBjYW4gYmUgcmVmZXJlbmNlZFxuICogIGJlY2F1c2UgdGhlIHZhbHVlIG9mIHRoaXMgdmFyaWFibGUgaXMgbmVlZGVkIGJ5IHRoZSB0ZW1wbGF0ZSBjb21waWxlci5cbiAqL1xuLy8gQGR5bmFtaWNcbmV4cG9ydCBjbGFzcyBEb21IYW5kbGVyIHtcbiAgICBwdWJsaWMgc3RhdGljIHppbmRleDogbnVtYmVyID0gMTAwMDtcblxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAgIHByaXZhdGUgc3RhdGljIGNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBicm93c2VyOiBhbnk7XG5cbiAgICBwdWJsaWMgc3RhdGljIGFkZENsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgZWxzZSBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFkZE11bHRpcGxlQ2xhc3NlcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlczogc3RyaW5nW10gPSBjbGFzc05hbWUudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHN0eWxlc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc3R5bGVzOiBzdHJpbmdbXSA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIHN0eWxlc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUNsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICAgICAgZWxzZSBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlTXVsdGlwbGVDbGFzc2VzKGVsZW1lbnQsIGNsYXNzTmFtZXMpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgY2xhc3NOYW1lcykge1xuICAgICAgICAgICAgW2NsYXNzTmFtZXNdXG4gICAgICAgICAgICAgICAgLmZsYXQoKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoY05hbWVzKSA9PiBjTmFtZXMuc3BsaXQoJyAnKS5mb3JFYWNoKChjbGFzc05hbWUpID0+IHRoaXMucmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBoYXNDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIG5ldyBSZWdFeHAoJyhefCApJyArIGNsYXNzTmFtZSArICcoIHwkKScsICdnaScpLnRlc3QoZWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2libGluZ3MoZWxlbWVudDogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlbGVtZW50LnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkICE9PSBlbGVtZW50O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZpbmQoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYW55W10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZpbmRTaW5nbGUoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpbmRleChlbGVtZW50OiBhbnkpOiBudW1iZXIge1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSBlbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2RlcztcbiAgICAgICAgbGV0IG51bSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbltpXSA9PSBlbGVtZW50KSByZXR1cm4gbnVtO1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldLm5vZGVUeXBlID09IDEpIG51bSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGluZGV4V2l0aGluR3JvdXAoZWxlbWVudDogYW55LCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBudW1iZXIge1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSBlbGVtZW50LnBhcmVudE5vZGUgPyBlbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2RlcyA6IFtdO1xuICAgICAgICBsZXQgbnVtID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldID09IGVsZW1lbnQpIHJldHVybiBudW07XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0uYXR0cmlidXRlcyAmJiBjaGlsZHJlbltpXS5hdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdICYmIGNoaWxkcmVuW2ldLm5vZGVUeXBlID09IDEpIG51bSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGFwcGVuZE92ZXJsYXkob3ZlcmxheTogYW55LCB0YXJnZXQ6IGFueSwgYXBwZW5kVG86IGFueSA9ICdzZWxmJykge1xuICAgICAgICBpZiAoYXBwZW5kVG8gIT09ICdzZWxmJyAmJiBvdmVybGF5ICYmIHRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChvdmVybGF5LCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhbGlnbk92ZXJsYXkob3ZlcmxheTogYW55LCB0YXJnZXQ6IGFueSwgYXBwZW5kVG86IGFueSA9ICdzZWxmJywgY2FsY3VsYXRlTWluV2lkdGg6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIGlmIChvdmVybGF5ICYmIHRhcmdldCkge1xuICAgICAgICAgICAgaWYgKGNhbGN1bGF0ZU1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmxheS5zdHlsZS5taW5XaWR0aCA9IGAke0RvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aCh0YXJnZXQpfXB4YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFwcGVuZFRvID09PSAnc2VsZicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aXZlUG9zaXRpb24ob3ZlcmxheSwgdGFyZ2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hYnNvbHV0ZVBvc2l0aW9uKG92ZXJsYXksIHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlbGF0aXZlUG9zaXRpb24oZWxlbWVudDogYW55LCB0YXJnZXQ6IGFueSwgZ3V0dGVyOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgICAgICBjb25zdCBnZXRDbG9zZXN0UmVsYXRpdmVFbGVtZW50ID0gKGVsKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVsKSByZXR1cm47XG5cbiAgICAgICAgICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpID09PSAncmVsYXRpdmUnID8gZWwgOiBnZXRDbG9zZXN0UmVsYXRpdmVFbGVtZW50KGVsLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnREaW1lbnNpb25zID0gZWxlbWVudC5vZmZzZXRQYXJlbnQgPyB7IHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoLCBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IH0gOiB0aGlzLmdldEhpZGRlbkVsZW1lbnREaW1lbnNpb25zKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCB0YXJnZXRIZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0ID8/IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsVG9wID0gdGhpcy5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsTGVmdCA9IHRoaXMuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVFbGVtZW50ID0gZ2V0Q2xvc2VzdFJlbGF0aXZlRWxlbWVudChlbGVtZW50KTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVFbGVtZW50T2Zmc2V0ID0gcmVsYXRpdmVFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB8fCB7IHRvcDogLTEgKiB3aW5kb3dTY3JvbGxUb3AsIGxlZnQ6IC0xICogd2luZG93U2Nyb2xsTGVmdCB9O1xuICAgICAgICBsZXQgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcjtcblxuICAgICAgICBpZiAodGFyZ2V0T2Zmc2V0LnRvcCArIHRhcmdldEhlaWdodCArIGVsZW1lbnREaW1lbnNpb25zLmhlaWdodCA+IHZpZXdwb3J0LmhlaWdodCkge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0T2Zmc2V0LnRvcCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC50b3AgLSBlbGVtZW50RGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdib3R0b20nO1xuICAgICAgICAgICAgaWYgKHRhcmdldE9mZnNldC50b3AgKyB0b3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gLTEgKiB0YXJnZXRPZmZzZXQudG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wID0gdGFyZ2V0SGVpZ2h0ICsgdGFyZ2V0T2Zmc2V0LnRvcCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC50b3A7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICd0b3AnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaG9yaXpvbnRhbE92ZXJmbG93ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyBlbGVtZW50RGltZW5zaW9ucy53aWR0aCAtIHZpZXdwb3J0LndpZHRoO1xuICAgICAgICBjb25zdCB0YXJnZXRMZWZ0T2Zmc2V0SW5TcGFjZU9mUmVsYXRpdmVFbGVtZW50ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgLSByZWxhdGl2ZUVsZW1lbnRPZmZzZXQubGVmdDtcbiAgICAgICAgaWYgKGVsZW1lbnREaW1lbnNpb25zLndpZHRoID4gdmlld3BvcnQud2lkdGgpIHtcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2lkZXIgdGhlbiB2aWV3cG9ydCBhbmQgY2Fubm90IGZpdCBvbiBzY3JlZW4gKGFsaWduIGF0IGxlZnQgc2lkZSBvZiB2aWV3cG9ydClcbiAgICAgICAgICAgIGxlZnQgPSAodGFyZ2V0T2Zmc2V0LmxlZnQgLSByZWxhdGl2ZUVsZW1lbnRPZmZzZXQubGVmdCkgKiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChob3Jpem9udGFsT3ZlcmZsb3cgPiAwKSB7XG4gICAgICAgICAgICAvLyBlbGVtZW50IHdpZGVyIHRoZW4gdmlld3BvcnQgYnV0IGNhbiBiZSBmaXQgb24gc2NyZWVuIChhbGlnbiBhdCByaWdodCBzaWRlIG9mIHZpZXdwb3J0KVxuICAgICAgICAgICAgbGVmdCA9IHRhcmdldExlZnRPZmZzZXRJblNwYWNlT2ZSZWxhdGl2ZUVsZW1lbnQgLSBob3Jpem9udGFsT3ZlcmZsb3c7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbGVtZW50IGZpdHMgb24gc2NyZWVuIChhbGlnbiB3aXRoIHRhcmdldClcbiAgICAgICAgICAgIGxlZnQgPSB0YXJnZXRPZmZzZXQubGVmdCAtIHJlbGF0aXZlRWxlbWVudE9mZnNldC5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgZ3V0dGVyICYmIChlbGVtZW50LnN0eWxlLm1hcmdpblRvcCA9IG9yaWdpbiA9PT0gJ2JvdHRvbScgPyAnY2FsYyh2YXIoLS1wLWFuY2hvci1ndXR0ZXIpICogLTEpJyA6ICdjYWxjKHZhcigtLXAtYW5jaG9yLWd1dHRlcikpJyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhYnNvbHV0ZVBvc2l0aW9uKGVsZW1lbnQ6IGFueSwgdGFyZ2V0OiBhbnksIGd1dHRlcjogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZWxlbWVudERpbWVuc2lvbnMgPSBlbGVtZW50Lm9mZnNldFBhcmVudCA/IHsgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGgsIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQgfSA6IHRoaXMuZ2V0SGlkZGVuRWxlbWVudERpbWVuc2lvbnMoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRPdXRlckhlaWdodCA9IGVsZW1lbnREaW1lbnNpb25zLmhlaWdodDtcbiAgICAgICAgY29uc3QgZWxlbWVudE91dGVyV2lkdGggPSBlbGVtZW50RGltZW5zaW9ucy53aWR0aDtcbiAgICAgICAgY29uc3QgdGFyZ2V0T3V0ZXJIZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0ID8/IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE91dGVyV2lkdGggPSB0YXJnZXQub2Zmc2V0V2lkdGggPz8gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICBjb25zdCB0YXJnZXRPZmZzZXQgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHdpbmRvd1Njcm9sbFRvcCA9IHRoaXMuZ2V0V2luZG93U2Nyb2xsVG9wKCk7XG4gICAgICAgIGNvbnN0IHdpbmRvd1Njcm9sbExlZnQgPSB0aGlzLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLmdldFZpZXdwb3J0KCk7XG4gICAgICAgIGxldCB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyO1xuXG4gICAgICAgIGlmICh0YXJnZXRPZmZzZXQudG9wICsgdGFyZ2V0T3V0ZXJIZWlnaHQgKyBlbGVtZW50T3V0ZXJIZWlnaHQgPiB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvcCA9IHRhcmdldE9mZnNldC50b3AgKyB3aW5kb3dTY3JvbGxUb3AgLSBlbGVtZW50T3V0ZXJIZWlnaHQ7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICdib3R0b20nO1xuXG4gICAgICAgICAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICAgICAgICAgIHRvcCA9IHdpbmRvd1Njcm9sbFRvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvcCA9IHRhcmdldE91dGVySGVpZ2h0ICsgdGFyZ2V0T2Zmc2V0LnRvcCArIHdpbmRvd1Njcm9sbFRvcDtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJ3RvcCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGFyZ2V0T2Zmc2V0LmxlZnQgKyBlbGVtZW50T3V0ZXJXaWR0aCA+IHZpZXdwb3J0LndpZHRoKSBsZWZ0ID0gTWF0aC5tYXgoMCwgdGFyZ2V0T2Zmc2V0LmxlZnQgKyB3aW5kb3dTY3JvbGxMZWZ0ICsgdGFyZ2V0T3V0ZXJXaWR0aCAtIGVsZW1lbnRPdXRlcldpZHRoKTtcbiAgICAgICAgZWxzZSBsZWZ0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB3aW5kb3dTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG4gICAgICAgIGd1dHRlciAmJiAoZWxlbWVudC5zdHlsZS5tYXJnaW5Ub3AgPSBvcmlnaW4gPT09ICdib3R0b20nID8gJ2NhbGModmFyKC0tcC1hbmNob3ItZ3V0dGVyKSAqIC0xKScgOiAnY2FsYyh2YXIoLS1wLWFuY2hvci1ndXR0ZXIpKScpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQYXJlbnRzKGVsZW1lbnQ6IGFueSwgcGFyZW50czogYW55ID0gW10pOiBhbnkge1xuICAgICAgICByZXR1cm4gZWxlbWVudFsncGFyZW50Tm9kZSddID09PSBudWxsID8gcGFyZW50cyA6IHRoaXMuZ2V0UGFyZW50cyhlbGVtZW50LnBhcmVudE5vZGUsIHBhcmVudHMuY29uY2F0KFtlbGVtZW50LnBhcmVudE5vZGVdKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFNjcm9sbGFibGVQYXJlbnRzKGVsZW1lbnQ6IGFueSkge1xuICAgICAgICBsZXQgc2Nyb2xsYWJsZVBhcmVudHMgPSBbXTtcblxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgbGV0IHBhcmVudHMgPSB0aGlzLmdldFBhcmVudHMoZWxlbWVudCk7XG4gICAgICAgICAgICBjb25zdCBvdmVyZmxvd1JlZ2V4ID0gLyhhdXRvfHNjcm9sbCkvO1xuICAgICAgICAgICAgY29uc3Qgb3ZlcmZsb3dDaGVjayA9IChub2RlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3R5bGVEZWNsYXJhdGlvbiA9IHdpbmRvd1snZ2V0Q29tcHV0ZWRTdHlsZSddKG5vZGUsIG51bGwpO1xuICAgICAgICAgICAgICAgIHJldHVybiBvdmVyZmxvd1JlZ2V4LnRlc3Qoc3R5bGVEZWNsYXJhdGlvbi5nZXRQcm9wZXJ0eVZhbHVlKCdvdmVyZmxvdycpKSB8fCBvdmVyZmxvd1JlZ2V4LnRlc3Qoc3R5bGVEZWNsYXJhdGlvbi5nZXRQcm9wZXJ0eVZhbHVlKCdvdmVyZmxvd1gnKSkgfHwgb3ZlcmZsb3dSZWdleC50ZXN0KHN0eWxlRGVjbGFyYXRpb24uZ2V0UHJvcGVydHlWYWx1ZSgnb3ZlcmZsb3dZJykpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yIChsZXQgcGFyZW50IG9mIHBhcmVudHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgc2Nyb2xsU2VsZWN0b3JzID0gcGFyZW50Lm5vZGVUeXBlID09PSAxICYmIHBhcmVudC5kYXRhc2V0WydzY3JvbGxzZWxlY3RvcnMnXTtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsU2VsZWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RvcnMgPSBzY3JvbGxTZWxlY3RvcnMuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWwgPSB0aGlzLmZpbmRTaW5nbGUocGFyZW50LCBzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWwgJiYgb3ZlcmZsb3dDaGVjayhlbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxhYmxlUGFyZW50cy5wdXNoKGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnQubm9kZVR5cGUgIT09IDkgJiYgb3ZlcmZsb3dDaGVjayhwYXJlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVQYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2Nyb2xsYWJsZVBhcmVudHM7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIaWRkZW5FbGVtZW50T3V0ZXJIZWlnaHQoZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGxldCBlbGVtZW50SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgICAgIHJldHVybiBlbGVtZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlkZGVuRWxlbWVudE91dGVyV2lkdGgoZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGxldCBlbGVtZW50V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICByZXR1cm4gZWxlbWVudFdpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlkZGVuRWxlbWVudERpbWVuc2lvbnMoZWxlbWVudDogYW55KTogYW55IHtcbiAgICAgICAgbGV0IGRpbWVuc2lvbnM6IGFueSA9IHt9O1xuICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZGltZW5zaW9ucy53aWR0aCA9IGVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIGRpbWVuc2lvbnMuaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgICAgIHJldHVybiBkaW1lbnNpb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2Nyb2xsSW5WaWV3KGNvbnRhaW5lciwgaXRlbSkge1xuICAgICAgICBsZXQgYm9yZGVyVG9wVmFsdWU6IHN0cmluZyA9IGdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKCdib3JkZXJUb3BXaWR0aCcpO1xuICAgICAgICBsZXQgYm9yZGVyVG9wOiBudW1iZXIgPSBib3JkZXJUb3BWYWx1ZSA/IHBhcnNlRmxvYXQoYm9yZGVyVG9wVmFsdWUpIDogMDtcbiAgICAgICAgbGV0IHBhZGRpbmdUb3BWYWx1ZTogc3RyaW5nID0gZ2V0Q29tcHV0ZWRTdHlsZShjb250YWluZXIpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmdUb3AnKTtcbiAgICAgICAgbGV0IHBhZGRpbmdUb3A6IG51bWJlciA9IHBhZGRpbmdUb3BWYWx1ZSA/IHBhcnNlRmxvYXQocGFkZGluZ1RvcFZhbHVlKSA6IDA7XG4gICAgICAgIGxldCBjb250YWluZXJSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgaXRlbVJlY3QgPSBpdGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gaXRlbVJlY3QudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgLSAoY29udGFpbmVyUmVjdC50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSBib3JkZXJUb3AgLSBwYWRkaW5nVG9wO1xuICAgICAgICBsZXQgc2Nyb2xsID0gY29udGFpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgbGV0IGVsZW1lbnRIZWlnaHQgPSBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgICBsZXQgaXRlbUhlaWdodCA9IHRoaXMuZ2V0T3V0ZXJIZWlnaHQoaXRlbSk7XG5cbiAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSBzY3JvbGwgKyBvZmZzZXQ7XG4gICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0ICsgaXRlbUhlaWdodCA+IGVsZW1lbnRIZWlnaHQpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSBzY3JvbGwgKyBvZmZzZXQgLSBlbGVtZW50SGVpZ2h0ICsgaXRlbUhlaWdodDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmFkZUluKGVsZW1lbnQsIGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcblxuICAgICAgICBsZXQgbGFzdCA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBsZXQgb3BhY2l0eSA9IDA7XG4gICAgICAgIGxldCB0aWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb3BhY2l0eSA9ICtlbGVtZW50LnN0eWxlLm9wYWNpdHkucmVwbGFjZSgnLCcsICcuJykgKyAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsYXN0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgICAgIGxhc3QgPSArbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKCtvcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgICAgICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKSkgfHwgc2V0VGltZW91dCh0aWNrLCAxNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGljaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmFkZU91dChlbGVtZW50LCBtcykge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IDEsXG4gICAgICAgICAgICBpbnRlcnZhbCA9IDUwLFxuICAgICAgICAgICAgZHVyYXRpb24gPSBtcyxcbiAgICAgICAgICAgIGdhcCA9IGludGVydmFsIC8gZHVyYXRpb247XG5cbiAgICAgICAgbGV0IGZhZGluZyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5IC0gZ2FwO1xuXG4gICAgICAgICAgICBpZiAob3BhY2l0eSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChmYWRpbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuICAgICAgICB9LCBpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRXaW5kb3dTY3JvbGxUb3AoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFdpbmRvd1Njcm9sbExlZnQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbWF0Y2hlcyhlbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHZhciBwID0gRWxlbWVudC5wcm90b3R5cGU7XG4gICAgICAgIHZhciBmID1cbiAgICAgICAgICAgIHBbJ21hdGNoZXMnXSB8fFxuICAgICAgICAgICAgcC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgIHBbJ21vek1hdGNoZXNTZWxlY3RvciddIHx8XG4gICAgICAgICAgICBwWydtc01hdGNoZXNTZWxlY3RvciddIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAocykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXS5pbmRleE9mLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzKSwgdGhpcykgIT09IC0xO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGYuY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRPdXRlcldpZHRoKGVsLCBtYXJnaW4/KSB7XG4gICAgICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuXG4gICAgICAgIGlmIChtYXJnaW4pIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgICAgd2lkdGggKz0gcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5MZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luUmlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SG9yaXpvbnRhbFBhZGRpbmcoZWwpIHtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhvcml6b250YWxNYXJnaW4oZWwpIHtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpbm5lcldpZHRoKGVsKSB7XG4gICAgICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICB3aWR0aCArPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgd2lkdGgoZWwpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuXG4gICAgICAgIHdpZHRoIC09IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpO1xuICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbm5lckhlaWdodChlbCkge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICBoZWlnaHQgKz0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRPdXRlckhlaWdodChlbCwgbWFyZ2luPykge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIGlmIChtYXJnaW4pIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIZWlnaHQoZWw6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IGVsLm9mZnNldEhlaWdodDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgaGVpZ2h0IC09IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJUb3BXaWR0aCkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoKTtcblxuICAgICAgICByZXR1cm4gaGVpZ2h0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0V2lkdGgoZWw6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuXG4gICAgICAgIHdpZHRoIC09IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJMZWZ0V2lkdGgpICsgcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJSaWdodFdpZHRoKTtcblxuICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRWaWV3cG9ydCgpOiBhbnkge1xuICAgICAgICBsZXQgd2luID0gd2luZG93LFxuICAgICAgICAgICAgZCA9IGRvY3VtZW50LFxuICAgICAgICAgICAgZSA9IGQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgICAgICAgZyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXSxcbiAgICAgICAgICAgIHcgPSB3aW4uaW5uZXJXaWR0aCB8fCBlLmNsaWVudFdpZHRoIHx8IGcuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoID0gd2luLmlubmVySGVpZ2h0IHx8IGUuY2xpZW50SGVpZ2h0IHx8IGcuY2xpZW50SGVpZ2h0O1xuXG4gICAgICAgIHJldHVybiB7IHdpZHRoOiB3LCBoZWlnaHQ6IGggfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldE9mZnNldChlbCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHJlY3QudG9wICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IDApLFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgKHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgfHwgMClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VFbGVtZW50V2l0aChlbGVtZW50OiBhbnksIHJlcGxhY2VtZW50RWxlbWVudDogYW55KTogYW55IHtcbiAgICAgICAgbGV0IHBhcmVudE5vZGUgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgIGlmICghcGFyZW50Tm9kZSkgdGhyb3cgYENhbid0IHJlcGxhY2UgZWxlbWVudGA7XG4gICAgICAgIHJldHVybiBwYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyZXBsYWNlbWVudEVsZW1lbnQsIGVsZW1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXNlckFnZW50KCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChuYXZpZ2F0b3IgJiYgdGhpcy5pc0NsaWVudCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNJRSgpIHtcbiAgICAgICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpO1xuICAgICAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgICAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XG4gICAgICAgIGlmICh0cmlkZW50ID4gMCkge1xuICAgICAgICAgICAgLy8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICB2YXIgcnYgPSB1YS5pbmRleE9mKCdydjonKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xuICAgICAgICBpZiAoZWRnZSA+IDApIHtcbiAgICAgICAgICAgIC8vIEVkZ2UgKElFIDEyKykgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG90aGVyIGJyb3dzZXJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNJT1MoKSB7XG4gICAgICAgIHJldHVybiAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93WydNU1N0cmVhbSddO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNBbmRyb2lkKCkge1xuICAgICAgICByZXR1cm4gLyhhbmRyb2lkKS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc1RvdWNoRGV2aWNlKCkge1xuICAgICAgICByZXR1cm4gJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8IG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDA7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRDaGlsZChlbGVtZW50OiBhbnksIHRhcmdldDogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRWxlbWVudCh0YXJnZXQpKSB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgaWYgKHRhcmdldCAmJiB0YXJnZXQuZWwgJiYgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQpIHRhcmdldC5lbC5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICBlbHNlIHRocm93ICdDYW5ub3QgYXBwZW5kICcgKyB0YXJnZXQgKyAnIHRvICcgKyBlbGVtZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgcmVtb3ZlQ2hpbGQoZWxlbWVudDogYW55LCB0YXJnZXQ6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5pc0VsZW1lbnQodGFyZ2V0KSkgdGFyZ2V0LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICBlbHNlIGlmICh0YXJnZXQuZWwgJiYgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQpIHRhcmdldC5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICBlbHNlIHRocm93ICdDYW5ub3QgcmVtb3ZlICcgKyBlbGVtZW50ICsgJyBmcm9tICcgKyB0YXJnZXQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZW1vdmVFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCEoJ3JlbW92ZScgaW4gRWxlbWVudC5wcm90b3R5cGUpKSBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzRWxlbWVudChvYmo6IGFueSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0JyA/IG9iaiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCAmJiBvYmoubm9kZVR5cGUgPT09IDEgJiYgdHlwZW9mIG9iai5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVTY3JvbGxiYXJXaWR0aChlbD86IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICAgIHJldHVybiBlbC5vZmZzZXRXaWR0aCAtIGVsLmNsaWVudFdpZHRoIC0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJMZWZ0V2lkdGgpIC0gcGFyc2VGbG9hdChzdHlsZS5ib3JkZXJSaWdodFdpZHRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aCAhPT0gbnVsbCkgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoO1xuXG4gICAgICAgICAgICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ3Atc2Nyb2xsYmFyLW1lYXN1cmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuXG4gICAgICAgICAgICBsZXQgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoID0gc2Nyb2xsYmFyV2lkdGg7XG5cbiAgICAgICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlU2Nyb2xsYmFySGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQgIT09IG51bGwpIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQ7XG5cbiAgICAgICAgbGV0IHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ3Atc2Nyb2xsYmFyLW1lYXN1cmUnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgbGV0IHNjcm9sbGJhckhlaWdodCA9IHNjcm9sbERpdi5vZmZzZXRIZWlnaHQgLSBzY3JvbGxEaXYuY2xpZW50SGVpZ2h0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxiYXJIZWlnaHQ7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhckhlaWdodDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGludm9rZUVsZW1lbnRNZXRob2QoZWxlbWVudDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSk6IHZvaWQge1xuICAgICAgICAoZWxlbWVudCBhcyBhbnkpW21ldGhvZE5hbWVdLmFwcGx5KGVsZW1lbnQsIGFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLmVtcHR5KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMgJiYgd2luZG93LmdldFNlbGVjdGlvbigpLnJhbmdlQ291bnQgPiAwICYmIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudFsnc2VsZWN0aW9uJ10gJiYgZG9jdW1lbnRbJ3NlbGVjdGlvbiddLmVtcHR5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50WydzZWxlY3Rpb24nXS5lbXB0eSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvL2lnbm9yZSBJRSBidWdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0QnJvd3NlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXIpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaGVkID0gdGhpcy5yZXNvbHZlVXNlckFnZW50KCk7XG4gICAgICAgICAgICB0aGlzLmJyb3dzZXIgPSB7fTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoZWQuYnJvd3Nlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvd3NlclttYXRjaGVkLmJyb3dzZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb3dzZXJbJ3ZlcnNpb24nXSA9IG1hdGNoZWQudmVyc2lvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuYnJvd3NlclsnY2hyb21lJ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb3dzZXJbJ3dlYmtpdCddID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5icm93c2VyWyd3ZWJraXQnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvd3Nlclsnc2FmYXJpJ10gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYnJvd3NlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlc29sdmVVc2VyQWdlbnQoKSB7XG4gICAgICAgIGxldCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IG1hdGNoID1cbiAgICAgICAgICAgIC8oY2hyb21lKVsgXFwvXShbXFx3Ll0rKS8uZXhlYyh1YSkgfHwgLyh3ZWJraXQpWyBcXC9dKFtcXHcuXSspLy5leGVjKHVhKSB8fCAvKG9wZXJhKSg/Oi4qdmVyc2lvbnwpWyBcXC9dKFtcXHcuXSspLy5leGVjKHVhKSB8fCAvKG1zaWUpIChbXFx3Ll0rKS8uZXhlYyh1YSkgfHwgKHVhLmluZGV4T2YoJ2NvbXBhdGlibGUnKSA8IDAgJiYgLyhtb3ppbGxhKSg/Oi4qPyBydjooW1xcdy5dKyl8KS8uZXhlYyh1YSkpIHx8IFtdO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBicm93c2VyOiBtYXRjaFsxXSB8fCAnJyxcbiAgICAgICAgICAgIHZlcnNpb246IG1hdGNoWzJdIHx8ICcwJ1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNJbnRlZ2VyKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0hpZGRlbihlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIWVsZW1lbnQgfHwgZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc1Zpc2libGUoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQgJiYgZWxlbWVudC5vZmZzZXRQYXJlbnQgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzRXhpc3QoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQgIT09IG51bGwgJiYgdHlwZW9mIGVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGVsZW1lbnQubm9kZU5hbWUgJiYgZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZm9jdXMoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICAgICAgZWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBlbGVtZW50ICYmIGVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRGb2N1c2FibGVTZWxlY3RvclN0cmluZyhzZWxlY3RvciA9ICcnKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBidXR0b246bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICBbaHJlZl1bY2xpZW50SGVpZ2h0XVtjbGllbnRXaWR0aF06bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICBpbnB1dDpub3QoW3RhYmluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pJHtzZWxlY3Rvcn0sXG4gICAgICAgIHNlbGVjdDpub3QoW3RhYmluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pJHtzZWxlY3Rvcn0sXG4gICAgICAgIHRleHRhcmVhOm5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSkke3NlbGVjdG9yfSxcbiAgICAgICAgW3RhYkluZGV4XTpub3QoW3RhYkluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pJHtzZWxlY3Rvcn0sXG4gICAgICAgIFtjb250ZW50ZWRpdGFibGVdOm5vdChbdGFiSW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSkke3NlbGVjdG9yfSxcbiAgICAgICAgLnAtaW5wdXR0ZXh0Om5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSkke3NlbGVjdG9yfSxcbiAgICAgICAgLnAtYnV0dG9uOm5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSkke3NlbGVjdG9yfWA7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRGb2N1c2FibGVFbGVtZW50cyhlbGVtZW50LCBzZWxlY3RvciA9ICcnKTogYW55W10ge1xuICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSB0aGlzLmZpbmQoZWxlbWVudCwgdGhpcy5nZXRGb2N1c2FibGVTZWxlY3RvclN0cmluZyhzZWxlY3RvcikpO1xuXG4gICAgICAgIGxldCB2aXNpYmxlRm9jdXNhYmxlRWxlbWVudHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBmb2N1c2FibGVFbGVtZW50IG9mIGZvY3VzYWJsZUVsZW1lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShmb2N1c2FibGVFbGVtZW50KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZShmb2N1c2FibGVFbGVtZW50KSAmJiBjb21wdXRlZFN0eWxlLmRpc3BsYXkgIT0gJ25vbmUnICYmIGNvbXB1dGVkU3R5bGUudmlzaWJpbGl0eSAhPSAnaGlkZGVuJykgdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzLnB1c2goZm9jdXNhYmxlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Rm9jdXNhYmxlRWxlbWVudChlbGVtZW50LCBzZWxlY3RvciA9ICcnKTogYW55IHwgbnVsbCB7XG4gICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50ID0gdGhpcy5maW5kU2luZ2xlKGVsZW1lbnQsIHRoaXMuZ2V0Rm9jdXNhYmxlU2VsZWN0b3JTdHJpbmcoc2VsZWN0b3IpKTtcblxuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZm9jdXNhYmxlRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUoZm9jdXNhYmxlRWxlbWVudCkgJiYgY29tcHV0ZWRTdHlsZS5kaXNwbGF5ICE9ICdub25lJyAmJiBjb21wdXRlZFN0eWxlLnZpc2liaWxpdHkgIT0gJ2hpZGRlbicpIHJldHVybiBmb2N1c2FibGVFbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRGaXJzdEZvY3VzYWJsZUVsZW1lbnQoZWxlbWVudCwgc2VsZWN0b3IgPSAnJykge1xuICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHRoaXMuZ2V0Rm9jdXNhYmxlRWxlbWVudHMoZWxlbWVudCwgc2VsZWN0b3IpO1xuXG4gICAgICAgIHJldHVybiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwID8gZm9jdXNhYmxlRWxlbWVudHNbMF0gOiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TGFzdEZvY3VzYWJsZUVsZW1lbnQoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0aGlzLmdldEZvY3VzYWJsZUVsZW1lbnRzKGVsZW1lbnQsIHNlbGVjdG9yKTtcblxuICAgICAgICByZXR1cm4gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoID4gMCA/IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldE5leHRGb2N1c2FibGVFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCByZXZlcnNlID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBEb21IYW5kbGVyLmdldEZvY3VzYWJsZUVsZW1lbnRzKGVsZW1lbnQpO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudHMgJiYgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZm9jdXNlZEluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihmb2N1c2FibGVFbGVtZW50c1swXS5vd25lckRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSW5kZXggPT0gLTEgfHwgZm9jdXNlZEluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGZvY3VzZWRJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb2N1c2VkSW5kZXggIT0gLTEgJiYgZm9jdXNlZEluZGV4ICE9PSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb2N1c2VkSW5kZXggKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvY3VzYWJsZUVsZW1lbnRzW2luZGV4XTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2VuZXJhdGVaSW5kZXgoKSB7XG4gICAgICAgIHRoaXMuemluZGV4ID0gdGhpcy56aW5kZXggfHwgOTk5O1xuICAgICAgICByZXR1cm4gKyt0aGlzLnppbmRleDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFNlbGVjdGlvbigpIHtcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRTZWxlY3Rpb24pIHJldHVybiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKTtcbiAgICAgICAgZWxzZSBpZiAoZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKSByZXR1cm4gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKTtcbiAgICAgICAgZWxzZSBpZiAoZG9jdW1lbnRbJ3NlbGVjdGlvbiddKSByZXR1cm4gZG9jdW1lbnRbJ3NlbGVjdGlvbiddLmNyZWF0ZVJhbmdlKCkudGV4dDtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFRhcmdldEVsZW1lbnQodGFyZ2V0OiBhbnksIGVsPzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKCF0YXJnZXQpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgICAgICAgICAgY2FzZSAnd2luZG93JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93O1xuICAgICAgICAgICAgY2FzZSAnQG5leHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlbD8ubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgY2FzZSAnQHByZXYnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlbD8ucHJldmlvdXNFbGVtZW50U2libGluZztcbiAgICAgICAgICAgIGNhc2UgJ0BwYXJlbnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBlbD8ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGNhc2UgJ0BncmFuZHBhcmVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsPy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgdGFyZ2V0O1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JyAmJiB0YXJnZXQuaGFzT3duUHJvcGVydHkoJ25hdGl2ZUVsZW1lbnQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc0V4aXN0KHRhcmdldC5uYXRpdmVFbGVtZW50KSA/IHRhcmdldC5uYXRpdmVFbGVtZW50IDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGlzRnVuY3Rpb24gPSAob2JqOiBhbnkpID0+ICEhKG9iaiAmJiBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNhbGwgJiYgb2JqLmFwcGx5KTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gaXNGdW5jdGlvbih0YXJnZXQpID8gdGFyZ2V0KCkgOiB0YXJnZXQ7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gOSkgfHwgdGhpcy5pc0V4aXN0KGVsZW1lbnQpID8gZWxlbWVudCA6IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzQ2xpZW50KCkge1xuICAgICAgICByZXR1cm4gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50ICYmIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEF0dHJpYnV0ZShlbGVtZW50LCBuYW1lKSB7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoIWlzTmFOKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiArdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnIHx8IHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSAndHJ1ZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVCb2R5U2Nyb2xsYmFyV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGJsb2NrQm9keVNjcm9sbChjbGFzc05hbWUgPSAncC1vdmVyZmxvdy1oaWRkZW4nKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuc2V0UHJvcGVydHkoJy0tc2Nyb2xsYmFyLXdpZHRoJywgdGhpcy5jYWxjdWxhdGVCb2R5U2Nyb2xsYmFyV2lkdGgoKSArICdweCcpO1xuICAgICAgICB0aGlzLmFkZENsYXNzKGRvY3VtZW50LmJvZHksIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB1bmJsb2NrQm9keVNjcm9sbChjbGFzc05hbWUgPSAncC1vdmVyZmxvdy1oaWRkZW4nKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucmVtb3ZlUHJvcGVydHkoJy0tc2Nyb2xsYmFyLXdpZHRoJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoZG9jdW1lbnQuYm9keSwgY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUVsZW1lbnQodHlwZSwgYXR0cmlidXRlcyA9IHt9LCAuLi5jaGlsZHJlbikge1xuICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kKC4uLmNoaWxkcmVuKTtcblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZSA9ICcnLCB2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5pc0VsZW1lbnQoZWxlbWVudCkgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNldEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlcyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmlzRWxlbWVudChlbGVtZW50KSkge1xuICAgICAgICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZXMgPSAocnVsZSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZXMgPSBlbGVtZW50Py4kYXR0cnM/LltydWxlXSA/IFtlbGVtZW50Py4kYXR0cnM/LltydWxlXV0gOiBbXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBbdmFsdWVdLmZsYXQoKS5yZWR1Y2UoKGN2LCB2KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdi5wdXNoKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jdiA9IEFycmF5LmlzQXJyYXkodilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjb21wdXRlZFN0eWxlcyhydWxlLCB2KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IE9iamVjdC5lbnRyaWVzKHYpLm1hcCgoW19rLCBfdl0pID0+IChydWxlID09PSAnc3R5bGUnICYmICghIV92IHx8IF92ID09PSAwKSA/IGAke19rLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCl9OiR7X3Z9YCA6ICEhX3YgPyBfayA6IHVuZGVmaW5lZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3YgPSBfY3YubGVuZ3RoID8gY3YuY29uY2F0KF9jdi5maWx0ZXIoKGMpID0+ICEhYykpIDogY3Y7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3Y7XG4gICAgICAgICAgICAgICAgfSwgc3R5bGVzKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRFdmVudCA9IGtleS5tYXRjaCgvXm9uKC4rKS8pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGVkRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihtYXRjaGVkRXZlbnRbMV0udG9Mb3dlckNhc2UoKSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ3BCaW5kJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ga2V5ID09PSAnY2xhc3MnID8gWy4uLm5ldyBTZXQoY29tcHV0ZWRTdHlsZXMoJ2NsYXNzJywgdmFsdWUpKV0uam9pbignICcpLnRyaW0oKSA6IGtleSA9PT0gJ3N0eWxlJyA/IGNvbXB1dGVkU3R5bGVzKCdzdHlsZScsIHZhbHVlKS5qb2luKCc7JykudHJpbSgpIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAoZWxlbWVudC4kYXR0cnMgPSBlbGVtZW50LiRhdHRycyB8fCB7fSkgJiYgKGVsZW1lbnQuJGF0dHJzW2tleV0gPSB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpc0ZvY3VzYWJsZUVsZW1lbnQoZWxlbWVudCwgc2VsZWN0b3IgPSAnJykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0VsZW1lbnQoZWxlbWVudClcbiAgICAgICAgICAgID8gZWxlbWVudC5tYXRjaGVzKGBidXR0b246bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICAgICAgICAgIFtocmVmXVtjbGllbnRIZWlnaHRdW2NsaWVudFdpZHRoXTpub3QoW3RhYmluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pJHtzZWxlY3Rvcn0sXG4gICAgICAgICAgICAgICAgaW5wdXQ6bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICAgICAgICAgIHNlbGVjdDpub3QoW3RhYmluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pJHtzZWxlY3Rvcn0sXG4gICAgICAgICAgICAgICAgdGV4dGFyZWE6bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICAgICAgICAgIFt0YWJJbmRleF06bm90KFt0YWJJbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSR7c2VsZWN0b3J9LFxuICAgICAgICAgICAgICAgIFtjb250ZW50ZWRpdGFibGVdOm5vdChbdGFiSW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSkke3NlbGVjdG9yfWApXG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgIH1cbn1cbiJdfQ==