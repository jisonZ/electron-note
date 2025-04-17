import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { homedir } from 'os'
import { readdir, stat, readFile } from 'fs/promises'
import { ensureDir, writeFile, remove } from 'fs-extra'
import { CreateNote, DeleteNote, WriteNote, GetNotes } from '@shared/type'
import { dialog } from 'electron'
import path from 'path'
import { isEmpty } from 'lodash'
import welcomeNote from '../../../resources/welcomeNote.md?asset'

// export const getRootDir = () => {
//   return `${__dirname}/${appDirectoryName}`
// }

export const getRootDir = () => {
  return `/Users/haochenzhang/superliminal/note-mark`
}
export const getNotesDir = () => {
  return `${getRootDir()}/${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
  const notesDir = getNotesDir()

  await ensureDir(notesDir)

  const notesFileNames = await readdir(notesDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('No notes found, creating welcome note')
    const content = await readFile(welcomeNote, {encoding: fileEncoding})
    await writeFile(`${notesDir}/Welcome.md`, content, {encoding: fileEncoding})
    notes.push('Welcome.md')
  }

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

export const createNote: CreateNote = async () => {
  const noteDir = getNotesDir()

  await ensureDir(noteDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New Note',
    defaultPath: `${noteDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Note Creation Canceled')
    return false
  }

  const { name: filename, dir: parentDir} = path.parse(filePath)

  if (parentDir !== noteDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${noteDir}.
      Avoid using other dictionaries!`
    })
    return false
  }

  console.info(`Creating note: ${filePath}`)
  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const noteDir = getNotesDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Cancel', 'Delete'],
    defaultId: 0, //  Specifies which button is selected by default (0 = 'Cancel')
    cancelId: 0 // Specifies which button is triggered when the user presses Escape (0 = 'Cancel')
  })

  if (response === 0) {
    console.info('Note deletion canceled')
    return false
  }

  console.info(`Deleting note: ${filename}`)
  await remove(`${noteDir}/${filename}.md`)

  return true
}