import { useEffect, useRef, useState } from 'react'
import './App.css'
import { tarotCards } from './data/tarotCards'


/* =====================================
   🔮 牌陣資料
===================================== */

const spreads = [

  {
    id: 'draw-past-present-future',
    mode: 'draw',
    category: '抽牌牌陣',
    icon: '🌙',
    name: '現在・過去・未來',
    description: '三張牌快速了解事情目前的狀態與發展方向。',
    count: 3,
    positions: [
      '現在',
      '過去',
      '未來',
    ],
    positionDescriptions: [
      '目前事情的狀態、正在發生什麼。',
      '過去發生的事情，以及形成現在狀態的原因。',
      '目前發展下，事情可能往哪個方向走。',
    ],
  },

  {
    id: 'draw-love-three',
    mode: 'draw',
    category: '抽牌牌陣',
    icon: '♡',
    name: '感情三張',
    description: '從雙方與關係三個角度了解感情。',
    count: 3,
    positions: [
      '占卜者',
      '被占卜者',
      '關係',
    ],
    positionDescriptions: [
      '占卜者目前在這段關係中的狀態與心態。',
      '被占卜者目前在這段關係中的狀態與心態。',
      '雙方目前的關係能量與發展方向。',
    ],
  },

  {
    id: 'draw-feelings-five',
    mode: 'draw',
    category: '抽牌牌陣',
    icon: '💕',
    name: '對方心意',
    description: '深入了解被占卜者的想法、感受、顧慮與行動。',
    count: 5,
    positions: [
      '如何看待占卜者',
      '感受',
      '顧慮／阻礙',
      '可能行動',
      '關係發展',
    ],
    positionDescriptions: [
      '被占卜者目前如何看待占卜者。',
      '被占卜者對占卜者內在的情感感受。',
      '被占卜者目前在意、害怕或猶豫的事情。',
      '被占卜者接下來可能採取的行動。',
      '目前能量下，這段關係可能往哪裡發展。',
    ],
  },

  {
    id: 'private-draw-nine',
    mode: 'draw',
    category: '私人牌陣',
    icon: '🔒',
    name: '私人九張牌陣',
    description: '你的私人九張牌陣，適合深入分析關係或事件。',
    count: 9,
    private: true,
    positions: [
      '結果（未來）',
      '占卜者的心態',
      '占卜者的付出',
      '被占卜者的心態',
      '被占卜者的付出',
      '關係／事件的過去',
      '關係／事件的現在',
      '隱藏因素／影響原因',
      '建議',
    ],
    positionDescriptions: [
      '這段關係或事件最後可能往哪裡發展。',
      '占卜者目前怎麼想、怎麼看待這件事情。',
      '占卜者目前為這段關係或事件做了什麼。',
      '被占卜者目前怎麼想、怎麼看待這件事情。',
      '被占卜者目前實際做了什麼。',
      '過去發生了什麼，以及如何形成現在的狀態。',
      '現在真正正在發生什麼。',
      '有哪些尚未發現或正在影響結果的因素。',
      '對占卜者而言，目前最值得採取的方向。',
    ],
  },

  {
    id: 'blank-past-present-future',
    mode: 'blank',
    category: '空白牌陣',
    icon: '✎',
    name: '現在・過去・未來',
    description: '自己輸入實際占卜抽到的牌。',
    count: 3,
    positions: [
      '現在',
      '過去',
      '未來',
    ],
    positionDescriptions: [
      '目前事情的狀態、正在發生什麼。',
      '過去發生的事情，以及形成現在狀態的原因。',
      '目前發展下，事情可能往哪個方向走。',
    ],
  },

  {
    id: 'blank-love-three',
    mode: 'blank',
    category: '空白牌陣',
    icon: '✎',
    name: '感情三張',
    description: '自己記錄實際占卜過的感情牌。',
    count: 3,
    positions: [
      '占卜者',
      '被占卜者',
      '關係',
    ],
    positionDescriptions: [
      '占卜者目前在這段關係中的狀態與心態。',
      '被占卜者目前在這段關係中的狀態與心態。',
      '雙方目前的關係能量與發展方向。',
    ],
  },

  {
    id: 'blank-feelings-five',
    mode: 'blank',
    category: '空白牌陣',
    icon: '✎',
    name: '對方心意',
    description: '把實際占卜過的感情牌陣整理進來。',
    count: 5,
    positions: [
      '如何看待占卜者',
      '感受',
      '顧慮／阻礙',
      '可能行動',
      '關係發展',
    ],
    positionDescriptions: [
      '被占卜者目前如何看待占卜者。',
      '被占卜者對占卜者內在的情感感受。',
      '被占卜者目前在意、害怕或猶豫的事情。',
      '被占卜者接下來可能採取的行動。',
      '目前能量下，這段關係可能往哪裡發展。',
    ],
  },

  {
    id: 'private-blank-nine',
    mode: 'blank',
    category: '私人牌陣',
    icon: '🔒',
    name: '私人九張牌陣',
    description: '把實體占卜過的九張牌與自己的解讀保存下來。',
    count: 9,
    private: true,
    positions: [
      '結果（未來）',
      '占卜者的心態',
      '占卜者的付出',
      '被占卜者的心態',
      '被占卜者的付出',
      '關係／事件的過去',
      '關係／事件的現在',
      '隱藏因素／影響原因',
      '建議',
    ],
    positionDescriptions: [
      '這段關係或事件最後可能往哪裡發展。',
      '占卜者目前怎麼想、怎麼看待這件事情。',
      '占卜者目前為這段關係或事件做了什麼。',
      '被占卜者目前怎麼想、怎麼看待這件事情。',
      '被占卜者目前實際做了什麼。',
      '過去發生了什麼，以及如何形成現在的狀態。',
      '現在真正正在發生什麼。',
      '有哪些尚未發現或正在影響結果的因素。',
      '對占卜者而言，目前最值得採取的方向。',
    ],
  },

]


/* =====================================
   App
===================================== */

const getTimeTheme = () => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'day' : 'night'
}


/* =====================================
   🧭 瀏覽器上一頁 / 下一頁支援

   把目前頁面（page / selectedCard / selectedSpread）
   對應到網址的 hash，讓瀏覽器（含手機）的
   上一頁、下一頁可以正確在頁面之間切換。
===================================== */

const NAV_KNOWN_PAGES = [
  'home',
  'library',
  'favorites',
  'history',
  'spreads',
  'daily',
  'stats',
]

const buildNavHash = (targetPage, { cardId, spreadId } = {}) => {

  if (targetPage === 'card' && cardId !== null && cardId !== undefined) {
    return `#card/${cardId}`
  }

  if (targetPage === 'spread' && spreadId) {
    return `#spread/${spreadId}`
  }

  return `#${targetPage}`
}

