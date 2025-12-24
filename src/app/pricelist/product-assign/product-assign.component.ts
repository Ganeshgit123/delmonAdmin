import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatTableExporterDirective } from '@csmart/mat-table-exporter';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiResponse } from 'src/app/shared/models/api-response';

type ColumnType = 'text' | 'number' | 'string' | 'isEdit';

interface ColumnSchema {
  key: string;
  type: ColumnType;
  label: string;
}

interface ProductPriceRow {
  id: number;
  productId?: number;
  name: string;
  weight?: string | number;
  price: number;
  offer_price?: number;
  stock: number | string;
  isEdit?: boolean;
}

@Component({
  selector: 'app-product-assign',
  templateUrl: './product-assign.component.html',
  styleUrls: ['./product-assign.component.scss'],
})
export class ProductAssignComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<ProductPriceRow>;
  columnsSchema: ColumnSchema[];
  getvalue: ProductPriceRow[] = [];
  COLUMNS_SCHEMA: ColumnSchema[] = [];
  USER_DATA: ProductPriceRow[] = [];
  params: string;
  getProdPriceList: ProductPriceRow[] = [];
  formattedDateTime: string;
  exportArray: { id: number; name: string; productId?: number; weight?: string | number; price: number; offer_price?: number; stock: number | string }[] = [];
  fileImgUpload: File | null = null;
  fileUpload: string | null = null;
  showAccept = true;
  superAdminRole = false;
  userType: string | null = null;
  flowType: string;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') === 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.route.params.subscribe((params) => {
      this.params = params.id;
    });

    if (Number(this.userType) === 1 || Number(this.userType) === 0) {
      this.flowType = 'POULTRY';
    } else if (Number(this.userType) === 2 || Number(this.userType) === 0) {
      this.flowType = 'FEEDING';
    }

    const object = { type: this.flowType, id: this.params };
    this.getAPICAll(object);
  }

  getAPICAll(object: { type: string; id: string }) {
    this.authService.getProductPriceList(object.type, object.id).subscribe((res) => {
      const productListArray = (res as ApiResponse<ProductPriceRow[]>).data;
      this.getProdPriceList = productListArray.reverse();

      this.COLUMNS_SCHEMA = [
        {
          key: 'name',
          type: 'text',
          label: 'Product Name',
        },
        {
          key: 'price',
          type: 'number',
          label: 'Price',
        },
        {
          key: 'offer_price',
          type: 'number',
          label: 'Offer Price',
        },
        {
          key: 'stock',
          type: 'string',
          label: 'Stock',
        },
        {
          key: 'isEdit',
          type: 'isEdit',
          label: '',
        },
      ];

      this.USER_DATA = this.getProdPriceList;

      this.columnsSchema = this.COLUMNS_SCHEMA;
      this.displayedColumns = this.COLUMNS_SCHEMA.map((col) => col.key);
      this.dataSource = new MatTableDataSource(this.USER_DATA);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
      // console.log("original",this.USER_DATA)
      this.exportArray = this.USER_DATA.map(({ id, productId, name, weight, price, offer_price, stock }) => ({
        id,
        name,
        productId,
        weight,
        price,
        offer_price,
        stock,
      }));
      // console.log("Sfef",this.exportArray)
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const permRaw = sessionStorage.getItem('permission');
      const settingPermssion = permRaw ? (JSON.parse(permRaw) as { area: string; write: number }[]) : null;
      const orderPermission = settingPermssion?.find((ele) => ele.area === 'priceList')?.write === 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateList(element: ProductPriceRow) {
    element.isEdit = !element.isEdit;
    if (element.productId) {
      const offerAMt = element.offer_price ? element.offer_price : 0;
      const data = {
        id: element.id,
        productId: element.productId,
        price: element.price,
        offerPrice: offerAMt,
        stock: Math.max(0, Number(element.stock)),
      };
      // console.log("fffeee", data)
      this.updateOldList(data);
    } else {
      const data = {
        productId: element.id,
        price: element.price,
        offerPrice: element.offer_price,
        stock: Math.max(0, Number(element.stock)),
        priceListNameId: Number(this.params),
      };
      // console.log("dde", data)
      this.authService.addProductPriceList(data).subscribe((res: ApiResponse<unknown>) => {
        if (res.error === false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
    }
  }

  updateOldList(data: { id: number; productId: number; price: number; offerPrice: number; stock: number }) {
    this.authService.editProductPriceList(data, this.params).subscribe((res: ApiResponse<unknown>) => {
      if (res.error === false) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  onChangeFlowTypeFilter(value: string) {
    this.flowType = value;
    const object = { type: this.flowType, id: this.params };
    this.getAPICAll(object);
  }

  exportToExcel() {
    const data = this.exportArray;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const readonlyColumns = [2]; // Example: Make the second column readonly

    // Iterate over rows and make specific columns readonly
    const ref = worksheet['!ref'];
    if (!ref) {
      return;
    }
    readonlyColumns.forEach((col) => {
      for (let row = 1; row <= XLSX.utils.decode_range(ref).e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        const cell = worksheet[cellAddress];
        if (cell) {
          cell.s = { protection: { locked: true } };
        }
      }
    });

    const today = new Date();
    const dateFormatted = today.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const fileName = `Product Pricelist_${dateFormatted}.xlsx`;

    // Create a workbook
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet 1': worksheet }, SheetNames: ['Sheet 1'] };

    // Save the file
    XLSX.writeFile(workbook, fileName);
  }

  importXl(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.fileUpload = (e.target as FileReader).result as string;
    };
    this.fileImgUpload = file;
    // console.log("upload",this.fileImgUpload)
    this.spinner.show();
    const postData = new FormData();
    postData.append('file', this.fileImgUpload);
    this.authService.excelUpload(postData, this.params).subscribe((res) => {
      const r = res as ApiResponse<unknown>;
      if (r.error === false) {
        this.spinner.hide();
        this.toastr.success('Success ', r.message);
        this.ngOnInit();
      }
    });
  }
}
