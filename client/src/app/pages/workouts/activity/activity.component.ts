import {Component, input} from '@angular/core';
import {Workout} from "../../../models/Workout";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "../../../confirmation-dialog/confirmation-dialog.component";
import {CdkDrag, CdkDragPlaceholder, CdkDropList} from "@angular/cdk/drag-drop";
import {WorkoutFormDialogComponent} from "../workout-form-dialog/workout-form-dialog.component";
import {WorkoutService} from "../../../services/workout.service";

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, MatIcon, CdkDrag, CdkDropList, CdkDragPlaceholder],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {

  workout = input.required<Workout>();

  constructor(public dialog: MatDialog, public workoutService: WorkoutService) {
  }


  openDeleteDialog(){
    let title = this.workout().isTemplate ? "Delete template?" : "Delete workout?"
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: { workout: this.workout(), title:title}})

    dialogRef.afterClosed().subscribe(result => {
      if(result == "cancel") return;
      this.update()
    })
  }

  openEditDialog(): void {
    console.log(this.workout())
    let dialogRef = this.dialog.open(WorkoutFormDialogComponent,
      {data: { workout: this.workout(), title: "Edit Workout" }}
    )

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      this.update()
      }
    })
  }

  update() {
    if(this.workout().isTemplate){
      this.workoutService.triggerGetTemplates.next();
    }
    else{
      this.workoutService.triggerGetWorkouts.next();
    }
  }
}