const parseNavHash = (rawHash) => {

  const hash = (rawHash || '').replace(/^#/, '')

  if (hash.startsWith('card/')) {
    return {
      page: 'card',
      cardId: hash.slice('card/'.length),
      spreadId: null,
    }
  }

  if (hash.startsWith('spread/')) {
    return {
      page: 'spread',
      cardId: null,
      spreadId: hash.slice('spread/'.length),
    }
  }

  if (NAV_KNOWN_PAGES.includes(hash)) {
    return {
      page: hash,
      cardId: null,
      spreadId: null,
    }
  }

  return {
    page: 'home',
    cardId: null,
    spreadId: null,
  }
}


function App() {

  const [page, setPage] = useState('home')
  const [selectedCard, setSelectedCard] = useState(null)
  const [selectedSpread, setSelectedSpread] = useState(null)
  const [timeTheme, setTimeTheme] = useState(getTimeTheme)

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('luna-tarot-favorites')
    return saved ? JSON.parse(saved) : []
  })


  useEffect(() => {
    localStorage.setItem(
      'luna-tarot-favorites',
      JSON.stringify(favorites)
    )
  }, [favorites])


  useEffect(() => {
    const syncTimeTheme = () => {
      setTimeTheme(getTimeTheme())
    }

    syncTimeTheme()
    const timer = window.setInterval(syncTimeTheme, 60 * 1000)

    return () => window.clearInterval(timer)
  }, [])


  useEffect(() => {
    document.documentElement.dataset.timeTheme = timeTheme
  }, [timeTheme])


  // 這個 session 裡，App 是否已經自己 push 過至少一筆瀏覽紀錄。
  // 用來判斷「← 返回」按鈕可不可以安全地呼叫瀏覽器上一頁。
  const hasNavigatedRef = useRef(false)


  const applyNavState = (state) => {

    const nextCard =
      state.cardId !== null && state.cardId !== undefined
        ? tarotCards.find(
            (card) => String(card.id) === String(state.cardId)
          )
        : null

    const nextSpread =
      state.spreadId !== null && state.spreadId !== undefined
        ? spreads.find(
            (spread) => spread.id === state.spreadId
          )
        : null

    if (state.page === 'card' && !nextCard) {
      setSelectedCard(null)
      setSelectedSpread(null)
      setPage('home')
      return
    }

    if (state.page === 'spread' && !nextSpread) {
      setSelectedCard(null)
      setSelectedSpread(null)
      setPage('home')
      return
    }

    setSelectedCard(nextCard)
    setSelectedSpread(nextSpread)
    setPage(state.page)
  }


  // 讓瀏覽器（含手機）的上一頁／下一頁可以正確切換畫面：
  // 進站時先把目前畫面同步成一筆瀏覽紀錄，
  // 之後每次瀏覽器觸發 popstate（按上一頁／下一頁）就照紀錄還原畫面。
  useEffect(() => {

    const initial = parseNavHash(window.location.hash)

    window.history.replaceState(
      {
        page: initial.page,
        cardId: initial.cardId,
        spreadId: initial.spreadId,
      },
      '',
      buildNavHash(initial.page, initial)
    )

    if (initial.page !== 'home') {
      applyNavState(initial)
    }

    const handlePopState = (event) => {
      const state =
        event.state || parseNavHash(window.location.hash)

      applyNavState(state)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])


  const navigate = (targetPage, options = {}) => {

    const { card = null, spread = null } = options

    setSelectedCard(card)
    setSelectedSpread(spread)
    setPage(targetPage)

    hasNavigatedRef.current = true

    window.history.pushState(
      {
        page: targetPage,
        cardId: card ? card.id : null,
        spreadId: spread ? spread.id : null,
      },
      '',
      buildNavHash(targetPage, {
        cardId: card ? card.id : null,
        spreadId: spread ? spread.id : null,
      })
    )
  }


  // 給頁面內「← 返回」按鈕用：
  // 如果這個 session 已經有 App 自己 push 的瀏覽紀錄，
  // 就用真正的瀏覽器上一頁（跟返回鍵行為一致）；
  // 如果是重新整理或直接進到內頁（沒有上一筆紀錄可退），
  // 才退回原本固定的目的地，避免直接離開網站。
  const goBack = (fallback) => {

    if (hasNavigatedRef.current) {
      window.history.back()
    } else {
      fallback()
    }
  }


  const openCard = (card) => {
    navigate('card', { card })
  }


  const goHome = () => {
    navigate('home')
  }


  const goLibrary = () => {
    navigate('library')
  }


  const goFavorites = () => {
    navigate('favorites')
  }


  const goHistory = () => {
    navigate('history')
  }


  const goSpreads = () => {
    navigate('spreads')
  }


  const goDaily = () => {
    navigate('daily')
  }


  const openSpread = (spread) => {
    navigate('spread', { spread })
  }


  const goStats = () => {
    navigate('stats')
  }


  const toggleFavorite = (cardId) => {

    setFavorites((current) => {

      if (current.includes(cardId)) {
        return current.filter(
          (id) => id !== cardId
        )
      }

      return [...current, cardId]
    })
  }


  const isFavorite = (cardId) => {
    return favorites.includes(cardId)
  }


  return (
    <div
  className={`app ${timeTheme}`}
  data-time-theme={timeTheme}
>



      <main className="main">

        {page === 'home' && (
          <Home
  onLibrary={goLibrary}
  onDaily={goDaily}
  onCard={openCard}
  onSpreads={goSpreads}
  onHistory={goHistory}
  onStats={goStats}
/>
        )}


        {page === 'library' && (
          <Library
            onCard={openCard}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}


        {page === 'favorites' && (
          <Favorites
            onCard={openCard}
            favorites={favorites}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}


        {page === 'history' && (
          <ReadingHistory />
        )}


        {page === 'card' && selectedCard && (
          <CardDetail
            card={selectedCard}
            onBack={() => goBack(goLibrary)}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
          />
        )}

{page === 'stats' && (
  <AccuracyStats />
)}

        {page === 'spreads' && (
          <SpreadLibrary
            onSpread={openSpread}
          />
        )}


        {page === 'spread' && selectedSpread && (
          <SpreadReading
            spread={selectedSpread}
            onBack={() => goBack(goSpreads)}
            onCard={openCard}
          />
        )}


        {page === 'daily' && (
          <Daily
            onCard={openCard}
          />
        )}
<nav className="mobile-bottom-nav">
  <button onClick={goHome}>
    <span>⌂</span>
    <small>首頁</small>
  </button>

  <button onClick={goLibrary}>
    <span>▣</span>
    <small>牌庫</small>
  </button>

  <button onClick={goSpreads}>
    <span>🔮</span>
    <small>占卜</small>
  </button>

  <button onClick={goHistory}>
    <span>▤</span>
    <small>我的</small>
  </button>
</nav>
      </main>

    </div>
  )
}


/* =====================================
   🏠 首頁
===================================== */

function Home({
  onLibrary,
  onDaily,
  onCard,
  onSpreads,
  onHistory,
  onStats,
}) {

  const previewCards = [
  tarotCards.find((card) => card.name === "太陽"),
  tarotCards.find((card) => card.name === "星星"),
  tarotCards.find((card) => card.name === "世界"),
  tarotCards.find((card) => card.name === "聖杯二"),
  tarotCards.find((card) => card.name === "錢幣國王"),
];
const today = new Date();
const todayKey =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const savedGuidanceId = localStorage.getItem(
  "luna-today-guidance-date"
);

let todayGuidanceCard;

if (savedGuidanceId === todayKey) {
  const savedCardId = localStorage.getItem(
    "luna-today-guidance-card"
  );

  todayGuidanceCard =
  todayGuidanceCard =
  tarotCards.find(
    (card) => String(card.id) === savedCardId
  ) ||
  tarotCards[Math.floor(Math.random() * tarotCards.length)];
} else {
  todayGuidanceCard =
    tarotCards[Math.floor(Math.random() * tarotCards.length)];

  localStorage.setItem(
    "luna-today-guidance-date",
    todayKey
  );

  localStorage.setItem(
    "luna-today-guidance-card",
    todayGuidanceCard.id
  );
}

const recentRecords = JSON.parse(
  localStorage.getItem("luna-tarot-reading-history") || "[]"
).slice(0, 4);
  return (
    <div className="page">

      <header className="topbar home-topbar-glass">

        <div>
          <div className="eyebrow">
            WELCOME BACK
          </div>

          <h1>
            {(() => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return "早安，來看看今天的指引吧 ✦";
  }

  if (hour >= 12 && hour < 18) {
    return "午安，來看看今天的指引吧 ✦";
  }

  return "晚安，來看看今天的指引吧 ✦";
})()}
          </h1>
        </div>


        <div className="topbar-date">
          <span>☾</span>
          Luna Tarot
        </div>

      </header>


      <section className="hero">

        <div className="hero-content">

          <div className="hero-small">
            YOUR PERSONAL TAROT SPACE
          </div>

          <h2 className="hero-title">
  <span>在未知之中，</span>
  <span className="hero-title-offset">與自己相遇。</span>
</h2>
<p className="hero-description">
  當不知道答案，讓牌替你照亮方向。
</p>
          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={onDaily}
            >
              ✦ 今日抽牌
            </button>


            <button
              className="secondary-button"
              onClick={onSpreads}
            >
              🔮 開始牌陣
            </button>

          </div>

        </div>


      <div className="hero-moon">
  <div className="big-moon">
    ☾
  </div>

  <div className="spark spark-1">
    ✦
  </div>

  <div className="spark spark-2">
    ✧
  </div>

  <div className="spark spark-3">
    ✦
  </div>
</div>

      </section>
<div className="home-quick-actions">

  <button className="home-quick-card" onClick={onDaily}>
    <div className="quick-icon">☾</div>
    <div className="quick-text">
      <strong>今日抽牌</strong>
      <span>看看今天的指引</span>
    </div>
    <span className="quick-arrow">›</span>
  </button>

  <button className="home-quick-card" onClick={onSpreads}>
    <div className="quick-icon">♢</div>
    <div className="quick-text">
      <strong>開始占卜</strong>
      <span>新的問題・新的答案</span>
    </div>
    <span className="quick-arrow">›</span>
  </button>

  <button className="home-quick-card" onClick={onLibrary}>
    <div className="quick-icon">♧</div>
    <div className="quick-text">
      <strong>塔羅牌庫</strong>
      <span>探索 78 張牌</span>
    </div>
    <span className="quick-arrow">›</span>
  </button>

  <button className="home-quick-card" onClick={onHistory}>
    <div className="quick-icon">▤</div>
    <div className="quick-text">
      <strong>我的紀錄</strong>
      <span>回顧過去的軌跡</span>
    </div>
    <span className="quick-arrow">›</span>
  </button>

</div>
<div className="home-middle-grid">

 <section className="home-guidance-card">
  <div className="eyebrow">TODAY'S GUIDANCE</div>

  <h2>今日的指引</h2>

  <div className="home-guidance-content">
    <img
      src={todayGuidanceCard.image}
      alt={todayGuidanceCard.name}
      className="home-guidance-image"
    />

    <div className="home-guidance-text">
      <div className="home-guidance-card-name">
        <strong>{todayGuidanceCard.name}</strong>
        <span>{todayGuidanceCard.english}</span>
      </div>

      <p className="home-guidance-keywords">
        {todayGuidanceCard.upright.join("・")}
      </p>

      <p>
        靜下來，想著今天最想知道的事情，
        <br />
        讓塔羅替你照亮方向。
      </p>
    </div>
  </div>
</section>

  <section className="home-recent-card">

    <div className="home-recent-header">
      <div>
        <div className="eyebrow">RECENT READINGS</div>
        <h2>最近的占卜紀錄</h2>
      </div>

      <button
        className="text-button"
        onClick={onHistory}
      >
        查看全部 →
      </button>
    </div>

    <div className="home-recent-list">

      {recentRecords.length === 0 ? (

        <p className="home-empty-record">
          還沒有占卜紀錄。
        </p>

      ) : (

        recentRecords.map((record) => (

          <div
            className="home-recent-item"
            key={record.id}
          >

            <span>
              {record.date
                ? new Date(record.date).toLocaleDateString(
                    "zh-TW",
                    {
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )
                : "--/--"}
            </span>

            <strong>
              {record.question || "未填寫問題"}
            </strong>

          </div>

        ))

      )}

    </div>
   

    <div className="home-recent-actions">

  <button
    className="home-recent-action"
    onClick={onStats}
  >
    <span className="home-recent-action-icon">📊</span>

    <div>
      <strong>準確度</strong>
      <span>查看占卜的準確度</span>
    </div>

  
    <span className="home-recent-action-arrow">→</span>
  </button>

  <button
    className="home-recent-action"
    onClick={onSpreads}
  >
    <span className="home-recent-action-icon">🔮</span>

    <div>
      <strong>牌陣</strong>
      <span>選擇適合的牌陣</span>
    </div>

    <span className="home-recent-action-arrow">→</span>
  </button>

</div>

  </section>

</div>
      <section className="section">

        <div className="section-heading">

          <div>

            <div className="eyebrow">
              EXPLORE
            </div>

            <h2>
              探索塔羅牌
            </h2>

          </div>


          <button
            className="text-button"
            onClick={onLibrary}
          >
            查看全部 →
          </button>

        </div>


        <div className="card-preview-row">

          {previewCards.map((card) => (

            <div
              className="preview-card"
              key={card.id}
              onClick={() => onCard(card)}
            >

            <div className="preview-image-wrap">
  <img
    src={card.image}
    alt={card.name}
    style={{ transform: "none", filter: "none" }}
  />
</div>

              <div className="preview-info">

                <span>
                  {card.number}
                </span>

                <strong>
                  {card.name}
                </strong>

                <small>
                  {card.english}
                </small>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}


/* =====================================
   🃏 牌庫
===================================== */

function Library({
  onCard,
  isFavorite,
  toggleFavorite,
}) {

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')


  const categories = [
    '全部',
    '大阿爾克那',
    '權杖',
    '聖杯',
    '寶劍',
    '錢幣',
  ]


  const filteredCards = tarotCards.filter((card) => {

    const keyword = search.trim().toLowerCase()


    const matchesSearch =
      keyword === '' ||
      card.name.toLowerCase().includes(keyword) ||
      card.english.toLowerCase().includes(keyword) ||
      String(card.number).toLowerCase().includes(keyword)


    const matchesCategory =
      category === '全部' ||
      card.group === category


    return (
      matchesSearch &&
      matchesCategory
    )
  })


  return (
    <div className="page">

      <header className="topbar library-topbar-glass">

        <div>

          <div className="eyebrow">
            TAROT LIBRARY
          </div>

          <h1>
            塔羅牌庫
          </h1>

        </div>


        <div className="library-count">
          共
          <strong>
            {filteredCards.length}
          </strong>
          張
        </div>

      </header>


      <div className="library-tools">

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="搜尋牌名，例如：皇帝、The Emperor..."
          />


          {search && (

            <button
              className="clear-search"
              onClick={() => setSearch('')}
            >
              ×
            </button>

          )}

        </div>


        <div className="category-tabs">

          {categories.map((item) => (

            <button
              key={item}
              className={
                category === item
                  ? 'category-tab active'
                  : 'category-tab'
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      <div className="library-intro">

        <p>
          {search
            ? `找到 ${filteredCards.length} 張相關牌卡`
            : '點擊任何一張牌，查看完整牌義與你的個人理解。'
          }
        </p>

      </div>


      {filteredCards.length > 0 ? (

        <div className="tarot-grid">

          {filteredCards.map((card) => (

            <TarotCard
              key={card.id}
              card={card}
              onCard={onCard}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />

          ))}

        </div>

      ) : (

        <div className="empty-library">

          <div>
            ☾
          </div>

          <h2>
            找不到這張牌
          </h2>

          <p>
            試試看其他牌名或英文名稱。
          </p>

          <button
            className="secondary-button"
            onClick={() => setSearch('')}
          >
            清除搜尋
          </button>

        </div>

      )}

    </div>
  )
}


/* =====================================
   ⭐ 收藏
===================================== */

function Favorites({
  onCard,
  favorites,
  isFavorite,
  toggleFavorite,
}) {

  const favoriteCards =
    tarotCards.filter(
      (card) =>
        favorites.includes(card.id)
    )


  return (
    <div className="page">

      <header className="topbar">

        <div>

          <div className="eyebrow">
            MY COLLECTION
          </div>

          <h1>
            我的收藏
          </h1>

        </div>


        <div className="library-count">
          收藏
          <strong>
            {favoriteCards.length}
          </strong>
          張
        </div>

      </header>


      {favoriteCards.length > 0 ? (

        <>

          <div className="library-intro">
            <p>
              這些是你特別留下來研究的牌。
            </p>
          </div>


          <div className="tarot-grid">

            {favoriteCards.map((card) => (

              <TarotCard
                key={card.id}
                card={card}
                onCard={onCard}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />

            ))}

          </div>

        </>

      ) : (

        <div className="empty-library">

          <div>
            ☆
          </div>

          <h2>
            還沒有收藏的牌
          </h2>

          <p>
            在牌庫裡點擊星星，就可以把喜歡的牌收藏起來。
          </p>

        </div>

      )}

    </div>
  )
}


/* =====================================
   🃏 單張牌
===================================== */

function TarotCard({
  card,
  onCard,
  isFavorite,
  toggleFavorite,
}) {

  const favorite =
    isFavorite(card.id)


  return (
    <div className="tarot-library-card">

      <div
        className="library-card-image"
        onClick={() => onCard(card)}
      >

        <img
          src={card.image}
          alt={card.name}
        />


        <div className="card-number">
          {card.number}
        </div>


        <button
          className={
            favorite
              ? 'favorite-button active'
              : 'favorite-button'
          }
          onClick={(event) => {

            event.stopPropagation()

            toggleFavorite(card.id)

          }}
        >
          {favorite ? '★' : '☆'}
        </button>


        <div className="card-hover">
          <span>
            查看牌義
          </span>
          →
        </div>

      </div>


      <div
        className="library-card-info"
        onClick={() => onCard(card)}
      >

        <div className="library-card-number">
          {card.number}
        </div>


        <div>

          <h3>
            {card.name}
          </h3>

          <span>
            {card.english}
          </span>

        </div>

      </div>

    </div>
  )
}


/* =====================================
   📖 詳細牌義
===================================== */

function CardDetail({
  card,
  onBack,
  isFavorite,
  toggleFavorite,
}) {

  const favorite =
    isFavorite(card.id)


  const noteStorageKey =
    `luna-tarot-note-history-${card.id}`


  const [noteHistory, setNoteHistory] =
    useState(() => {

      const saved =
        localStorage.getItem(
          noteStorageKey
        )


      if (!saved) {
        return []
      }


      try {
        return JSON.parse(saved)
      } catch {
        return []
      }

    })


  const [currentNote, setCurrentNote] =
    useState('')


  const saveNote = () => {

    const content =
      currentNote.trim()


    if (!content) {
      return
    }


    const now =
      new Date()


    const newNote = {

      id: Date.now(),

      content,

      date:
        now.toLocaleDateString(
          'zh-TW',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }
        ),

      time:
        now.toLocaleTimeString(
          'zh-TW',
          {
            hour: '2-digit',
            minute: '2-digit',
          }
        ),

    }


    const updatedHistory = [
      newNote,
      ...noteHistory,
    ]


    setNoteHistory(
      updatedHistory
    )


    localStorage.setItem(
      noteStorageKey,
      JSON.stringify(updatedHistory)
    )


    setCurrentNote('')
  }


  const loadOldNote =
    (note) => {

      setCurrentNote(
        note.content
      )

    }


  return (
    <div className="page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← 返回牌庫
      </button>


      <div className="card-detail">

        <div className="detail-image-section">

          <div className="detail-card-frame">

            <img
              src={card.image}
              alt={card.name}
            />

          </div>
 <div className="meaning-block">

            <div className="meaning-title">
              <span>☀</span>
              正位關鍵字
            </div>


            <div className="keyword-list">

              {card.upright.map(
                (word, index) => (
               <span
  className="keyword-tag"
  key={index}
  
>
  {word}
</span>
                )
              )}

            </div>

          </div>


          <div className="meaning-block reversed-block">

            <div className="meaning-title">
              <span>☾</span>
              逆位關鍵字
            </div>


            <div className="keyword-list">

              {card.reversed.map(
                (word, index) => (
                  <span key={index}>
                    {word}
                  </span>
                )
              )}

            </div>
         </div>
        

   </div>
    
        <div className="detail-content">

          <div className="eyebrow">
            CARD MEANING
          </div>


          <h2>
            {card.name}
          </h2>


          <p className="detail-description">
            這張牌在不同問題中，會呈現不同的訊息。
            你也可以在最下面留下自己的理解。
          </p>


         

        


          <div className="meaning-grid">

            <MeaningItem
              icon="♡"
              title="感情"
              text={card.love}
            />

            <MeaningItem
              icon="♧"
              title="工作"
              text={card.career}
            />

            <MeaningItem
              icon="◇"
              title="金錢"
              text={card.money}
            />

            <MeaningItem
              icon="♢"
              title="人際"
              text={card.relationship}
            />

            <MeaningItem
              icon="?"
              title="是非題"
              text={card.yesNo}
            />

            <MeaningItem
              icon="◷"
              title="時間"
              text={card.timing}
            />

          </div>


          <div className="personal-note">

            <div className="meaning-title">
              <span>✎</span>
              我的理解
            </div>


            <textarea
              value={currentNote}
              onChange={(e) =>
                setCurrentNote(
                  e.target.value
                )
              }
              placeholder="寫下你現在對這張牌的理解、實戰經驗或特殊記憶……"
            />


            <div className="note-actions">

              <button
                className="primary-button"
                onClick={saveNote}
              >
                ✦ 儲存這次修改
              </button>

            </div>


            {noteHistory.length > 0 && (

              <div className="note-history">

                <div className="note-history-title">

                  <span>
                    ◷
                  </span>

                  修改紀錄

                  <small>
                    {noteHistory.length} 筆
                  </small>

                </div>


                <div className="note-history-list">

                  {noteHistory.map(
                    (note, index) => (

                      <div
                        className="note-history-item"
                        key={note.id}
                        onClick={() =>
                          loadOldNote(note)
                        }
                      >

                        <div className="note-history-date">

                          <span>
                            {index === 0
                              ? '最新版本'
                              : `第 ${noteHistory.length - index} 次`
                            }
                          </span>


                          <time>
                            {note.date} {note.time}
                          </time>

                        </div>


                        <div className="note-history-content">
                          {note.content}
                        </div>


                        <div className="note-history-hint">
                          點擊載入此版本
                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}


/* =====================================
   🔮 牌陣首頁
===================================== */

function SpreadLibrary({
  onSpread
}) {

  const drawSpreads =
    spreads.filter(
      (spread) =>
        spread.mode === 'draw' &&
        !spread.private
    )


  const blankSpreads =
    spreads.filter(
      (spread) =>
        spread.mode === 'blank' &&
        !spread.private
    )


  const privateSpreads =
    spreads.filter(
      (spread) =>
        spread.private
    )


  const renderSpreadCards =
    (list) => (

      <div className="spread-grid">

        {list.map(
          (spread) => (

            <button
              key={spread.id}
              className="spread-card"
              onClick={() =>
                onSpread(spread)
              }
            >

              <div className="spread-icon">
                {spread.icon}
              </div>


              <div className="spread-card-content">

                <div className="spread-card-top">

                  <h2>
                    {spread.name}
                  </h2>


                  {spread.private && (
                    <span className="spread-private">
                      私人
                    </span>
                  )}

                </div>


                <p>
                  {spread.description}
                </p>


                <div className="spread-card-bottom">

                  <span>
                    {spread.count} 張牌
                  </span>

                  <span>
                    開始 →
                  </span>

                </div>

              </div>

            </button>

          )
        )}

      </div>

    )


  return (
    <div className="page">

      <header className="topbar spread-topbar-glass">

  <div className="spread-banner-left">

    <span
      className="spread-banner-icon"
      aria-hidden="true"
    >
      🔮
    </span>

    <div className="spread-banner-heading">

      <div className="eyebrow">
        TAROT SPREADS
      </div>

      <h1>
        牌陣
      </h1>

    </div>

  </div>

  <div
    className="spread-banner-divider"
    aria-hidden="true"
  />

  <p className="spread-intro-glass">
    選擇你想使用的牌陣。抽牌牌陣適合直接進行占卜；空白牌陣適合整理實體占卜紀錄。
  </p>

</header>


      <section className="spread-section">

        <div className="spread-section-heading spread-heading-glass">
          <div>

            <div className="eyebrow">
              DRAW
            </div>

            <h2>
              🔮 抽牌牌陣
            </h2>

          </div>

          <span>
            自動抽牌・正逆位
          </span>

        </div>


        {renderSpreadCards(drawSpreads)}

      </section>


      <section className="spread-section">

<div className="spread-section-heading spread-heading-glass">
          <div>

            <div className="eyebrow">
              BLANK
            </div>

            <h2>
              ✎ 空白牌陣
            </h2>

          </div>

          <span>
            自己填牌・保存紀錄
          </span>

        </div>


        {renderSpreadCards(blankSpreads)}

      </section>


      <section className="spread-section private-spread-section">

        <div className="spread-section-heading spread-heading-glass">

          <div>

            <div className="spread-section-heading spread-heading-glass">
              PRIVATE
            </div>

            <h2>
              🔒 私人牌陣
            </h2>

          </div>

          <span>
            只屬於你的牌陣
          </span>

        </div>


        {renderSpreadCards(privateSpreads)}

      </section>

    </div>
  )
}


/* =====================================
   🔮 牌陣抽牌／空白牌陣
===================================== */

function SpreadReading({
  spread,
  onBack,
  onCard,
}) {

  const storageKey =
    `luna-tarot-spread-${spread.id}`


  const createEmptySlots =
    () =>
      Array.from(
        {
          length: spread.count,
        },
        () => ({
          cardId: '',
          orientation: '正位',
          note: '',
        })
      )


  const [slots, setSlots] =
    useState(() => {

      const saved =
        localStorage.getItem(
          storageKey
        )


      if (!saved) {
        return createEmptySlots()
      }


      try {

        const parsed =
          JSON.parse(saved)


        if (
          Array.isArray(parsed) &&
          parsed.length === spread.count
        ) {
          return parsed
        }


        return createEmptySlots()

      } catch {

        return createEmptySlots()

      }

    })


  const [question, setQuestion] =
    useState('')


  const isBlank =
    spread.mode === 'blank'


  const getCardById =
    (cardId) => {

      return tarotCards.find(
        (card) =>
          String(card.id) ===
          String(cardId)
      )

    }


  const updateSlot =
    (
      index,
      field,
      value
    ) => {

      setSlots((current) => {

        const updated =
          [...current]


        updated[index] = {
          ...updated[index],
          [field]: value,
        }


        return updated
      })

    }


  const drawForPosition =
    (index) => {

      if (isBlank) {
        return
      }


      if (slots[index].cardId) {
        return
      }


      const usedIds =
        slots
          .filter(
            (slot) =>
              slot.cardId
          )
          .map(
            (slot) =>
              String(slot.cardId)
          )


      const availableCards =
        tarotCards.filter(
          (card) =>
            !usedIds.includes(
              String(card.id)
            )
        )


      if (!availableCards.length) {
        return
      }


      const randomCard =
        availableCards[
          Math.floor(
            Math.random() *
            availableCards.length
          )
        ]


      const updated =
        [...slots]


      updated[index] = {

        ...updated[index],

        cardId:
          randomCard.id,

        orientation:
          Math.random() < 0.5
            ? '正位'
            : '逆位',

      }


      setSlots(updated)

    }


  const saveSpread = () => {

    localStorage.setItem(
      storageKey,
      JSON.stringify(slots)
    )

  }


  const buildInterpretation =
    (
      card,
      orientation,
      positionName,
      positionDescription
    ) => {

      if (!card) {
        return ''
      }


      const keywords =
        orientation === '正位'
          ? card.upright
          : card.reversed


      const keywordText =
        keywords
          .slice(0, 3)
          .join('、')


      let text =
        `${positionName}出現${card.name}${orientation}，目前特別值得留意「${keywordText}」這幾個主題。`


      if (positionName.includes('現在')) {

        text +=
          '這代表目前的核心狀態，可以先觀察事情真正正在發生的部分。'

      } else if (positionName.includes('過去')) {

        text +=
          '這張牌比較像是在指出過去留下的背景、經驗或情緒，可能仍然影響現在。'

      } else if (
        positionName.includes('未來') ||
        positionName.includes('發展') ||
        positionName.includes('結果')
      ) {

        text +=
          '這比較像是一個發展方向，而不是百分之百固定的結果。'

      } else if (
        positionName.includes('心態') ||
        positionName.includes('占卜者') ||
        positionName.includes('被占卜者')
      ) {

        text +=
          '放在這個位置時，比較需要注意內在想法、態度與看事情的方式。'

      } else if (positionName.includes('感受')) {

        text +=
          '放在感受的位置，這裡更偏向內在情緒，而不一定等於已經做出的行動。'

      } else if (
        positionName.includes('付出')
      ) {

        text +=
          '放在付出的位置，需要觀察實際投入了什麼，而不只是嘴上說了什麼。'

      } else if (
        positionName.includes('顧慮') ||
        positionName.includes('阻礙')
      ) {

        text +=
          '這個位置代表需要留意的壓力、顧慮或卡住事情發展的因素。'

      } else if (
        positionName.includes('行動')
      ) {

        text +=
          '這個位置比較偏向實際行動，因此需要區分內心想法與最後做出的選擇。'

      } else if (
        positionName.includes('建議')
      ) {

        text +=
          '這裡比較適合作為參考方向，而不是絕對命令。'

      }


      if (positionDescription) {

        text +=
          ` 這個牌位主要是在看：${positionDescription}`

      }


      return text
    }


  const saveReading =
    () => {

      const records =
        JSON.parse(
          localStorage.getItem(
            'luna-tarot-reading-history'
          ) || '[]'
        )


      const newRecord = {

        id:
          Date.now(),

        date:
          new Date().toLocaleString(
            'zh-TW'
          ),

        question,

        spreadId:
          spread.id,

        spreadName:
          spread.name,

        mode:
          spread.mode,

        positions:
          spread.positions,

        positionDescriptions:
          spread.positionDescriptions || [],

        cards:
          slots.map(
            (slot) => {

              const card =
                getCardById(
                  slot.cardId
                )


              return {

                position:
                  card
                    ? card.name
                    : '',

                cardId:
                  card
                    ? card.id
                    : '',

                image:
                  card
                    ? card.image
                    : '',

                orientation:
                  slot.orientation,

                note:
                  slot.note || '',

              }

            }
          ),

      }


      localStorage.setItem(
        'luna-tarot-reading-history',
        JSON.stringify([
          newRecord,
          ...records,
        ])
      )

    }


  const handleSave =
    () => {

      saveSpread()
      saveReading()

      alert(
        isBlank
          ? '空白牌陣已儲存 ✦'
          : '這次占卜已儲存 ✦'
      )

    }


  const resetSpread =
    () => {

      setSlots(
        createEmptySlots()
      )

      setQuestion('')

      localStorage.removeItem(
        storageKey
      )

    }


  const allFilled =
    slots.every(
      (slot) =>
        slot.cardId
    )


  return (
    <div className="page">


      <button
        className="back-button"
        onClick={onBack}
      >
        ← 返回牌陣
      </button>


      <div className="spread-question-box">

        <label>
          ✦ 這次想問什麼？
        </label>


        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
          placeholder="例如：他目前怎麼看待我們的關係？"
        />

      </div>


      <div className="spread-reading-header">

        <div>

          <div className="eyebrow">
            {isBlank
              ? 'BLANK SPREAD'
              : 'TAROT SPREAD'
            }
          </div>


          <h1>
            {spread.icon} {spread.name}
          </h1>


          <p>
            {spread.description}
          </p>

        </div>


        <div className="spread-reading-actions">

          <button
            className="secondary-button"
            onClick={resetSpread}
          >
            清空
          </button>


          {isBlank && (

            <button
              className="primary-button"
              onClick={handleSave}
            >
              ✦ 儲存牌陣
            </button>

          )}


          {!isBlank &&
            allFilled && (

            <button
              className="primary-button"
              onClick={handleSave}
            >
              ✦ 儲存占卜
            </button>

          )}

        </div>

      </div>


      <div
        className={
          `spread-board spread-${spread.count} ` +
          (isBlank
            ? 'blank-spread-board'
            : '')
        }
      >


        {slots.map(
          (slot, index) => {

            const card =
              getCardById(
                slot.cardId
              )


            return (

              <div
                className={
                  `spread-position position-${index + 1}`
                }
                key={index}
              >


                <div className="spread-position-label">
                  {index + 1}
                </div>


                {isBlank ? (

                  <div className="blank-card-editor">


                    {card ? (

                      <div className="blank-card-preview">

                        <img
                          src={card.image}
                          alt={card.name}
                          onClick={() =>
                            onCard(card)
                          }
                        />

                      </div>

                    ) : (

                      <div className="blank-empty-card">

                        <span>
                          ✎
                        </span>

                        <small>
                          填入牌卡
                        </small>

                      </div>

                    )}


                    <select
                      value={slot.cardId}
                      onChange={(e) =>
                        updateSlot(
                          index,
                          'cardId',
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        選擇牌卡
                      </option>


                      {tarotCards.map(
                        (tarotCard) => (

                          <option
                            key={tarotCard.id}
                            value={tarotCard.id}
                          >
                            {tarotCard.name}
                          </option>

                        )
                      )}

                    </select>


                    <select
                      value={slot.orientation}
                      onChange={(e) =>
                        updateSlot(
                          index,
                          'orientation',
                          e.target.value
                        )
                      }
                    >

                      <option value="正位">
                        正位
                      </option>

                      <option value="逆位">
                        逆位
                      </option>

                    </select>

                  </div>

                ) : (

                  <button
                    className={
                      card
                        ? 'spread-card-slot drawn'
                        : 'spread-card-slot'
                    }
                    onClick={() =>
                      drawForPosition(
                        index
                      )
                    }
                  >

                    {card ? (

                      <img
                        src={card.image}
                        alt={card.name}
                      />

                    ) : (

                      <div className="spread-card-back">

                        <span>
                          ☾
                        </span>

                        <small>
                          點擊抽牌
                        </small>

                      </div>

                    )}

                  </button>

                )}


                <div className="spread-position-name">

                  <strong>
                    {spread.positions[index]}
                  </strong>


                  {spread.positionDescriptions && (

                    <small>
                      {
                        spread.positionDescriptions[index]
                      }
                    </small>

                  )}

                </div>


                {card && (

                  <div className="spread-drawn-info">

                    <strong>
                      {card.name}
                    </strong>


                    <span>
                      {slot.orientation}
                    </span>


                    <button
                      onClick={() =>
                        onCard(card)
                      }
                    >
                      查看牌義
                    </button>

                  </div>

                )}


                {isBlank && (

                  <textarea
                    className="blank-spread-note"
                    value={slot.note}
                    onChange={(e) =>
                      updateSlot(
                        index,
                        'note',
                        e.target.value
                      )
                    }
                    placeholder="我的解讀……"
                  />

                )}

              </div>

            )
          }
        )}

      </div>


      {!isBlank &&
        allFilled && (

        <section className="tarot-interpretation">

          <div className="eyebrow">
            LUNA TAROT INTERPRETATION
          </div>


          <h2>
            🌙 牌陣解析
          </h2>


          <div className="interpretation-list">

            {slots.map(
              (slot, index) => {

                const card =
                  getCardById(
                    slot.cardId
                  )


                if (!card) {
                  return null
                }


                const interpretation =
                  buildInterpretation(
                    card,
                    slot.orientation,
                    spread.positions[index],
                    spread.positionDescriptions
                      ? spread.positionDescriptions[index]
                      : ''
                  )


                return (

                  <div
                    className="interpretation-item"
                    key={index}
                  >

                    <div className="interpretation-heading">

                      <span className="interpretation-number">
                        {index + 1}
                      </span>


                      <div>

                        <strong>
                          {spread.positions[index]}
                        </strong>


                        <small>
                          {card.name}・{slot.orientation}
                        </small>

                      </div>

                    </div>


                    <p>
                      {interpretation}
                    </p>

                  </div>

                )
              }
            )}

          </div>


          <div className="overall-interpretation">

            <div className="meaning-title">

              <span>
                ✦
              </span>

              整體解析

            </div>


            <p>
              這個牌陣可以先從各個位置的訊息分開理解，
              再把不同牌面的共同主題串起來。
              建議特別留意重複出現的關鍵字、相似元素，
              以及正逆位之間形成的差異。
            </p>

          </div>

        </section>

      )}


      <div className="spread-reading-footer">

        {isBlank ? (

          <div className="spread-complete">

            <div className="eyebrow">
              BLANK SPREAD
            </div>

            <h2>
              把你的實體占卜帶進 Luna Tarot ✦
            </h2>

            <p>
              選擇牌卡、標記正逆位，再寫下你的解讀。
            </p>

          </div>

        ) : (

          <div className="spread-complete">

            <div className="eyebrow">
              DRAW READING
            </div>

            <h2>
              {allFilled
                ? '這個牌陣完成了 ✦'
                : '依序點擊牌位開始抽牌'
              }
            </h2>

            <p>
              完成後可以查看每張牌的完整牌義。
            </p>

          </div>

        )}

      </div>

    </div>
  )
}


/* =====================================
   📜 占卜紀錄
===================================== */

/* =====================================
   📜 占卜紀錄
===================================== */

function ReadingHistory() {

  const [records, setRecords] =
    useState(() => {

      const saved =
        localStorage.getItem(
          'luna-tarot-reading-history'
        )

      if (!saved) {
        return []
      }

      try {
        return JSON.parse(saved)
      } catch {
        return []
      }

    })


  const updateRecord = (
    id,
    field,
    value
  ) => {

    const updated =
      records.map((record) => {

        if (record.id !== id) {
          return record
        }

        return {
          ...record,
          [field]: value,
        }

      })


    setRecords(updated)


    localStorage.setItem(
      'luna-tarot-reading-history',
      JSON.stringify(updated)
    )

  }


  const deleteRecord = (id) => {

    const confirmed =
      window.confirm(
        '確定要刪除這筆占卜紀錄嗎？'
      )

    if (!confirmed) {
      return
    }


    const updated =
      records.filter(
        (record) =>
          record.id !== id
      )


    setRecords(updated)


    localStorage.setItem(
      'luna-tarot-reading-history',
      JSON.stringify(updated)
    )

  }


  if (!records.length) {

    return (
      <div className="page">

        <header className="topbar">

          <div>

            <div className="eyebrow">
              READING HISTORY
            </div>

            <h1>
              📜 占卜紀錄
            </h1>

          </div>

        </header>


        <div className="empty-library">

          <div>
            ☾
          </div>

          <h2>
            還沒有占卜紀錄
          </h2>

          <p>
            完成一次牌陣並儲存後，
            紀錄會出現在這裡。
          </p>

        </div>

      </div>
    )
  }


  return (
    <div className="page">

      <header className="topbar">

        <div>

          <div className="eyebrow">
            READING HISTORY
          </div>

          <h1>
            📜 占卜紀錄
          </h1>

        </div>


        <div className="library-count">

          共

          <strong>
            {records.length}
          </strong>

          次

        </div>

      </header>


      <div className="history-intro">

        <p className="reading-history-intro-glass">
          每一次占卜都會獨立保存。
          之後可以補上實際結果與準確度。
        </p>

      </div>


      <div className="reading-history-list">

        {records.map((record) => (

          <div
            className="reading-history-card"
            key={record.id}
          >

            {/* ---------- 標題 ---------- */}

<div>



  


<h2 className="reading-record-spread-glass">
  {record.spreadName}
</h2>

<div className="reading-history-date">
  {record.date}
</div>
  

 

</div>


            {/* ---------- 問題 ---------- */}

            {record.question && (

              <div className="reading-history-question">

                <span>
                  ✦ 占卜問題
                </span>

                <p>
                  {record.question}
                </p>

              </div>

            )}


            {/* ---------- 牌陣 ---------- */}

            <div className="reading-history-cards">

              {record.cards.map(
                (savedCard, index) => {

                  const card =
                    tarotCards.find(
                      (item) =>
                        String(item.id) ===
                        String(savedCard.cardId)
                    )


                  return (

                    <div
                      className="reading-history-item"
                      key={index}
                    >

                      <div className="reading-history-number">
                        {index + 1}
                      </div>


                      {card && (

                        <img
                          src={card.image}
                          alt={card.name}
                          className="reading-history-image"
                        />

                      )}


                      <div className="reading-history-position">

                        {
                          record.positions?.[index]
                        }

                      </div>


                      <div className="reading-history-card-name">

                        {
                          savedCard.position ||
                          '尚未填寫'
                        }

                      </div>


                      <span className="reading-history-orientation">
                        {
                          savedCard.orientation
                        }
                      </span>


                      {savedCard.note && (

                        <p>
                          {savedCard.note}
                        </p>

                      )}

                    </div>

                  )

                }
              )}

            </div>


            {/* ---------- 我的解讀 ---------- */}

            <div className="history-section">

              <div className="history-section-title">
                ✎ 我的解讀
              </div>

              <textarea
                value={
                  record.myInterpretation || ''
                }
                onChange={(e) =>
                  updateRecord(
                    record.id,
                    'myInterpretation',
                    e.target.value
                  )
                }
                placeholder="記下你當時對整個牌陣的解讀……"
              />

            </div>


            {/* ---------- 實際結果 ---------- */}

            <div className="history-section">

              <div className="history-section-title">
                ◎ 實際結果
              </div>

              <textarea
                value={
                  record.actualResult || ''
                }
                onChange={(e) =>
                  updateRecord(
                    record.id,
                    'actualResult',
                    e.target.value
                  )
                }
                placeholder="之後事情實際發生什麼？回來記在這裡。"
              />

            </div>


            {/* ---------- 準確度 ---------- */}

            <div className="history-section">

              <div className="history-section-title">
                ✦ 準確度
              </div>


              <div className="accuracy-buttons">

                {[
                  '很準',
                  '部分符合',
                  '不符合',
                  '尚未驗證',
                ].map((item) => (

                  <button
                    key={item}
                    className={
                      record.accuracy === item
                        ? 'accuracy-button active'
                        : 'accuracy-button'
                    }
                    onClick={() =>
                      updateRecord(
                        record.id,
                        'accuracy',
                        item
                      )
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>


            {/* ---------- 底部 ---------- */}

            <div className="reading-history-footer">

              <span>
                {record.cards.length} 張牌
              </span>


              <button
                className="history-delete-button"
                onClick={() =>
                  deleteRecord(record.id)
                }
              >
                刪除紀錄
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}


/* =====================================
   ☾ 今日抽牌
===================================== */

function Daily({
  onCard
}) {

  const [drawnCard, setDrawnCard] =
    useState(null)


  const drawCard =
    () => {

      const randomIndex =
        Math.floor(
          Math.random() *
          tarotCards.length
        )


      const card =
        tarotCards[randomIndex]


      setDrawnCard({

        ...card,

        orientation:
          Math.random() < 0.5
            ? '正位'
            : '逆位',

      })

    }


  return (
    <div className="page daily-page">

      <div className="daily-header">

        <div className="eyebrow">
          DAILY GUIDANCE
        </div>

        <h1 className="daily-guidance-title-glass">
  今日的指引
</h1>

        <p className="daily-guidance-intro-glass">
  靜下來，想著今天最想知道的事情。
  <br />
  然後交給塔羅。
</p>

      </div>


      {!drawnCard ? (

        <div className="draw-area">

          <div className="mystery-card">

            <div className="mystery-symbol">
              ☾
            </div>

            <div className="mystery-stars">
              ✦　✧　✦
            </div>

          </div>


          <button
            className="primary-button draw-button"
            onClick={drawCard}
          >
            ✦ 抽一張牌
          </button>

        </div>

      ) : (

        <div className="draw-result">

          <div className="result-card">

            <img
              src={drawnCard.image}
              alt={drawnCard.name}
            />

          </div>


          <div className="result-info">

            <div className="eyebrow">
              TODAY'S CARD
            </div>

            <h2>
              {drawnCard.name}
            </h2>

            <p>
              {drawnCard.english}
            </p>


            <div className="result-keywords">

              {(
                drawnCard.orientation ===
                '正位'
                  ? drawnCard.upright
                  : drawnCard.reversed
              ).map(
                (word, index) => (

                  <span key={index}>
                    {word}
                  </span>

                )
              )}

            </div>


            <div className="result-meaning">

              {drawnCard.orientation ===
              '正位'
                ? drawnCard.love
                : drawnCard.reversed.join('、')
              }

            </div>


            <div className="result-buttons">

              <button
                className="primary-button"
                onClick={() =>
                  onCard(drawnCard)
                }
              >
                查看完整牌義 →
              </button>


              <button
                className="secondary-button"
                onClick={drawCard}
              >
                再抽一次
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


/* =====================================
   小牌義區塊
===================================== */
/* =====================================
   📊 準確度統計
===================================== */

function AccuracyStats() {

  const [records] = useState(() => {

    const saved =
      localStorage.getItem(
        'luna-tarot-reading-history'
      )

    if (!saved) {
      return []
    }

    try {
      return JSON.parse(saved)
    } catch {
      return []
    }

  })


  const total =
    records.length


  const veryAccurate =
    records.filter(
      (record) =>
        record.accuracy === '很準'
    ).length


  const partial =
    records.filter(
      (record) =>
        record.accuracy === '部分符合'
    ).length


  const inaccurate =
    records.filter(
      (record) =>
        record.accuracy === '不符合'
    ).length


  const unverified =
    records.filter(
      (record) =>
        !record.accuracy ||
        record.accuracy === '尚未驗證'
    ).length


  const verified =
    veryAccurate +
    partial +
    inaccurate


  const matchRate =
    verified === 0
      ? 0
      : (
          (
            veryAccurate +
            partial * 0.5
          ) / verified
        ) * 100


  const rateText =
    matchRate.toFixed(1)


  return (
    <div className="page">

      <header className="topbar">

        <div>

          <div className="eyebrow">
            TAROT ACCURACY
          </div>

          <h1>
            📊 準確度統計
          </h1>

        </div>


        <div className="library-count">

          已驗證

          <strong>
            {verified}
          </strong>

          次

        </div>

      </header>


      {total === 0 ? (

        <div className="empty-library">

          <div>
            ✦
          </div>

          <h2>
            還沒有統計資料
          </h2>

          <p>
            完成幾次占卜並回填「準確度」後，
            這裡就會開始累積你的實戰資料。
          </p>

        </div>

      ) : (

        <>

          {/* -------------------------
              總體數據
          ------------------------- */}

          <section className="accuracy-dashboard">

            <div className="accuracy-main-card">

              <div className="eyebrow">
                CURRENT MATCH RATE
              </div>


              <div className="accuracy-big-number">
                {rateText}%
              </div>


              <p>
                目前以「很準＝100%、
                部分符合＝50%」計算。
              </p>

            </div>


            <div className="accuracy-stat-card">

              <span>
                📜
              </span>

              <strong>
                {total}
              </strong>

              <small>
                總占卜
              </small>

            </div>


            <div className="accuracy-stat-card">

              <span>
                ✓
              </span>

              <strong>
                {verified}
              </strong>

              <small>
                已驗證
              </small>

            </div>

          </section>


          {/* -------------------------
              狀態統計
          ------------------------- */}

          <section className="accuracy-breakdown">

            <div className="accuracy-breakdown-title">

              <div>

                <div className="eyebrow">
                  BREAKDOWN
                </div>

                <h2>
                  實戰結果
                </h2>

              </div>


              <span>
                尚未驗證 {unverified} 次
              </span>

            </div>


            <div className="accuracy-row">

              <div className="accuracy-row-label">
                <span>✦</span>
                很準
              </div>


              <div className="accuracy-bar">

                <div
                  className="accuracy-bar-fill very"
                  style={{
                    width:
                      total
                        ? `${(
                            veryAccurate /
                            total
                          ) * 100}%`
                        : '0%',
                  }}
                />

              </div>


              <strong>
                {veryAccurate}
              </strong>

            </div>


            <div className="accuracy-row">

              <div className="accuracy-row-label">
                <span>◐</span>
                部分符合
              </div>


              <div className="accuracy-bar">

                <div
                  className="accuracy-bar-fill partial"
                  style={{
                    width:
                      total
                        ? `${(
                            partial /
                            total
                          ) * 100}%`
                        : '0%',
                  }}
                />

              </div>


              <strong>
                {partial}
              </strong>

            </div>


            <div className="accuracy-row">

              <div className="accuracy-row-label">
                <span>×</span>
                不符合
              </div>


              <div className="accuracy-bar">

                <div
                  className="accuracy-bar-fill no"
                  style={{
                    width:
                      total
                        ? `${(
                            inaccurate /
                            total
                          ) * 100}%`
                        : '0%',
                  }}
                />

              </div>


              <strong>
                {inaccurate}
              </strong>

            </div>

          </section>


          {/* -------------------------
              牌陣統計
          ------------------------- */}

          <section className="accuracy-breakdown">

            <div className="accuracy-breakdown-title">

              <div>

                <div className="eyebrow">
                  SPREADS
                </div>

                <h2>
                  牌陣使用統計
                </h2>

              </div>

            </div>


            {Object.entries(
              records.reduce(
                (result, record) => {

                  const name =
                    record.spreadName ||
                    '未命名牌陣'


                  if (!result[name]) {
                    result[name] = 0
                  }


                  result[name] += 1

                  return result

                },
                {}
              )
            ).map(
              ([name, count]) => (

                <div
                  className="spread-stat-row"
                  key={name}
                >

                  <span>
                    {name}
                  </span>

                  <strong>
                    {count} 次
                  </strong>

                </div>

              )
            )}

          </section>

        </>

      )}

    </div>
  )
}

function MeaningItem({
  icon,
  title,
  text
}) {

  return (
    <div className="meaning-item">

      <div className="meaning-item-title">

        <span>
          {icon}
        </span>

        {title}

      </div>


      <p>
        {text}
      </p>

    </div>
  )
}


export default App
