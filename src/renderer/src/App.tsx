import { Content, RootLayout, Sidebar, DraggableTopBar } from '@/components'
import { ActionButtonsRow, NotePreviewList } from '@/components'
import { MarkdownEditor } from '@/components/Button/MarkdownEditor'
import { FloatingNoteTitle } from '@/components/Button'

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2">
          <ActionButtonsRow className="flex justify-between mt-1"/>
          <NotePreviewList className="mt-3 space-y-1"/>
        </Sidebar>
        <Content className="border-l bg-zinc-900/50 border-l-white/20">
          <FloatingNoteTitle className='pt-2'/>
          <MarkdownEditor />
        </Content>
    </RootLayout>
    </>
  )
}

export default App
