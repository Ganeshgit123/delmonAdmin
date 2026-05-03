import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery-schedule',
  templateUrl: './delivery-schedule.component.html',
  styleUrls: ['./delivery-schedule.component.scss'],
})
export class DeliveryScheduleComponent implements OnInit {
  superAdminRole = false;
  showAccept = true;
  getvalue: any[] = [];
  form!: FormGroup;
  globalForm!: FormGroup;
  isApplyingMorning = false;
  isApplyingEvening = false;
  isSaving = false;
  isFormDirty = false;
  weekLabel = '';
  days = [
    { key: 'Monday', label: 'Monday' },
    { key: 'Tuesday', label: 'Tuesday' },
    { key: 'Wed', label: 'Wednesday' },
    { key: 'Thursday', label: 'Thursday' },
    { key: 'Friday', label: 'Friday' },
    { key: 'Saturday', label: 'Saturday' },
    { key: 'Sunday', label: 'Sunday' },
  ];
  // Summary stats (bound to the top stat cards)
  activeDaysCount = 0;
  morningShiftsCount = 0;
  eveningShiftsCount = 0;
  totalShiftsCount = 0;

  constructor(private fb: FormBuilder, public authService: AuthService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.updateWeekLabel();
    this.callRolePermission();
    if (sessionStorage.getItem('roleName') == 'superAdmin') {
      this.superAdminRole = true;
    } else {
      this.superAdminRole = false;
    }

    // Fetch and patch form with API data
    this.authService.getFullWeekSchedule().subscribe((res: any) => {
      this.getvalue = res.data;
      this.patchFormWithApiData(res.data);
      this.updateSummaryStats();
    });

    this.form = this.fb.group({
      week: this.fb.array(this.days.map((d) => this.createDay(d.key))),
    });

    this.form.valueChanges.subscribe(() => {
      this.isFormDirty = this.form.dirty;
    });

    this.globalForm = this.fb.group({
      morning: this.fb.group({
        start: ['09:00', Validators.required],
        end: ['13:00', Validators.required],
      }),
      evening: this.fb.group({
        start: ['16:00', Validators.required],
        end: ['20:00', Validators.required],
      }),
    });
  }

  callRolePermission() {
    if (sessionStorage.getItem('roleName') !== 'superAdmin') {
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission') ?? '[]')
      const orderPermission = settingPermssion?.find((ele: any) => ele.area == 'master')?.write == 1
      // console.log("fef",orderPermission)
      this.showAccept = orderPermission
    }
  }

  get week(): FormArray {
    return this.form.get('week') as FormArray;
  }

  get morningGroup(): FormGroup {
    return this.globalForm.get('morning') as FormGroup;
  }

  get eveningGroup(): FormGroup {
    return this.globalForm.get('evening') as FormGroup;
  }

