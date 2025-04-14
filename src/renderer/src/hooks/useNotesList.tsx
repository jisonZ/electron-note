import { useAtomValue, useAtom } from "jotai"
import { notesAtom, selectedNoteIndexAtom } from "@/store"

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  // useAtomValue is a hook that returns the value of an atom
  const notes = useAtomValue(notesAtom)

  const [selectedNoteIndex, setSelectedNoteIndex] = useAtom(selectedNoteIndexAtom)

  const handleNoteSelect = (index: number) => async() => {
    console.log('handleNoteSelect', index)
    setSelectedNoteIndex(index)

    if (onSelect) {
      console.log('onSelect')
      onSelect()
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect,
  }
}