import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { formatDistanceToNow } from '../utils/date';

@Component({
  selector: 'app-note-card-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <div
      class="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none"
    >
      <div
        (click)="handleClose()"
        class="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100  cursor-pointer"
      >
        <span class="size-5 px-2">x</span>
      </div>
      <div class="flex flex-1 flex-col gap-3 p-5">
        <span class="text-sm font-medium text-slate-300">
          {{ formatDistanceToNow(note.date) }}
        </span>

        <p class="text-sm leading-6 text-slate-400">{{ note.content }}</p>
      </div>

      <button
        type="button"
        (click)="deleteNote(note.id)"
        class="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
      >
        Deseja
        <span class="text-red-400 group-hover:underline">
          apagar essa nota
        </span>

        ?
      </button>
    </div>
  `,
})
export class NoteCardDialogComponent {
  private dialogRef = inject(MatDialogRef<NoteCardDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);
  note = this.data.note;
  formatDistanceToNow = formatDistanceToNow;

  handleClose() {
    this.dialogRef.close();
  }

  deleteNote(id: string) {
    this.dialogRef.close(id);
  }
}
