import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ExportType, MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getOrders = [];
  formattedDateTime: string;
  startDate: any = '';
  endDate: any = '';
  showAccept = true;
  superAdminRole = false;
  dir: any;
  flowType: any;
  userType: any;
  translations: Record<string, { en: string; ar: string }> = {
    "VAT": { en: "VAT", ar: "ضريبة القيمة المضافة" },
    "Total Amount": { en: "Total Amount", ar: "المجموع" },
    "Delivery Fees": { en: "Delivery Fees", ar: "مبلغ التوصيل" }
  };

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(public authService: AuthService, private router: Router, private translate: TranslateService,) { }

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.displayedColumns = ['index', 'orderId', 'salesInvoiceNo', 'bankTransationNo', 'customerName', 'userType', 'driverName', 'orderDetails', 'prodDetails',
      'total', 'paymentType', 'sonicNo', 'orderStatus', 'orderDate', 'deliveryDate'];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY'
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING'
    }

    const object = { type: this.flowType, startDate: '', endDate: '' }
    this.authService.getFinanceReport(object).subscribe(
      (res: any) => {
        this.getOrders = res.deliveryBoyOrderList.reverse();
        // console.log("Fef",this.getOrders)
        this.dataSource = new MatTableDataSource(this.getOrders);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
        const orderArrays = this.getOrders.map((o: any) => o.order);

        // console.log(orderArrays);

        orderArrays.forEach((item) => {
          const { value, currency } = this.parsePrice(item.price);
          // console.log(value, currency);
          const translation = this.translations[item.title];

          if (translation) {
            // console.log(`${translation.en} (${translation.ar}): ${value} ${currency}`);
          }

        });
      });

  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'financial-reports')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  getDateQuery(object) {
    this.authService.getFinanceReport(object).subscribe(
      (res: any) => {
        this.getOrders = res.deliveryBoyOrderList;
        this.dataSource = new MatTableDataSource(this.getOrders);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startEvent(event) {
    var stDate = event.value
    var date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const startFomatDate: string = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.startDate = startFomatDate;

    const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate }
    this.getDateQuery(object)
  }

  endEvent(event) {
    var stDate = event.value
    var date = new Date(stDate);

    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Note: Months are zero-indexed, so add 1
    const day: number = date.getDate();

    const endFomatDate: string = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    this.endDate = endFomatDate;

    const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate }
    this.getDateQuery(object)
  }

  onChangeFlowTypeFilter(value) {
    this.flowType = value;
    const object = { type: this.flowType, startDate: this.startDate, endDate: this.endDate }
    this.getDateQuery(object)
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

  parsePrice(price: string | number | undefined) {
    if (price == null || price === '') return { value: 0, currency: '' };
    if (typeof price === 'number') return { value: price, currency: '' };

    const str = price.toString().trim();
    // Match number + optional space + currency
    const match = str.match(/^([\d.,]+)\s*(.*)$/);
    if (!match) return { value: 0, currency: '' };

    const value = parseFloat(match[1].replace(',', '.')) || 0;
    const currency = (match[2] || '').trim();

    return { value, currency };
  }


}
