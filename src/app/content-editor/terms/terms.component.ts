import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
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
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'},
        { class: 'poppins', name: 'Poppins' }
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
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
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};

addterms: FormGroup;
termsId:any;
getTermsData: any;

constructor(public authService: AuthService, public fb: FormBuilder, private toastr: ToastrService,) { }

  ngOnInit(): void {

    this.addterms = this.fb.group({
      enName: ['', [Validators.required]],
      arName: ['', [Validators.required]],
    });


    this.authService.getContent().subscribe(
      (res: any) => {
        this.getTermsData = res.data[1];
        this.termsId = res.data[1].id;
        this.addterms = this.fb.group({
          enName:  [this.getTermsData['enName']],
          arName:  [this.getTermsData['arName']],
        });
      }
    );
  }

  onSubmit(){
    this.addterms.value.key = "TERMS";
    this.authService.updateContent(this.addterms.value,this.termsId)
    .subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success("Terms content updated successfully");
      } else {
        this.toastr.error(res.massage);
        this.ngOnInit();
      }
    })
  }

}
