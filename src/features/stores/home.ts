import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message } from '../messages/messages'
import { Viewer } from '../vrmViewer/viewer'

export interface PersistedState {
  chatLog: Message[]
  welcomeTourDone: boolean
  settingTourDone: boolean
}

export interface TransientState {
  viewer: Viewer
  assistantMessage: string
  slideMessages: string[]
  // chatProcessing: boolean
  chatProcessingCount: number
  incrementChatProcessingCount: () => void
  decrementChatProcessingCount: () => void
}

export type HomeState = PersistedState & TransientState

const homeStore = create<HomeState>()(
  persist(
    (set, get) => ({
      // persisted states
      chatLog: [],
      welcomeTourDone: true,
      settingTourDone: false,

      // transient states
      assistantMessage: '',
      viewer: new Viewer(),
      slideMessages: [],
      // chatProcessing: false,
      chatProcessingCount: 0,
      incrementChatProcessingCount: () => {
        set(({ chatProcessingCount }) => ({
          chatProcessingCount: chatProcessingCount + 1,
        }))
      },
      decrementChatProcessingCount: () => {
        set(({ chatProcessingCount }) => ({
          chatProcessingCount: chatProcessingCount - 1,
        }))
      },
    }),
    {
      name: 'chatvrm-home',
      partialize: ({ chatLog, welcomeTourDone, settingTourDone}) => ({
        chatLog,
        welcomeTourDone,
        settingTourDone,
      }),
    }
  )
)
export default homeStore
