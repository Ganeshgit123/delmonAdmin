import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatTableExporterDirective } from 'mat-table-exporter';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-assign',
  templateUrl: './product-assign.component.html',
  styleUrls: ['./product-assign.component.scss']
})
export class ProductAssignComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any;
  columnsSchema: any;
  getvalue = [];
  COLUMNS_SCHEMA = [];
  USER_DATA = [];
  params: any;
  getProdPriceList = [];
  formattedDateTime: string;
  exportArray = [];
  fileImgUpload: any;
  fileUpload: any;
  showAccept = true;
  superAdminRole = false;
  userType: any;
  flowType: any;

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatTableExporterDirective, { static: true }) exporter: MatTableExporterDirective;

  constructor(public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute,
    private translate: TranslateService, private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.userType = sessionStorage.getItem('userType');

    this.route.params.subscribe((params) => {
      this.params = params.id;
    });

    if (this.userType == 1 || this.userType == 0) {
      this.flowType = 'POULTRY';
    } else if (this.userType == 2 || this.userType == 0) {
      this.flowType = 'FEEDING';
    }

    const object = { type: this.flowType, id: this.params }
    this.getAPICAll(object);
  }

  getAPICAll(object){
    this.authService.getProductPriceList(object.type, object.id).subscribe(
      (res: any) => {
        var productListArray = res.data;
        this.getProdPriceList = productListArray.reverse();

        this.COLUMNS_SCHEMA = [{
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
        }]

        this.USER_DATA = this.getProdPriceList;

        this.columnsSchema = this.COLUMNS_SCHEMA;
        this.displayedColumns = this.COLUMNS_SCHEMA.map((col) => col.key);
        this.dataSource = this.USER_DATA;
        this.dataSource = new MatTableDataSource(this.USER_DATA);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
        // console.log("original",this.USER_DATA)
        this.exportArray = this.USER_DATA.map(({ id, productId, name, weight, price, offer_price, stock }) =>
          ({ id, name, productId, weight, price, offer_price, stock }));
        // console.log("Sfef",this.exportArray)
      })
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      const orderPermission = settingPermssion?.find(ele => ele.area == 'priceList')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  ngAfterViewInit(): void {
    // this.matPaginator._intl.itemsPerPageLabel = this.translate.instant("itemsPerPage");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateList(element) {
    element.isEdit = !element.isEdit
    if (element.productId) {
      if (element.offer_price) {
        var offerAMt = element.offer_price
      } else {
        offerAMt = 0
      }
      const data = {
        id: element.id,
        productId: element.productId,
        price: element.price,
        offerPrice: offerAMt,
        stock: Number(Math.max(0, element.stock)),
      }
      // console.log("fffeee", data)
      this.updateOldList(data)
    } else {
      const data = {
        productId: element.id,
        price: element.price,
        offerPrice: element.offer_price,
        stock: Number(Math.max(0, element.stock)),
        priceListNameId: Number(this.params)
      }
      // console.log("dde", data)
      this.authService.addProductPriceList(data)
        .subscribe((res: any) => {
          if (res.error == false) {
            this.toastr.success('Success ', res.message);
            this.ngOnInit();
          } else {
            this.toastr.error('Enter valid ', res.message);
          }
        });
    }
  }

  updateOldList(data) {
    this.authService.editProductPriceList(data, this.params)
      .subscribe((res: any) => {
        if (res.error == false) {
          this.toastr.success('Success ', res.message);
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  onChangeFlowTypeFilter(value){
    this.flowType  = value;
    const object = { type: this.flowType, id: this.params }
    this.getAPICAll(object)
  }

  exportToExcel() {
    const data = this.exportArray;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const readonlyColumns = [2]; // Example: Make the second column readonly

    // Iterate over rows and make specific columns readonly
    readonlyColumns.forEach(col => {
      for (let row = 1; row <= XLSX.utils.decode_range(worksheet['!ref']).e.r; row++) {
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

  importXl(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.fileUpload = event.target.result;
    }
    this.fileImgUpload = file;
    // console.log("upload",this.fileImgUpload)
    this.spinner.show();
    var postData = new FormData();
    postData.append('file', this.fileImgUpload);
    this.authService.excelUpload(postData, this.params).subscribe((res: any) => {
      if (res.error == false) {
        this.spinner.hide();
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      }
    });
  }
}
