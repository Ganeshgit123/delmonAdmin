import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

import MetisMenu from 'metismenujs';

import { MenuItem } from './menu.model';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FeahterIconModule],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;

  menuItems: (MenuItem | false)[] = [];
  permissions: string | null = null;
  isSuperAdmin = false;
  hide = false;
  userFlowType: any;

  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    router: Router,
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        /**
         * Activating the current active item dropdown
         */
        this._activateMenuDropdown();

        /**
         * closing the sidebar
         */
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
        }
      }
    });
  }

  ngOnInit(): void {
    // this.menuItems = MENU;
    this.permissions = sessionStorage.getItem('permission');
    this.userFlowType = sessionStorage.getItem('userType');

    this.isSuperAdmin = sessionStorage.getItem('roleName') == 'superAdmin' ? true : false;
    this.initialize();
    this.callRolePermission();
    /**
     * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
     */
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addListener(this.iconSidebar);
    this.iconSidebar(desktopMedium);
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      this.hide = true;
    }
  }

  ngAfterViewInit() {
    // activate menu item
    new MetisMenu(this.sidebarMenu.nativeElement);

    this._activateMenuDropdown();
  }

  /**
   * Toggle sidebar on hamburger button click
   */
  toggleSidebar(e: Event) {
    this.sidebarToggler.nativeElement.classList.toggle('active');
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-open');
    }
  }

  /**
   * Toggle settings-sidebar
   */
  toggleSettingsSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }

  /**
   * Open sidebar when hover (in folded folded state)
   */
  operSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.add('open-sidebar-folded');
    }
  }

  /**
   * Fold sidebar after mouse leave (in folded state)
   */
  closeSidebarFolded() {
    if (this.document.body.classList.contains('sidebar-folded')) {
      this.document.body.classList.remove('open-sidebar-folded');
    }
  }

  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
   */
  iconSidebar(e: MediaQueryListEvent | MediaQueryList) {
    if (e.matches) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }

  /**
   * Switching sidebar light/dark
   */
  onSidebarThemeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    if (target && target.value) {
      this.document.body.classList.add(target.value);
    }
    this.document.body.classList.remove('settings-open');
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }

  /**
   * Resets the menus
   */
  resetMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref') as HTMLCollectionOf<HTMLAnchorElement>;

    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.remove('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.remove('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El) {
          parent3El.classList.remove('mm-active');
            if (parent3El.classList.contains('side-nav-item')) {
              const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
              if (firstAnchor) {
                firstAnchor.classList.remove('mm-active');
              }
            }

            const parent4El = parent3El.parentElement;
            if (parent4El) {
              parent4El.classList.remove('mm-show');

              const parent5El = parent4El.parentElement;
              if (parent5El) {
                parent5El.classList.remove('mm-active');
              }
            }
          }
        }
      }
    }
  }

  /**
   * Toggles the menu items
   */
  activateMenuItems() {
    const links = document.getElementsByClassName('nav-link-ref') as HTMLCollectionOf<HTMLAnchorElement>;

    let menuItemEl: HTMLElement | null = null;

    for (let i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        menuItemEl = links[i];

        break;
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement;
        if (parent2El) {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El) {
            parent3El.classList.add('mm-active');
            if (parent3El.classList.contains('side-nav-item')) {
              const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');
              if (firstAnchor) {
                firstAnchor.classList.add('mm-active');
              }
            }

            const parent4El = parent3El.parentElement;
            if (parent4El) {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;
              if (parent5El) {
                parent5El.classList.add('mm-active');
              }
            }
          }
        }
      }
    }
  }

  initialize(): void {
    interface Permission { area: string; read: number; write: number }
    const datat: Permission[] | null = this.permissions ? JSON.parse(this.permissions) : null;

    const rawMenu: (MenuItem | false)[] = [
      {
        label: 'Dashboard',
        icon: 'mdi mdi-view-dashboard',
        link: '/dashboard',
      },
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'orders')?.read == 1)
        ? {
            label: 'Orders',
            icon: 'mdi mdi-food',
            subItems: [
              {
                label: 'Delivery',
                link: '/delivery_orders',
              },
              {
                label: 'Self PickUp',
                link: '/pickup_orders',
              },
              {
                label: 'Unavailable Orders',
                link: '/unavailable_orders',
              },
              {
                label: 'Completed Orders',
                link: '/completed_orders',
              },
              {
                label: 'Cancelled Orders',
                link: '/cancelled_orders',
              },
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'category')?.read == 1)
        ? {
            label: 'Category',
            icon: 'mdi mdi-tag',
            subItems: [
              ...(this.userFlowType == 0 || this.userFlowType == 3
                ? [
                    {
                      label: 'Poultry',
                      link: '/poultry_category',
                    },
                    {
                      label: 'Feeding',
                      link: '/feeding_category',
                    },
                  ]
                : []),
              ...(this.userFlowType == 1
                ? [
                    {
                      label: 'Poultry',
                      link: '/poultry_category',
                    },
                  ]
                : []),
              ...(this.userFlowType == 2
                ? [
                    {
                      label: 'Feeding',
                      link: '/feeding_category',
                    },
                  ]
                : []),
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'users')?.read == 1)
        ? {
            label: 'Users',
            icon: 'mdi mdi-account-multiple',
            subItems: [
              this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'users')?.write == 1)
                ? {
                    label: 'Create New User',
                    link: '/create_user',
                  }
                : false,
              {
                label: 'Normal Users',
                link: '/normal_users',
              },
              {
                label: 'Employees',
                link: '/employees',
              },
              {
                label: 'Merchants',
                link: '/merchants',
              },
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'products')?.read == 1)
        ? {
            label: 'Products',
            icon: 'mdi mdi-shopping',
            subItems: [
              ...(this.userFlowType == 0 || this.userFlowType == 3
                ? [
                    {
                      label: 'Poultry',
                      link: '/poultry_products',
                    },
                    {
                      label: 'Feeding',
                      link: '/feeding_products',
                    },
                  ]
                : []),
              ...(this.userFlowType == 1
                ? [
                    {
                      label: 'Poultry',
                      link: '/poultry_products',
                    },
                  ]
                : []),
              ...(this.userFlowType == 2
                ? [
                    {
                      label: 'Feeding',
                      link: '/feeding_products',
                    },
                  ]
                : []),
              {
                label: 'Baskets',
                link: '/baskets',
              },
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'priceList')?.read == 1)
        ? {
            label: 'PriceList',
            icon: 'mdi mdi-wallet',
            subItems: [
              {
                label: 'Add PriceList',
                link: '/pricelist',
              },
              {
                label: 'Assign Price',
                link: '/assign_price',
              },
            ],
          }
        : false,
      // {
      //   label: 'OverAll Products',
      //   icon: 'mdi mdi-basket',
      //   link: '/overall_products'
      // },
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'recipes')?.read == 1)
        ? {
            label: 'Recipes',
            icon: 'mdi mdi-silverware-variant',
            link: '/recepies',
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'zones')?.read == 1)
        ? {
            label: 'Zones',
            icon: 'mdi mdi-map-marker-radius',
            link: '/zones',
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'master')?.read == 1)
        ? {
            label: 'Master Settings',
            icon: 'mdi mdi-cog',
            subItems: [
              {
                label: 'Banners',
                link: '/banners',
              },
              {
                label: 'Settings',
                link: '/settings',
              },
              {
                label: 'Ad Popup',
                link: '/advertisement',
              },
              {
                label: 'Push Notification',
                link: '/push-notifications',
              },
              {
                label: 'Push Emails',
                link: '/push-emails',
              },
              {
                label: 'Lucky Draw',
                link: '/lucky-draw',
              },
              {
                label: 'Spin and Wheel',
                link: '/spin-and-wheel',
              },
              {
                label: 'Spin and Wheel Slices',
                link: '/spin-wheel-slices',
              },
              {
                label: 'Spin Wheel Winner',
                link: '/spin-winner',
              },
              {
                label: 'Holiday List',
                link: '/holiday_list',
              },
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'drivers')?.read == 1)
        ? {
            label: 'Drivers',
            icon: 'mdi mdi-motorbike',
            link: '/drivers',
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'coupons')?.read == 1)
        ? {
            label: 'Coupons',
            icon: 'mdi mdi-sale',
            subItems: [
              {
                label: 'Coupons',
                link: '/normal_coupons',
              },
              {
                label: 'Employee Coupons',
                link: '/employee_coupons',
              },
              {
                label: 'Celebrity Coupons',
                link: '/celebrity_coupons',
              },
            ],
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'feedbacks')?.read == 1)
        ? {
            label: 'Feedbacks',
            icon: 'mdi mdi-forum',
            link: '/feedback',
          }
        : false,
      this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'adminUsers')?.read == 1)
        ? {
            label: 'Admin Users',
            icon: 'mdi mdi-account-multiple',
            subItems: [
              {
                label: 'Roles',
                link: '/admin_roles',
              },
              {
                label: 'Users',
                link: '/admin_users',
              },
            ],
          }
        : false,
      {
        label: 'Reports',
        icon: 'mdi mdi-account-multiple',
        subItems: [
          this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'one-day-orders')?.read == 1)
            ? {
                label: 'One-Day Orders Quantity',
                link: '/one-day-orders',
              }
            : false,
          this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'total-orders')?.read == 1)
            ? {
                label: 'Total Orders Quantity',
                link: '/total-orders',
              }
            : false,
          this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'financial-reports')?.read == 1)
            ? {
                label: 'Financial Reports',
                link: '/financial-reports',
              }
            : false,
          this.isSuperAdmin || (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'salesman-reports')?.read == 1)
            ? {
                label: 'Salesman Sales Reports',
                link: '/salesman-reports',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'internal-sales-reports')?.read == 1)
            ? {
                label: 'Internal Sales Reports',
                link: '/internal-sales-reports',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'online-sales-reports')?.read == 1)
            ? {
                label: 'Online Sales Reports',
                link: '/online-sales-reports',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'employee-purchase-reports')?.read == 1)
            ? {
                label: 'Employee Purchase Reports',
                link: '/employee-purchase-reports',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'most-wanted-product-reports')?.read == 1)
            ? {
                label: 'Most Wanted Product Reports',
                link: '/most-wanted-products',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'most-wanted-address-reports')?.read == 1)
            ? {
                label: 'Most Wanted Address Reports',
                link: '/most-wanted-address',
              }
            : false,
          this.isSuperAdmin ||
          (!this.isSuperAdmin && datat?.find((ele: Permission) => ele.area == 'favortie-product-reports')?.read == 1)
            ? {
                label: 'Favorite Product Reports',
                link: '/favorite-products',
              }
            : false,
          // {
          //   label: 'Accepted Orders Report',
          //   link: '/accepted-orders-reports',
          // }
        ],
      },
    ];

    this.menuItems = rawMenu.filter((item): item is MenuItem => item !== false);
  }
}
