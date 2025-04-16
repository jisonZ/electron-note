import { NoteInfo } from '@shared/models'
import { notesMock } from '@/store/mocks'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // sort them by most recently edited
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

// unwrap the promise and return the notes
export const notesAtom = unwrap(notesAtomAsync, (notes) => notes)

export const selectedNoteIndexAtom = atom<number | null>(null)

// This atom represents the currently selected note
export const selectedNoteAtom = atom((get) => {
  // Get the current state of notes and selected note index
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)
  
  // If no note is selected, return null
  if (selectedNoteIndex === null || !notes) return null

  // Get the selected note from the notes array
  const selectedNote = notes[selectedNoteIndex]

  // Return the selected note with a placeholder content
  return {
    ...selectedNote,
    content: `Hello from Note ${selectedNoteIndex}`
  }
})

export const createEmptyNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = `Note ${notes.length + 1}`

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  const updatedNotes = [newNote, ...notes.filter((note) => note.title != newNote.title)]
  set(notesAtom, updatedNotes)
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  set(
    notesAtom,
    notes.filter((note) => note.title != selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})