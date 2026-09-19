/* =====================================
   🌙 牌陣解析：把「牌 × 牌位 × 問題 × 正逆位」組成這次占卜的說法
   純本地產生，不使用任何 API。資料來源都是 tarotCards.js 已有的欄位：
   upright／reversed 關鍵字、love／career／money／relationship／yesNo／timing、
   reversedMeaning.*。
===================================== */

const CATEGORY_FIELD = {
  love: { field: 'love', label: '感情' },
  relationship: { field: 'relationship', label: '關係' },
  career: { field: 'career', label: '工作' },
  money: { field: 'money', label: '金錢' },
  yesNo: { field: 'yesNo', label: '是非' },
  timing: { field: 'timing', label: '時間' },
}

const GLYPH = {
  '大阿爾克那': '✶',
  '權杖': '✧',
  '聖杯': '☾',
  '寶劍': '✦',
  '錢幣': '❖',
}

const firstSentence = (text) => {
  if (!text) return ''
  const idx = text.indexOf('。')
  return idx === -1 ? `${text}。` : text.slice(0, idx + 1)
}

// 牌位名稱 → 角色
const roleOf = (name) => {
  if (/隱藏/.test(name)) return 'hidden'
  if (/建議/.test(name)) return 'advice'
  if (/顧慮|阻礙/.test(name)) return 'worry'
  if (/行動/.test(name)) return 'action'
  if (/付出/.test(name)) return 'giving'
  if (/心態/.test(name)) return 'mind'
  if (/感受/.test(name)) return 'feeling'
  if (/過去/.test(name)) return 'past'
  if (/現在/.test(name)) return 'now'
  if (/未來|發展|結果/.test(name)) return 'future'
  if (name === '關係') return 'relation'
  if (/被占卜者|如何看待/.test(name)) return 'other'
  if (/占卜者/.test(name)) return 'self'
  return 'generic'
}

const subjectOf = (name) =>
  /被占卜者|如何看待|感受/.test(name) ? 'other' : 'self'

// 由「是非」欄位判斷這張牌（含正逆位）在這裡偏順、偏卡、或好壞並存
const toneOf = (yesNoText) => {
  const t = (yesNoText || '').trim()
  if (/^(否|偏向否|不)/.test(t)) return 'neg'
  if (/^(是|可以|會)/.test(t)) {
    return /但|除非|前提|需要/.test(t.slice(0, 14)) ? 'mix' : 'pos'
  }
  return 'mix'
}

const TAILS = {
  time: {
    pos: '這股能量是可以被善用的，不必急著改變什麼。',
    neg: '這裡有需要被正視的地方，先看見它，比急著處理它更重要。',
    mix: '好壞並存，要分清楚哪些是事實、哪些只是情緒。',
  },
  future: {
    pos: '只要維持目前的方向，這條路是有機會走順的。',
    neg: '若沒有調整，比較容易停在原地或重複同樣的模式。',
    mix: '結果會取決於接下來你和對方各自怎麼回應。',
  },
  person: {
    pos: '整體傾向穩定、開放的一面。',
    neg: '這部分比較緊繃，或還沒有被好好表達。',
    mix: '有真心也有猶豫，兩種狀態同時存在。',
  },
  worry: {
    pos: '這些顧慮比想像中輕，多半可以被說開。',
    neg: '這些顧慮是真實存在的，忽略只會讓它長大。',
    mix: '顧慮有一部分來自現實，一部分來自想像。',
  },
  action: {
    pos: '傾向於朝靠近或推進的方向。',
    neg: '傾向於停頓、觀望或退一步。',
    mix: '方向未定，取決於當下的互動。',
  },
  advice: {
    pos: '這是可以放心採納的方向。',
    neg: '這是需要修正習慣、而不是加大力氣的方向。',
    mix: '可以先小步嘗試，再看反應調整。',
  },
}

const TAIL_GROUP = {
  now: 'time', past: 'time', relation: 'time', hidden: 'time', generic: 'time',
  future: 'future',
  self: 'person', other: 'person', feeling: 'person', mind: 'person', giving: 'person',
  worry: 'worry', action: 'action', advice: 'advice',
}

const REVERSED_NOTES = [
  '逆位讓這份能量變得內收，比較像是在提醒需要調整的地方。',
  '牌是倒過來的，代表這股力量沒有順利表達，或用在了不太對的地方。',
  '逆位不等於壞，而是這裡的能量有點卡住、延遲，需要你多看一眼。',
]

