import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewNoteCardDialogComponent } from './new-note-card-dialog.component';

@Component({
  selector: 'app-new-note-card',
  standalone: true,
  imports: [MatDialogModule],
  host: {
    class: 'contents',
  },
  template: `
    <button
      (click)="openDialog()"
      class="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"
    >
      <span class="text-sm font-medium text-slate-200"> Adicionar nota </span>
      <p class="text-sm leading-6 text-slate-400">
        Grave uma nota em áudio que será convertida para texto automaticamente
      </p>
    </button>
  `,
})
export class NewNoteCardComponent {
  private dialog = inject(MatDialog);
  @Output() noteCreated = new EventEmitter<string>();

  openDialog() {
    const dialogRef = this.dialog.open(NewNoteCardDialogComponent, {
      backdropClass: ['inset-0', 'fixed', 'bg-black/50'],
    });

    dialogRef.afterClosed().subscribe((content?: string) => {
      if (content) {
        this.noteCreated.emit(content)
      }
    })
  }
}
