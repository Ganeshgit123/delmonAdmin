import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexResponsive, ApexTooltip, ApexFill, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts';

export type apexChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle,
  chartLabels: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  getDashboardData: any;
  postsArray = [];
  adsSeparateArray = [];
  usersListArray = [];
  adsArrayLabels = [];
  adsSeparateArrayLabels = [];
  usersListArrayLabels = [];
  reportedAds: any;
  totCommission: any;
  totCategories: any;
  totCities: any;
  startDate: any = '';
  endDate: any = '';
  getDashReport: any;
  getReportSell: any = [];
  getReportRent: any = [];
  getReportRequest: any = [];
  getReportCommission: any = [];
  sellWord: any;
  rentWord: any;
  requestWord: any;
  commissionWord: any;
  countWord: any;
  deletedAds: any;
  getvalue = [];

  public pieChartOptions: Partial<apexChartOptions>;

  constructor(public authService: AuthService, private toastr: ToastrService) {
    this.pieChartOptions = {
      nonAxisSeries: [0, 0, 0],
      colors: ["#50a820", "#f3c64f", "#ee9e43"],
      chart: {
        height: 300,
        type: "donut"
      },
      chartLabels: ['Total Sales for the week', 'Total Sales for the month', 'Total Sales during the year'],
      stroke: {
        colors: ['rgba(0,0,0,0)']
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: true,
        formatter(value: any, opts: any): any {
          return opts.w.config.series[opts.seriesIndex];
        },
      }
    };

  }

  ngOnInit(): void {
    this.adsArrayLabels = ['Total Sales for the week', 'Total Sales for the month', 'Total Sales during the year'];
    this.authService.dashboard('POULTRY').subscribe(
      (res: any) => {
        this.getvalue = res.data;
        this.postsArray.push(
          Number(this.getvalue[0].weekSalesCount.weekSalesCount),
          Number(this.getvalue[0].monthSalesCount.monthSalesCount),
          Number(this.getvalue[0].yearSalesCount.yearSalesCount)
        );
        // this.postsArray.push(90, 89, 89);
        // console.log("vdf", this.postsArray)
        this.pieChartOptions = {
          nonAxisSeries: this.postsArray,
          colors: ["#50a820", "#f3c64f", "#ee9e43"],
          chart: {
            height: 300,
            type: "donut"
          },
          chartLabels: this.adsArrayLabels,
          stroke: {
            colors: ['rgba(0,0,0,0)']
          },
          legend: {
            position: 'top',
            horizontalAlign: 'center'
          },
          dataLabels: {
            enabled: true,
            formatter(value: any, opts: any): any {
              return opts.w.config.series[opts.seriesIndex];
            },
          }
        };
      });
  }


}