// 卡片在這個位置的說明（中間欄）
const buildRoleText = (ctx) => {

  const { role, pos, c, k, q, subj, subjLabel, tone, rev, catText, catLabel, index } = ctx
  const [k1, k2] = k

  const frames = {
    now: `放在「${pos}」，${c}指出${q}此刻的重心落在「${k1}」與「${k2}」上。`,
    past: `放在「${pos}」，${c}像是一段還留在心裡的背景：「${k1}」與「${k2}」是這件事一路走來的底色。`,
    future: `放在「${pos}」，${c}描繪的是一個正在成形的方向，而不是已經寫好的結局——「${k1}」與「${k2}」是它的主要氣氛。`,
    self: `「${pos}」這格在看你自己。${c}顯示你在這件事裡最明顯的狀態是「${k1}」，底下藏著「${k2}」。`,
    other: `「${pos}」這格在看對方。${c}顯示對方目前呈現出來的是「${k1}」，深一層則是「${k2}」。`,
    relation: `放在「${pos}」，${c}說的是你們之間流動的能量：「${k1}」與「${k2}」是這段關係目前的共同語言。`,
    feeling: `放在「${pos}」，${c}指向情緒層面：對方心裡真正在動的是「${k1}」，帶著一點「${k2}」。`,
    worry: `「${pos}」這格在看什麼讓事情卡住。${c}指出「${k1}」與「${k2}」是目前最容易讓人猶豫的部分。`,
    action: `放在「${pos}」，${c}說明接下來最可能出現的舉動與「${k1}」有關，帶著「${k2}」的節奏。`,
    giving: `「${pos}」在看${subjLabel}實際投入了什麼。${c}顯示這份投入的形式是「${k1}」，重點放在「${k2}」。`,
    mind: `「${pos}」在看${subjLabel}看待這件事的方式。${c}顯示這裡的心態偏向「${k1}」，同時摻著「${k2}」。`,
    hidden: `「${pos}」是還沒被說出口的部分。${c}暗示真正在影響結果的，其實是「${k1}」與「${k2}」。`,
    advice: `放在「${pos}」，${c}給出的方向是：把重心放在「${k1}」，並留意「${k2}」。`,
    generic: `放在「${pos}」，${c}帶來「${k1}」與「${k2}」的訊號。`,
  }

  const tail = TAILS[TAIL_GROUP[role] || 'time'][tone]

  const detail = catText
    ? `以${catLabel}的角度來看：${catText}`
    : `也別忽略「${k[2] || k1}」這個細節。`

  return [
    frames[role] || frames.generic,
    tail,
    detail,
    rev ? REVERSED_NOTES[index % REVERSED_NOTES.length] : '',
  ].filter(Boolean).join('')
}

