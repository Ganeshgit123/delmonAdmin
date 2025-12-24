import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgMaterialModule } from '../ng-material.module';

@Component({
  selector: 'app-feebacks',
  templateUrl: './feebacks.component.html',
  styleUrls: ['./feebacks.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NgMaterialModule],
})
export class FeebacksComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<FeedbackRow>;
  getvalue: FeedbackRow[] = [];

  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = ['index', 'userName', 'email', 'mobileNumber', 'comment'];

    this.authService.getFeedbacks().subscribe((res: any) => {
      this.getvalue = res.data as FeedbackRow[];
      this.dataSource = new MatTableDataSource<FeedbackRow>(this.getvalue);
      this.dataSource.paginator = this.matPaginator;
      this.dataSource.sort = this.matSort;
    });
  }

  ngAfterViewInit(): void {
    this.matPaginator._intl.itemsPerPageLabel = this.translate.instant('itemsPerPage');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

interface FeedbackRow {
  id: number;
  userName: string;
  email: string;
  mobileNumber: string;
  comment: string;
}
