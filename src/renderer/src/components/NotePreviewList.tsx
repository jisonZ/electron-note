import { notesMock } from '@/store/mocks'
import { ComponentProps } from 'react'
import { NotePreview } from './NotePreview'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from '@/hooks/useNotesList'

export const NotePreviewList = ({className, ...props}: ComponentProps<'ul'>) => {
  console.log('Constructing NotePreviewList')
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({})
  if (notesMock.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No notes found</span>
      </ul>
    )
  }
  return (
    <ul className={className}{...props}>
      {notesMock.map((note, index) => (
        <NotePreview 
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note} 
        />
      ))}
    </ul>
  )
}