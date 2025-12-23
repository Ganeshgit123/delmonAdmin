import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  errorMessge: string;
  isShow = false;
  showPassword = false;
  showModalPassword = false;
  input: any;
  logOutForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, public fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) { }


  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';

    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  changeText() {
    this.isShow = false;
  }
  onSubmit() {
    this.submitted = true;

    // console.log("form",this.loginForm.value)

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return false;
    }

    this.isShow = false;
    this.authService.signIn(this.loginForm.value)
      .subscribe((res: any) => {
        if (res.error == false) {
          sessionStorage.setItem("access_token", res.token);
          sessionStorage.setItem("adminId", res.id);
          sessionStorage.setItem("userType", res.userType);
          sessionStorage.setItem("roleName", res.roleName);
          sessionStorage.setItem("permission", JSON.stringify(res.roles));
          this.router.navigate([this.returnUrl]);
          this.toastr.success('Success', res.massage);
          localStorage.setItem("dir", "ltr")
          localStorage.setItem("lang", "en")
          localStorage.setItem("flow", "POULTRY")
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }

}

