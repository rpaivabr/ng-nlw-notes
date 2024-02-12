import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Note } from '../models/note';
import { formatDistanceToNow } from '../utils/date';
import { NoteCardDialogComponent } from './note-card-dialog.component';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [MatDialogModule],
  host: {
    class: 'contents',
  },
  template: `
    <button
      (click)="openDialog()"
      class="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400"
    >
      <span class="text-sm font-medium text-slate-300">
        {{ formatDistanceToNow(note.date) }}
      </span>
      <p class="text-sm leading-6 text-slate-400">{{ note.content }}</p>
      <div
        class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0"
      ></div>
    </button>
  `,
})
export class NoteCardComponent {
  private dialog = inject(MatDialog);
  @Input({ required: true }) note!: Note;
  @Output() noteDeleted = new EventEmitter<string>();
  formatDistanceToNow = formatDistanceToNow;

  openDialog() {
    const dialogRef = this.dialog.open(NoteCardDialogComponent, {
      data: { note: this.note },
      backdropClass: ['inset-0', 'fixed', 'bg-black/50'],
    });

    dialogRef.afterClosed().subscribe((id?: string) => {
      if (id) {
        this.noteDeleted.emit(id)
      }
    })
  }
}
