import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  notes?: Note[] = [];
  constructor() {
    this.loadState();
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'notes') this.loadState();
    });

    // fromEvent(window, 'storage').subscribe((event: StorageEvent) => {
    //   if (event.key === 'notes') this.loadState();
    // } );
  }

  getNotes() {
    return this.notes;
  }

  getNote(id: string) {
    return this.notes?.find((n) => n.id === id);
  }

  addNote(note: Note) {
    this.notes?.push(note);
    this.saveState();
  }

  updateNote(id: string, updatedFields: Partial<Note>) {
    const note = this.getNote(id);
    Object.assign(note, updatedFields);
    this.saveState();
  }

  deleteNote(id: string) {
    const noteIndex = this.notes?.findIndex((n) => n.id === id);
    if (noteIndex === -1) return;
    this.notes?.splice(noteIndex!, 1);
    this.saveState();
  }

  saveState() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  loadState() {
    try {
      const notesInStorage = JSON.parse(localStorage.getItem('notes')!);
      // if (!notesInStorage) return;
      // clear the notes array while keeping the reference
      this.notes!.length = 0;
      this.notes!.push(...notesInStorage);
    } catch (e) {
      console.log('There was an error retrieving the notes from localStorage');
      console.log(e);
    }
  }

  // ngOnDestroy() {}
}
