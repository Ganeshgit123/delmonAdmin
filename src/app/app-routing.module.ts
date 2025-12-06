import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './error-page/error-page.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./login/login.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "admin_users",
        loadChildren: () => import("./admin-users/admin-users.module").then((m) => m.AdminUsersModule),
      },
      {
        path: "admin_roles",
        loadChildren: () => import("./admin-users/roles/roles.module").then((m) => m.RolesModule),
      },
      {
        path: "poultry_category",
        loadChildren: () => import("./category/poulty/poulty.module").then((m) => m.PoultyModule),
      },
      {
        path: "feeding_category",
        loadChildren: () => import("./category/feeding/feeding.module").then((m) => m.FeedingModule),
      },
      {
        path: "banners",
        loadChildren: () => import("./settings/banners/banners.module").then((m) => m.BannersModule),
      },
      {
        path: "normal_users",
        loadChildren: () => import("./users/normal-user/normal-user.module").then((m) => m.NormalUserModule),
      },
      {
        path: "merchants",
        loadChildren: () => import("./users/merchats/merchats.module").then((m) => m.MerchatsModule),
      },
      {
        path: "employees",
        loadChildren: () => import("./users/employees/employees.module").then((m) => m.EmployeesModule),
      },
      {
        path: "create_user",
        loadChildren: () => import("./users/new-user/new-user.module").then((m) => m.NewUserModule),
      },
      {
        path: "poultry_products",
        loadChildren: () => import("./products/poultry-product/poultry-product.module").then((m) => m.PoultryProductModule),
      },
      {
        path: "poultry_related_products/:id",
        loadChildren: () => import("./products/poultry-related/poultry-related.module").then((m) => m.PoultryRelatedModule),
      },
      {
        path: "feeding_products",
        loadChildren: () => import("./products/feeding-product/feeding-product.module").then((m) => m.FeedingProductModule),
      },
      {
        path: "feeding_related_products/:id",
        loadChildren: () => import("./products/feeding-related/feeding-related.module").then((m) => m.FeedingRelatedModule),
      },
      {
        path: "recepies",
        loadChildren: () => import("./recepies/recepies.module").then((m) => m.RecepiesModule),
      },
      {
        path: "pricelist",
        loadChildren: () => import("./pricelist/pricelist.module").then((m) => m.PricelistModule),
      },
      {
        path: "assing_product_pricelist/:id",
        loadChildren: () => import("./pricelist/product-assign/product-assign.module").then((m) => m.ProductAssignModule),
      },
      {
        path: "assign_price",
        loadChildren: () => import("./pricelist/user-assign/user-assign.module").then((m) => m.UserAssignModule),
      },
      {
        path: "baskets",
        loadChildren: () => import("./products/basket/basket.module").then((m) => m.BasketModule),
      },
      {
        path: "zones",
        loadChildren: () => import("./zones/zones.module").then((m) => m.ZonesModule),
      },
      {
        path: "area/:id",
        loadChildren: () => import("./zones/area/area.module").then((m) => m.AreaModule),
      },
      {
        path: "pin/:id",
        loadChildren: () => import("./zones/pin/pin.module").then((m) => m.PinModule),
      },
      {
        path: "overall_products",
        loadChildren: () => import("./overall-products/overall-products.module").then((m) => m.OverallProductsModule),
      },
      {
        path: "drivers",
        loadChildren: () => import("./drivers/drivers.module").then((m) => m.DriversModule),
      },
      {
        path: "delivery_orders",
        loadChildren: () => import("./orders/delivery-orders/delivery-orders.module").then((m) => m.DeliveryOrdersModule),
      },
      {
        path: "pickup_orders",
        loadChildren: () => import("./orders/pickup-orders/pickup-orders.module").then((m) => m.PickupOrdersModule),
      },
      {
        path: "unavailable_orders",
        loadChildren: () => import("./orders/unavailable/unavailable.module").then((m) => m.UnavailableModule),
      },
      {
        path: "completed_orders",
        loadChildren: () => import("./orders/completed-orders/completed-orders.module").then((m) => m.CompletedOrdersModule),
      },
      {
        path: "cancelled_orders",
        loadChildren: () => import("./orders/canelled-orders/canelled-orders.module").then((m) => m.CanelledOrdersModule),
      },
      {
        path: "normal_coupons",
        loadChildren: () => import("./coupons/normal/normal.module").then((m) => m.NormalModule),
      },
      {
        path: "employee_coupons",
        loadChildren: () => import("./coupons/employee/employee.module").then((m) => m.EmployeeModule),
      },
      {
        path: "celebrity_coupons",
        loadChildren: () => import("./coupons/celebrity/celebrity.module").then((m) => m.CelebrityModule),
      },
      {
        path: "settings",
        loadChildren: () => import("./settings/master-setting/master-setting.module").then((m) => m.MasterSettingModule),
      },
      {
        path: "one-day-orders",
        loadChildren: () => import("./reports/one-day-orders/one-day-orders.module").then((m) => m.OneDayOrdersModule),
      },
      {
        path: "total-orders",
        loadChildren: () => import("./reports/total-orders/total-orders.module").then((m) => m.TotalOrdersModule),
      },
      {
        path: "holiday_list",
        loadChildren: () => import("./settings/holiday-list/holiday-list.module").then((m) => m.HolidayListModule),
      },
      {
        path: "advertisement",
        loadChildren: () => import("./settings/advertisement/advertisement.module").then((m) => m.AdvertisementModule),
      },
      {
        path: "feedback",
        loadChildren: () => import("./feebacks/feebacks.module").then((m) => m.FeebacksModule),
      },
      {
        path: "push-notifications",
        loadChildren: () => import("./settings/push/push.module").then((m) => m.PushModule),
      },
      {
        path: "push-emails",
        loadChildren: () => import("./settings/push-email/push-email.module").then((m) => m.PushEmailModule),
      },
      {
        path: "financial-reports",
        loadChildren: () => import("./reports/financial/financial.module").then((m) => m.FinancialModule),
      },
      {
        path: "salesman-reports",
        loadChildren: () => import("./reports/salesman-report/salesman-report.module").then((m) => m.SalesmanReportModule),
      },
      {
        path: "internal-sales-reports",
        loadChildren: () => import("./reports/internal-sales/internal-sales.module").then((m) => m.InternalSalesModule),
      },
      {
        path: "online-sales-reports",
        loadChildren: () => import("./reports/online-sales/online-sales.module").then((m) => m.OnlineSalesModule),
      },
      {
        path: "employee-purchase-reports",
        loadChildren: () => import("./reports/employee-purchase/employee-purchase.module").then((m) => m.EmployeePurchaseModule),
      },
      {
        path: "most-wanted-products",
        loadChildren: () => import("./reports/most-wanted-products/most-wanted-products.module").then((m) => m.MostWantedProductsModule),
      },
      {
        path: "most-wanted-address",
        loadChildren: () => import("./reports/most-wanted-address/most-wanted-address.module").then((m) => m.MostWantedAddressModule),
      },
      {
        path: "favorite-products",
        loadChildren: () => import("./reports/favourit-products/favourit-products.module").then((m) => m.FavouritProductsModule),
      },
      {
        path: "accepted-orders-reports",
        loadChildren: () => import("./reports/accepted-orders/accepted-orders.module").then((m) => m.AcceptedOrdersModule),
      },
      {
        path: "lucky-draw",
        loadChildren: () => import("./settings/lucky-draw/lucky-draw.module").then((m) => m.LuckyDrawModule),
      },
      {
        path: "spin-and-wheel",
        loadChildren: () => import("./settings/spin-wheel/spin-wheel.module").then((m) => m.SpinWheelModule),
      },
      {
        path: "spin-wheel-slices",
        loadChildren: () => import("./settings/spin-wheel-slices/spin-wheel-slices.module").then((m) => m.SpinWheelSlicesModule),
      },
      {
        path: "spin-winner",
        loadChildren: () => import("./settings/spin-wheel-winner/spin-wheel-winner.module").then((m) => m.SpinWheelWinnerModule),
      },
      {
        path: "content_editor",
        loadChildren: () => import("./content-editor/content-editor.module").then((m) => m.ContentEditorModule),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
