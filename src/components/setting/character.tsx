import settingsStore from '@/features/stores/settings'

const Character = () => {
  const guestName = settingsStore((s) => s.guestName)

  return (
    <>
      <div className="my-24">
        <div className="my-16 typography-20 font-bold">
          あなたの名前（ゲスト名）
        </div>
        <input
          className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
          type="text"
          placeholder='GuestName'
          value={guestName}
          onChange={(e) =>
            settingsStore.setState({ guestName: e.target.value })
          }
        />
      </div>
    </>
  )
}
export default Character
