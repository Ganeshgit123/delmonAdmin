import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class FooterComponent implements OnInit {
  year: any;
  constructor() {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    // console.log(this.year)
  }
}
