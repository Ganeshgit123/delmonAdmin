import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-spin-wheel-winner',
  templateUrl: './spin-wheel-winner.component.html',
  styleUrls: ['./spin-wheel-winner.component.scss']
})
export class SpinWheelWinnerComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  getvalue = [];

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
    @ViewChild(MatSort) matSort: MatSort;
  
    constructor(private modalService: NgbModal, public authService: AuthService,
      private router: Router, private translate: TranslateService,) { }

  ngOnInit(): void {
    this.displayedColumns = ['index', 'userId', 'type', 'title'];

    this.authService.getSpinWheelWinner().subscribe(
      (res: any) => {
        this.getvalue = res.data;
        this.dataSource = new MatTableDataSource(this.getvalue);
        this.dataSource.paginator = this.matPaginator;
        this.dataSource.sort = this.matSort;
      }
    );
  }

}
