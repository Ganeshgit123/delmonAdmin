import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
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

addPrivacy: FormGroup;
privacyId:any;
getPrivacyData: any;

constructor(public authService: AuthService, public fb: FormBuilder, private toastr: ToastrService,) { }

  ngOnInit(): void {

    this.addPrivacy = this.fb.group({
      enName: ['', [Validators.required]],
      arName: ['', [Validators.required]],
    });

    this.authService.getContent().subscribe(
      (res: any) => {
        this.getPrivacyData = res.data[2];
        this.privacyId = res.data[2].id;
        this.addPrivacy = this.fb.group({
          enName:  [this.getPrivacyData['enName']],
          arName:  [this.getPrivacyData['arName']],
        });
      }
    );
  }

  onSubmit(){
    this.addPrivacy.value.key = "PRIVACY";
    this.authService.updateContent(this.addPrivacy.value,this.privacyId)
    .subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success("Privacy content updated successfully");
      } else {
        this.toastr.error(res.massage);
        this.ngOnInit();
      }
    })
  }

}
