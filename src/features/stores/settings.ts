import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModelProvider {
  useVoicevox: boolean
  voicevoxSpeaker: string
  voicevoxSpeed: number
  voicevoxPitch: number
  voicevoxIntonation: number
}

interface Character {
  characterName: string
  guestName: string
}

export type SettingsState = ModelProvider & Character

const settingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      useVoicevox: false,
      voicevoxSpeaker: '3',
      voicevoxSpeed: 1.0,
      voicevoxPitch: 0.0,
      voicevoxIntonation: 1.0,
      characterName: 'ずんだもん',
      guestName: 'ゲスト',
    }),
    {
      name: 'chatvrm-settings',
      partialize: (state) => ({
        useVoicevox: state.useVoicevox,
        voicevoxSpeaker: state.voicevoxSpeaker,
        voicevoxSpeed: state.voicevoxSpeed,
        voicevoxPitch: state.voicevoxPitch,
        voicevoxIntonation: state.voicevoxIntonation,
        characterName: state.characterName,
        guestName: state.guestName,
      }),
    }
  )
)
export default settingsStore
