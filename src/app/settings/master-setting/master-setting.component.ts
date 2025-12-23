import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-setting',
  templateUrl: './master-setting.component.html',
  styleUrls: ['./master-setting.component.scss'],
})
export class MasterSettingComponent implements OnInit {
  getvalue = [];
  whatsAppForm: FormGroup;
  emailForm: FormGroup;
  callForm: FormGroup;
  deliveryTimeForm: FormGroup;
  maxDateChooseForm: FormGroup;
  countryCodeForm: FormGroup;
  vatForm: FormGroup;
  storeAddressForm: FormGroup;
  supportUrlForm: FormGroup;
  aboutForm: FormGroup;
  termsForm: FormGroup;
  privacyForm: FormGroup;
  faqForm: FormGroup;
  maxCartonPerDayForm: FormGroup;
  loyaltyPointForm: FormGroup;
  maxCartonPerDayEmployeeForm: FormGroup;
  submitted = false;
  whatsValue = [];
  emailValue = [];
  callVAlue = [];
  deliveryVAlue = [];
  maxDayChosseValue = [];
  calendChooseValue = [];
  countryCodeValue = [];
  storeAddValue = [];
  vatVAlue = [];
  supportURLVAlue = [];
  aboutURLValue = [];
  termsURLVALue = [];
  privacyURLValue = [];
  faqVAlue = [];
  maxCartonSingleDay = [];
  loyaltyPointPerOrder = [];
  maxCartonEmployeeDay = [];
  formData: any;
  formId: any;
  showAccept = true;
  superAdminRole = false;
  cardPaymentValue = [];
  codPaymentValue = [];
  selfPickupValue = [];
  deliveryTypeValue = [];
  deliveryDate: any;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.whatsAppForm = this.fb.group({
      key: 'whatsAppNumber',
      enValue: [''],
    });
    this.emailForm = this.fb.group({
      key: 'email',
      enValue: [''],
    });
    this.callForm = this.fb.group({
      key: 'call',
      enValue: [''],
    });
    this.deliveryTimeForm = this.fb.group({
      key: 'deliveryTime',
      enValue: [''],
    });
    this.maxDateChooseForm = this.fb.group({
      key: 'max_delivery_date_can_choose',
      enValue: [''],
    });
    this.countryCodeForm = this.fb.group({
      key: 'countryCode',
      enValue: [''],
    });
    this.vatForm = this.fb.group({
      key: 'vat',
      enValue: [''],
    });
    this.storeAddressForm = this.fb.group({
      key: 'storeAddress',
      enValue: [''],
    });
    this.supportUrlForm = this.fb.group({
      key: 'supportUrl',
      enValue: [''],
    });
    this.aboutForm = this.fb.group({
      key: 'about',
      enValue: [''],
    });
    this.termsForm = this.fb.group({
      key: 'termsAndCondition',
      enValue: [''],
    });
    this.privacyForm = this.fb.group({
      key: 'privacyPolicy',
      enValue: [''],
    });
    this.faqForm = this.fb.group({
      key: 'faq',
      enValue: [''],
    });
    this.maxCartonPerDayForm = this.fb.group({
      key: 'max_carton_discount_per_day',
      enValue: [''],
    });
    this.loyaltyPointForm = this.fb.group({
      key: 'loyalty_point_per_order',
      enValue: [''],
    });
    this.maxCartonPerDayEmployeeForm = this.fb.group({
      key: ['max_carton_discount_per_day_employee'],
      enValue: [''],
    });
  }

  ngOnInit(): void {
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    this.authService.getSettings().subscribe((res: any) => {
      this.whatsValue = res.data.filter((element) => {
        return element.key === 'whatsAppNumber';
      });
      this.whatsAppForm = this.fb.group({
        key: 'whatsAppNumber',
        enValue: [this.whatsValue[0].enValue],
      });

      this.emailValue = res.data.filter((element) => {
        return element.key === 'email';
      });
      this.emailForm = this.fb.group({
        key: 'email',
        enValue: [this.emailValue[0].enValue],
      });

      this.callVAlue = res.data.filter((element) => {
        return element.key === 'call';
      });
      this.callForm = this.fb.group({
        key: 'call',
        enValue: [this.callVAlue[0].enValue],
      });

      this.deliveryVAlue = res.data.filter((element) => {
        return element.key === 'deliveryTime';
      });
      this.deliveryTimeForm = this.fb.group({
        key: 'deliveryTime',
        enValue: [this.deliveryVAlue[0].enValue],
      });

      this.maxDayChosseValue = res.data.filter((element) => {
        return element.key === 'max_delivery_date_can_choose';
      });
      this.maxDateChooseForm = this.fb.group({
        key: 'max_delivery_date_can_choose',
        enValue: [this.maxDayChosseValue[0].enValue],
      });

      this.calendChooseValue = res.data.filter((element) => {
        return element.key === 'can_calendar_show_for_delivery';
      });

      this.countryCodeValue = res.data.filter((element) => {
        return element.key === 'countryCode';
      });
      this.countryCodeForm = this.fb.group({
        key: 'countryCode',
        enValue: [this.countryCodeValue[0].enValue],
      });

      this.vatVAlue = res.data.filter((element) => {
        return element.key === 'vat';
      });
      this.vatForm = this.fb.group({
        key: 'vat',
        enValue: [this.vatVAlue[0].enValue],
      });

      this.storeAddValue = res.data.filter((element) => {
        return element.key === 'storeAddress';
      });
      this.storeAddressForm = this.fb.group({
        key: 'storeAddress',
        enValue: [this.storeAddValue[0].enValue],
      });

      this.supportURLVAlue = res.data.filter((element) => {
        return element.key === 'supportUrl';
      });
      this.supportUrlForm = this.fb.group({
        key: 'supportUrl',
        enValue: [this.supportURLVAlue[0].enValue],
      });

      this.aboutURLValue = res.data.filter((element) => {
        return element.key === 'about';
      });
      this.aboutForm = this.fb.group({
        key: 'about',
        enValue: [this.aboutURLValue[0].enValue],
      });

      this.termsURLVALue = res.data.filter((element) => {
        return element.key === 'termsAndCondition';
      });
      this.termsForm = this.fb.group({
        key: 'termsAndCondition',
        enValue: [this.termsURLVALue[0].enValue],
      });

      this.privacyURLValue = res.data.filter((element) => {
        return element.key === 'privacyPolicy';
      });
      this.privacyForm = this.fb.group({
        key: 'privacyPolicy',
        enValue: [this.privacyURLValue[0].enValue],
      });

      this.faqVAlue = res.data.filter((element) => {
        return element.key === 'faq';
      });
      this.faqForm = this.fb.group({
        key: 'faq',
        enValue: [this.faqVAlue[0].enValue],
      });

      this.maxCartonSingleDay = res.data.filter((element) => {
        return element.key === 'max_carton_discount_per_day';
      });
      this.maxCartonPerDayForm = this.fb.group({
        key: 'max_carton_discount_per_day',
        enValue: [this.maxCartonSingleDay[0].enValue],
      });

      this.loyaltyPointPerOrder = res.data.filter((element) => {
        return element.key === 'loyalty_point_per_order';
      });
      this.loyaltyPointForm = this.fb.group({
        key: 'loyalty_point_per_order',
        enValue: [this.loyaltyPointPerOrder[0].enValue],
      });

      this.maxCartonEmployeeDay = res.data.filter((element) => {
        return element.key === 'max_carton_discount_per_day_employee';
      });
      this.maxCartonPerDayEmployeeForm = this.fb.group({
        key: 'max_carton_discount_per_day_employee',
        enValue: [this.maxCartonEmployeeDay[0].enValue],
      });

      this.cardPaymentValue = res.data.filter((element) => {
        return element.key === 'is_card_payment';
      });

      this.codPaymentValue = res.data.filter((element) => {
        return element.key === 'is_cod';
      });

      this.selfPickupValue = res.data.filter((element) => {
        return element.key === 'is_self_pickup';
      });

      this.deliveryTypeValue = res.data.filter((element) => {
        return element.key === 'is_delivery';
      });
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      const settingPermssion = JSON.parse(sessionStorage.getItem('permission'));
      const orderPermission = settingPermssion?.find((ele) => ele.area == 'master')?.write == 1;
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission;
    }
  }

  submitData(value) {
    if (value == 'whats') {
      this.formData = this.whatsAppForm.value;
      this.formId = this.whatsValue[0].id;
    } else if (value == 'email') {
      this.formData = this.emailForm.value;
      this.formId = this.emailValue[0].id;
    } else if (value == 'phone') {
      this.formData = this.callForm.value;
      this.formId = this.callVAlue[0].id;
    } else if (value == 'deliveryDate') {
      this.formData = this.deliveryTimeForm.value;
      this.formId = this.deliveryVAlue[0].id;
    } else if (value == 'maxDate') {
      this.formData = this.maxDateChooseForm.value;
      this.formId = this.maxDayChosseValue[0].id;
    } else if (value == 'countryCode') {
      this.formData = this.countryCodeForm.value;
      this.formId = this.countryCodeValue[0].id;
    } else if (value == 'vat') {
      this.formData = this.vatForm.value;
      this.formId = this.vatVAlue[0].id;
    } else if (value == 'storeAddss') {
      this.formData = this.storeAddressForm.value;
      this.formId = this.storeAddValue[0].id;
    } else if (value == 'suportUrl') {
      this.formData = this.supportUrlForm.value;
      this.formId = this.supportURLVAlue[0].id;
    } else if (value == 'aboutLink') {
      this.formData = this.aboutForm.value;
      this.formId = this.aboutURLValue[0].id;
    } else if (value == 'termsLink') {
      this.formData = this.termsForm.value;
      this.formId = this.termsURLVALue[0].id;
    } else if (value == 'privacyLink') {
      this.formData = this.privacyForm.value;
      this.formId = this.privacyURLValue[0].id;
    } else if (value == 'faqLink') {
      this.formData = this.faqForm.value;
      this.formId = this.faqVAlue[0].id;
    } else if (value == 'maxiCartonPerDay') {
      this.formData = this.maxCartonPerDayForm.value;
      this.formId = this.maxCartonSingleDay[0].id;
    } else if (value == 'loyaltyPoint') {
      this.formData = this.loyaltyPointForm.value;
      this.formId = this.loyaltyPointPerOrder[0].id;
    } else if (value == 'maxCartonEmployeePerDay') {
      this.formData = this.maxCartonPerDayEmployeeForm.value;
      this.formId = this.maxCartonEmployeeDay[0].id;
    }

    this.authService.updateSetting(this.formData, this.formId).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', 'Updated Successfully');
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', 'Error');
      }
    });
  }

  changeStatus(value) {
    const visible = value.enValue === 'true' ? 'false' : 'true';
    const object = { enValue: visible };

    this.authService.updateSetting(object, value.id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }

  changeValues(value) {
    // console.log("value",value)
    const visible = value.enValue === '1' ? '0' : '1';
    const object = { key: value.key, enValue: visible };

    // console.log("obj",object)
    this.authService.updateSetting(object, value.id).subscribe((res: any) => {
      if (res.success == true) {
        this.toastr.success('Success ', res.message);
        this.ngOnInit();
      } else {
        this.toastr.error('Enter valid ', res.message);
      }
    });
  }
}
