import { MDXEditorMethods } from "@mdxeditor/editor"
import { selectedNoteAtom, saveNoteAtom } from "@renderer/store"
import { NoteContent } from "@shared/models"
import { useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash'
import { autoSaveInterval } from "@shared/constants"
import { useRef } from "react"

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)
  
  const handleAutoSaving = throttle(async (content: NoteContent) => {
    if (!selectedNote) return

    console.info('Auto Saving...', selectedNote.title)
    await saveNote(content)
  }, 
  autoSaveInterval, 
  {
    leading: false,
    trailing: true
  })

  const handleBlur = async () => {
    if (!selectedNote) return

    handleAutoSaving.cancel()
    const content = editorRef.current?.getMarkdown()

    if (content != null) {
      await saveNote(content)
    }
  }
  return {
    selectedNote,
    editorRef,
    handleAutoSaving,
    handleBlur
  }
}
