import { Message, textsToScreenplay } from '@/features/messages/messages'
import { speakCharacter } from '@/features/messages/speakCharacter'
import { speakCharacterWav } from '@/features/messages/speakCharacterWav'
import homeStore from '@/features/stores/home'
import settingsStore from '../stores/settings'

/**
 * 文字列を処理する関数
 * @param receivedMessage 処理する文字列
 * @param sentences 返答を一文単位で格納する配列
 * @param aiTextLog AIの返答ログ
 * @param tag タグ
 * @param isCodeBlock コードブロックのフラグ
 * @param codeBlockText コードブロックのテキスト
 */
export const processReceivedMessage = async (
  receivedMessage: string,
  audiourl: string | null = null,
  sentences: string[] = [],
  aiTextLog: Message[] = [],
  tag: string = '',
  isCodeBlock: boolean = false,
  codeBlockText: string = ''
) => {
  // const ss = settingsStore.getState()
  const hs = homeStore.getState()
  const currentSlideMessages: string[] = []
  const useVoicevox = settingsStore.getState().useVoicevox

  // 返答内容のタグ部分と返答部分を分離
  const tagMatch = receivedMessage.match(/^\[(.*?)\]/)
  if (tagMatch && tagMatch[0]) {
    tag = tagMatch[0]
    receivedMessage = receivedMessage.slice(tag.length)
  }

  let currentAssistantMessage: string = ''
  let sentence: string = ''

  const onSpeechStart = () => {
    homeStore.setState({
      assistantMessage: currentAssistantMessage,
    })
    hs.incrementChatProcessingCount()
    // スライド用のメッセージを更新
    currentSlideMessages.push(sentence)
    homeStore.setState({
      slideMessages: currentSlideMessages,
    })
  }

  const onSpeechEnd = () => {
    hs.decrementChatProcessingCount()
    currentSlideMessages.shift()
    homeStore.setState({
      slideMessages: currentSlideMessages,
    })
  }

  if (!useVoicevox && audiourl) {
    sentence = receivedMessage
    speakCharacterWav(audiourl, onSpeechStart, onSpeechEnd)
    return
  }

  // 返答を一文単位で切り出して処理する
  while (receivedMessage.length > 0) {
    const sentenceMatch = receivedMessage.match(
      /^(.+?[。．.!?！？\n]|.{20,}[、,])/
    )
    if (sentenceMatch?.[0]) {
      sentence = sentenceMatch[0]
      // 区切った文字をsentencesに追加
      sentences.push(sentence)
      // 区切った文字の残りでreceivedMessageを更新
      receivedMessage = receivedMessage.slice(sentence.length).trimStart()

      // 発話不要/不可能な文字列だった場合はスキップ
      if (
        !sentence.includes('```') &&
        !sentence.replace(
          /^[\s\u3000\t\n\r\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]'"''""・、。,.!?！？:：;；\-_=+~～*＊@＠#＃$＄%％^＾&＆|｜\\＼/／`｀]+$/gu,
          ''
        )
      ) {
        continue
      }

      // タグと返答を結合（音声再生で使用される）
      let aiText = `${tag} ${sentence}`
      // console.log('aiText', aiText)

      if (isCodeBlock && !sentence.includes('```')) {
        codeBlockText += sentence
        continue
      }

      if (sentence.includes('```')) {
        if (isCodeBlock) {
          // コードブロックの終了処理
          const [codeEnd, ...restOfSentence] = sentence.split('```')
          aiTextLog.push({
            role: 'code',
            content: codeBlockText + codeEnd,
          })
          aiText += `${tag} ${restOfSentence.join('```') || ''}`

          // AssistantMessage欄の更新
          homeStore.setState({ assistantMessage: sentences.join(' ') })

          codeBlockText = ''
          isCodeBlock = false
        } else {
          // コードブロックの開始処理
          isCodeBlock = true
          ;[aiText, codeBlockText] = aiText.split('```')
        }

        sentence = sentence.replace(/```/g, '')
      }

      const aiTalks = textsToScreenplay([aiText])
      aiTextLog.push({ role: 'assistant', content: sentence })

      // 文ごとに音声を生成 & 再生、返答を表示
      currentAssistantMessage = sentences.join(' ')
      speakCharacter(aiTalks[0], onSpeechStart, onSpeechEnd)
    } else {
      // マッチする文がない場合、ループを抜ける
      break
    }
  }
}
