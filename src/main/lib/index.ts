import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { homedir } from 'os'
import { readdir, stat } from 'fs/promises'
import { ensureDir } from 'fs-extra'

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