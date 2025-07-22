import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  normalUserForm: FormGroup;
  submitted = false;
  employeeForm: FormGroup;
  merchantForm: FormGroup;

  constructor(private modalService: NgbModal, public fb: FormBuilder, public authService: AuthService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,
    private translate: TranslateService,) { }

  ngOnInit(): void {
    this.normalUserForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8}")]],
      userType: [""],
    });

    this.employeeForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8}")]],
      employeeNumber: ['',[Validators.required]],
      userType: [""],
    });

    this.merchantForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8}")]],
      crNumber: ['',[Validators.required]],
      userType: [""],
    });    
  }

  get f() { return this.normalUserForm.controls; }
  get empf() { return this.employeeForm.controls; }
  get merchantf() { return this.merchantForm.controls; }


  addNormalUser(content) {
    this.submitted = false;
    this.normalUserForm.reset();
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  onSubmitData() {
    this.submitted = true;
    if (!this.normalUserForm.valid) {
      return false;
    }
    this.submitted = false;
    this.normalUserForm.value.userType = 'USER'
    // console.log("Fef",this.normalUserForm.value)
    this.authService.createNormalUser(this.normalUserForm.value)
      .subscribe((res: any) => {
        if (res.error == true) {
          this.toastr.success('Success ', res.message);
          this.spinner.hide();
          this.normalUserForm.reset();
          this.modalService.dismissAll();
          this.router.navigate(['/normal_users']);
        } else {
          this.toastr.error('Enter valid ', res.message);
        }
      });
  }

  addEmployee(employeeContent){
    this.submitted = false;
    this.employeeForm.reset();
    this.modalService.open(employeeContent, { centered: true, size: 'md' });
  }

  onSubmitEmployeeData() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return false;
    }
    this.submitted = false;
    this.employeeForm.value.userType = 'EMPLOYEE'
     // console.log("Fef",this.employeeForm.value)
     this.authService.createNormalUser(this.employeeForm.value)
     .subscribe((res: any) => {
       if (res.error == false) {
         this.toastr.success('Success ', res.message);
         this.spinner.hide();
         this.normalUserForm.reset();
         this.modalService.dismissAll();
         this.router.navigate(['/employees']);
       } else {
         this.toastr.error('Enter valid ', res.message);
       }
     });
  }

  addMerchant(merchantForm){
    this.submitted = false;
    this.merchantForm.reset();
    this.modalService.open(merchantForm, { centered: true, size: 'md' });
  }

  onSubmitMerchantData() {
    this.submitted = true;
    if (!this.merchantForm.valid) {
      return false;
    }
    this.submitted = false;
    this.merchantForm.value.userType = 'MERCHANT'
     // console.log("Fef",this.merchantForm.value)
     this.authService.createNormalUser(this.merchantForm.value)
     .subscribe((res: any) => {
       if (res.error == false) {
         this.toastr.success('Success ', res.message);
         this.spinner.hide();
         this.normalUserForm.reset();
         this.modalService.dismissAll();
         this.router.navigate(['/merchants']);
       } else {
         this.toastr.error('Enter valid ', res.message);
       }
     });
  }

}
