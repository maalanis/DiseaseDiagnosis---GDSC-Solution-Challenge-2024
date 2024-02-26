import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.css'],
  // Make sure to remove 'standalone: true' if you are not using Angular 14 or later
})
export class DisclaimerDialogComponent {
  // Inject MatDialogRef in the constructor
  constructor(public dialogRef: MatDialogRef<DisclaimerDialogComponent>) {}

  onUnderstandClick(): void {
    console.log('Understand button clicked'); // Check if this logs to the console
    this.dialogRef.close();
  }
}
