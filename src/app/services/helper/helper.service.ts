import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string, action: string = 'Close', duration: number = 3000 ): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar-success']
    });
  }

  showError(message: string, action: string = 'Close', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar-error']
    })
  }

}