// 「對你來說」：像占卜師對被占卜者說話
const FOR_YOU = {
  now: {
    pos: (k) => `如果你這陣子隱約覺得「${k[0]}」正在回到生活裡，那不是錯覺。這張牌想說的是：先讓自己好好接住它，不必急著證明或抓緊。`,
    neg: (k) => `如果你現在覺得心裡有點卡、有點悶，這張牌想說的是：你感覺到的「${k[0]}」是真的。先承認它，再決定要不要行動，會比硬撐好。`,
    mix: (k) => `如果你現在的心情忽冷忽熱，那很正常——牌裡同時有「${k[0]}」與「${k[1]}」。你不需要立刻選邊，先看看哪一個更接近你真實的感覺。`,
  },
  past: {
    pos: (k) => `如果你回頭看這段路，會發現「${k[0]}」其實給了你不少養分。這張牌提醒你，別只記得遺憾，這些經驗仍然是你現在的資本。`,
    neg: (k) => `如果過去有些話、有些感受一直沒被好好處理，這張牌想說的是：「${k[0]}」還在影響你。看見它，不代表要重新經歷一次。`,
    mix: (k) => `如果你對過去的感覺很複雜，這張牌認同這種複雜：有「${k[0]}」，也有「${k[1]}」。不必逼自己只留下其中一種說法。`,
  },
  future: {
    pos: (k) => `如果你想知道路會不會走順，這張牌的回答偏向樂觀：只要你願意繼續朝「${k[0]}」的方向走，機會是在的。`,
    neg: (k) => `如果你擔心事情會走偏，這張牌並不是在宣判結果，而是在提醒你：若一直重複同樣的反應，「${k[0]}」的課題只會再出現。`,
    mix: (k) => `如果你想要一個確定的答案，這張牌給的是條件：走向取決於你如何回應「${k[0]}」與「${k[1]}」。這是可以由你參與的未來。`,
  },
  self: {
    pos: (k) => `如果你最近對自己有些懷疑，這張牌想讓你知道：你身上的「${k[0]}」是被看見的。相信它，也別忘了善待自己。`,
    neg: (k) => `如果你其實累了，或有些話一直沒說出口，這張牌想說的是：你的「${k[0]}」值得被認真對待，不必一個人扛著。`,
    mix: (k) => `如果你分不清自己真正想要什麼，這張牌說的是：你心裡同時有「${k[0]}」與「${k[1]}」。先誠實地看見兩邊，比急著選一邊更重要。`,
  },
  other: {
    pos: (k) => `如果你一直在猜對方的心意，這張牌給的訊號偏溫暖：「${k[0]}」是對方目前比較真實的樣子。不過，仍要看他實際怎麼做。`,
    neg: (k) => `如果你覺得對方忽近忽遠，這張牌暗示對方那邊有「${k[0]}」的狀態。這不一定等於不在乎，但值得你觀察他是否有實際的行動。`,
    mix: (k) => `如果你讀不懂對方，這張牌也在說：他自己可能還在「${k[0]}」與「${k[1]}」之間拉扯。別急著替他下定論。`,
  },
  relation: {
    pos: (k) => `如果你在意這段關係走不走得下去，這張牌顯示：你們之間仍有「${k[0]}」可以依靠。好好珍惜這份共通點，並用行動維持它。`,
    neg: (k) => `如果你們最近很多話說不到點上，這張牌指出關係裡的「${k[0]}」需要被處理。先從一次坦誠的對話開始，而不是各自猜測。`,
    mix: (k) => `如果你覺得關係時好時壞，這張牌點出：你們之間同時有「${k[0]}」與「${k[1]}」。兩件事都是真的，要一起面對。`,
  },
  worry: {
    pos: () => `如果你對這件事有些不安，這張牌想說的是：這份顧慮沒有想像中沉重。說出來，很多擔心就會變輕。`,
    neg: (k) => `如果你一直不敢面對心裡的那個擔心，這張牌想說的是：「${k[0]}」不會因為被忽略而消失。給它一個安全的出口。`,
    mix: () => `如果你的擔心有一半是真的、一半是想像，這張牌提醒你分清楚：哪些是已經發生的，哪些只是你怕它發生。`,
  },
  action: {
    pos: () => `如果你在等待下一步，這張牌暗示行動偏向靠近與推進。你可以先準備好自己的回應，而不是只被動等待。`,
    neg: () => `如果接下來看起來沒什麼動靜，這張牌提醒你：對方或事情可能正在觀望。這時候比起追問，先把自己的步調穩住。`,
    mix: () => `如果你不確定接下來會怎麼樣，這張牌說的是：下一步還沒定，取決於你們當下的互動。保持彈性就好。`,
  },
  advice: {
    pos: (k) => `如果你想知道現在該怎麼做，這張牌給的答案是：順著「${k[0]}」的方向走，是可以放心的。`,
    neg: (k) => `如果你想知道現在該怎麼做，這張牌的答案比較不是「多做」，而是「調整」：先處理「${k[0]}」，再談下一步。`,
    mix: (k) => `如果你想知道現在該怎麼做，這張牌建議先走小步：留一點彈性給「${k[1]}」，再看情況修正。`,
  },
  hidden: {
    pos: (k) => `如果你覺得事情背後還有什麼沒被看見，這張牌說的是：「${k[0]}」正在暗處幫你，只是還沒被你注意到。`,
    neg: (k) => `如果你總覺得有什麼說不清楚的東西在影響事情，這張牌指出那可能是「${k[0]}」。先承認它存在，會比一直找原因更輕鬆。`,
    mix: (k) => `如果背後的原因不只一個，這張牌說的是：「${k[0]}」與「${k[1]}」都在悄悄起作用，把它們分開看會比較清楚。`,
  },
  generic: {
    pos: (k) => `如果你想從這張牌得到一個提醒，那就是：相信「${k[0]}」，也別忘了「${k[1]}」。`,
    neg: (k) => `如果你想從這張牌得到一個提醒，那就是：留意「${k[0]}」，並且不要忽略「${k[1]}」。`,
    mix: (k) => `如果你想從這張牌得到一個提醒，那就是：「${k[0]}」與「${k[1]}」都值得你花一點時間看清楚。`,
  },
}

const forYouRole = (role, subject) => {
  if (role === 'feeling') return 'other'
  if (role === 'mind' || role === 'giving') return subject === 'other' ? 'other' : 'self'
  return FOR_YOU[role] ? role : 'generic'
}

