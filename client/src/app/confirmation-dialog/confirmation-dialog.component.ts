import {Component, inject} from '@angular/core';
import {FormlyModule} from "@ngx-formly/core";
import {ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {WorkoutService} from "../services/workout.service";

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    FormlyModule,
    ReactiveFormsModule,
    MatDialogTitle
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {

  constructor(
              private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              private workoutService: WorkoutService) {
  }
  data = inject(MAT_DIALOG_DATA)

  Yes(){
    this.workoutService.deleteWorkout(this.data.workout.id).subscribe(
      () => this.dialogRef.close()
    );

  }

  No(){
    this.dialogRef.close("cancel");
  }
}
