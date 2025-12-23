import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
})
export class AboutusComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '500px',
    minHeight: '0',
    maxHeight: '500px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    sanitize: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'poppins', name: 'Poppins' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    // uploadWithCredentials: false,
    // sanitize: true,
    // toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };

  addAboutus: FormGroup;
  aboutId: any;
  getAboutData: any;

  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.addAboutus = this.fb.group({
      enName: ['', [Validators.required]],
      arName: ['', [Validators.required]],
    });

    this.authService.getContent().subscribe((res: any) => {
      this.getAboutData = res.data[0];
      this.aboutId = res.data[0].id;
      this.addAboutus = this.fb.group({
        enName: [this.getAboutData['enName']],
        arName: [this.getAboutData['arName']],
      });
    });
  }

  onSubmit() {
    this.addAboutus.value.key = 'ABOUT';
    this.authService.updateContent(this.addAboutus.value, this.aboutId).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Aboutus content updated successfully');
      } else {
        this.toastr.error(res.massage);
        this.ngOnInit();
      }
    });
  }
}
