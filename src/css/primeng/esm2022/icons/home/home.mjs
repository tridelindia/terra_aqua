import { Component } from '@angular/core';
import { BaseIcon } from 'primeng/baseicon';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
export class HomeIcon extends BaseIcon {
    pathId;
    ngOnInit() {
        this.pathId = 'url(#' + UniqueComponentId() + ')';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: HomeIcon, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: HomeIcon, isStandalone: true, selector: "HomeIcon", usesInheritance: true, ngImport: i0, template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.4175 6.79971C13.2874 6.80029 13.1608 6.75807 13.057 6.67955L12.4162 6.19913V12.6073C12.4141 12.7659 12.3502 12.9176 12.2379 13.0298C12.1257 13.142 11.9741 13.206 11.8154 13.208H8.61206C8.61179 13.208 8.61151 13.208 8.61123 13.2081C8.61095 13.208 8.61068 13.208 8.6104 13.208H5.41076C5.40952 13.208 5.40829 13.2081 5.40705 13.2081C5.40581 13.2081 5.40458 13.208 5.40334 13.208H2.20287C2.04418 13.206 1.89257 13.142 1.78035 13.0298C1.66813 12.9176 1.60416 12.7659 1.60209 12.6073V6.19914L0.961256 6.67955C0.833786 6.77515 0.673559 6.8162 0.515823 6.79367C0.358086 6.77114 0.215762 6.68686 0.120159 6.55939C0.0245566 6.43192 -0.0164931 6.2717 0.00604063 6.11396C0.0285744 5.95622 0.112846 5.8139 0.240316 5.7183L1.83796 4.52007L1.84689 4.51337L6.64868 0.912027C6.75267 0.834032 6.87915 0.79187 7.00915 0.79187C7.13914 0.79187 7.26562 0.834032 7.36962 0.912027L12.1719 4.51372L12.1799 4.51971L13.778 5.7183C13.8943 5.81278 13.9711 5.94732 13.9934 6.09553C14.0156 6.24373 13.9816 6.39489 13.8981 6.51934C13.8471 6.60184 13.7766 6.67054 13.6928 6.71942C13.609 6.76831 13.5144 6.79587 13.4175 6.79971ZM6.00783 12.0065H8.01045V7.60074H6.00783V12.0065ZM9.21201 12.0065V6.99995C9.20994 6.84126 9.14598 6.68965 9.03375 6.57743C8.92153 6.46521 8.76992 6.40124 8.61123 6.39917H5.40705C5.24836 6.40124 5.09675 6.46521 4.98453 6.57743C4.8723 6.68965 4.80834 6.84126 4.80627 6.99995V12.0065H2.80366V5.29836L7.00915 2.14564L11.2146 5.29836V12.0065H9.21201Z"
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: HomeIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'HomeIcon',
                    standalone: true,
                    imports: [BaseIcon],
                    template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.4175 6.79971C13.2874 6.80029 13.1608 6.75807 13.057 6.67955L12.4162 6.19913V12.6073C12.4141 12.7659 12.3502 12.9176 12.2379 13.0298C12.1257 13.142 11.9741 13.206 11.8154 13.208H8.61206C8.61179 13.208 8.61151 13.208 8.61123 13.2081C8.61095 13.208 8.61068 13.208 8.6104 13.208H5.41076C5.40952 13.208 5.40829 13.2081 5.40705 13.2081C5.40581 13.2081 5.40458 13.208 5.40334 13.208H2.20287C2.04418 13.206 1.89257 13.142 1.78035 13.0298C1.66813 12.9176 1.60416 12.7659 1.60209 12.6073V6.19914L0.961256 6.67955C0.833786 6.77515 0.673559 6.8162 0.515823 6.79367C0.358086 6.77114 0.215762 6.68686 0.120159 6.55939C0.0245566 6.43192 -0.0164931 6.2717 0.00604063 6.11396C0.0285744 5.95622 0.112846 5.8139 0.240316 5.7183L1.83796 4.52007L1.84689 4.51337L6.64868 0.912027C6.75267 0.834032 6.87915 0.79187 7.00915 0.79187C7.13914 0.79187 7.26562 0.834032 7.36962 0.912027L12.1719 4.51372L12.1799 4.51971L13.778 5.7183C13.8943 5.81278 13.9711 5.94732 13.9934 6.09553C14.0156 6.24373 13.9816 6.39489 13.8981 6.51934C13.8471 6.60184 13.7766 6.67054 13.6928 6.71942C13.609 6.76831 13.5144 6.79587 13.4175 6.79971ZM6.00783 12.0065H8.01045V7.60074H6.00783V12.0065ZM9.21201 12.0065V6.99995C9.20994 6.84126 9.14598 6.68965 9.03375 6.57743C8.92153 6.46521 8.76992 6.40124 8.61123 6.39917H5.40705C5.24836 6.40124 5.09675 6.46521 4.98453 6.57743C4.8723 6.68965 4.80834 6.84126 4.80627 6.99995V12.0065H2.80366V5.29836L7.00915 2.14564L11.2146 5.29836V12.0065H9.21201Z"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9pY29ucy9ob21lL2hvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDOztBQXdCbEQsTUFBTSxPQUFPLFFBQVMsU0FBUSxRQUFRO0lBQ2xDLE1BQU0sQ0FBUztJQUVmLFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUN0RCxDQUFDO3VHQUxRLFFBQVE7MkZBQVIsUUFBUSwyRkFsQlA7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7OzJGQUVRLFFBQVE7a0JBdEJwQixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxVQUFVO29CQUNwQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlQ7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2VJY29uIH0gZnJvbSAncHJpbWVuZy9iYXNlaWNvbic7XG5pbXBvcnQgeyBVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ0hvbWVJY29uJyxcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtCYXNlSWNvbl0sXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJhcmlhSGlkZGVuXCIgW2F0dHIucm9sZV09XCJyb2xlXCIgW2NsYXNzXT1cImdldENsYXNzTmFtZXMoKVwiPlxuICAgICAgICAgICAgPGcgW2F0dHIuY2xpcC1wYXRoXT1cInBhdGhJZFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgIGZpbGwtcnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgICBjbGlwLXJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgICAgZD1cIk0xMy40MTc1IDYuNzk5NzFDMTMuMjg3NCA2LjgwMDI5IDEzLjE2MDggNi43NTgwNyAxMy4wNTcgNi42Nzk1NUwxMi40MTYyIDYuMTk5MTNWMTIuNjA3M0MxMi40MTQxIDEyLjc2NTkgMTIuMzUwMiAxMi45MTc2IDEyLjIzNzkgMTMuMDI5OEMxMi4xMjU3IDEzLjE0MiAxMS45NzQxIDEzLjIwNiAxMS44MTU0IDEzLjIwOEg4LjYxMjA2QzguNjExNzkgMTMuMjA4IDguNjExNTEgMTMuMjA4IDguNjExMjMgMTMuMjA4MUM4LjYxMDk1IDEzLjIwOCA4LjYxMDY4IDEzLjIwOCA4LjYxMDQgMTMuMjA4SDUuNDEwNzZDNS40MDk1MiAxMy4yMDggNS40MDgyOSAxMy4yMDgxIDUuNDA3MDUgMTMuMjA4MUM1LjQwNTgxIDEzLjIwODEgNS40MDQ1OCAxMy4yMDggNS40MDMzNCAxMy4yMDhIMi4yMDI4N0MyLjA0NDE4IDEzLjIwNiAxLjg5MjU3IDEzLjE0MiAxLjc4MDM1IDEzLjAyOThDMS42NjgxMyAxMi45MTc2IDEuNjA0MTYgMTIuNzY1OSAxLjYwMjA5IDEyLjYwNzNWNi4xOTkxNEwwLjk2MTI1NiA2LjY3OTU1QzAuODMzNzg2IDYuNzc1MTUgMC42NzM1NTkgNi44MTYyIDAuNTE1ODIzIDYuNzkzNjdDMC4zNTgwODYgNi43NzExNCAwLjIxNTc2MiA2LjY4Njg2IDAuMTIwMTU5IDYuNTU5MzlDMC4wMjQ1NTY2IDYuNDMxOTIgLTAuMDE2NDkzMSA2LjI3MTcgMC4wMDYwNDA2MyA2LjExMzk2QzAuMDI4NTc0NCA1Ljk1NjIyIDAuMTEyODQ2IDUuODEzOSAwLjI0MDMxNiA1LjcxODNMMS44Mzc5NiA0LjUyMDA3TDEuODQ2ODkgNC41MTMzN0w2LjY0ODY4IDAuOTEyMDI3QzYuNzUyNjcgMC44MzQwMzIgNi44NzkxNSAwLjc5MTg3IDcuMDA5MTUgMC43OTE4N0M3LjEzOTE0IDAuNzkxODcgNy4yNjU2MiAwLjgzNDAzMiA3LjM2OTYyIDAuOTEyMDI3TDEyLjE3MTkgNC41MTM3MkwxMi4xNzk5IDQuNTE5NzFMMTMuNzc4IDUuNzE4M0MxMy44OTQzIDUuODEyNzggMTMuOTcxMSA1Ljk0NzMyIDEzLjk5MzQgNi4wOTU1M0MxNC4wMTU2IDYuMjQzNzMgMTMuOTgxNiA2LjM5NDg5IDEzLjg5ODEgNi41MTkzNEMxMy44NDcxIDYuNjAxODQgMTMuNzc2NiA2LjY3MDU0IDEzLjY5MjggNi43MTk0MkMxMy42MDkgNi43NjgzMSAxMy41MTQ0IDYuNzk1ODcgMTMuNDE3NSA2Ljc5OTcxWk02LjAwNzgzIDEyLjAwNjVIOC4wMTA0NVY3LjYwMDc0SDYuMDA3ODNWMTIuMDA2NVpNOS4yMTIwMSAxMi4wMDY1VjYuOTk5OTVDOS4yMDk5NCA2Ljg0MTI2IDkuMTQ1OTggNi42ODk2NSA5LjAzMzc1IDYuNTc3NDNDOC45MjE1MyA2LjQ2NTIxIDguNzY5OTIgNi40MDEyNCA4LjYxMTIzIDYuMzk5MTdINS40MDcwNUM1LjI0ODM2IDYuNDAxMjQgNS4wOTY3NSA2LjQ2NTIxIDQuOTg0NTMgNi41Nzc0M0M0Ljg3MjMgNi42ODk2NSA0LjgwODM0IDYuODQxMjYgNC44MDYyNyA2Ljk5OTk1VjEyLjAwNjVIMi44MDM2NlY1LjI5ODM2TDcuMDA5MTUgMi4xNDU2NEwxMS4yMTQ2IDUuMjk4MzZWMTIuMDA2NUg5LjIxMjAxWlwiXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICA8Y2xpcFBhdGggW2lkXT1cInBhdGhJZFwiPlxuICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgIDwvc3ZnPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgSG9tZUljb24gZXh0ZW5kcyBCYXNlSWNvbiB7XG4gICAgcGF0aElkOiBzdHJpbmc7XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5wYXRoSWQgPSAndXJsKCMnICsgVW5pcXVlQ29tcG9uZW50SWQoKSArICcpJztcbiAgICB9XG59XG4iXX0=