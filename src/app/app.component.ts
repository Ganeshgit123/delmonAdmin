import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'delmon-angular';
  lang: any;
  dir: any;

 constructor(private translateservice: TranslateService){
    const lang = localStorage.getItem("lang") || "en";
    const dir = localStorage.getItem("dir") || "ltr";
    this.translateservice.use(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }
  ngOnInit(): void {
    this.lang = localStorage.getItem("lang") || "en";
    this.dir = localStorage.getItem("dir") || "ltr";
  }

}
