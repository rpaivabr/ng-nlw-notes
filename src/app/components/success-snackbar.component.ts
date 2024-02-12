import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-snackbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
  template: `
    <span class="example-pizza-party" matSnackBarLabel
      >Nota criada com sucesso!</span
    >
    <span matSnackBarActions>
      <button
        mat-button
        matSnackBarAction
        (click)="snackBarRef.dismissWithAction()"
      >
        ✅
      </button>
    </span>
  `,
  host: {
    class: 'flex',
  },
})
export class SuccessSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
