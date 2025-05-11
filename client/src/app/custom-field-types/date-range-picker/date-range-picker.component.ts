import {ChangeDetectionStrategy, Component, Injectable, inject, output} from '@angular/core';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDateRangeSelectionStrategy,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DatePipe, NgIf} from "@angular/common";


@Injectable()
export class SevenDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter<D>);

  selectionFinished(date: D | null): DateRange<D> {
    return this._createSevenDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createSevenDayRange(activeDate);
  }

  private _createSevenDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}



@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRangeSelectionStrategy,
    },
    provideNativeDateAdapter(),
  ],
  imports: [MatFormFieldModule, MatDatepickerModule, DatePipe, NgIf],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent {
  selectedRange: DateRange<Date> | null = null;
  rangeChanged = output<DateRange<Date> | null>();

  onDateRangeChange() {
    this.rangeChanged.emit(this.selectedRange)
  }
}