  updateWeekLabel(): void {
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat

    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day === 0 ? 7 : day) - 1));

    // Get Sunday of current week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = monday.toLocaleDateString('en-US', options);
    const endStr = sunday.toLocaleDateString('en-US', { ...options, year: 'numeric' });

    this.weekLabel = `${startStr} - ${endStr}`;
  }

  createDay(day: string): FormGroup {
    return this.fb.group({
      name: [day],
      enabled: [false],
      morning: [{ value: false, disabled: true }],
      evening: [{ value: false, disabled: true }],
      morningStart: [{ value: '09:00', disabled: true }],
      morningEnd: [{ value: '13:00', disabled: true }],
      eveningStart: [{ value: '16:00', disabled: true }],
      eveningEnd: [{ value: '20:00', disabled: true }],
    });
  }


  /**
 * Maps API day_of_week (1=Mon ... 7=Sun) to form array index (0=Mon ... 6=Sun)
 * and patches each form group with the API values.
 */
  patchFormWithApiData(data: any[]): void {
    data.forEach((item) => {
      const index = item.day_of_week - 1;
      const dayGroup = this.week.at(index) as FormGroup;

      dayGroup.patchValue({
        enabled: item.is_day_active === 1,
        morning: item.is_morning_active === 1,
        evening: item.is_evening_active === 1,
        morningStart: this.formatTime(item.morning_start),
        morningEnd: this.formatTime(item.morning_end),
        eveningStart: this.formatTime(item.evening_start),
        eveningEnd: this.formatTime(item.evening_end),
      });

      if (item.is_day_active === 1) {
        dayGroup.get('morning')?.enable();
        dayGroup.get('evening')?.enable();

        if (item.is_morning_active === 1) {
          dayGroup.get('morningStart')?.enable();
          dayGroup.get('morningEnd')?.enable();
        } else {
          dayGroup.get('morningStart')?.disable();
          dayGroup.get('morningEnd')?.disable();
        }

        if (item.is_evening_active === 1) {
          dayGroup.get('eveningStart')?.enable();
          dayGroup.get('eveningEnd')?.enable();
        } else {
          dayGroup.get('eveningStart')?.disable();
          dayGroup.get('eveningEnd')?.disable();
        }

      } else {
        dayGroup.get('morning')?.disable();
        dayGroup.get('evening')?.disable();
        dayGroup.get('morningStart')?.disable();
        dayGroup.get('morningEnd')?.disable();
        dayGroup.get('eveningStart')?.disable();
        dayGroup.get('eveningEnd')?.disable();
      }
    });
  }

  /**
   * Strips seconds from "HH:mm:ss" → "HH:mm" for <input type="time">
   */
  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // "09:00:00" → "09:00"
  }

  /**
   * Recalculates the 4 summary stat cards from current form values.
   */
  updateSummaryStats(): void {
    const weekControls = this.week.controls;

    this.activeDaysCount = weekControls.filter(
      (d) => d.get('enabled')?.value
    ).length;

    this.morningShiftsCount = weekControls.filter(
      (d) => d.get('enabled')?.value && d.get('morning')?.value
    ).length;

    this.eveningShiftsCount = weekControls.filter(
      (d) => d.get('enabled')?.value && d.get('evening')?.value
    ).length;

    this.totalShiftsCount = this.morningShiftsCount + this.eveningShiftsCount;
  }

  // ─── Called when Day toggle changes ───────────────────────────────────────
  onDayToggle(index: number): void {
    const dayGroup = this.week.at(index) as FormGroup;
    const isDayActive = dayGroup.get('enabled')?.value;

    // If day is disabled, force morning & evening off too
    if (isDayActive) {
      // Enable shift controls when day is turned on
      dayGroup.get('morning')?.enable();
      dayGroup.get('evening')?.enable();
      dayGroup.get('morningStart')?.enable();
      dayGroup.get('morningEnd')?.enable();
      dayGroup.get('eveningStart')?.enable();
      dayGroup.get('eveningEnd')?.enable();
    } else {
      // Disable and reset shifts when day is turned off
      dayGroup.patchValue({ morning: false, evening: false });

      dayGroup.get('morning')?.disable();
      dayGroup.get('evening')?.disable();
      dayGroup.get('morningStart')?.disable();
      dayGroup.get('morningEnd')?.disable();
      dayGroup.get('eveningStart')?.disable();
      dayGroup.get('eveningEnd')?.disable();
    }

    this.postSchedule(index);
  }

  // ─── Called when Morning toggle changes ───────────────────────────────────
  onMorningToggle(index: number): void {
    const dayGroup = this.week.at(index) as FormGroup;
    const isMorningActive = dayGroup.get('morning')?.value;

    if (isMorningActive) {
      dayGroup.get('morningStart')?.enable();
      dayGroup.get('morningEnd')?.enable();
    } else {
      dayGroup.get('morningStart')?.disable();
      dayGroup.get('morningEnd')?.disable();
    }

    this.postSchedule(index);
  }

  // ─── Called when Evening toggle changes ───────────────────────────────────
  onEveningToggle(index: number): void {
    const dayGroup = this.week.at(index) as FormGroup;
    const isEveningActive = dayGroup.get('evening')?.value;

    if (isEveningActive) {
      dayGroup.get('eveningStart')?.enable();
      dayGroup.get('eveningEnd')?.enable();
    } else {
      dayGroup.get('eveningStart')?.disable();
      dayGroup.get('eveningEnd')?.disable();
    }

    this.postSchedule(index);
  }

  // ─── Builds payload for a single day and calls POST API ───────────────────
  postSchedule(index: number): void {
    const dayGroup = this.week.at(index) as FormGroup;
    const val = dayGroup.value;

    const payload = {
      schedules: [
        {
          day_of_week: index + 1,           // FormArray 0-based → API 1-based
          is_day_active: val.enabled,
          is_morning_active: val.enabled ? val.morning : false,
          morning_start: val.morningStart,
          morning_end: val.morningEnd,
          is_evening_active: val.enabled ? val.evening : false,
          evening_start: val.eveningStart,
          evening_end: val.eveningEnd,
        },
      ],
    };

    this.authService.postWeekSchedule(payload).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.message);
          this.updateSummaryStats();   // refresh stat cards after every toggle
        }
      },
      error: (err) => {
        this.toastr.error('Error ', 'Failed to update schedule');
        console.error(`Failed to update Day ${index + 1}`, err);
      },
    });
  }

  // ─── Pre-fill global form from API response ────────────────────────────────
  private setGlobalDefaultsFromData(data: any[]): void {
    const firstActive = data.find((d) => d.is_day_active === 1);
    if (firstActive) {
      this.globalForm.patchValue({
        morning: {
          start: this.formatTime(firstActive.morning_start),
          end: this.formatTime(firstActive.morning_end),
        },
        evening: {
          start: this.formatTime(firstActive.evening_start),
          end: this.formatTime(firstActive.evening_end),
        },
      });
    }
  }

  // ─── Apply Global Morning ──────────────────────────────────────────────────
  applyGlobalMorning(): void {
    if (this.morningGroup.invalid) return;

    const { start, end } = this.morningGroup.value;

    const payload = { shift: 'morning', start, end };

    this.isApplyingMorning = true;

    this.authService.postGlobalSchedule(payload).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.message);
          // Sync weekly form cards
          this.week.controls.forEach((dayGroup) => {
            dayGroup.patchValue({ morningStart: start, morningEnd: end });
          });

          this.isApplyingMorning = false;
        }
      },
      error: (err) => {
        this.toastr.error('Error ', err);
        this.isApplyingMorning = false;
      },
    });
  }

  // ─── Apply Global Evening ──────────────────────────────────────────────────
  applyGlobalEvening(): void {
    if (this.eveningGroup.invalid) return;

    const { start, end } = this.eveningGroup.value;

    const payload = { shift: 'evening', start, end };

    this.isApplyingEvening = true;

    this.authService.postGlobalSchedule(payload).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.message);
          // Sync weekly form cards
          this.week.controls.forEach((dayGroup) => {
            dayGroup.patchValue({ eveningStart: start, eveningEnd: end });
          });

          this.isApplyingEvening = false;
        }
      },
      error: (err) => {
        this.toastr.error('Error ', err);
        this.isApplyingEvening = false;
      },
    });
  }

  saveSchedule(): void {
    const schedules = this.week.controls.map((dayGroup, index) => {
      const val = (dayGroup as FormGroup).getRawValue();
      return {
        day_of_week: index + 1,
        is_day_active: val.enabled,
        is_morning_active: val.morning,
        morning_start: val.morningStart,
        morning_end: val.morningEnd,
        is_evening_active: val.evening,
        evening_start: val.eveningStart,
        evening_end: val.eveningEnd,
      };
    });

    const payload = { schedules };

    this.isSaving = true;

    this.authService.postWeekSchedule(payload).subscribe({
      next: (res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', res.message);
          this.isSaving = false;
          this.isFormDirty = false;  // ← disable button again after save
          this.form.markAsPristine(); // ← reset dirty state
        }
      },
      error: (err) => {
        this.toastr.error('Error ', err);
        this.isSaving = false;
      },
    });
  }
}