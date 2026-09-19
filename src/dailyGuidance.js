/* =====================================
   ✦ 今日指引文字（純本地產生，不使用任何 API）
   依抽到的牌、正逆位，從 tarotCards.js 既有資料組合：
   - 今日訊息：花色／大牌氛圍開場 + 主題牌義 + 次要牌義
   - 今天可以做：關鍵字行動 + 是非提醒 + 時間提醒
   正位取 card.love / career…；逆位取 card.reversedMeaning.*
===================================== */

const FOCUS_BY_GROUP = {
  '聖杯': ['love', 'relationship'],
  '權杖': ['career', 'relationship'],
  '寶劍': ['relationship', 'career'],
  '錢幣': ['money', 'career'],
}

const MAJOR_FOCUS = [
  ['love', 'relationship'],
  ['career', 'money'],
  ['relationship', 'love'],
  ['money', 'career'],
]

const DOMAIN_LABEL = {
  love: '感情',
  career: '工作',
  money: '金錢',
  relationship: '人際',
}

// 開場：[群組][正/逆] 各 3 種，用牌 id 挑一種
const INTROS = {
  '大阿爾克那': {
    upright: [
      (a, b) => `這是一張帶著大方向的牌，今天的主題落在「${a}」與「${b}」上，值得你多留意。`,
      (a, b) => `大牌出現，代表今天的重點不是小事，而是「${a}」帶來的課題，「${b}」也在旁邊輕輕提醒。`,
      (a) => `今天有一股比較大的能量在推動你，圍繞著「${a}」，先感受它，再決定怎麼回應。`,
    ],
    reversed: [
      (a, b) => `大牌以逆位出現，今天可能會在「${a}」與「${b}」上感到卡卡的，這是在提醒你回頭看看內在。`,
      (a) => `原本該順順流動的能量，今天在「${a}」上有些阻力，先別硬推。`,
      (a, b) => `今天的課題有點像功課：「${a}」、「${b}」都在請你停下來，看見自己真正的狀態。`,
    ],
  },
  '權杖': {
    upright: [
      (a) => `今天的火花很足，「${a}」是你的推進力，適合把想做的事踏出一步。`,
      (a, b) => `行動的能量在你身上，「${a}」與「${b}」會讓你比平常更有幹勁。`,
      (a) => `今天適合主動一點，讓「${a}」帶你往前，不必等到萬事俱備。`,
    ],
    reversed: [
      (a) => `今天的熱情可能有點耗損，「${a}」讓你覺得使不上力，這時候不用逼自己。`,
      (a, b) => `行動力今天卡了一下，「${a}」與「${b}」容易讓步調亂掉，先把節奏找回來。`,
      (a) => `火苗被壓住了，今天在「${a}」上要小心方向偏掉，放慢反而更穩。`,
    ],
  },
  '聖杯': {
    upright: [
      (a) => `今天的情緒與感受是主角，「${a}」的氛圍會自然流向你，好好接住它。`,
      (a, b) => `心裡的感覺今天比較清楚，「${a}」與「${b}」讓你更容易和人靠近。`,
      (a) => `今天適合順著心走，「${a}」是內心給你的溫柔訊號。`,
    ],
    reversed: [
      (a) => `今天內心可能有些波動，「${a}」的感覺比平常更明顯，先別急著把它壓下去。`,
      (a, b) => `情緒的水面今天有點混濁，「${a}」與「${b}」讓感受變得不太平衡。`,
      (a) => `今天心裡的落差比較容易被放大，「${a}」需要你先照顧好自己再說。`,
    ],
  },
  '寶劍': {
    upright: [
      (a) => `今天頭腦特別清醒，「${a}」讓你能把事情看得比平常透徹。`,
      (a, b) => `思緒與判斷是今天的關鍵，「${a}」與「${b}」是今天你需要正視的主題，看清它比逃開它更有幫助。`,
      (a) => `今天適合面對真話與事實，「${a}」是今天需要面對的重點。`,
    ],
    reversed: [
      (a) => `今天腦袋容易轉個不停，「${a}」讓你反覆想同一件事，別被想像帶著跑。`,
      (a, b) => `想法今天有點打結，「${a}」與「${b}」容易讓你把事情想得比實際更沉重。`,
      (a) => `今天說話與判斷都要放慢，「${a}」提醒你別在心亂的時候下結論。`,
    ],
  },
  '錢幣': {
    upright: [
      (a) => `今天的重點很踏實，「${a}」是一步一步累積出來的，別小看眼前的小進展。`,
      (a, b) => `現實層面今天比較穩，「${a}」與「${b}」讓你有種可以安心的基礎。`,
      (a) => `今天適合把心力放在具體、看得到成果的事上，「${a}」會慢慢回饋你。`,
    ],
    reversed: [
      (a) => `今天現實面可能有些不踏實，「${a}」提醒你重新檢視自己手上的資源。`,
      (a, b) => `安全感今天有點動搖，「${a}」與「${b}」讓你容易在得失之間拉扯。`,
      (a) => `今天在「${a}」上要多一分謹慎，不要急著下決定，先把基礎穩住。`,
    ],
  },
}

