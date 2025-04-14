import { NoteInfo } from '@shared/models'
import { notesMock } from '@/store/mocks'
import { atom } from 'jotai'

export const notesAtom = atom<NoteInfo[]>(notesMock)
export const selectedNoteIndexAtom = atom<number | null>(null)

// This atom represents the currently selected note
export const selectedNoteAtom = atom((get) => {
  // Get the current state of notes and selected note index
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)
  
  // If no note is selected, return null
  if (selectedNoteIndex === null) return null

  // Get the selected note from the notes array
  const selectedNote = notes[selectedNoteIndex]

  // Return the selected note with a placeholder content
  return {
    ...selectedNote,
    content: `Hello from Note ${selectedNoteIndex}`
  }
})