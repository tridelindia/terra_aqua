import { Component } from '@angular/core';
import { BaseIcon } from 'primeng/baseicon';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
export class ArrowDownIcon extends BaseIcon {
    pathId;
    ngOnInit() {
        this.pathId = 'url(#' + UniqueComponentId() + ')';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ArrowDownIcon, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: ArrowDownIcon, isStandalone: true, selector: "ArrowDownIcon", usesInheritance: true, ngImport: i0, template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.99994 14C6.91097 14.0004 6.82281 13.983 6.74064 13.9489C6.65843 13.9148 6.58387 13.8646 6.52133 13.8013L1.10198 8.38193C0.982318 8.25351 0.917175 8.08367 0.920272 7.90817C0.923368 7.73267 0.994462 7.56523 1.11858 7.44111C1.24269 7.317 1.41014 7.2459 1.58563 7.2428C1.76113 7.23971 1.93098 7.30485 2.0594 7.42451L6.32263 11.6877V0.677419C6.32263 0.497756 6.394 0.325452 6.52104 0.198411C6.64808 0.0713706 6.82039 0 7.00005 0C7.17971 0 7.35202 0.0713706 7.47906 0.198411C7.6061 0.325452 7.67747 0.497756 7.67747 0.677419V11.6877L11.9407 7.42451C12.0691 7.30485 12.2389 7.23971 12.4144 7.2428C12.5899 7.2459 12.7574 7.317 12.8815 7.44111C13.0056 7.56523 13.0767 7.73267 13.0798 7.90817C13.0829 8.08367 13.0178 8.25351 12.8981 8.38193L7.47875 13.8013C7.41621 13.8646 7.34164 13.9148 7.25944 13.9489C7.17727 13.983 7.08912 14.0004 7.00015 14C7.00012 14 7.00009 14 7.00005 14C7.00001 14 6.99998 14 6.99994 14Z"
                    fill="currentColor"
                />
            </g>
            <defs>
                <clipPath [id]="pathId">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    `, isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: ArrowDownIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'ArrowDownIcon',
                    standalone: true,
                    imports: [BaseIcon],
                    template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.99994 14C6.91097 14.0004 6.82281 13.983 6.74064 13.9489C6.65843 13.9148 6.58387 13.8646 6.52133 13.8013L1.10198 8.38193C0.982318 8.25351 0.917175 8.08367 0.920272 7.90817C0.923368 7.73267 0.994462 7.56523 1.11858 7.44111C1.24269 7.317 1.41014 7.2459 1.58563 7.2428C1.76113 7.23971 1.93098 7.30485 2.0594 7.42451L6.32263 11.6877V0.677419C6.32263 0.497756 6.394 0.325452 6.52104 0.198411C6.64808 0.0713706 6.82039 0 7.00005 0C7.17971 0 7.35202 0.0713706 7.47906 0.198411C7.6061 0.325452 7.67747 0.497756 7.67747 0.677419V11.6877L11.9407 7.42451C12.0691 7.30485 12.2389 7.23971 12.4144 7.2428C12.5899 7.2459 12.7574 7.317 12.8815 7.44111C13.0056 7.56523 13.0767 7.73267 13.0798 7.90817C13.0829 8.08367 13.0178 8.25351 12.8981 8.38193L7.47875 13.8013C7.41621 13.8646 7.34164 13.9148 7.25944 13.9489C7.17727 13.983 7.08912 14.0004 7.00015 14C7.00012 14 7.00009 14 7.00005 14C7.00001 14 6.99998 14 6.99994 14Z"
                    fill="currentColor"
                />
            </g>
            <defs>
                <clipPath [id]="pathId">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    `
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyb3dkb3duLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2ljb25zL2Fycm93ZG93bi9hcnJvd2Rvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDOztBQXdCbEQsTUFBTSxPQUFPLGFBQWMsU0FBUSxRQUFRO0lBQ3ZDLE1BQU0sQ0FBUztJQUVmLFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUN0RCxDQUFDO3VHQUxRLGFBQWE7MkZBQWIsYUFBYSxnR0FsQlo7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7OzJGQUVRLGFBQWE7a0JBdEJ6QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxlQUFlO29CQUN6QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmFzZUljb24gfSBmcm9tICdwcmltZW5nL2Jhc2VpY29uJztcbmltcG9ydCB7IFVuaXF1ZUNvbXBvbmVudElkIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnQXJyb3dEb3duSWNvbicsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbQmFzZUljb25dLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxzdmcgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAxNCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCIgW2F0dHIuYXJpYS1oaWRkZW5dPVwiYXJpYUhpZGRlblwiIFthdHRyLnJvbGVdPVwicm9sZVwiIFtjbGFzc109XCJnZXRDbGFzc05hbWVzKClcIj5cbiAgICAgICAgICAgIDxnIFthdHRyLmNsaXAtcGF0aF09XCJwYXRoSWRcIj5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICBmaWxsLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgY2xpcC1ydWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgIGQ9XCJNNi45OTk5NCAxNEM2LjkxMDk3IDE0LjAwMDQgNi44MjI4MSAxMy45ODMgNi43NDA2NCAxMy45NDg5QzYuNjU4NDMgMTMuOTE0OCA2LjU4Mzg3IDEzLjg2NDYgNi41MjEzMyAxMy44MDEzTDEuMTAxOTggOC4zODE5M0MwLjk4MjMxOCA4LjI1MzUxIDAuOTE3MTc1IDguMDgzNjcgMC45MjAyNzIgNy45MDgxN0MwLjkyMzM2OCA3LjczMjY3IDAuOTk0NDYyIDcuNTY1MjMgMS4xMTg1OCA3LjQ0MTExQzEuMjQyNjkgNy4zMTcgMS40MTAxNCA3LjI0NTkgMS41ODU2MyA3LjI0MjhDMS43NjExMyA3LjIzOTcxIDEuOTMwOTggNy4zMDQ4NSAyLjA1OTQgNy40MjQ1MUw2LjMyMjYzIDExLjY4NzdWMC42Nzc0MTlDNi4zMjI2MyAwLjQ5Nzc1NiA2LjM5NCAwLjMyNTQ1MiA2LjUyMTA0IDAuMTk4NDExQzYuNjQ4MDggMC4wNzEzNzA2IDYuODIwMzkgMCA3LjAwMDA1IDBDNy4xNzk3MSAwIDcuMzUyMDIgMC4wNzEzNzA2IDcuNDc5MDYgMC4xOTg0MTFDNy42MDYxIDAuMzI1NDUyIDcuNjc3NDcgMC40OTc3NTYgNy42Nzc0NyAwLjY3NzQxOVYxMS42ODc3TDExLjk0MDcgNy40MjQ1MUMxMi4wNjkxIDcuMzA0ODUgMTIuMjM4OSA3LjIzOTcxIDEyLjQxNDQgNy4yNDI4QzEyLjU4OTkgNy4yNDU5IDEyLjc1NzQgNy4zMTcgMTIuODgxNSA3LjQ0MTExQzEzLjAwNTYgNy41NjUyMyAxMy4wNzY3IDcuNzMyNjcgMTMuMDc5OCA3LjkwODE3QzEzLjA4MjkgOC4wODM2NyAxMy4wMTc4IDguMjUzNTEgMTIuODk4MSA4LjM4MTkzTDcuNDc4NzUgMTMuODAxM0M3LjQxNjIxIDEzLjg2NDYgNy4zNDE2NCAxMy45MTQ4IDcuMjU5NDQgMTMuOTQ4OUM3LjE3NzI3IDEzLjk4MyA3LjA4OTEyIDE0LjAwMDQgNy4wMDAxNSAxNEM3LjAwMDEyIDE0IDcuMDAwMDkgMTQgNy4wMDAwNSAxNEM3LjAwMDAxIDE0IDYuOTk5OTggMTQgNi45OTk5NCAxNFpcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgPGNsaXBQYXRoIFtpZF09XCJwYXRoSWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICA8L3N2Zz5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIEFycm93RG93bkljb24gZXh0ZW5kcyBCYXNlSWNvbiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgcGF0aElkOiBzdHJpbmc7XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYXRoSWQgPSAndXJsKCMnICsgVW5pcXVlQ29tcG9uZW50SWQoKSArICcpJztcbiAgICB9XG59XG4iXX0=