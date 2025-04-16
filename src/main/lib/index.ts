import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { homedir } from 'os'
import { readdir, stat, readFile } from 'fs/promises'
import { ensureDir, writeFile } from 'fs-extra'
import { WriteNote } from '@shared/type'

// export const getRootDir = () => {
//   return `${__dirname}/${appDirectoryName}`
// }

export const getRootDir = () => {
  return `/Users/haochenzhang/superliminal/note-mark`
}
export const getNotesDir = () => {
  return `${getRootDir()}/${appDirectoryName}`
}

export const getNotes = async () => {
  console.log('getNotes')
  const notesDir = getNotesDir()
  console.log('notesDir', notesDir)
  await ensureDir(notesDir)

  const notesFileNames = await readdir(notesDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getNotesDir()}/${fileName}`)

  return {
    title: fileName.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote = async (fileName: string) => {
  const noteDir = getNotesDir()

  return readFile(`${noteDir}/${fileName}.md`, {encoding: fileEncoding})
}

export const writeNote: WriteNote = async (fileName, content) => {
  const noteDir = getNotesDir()
  
  console.log('writeNote', fileName, content)
  await writeFile(`${noteDir}/${fileName}.md`, content, {encoding: fileEncoding})
}