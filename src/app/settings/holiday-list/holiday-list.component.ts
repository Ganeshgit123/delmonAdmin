import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {
  holidayForm: FormGroup;
  today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService) {
    this.holidayForm = this.fb.group({
      dates: this.fb.array([]) // initialize empty
    });
  }

  ngOnInit(): void {
    this.fetchHolidayList();
  }

  fetchHolidayList() {
    this.dates.clear();

    this.authService.getSettings().subscribe(
      (res: any) => {
        const holidayResponse = res.data.find((element: any) => element.key === 'holidayList');
        const enValue: string = holidayResponse?.enValue;

        if (enValue && enValue !== 'null') {
          try {
            const dateStrings: string[] = JSON.parse(enValue);
            dateStrings.forEach(dateStr => {
              const [dd, mm, yyyy] = dateStr.split('/');
              const formatted = `${yyyy}-${mm}-${dd}`;
              this.dates.push(this.fb.control(formatted, Validators.required));
            });
          } catch (e) {
            console.error('Invalid JSON for holidayList', e);
            this.dates.push(this.fb.control('', Validators.required));
          }
        } else {
          this.dates.push(this.fb.control('', Validators.required));
        }
      },
      (error) => {
        console.error('Error loading holidays', error);
        this.dates.push(this.fb.control('', Validators.required));
      }
    );
  }


  get dates(): FormArray {
    return this.holidayForm.get('dates') as FormArray;
  }

  addDate(): void {
    this.dates.push(this.fb.control('', Validators.required));
  }

  removeDate(index: number): void {
    this.dates.removeAt(index);
  }


  submit() {
    this.dates.controls.forEach(control => control.markAsTouched());

    if (this.holidayForm.invalid) {
      this.toastr.error('Please fill all dates correctly', 'Validation Error');
      return;
    }

    const formattedDates = this.dates.value.map((date: string) => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    });

    const payload = {
      key: 'holidayList',
      enValue: JSON.stringify(formattedDates),
      arValue: 'null',
      latitude: null,
      longitude: null
    };

    this.authService.updateSetting(payload, 26)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          this.ngOnInit();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

}
