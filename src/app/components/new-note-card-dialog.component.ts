import { Component, effect, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-new-note-card-dialog',
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

      <form class="flex-1 flex flex-col">
        <div class="flex flex-1 flex-col gap-3 p-5">
          <span class="text-sm font-medium text-slate-300">
            Adicionar nota
          </span>

          @if (shouldShowOnboarding()) {
          <p class="text-sm leading-6 text-slate-400">
            Comece
            <button
              type="button"
              (click)="handleStartRecording()"
              class="font-medium text-lime-400 hover:underline"
            >
              gravando
            </button>
            uma nota em áudio ou se preferir
            <button
              type="button"
              (click)="handleStartEditor()"
              class="font-medium text-lime-400 hover:underline"
            >
              utilize apenas texto
            </button>
            .
          </p>
          } @else {
          <textarea
            autoFocus
            [value]="content()"
            (change)="handleContentChanged($event)"
            class="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
          ></textarea>
          }
        </div>

        @if (isRecording()) {
        <button
          type="button"
          (click)="handleStopRecording()"
          class="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
        >
          <div class="size-3 rounded-full bg-red-500 animate-pulse"></div>
          Gravando! (click p/ interromper)
        </button>
        } @else {
        <button
          type="button"
          (click)="handleSaveNote()"
          class="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
        >
          Salvar nota
        </button>
        }
      </form>
    </div>
  `,
})
export class NewNoteCardDialogComponent {
  private dialogRef = inject(MatDialogRef<NewNoteCardDialogComponent>);
  shouldShowOnboarding = signal(true);
  isRecording = signal(false);
  content = signal('');
  speechRecognition: SpeechRecognition | null = null;

  handleClose() {
    this.dialogRef.close()
  }

  handleStartEditor() {
    this.shouldShowOnboarding.set(false);
  }

  handleContentChanged(event: Event) {
    const textareaEl = event.target as HTMLTextAreaElement;
    const { value } = textareaEl;
    this.content.set(value);
    if (!value) this.shouldShowOnboarding.set(true);
  }

  handleSaveNote() {
    if (!this.content()) return;
    this.dialogRef.close(this.content());
  }

  handleStartRecording() {
    this.shouldShowOnboarding.set(false);
    this.isRecording.set(true);

    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporte a API de gravação!');
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.speechRecognition = new SpeechRecognitionAPI();
    this.speechRecognition.lang = 'pt-BR';
    this.speechRecognition.continuous = true;
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.interimResults = true;
    fromEvent(this.speechRecognition, 'result').subscribe((event: Event) => {
      const { results } = <SpeechRecognitionEvent>event;
      const transcription = Array.from(results).reduce(
        (text, result) => text.concat(result[0].transcript),
        ''
      );
      this.content.set(transcription);
    });
    fromEvent(this.speechRecognition, 'error').subscribe(console.error);
    this.speechRecognition.start();
  }

  handleStopRecording() {
    this.isRecording.set(false);

    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}
