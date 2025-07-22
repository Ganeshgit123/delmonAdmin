import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {
  selectedDates: Date[] = [];
  apiHighlightedDates: Date[] = [];
  calendarKey: number = 0; // Key for triggering re-render

  constructor(public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchHighlightedDates();
  }

  fetchHighlightedDates() {
    this.authService.getSettings().pipe(take(1)).subscribe(
      (res: any) => {
        const holidayEntry = res.data.find(el => el.key === 'holidayList');
        if (!holidayEntry || !holidayEntry.enValue) {
          return;
        }

        try {
          const holidayStrings: string[] = JSON.parse(holidayEntry.enValue);
          if (Array.isArray(holidayStrings)) {
            this.apiHighlightedDates = holidayStrings
              .filter(dateStr => /\d{2}\/\d{2}\/\d{4}/.test(dateStr))
              .map(dateStr => {
                const [day, month, year] = dateStr.split('/').map(Number);
                return new Date(year, month - 1, day);
              });

            // console.log('Parsed holiday dates:', this.apiHighlightedDates);
          }
        } catch (error) {
          console.error('Error parsing holiday dates:', error);
        }
      });
  }

  highlightDates = (date: Date): string => {
    const formattedDate = date.toDateString();

    // Check if it's a holiday
    const isHoliday = this.apiHighlightedDates.some(d => d.toDateString() === formattedDate);

    if (isHoliday) {
      return 'holiday-date'; // Red for holidays
    }
  };

  onDateSelect(selectedDate: Date) {
    const formattedDate = selectedDate.toDateString();
    const index = this.selectedDates.findIndex(d => d.toDateString() === formattedDate);

    if (index !== -1) {
      // Remove if already selected
      this.selectedDates.splice(index, 1);
    } else {
      // Add new selection
      this.selectedDates.push(new Date(selectedDate));

      this.selectedDates = this.selectedDates.filter(date => !this.apiHighlightedDates.some(d => d.getTime() === date.getTime()));
    }
  }

  deleteSelected(selectedDate: Date) {
    const formattedDate = selectedDate.toDateString();
    const index = this.selectedDates.findIndex(d => d.toDateString() === formattedDate);

    if (index !== -1) {
      // Remove if already selected
      this.selectedDates.splice(index, 1);
    } else {
      // Add new selection
      this.selectedDates.push(new Date(selectedDate));

      this.selectedDates = this.selectedDates.filter(date => !this.apiHighlightedDates.some(d => d.getTime() === date.getTime()));
    }
  }

  onSubmitData() {

    let datesArray = this.selectedDates;

    // Convert each date in the array to DD/MM/YYYY format
    let formattedDates = datesArray.map(date => {
      let day = date.getDate().toString().padStart(2, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let year = date.getFullYear();
      return `${day}/${month}/${year}`;
    });

    const stingDate = JSON.stringify(formattedDates);
    // console.log("Fef", stingDate)

    const object = { key: 'holidayList', enValue: stingDate }
    this.authService.updateSetting(object, 26)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success ', 'Updated Successfully');
          // Refresh the page
          window.location.reload();
        } else {
          this.toastr.error('Enter valid ', 'Error');
        }
      });
  }

}