const TONE_STATE = {
  past: {
    pos: '留下的是可以帶著走的底氣',
    neg: '留下的是一段還沒被好好消化的感受',
    mix: '留下的是好壞交錯的記憶',
  },
  now: {
    pos: '目前的狀態是有力的、可以被善用',
    neg: '目前的狀態是卡在原地、需要被看見',
    mix: '目前的狀態還在兩端之間擺盪',
  },
  future: {
    pos: '指向一個比較順的方向',
    neg: '提醒你：若沒有調整，同樣的課題還會回來',
    mix: '顯示結果還取決於接下來的選擇',
  },
}

const TRANSITION = {
  'pos>pos': '一路都是順著走，所以',
  'neg>pos': '原本的卡住正在慢慢鬆開，於是',
  'neg>neg': '同樣的課題還沒有被真正處理，因此',
  'pos>neg': '過去的順利遇上了新的考驗，於是',
}

const STORY_LINE = {
  self: (c, k) => `你這邊，${c}顯示「${k[0]}」是目前的主調`,
  other: (c, k) => `對方那邊，${c}顯示「${k[0]}」是他目前呈現的樣子`,
  relation: (c, k) => `你們之間，${c}說明「${k[0]}」是關係目前的共同語言`,
  feeling: (c, k) => `對方的感受，${c}指向「${k[0]}」`,
  worry: (c, k) => `讓事情卡住的，是${c}所代表的「${k[0]}」`,
  action: (c, k) => `接下來的動作，${c}顯示偏向「${k[0]}」`,
  hidden: (c, k) => `暗處的影響，${c}指出「${k[0]}」`,
  advice: (c, k) => `而牌給你的建議，${c}是「${k[0]}」`,
  future: (c, k) => `發展上，${c}指向「${k[0]}」`,
}

