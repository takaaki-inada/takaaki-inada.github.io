import { processReceivedMessage } from '@/features/chat/handlers'
import { Message } from '@/features/messages/messages'
import settingsStore from '@/features/stores/settings'
import React, { useCallback, useEffect, useState } from 'react'
import homeStore from '../features/stores/home'
import slideStore from '../features/stores/slide'
import SlideContent from './slideContent'
import SlideControls from './slideControls'

import dynamic from 'next/dynamic'; // hydration errorが出たので追加 https://stackoverflow.com/questions/57685340/how-to-get-react-joyride-to-work-in-a-next-js-app
import { CallBackProps, STATUS, Step } from "react-joyride"

const JoyRideNoSSR = dynamic(
  () => import('react-joyride'),
  { ssr: false }
)

interface SlidesProps {
  markdown: string
}

export const goToSlide = (index: number) => {
  slideStore.setState({
    currentSlide: index,
  })
}

const Slides: React.FC<SlidesProps> = ({ markdown }) => {
  const [marpitContainer, setMarpitContainer] = useState<Element | null>(null)
  const isPlaying = slideStore((state) => state.isPlaying)
  const isGuestTurn = slideStore((state) => state.isGuestTurn)
  const currentSlide = slideStore((state) => state.currentSlide)
  const selectedSlideDocs = slideStore((state) => state.selectedSlideDocs)
  const chatProcessingCount = homeStore((home) => home.chatProcessingCount)
  const guestName = settingsStore((s) => s.guestName)
  const [slideCount, setSlideCount] = useState(0)
  const [scripts, setScripts] = useState<Array<{ page: number, line: string, section: string, notes: string, question_to_guest?: string, bgmpath?: string }>>([])

  // const audioContext = new AudioContext()
  // const source = audioContext.createBufferSource();
  // const gainNode = audioContext.createGain();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(
    null
  )
  const [audioGain, setAudioGain] = useState<GainNode | null>(null)

  const [ settingTourRun, setSettingTourRun ] = useState(false)
  const [ steps ] = useState<Step[]>([
    {
      target: '.menu-setting',
      content: <h2>コメンテーターとして参加してみよう！まずは、あなたの名前（ゲスト名）とOpenAIのAPIキーを設定してね。</h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
      },
      disableBeacon: true, // これを設定するとビーコンが出ずにすぐにモーダルが出ます
      disableOverlayClose: true,
      placement: 'right',
      spotlightClicks: true,
      styles: {
        options: {
          width: 800,
        },
      },
    },
    {
      target: '.message-input-text',
      content: <h2>設定が完了したらコメントしよう！</h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
        back: '戻る',
        last: '終了',
      },
      placement: 'top',
    },
    {
      target: '.slide-control-next',
      content: <h2>次の記事へ行くにはこれを押して！</h2>,
      locale: {
        skip: <strong aria-label="skip">スキップ</strong>,
        next: '次へ',
        back: '戻る',
        last: '終了',
      },
      placement: 'right',
    }
  ])

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    // const currentMarpitContainer = document.querySelector('.marpit')
    const currentMarpitContainer = document.querySelector('div[id=":$p"]')
    if (currentMarpitContainer) {
      const slides = currentMarpitContainer.querySelectorAll(':scope > svg')
      slides.forEach((slide, i) => {
        const svgElement = slide as SVGElement
        if (i === currentSlide) {
          svgElement.style.display = 'block'
        } else {
          svgElement.style.display = 'none'
        }
      })
    }
  }, [currentSlide, marpitContainer])

  useEffect(() => {
    const convertMarkdown = async () => {
      const response = await fetch(
        //`https://zund-arm-on.com/slides/${selectedSlideDocs}/index.html`,
        `/slides/${selectedSlideDocs}/index.html`,
      )
      // const css_response = await fetch(`/css/marp/theme.css`, {headers: {'Content-Type': 'text/css'}})
      const script_response = await fetch(`/slides/${selectedSlideDocs}/scripts.json`)
      setScripts(await script_response.json())

      // HTMLをパースしてmarpit要素を取得
      const parser = new DOMParser()
      const doc = parser.parseFromString(await response.text(), 'text/html')
      // const marpitElement = doc.querySelector('.marpit')
      const marpitElement = doc.querySelector('div[id=":$p"]')
      setMarpitContainer(marpitElement)

      // スライド数を設定
      if (marpitElement) {
        const slides = marpitElement.querySelectorAll(':scope > svg')
        setSlideCount(slides.length)

        // 初期状態で最初のスライドを表示
        slides.forEach((slide, i) => {
          if (i === 0) {
            slide.removeAttribute('hidden')
          } else {
            slide.setAttribute('hidden', '')
          }
        })
      }

      // CSSを動的に適用
      // const styleElement = document.createElement('style')
      // styleElement.textContent = await css_response.text()
      const styleElement = doc.querySelectorAll('style')[1]
      document.head.appendChild(styleElement)

      return () => {
        document.head.removeChild(styleElement)
      }
    }

    convertMarkdown()
  }, [selectedSlideDocs])

  useEffect(() => {
    // カスタムCSSを適用
    const customStyle = `
      div#\:\$p> svg > foreignObject > section {
        padding: 2em;
      }
    `
    const styleElement = document.createElement('style')
    styleElement.textContent = customStyle
    document.head.appendChild(styleElement)

    const context = new AudioContext()
    setAudioContext(context)

    // コンポーネントのアンマウント時にスタイルを削除
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const readSlide = useCallback(
    (slideIndex: number) => {
      const getCurrentScript = () => {
        const currentScript = scripts.find(
          (script) => script.page === slideIndex
        )
        return currentScript
      }
      const currentScript = getCurrentScript()
      if (!currentScript) {
        return ''
      }
      const q = currentScript.question_to_guest?.replace('{GUEST}', guestName) || ''
      if (q) {
        const messageLog: Message[] = [
          ...homeStore.getState().chatLog,
          { role: "assistant", content: q },
        ];
        homeStore.setState({ chatLog: messageLog })
        if (!homeStore.getState().settingTourDone) {
          setSettingTourRun(true)
        }
      }
      // console.log(currentScript.line + q)
      processReceivedMessage(currentScript.line + q)
    },
    [scripts, guestName]
  )

  const nextSlide = useCallback(() => {
    slideStore.setState((state) => {
      const newSlide = Math.min(state.currentSlide + 1, slideCount - 1)
      if (isPlaying) {
        readSlide(newSlide)
      }
      return { currentSlide: newSlide, isGuestTurn: false }
    })
  }, [isPlaying, isGuestTurn, readSlide, slideCount])

  useEffect(() => {
    // 最後のスライドに達した場合、isPlayingをfalseに設定
    if (currentSlide === slideCount - 1 && chatProcessingCount === 0) {
      slideStore.setState({ isPlaying: false })
      if (audioContext) {
        audioGain?.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 1
        )
        audioGain?.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2)
      }
      const fetchData = async () => {
        await sleep(2000)
        audioSource?.stop()
      }
      fetchData()
    }
  }, [currentSlide, slideCount, chatProcessingCount])

  const prevSlide = useCallback(() => {
    slideStore.setState((state) => ({
      currentSlide: Math.max(state.currentSlide - 1, 0),
    }))
  }, [])

  const toggleIsPlaying = () => {
    const newIsPlaying = !isPlaying
    const bgmpath = scripts[0]?.bgmpath ?? '/パステルハウス.mp3'
    if (!bgmpath) {
      slideStore.setState({
        isPlaying: newIsPlaying,
      })
      if (newIsPlaying) {
        readSlide(currentSlide)
      } else {
        const { viewer } = homeStore.getState()
        viewer.model?.stop()
      }
      return
    }

    if (newIsPlaying) {
      if (audioContext) {
        const source = audioContext.createBufferSource()
        const gainNode = audioContext.createGain()
        // fetch("https://zund-arm-on.com/audio/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%81%9A%E3%82%93%E3%81%A0%E3%82%82%E3%82%93%E6%8A%80%E8%A1%93%E5%AE%A4AI%E6%94%BE%E9%80%81%E5%B1%80_podcast_20240816.mp3")
        console.log(bgmpath)
        fetch(bgmpath)
          .then((response) => response.arrayBuffer())
          .then((data) => audioContext.decodeAudioData(data))
          .then((buffer) => {
            source.buffer = buffer
            const max = Math.floor(buffer.duration)
            gainNode.gain.setValueAtTime(0.8, audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(
              0.2,
              audioContext.currentTime + 2
            )
            source.connect(gainNode)
            source.loop = true
            source.loopStart = max
            source.loopEnd = max
            gainNode.connect(audioContext?.destination)
            source.start()
            setAudioContext(audioContext)
            setAudioSource(source)
            setAudioGain(gainNode)
          })
      }
      const startDelay = async () => {
        await sleep(3000)
        slideStore.setState({
          isPlaying: newIsPlaying,
        })
        // FIXME: sleepをここにすると最初の発話が逆になる
        readSlide(currentSlide)
      }
      startDelay()
    } else {
      if (audioContext) {
        audioGain?.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 1
        )
        audioGain?.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2)
      }
      const stopDelay = async () => {
        await sleep(2000)
        audioSource?.stop()
        slideStore.setState({
          isPlaying: newIsPlaying,
        })
        const { viewer } = homeStore.getState()
        viewer.model?.stop()
      }
      stopDelay()
    }
  }

  useEffect(() => {
    if (
      chatProcessingCount === 0 &&
      isPlaying &&
      currentSlide < slideCount - 1
    ) {
      const getCurrentScript = () => {
        const currentScript = scripts.find(
          (script) => script.page === currentSlide
        )
        return currentScript
      }
      const currentScript = getCurrentScript()
      if (!currentScript) {
        return
      }
      const isGuestTurn = currentScript.section.startsWith("comment")
      slideStore.setState({ isGuestTurn: isGuestTurn })
      slideStore.setState({ currentContext: currentScript.notes })
      if (!isGuestTurn) {
        nextSlide()
      }
    }
  }, [chatProcessingCount, isPlaying, isGuestTurn, nextSlide, currentSlide, slideCount, scripts])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      homeStore.setState({settingTourDone: true })
      setSettingTourRun(false);
    }
  };

  return (
    <>
      <JoyRideNoSSR
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={settingTourRun && !homeStore.getState().settingTourDone}
        scrollToFirstStep
        showProgress // 1/2などの数が表示される
        showSkipButton
        steps={steps}
        spotlightClicks
        styles={{
          options: {
            zIndex: 30,
          },
        }}
      />

      <div
        className="absolute"
        style={{
          width: '80vw',
          height: 'calc(80vw * (9 / 16))',
          top: 'calc((100vh - 80vw * (9 / 16)) / 2)',
          right: 0,
          left: 0,
          margin: 'auto',
        }}
      >
        <SlideContent marpitContainer={marpitContainer} />
      </div>
      <div
        className="absolute"
        style={{
          width: '80vw',
          top: 'calc((100vh + 80vw * (7 / 16)) / 2)',
          right: 0,
          left: 0,
          margin: 'auto',
          zIndex: 10,
        }}
      >
        <SlideControls
          currentSlide={currentSlide}
          slideCount={slideCount}
          isPlaying={isPlaying}
          isGuestTurn={isGuestTurn}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
          toggleIsPlaying={toggleIsPlaying}
        />
      </div>
    </>
  )
}
export default Slides