// 行動：[群組][正/逆] 各 3 種
const ACTIONS = {
  '大阿爾克那': {
    upright: [
      (a) => `花幾分鐘寫下今天「${a}」讓你想到的一件事，之後再決定要不要行動。`,
      (a) => `把「${a}」放在心上，今天遇到相關的人事物時，多停留一下再回應。`,
      (a) => `今天做一件跟「${a}」有關的小事，不用做大，讓它成為一個起點。`,
    ],
    reversed: [
      (a) => `今天遇到「${a}」的狀況時，先深呼吸，把反應延後一步。`,
      (a) => `找出今天哪件事讓你覺得「${a}」，寫下來，看看是外在原因還是自己的想法。`,
      (a) => `不必急著解決「${a}」，先問自己：我現在真正需要的是什麼？`,
    ],
  },
  '權杖': {
    upright: [
      (a) => `挑一件拖很久的事，用「${a}」的能量開個頭，做十分鐘就好。`,
      (a) => `今天主動提出一個想法或邀約，把「${a}」變成看得到的行動。`,
      (a) => `列出今天最想推進的一件事，先做最簡單的一步。`,
    ],
    reversed: [
      (a) => `今天先別開新戰線，只挑一件事收尾，順著「${a}」的提醒調整節奏。`,
      (a) => `覺得沒力氣時就允許自己休息，不要為了證明什麼硬撐。`,
      (a) => `重新確認目標：如果「${a}」讓你迷失方向，先回到最初想做這件事的原因。`,
    ],
  },
  '聖杯': {
    upright: [
      (a) => `花一點時間感受「${a}」，把它說給信任的人聽，或寫成一段話。`,
      (a) => `今天對身邊的人多一句溫柔的話，讓「${a}」有出口。`,
      (a) => `做一件讓自己心裡舒服的小事：喝杯熱飲、散步，或整理心情。`,
    ],
    reversed: [
      (a) => `如果在意一段關係，先把自己的感受整理清楚，再決定要不要溝通。`,
      (a) => `不要只根據對方一個反應就推測全部想法，「${a}」會讓你容易多想。`,
      (a) => `今天適合重新確認彼此真正的期待，把話說清楚，而不是猜測。`,
    ],
  },
  '寶劍': {
    upright: [
      (a) => `把讓你猶豫的事寫成三個重點，用「${a}」的清醒把它看清楚。`,
      (a) => `今天有話想說時，直接、誠實，但用溫和的語氣。`,
      (a) => `檢視一個你一直沒弄清楚的資訊，今天適合把它問明白。`,
    ],
    reversed: [
      (a) => `覺得腦袋很吵時，先把想法寫在紙上，不要一直在心裡打轉。`,
      (a) => `今天不要在情緒上來時回覆重要訊息，隔一小時再說。`,
      (a) => `分清楚「事實」和「我的想像」，其中一個是「${a}」的來源。`,
    ],
  },
  '錢幣': {
    upright: [
      (a) => `挑一件實際的小事完成：整理、記帳或規劃，讓「${a}」有具體落點。`,
      (a) => `今天穩穩做好手上的工作，不急著求快，累積比爆發更重要。`,
      (a) => `照顧好身體與作息，這是最實際的資本。`,
    ],
    reversed: [
      (a) => `今天避免衝動消費或倉促決定，先想一晚再說。`,
      (a) => `重新盤點一次手上的資源，看看「${a}」是不是來自於不必要的擔心。`,
      (a) => `把一項模糊的開銷或計畫寫清楚，不要讓不確定感繼續放大。`,
    ],
  },
}

const firstSentence = (text) => {
  if (!text) return ''
  const idx = text.indexOf('。')
  return idx === -1 ? text : text.slice(0, idx + 1)
}

const stripEnd = (text) => (text || '').replace(/[。！!]+$/, '')

const ensureEnd = (text) => {
  const t = (text || '').trim()
  if (!t) return ''
  return /[。！？!?]$/.test(t) ? t : `${t}。`
}

export function getDailyGuidance(card, orientation) {

  const isReversed = orientation === '逆位'
  const mode = isReversed ? 'reversed' : 'upright'
  const group = INTROS[card.group] ? card.group : '大阿爾克那'

  const keywords = (isReversed ? card.reversed : card.upright) || []
  const k1 = keywords[0] || card.name
  const k2 = keywords[1] || k1

  const [focusA, focusB] =
    FOCUS_BY_GROUP[group] || MAJOR_FOCUS[card.id % MAJOR_FOCUS.length]

  const read = (field) =>
    isReversed
      ? (card.reversedMeaning && card.reversedMeaning[field]) || ''
      : card[field] || ''

  const pick = (list) => list[card.id % list.length]

  // 今日訊息
  const intro = pick(INTROS[group][mode])(k1, k2)
  const mainText = ensureEnd(read(focusA))
  const subText = firstSentence(ensureEnd(read(focusB)))

  const message = [
    intro,
    mainText,
    subText && subText !== mainText ? subText : '',
  ].filter(Boolean).join('')

  // 今天可以做
  const actions = []

  actions.push(pick(ACTIONS[group][mode])(k1, k2))

  const yesNo = stripEnd(read('yesNo'))
  if (yesNo) {
    actions.push(`今天若有需要決定的事：${yesNo}。`)
  }

  const timing = stripEnd(read('timing'))
  if (timing && timing.length <= 30) {
    actions.push(`時間感提醒：${timing}。`)
  }

  // 感情／工作／人際：直接取該牌（正位或逆位）已有的牌義
  const domains = [
    ['感情', 'love'],
    ['工作', 'career'],
    ['人際', 'relationship'],
  ]
    .map(([label, field]) => ({
      label,
      text: firstSentence(ensureEnd(read(field))),
    }))
    .filter((item) => item.text)

  return {
    keywords,
    message,
    domains,
    actions: actions.slice(0, 3),
    focusLabel: DOMAIN_LABEL[focusA],
  }
}
