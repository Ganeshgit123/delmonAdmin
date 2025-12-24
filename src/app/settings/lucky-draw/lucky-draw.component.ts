import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lucky-draw',
  templateUrl: './lucky-draw.component.html',
  styleUrls: ['./lucky-draw.component.scss'],
})
export class LuckyDrawComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<OrderRow>;
  startDate: any = '';
  endDate: any = '';
  dir: any;
  getOrders: OrderRow[] = [];
  filteredOrders: OrderRow[] = [];
  timeInSeconds: number;
  currentOrder: OrderRow | null = null;
  winner: OrderRow | null = null;
  intervalId: any;
  timeForm: FormGroup;
  showTable = false;
  userType: any;
  flowType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.dir = localStorage.getItem('dir') || 'ltr';
    this.userType = sessionStorage.getItem('userType');

    this.displayedColumns = ['index', 'orderId', 'customerName', 'phoneNumber', 'deliveryDate'];

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2) {
      this.flowType = 'FEEDING';
    }
    const object = {
      type: this.flowType,
      deliveryBoyId: '',
      startDate: '',
      endDate: '',
      orderStatus: 'PLACED,USERACCEPTED,DRIVERASSIGNED,OUTFORDELIVERY,COMPLETED',
    };
    this.authService.getSalesReport(object).subscribe((res: any) => {
      this.getOrders = (res.deliveryBoyOrderList as OrderRow[]).reverse();
      // console.log("Fef",this.getOrders)
      this.dataSource = new MatTableDataSource<OrderRow>(this.getOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });

    this.timeForm = this.fb.group({
      timeInSeconds: [],
    });
  }

  // ngAfterViewInit(): void {
  //   this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  startEvent(event: any) {
    this.startDate = event.value;
    this.filterOrders();
  }

  endEvent(event: any) {
    this.endDate = event.value;
    this.filterOrders();
  }

  filterOrders() {
    this.showTable = true;
    if (this.startDate && this.endDate) {
      const from = new Date(this.startDate);
      from.setHours(0, 0, 0, 0); // Normalize start date

      const to = new Date(this.endDate);
      to.setHours(23, 59, 59, 999); // Normalize end date

      this.filteredOrders = this.getOrders.filter((order) => {
        const orderDateStr = order.newDeliveryDate ?? order.deliveryOrderDate;

        if (!orderDateStr) return false; // Skip if no date

        // Convert "DD/MM/YYYY" to "YYYY-MM-DD"
        const [day, month, year] = orderDateStr.split('/');
        const orderDate = new Date(`${year}-${month}-${day}`);

        orderDate.setHours(0, 0, 0, 0); // Normalize time

        return orderDate >= from && orderDate <= to;
      });

      // console.log("Filtered Orders:", this.filteredOrders);

      this.dataSource = new MatTableDataSource<OrderRow>(this.filteredOrders);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    }
  }

  startRandomizer() {
    if (this.timeForm.value.timeInSeconds <= 0 || this.filteredOrders.length === 0) {
      alert('Please provide valid input.');
      return;
    }

    this.winner = null;
    let elapsedSeconds = 0;

    this.intervalId = setInterval(() => {
      if (elapsedSeconds < this.timeForm.value.timeInSeconds) {
        this.currentOrder = this.filteredOrders[Math.floor(Math.random() * this.filteredOrders.length)];
        elapsedSeconds++;
      } else {
        this.winner = this.currentOrder;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  restrictNumeric(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}

interface OrderRow {
  orderId?: number | string;
  customerName?: string;
  phoneNumber?: string;
  deliveryDate?: string;
  newDeliveryDate?: string;
  deliveryOrderDate?: string;
}
