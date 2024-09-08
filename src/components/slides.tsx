import { processReceivedMessage } from '@/features/chat/handlers'
import React, { useCallback, useEffect, useState } from 'react'
import homeStore from '../features/stores/home'
import slideStore from '../features/stores/slide'
import SlideContent from './slideContent'
import SlideControls from './slideControls'

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
  const currentSlide = slideStore((state) => state.currentSlide)
  const selectedSlideDocs = slideStore((state) => state.selectedSlideDocs)
  const chatProcessingCount = homeStore((s) => s.chatProcessingCount)
  const [slideCount, setSlideCount] = useState(0)
  const [scripts, setScripts] = useState<Array<{ page: number, line: string }>>([])

  // const audioContext = new AudioContext()
  // const source = audioContext.createBufferSource();
  // const gainNode = audioContext.createGain();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(
    null
  )
  const [audioGain, setAudioGain] = useState<GainNode | null>(null)

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    const currentMarpitContainer = document.querySelector('.marpit')
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
      // const response = await fetch('/api/convertMarkdown', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ slideName: selectedSlideDocs }),
      // })
      // const response = await fetch(`/api/slides/${selectedSlideDocs}`, {
      const response = await fetch(
        // `https://zund-arm-on.com/slides/${selectedSlideDocs}/${selectedSlideDocs}.json`,
        `/slides/${selectedSlideDocs}/${selectedSlideDocs}.json`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      // const script_response = await fetch(`https://zund-arm-on.com/slides/${selectedSlideDocs}/scripts.json`)
      const script_response = await fetch(`/slides/${selectedSlideDocs}/scripts.json`)
      setScripts(await script_response.json())

      // HTMLをパースしてmarpit要素を取得
      const parser = new DOMParser()
      const doc = parser.parseFromString(data.html, 'text/html')
      const marpitElement = doc.querySelector('.marpit')
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
      const styleElement = document.createElement('style')
      styleElement.textContent = data.css
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
      div.marpit > svg > foreignObject > section {
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
      const getCurrentLines = () => {
        // const scripts = require(
        //   `../../public/slides/${selectedSlideDocs}/scripts.json`
        // )
        // `https://zund-arm-on.com/slides/${selectedSlideDocs}/scripts.json` からjsonを読み込む
        const currentScript = scripts.find(
          (script) => script.page === slideIndex
        )
        return currentScript ? currentScript.line : ''
      }

      const currentLines = getCurrentLines()
      console.log(currentLines)
      processReceivedMessage(currentLines)
    },
    [selectedSlideDocs, scripts]
  )

  const nextSlide = useCallback(() => {
    slideStore.setState((state) => {
      const newSlide = Math.min(state.currentSlide + 1, slideCount - 1)
      if (isPlaying) {
        readSlide(newSlide)
      }
      return { currentSlide: newSlide }
    })
  }, [isPlaying, readSlide, slideCount])

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
    // slideStore.setState({
    //   isPlaying: newIsPlaying,
    // })
    // if (newIsPlaying) {
    //   readSlide(currentSlide)
    // }

    if (newIsPlaying) {
      if (audioContext) {
        const source = audioContext.createBufferSource()
        const gainNode = audioContext.createGain()
        // fetch("https://zund-arm-on.com/audio/%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%81%9A%E3%82%93%E3%81%A0%E3%82%82%E3%82%93%E6%8A%80%E8%A1%93%E5%AE%A4AI%E6%94%BE%E9%80%81%E5%B1%80_podcast_20240816.mp3")
        fetch('/パステルハウス.mp3')
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
      const fetchData = async () => {
        await sleep(3000)
        slideStore.setState({
          isPlaying: newIsPlaying,
        })
        readSlide(currentSlide)
      }
      fetchData()
    } else {
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
        slideStore.setState({
          isPlaying: newIsPlaying,
        })
      }
      fetchData()
    }
  }

  useEffect(() => {
    if (
      chatProcessingCount === 0 &&
      isPlaying &&
      currentSlide < slideCount - 1
    ) {
      nextSlide()
    }
  }, [chatProcessingCount, isPlaying, nextSlide, currentSlide, slideCount])

  return (
    <>
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
          prevSlide={prevSlide}
          nextSlide={nextSlide}
          toggleIsPlaying={toggleIsPlaying}
        />
      </div>
    </>
  )
}
export default Slides
