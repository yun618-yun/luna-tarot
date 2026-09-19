import { useEffect, useRef, useState } from 'react'
import './learn.css'
import { tarotCards } from '../data/tarotCards'
import {
  LEARN_SOURCE,
  LEARN_MODULES,
  CROWN_QUESTIONS,
  CROWN_COMPARE,
  SYMBOL_CASES,
  ELEMENTS,
  COURT_ROLES,
  COURT_COMBOS,
  MAJOR_SYMBOLS,
  MAJOR_REVERSED_NOTES,
  REVERSAL_STATES,
  REVERSAL_EXAMPLES,
  FLOW_STEPS,
  PRACTICE_QUESTION,
  getCardInfo,
} from './learnData'


/* =====================================
   📖 塔羅學習中心
   學習筆記｜來源：清禾塔羅（芙芙）
   只用 localStorage，不需要後端或 API
===================================== */

const NOTES_KEY = 'luna-learn-notes'
const PRACTICE_KEY = 'luna-learn-practice'

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 儲存失敗時（例如無痕模式）就只保留在畫面上
  }
}

const findCard = (name) =>
  tarotCards.find((card) => card.name === name)


/* ---------- 我的理解 ---------- */

function NoteBox({ noteKey, title = '我的理解', placeholder }) {

  const [text, setText] = useState(() =>
    readStorage(NOTES_KEY, {})[noteKey] || ''
  )

  const [saved, setSaved] = useState(false)

  const handleChange = (event) => {

    const value = event.target.value
    setText(value)

    const all = readStorage(NOTES_KEY, {})
    all[noteKey] = value
    writeStorage(NOTES_KEY, all)

    setSaved(true)
  }

  return (
    <div className="learn-note">

      <div className="learn-note-head">
        <strong>✎ {title}</strong>
        <span>{saved ? '已自動儲存' : '自動儲存在這個瀏覽器'}</span>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeholder || '用自己的話寫下來，之後回來看。'}
        rows={4}
      />

    </div>
  )
}


function CardThumb({ card, reversed = false }) {
  return (
    <img
      className={
        reversed
          ? 'learn-card-img learn-card-img-reversed'
          : 'learn-card-img'
      }
      src={card.image}
      alt={card.name}
      loading="lazy"
    />
  )
}


/* =====================================
   🔮 符號解牌
===================================== */

