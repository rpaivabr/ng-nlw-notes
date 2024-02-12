import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewNoteCardComponent } from './components/new-note-card.component';
import { Note } from './models/note';
import { NoteCardComponent } from './components/note-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from './components/success-snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NewNoteCardComponent,
    NoteCardComponent,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private snackbar = inject(MatSnackBar);
  logo = 'assets/logo-nlw-expert.svg';
  search = signal('');
  notes = signal<Note[]>(JSON.parse(localStorage.getItem('notes') ?? '[]'));
  filteredNotes = computed(() =>
    this.search()
      ? this.notes().filter((note) =>
          note.content
            .toLocaleLowerCase()
            .includes(this.search().toLocaleLowerCase())
        )
      : this.notes()
  );

  handleSearch(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const query = inputEl.value;
    this.search.set(query);
  }

  handleNoteCreated(content: string) {
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };
    this.notes.update((notes) => [newNote, ...notes]);
    this.snackbar.openFromComponent(SuccessSnackbarComponent, {
      duration: 1000 * 5,
    });
    localStorage.setItem('notes', JSON.stringify(this.notes()));
  }

  handleNoteDeleted(id: string) {
    this.notes.update((notes) => notes.filter((note) => note.id !== id));
  }
}
