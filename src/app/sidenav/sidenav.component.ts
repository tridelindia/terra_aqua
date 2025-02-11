import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../login/login.component';
import { use } from 'echarts';
import { ConfigDataService } from '../config-data.service';
import { ThemeService } from '../theme_service/theme.service';
 
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, ToastrModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  currentTheme: string = 'dark';
  username!: string;
  currentPage: string = '';
  constructor(
    private layout: LayoutComponent,
    private router: Router,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private user: ConfigDataService,
    private themeservice: ThemeService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe(() => {
      this.currentPage = this.router.url.split('/').pop()?.toLowerCase() || '';
    });
  }
  isPageSelected(page: string): boolean {
    const currentUrlPage = this.router.url.split('/').pop();
    // //console.log('url', currentUrlPage, page);
    // //console.log('pagename', page);
 
    return page.toLowerCase() === this.currentPage;
  }
  onPageChange(name: String) {
    this.currentPage = this.router.url.split('/').pop()?.toLowerCase() || '';
    this.cdr.detectChanges();
    // this.router.navigate(['/base', name]);
    // this.route.paramMap.subscribe(params => {
    //   this.layout.page = params.get('page') || name;
    // });
    if (name === 'Dashboard') {
      this.toastr.warning(
        'Please Select the station to view Live Data',
        'Warning!'
      );
    } else {
      this.layout.page = name.toLowerCase();
      // this.layout.page = name;
      this.router.navigate([`/base/${name.toLowerCase()}`]);
      //console.log(`tapped page-==>${name.toLowerCase()}`);
      // this.router.navigate(['/base', name]);
      if (this.layout.page === 'logout') {
        this.router.navigate(['/login']);
      } else if (this.layout.page == 'Home') {
        this.layout.page = name;
        // this.router.navigate(['/base', name]);
        // window.location.reload(
 
        // );
        this.router.navigate([`/base/${name.toLowerCase()}`]);
        setTimeout(() => {
          window.location.reload();
        }, 500);
        //  // Forces a full-page reload
      }
    }
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage =
          this.router.url.split('/').pop()?.toLowerCase() || '';
        //console.log('page changed', this.currentPage);
      }
    });
    //console.log('hai sidenav');
    this.username = localStorage.getItem('username') ?? '';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );
 
    const updateTheme = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.currentTheme = 'dark';
        this.renderer.setAttribute(
          document.body,
          'data-theme',
          this.currentTheme
        );
      } else {
        this.currentTheme = 'light';
        this.renderer.setAttribute(
          document.body,
          'data-theme',
          this.currentTheme
        );
      }
    };
    const usertheme = localStorage.getItem('theme') ?? '';
    //console.log('theme local', usertheme);
    if (!usertheme) {
      if (darkModeMediaQuery.matches) {
        this.currentTheme = 'dark';
        this.renderer.setAttribute(
          document.body,
          'data-theme',
          this.currentTheme
        );
      } else {
        this.currentTheme = 'light';
        this.renderer.setAttribute(
          document.body,
          'data-theme',
          this.currentTheme
        );
      }
 
      darkModeMediaQuery.addEventListener('change', updateTheme);
    } else {
      this.currentTheme = usertheme;
      this.renderer.setAttribute(
        document.body,
        'data-theme',
        this.currentTheme
      );
    }
 
    // Log initial mode
 
    // Add listener for changes
  }
 
  toggleTheme(theme: string): void {
    this.currentTheme = theme;
    // this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    localStorage.setItem('theme', theme);
    this.themeservice.changeTheme(this.currentTheme);
  }
}
 
 