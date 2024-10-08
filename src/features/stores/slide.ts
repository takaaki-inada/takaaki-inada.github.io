import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SlideState {
  isPlaying: boolean
  isStopping: boolean
  isGuestTurn: boolean
  currentSlide: number
  currentContext: string
  selectedSlideDocs: string
  scripts: object
}

const slideStore = create<SlideState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      isStopping: false,
      isGuestTurn: false,
      currentSlide: 0,
      currentContext: '',
      selectedSlideDocs: '',
      scripts: {},
    }),
    {
      name: 'chatvrm-slide',
      partialize: (state) => ({ selectedSlideDocs: state.selectedSlideDocs }),
    }
  )
)

export default slideStore
