import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective } from '@csmart/mat-table-exporter';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from '../../ng-material.module';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgMaterialModule, NgxSpinnerModule],
})
export class FinancialComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<FinancialRow>;
  getOrders: FinancialRow[] = [];
  formattedDateTime: string;
  startDate: string = '';
  endDate: string = '';
  showAccept = true;
  superAdminRole = false;
  dir: any;
  flowType: any;
  userType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.displayedColumns = [
      'index',
      'orderId',
      'salesInvoiceNo',
      'bankTransationNo',
      'customerName',
      'userType',
      'driverName',
      'orderDetails',
      'prodDetails',
      'vat',
      'deliveryFee',
      'total',
      'paymentType',
      'sonicNo',
      'orderStatus',
      'orderDate',
      'deliveryDate',
    ];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING';
    }

    this.spinner.show();
    const object: DateQuery = { type: this.flowType, startDate: '', endDate: '' };
    this.getDateQuery(object);
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const raw = sessionStorage.getItem('permission');
      const settingPermssion: Permission[] = raw ? (JSON.parse(raw) as Permission[]) : [];
      const orderPermission = settingPermssion?.find((ele: Permission) => ele.area == 'financial-reports')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  // Detect VAT titles in English and Arabic, case-insensitive
  private isVatTitle(title: string): boolean {
    if (!title) return false;
    const t = title.toLowerCase();
    // English: VAT, Arabic: ضريبة القيمة المضافة, ضريبة
    return t.includes('vat') || t.includes('ضريبة') || t.includes('القيمة المضافة');
  }

  // Detect Delivery Fee titles in English and Arabic, case-insensitive
  private isDeliveryTitle(title: string): boolean {
    if (!title) return false;
    const t = title.toLowerCase();
    // English: delivery, delivery fee, shipping; Arabic: توصيل, رسوم التوصيل, الشحن
    return t.includes('delivery') || t.includes('توصيل') || t.includes('رسوم التوصيل') || t.includes('الشحن');
  }

  // Filter VAT-only items from a mixed array
  private filterVat(items: { title: string; price?: string | number }[]): { title: string; price?: string | number }[] {
    if (!Array.isArray(items)) return [];
    return items.filter((i) => this.isVatTitle(i.title));
  }

  // Filter Delivery-only items from a mixed array
  private filterDelivery(
    items: { title: string; price?: string | number }[],
  ): { title: string; price?: string | number }[] {
    if (!Array.isArray(items)) return [];
    return items.filter((i) => this.isDeliveryTitle(i.title));
  }

  // Normalize price by stripping currency like "BD" and returning a number
  private normalizePrice(price: string | number | undefined): number {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numStr = price.replace(/[^\d.-]/g, '');
      const num = parseFloat(numStr);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  getDateQuery(object: DateQuery) {
    this.spinner.show();
    this.authService.getFinanceReport(object).subscribe((res: any) => {
      // ...existing code...
      this.getOrders = (res.deliveryBoyOrderList as FinancialRow[]).reverse();

      this.getOrders = this.getOrders.map((order: FinancialRow) => {
        const items = order.order ?? [];
        const vatItems = this.filterVat(items).map((i) => ({
          ...i,
          price: this.normalizePrice(i.price),
        }));
        const deliveryItems = this.filterDelivery(items).map((i) => ({
          ...i,
          price: this.normalizePrice(i.price),
        }));
        return {
          ...order,
          vatItems,
          deliveryItems,
        } as FinancialRow;
      });

      // ...existing code...
      this.spinner.hide();
      // console.log("Fef", this.getOrders);
      this.dataSource = new MatTableDataSource<FinancialRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startEvent(event: { value: Date }) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const startFomatDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.startDate = startFomatDate;

    // const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate }
    // this.getDateQuery(object)
  }

  endEvent(event: { value: Date }) {
    const stDate = event.value;
    const date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const endFomatDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.endDate = endFomatDate;

    const object: DateQuery = { type: this.flowType, startDate: this.startDate, endDate: this.endDate };
    this.getDateQuery(object);
  }

  onChangeFlowTypeFilter(value: string) {
    this.flowType = value;
    const object: DateQuery = { type: this.flowType, startDate: this.startDate, endDate: this.endDate };
    this.getDateQuery(object);
  }

  exportIt() {
    const currentDateAndTime: Date = new Date();
    // Extract individual components
    const year: number = currentDateAndTime.getFullYear();
    const month: number = currentDateAndTime.getMonth() + 1; // Note: Months are zero-based
    const day: number = currentDateAndTime.getDate();
    const hours: number = currentDateAndTime.getHours();
    const minutes: number = currentDateAndTime.getMinutes();
    const seconds: number = currentDateAndTime.getSeconds();

    // Format the date and time
    this.formattedDateTime = `${year}-${month}-${day}/${hours}:${minutes}:${seconds}`;

    this.exporter.exportTable(ExportType.XLSX, {
      fileName: `Financial Report ${this.formattedDateTime}`,
    });
  }
}

interface FinancialOrderItem {
  title: string;
  price?: string | number;
}

interface FinancialRow {
  order?: FinancialOrderItem[];
  vatItems?: FinancialOrderItem[];
  deliveryItems?: FinancialOrderItem[];
  // plus other fields shown in displayedColumns, left as optional to avoid implicit any
  orderId?: string | number;
  salesInvoiceNo?: string;
  bankTransationNo?: string;
  customerName?: string;
  userType?: string;
  driverName?: string;
  orderDetails?: string;
  prodDetails?: string;
  vat?: string | number;
  deliveryFee?: string | number;
  total?: string | number;
  paymentType?: string;
  sonicNo?: string;
  orderStatus?: string;
  orderDate?: string;
  deliveryDate?: string;
}

interface DateQuery {
  type: string;
  startDate: string;
  endDate: string;
}

interface Permission {
  area: string;
  write: number;
}