function SymbolModule() {

  const [openId, setOpenId] = useState(SYMBOL_CASES[0].id)
  const [shown, setShown] = useState({})

  return (
    <>
      <section className="learn-block">
        <h3>核心概念</h3>
        <p className="learn-quote">
          不要看到符號就直接翻譯成固定牌義。
        </p>
        <p>
          例如「王冠」不能永遠等於「權力」。
          同一個符號，要看它在這張牌裡做了什麼。
        </p>

        <div className="learn-sub">看到王冠時，先問自己：</div>
        <ol className="learn-list">
          {CROWN_QUESTIONS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section className="learn-block">
        <h3>同一個王冠，不同的作用</h3>
        <div className="learn-compare">
          {CROWN_COMPARE.map((item) => (
            <div className="learn-compare-row" key={item.card}>
              <strong>{item.card}</strong>
              <span>{item.role}</span>
            </div>
          ))}
        </div>
        <p className="learn-tip">
          站內整理：上面是把教材例子放在一起比較，方便看出王冠的狀態不同。
        </p>
      </section>

      <section className="learn-block">
        <h3>看符號 → 思考 → 推導</h3>
        <p className="learn-tip">
          先自己想一想，寫下你的推導，再按「看推導」對照。
        </p>

        <div className="learn-case-list">
          {SYMBOL_CASES.map((item) => {

            const card = findCard(item.cardName)
            const isOpen = openId === item.id
            const isShown = !!shown[item.id]

            return (
              <div
                className={
                  isOpen
                    ? 'learn-case learn-case-open'
                    : 'learn-case'
                }
                key={item.id}
              >
                <button
                  className="learn-case-head"
                  onClick={() =>
                    setOpenId(isOpen ? null : item.id)
                  }
                >
                  <span>{item.cardName}</span>
                  <span>{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="learn-case-body">

                    <div className="learn-case-top">
                      {card && <CardThumb card={card} />}

                      <div>
                        <div className="learn-sub">畫面上的符號</div>
                        <div className="learn-chips">
                          {item.symbols.map((symbol) => (
                            <span key={symbol}>{symbol}</span>
                          ))}
                        </div>
                        <p className="learn-think">
                          💭 {item.prompt}
                        </p>
                      </div>
                    </div>

                    <NoteBox
                      noteKey={`symbol-${item.id}`}
                      title="我先這樣想"
                      placeholder="不看答案，先寫下這些符號讓你想到什麼。"
                    />

                    <button
                      className="learn-btn"
                      onClick={() =>
                        setShown({
                          ...shown,
                          [item.id]: !isShown,
                        })
                      }
                    >
                      {isShown ? '收起推導' : '👁️ 看推導'}
                    </button>

                    {isShown && (
                      <div className="learn-answer">
                        <ol className="learn-list">
                          {item.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        <div className="learn-result">
                          <span>→ 組合起來</span>
                          <strong>{item.result}</strong>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}


/* =====================================
   🌿 四元素
===================================== */

function ElementsModule() {

  const [counts, setCounts] = useState({
    fire: 0,
    water: 0,
    air: 0,
    earth: 0,
  })

  const change = (id, delta) => {
    setCounts((current) => ({
      ...current,
      [id]: Math.max(0, Math.min(10, current[id] + delta)),
    }))
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const max = Math.max(...Object.values(counts))
  const leaders = ELEMENTS.filter((item) => counts[item.id] === max)

  return (
    <>
      <section className="learn-block">
        <h3>四個元素</h3>
        <div className="learn-grid learn-grid-2">
          {ELEMENTS.map((item) => (
            <div className="learn-element" key={item.id}>
              <div className="learn-element-title">
                <span>{item.icon}</span>
                <strong>
                  {item.element}／{item.suit}
                </strong>
              </div>
              <div className="learn-chips">
                {item.keywords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="learn-tip">
          站內牌庫的牌組名稱是「錢幣」，教材稱「星幣」，指的是同一組。
        </p>
      </section>

      <section className="learn-block">
        <h3>牌陣中的元素重量</h3>
        <p>
          不要只看單張牌，也要看整個牌陣裡，哪個元素一直出現。
        </p>
        <ul className="learn-list">
          {ELEMENTS.map((item) => (
            <li key={item.id}>
              {item.icon} {item.weight}
            </li>
          ))}
        </ul>
      </section>

      <section className="learn-block">
        <h3>試試看：數一數你的牌陣</h3>
        <p className="learn-tip">
          把牌陣裡各牌組的張數填進來（大牌不算牌組）。
        </p>

        <div className="learn-counters">
          {ELEMENTS.map((item) => (
            <div className="learn-counter" key={item.id}>

              <div className="learn-counter-label">
                {item.icon} {item.suit}
              </div>

              <div className="learn-counter-ctrl">
                <button onClick={() => change(item.id, -1)}>−</button>
                <span>{counts[item.id]}</span>
                <button onClick={() => change(item.id, 1)}>＋</button>
              </div>

              <div className="learn-bar">
                <div
                  style={{
                    width: `${max ? (counts[item.id] / max) * 100 : 0}%`,
                  }}
                />
              </div>

            </div>
          ))}
        </div>

        <div className="learn-answer">
          {total === 0 ? (
            <p>先填入各牌組的張數，這裡會告訴你哪個元素的重量最大。</p>
          ) : leaders.length === ELEMENTS.length ? (
            <p>
              四個元素一樣多：沒有特別偏重的領域，
              這時可以更多回到牌與牌之間的關係。
            </p>
          ) : (
            <>
              <p>
                目前最重的是：
                <strong>
                  {leaders
                    .map((item) => `${item.icon}${item.suit}`)
                    .join('、')}
                </strong>
              </p>
              <ul className="learn-list">
                {leaders.map((item) => (
                  <li key={item.id}>{item.weight}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  )
}


/* =====================================
   👑 宮廷牌
===================================== */

function CourtModule() {

  const [suitId, setSuitId] = useState('水')
  const [roleId, setRoleId] = useState('king')

  const suits = ELEMENTS

  const getCourtCard = (suit, role) =>
    findCard(`${suit}${role.dataName}`)

  const activeSuit = suits.find((item) => item.element === suitId) || null
  const activeRole = COURT_ROLES.find((item) => item.id === roleId) || null

  // 要顯示的組合
  let combos = []

  if (activeSuit && activeRole) {
    combos = [[activeSuit, activeRole]]
  } else if (activeRole) {
    combos = suits.map((suit) => [suit, activeRole])
  } else if (activeSuit) {
    combos = COURT_ROLES.map((role) => [activeSuit, role])
  }

  return (
    <>
      <section className="learn-block">
        <h3>核心公式</h3>
        <p className="learn-formula">
          牌組元素 × 宮廷身份 = 表現方式
        </p>

        <div className="learn-grid learn-grid-2">
          {COURT_ROLES.map((role) => (
            <div className="learn-element" key={role.id}>
              <div className="learn-element-title">
                <strong>{role.label}</strong>
              </div>
              <div className="learn-chips">
                {role.keywords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="learn-block">
        <h3>互動查詢</h3>
        <p className="learn-tip">
          選一個牌組、一個身份，看兩者怎麼組合。
          只選其中一個，會列出同一個身份（或同一牌組）的四張。
        </p>

        <div className="learn-picker">
          <div className="learn-picker-label">牌組元素</div>
          <div className="learn-picker-row">
            {suits.map((item) => (
              <button
                key={item.id}
                className={
                  suitId === item.element
                    ? 'learn-pick learn-pick-on'
                    : 'learn-pick'
                }
                onClick={() =>
                  setSuitId(suitId === item.element ? null : item.element)
                }
              >
                {item.icon} {item.element}／{item.suit}
              </button>
            ))}
          </div>

          <div className="learn-picker-label">宮廷身份</div>
          <div className="learn-picker-row">
            {COURT_ROLES.map((role) => (
              <button
                key={role.id}
                className={
                  roleId === role.id
                    ? 'learn-pick learn-pick-on'
                    : 'learn-pick'
                }
                onClick={() =>
                  setRoleId(roleId === role.id ? null : role.id)
                }
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {combos.length === 0 && (
          <p className="learn-tip">選一個牌組或身份開始查詢。</p>
        )}

        <div
          className={
            combos.length > 1
              ? 'learn-grid learn-grid-2'
              : 'learn-grid'
          }
        >
          {combos.map(([suit, role]) => {

            const card = getCourtCard(suit.suit, role)

            return (
              <div className="learn-court" key={`${suit.id}-${role.id}`}>

                {card && <CardThumb card={card} />}

                <div className="learn-court-body">

                  <h4>{suit.suit}{role.label}</h4>

                  <div className="learn-court-formula">
                    {suit.element} × {role.label}
                  </div>

                  <div className="learn-court-mix">
                    <div>
                      <small>{suit.element}／{suit.suit}</small>
                      {suit.keywords.slice(0, 3).join('・')}
                    </div>
                    <span>×</span>
                    <div>
                      <small>{role.label}</small>
                      {role.keywords.slice(0, 3).join('・')}
                    </div>
                  </div>

                  <p>{COURT_COMBOS[suit.suit][role.id]}</p>

                  {card && (
                    <div className="learn-court-data">
                      牌庫關鍵字：{card.upright.join('・')}
                    </div>
                  )}

                </div>
              </div>
            )
          })}
        </div>

        <p className="learn-tip">
          站內整理：組合說明是依「元素 × 身份」推導的重點，
          聖杯國王為教材範例。實際解牌仍要回到問題與牌陣。
        </p>
      </section>
    </>
  )
}


/* =====================================
   ✨ 大阿爾克那
===================================== */

function MajorModule() {

  const majors = tarotCards.filter(
    (card) => card.group === '大阿爾克那'
  )

  const [selectedId, setSelectedId] = useState(
    findCard('皇后')?.id ?? majors[0].id
  )

  const card = majors.find((item) => item.id === selectedId)
  const taught = MAJOR_SYMBOLS[card.name]

  return (
    <>
      <section className="learn-block">
        <h3>看圖學牌</h3>
        <p>
          順序是：<strong>看圖 → 找符號 → 想方向 → 組合成牌義</strong>。
          點一張牌看看。
        </p>
        <p className="learn-tip">
          目前只有教材整理過符號的牌（有 ✦ 標記）會列出符號；
          其他牌先顯示站內牌庫已有的資料，不另外編造。
        </p>

        <div className="learn-major-grid">
          {majors.map((item) => (
            <button
              key={item.id}
              className={
                item.id === selectedId
                  ? 'learn-major learn-major-on'
                  : 'learn-major'
              }
              onClick={() => setSelectedId(item.id)}
            >
              <img src={item.image} alt={item.name} loading="lazy" />
              <span>
                {MAJOR_SYMBOLS[item.name] ? '✦ ' : ''}
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="learn-block learn-major-detail">

        <div className="learn-case-top">

          <CardThumb card={card} />

          <div>
            <div className="eyebrow">{card.number}｜{card.english}</div>
            <h3>{card.name}</h3>

            {taught ? (
              <>
                <div className="learn-sub">① 主要符號</div>
                <div className="learn-chips">
                  {taught.symbols.map((symbol) => (
                    <span key={symbol}>{symbol}</span>
                  ))}
                </div>

                <div className="learn-sub">② 符號代表的方向</div>
                <p>符號一起看，指向：{taught.direction}</p>

                <div className="learn-sub">③ 組合成牌義</div>
                <p>
                  正位關鍵字：{card.upright.join('・')}
                </p>
              </>
            ) : (
              <>
                <p className="learn-tip">
                  教材筆記尚未整理這張牌的符號，先看站內牌庫的資料。
                </p>
                <div className="learn-sub">牌義關鍵字</div>
                <p>正位：{card.upright.join('・')}</p>
                <p>逆位：{card.reversed.join('・')}</p>
              </>
            )}

            {MAJOR_REVERSED_NOTES[card.name] && (
              <p className="learn-note-inline">
                教材的逆位例子：{MAJOR_REVERSED_NOTES[card.name]}
              </p>
            )}
          </div>
        </div>

        {card.story && (
          <div className="learn-story">
            <div className="learn-sub">站內牌卡故事</div>
            <p>{card.story}</p>
          </div>
        )}

        <NoteBox
          noteKey={`major-${card.id}`}
          title={`我對${card.name}的理解`}
          placeholder="看完圖之後，你看到什麼符號？它們一起指向什麼？"
        />

      </section>
    </>
  )
}


/* =====================================
   🔄 正逆位
===================================== */

function ReversalModule() {

  const [cardId, setCardId] = useState(findCard('月亮').id)
  const [stateName, setStateName] = useState(null)

  const card = tarotCards.find((item) => item.id === cardId)
  const state = REVERSAL_STATES.find((item) => item.name === stateName)

  const reversedFields = [
    ['感情', card.reversedMeaning?.love],
    ['工作', card.reversedMeaning?.career],
    ['金錢', card.reversedMeaning?.money],
    ['人際', card.reversedMeaning?.relationship],
  ].filter(([, text]) => text)

  return (
    <>
      <section className="learn-block">
        <h3>不是「好」與「壞」</h3>
        <p className="learn-quote">
          正位不等於好，逆位不等於壞。
        </p>
        <div className="learn-grid learn-grid-2">
          <div className="learn-element">
            <div className="learn-element-title">
              <strong>正位</strong>
            </div>
            <p>能量正常運作。</p>
          </div>
          <div className="learn-element">
            <div className="learn-element-title">
              <strong>逆位</strong>
            </div>
            <p>能量可能出現狀況：</p>
            <div className="learn-chips">
              {REVERSAL_STATES.map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="learn-block">
        <h3>教材中的例子</h3>
        <div className="learn-grid learn-grid-2">
          {REVERSAL_EXAMPLES.map((item) => {

            const example = findCard(item.card)

            return (
              <div className="learn-court" key={item.card}>
                {example && <CardThumb card={example} reversed />}
                <div className="learn-court-body">
                  <h4>{item.card}逆位</h4>
                  <p>{item.text}</p>
                  <p className="learn-tip">站內整理：{item.note}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="learn-block">
        <h3>練習：觀察能量</h3>
        <p className="learn-tip">
          選一張牌，比較正位與逆位，再想想逆位比較像哪一種狀態。
        </p>

        <select
          className="learn-select"
          value={cardId}
          onChange={(event) => {
            setCardId(Number(event.target.value))
            setStateName(null)
          }}
        >
          {tarotCards.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <div className="learn-compare-pos">

          <div className="learn-pos">
            <CardThumb card={card} />
            <strong>正位</strong>
            <span>{card.upright.join('・')}</span>
          </div>

          <div className="learn-pos">
            <CardThumb card={card} reversed />
            <strong>逆位</strong>
            <span>{card.reversed.join('・')}</span>
          </div>

        </div>

        {reversedFields.length > 0 && (
          <div className="learn-compare">
            {reversedFields.map(([label, text]) => (
              <div className="learn-compare-row" key={label}>
                <strong>逆位・{label}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="learn-sub">這個逆位比較像哪一種狀態？</div>
        <div className="learn-picker-row">
          {REVERSAL_STATES.map((item) => (
            <button
              key={item.name}
              className={
                stateName === item.name
                  ? 'learn-pick learn-pick-on'
                  : 'learn-pick'
              }
              onClick={() => setStateName(item.name)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {state && (
          <div className="learn-answer">
            <strong>{state.name}</strong>：{state.hint}
          </div>
        )}
      </section>
    </>
  )
}


/* =====================================
   🧠 實戰解牌流程
===================================== */

function FlowModule() {

  const [checked, setChecked] = useState({})

  const toggle = (key) =>
    setChecked({ ...checked, [key]: !checked[key] })

  return (
    <>
      <section className="learn-block">
        <h3>六個 STEP</h3>
        <p>
          重點不是「這張牌代表什麼」，而是：
        </p>
        <p className="learn-quote">
          這張牌為什麼在這個問題裡，以這個樣子出現？
        </p>
      </section>

      <div className="learn-steps">
        {FLOW_STEPS.map((step) => (
          <section className="learn-step" key={step.no}>

            <div className="learn-step-no">STEP {step.no}</div>
            <h3>{step.title}</h3>
            <p>{step.lead}</p>

            <div className="learn-checks">
              {step.checks.map((text) => {

                const key = `${step.no}-${text}`

                return (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggle(key)}
                    />
                    <span>{text}</span>
                  </label>
                )
              })}
            </div>

          </section>
        ))}
      </div>

      <section className="learn-block">
        <h3>一句話的骨架</h3>
        <p className="learn-formula-soft">
          因為牌陣裡【最明顯的重點】，
          所以在【問題】上，目前的狀態是【一句話】。
        </p>
        <p className="learn-tip">
          站內整理：這是幫助組句的骨架，不是固定答案。
          到「你來解牌」實際練習一次。
        </p>
      </section>
    </>
  )
}


/* =====================================
   👁️ 你來解牌
===================================== */

const ELEMENT_TOPIC = {
  '火': '行動與推進',
  '水': '情感與關係',
  '風': '思考與溝通',
  '土': '現實與資源',
}

const drawThree = () => {

  const pool = [...tarotCards]

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, 3).map((card) => ({
    id: card.id,
    reversed: Math.random() < 0.5,
  }))
}

const buildReference = (drawn) => {

  const items = drawn.map(({ id, reversed }) => {

    const card = tarotCards.find((item) => item.id === id)
    const info = getCardInfo(card)

    const keywords = reversed ? card.reversed : card.upright
    const relation = reversed
      ? card.reversedMeaning?.relationship
      : card.relationship

    return { card, info, reversed, keywords, relation }
  })

  const elementCount = {}

  items.forEach(({ info }) => {
    if (info.element) {
      elementCount[info.element] = (elementCount[info.element] || 0) + 1
    }
  })

  const maxCount = Math.max(0, ...Object.values(elementCount))
  const leaders = Object.keys(elementCount).filter(
    (key) => elementCount[key] === maxCount
  )

  const majors = items.filter(({ info }) => info.kind === 'major').length
  const courts = items.filter(({ info }) => info.kind === 'court').length
  const reversedCount = items.filter(({ reversed }) => reversed).length

  const overview = []

  if (maxCount >= 2) {
    overview.push(
      `${leaders.join('、')}元素較多（${maxCount} 張），重心偏向「${leaders
        .map((key) => ELEMENT_TOPIC[key])
        .join('、')}」。`
    )
  } else if (Object.keys(elementCount).length > 0) {
    overview.push('元素分散，沒有特別偏重的領域，要更多看牌與牌的關係。')
  } else {
    overview.push('三張都是大牌，沒有小牌元素可比較。')
  }

  overview.push(
    majors >= 2
      ? `大牌有 ${majors} 張：這段關係帶有較大的主題或轉折感。`
      : majors === 1
        ? '有 1 張大牌：其中一個主題比其他牌更突出。'
        : '沒有大牌：偏向日常層面的狀態。'
  )

  if (courts > 0) {
    overview.push(
      `宮廷牌有 ${courts} 張：可以想想是誰、以什麼身份和姿態在這段關係裡。`
    )
  }

  overview.push(
    reversedCount === 0
      ? '三張都是正位：能量整體運作比較順暢。'
      : reversedCount === 3
        ? '三張都是逆位：整體能量有卡住、失衡或延遲的地方，需要逐張看是哪一種。'
        : `逆位 ${reversedCount} 張、正位 ${3 - reversedCount} 張：` +
          '正位的部分是能運作的能量，逆位的部分是需要調整的地方。'
  )

  const repeatedRole = items.find(
    (a, index) =>
      a.info.role &&
      items.some(
        (b, other) => other !== index && b.info.role === a.info.role
      )
  )

  if (repeatedRole) {
    overview.push(`「${repeatedRole.info.role}」重複出現，這個主題值得特別留意。`)
  }

  const topic =
    leaders.length === 1 && maxCount >= 2
      ? ELEMENT_TOPIC[leaders[0]]
      : '整體狀態'

  const sentence =
    `這段關係目前的重心在「${topic}」，三張牌依序帶出` +
    items
      .map(({ keywords }) => `「${keywords[0]}」`)
      .join('、') +
    '。'

  return { items, overview, sentence }
}


function PracticeModule() {

  const saved = readStorage(PRACTICE_KEY, null)

  const [drawn, setDrawn] = useState(
    () => saved?.drawn?.length === 3 ? saved.drawn : drawThree()
  )

  const [fields, setFields] = useState(
    () => saved?.fields || ['', '', '', '']
  )

  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    writeStorage(PRACTICE_KEY, { drawn, fields })
  }, [drawn, fields])

  const labels = [
    '① 我看到的元素',
    '② 我看到的重要符號',
    '③ 三張牌之間的關係',
    '④ 我的整體解讀',
  ]

  const reference = revealed ? buildReference(drawn) : null

  const redraw = () => {
    setDrawn(drawThree())
    setFields(['', '', '', ''])
    setRevealed(false)
  }

  return (
    <section className="learn-block learn-practice">

      <div className="eyebrow">PRACTICE</div>
      <h3>你來解牌</h3>

      <div className="learn-question">
        問題：{PRACTICE_QUESTION}
      </div>

      <div className="learn-practice-cards">
        {drawn.map(({ id, reversed }, index) => {

          const card = tarotCards.find((item) => item.id === id)

          return (
            <div className="learn-pos" key={id}>
              <CardThumb card={card} reversed={reversed} />
              <strong>{card.name}</strong>
              <span>{reversed ? '逆位' : '正位'}</span>
              <small>第 {index + 1} 張</small>
            </div>
          )
        })}
      </div>

      {labels.map((label, index) => (
        <label className="learn-field" key={label}>
          <span>{label}</span>
          <textarea
            rows={index === 3 ? 4 : 2}
            value={fields[index]}
            onChange={(event) => {
              const next = [...fields]
              next[index] = event.target.value
              setFields(next)
            }}
          />
        </label>
      ))}

      <div className="learn-actions">
        <button
          className="learn-btn"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? '收起參考方向' : '👁️ 查看參考方向'}
        </button>

        <button
          className="learn-btn learn-btn-ghost"
          onClick={redraw}
        >
          重新抽牌
        </button>
      </div>

      <p className="learn-tip">
        你的內容會自動儲存在這個瀏覽器；重新抽牌會清空目前的填寫。
      </p>

      {reference && (
        <div className="learn-answer">

          <div className="learn-sub">牌陣整體（STEP 02）</div>
          <ul className="learn-list">
            {reference.overview.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="learn-sub">單張牌（STEP 03）</div>
          {reference.items.map(({ card, info, reversed, keywords, relation }) => (
            <div className="learn-ref-card" key={card.id}>
              <strong>
                {card.name}（{reversed ? '逆位' : '正位'}）
              </strong>
              <small>
                {info.kind === 'major'
                  ? '大阿爾克那'
                  : `${info.suit}・${info.element}元素・${
                      info.kind === 'court' ? '宮廷' : '數字'
                    }${info.role}`}
              </small>
              <p>關鍵字：{keywords.join('・')}</p>
              {relation && <p>關係面：{relation}</p>}
            </div>
          ))}

          <div className="learn-sub">組成一句話（STEP 06）</div>
          <p className="learn-formula-soft">{reference.sentence}</p>

          <p className="learn-tip">
            參考方向只使用站內牌義資料與本學習中心的框架，
            不代表唯一答案；請對照你自己的解讀，找出差異。
          </p>

        </div>
      )}

    </section>
  )
}


/* =====================================
   學習中心主頁
===================================== */

const MODULE_VIEWS = {
  symbol: SymbolModule,
  elements: ElementsModule,
  court: CourtModule,
  major: MajorModule,
  reversal: ReversalModule,
  flow: FlowModule,
}

const readModuleFromHash = () => {

  const hash = window.location.hash.replace(/^#/, '')

  if (!hash.startsWith('learn/')) {
    return null
  }

  const id = hash.slice('learn/'.length)

  return (
    LEARN_MODULES.some((item) => item.id === id) || id === 'practice'
      ? id
      : null
  )
}


function Learn({ onBack }) {

  const [moduleId, setModuleId] = useState(readModuleFromHash)

  // 是否已經自己 push 過一筆「模組」紀錄，返回時才能安全 history.back()
  const pushedRef = useRef(false)

  useEffect(() => {

    const handlePopState = () => {
      setModuleId(readModuleFromHash())
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const openModule = (id) => {

    window.history.pushState(
      { page: 'learn', cardId: null, spreadId: null },
      '',
      `#learn/${id}`
    )

    pushedRef.current = true
    setModuleId(id)
    window.scrollTo(0, 0)
  }

  const closeModule = () => {

    if (pushedRef.current) {
      window.history.back()
      return
    }

    window.history.replaceState(
      { page: 'learn', cardId: null, spreadId: null },
      '',
      '#learn'
    )

    setModuleId(null)
    window.scrollTo(0, 0)
  }

  const current =
    LEARN_MODULES.find((item) => item.id === moduleId) ||
    (moduleId === 'practice'
      ? { id: 'practice', icon: '👁️', title: '你來解牌' }
      : null)

  const View = current && MODULE_VIEWS[current.id]

  return (
    <div className="page learn">

      {!current ? (

        <>
          <button className="back-button" onClick={onBack}>
            ← 返回首頁
          </button>

          <header className="learn-header">
            <div className="eyebrow">TAROT LEARNING</div>
            <h1>📖 塔羅學習中心</h1>
            <p>
              看知識 → 查方法 → 練習解牌 → 保存自己的理解
            </p>
            <div className="learn-source">{LEARN_SOURCE}</div>
          </header>

          <div className="learn-hub">
            {LEARN_MODULES.map((item, index) => (
              <button
                className="learn-hub-card"
                key={item.id}
                onClick={() => openModule(item.id)}
              >
                <span className="learn-hub-no">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="learn-hub-icon">{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.desc}</small>
              </button>
            ))}

            <button
              className="learn-hub-card learn-hub-practice"
              onClick={() => openModule('practice')}
            >
              <span className="learn-hub-no">練習</span>
              <span className="learn-hub-icon">👁️</span>
              <strong>你來解牌</strong>
              <small>隨機抽 3 張，寫下自己的解讀，再對照參考方向。</small>
            </button>
          </div>

          <p className="learn-footer">
            內容整理自公開的塔羅教學圖片，並非 Luna Tarot 原創教材。
          </p>
        </>

      ) : (

        <>
          <button className="back-button" onClick={closeModule}>
            ← 學習中心
          </button>

          <header className="learn-header">
            <div className="eyebrow">TAROT LEARNING</div>
            <h1>{current.icon} {current.title}</h1>
            <div className="learn-source">{LEARN_SOURCE}</div>
          </header>

          {current.id === 'practice'
            ? <PracticeModule />
            : <View />}

          {current.id !== 'practice' && (
            <NoteBox
              noteKey={`module-${current.id}`}
              title={`我的理解｜${current.title}`}
            />
          )}

          <p className="learn-footer">{LEARN_SOURCE}</p>
        </>

      )}

    </div>
  )
}

export default Learn
