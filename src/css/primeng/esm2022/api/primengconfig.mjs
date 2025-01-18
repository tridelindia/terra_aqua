import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterMatchMode } from './filtermatchmode';
import * as i0 from "@angular/core";
export class PrimeNGConfig {
    ripple = false;
    inputStyle = signal('outlined');
    overlayOptions = {};
    csp = signal({ nonce: undefined });
    filterMatchModeOptions = {
        text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
        numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
        date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
    };
    translation = {
        startsWith: 'Starts with',
        contains: 'Contains',
        notContains: 'Not contains',
        endsWith: 'Ends with',
        equals: 'Equals',
        notEquals: 'Not equals',
        noFilter: 'No Filter',
        lt: 'Less than',
        lte: 'Less than or equal to',
        gt: 'Greater than',
        gte: 'Greater than or equal to',
        is: 'Is',
        isNot: 'Is not',
        before: 'Before',
        after: 'After',
        dateIs: 'Date is',
        dateIsNot: 'Date is not',
        dateBefore: 'Date is before',
        dateAfter: 'Date is after',
        clear: 'Clear',
        apply: 'Apply',
        matchAll: 'Match All',
        matchAny: 'Match Any',
        addRule: 'Add Rule',
        removeRule: 'Remove Rule',
        accept: 'Yes',
        reject: 'No',
        choose: 'Choose',
        upload: 'Upload',
        cancel: 'Cancel',
        pending: 'Pending',
        fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        chooseYear: 'Choose Year',
        chooseMonth: 'Choose Month',
        chooseDate: 'Choose Date',
        prevDecade: 'Previous Decade',
        nextDecade: 'Next Decade',
        prevYear: 'Previous Year',
        nextYear: 'Next Year',
        prevMonth: 'Previous Month',
        nextMonth: 'Next Month',
        prevHour: 'Previous Hour',
        nextHour: 'Next Hour',
        prevMinute: 'Previous Minute',
        nextMinute: 'Next Minute',
        prevSecond: 'Previous Second',
        nextSecond: 'Next Second',
        am: 'am',
        pm: 'pm',
        dateFormat: 'mm/dd/yy',
        firstDayOfWeek: 0,
        today: 'Today',
        weekHeader: 'Wk',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong',
        passwordPrompt: 'Enter a password',
        emptyMessage: 'No results found',
        searchMessage: '{0} results are available',
        selectionMessage: '{0} items selected',
        emptySelectionMessage: 'No selected item',
        emptySearchMessage: 'No results found',
        emptyFilterMessage: 'No results found',
        aria: {
            trueLabel: 'True',
            falseLabel: 'False',
            nullLabel: 'Not Selected',
            star: '1 star',
            stars: '{star} stars',
            selectAll: 'All items selected',
            unselectAll: 'All items unselected',
            close: 'Close',
            previous: 'Previous',
            next: 'Next',
            navigation: 'Navigation',
            scrollTop: 'Scroll Top',
            moveTop: 'Move Top',
            moveUp: 'Move Up',
            moveDown: 'Move Down',
            moveBottom: 'Move Bottom',
            moveToTarget: 'Move to Target',
            moveToSource: 'Move to Source',
            moveAllToTarget: 'Move All to Target',
            moveAllToSource: 'Move All to Source',
            pageLabel: '{page}',
            firstPageLabel: 'First Page',
            lastPageLabel: 'Last Page',
            nextPageLabel: 'Next Page',
            prevPageLabel: 'Previous Page',
            rowsPerPageLabel: 'Rows per page',
            previousPageLabel: 'Previous Page',
            jumpToPageDropdownLabel: 'Jump to Page Dropdown',
            jumpToPageInputLabel: 'Jump to Page Input',
            selectRow: 'Row Selected',
            unselectRow: 'Row Unselected',
            expandRow: 'Row Expanded',
            collapseRow: 'Row Collapsed',
            showFilterMenu: 'Show Filter Menu',
            hideFilterMenu: 'Hide Filter Menu',
            filterOperator: 'Filter Operator',
            filterConstraint: 'Filter Constraint',
            editRow: 'Row Edit',
            saveEdit: 'Save Edit',
            cancelEdit: 'Cancel Edit',
            listView: 'List View',
            gridView: 'Grid View',
            slide: 'Slide',
            slideNumber: '{slideNumber}',
            zoomImage: 'Zoom Image',
            zoomIn: 'Zoom In',
            zoomOut: 'Zoom Out',
            rotateRight: 'Rotate Right',
            rotateLeft: 'Rotate Left',
            listLabel: 'Option List',
            selectColor: 'Select a color',
            removeLabel: 'Remove',
            browseFiles: 'Browse Files',
            maximizeLabel: 'Maximize'
        }
    };
    zIndex = {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100
    };
    translationSource = new Subject();
    translationObserver = this.translationSource.asObservable();
    getTranslation(key) {
        return this.translation[key];
    }
    setTranslation(value) {
        this.translation = { ...this.translation, ...value };
        this.translationSource.next(this.translation);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PrimeNGConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PrimeNGConfig, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: PrimeNGConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbWVuZ2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9hcGkvcHJpbWVuZ2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLGFBQWE7SUFDdEIsTUFBTSxHQUFZLEtBQUssQ0FBQztJQUV4QixVQUFVLEdBQUcsTUFBTSxDQUF3QixVQUFVLENBQUMsQ0FBQztJQUV2RCxjQUFjLEdBQW1CLEVBQUUsQ0FBQztJQUVwQyxHQUFHLEdBQUcsTUFBTSxDQUFnQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLHNCQUFzQixHQUFHO1FBQ3JCLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQzFLLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxxQkFBcUIsRUFBRSxlQUFlLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQztRQUN2TSxJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsVUFBVSxDQUFDO0tBQ3hILENBQUM7SUFFSyxXQUFXLEdBQWdCO1FBQzlCLFVBQVUsRUFB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QUFXLENBQUMsQ0FBQztJQUNsRCxDQUFDO3VHQWhLUSxhQUFhOzJHQUFiLGFBQWEsY0FEQSxNQUFNOzsyRkFDbkIsYUFBYTtrQkFEekIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBzaWduYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEZpbHRlck1hdGNoTW9kZSB9IGZyb20gJy4vZmlsdGVybWF0Y2htb2RlJztcbmltcG9ydCB7IE92ZXJsYXlPcHRpb25zIH0gZnJvbSAnLi9vdmVybGF5b3B0aW9ucyc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbiB9IGZyb20gJy4vdHJhbnNsYXRpb24nO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFByaW1lTkdDb25maWcge1xuICAgIHJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgaW5wdXRTdHlsZSA9IHNpZ25hbDwnb3V0bGluZWQnIHwgJ2ZpbGxlZCc+KCdvdXRsaW5lZCcpO1xuXG4gICAgb3ZlcmxheU9wdGlvbnM6IE92ZXJsYXlPcHRpb25zID0ge307XG5cbiAgICBjc3AgPSBzaWduYWw8eyBub25jZTogc3RyaW5nIHwgdW5kZWZpbmVkIH0+KHsgbm9uY2U6IHVuZGVmaW5lZCB9KTtcblxuICAgIGZpbHRlck1hdGNoTW9kZU9wdGlvbnMgPSB7XG4gICAgICAgIHRleHQ6IFtGaWx0ZXJNYXRjaE1vZGUuU1RBUlRTX1dJVEgsIEZpbHRlck1hdGNoTW9kZS5DT05UQUlOUywgRmlsdGVyTWF0Y2hNb2RlLk5PVF9DT05UQUlOUywgRmlsdGVyTWF0Y2hNb2RlLkVORFNfV0lUSCwgRmlsdGVyTWF0Y2hNb2RlLkVRVUFMUywgRmlsdGVyTWF0Y2hNb2RlLk5PVF9FUVVBTFNdLFxuICAgICAgICBudW1lcmljOiBbRmlsdGVyTWF0Y2hNb2RlLkVRVUFMUywgRmlsdGVyTWF0Y2hNb2RlLk5PVF9FUVVBTFMsIEZpbHRlck1hdGNoTW9kZS5MRVNTX1RIQU4sIEZpbHRlck1hdGNoTW9kZS5MRVNTX1RIQU5fT1JfRVFVQUxfVE8sIEZpbHRlck1hdGNoTW9kZS5HUkVBVEVSX1RIQU4sIEZpbHRlck1hdGNoTW9kZS5HUkVBVEVSX1RIQU5fT1JfRVFVQUxfVE9dLFxuICAgICAgICBkYXRlOiBbRmlsdGVyTWF0Y2hNb2RlLkRBVEVfSVMsIEZpbHRlck1hdGNoTW9kZS5EQVRFX0lTX05PVCwgRmlsdGVyTWF0Y2hNb2RlLkRBVEVfQkVGT1JFLCBGaWx0ZXJNYXRjaE1vZGUuREFURV9BRlRFUl1cbiAgICB9O1xuXG4gICAgcHVibGljIHRyYW5zbGF0aW9uOiBUcmFuc2xhdGlvbiA9IHtcbiAgICAgICAgc3RhcnRzV2l0aDogJ1N0YXJ0cyB3aXRoJyxcbiAgICAgICAgY29udGFpbnM6ICdDb250YWlucycsXG4gICAgICAgIG5vdENvbnRhaW5zOiAnTm90IGNvbnRhaW5zJyxcbiAgICAgICAgZW5kc1dpdGg6ICdFbmRzIHdpdGgnLFxuICAgICAgICBlcXVhbHM6ICdFcXVhbHMnLFxuICAgICAgICBub3RFcXVhbHM6ICdOb3QgZXF1YWxzJyxcbiAgICAgICAgbm9GaWx0ZXI6ICdObyBGaWx0ZXInLFxuICAgICAgICBsdDogJ0xlc3MgdGhhbicsXG4gICAgICAgIGx0ZTogJ0xlc3MgdGhhbiBvciBlcXVhbCB0bycsXG4gICAgICAgIGd0OiAnR3JlYXRlciB0aGFuJyxcbiAgICAgICAgZ3RlOiAnR3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvJyxcbiAgICAgICAgaXM6ICdJcycsXG4gICAgICAgIGlzTm90OiAnSXMgbm90JyxcbiAgICAgICAgYmVmb3JlOiAnQmVmb3JlJyxcbiAgICAgICAgYWZ0ZXI6ICdBZnRlcicsXG4gICAgICAgIGRhdGVJczogJ0RhdGUgaXMnLFxuICAgICAgICBkYXRlSXNOb3Q6ICdEYXRlIGlzIG5vdCcsXG4gICAgICAgIGRhdGVCZWZvcmU6ICdEYXRlIGlzIGJlZm9yZScsXG4gICAgICAgIGRhdGVBZnRlcjogJ0RhdGUgaXMgYWZ0ZXInLFxuICAgICAgICBjbGVhcjogJ0NsZWFyJyxcbiAgICAgICAgYXBwbHk6ICdBcHBseScsXG4gICAgICAgIG1hdGNoQWxsOiAnTWF0Y2ggQWxsJyxcbiAgICAgICAgbWF0Y2hBbnk6ICdNYXRjaCBBbnknLFxuICAgICAgICBhZGRSdWxlOiAnQWRkIFJ1bGUnLFxuICAgICAgICByZW1vdmVSdWxlOiAnUmVtb3ZlIFJ1bGUnLFxuICAgICAgICBhY2NlcHQ6ICdZZXMnLFxuICAgICAgICByZWplY3Q6ICdObycsXG4gICAgICAgIGNob29zZTogJ0Nob29zZScsXG4gICAgICAgIHVwbG9hZDogJ1VwbG9hZCcsXG4gICAgICAgIGNhbmNlbDogJ0NhbmNlbCcsXG4gICAgICAgIHBlbmRpbmc6ICdQZW5kaW5nJyxcbiAgICAgICAgZmlsZVNpemVUeXBlczogWydCJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJywgJ1BCJywgJ0VCJywgJ1pCJywgJ1lCJ10sXG4gICAgICAgIGRheU5hbWVzOiBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J10sXG4gICAgICAgIGRheU5hbWVzU2hvcnQ6IFsnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J10sXG4gICAgICAgIGRheU5hbWVzTWluOiBbJ1N1JywgJ01vJywgJ1R1JywgJ1dlJywgJ1RoJywgJ0ZyJywgJ1NhJ10sXG4gICAgICAgIG1vbnRoTmFtZXM6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxuICAgICAgICBtb250aE5hbWVzU2hvcnQ6IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXSxcbiAgICAgICAgY2hvb3NlWWVhcjogJ0Nob29zZSBZZWFyJyxcbiAgICAgICAgY2hvb3NlTW9udGg6ICdDaG9vc2UgTW9udGgnLFxuICAgICAgICBjaG9vc2VEYXRlOiAnQ2hvb3NlIERhdGUnLFxuICAgICAgICBwcmV2RGVjYWRlOiAnUHJldmlvdXMgRGVjYWRlJyxcbiAgICAgICAgbmV4dERlY2FkZTogJ05leHQgRGVjYWRlJyxcbiAgICAgICAgcHJldlllYXI6ICdQcmV2aW91cyBZZWFyJyxcbiAgICAgICAgbmV4dFllYXI6ICdOZXh0IFllYXInLFxuICAgICAgICBwcmV2TW9udGg6ICdQcmV2aW91cyBNb250aCcsXG4gICAgICAgIG5leHRNb250aDogJ05leHQgTW9udGgnLFxuICAgICAgICBwcmV2SG91cjogJ1ByZXZpb3VzIEhvdXInLFxuICAgICAgICBuZXh0SG91cjogJ05leHQgSG91cicsXG4gICAgICAgIHByZXZNaW51dGU6ICdQcmV2aW91cyBNaW51dGUnLFxuICAgICAgICBuZXh0TWludXRlOiAnTmV4dCBNaW51dGUnLFxuICAgICAgICBwcmV2U2Vjb25kOiAnUHJldmlvdXMgU2Vjb25kJyxcbiAgICAgICAgbmV4dFNlY29uZDogJ05leHQgU2Vjb25kJyxcbiAgICAgICAgYW06ICdhbScsXG4gICAgICAgIHBtOiAncG0nLFxuICAgICAgICBkYXRlRm9ybWF0OiAnbW0vZGQveXknLFxuICAgICAgICBmaXJzdERheU9mV2VlazogMCxcbiAgICAgICAgdG9kYXk6ICdUb2RheScsXG4gICAgICAgIHdlZWtIZWFkZXI6ICdXaycsXG4gICAgICAgIHdlYWs6ICdXZWFrJyxcbiAgICAgICAgbWVkaXVtOiAnTWVkaXVtJyxcbiAgICAgICAgc3Ryb25nOiAnU3Ryb25nJyxcbiAgICAgICAgcGFzc3dvcmRQcm9tcHQ6ICdFbnRlciBhIHBhc3N3b3JkJyxcbiAgICAgICAgZW1wdHlNZXNzYWdlOiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgIHNlYXJjaE1lc3NhZ2U6ICd7MH0gcmVzdWx0cyBhcmUgYXZhaWxhYmxlJyxcbiAgICAgICAgc2VsZWN0aW9uTWVzc2FnZTogJ3swfSBpdGVtcyBzZWxlY3RlZCcsXG4gICAgICAgIGVtcHR5U2VsZWN0aW9uTWVzc2FnZTogJ05vIHNlbGVjdGVkIGl0ZW0nLFxuICAgICAgICBlbXB0eVNlYXJjaE1lc3NhZ2U6ICdObyByZXN1bHRzIGZvdW5kJyxcbiAgICAgICAgZW1wdHlGaWx0ZXJNZXNzYWdlOiAnTm8gcmVzdWx0cyBmb3VuZCcsXG4gICAgICAgIGFyaWE6IHtcbiAgICAgICAgICAgIHRydWVMYWJlbDogJ1RydWUnLFxuICAgICAgICAgICAgZmFsc2VMYWJlbDogJ0ZhbHNlJyxcbiAgICAgICAgICAgIG51bGxMYWJlbDogJ05vdCBTZWxlY3RlZCcsXG4gICAgICAgICAgICBzdGFyOiAnMSBzdGFyJyxcbiAgICAgICAgICAgIHN0YXJzOiAne3N0YXJ9IHN0YXJzJyxcbiAgICAgICAgICAgIHNlbGVjdEFsbDogJ0FsbCBpdGVtcyBzZWxlY3RlZCcsXG4gICAgICAgICAgICB1bnNlbGVjdEFsbDogJ0FsbCBpdGVtcyB1bnNlbGVjdGVkJyxcbiAgICAgICAgICAgIGNsb3NlOiAnQ2xvc2UnLFxuICAgICAgICAgICAgcHJldmlvdXM6ICdQcmV2aW91cycsXG4gICAgICAgICAgICBuZXh0OiAnTmV4dCcsXG4gICAgICAgICAgICBuYXZpZ2F0aW9uOiAnTmF2aWdhdGlvbicsXG4gICAgICAgICAgICBzY3JvbGxUb3A6ICdTY3JvbGwgVG9wJyxcbiAgICAgICAgICAgIG1vdmVUb3A6ICdNb3ZlIFRvcCcsXG4gICAgICAgICAgICBtb3ZlVXA6ICdNb3ZlIFVwJyxcbiAgICAgICAgICAgIG1vdmVEb3duOiAnTW92ZSBEb3duJyxcbiAgICAgICAgICAgIG1vdmVCb3R0b206ICdNb3ZlIEJvdHRvbScsXG4gICAgICAgICAgICBtb3ZlVG9UYXJnZXQ6ICdNb3ZlIHRvIFRhcmdldCcsXG4gICAgICAgICAgICBtb3ZlVG9Tb3VyY2U6ICdNb3ZlIHRvIFNvdXJjZScsXG4gICAgICAgICAgICBtb3ZlQWxsVG9UYXJnZXQ6ICdNb3ZlIEFsbCB0byBUYXJnZXQnLFxuICAgICAgICAgICAgbW92ZUFsbFRvU291cmNlOiAnTW92ZSBBbGwgdG8gU291cmNlJyxcbiAgICAgICAgICAgIHBhZ2VMYWJlbDogJ3twYWdlfScsXG4gICAgICAgICAgICBmaXJzdFBhZ2VMYWJlbDogJ0ZpcnN0IFBhZ2UnLFxuICAgICAgICAgICAgbGFzdFBhZ2VMYWJlbDogJ0xhc3QgUGFnZScsXG4gICAgICAgICAgICBuZXh0UGFnZUxhYmVsOiAnTmV4dCBQYWdlJyxcbiAgICAgICAgICAgIHByZXZQYWdlTGFiZWw6ICdQcmV2aW91cyBQYWdlJyxcbiAgICAgICAgICAgIHJvd3NQZXJQYWdlTGFiZWw6ICdSb3dzIHBlciBwYWdlJyxcbiAgICAgICAgICAgIHByZXZpb3VzUGFnZUxhYmVsOiAnUHJldmlvdXMgUGFnZScsXG4gICAgICAgICAgICBqdW1wVG9QYWdlRHJvcGRvd25MYWJlbDogJ0p1bXAgdG8gUGFnZSBEcm9wZG93bicsXG4gICAgICAgICAgICBqdW1wVG9QYWdlSW5wdXRMYWJlbDogJ0p1bXAgdG8gUGFnZSBJbnB1dCcsXG4gICAgICAgICAgICBzZWxlY3RSb3c6ICdSb3cgU2VsZWN0ZWQnLFxuICAgICAgICAgICAgdW5zZWxlY3RSb3c6ICdSb3cgVW5zZWxlY3RlZCcsXG4gICAgICAgICAgICBleHBhbmRSb3c6ICdSb3cgRXhwYW5kZWQnLFxuICAgICAgICAgICAgY29sbGFwc2VSb3c6ICdSb3cgQ29sbGFwc2VkJyxcbiAgICAgICAgICAgIHNob3dGaWx0ZXJNZW51OiAnU2hvdyBGaWx0ZXIgTWVudScsXG4gICAgICAgICAgICBoaWRlRmlsdGVyTWVudTogJ0hpZGUgRmlsdGVyIE1lbnUnLFxuICAgICAgICAgICAgZmlsdGVyT3BlcmF0b3I6ICdGaWx0ZXIgT3BlcmF0b3InLFxuICAgICAgICAgICAgZmlsdGVyQ29uc3RyYWludDogJ0ZpbHRlciBDb25zdHJhaW50JyxcbiAgICAgICAgICAgIGVkaXRSb3c6ICdSb3cgRWRpdCcsXG4gICAgICAgICAgICBzYXZlRWRpdDogJ1NhdmUgRWRpdCcsXG4gICAgICAgICAgICBjYW5jZWxFZGl0OiAnQ2FuY2VsIEVkaXQnLFxuICAgICAgICAgICAgbGlzdFZpZXc6ICdMaXN0IFZpZXcnLFxuICAgICAgICAgICAgZ3JpZFZpZXc6ICdHcmlkIFZpZXcnLFxuICAgICAgICAgICAgc2xpZGU6ICdTbGlkZScsXG4gICAgICAgICAgICBzbGlkZU51bWJlcjogJ3tzbGlkZU51bWJlcn0nLFxuICAgICAgICAgICAgem9vbUltYWdlOiAnWm9vbSBJbWFnZScsXG4gICAgICAgICAgICB6b29tSW46ICdab29tIEluJyxcbiAgICAgICAgICAgIHpvb21PdXQ6ICdab29tIE91dCcsXG4gICAgICAgICAgICByb3RhdGVSaWdodDogJ1JvdGF0ZSBSaWdodCcsXG4gICAgICAgICAgICByb3RhdGVMZWZ0OiAnUm90YXRlIExlZnQnLFxuICAgICAgICAgICAgbGlzdExhYmVsOiAnT3B0aW9uIExpc3QnLFxuICAgICAgICAgICAgc2VsZWN0Q29sb3I6ICdTZWxlY3QgYSBjb2xvcicsXG4gICAgICAgICAgICByZW1vdmVMYWJlbDogJ1JlbW92ZScsXG4gICAgICAgICAgICBicm93c2VGaWxlczogJ0Jyb3dzZSBGaWxlcycsXG4gICAgICAgICAgICBtYXhpbWl6ZUxhYmVsOiAnTWF4aW1pemUnXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgekluZGV4OiBhbnkgPSB7XG4gICAgICAgIG1vZGFsOiAxMTAwLFxuICAgICAgICBvdmVybGF5OiAxMDAwLFxuICAgICAgICBtZW51OiAxMDAwLFxuICAgICAgICB0b29sdGlwOiAxMTAwXG4gICAgfTtcblxuICAgIHByaXZhdGUgdHJhbnNsYXRpb25Tb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cbiAgICB0cmFuc2xhdGlvbk9ic2VydmVyID0gdGhpcy50cmFuc2xhdGlvblNvdXJjZS5hc09ic2VydmFibGUoKTtcblxuICAgIGdldFRyYW5zbGF0aW9uKGtleTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25ba2V5IGFzIGtleW9mIHR5cGVvZiB0aGlzLnRyYW5zbGF0aW9uXTtcbiAgICB9XG5cbiAgICBzZXRUcmFuc2xhdGlvbih2YWx1ZTogVHJhbnNsYXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IHsgLi4udGhpcy50cmFuc2xhdGlvbiwgLi4udmFsdWUgfTtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvblNvdXJjZS5uZXh0KHRoaXMudHJhbnNsYXRpb24pO1xuICAgIH1cbn1cbiJdfQ==