import React, { useEffect, useState } from 'react';
import { CallBackProps, STATUS, Step } from "react-joyride";
import { IconButton } from './iconButton';

import homeStore from '@/features/stores/home';
import dynamic from 'next/dynamic'; // hydration errorが出たので追加 https://stackoverflow.com/questions/57685340/how-to-get-react-joyride-to-work-in-a-next-js-app

const JoyRideNoSSR = dynamic(
  () => import('react-joyride'),
  { ssr: false }
)

interface SlideControlsProps {
  currentSlide: number
  slideCount: number
  isPlaying: boolean
  isGuestTurn: boolean
  prevSlide: () => void
  nextSlide: () => void
  toggleIsPlaying: () => void
}

const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  slideCount,
  isPlaying,
  isGuestTurn,
  prevSlide,
  nextSlide,
  toggleIsPlaying,
}) => {
  const [ run, setRunState ] = useState(false)
  const [ steps ] = useState<Step[]>([
    {
      target: 'body',
      content: <h2>まずPCのvoicevoxを起動してください。<br/>(なければ <u><a href="https://voicevox.hiroshiba.jp/">ここからdownload</a></u> してね！)</h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
      },
      disableBeacon: true, // これを設定するとビーコンが出ずにすぐにモーダルが出ます
      disableOverlayClose: true,
      placement: 'center',
      spotlightClicks: true,
    },
    {
      target: 'body',
      content: <h2>voicevoxを起動し、<u><a href="http://127.0.0.1:50021/setting">CORSの設定画面</a></u>を開いて https://zund-arm-on.com を許可してください。<br/><img src="/images/voidcevox_cors.png"/></h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
        back: '戻る',
        last: '終了',
      },
      placement: 'center',
    },
    {
      target: '.slide-control-play',
      content: <h2>voicevoxを再起動したら放送を開始してみましょう！</h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
        back: '戻る',
        last: '終了',
      },
      placement: 'right',
    }
  ])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      homeStore.setState({ welcomeTourDone: true })
      setRunState(false);
    }
  };

  useEffect(() => {
    if (!homeStore.getState().welcomeTourDone) {
      setRunState(true)
    }
  }, [])

  return (
    <>
      <JoyRideNoSSR
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run && !homeStore.getState().welcomeTourDone}
        scrollToFirstStep
        showProgress // 1/2などの数が表示される
        showSkipButton
        steps={steps}
        spotlightClicks
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      <div>
        <IconButton
          iconName="24/Prev"
          disabled={currentSlide === 0 || isPlaying}
          onClick={prevSlide}
          isProcessing={false}
          className="bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white rounded-16 py-8 px-16 text-center mx-16"
        />
        <IconButton
          iconName={isPlaying ? '24/PauseAlt' : '24/Play'}
          onClick={toggleIsPlaying}
          isProcessing={false}
          className="slide-control-play bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white rounded-16 py-8 px-16 text-center mx-16"
        />
        <IconButton
          iconName="24/Next"
          disabled={currentSlide === slideCount - 1 || (!isGuestTurn && isPlaying)}
          onClick={nextSlide}
          isProcessing={false}
          className="slide-control-next bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white rounded-16 py-8 px-16 text-center mx-16"
        />
      </div>
    </div>
    </>
  )
}

export default SlideControls