export function buildSpreadReading({ question, category, spread, drawn }) {

  const qShort = (question || '')
    .replace(/[？?！!。\s]+$/, '')
    .slice(0, 26)

  const q = qShort ? `你問的「${qShort}」` : '這件事'
  const catInfo = CATEGORY_FIELD[category] || null

  const cards = drawn.map(({ card, orientation }, index) => {

    const position = spread.positions[index]
    const rev = orientation === '逆位'
    const role = roleOf(position)
    const subject = subjectOf(position)
    const subjLabel = subject === 'other' ? '對方' : '你'

    const read = (field) =>
      rev
        ? (card.reversedMeaning && card.reversedMeaning[field]) || ''
        : card[field] || ''

    const k = (rev ? card.reversed : card.upright).slice(0, 3)
    const tone = toneOf(read('yesNo'))
    const c = `${card.name}（${orientation}）`

    const catText = catInfo ? firstSentence(read(catInfo.field)) : ''

    const ctx = {
      role, pos: position, c, k, q, subjLabel, tone, rev,
      catText, catLabel: catInfo ? catInfo.label : '', index,
    }

    const foryouRole = forYouRole(role, subject)

    return {
      index,
      position,
      card,
      orientation,
      glyph: GLYPH[card.group] || '✦',
      role,
      tone,
      k,
      c,
      text: buildRoleText(ctx),
      foryou: FOR_YOU[foryouRole][tone](k),
    }
  })

  // ---------- 整體解析：把幾張牌串成一段故事 ----------

  const paragraphs = []
  const find = (r) => cards.find((item) => item.role === r)
  const past = find('past')
  const now = find('now')
  const future = find('future')

  const clause = (item) => `${item.c}（${item.k[0]}、${item.k[1]}）`

  if (past || now) {

    const intro = qShort
      ? `針對你問的「${qShort}」，這次的牌把答案排成一條前後相連的線：`
      : '這次的牌排成了一條前後相連的線：'

    const parts = []

    if (past) {
      parts.push(`故事的起點在「${past.position}」——${clause(past)}，${TONE_STATE.past[past.tone]}。`)
    }

    if (now) {
      const trans = past
        ? (TRANSITION[`${past.tone}>${now.tone}`] || '兩邊的力量還在拉扯，')
        : ''
      parts.push(`${past ? '走到' : '此刻在'}「${now.position}」，${trans}${clause(now)}${past ? '' : '，'}${TONE_STATE.now[now.tone]}。`)
    }

    if (future) {
      parts.push(`如果照這個方向繼續，「${future.position}」的${clause(future)}${TONE_STATE.future[future.tone]}。`)
    }

    paragraphs.push(intro + parts.join(''))

  } else {

    const order = ['self', 'mind', 'giving', 'other', 'feeling', 'relation', 'worry', 'hidden', 'action', 'future', 'advice']

    const lines = [...cards]
      .sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role))
      .map((item) => {

        const make = STORY_LINE[item.role]

        if (make) return make(item.c, item.k)

        const who = subjectOf(item.position) === 'other' ? '對方' : '你'
        return `在「${item.position}」（${who}的角度），${item.c}帶出「${item.k[0]}」`
      })

    const head = qShort
      ? `針對你問的「${qShort}」，這次的牌把重點放在這幾個面向：`
      : '這次的牌把重點放在這幾個面向：'

    const chunkSize = lines.length > 5 ? 3 : lines.length
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize).join('；') + '。'
      paragraphs.push((i === 0 ? head : '再往下看，') + chunk)
    }
  }

  // 收尾：整體傾向、重複主題、大牌、回到問題
  const toneCount = { pos: 0, neg: 0, mix: 0 }
  cards.forEach((item) => { toneCount[item.tone] += 1 })

  const dominant =
    toneCount.pos > toneCount.neg && toneCount.pos >= toneCount.mix ? 'pos'
      : toneCount.neg > toneCount.pos && toneCount.neg >= toneCount.mix ? 'neg'
        : 'mix'

  const keywordCount = {}
  cards.forEach((item) => {
    item.k.slice(0, 2).forEach((word) => {
      keywordCount[word] = (keywordCount[word] || 0) + 1
    })
  })
  const repeated = Object.keys(keywordCount).filter((w) => keywordCount[w] > 1)

  const majors = cards.filter((item) => item.card.group === '大阿爾克那')

  let closing = '整體來看，這次的牌' + {
    pos: '偏向溫暖、可以往前走的一面',
    neg: '偏向需要被正視、值得放慢腳步的一面',
    mix: '呈現好壞並存、需要分辨的狀態',
  }[dominant]

  if (repeated.length) {
    closing += `，其中「${repeated.slice(0, 2).join('」與「')}」重複出現，是這次最值得放在心上的主題`
  }

  if (majors.length >= 2) {
    closing += `。大阿爾克那出現了 ${majors.length} 張，表示這不是一件小事，而是對你有份量的課題`
  }

  closing += '。'

  if (qShort) {
    closing += `回到你問的「${qShort}」：` + {
      pos: '答案比較傾向「有機會，也有依據」，但仍要看實際的行動。',
      neg: '答案比較傾向「現在還不是很順的時候」，先處理卡住的部分。',
      mix: '答案不是單一的是或否，而是「要看你們接下來怎麼回應」。',
    }[dominant]
  }

  paragraphs.push(closing)

  // ---------- 接下來可以留意 ----------

  const tips = []
  const reversedCount = cards.filter((item) => item.orientation === '逆位').length
  const worry = find('worry')
  const action = find('action') || find('other')
  const hasOther = cards.some((item) => subjectOf(item.position) === 'other')

  if (worry) {
    tips.push(`面對「${worry.k[0]}」這個顧慮時，先分辨它是已經發生的事實，還是心裡的想像。`)
  }

  if (repeated.length) {
    tips.push(`「${repeated[0]}」重複出現，留意它是不是這陣子一直在重複的模式。`)
  }

  if (action && hasOther) {
    tips.push('觀察對方接下來的實際行動，而不是只聽他怎麼說。')
  }

  if (future) {
    tips.push(
      future.tone === 'neg'
        ? '不要把「未來」的牌當成定案，先從你能調整的部分下手。'
        : `保持目前有效的做法，讓「${future.k[0]}」有機會被持續看見。`
    )
  }

  if (reversedCount * 2 >= cards.length) {
    tips.push('逆位偏多，代表需要調整的地方比想像中多：一次只處理一件事就好。')
  }

  if (majors.length >= 1) {
    tips.push(`這次有「${majors[0].card.name}」這張大牌，把它的訊息多放在心上。`)
  }

  const categoryTip = {
    love: '不要只根據一個訊號就下結論，多觀察幾次互動。',
    relationship: '不要只根據一個訊號就下結論，多觀察幾次互動。',
    career: '把想法寫成具體的下一步，而不是停在擔心。',
    money: '做決定前，先把數字與風險寫下來。',
    timing: '時間不用急著抓確切日期，先看各個階段是否到位。',
    yesNo: '除了「是」或「否」，也問問自己：如果是（不是），我會怎麼做？',
  }[category]

  if (categoryTip) tips.push(categoryTip)

  tips.push('找一個安靜的時間，把這次牌陣寫進「我的解讀」，一週後回頭看。')

  return {
    cards,
    overall: paragraphs,
    tips: tips.slice(0, 3),
  }
}
