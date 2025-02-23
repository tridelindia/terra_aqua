import { Component } from '@angular/core';
import { BaseIcon } from 'primeng/baseicon';
import { UniqueComponentId } from 'primeng/utils';
import * as i0 from "@angular/core";
export class SpinnerIcon extends BaseIcon {
    pathId;
    ngOnInit() {
        this.pathId = 'url(#' + UniqueComponentId() + ')';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpinnerIcon, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.1", type: SpinnerIcon, isStandalone: true, selector: "SpinnerIcon", usesInheritance: true, ngImport: i0, template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.1", ngImport: i0, type: SpinnerIcon, decorators: [{
            type: Component,
            args: [{
                    selector: 'SpinnerIcon',
                    standalone: true,
                    imports: [BaseIcon],
                    template: `
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="ariaLabel" [attr.aria-hidden]="ariaHidden" [attr.role]="role" [class]="getClassNames()">
            <g [attr.clip-path]="pathId">
                <path
                    d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bpbm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9pY29ucy9zcGlubmVyL3NwaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDOztBQXNCbEQsTUFBTSxPQUFPLFdBQVksU0FBUSxRQUFRO0lBQ3JDLE1BQU0sQ0FBUztJQUVmLFFBQVE7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUN0RCxDQUFDO3VHQUxRLFdBQVc7MkZBQVgsV0FBVyw4RkFoQlY7Ozs7Ozs7Ozs7Ozs7O0tBY1Q7OzJGQUVRLFdBQVc7a0JBcEJ2QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO29CQUN2QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQUNuQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7O0tBY1Q7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJhc2VJY29uIH0gZnJvbSAncHJpbWVuZy9iYXNlaWNvbic7XG5pbXBvcnQgeyBVbmlxdWVDb21wb25lbnRJZCB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ1NwaW5uZXJJY29uJyxcbiAgICBzdGFuZGFsb25lOiB0cnVlLFxuICAgIGltcG9ydHM6IFtCYXNlSWNvbl0sXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDE0IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJhcmlhSGlkZGVuXCIgW2F0dHIucm9sZV09XCJyb2xlXCIgW2NsYXNzXT1cImdldENsYXNzTmFtZXMoKVwiPlxuICAgICAgICAgICAgPGcgW2F0dHIuY2xpcC1wYXRoXT1cInBhdGhJZFwiPlxuICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgIGQ9XCJNNi45OTcwMSAxNEM1Ljg1NDQxIDEzLjk5OSA0LjcyOTM5IDEzLjcxODYgMy43MjAxMiAxMy4xODMyQzIuNzEwODQgMTIuNjQ3OCAxLjg0Nzk1IDExLjg3MzcgMS4yMDY3MyAxMC45Mjg0QzAuNTY1NTA0IDkuOTgzMDUgMC4xNjU0MjQgOC44OTUyNiAwLjA0MTM4NyA3Ljc1OTg5Qy0wLjA4MjY0OTYgNi42MjQ1MyAwLjA3MzEyNSA1LjQ3NjA3IDAuNDk1MTIyIDQuNDE0N0MwLjkxNzExOSAzLjM1MzMzIDEuNTkyNTIgMi40MTEzIDIuNDYyNDEgMS42NzA3N0MzLjMzMjI5IDAuOTMwMjQ3IDQuMzcwMjQgMC40MTM3MjkgNS40ODU3IDAuMTY2Mjc1QzYuNjAxMTcgLTAuMDgxMTc5NiA3Ljc2MDI2IC0wLjA1MjA1MzUgOC44NjE4OCAwLjI1MTExMkM5Ljk2MzUgMC41NTQyNzggMTAuOTc0MiAxLjEyMjI3IDExLjgwNTcgMS45MDU1NUMxMS45MTUgMi4wMTQ5MyAxMS45NzY0IDIuMTYzMTkgMTEuOTc2NCAyLjMxNzc4QzExLjk3NjQgMi40NzIzNiAxMS45MTUgMi42MjA2MiAxMS44MDU3IDIuNzNDMTEuNzUyMSAyLjc4NTAzIDExLjY4OCAyLjgyODc3IDExLjYxNzEgMi44NTg2NEMxMS41NDYzIDIuODg4NSAxMS40NzAyIDIuOTAzODkgMTEuMzkzMyAyLjkwMzg5QzExLjMxNjUgMi45MDM4OSAxMS4yNDA0IDIuODg4NSAxMS4xNjk1IDIuODU4NjRDMTEuMDk4NyAyLjgyODc3IDExLjAzNDYgMi43ODUwMyAxMC45ODA5IDIuNzNDOS45OTk4IDEuODEyNzMgOC43MzI0NiAxLjI2MTM4IDcuMzkyMjYgMS4xNjg3NkM2LjA1MjA2IDEuMDc2MTUgNC43MjA4NiAxLjQ0Nzk0IDMuNjIyNzkgMi4yMjE1MkMyLjUyNDcxIDIuOTk1MTEgMS43MjY4MyA0LjEyMzI1IDEuMzYzNDUgNS40MTYwMkMxLjAwMDA4IDYuNzA4NzkgMS4wOTM0MiA4LjA4NzIzIDEuNjI3NzUgOS4zMTkyNkMyLjE2MjA5IDEwLjU1MTMgMy4xMDQ3OCAxMS41NjE3IDQuMjk3MTMgMTIuMTgwM0M1LjQ4OTQ3IDEyLjc5ODkgNi44NTg2NSAxMi45ODggOC4xNzQxNCAxMi43MTU3QzkuNDg5NjMgMTIuNDQzNSAxMC42NzExIDExLjcyNjQgMTEuNTE5NiAxMC42ODU0QzEyLjM2ODEgOS42NDQzMiAxMi44MzE5IDguMzQyODIgMTIuODMyOCA3QzEyLjgzMjggNi44NDUyOSAxMi44OTQzIDYuNjk2OTIgMTMuMDAzOCA2LjU4NzUyQzEzLjExMzIgNi40NzgxMiAxMy4yNjE2IDYuNDE2NjcgMTMuNDE2NCA2LjQxNjY3QzEzLjU3MTIgNi40MTY2NyAxMy43MTk2IDYuNDc4MTIgMTMuODI5MSA2LjU4NzUyQzEzLjkzODUgNi42OTY5MiAxNCA2Ljg0NTI5IDE0IDdDMTQgOC44NTY1MSAxMy4yNjIyIDEwLjYzNyAxMS45NDg5IDExLjk0OTdDMTAuNjM1NiAxMy4yNjI1IDguODU0MzIgMTQgNi45OTcwMSAxNFpcIlxuICAgICAgICAgICAgICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgPGNsaXBQYXRoIFtpZF09XCJwYXRoSWRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICAgICAgICA8L2NsaXBQYXRoPlxuICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICA8L3N2Zz5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIFNwaW5uZXJJY29uIGV4dGVuZHMgQmFzZUljb24ge1xuICAgIHBhdGhJZDogc3RyaW5nO1xuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMucGF0aElkID0gJ3VybCgjJyArIFVuaXF1ZUNvbXBvbmVudElkKCkgKyAnKSc7XG4gICAgfVxufVxuIl19