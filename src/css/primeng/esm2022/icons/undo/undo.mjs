import { Component } from '@angular/core';
import { BaseIcon } from 'primeng/baseicon';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
export class UndoIcon extends BaseIcon {
    pathId;
    ngOnInit() {
        this.pathId = 'url(#' + UniqueComponentId() + ')';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: UndoIcon, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: UndoIcon, isStandalone: true, selector: "UndoIcon", usesInheritance: true, ngImport: i0, template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.77042 5.96336C6.84315 5.99355 6.92118 6.00891 6.99993 6.00854C7.07868 6.00891 7.15671 5.99355 7.22944 5.96336C7.30217 5.93317 7.36814 5.88876 7.42348 5.83273C7.53572 5.72035 7.59876 5.56801 7.59876 5.40918C7.59876 5.25035 7.53572 5.09802 7.42348 4.98564L6.04897 3.61113H6.99998C7.9088 3.61113 8.79722 3.88063 9.55288 4.38554C10.3085 4.89046 10.8975 5.60811 11.2453 6.44776C11.5931 7.2874 11.6841 8.21132 11.5068 9.10268C11.3295 9.99404 10.8918 10.8128 10.2492 11.4554C9.60657 12.0981 8.7878 12.5357 7.89644 12.713C7.00508 12.8903 6.08116 12.7993 5.24152 12.4515C4.40188 12.1037 3.68422 11.5148 3.17931 10.7591C2.67439 10.0035 2.4049 9.11504 2.4049 8.20622C2.4049 8.04726 2.34175 7.89481 2.22935 7.78241C2.11695 7.67001 1.9645 7.60686 1.80554 7.60686C1.64658 7.60686 1.49413 7.67001 1.38172 7.78241C1.26932 7.89481 1.20618 8.04726 1.20618 8.20622C1.20829 9.74218 1.81939 11.2146 2.90548 12.3007C3.99157 13.3868 5.46402 13.9979 6.99998 14C8.5366 14 10.0103 13.3896 11.0968 12.3031C12.1834 11.2165 12.7938 9.74283 12.7938 8.20622C12.7938 6.66961 12.1834 5.19593 11.0968 4.10938C10.0103 3.02283 8.5366 2.41241 6.99998 2.41241H6.04892L7.42348 1.03786C7.48236 0.982986 7.5296 0.916817 7.56235 0.843296C7.59511 0.769775 7.61273 0.690409 7.61415 0.609933C7.61557 0.529456 7.60076 0.449519 7.57062 0.374888C7.54047 0.300257 7.49561 0.232462 7.43869 0.175548C7.38178 0.118634 7.31398 0.0737664 7.23935 0.0436218C7.16472 0.0134773 7.08478 -0.00132663 7.00431 9.32772e-05C6.92383 0.00151319 6.84447 0.019128 6.77095 0.0518865C6.69742 0.0846451 6.63126 0.131876 6.57638 0.190763L4.17895 2.5882C4.06671 2.70058 4.00366 2.85292 4.00366 3.01175C4.00366 3.17058 4.06671 3.32291 4.17895 3.43529L6.57638 5.83273C6.63172 5.88876 6.69769 5.93317 6.77042 5.96336Z"
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: UndoIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'UndoIcon',
                    standalone: true,
                    imports: [BaseIcon],
                    template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.77042 5.96336C6.84315 5.99355 6.92118 6.00891 6.99993 6.00854C7.07868 6.00891 7.15671 5.99355 7.22944 5.96336C7.30217 5.93317 7.36814 5.88876 7.42348 5.83273C7.53572 5.72035 7.59876 5.56801 7.59876 5.40918C7.59876 5.25035 7.53572 5.09802 7.42348 4.98564L6.04897 3.61113H6.99998C7.9088 3.61113 8.79722 3.88063 9.55288 4.38554C10.3085 4.89046 10.8975 5.60811 11.2453 6.44776C11.5931 7.2874 11.6841 8.21132 11.5068 9.10268C11.3295 9.99404 10.8918 10.8128 10.2492 11.4554C9.60657 12.0981 8.7878 12.5357 7.89644 12.713C7.00508 12.8903 6.08116 12.7993 5.24152 12.4515C4.40188 12.1037 3.68422 11.5148 3.17931 10.7591C2.67439 10.0035 2.4049 9.11504 2.4049 8.20622C2.4049 8.04726 2.34175 7.89481 2.22935 7.78241C2.11695 7.67001 1.9645 7.60686 1.80554 7.60686C1.64658 7.60686 1.49413 7.67001 1.38172 7.78241C1.26932 7.89481 1.20618 8.04726 1.20618 8.20622C1.20829 9.74218 1.81939 11.2146 2.90548 12.3007C3.99157 13.3868 5.46402 13.9979 6.99998 14C8.5366 14 10.0103 13.3896 11.0968 12.3031C12.1834 11.2165 12.7938 9.74283 12.7938 8.20622C12.7938 6.66961 12.1834 5.19593 11.0968 4.10938C10.0103 3.02283 8.5366 2.41241 6.99998 2.41241H6.04892L7.42348 1.03786C7.48236 0.982986 7.5296 0.916817 7.56235 0.843296C7.59511 0.769775 7.61273 0.690409 7.61415 0.609933C7.61557 0.529456 7.60076 0.449519 7.57062 0.374888C7.54047 0.300257 7.49561 0.232462 7.43869 0.175548C7.38178 0.118634 7.31398 0.0737664 7.23935 0.0436218C7.16472 0.0134773 7.08478 -0.00132663 7.00431 9.32772e-05C6.92383 0.00151319 6.84447 0.019128 6.77095 0.0518865C6.69742 0.0846451 6.63126 0.131876 6.57638 0.190763L4.17895 2.5882C4.06671 2.70058 4.00366 2.85292 4.00366 3.01175C4.00366 3.17058 4.06671 3.32291 4.17895 3.43529L6.57638 5.83273C6.63172 5.88876 6.69769 5.93317 6.77042 5.96336Z"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9pY29ucy91bmRvL3VuZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDOztBQXdCbEQsTUFBTSxPQUFPLFFBQVMsU0FBUSxRQUFRO0lBQ2xDLE1BQU0sQ0FBUztJQUVmLFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUN0RCxDQUFDO3VHQUxRLFFBQVE7MkZBQVIsUUFBUSwyRkFsQlA7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7OzJGQUVRLFFBQVE7a0JBdEJwQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxVQUFVO29CQUNwQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2VJY29uIH0gZnJvbSAncHJpbWVuZy9iYXNlaWNvbic7XG5pbXBvcnQgeyBVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ1VuZG9JY29uJyxcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtCYXNlSWNvbl0sXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJhcmlhSGlkZGVuXCIgW2F0dHIucm9sZV09XCJyb2xlXCIgW2NsYXNzXT1cImdldENsYXNzTmFtZXMoKVwiPlxuICAgICAgICAgICAgPGcgW2F0dHIuY2xpcC1wYXRoXT1cInBhdGhJZFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICBjbGlwLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgZD1cIk02Ljc3MDQyIDUuOTYzMzZDNi44NDMxNSA1Ljk5MzU1IDYuOTIxMTggNi4wMDg5MSA2Ljk5OTkzIDYuMDA4NTRDNy4wNzg2OCA2LjAwODkxIDcuMTU2NzEgNS45OTM1NSA3LjIyOTQ0IDUuOTYzMzZDNy4zMDIxNyA1LjkzMzE3IDcuMzY4MTQgNS44ODg3NiA3LjQyMzQ4IDUuODMyNzNDNy41MzU3MiA1LjcyMDM1IDcuNTk4NzYgNS41NjgwMSA3LjU5ODc2IDUuNDA5MThDNy41OTg3NiA1LjI1MDM1IDcuNTM1NzIgNS4wOTgwMiA3LjQyMzQ4IDQuOTg1NjRMNi4wNDg5NyAzLjYxMTEzSDYuOTk5OThDNy45MDg4IDMuNjExMTMgOC43OTcyMiAzLjg4MDYzIDkuNTUyODggNC4zODU1NEMxMC4zMDg1IDQuODkwNDYgMTAuODk3NSA1LjYwODExIDExLjI0NTMgNi40NDc3NkMxMS41OTMxIDcuMjg3NCAxMS42ODQxIDguMjExMzIgMTEuNTA2OCA5LjEwMjY4QzExLjMyOTUgOS45OTQwNCAxMC44OTE4IDEwLjgxMjggMTAuMjQ5MiAxMS40NTU0QzkuNjA2NTcgMTIuMDk4MSA4Ljc4NzggMTIuNTM1NyA3Ljg5NjQ0IDEyLjcxM0M3LjAwNTA4IDEyLjg5MDMgNi4wODExNiAxMi43OTkzIDUuMjQxNTIgMTIuNDUxNUM0LjQwMTg4IDEyLjEwMzcgMy42ODQyMiAxMS41MTQ4IDMuMTc5MzEgMTAuNzU5MUMyLjY3NDM5IDEwLjAwMzUgMi40MDQ5IDkuMTE1MDQgMi40MDQ5IDguMjA2MjJDMi40MDQ5IDguMDQ3MjYgMi4zNDE3NSA3Ljg5NDgxIDIuMjI5MzUgNy43ODI0MUMyLjExNjk1IDcuNjcwMDEgMS45NjQ1IDcuNjA2ODYgMS44MDU1NCA3LjYwNjg2QzEuNjQ2NTggNy42MDY4NiAxLjQ5NDEzIDcuNjcwMDEgMS4zODE3MiA3Ljc4MjQxQzEuMjY5MzIgNy44OTQ4MSAxLjIwNjE4IDguMDQ3MjYgMS4yMDYxOCA4LjIwNjIyQzEuMjA4MjkgOS43NDIxOCAxLjgxOTM5IDExLjIxNDYgMi45MDU0OCAxMi4zMDA3QzMuOTkxNTcgMTMuMzg2OCA1LjQ2NDAyIDEzLjk5NzkgNi45OTk5OCAxNEM4LjUzNjYgMTQgMTAuMDEwMyAxMy4zODk2IDExLjA5NjggMTIuMzAzMUMxMi4xODM0IDExLjIxNjUgMTIuNzkzOCA5Ljc0MjgzIDEyLjc5MzggOC4yMDYyMkMxMi43OTM4IDYuNjY5NjEgMTIuMTgzNCA1LjE5NTkzIDExLjA5NjggNC4xMDkzOEMxMC4wMTAzIDMuMDIyODMgOC41MzY2IDIuNDEyNDEgNi45OTk5OCAyLjQxMjQxSDYuMDQ4OTJMNy40MjM0OCAxLjAzNzg2QzcuNDgyMzYgMC45ODI5ODYgNy41Mjk2IDAuOTE2ODE3IDcuNTYyMzUgMC44NDMyOTZDNy41OTUxMSAwLjc2OTc3NSA3LjYxMjczIDAuNjkwNDA5IDcuNjE0MTUgMC42MDk5MzNDNy42MTU1NyAwLjUyOTQ1NiA3LjYwMDc2IDAuNDQ5NTE5IDcuNTcwNjIgMC4zNzQ4ODhDNy41NDA0NyAwLjMwMDI1NyA3LjQ5NTYxIDAuMjMyNDYyIDcuNDM4NjkgMC4xNzU1NDhDNy4zODE3OCAwLjExODYzNCA3LjMxMzk4IDAuMDczNzY2NCA3LjIzOTM1IDAuMDQzNjIxOEM3LjE2NDcyIDAuMDEzNDc3MyA3LjA4NDc4IC0wLjAwMTMyNjYzIDcuMDA0MzEgOS4zMjc3MmUtMDVDNi45MjM4MyAwLjAwMTUxMzE5IDYuODQ0NDcgMC4wMTkxMjggNi43NzA5NSAwLjA1MTg4NjVDNi42OTc0MiAwLjA4NDY0NTEgNi42MzEyNiAwLjEzMTg3NiA2LjU3NjM4IDAuMTkwNzYzTDQuMTc4OTUgMi41ODgyQzQuMDY2NzEgMi43MDA1OCA0LjAwMzY2IDIuODUyOTIgNC4wMDM2NiAzLjAxMTc1QzQuMDAzNjYgMy4xNzA1OCA0LjA2NjcxIDMuMzIyOTEgNC4xNzg5NSAzLjQzNTI5TDYuNTc2MzggNS44MzI3M0M2LjYzMTcyIDUuODg4NzYgNi42OTc2OSA1LjkzMzE3IDYuNzcwNDIgNS45NjMzNlpcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgPGNsaXBQYXRoIFtpZF09XCJwYXRoSWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICA8L3N2Zz5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIFVuZG9JY29uIGV4dGVuZHMgQmFzZUljb24ge1xuICAgIHBhdGhJZDogc3RyaW5nO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGF0aElkID0gJ3VybCgjJyArIFVuaXF1ZUNvbXBvbmVudElkKCkgKyAnKSc7XG4gICAgfVxufVxuIl19