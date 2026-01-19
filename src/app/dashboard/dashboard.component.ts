import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../shared/auth.service';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexGrid,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexMarkers,
  ApexStroke,
  ApexLegend,
  ApexResponsive,
  ApexTooltip,
  ApexFill,
  ApexDataLabels,
  ApexPlotOptions,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export interface apexChartOptions {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  tooltip: ApexTooltip;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  labels: string[];
  title: ApexTitleSubtitle;
  chartLabels: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, NgApexchartsModule],
})
export class DashboardComponent implements OnInit {
  getDashboardData: any;
  postsArray: number[] = [];
  adsSeparateArray: any[] = [];
  usersListArray: any[] = [];
  adsArrayLabels: string[] = [];
  adsSeparateArrayLabels: string[] = [];
  usersListArrayLabels: string[] = [];
  reportedAds: any;
  totCommission: any;
  totCategories: any;
  totCities: any;
  startDate: string = '';
  endDate: string = '';
  getDashReport: any;
  getReportSell: any[] = [];
  getReportRent: any[] = [];
  getReportRequest: any[] = [];
  getReportCommission: any[] = [];
  sellWord: any;
  rentWord: any;
  requestWord: any;
  commissionWord: any;
  countWord: any;
  deletedAds: any;
  getvalue: any[] = [];

  public pieChartOptions: Partial<apexChartOptions>;

  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {
    this.pieChartOptions = {
      nonAxisSeries: [0, 0, 0],
      colors: ['#50a820', '#f3c64f', '#ee9e43'],
      chart: {
        height: 300,
        type: 'donut',
      },
      chartLabels: ['Total Sales for the week', 'Total Sales for the month', 'Total Sales during the year'],
      stroke: {
        colors: ['rgba(0,0,0,0)'],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
      },
      dataLabels: {
        enabled: true,
        formatter(value: any, opts: any): any {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
    };
  }

  ngOnInit(): void {
    this.adsArrayLabels = ['Total Sales for the week', 'Total Sales for the month', 'Total Sales during the year'];
    this.authService.dashboard('POULTRY').subscribe((res: any) => {
      // Defer state updates to the next microtask to avoid NG0100 in dev mode
      Promise.resolve().then(() => {
        this.getvalue = res.data;
        this.postsArray.push(
          Number(this.getvalue[0].weekSalesCount.weekSalesCount),
          Number(this.getvalue[0].monthSalesCount.monthSalesCount),
          Number(this.getvalue[0].yearSalesCount.yearSalesCount),
        );
        this.pieChartOptions = {
          nonAxisSeries: this.postsArray,
          colors: ['#50a820', '#f3c64f', '#ee9e43'],
          chart: {
            height: 300,
            type: 'donut',
          },
          chartLabels: this.adsArrayLabels,
          stroke: {
            colors: ['rgba(0,0,0,0)'],
          },
          legend: {
            position: 'top',
            horizontalAlign: 'center',
          },
          dataLabels: {
            enabled: true,
            formatter(value: any, opts: any): any {
              return opts.w.config.series[opts.seriesIndex];
            },
          },
        };
        // Trigger change detection for the deferred updates
        this.cdr.detectChanges();
      });
    });
  }
}
