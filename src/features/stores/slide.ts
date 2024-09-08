import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SlideState {
  isPlaying: boolean
  currentSlide: number
  selectedSlideDocs: string
  scripts: object
}

const slideStore = create<SlideState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentSlide: 0,
      selectedSlideDocs: '20240903',
      scripts: {},
    }),
    {
      name: 'chatvrm-slide',
      partialize: (state) => ({ selectedSlideDocs: state.selectedSlideDocs }),
    }
  )
)

export default slideStore
