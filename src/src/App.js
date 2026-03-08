import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#F7F3EE",
  surface: "#FFFFFF",
  surfaceAlt: "#F0EBE3",
  border: "#E5DDD4",
  slate: "#2D3748",
  slateLight: "#4A5568",
  muted: "#9AA5B4",
  sage: "#68896B",
  sageDark: "#4A6B4D",
  sageLight: "#EAF2EB",
  terra: "#C4714A",
  terraLight: "#FAF0EB",
  gold: "#D4A847",
  goldLight: "#FDF6E3",
  rose: "#C4677A",
  roseLight: "#FCEEF1",
  sky: "#4A7FA5",
  skyLight: "#EBF4FA",
};

const HABITS_DEFAULT = [
  { id: 1, name: "Alcohol", icon: "🍷", color: C.rose, light: C.roseLight, startDate: new Date(Date.now() - 47 * 86400000).toISOString() },
  { id: 2, name: "Social Media", icon: "📱", color: C.sky, light: C.skyLight, startDate: new Date(Date.now() - 12 * 86400000).toISOString() },
  { id: 3, name: "Smoking", icon: "🚬", color: C.terra, light: C.terraLight, startDate: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

const AFFIRMATIONS = [
  "Every day sober is a day reclaimed.",
  "You are stronger than any craving.",
  "Progress, not perfection.",
  "One day at a time — that's all it takes.",
  "Your future self is proud of you right now.",
  "Healing is not linear. Keep going.",
  "You chose yourself today. That matters.",
  "Small steps still move you forward.",
];

const JOURNAL_PROMPTS = [
  "What's one thing you're grateful for today?",
  "What triggered a craving and how did you handle it?",
  "Describe a moment today where you felt strong.",
  "What does your life look like 1 year from now?",
  "Who are you becoming through this journey?",
];

const COMMUNITY_POSTS = [
  { id: 1, user: "M.R.", avatar: "MR", days: 90, text: "90 days today 🌿 Never thought I'd see this number. If you're on day 1, I promise it gets lighter.", likes: 84, time: "2h ago", color: C.sage },
  { id: 2, user: "T.W.", avatar: "TW", days: 14, text: "Two weeks without scrolling social media. My anxiety is genuinely half of what it was. The silence felt weird at first, now it feels like home.", likes: 41, time: "5h ago", color: C.sky },
  { id: 3, user: "L.A.", avatar: "LA", days: 7, text: "One week. Had a really hard moment yesterday but I called my accountability partner instead. That's the whole game.", likes: 67, time: "1d ago", color: C.terra },
  { id: 4, user: "K.S.", avatar: "KS", days: 180, text: "6 months. I barely recognise the person I was. This community kept me going on the days I wanted to quit quitting.", likes: 132, time: "2d ago", color: C.rose },
];

const COACH_MSGS_DEFAULT = [
  { id: 1, from: "coach", text: "Good morning! How are you feeling today? Remember — cravings typically peak at 20 minutes and pass. You've got this. 💚", time: "8:02 AM" },
  { id: 2, from: "user", text: "Had a tough night. Almost gave in but I went for a walk instead.", time: "8:45 AM" },
  { id: 3, from: "coach", text: "That walk was everything. Choosing movement over a craving is a skill — and you just practiced it. How do you feel now vs last night?", time: "8:47 AM" },
  { id: 4, from: "user", text: "Honestly? Proud. Tired, but proud.", time: "8:50 AM" },
  { id: 5, from: "coach", text: "Hold onto that feeling. On a hard day, come back and read this. Proud is the truth. 🌱", time: "8:51 AM" },
];

const getDays = (startDate) => Math.floor((Date.now() - new Date(startDate)) / 86400000);
const nextMilestone = (days) => MILESTONES.find(m => m > days) || MILESTONES[MILESTONES.length - 1];

function Ring({ days, total, size = 80, color = C.sage, bg }) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(days / total, 1);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg || color + "22"} strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
    </svg>
  );
}

function Streak({ habit }) {
  const days = getDays(habit.startDate);
  const next = nextMilestone(days);
  return (
    <div style={{ background: habit.light, border: `1px solid ${habit.color}22`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Ring days={days} total={next} size={76} color={habit.color} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 9, fontFamily: "Syne,sans-serif", color: habit.color, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 700 }}>days</span>
          <span style={{ fontSize: 20, fontFamily: "Lora,serif", fontWeight: 700, color: habit.color, lineHeight: 1 }}>{days}</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 16 }}>{habit.icon}</span>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14, color: C.slate }}>{habit.name}</span>
        </div>
        <div style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: C.slateLight, marginBottom: 6 }}>
          Next: <strong style={{ color: habit.color }}>{next}d</strong> ({next - days} to go)
        </div>
        <div style={{ height: 5, background: habit.color + "22", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min((days / next) * 100, 100)}%`, background: habit.color, borderRadius: 99, transition: "width 1.2s ease" }} />
        </div>
      </div>
    </div>
  );
}

export default function ClearPath() {
  const [tab, setTab] = useState("home");
  const [habits, setHabits] = useState(HABITS_DEFAULT);
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState([
    { id: 1, date: "Mar 6", mood: "💚", text: "Woke up clear-headed for the first time in months. Made coffee, sat outside. Simple things feel big now." },
  ]);
  const [mood, setMood] = useState(null);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState(COACH_MSGS_DEFAULT);
  const [communityLikes, setCommunityLikes] = useState({});
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [todayChecked, setTodayChecked] = useState(false);
  const [isPremium] = useState(false);
  const chatEndRef = useRef(null);
  const promptIdx = useRef(Math.floor(Math.random() * JOURNAL_PROMPTS.length)).current;
  const affIdx = useRef(Math.floor(Math.random() * AFFIRMATIONS.length)).current;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), from: "user", text: chatMsg, time }]);
    setChatMsg("");
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "coach", text: "I hear you. Whatever you're feeling right now is valid. Tell me more — I'm here. 💚", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  };

  const saveJournal = () => {
    if (!journalText.trim() || !mood) return;
    setJournalEntries(prev => [{ id: Date.now(), date: "Today", mood, text: journalText }, ...prev]);
    setJournalText(""); setMood(null);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const opts = [
      { color: C.rose, light: C.roseLight, icon: "⭐" },
      { color: C.sky, light: C.skyLight, icon: "💧" },
      { color: C.terra, light: C.terraLight, icon: "🔥" },
      { color: C.gold, light: C.goldLight, icon: "🌸" },
    ];
    const o = opts[habits.length % opts.length];
    setHabits(prev => [...prev, { id: Date.now(), name: newHabitName, ...o, startDate: new Date().toISOString() }]);
    setNewHabitName(""); setShowAddHabit(false);
  };

  const totalDays = habits.reduce((s, h) => s + getDays(h.startDate), 0);

  const S = {
    app: { fontFamily: "Nunito,sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", paddingBottom: 80, position: "relative" },
    header: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    section: { padding: "18px 16px 0" },
    card: { background: C.surface, borderRadius: 14, padding: 18, border: `1px solid ${C.border}`, marginBottom: 14 },
    label: { fontFamily: "Syne,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.muted, marginBottom: 10, display: "block" },
    h2: { fontFamily: "Lora,serif", fontSize: 20, fontWeight: 700, color: C.slate, marginBottom: 4 },
    body: { fontSize: 14, color: C.slateLight, lineHeight: 1.6 },
    btn: { background: C.sage, color: "#fff", border: "none", borderRadius: 10, padding: "12px 18px", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em", cursor: "pointer" },
    btnGhost: { background: "transparent", border: `1.5px solid ${C.border}`, color: C.slateLight, borderRadius: 10, padding: "10px 16px", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" },
    input: { width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", fontFamily: "Nunito,sans-serif", fontSize: 14, color: C.slate, outline: "none", resize: "none" },
    navBar: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 100 },
    tag: (color, bg) => ({ background: bg, color, borderRadius: 99, padding: "3px 9px", fontFamily: "Syne,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", display: "inline-block" }),
  };

  const TABS = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "journal", icon: "📓", label: "Journal" },
    { id: "community", icon: "🌿", label: "Community" },
    { id: "coach", icon: "💬", label: "Coach" },
  ];

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,500&family=Syne:wght@600;700;800&family=Nunito:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        textarea:focus,input:focus{border-color:${C.sage}!important;box-shadow:0 0 0 3px ${C.sageLight};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        .fu{animation:fadeUp 0.45s ease both}
        .pi{animation:popIn 0.28s ease both}
        .mood-btn{font-size:24px;background:none;border:none;cursor:pointer;transition:transform 0.15s;padding:4px;}
        .mood-btn:hover{transform:scale(1.18)}
        .mood-btn.sel{transform:scale(1.22);filter:drop-shadow(0 2px 5px rgba(0,0,0,0.14))}
        .post-card:hover{border-color:${C.sage}44!important}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.border}}
      `}</style>

      {/* HEADER */}
      <div style={S.header}>
        <div style={{ fontFamily: "Lora,serif", fontWeight: 700, fontSize: 19, color: C.sage }}>ClearPath 🌿</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ ...S.tag(C.gold, C.goldLight), cursor: "pointer", padding: "4px 10px" }}>✦ Premium</div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.sage},${C.sageDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 12 }}>Y</div>
        </div>
      </div>

      {/* ── HOME ── */}
      {tab === "home" && (
        <div className="fu">
          <div style={{ background: `linear-gradient(135deg,${C.sage},${C.sageDark})`, padding: "22px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -16, top: -16, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontFamily: "Syne,sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)", marginBottom: 7, textTransform: "uppercase" }}>Today's Reminder</div>
            <div style={{ fontFamily: "Lora,serif", fontSize: 17, color: "#fff", lineHeight: 1.5, fontStyle: "italic" }}>"{AFFIRMATIONS[affIdx]}"</div>
          </div>

          <div style={S.section}>
            {/* Check-in */}
            <div style={{ ...S.card, background: todayChecked ? C.sageLight : C.surface, border: `1px solid ${todayChecked ? C.sage + "44" : C.border}` }}>
              <span style={S.label}>Daily Check-in</span>
              {!todayChecked ? (
                <>
                  <div style={{ fontFamily: "Lora,serif", fontSize: 16, fontWeight: 700, color: C.slate, marginBottom: 14 }}>How are you showing up today?</div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, justifyContent: "center" }}>
                    {["😔","😐","🙂","😊","🌟"].map(e => (
                      <button key={e} className={`mood-btn${mood===e?" sel":""}`} style={{ opacity: mood && mood!==e ? 0.38 : 1 }} onClick={() => setMood(e)}>{e}</button>
                    ))}
                  </div>
                  <button style={{ ...S.btn, width: "100%", opacity: mood ? 1 : 0.5 }} onClick={() => mood && setTodayChecked(true)}>✓ Mark Today as Clear</button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "6px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 7 }}>🌿</div>
                  <div style={{ fontFamily: "Lora,serif", fontSize: 16, color: C.sage, fontWeight: 700 }}>Today is marked clear.</div>
                  <div style={{ ...S.body, marginTop: 3, fontSize: 13 }}>See you tomorrow. Keep going.</div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[{ val: totalDays, label: "Total Days", color: C.sage }, { val: habits.length, label: "Habits", color: C.terra }].map(s => (
                <div key={s.label} style={{ ...S.card, textAlign: "center", marginBottom: 0 }}>
                  <div style={{ fontFamily: "Lora,serif", fontSize: 34, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ ...S.label, marginBottom: 0, textAlign: "center" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Streaks */}
            <div style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={S.label}>Your Streaks</span>
                <button style={{ ...S.btnGhost, padding: "5px 11px", fontSize: 11 }} onClick={() => setShowAddHabit(true)}>+ Add Habit</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {habits.map(h => <Streak key={h.id} habit={h} />)}
              </div>
            </div>

            {/* Milestones */}
            <div style={S.card}>
              <span style={S.label}>Milestone Path — {habits[0]?.name}</span>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {MILESTONES.map(m => {
                  const days = getDays(habits[0]?.startDate || new Date());
                  const done = days >= m, isNext = m === nextMilestone(days);
                  return (
                    <div key={m} style={{ flex: 1, minWidth: 40, padding: "7px 3px", textAlign: "center", borderRadius: 9, background: done ? C.sageLight : isNext ? C.goldLight : C.surfaceAlt, border: `1.5px solid ${done ? C.sage : isNext ? C.gold : C.border}`, transition: "all 0.3s" }}>
                      <div style={{ fontSize: 10, marginBottom: 1, color: done ? C.sage : isNext ? C.gold : C.muted }}>{done ? "✓" : isNext ? "→" : ""}</div>
                      <div style={{ fontFamily: "Syne,sans-serif", fontSize: 10, fontWeight: 700, color: done ? C.sage : isNext ? C.gold : C.muted }}>{m}d</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upsell */}
            {!isPremium && (
              <div style={{ background: `linear-gradient(135deg,${C.goldLight},#FFF9F0)`, border: `1px solid ${C.gold}44`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>✦</span>
                  <div>
                    <div style={{ fontFamily: "Lora,serif", fontSize: 15, fontWeight: 700, color: C.slate, marginBottom: 3 }}>Unlock Premium</div>
                    <div style={{ ...S.body, fontSize: 12, marginBottom: 10 }}>Unlimited coach messaging, guided meditations, detailed analytics, and ad-free experience.</div>
                    <button style={{ ...S.btn, background: C.gold, fontSize: 12, padding: "9px 16px" }}>See Plans — from $9/mo</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── JOURNAL ── */}
      {tab === "journal" && (
        <div className="fu" style={S.section}>
          <div style={{ marginBottom: 18, paddingTop: 4 }}>
            <div style={S.h2}>Your Journal</div>
            <div style={{ ...S.body, fontSize: 13 }}>Private reflections. Just for you.</div>
          </div>
          <div style={S.card}>
            <span style={S.label}>New Entry — {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span>
            <div style={{ background: C.sageLight, borderRadius: 9, padding: "10px 13px", marginBottom: 12, borderLeft: `3px solid ${C.sage}` }}>
              <div style={{ fontFamily: "Lora,serif", fontSize: 13, color: C.sageDark, fontStyle: "italic" }}>"{JOURNAL_PROMPTS[promptIdx]}"</div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
              {["😔","😐","🙂","😊","🌟"].map(e => (
                <button key={e} className={`mood-btn${mood===e?" sel":""}`} style={{ opacity: mood && mood!==e ? 0.38 : 1 }} onClick={() => setMood(e)}>{e}</button>
              ))}
            </div>
            <textarea style={{ ...S.input, minHeight: 100, marginBottom: 10 }} placeholder="Write freely. This is your space..." value={journalText} onChange={e => setJournalText(e.target.value)} />
            <button style={{ ...S.btn, width: "100%", opacity: journalText && mood ? 1 : 0.5 }} onClick={saveJournal}>Save Entry</button>
          </div>
          <span style={S.label}>Past Entries</span>
          {journalEntries.map(entry => (
            <div key={entry.id} className="fu" style={{ ...S.card, borderLeft: `3px solid ${C.sage}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontSize: 11, color: C.muted, fontWeight: 700 }}>{entry.date}</span>
                <span style={{ fontSize: 16 }}>{entry.mood}</span>
              </div>
              <div style={{ ...S.body, fontSize: 13 }}>{entry.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── COMMUNITY ── */}
      {tab === "community" && (
        <div className="fu" style={S.section}>
          <div style={{ marginBottom: 18, paddingTop: 4 }}>
            <div style={S.h2}>Community 🌿</div>
            <div style={{ ...S.body, fontSize: 13 }}>Real people. Real journeys. No judgment.</div>
          </div>
          <div style={S.card}>
            <textarea style={{ ...S.input, minHeight: 68 }} placeholder="Share a win, a struggle, or just check in..." />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 9 }}>
              <button style={{ ...S.btn, fontSize: 12, padding: "9px 16px" }}>Post</button>
            </div>
          </div>
          {COMMUNITY_POSTS.map(post => (
            <div key={post.id} className="post-card" style={{ ...S.card, transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${post.color},${post.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 11, color: "#fff" }}>{post.avatar}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, color: C.slate }}>{post.user}</div>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <span style={{ ...S.tag(post.color, post.color + "18"), fontSize: 9 }}>{post.days} days</span>
                    <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 11, color: C.muted }}>{post.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ ...S.body, fontSize: 13, marginBottom: 12 }}>{post.text}</div>
              <div style={{ display: "flex", gap: 14 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: communityLikes[post.id] ? C.rose : C.muted, fontFamily: "Syne,sans-serif", fontSize: 11, fontWeight: 700, transition: "color 0.2s" }}
                  onClick={() => setCommunityLikes(p => ({ ...p, [post.id]: !p[post.id] }))}>
                  ♥ {post.likes + (communityLikes[post.id] ? 1 : 0)}
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontFamily: "Syne,sans-serif", fontSize: 11, fontWeight: 700 }}>💬 Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COACH ── */}
      {tab === "coach" && (
        <div className="fu" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 126px)" }}>
          <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.sage},${C.sageDark})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18 }}>🌱</span>
              </div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 9, height: 9, borderRadius: "50%", background: "#4ade80", border: `2px solid ${C.surface}` }} />
            </div>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13, color: C.slate }}>Your Coach</div>
              <div style={{ fontFamily: "Nunito,sans-serif", fontSize: 11, color: C.sage }}>● Online — replies in minutes</div>
            </div>
            {!isPremium && <div style={{ marginLeft: "auto", ...S.tag(C.gold, C.goldLight) }}>Premium</div>}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map(msg => (
              <div key={msg.id} className="pi" style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                {msg.from === "coach" && (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.sage},${C.sageDark})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 7, flexShrink: 0, alignSelf: "flex-end" }}>
                    <span style={{ fontSize: 11 }}>🌱</span>
                  </div>
                )}
                <div style={{ maxWidth: "74%", background: msg.from === "user" ? C.sage : C.surface, border: `1px solid ${msg.from === "user" ? "transparent" : C.border}`, color: msg.from === "user" ? "#fff" : C.slate, borderRadius: msg.from === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", padding: "9px 13px" }}>
                  <div style={{ fontFamily: "Nunito,sans-serif", fontSize: 13, lineHeight: 1.55 }}>{msg.text}</div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: 9, color: msg.from === "user" ? "rgba(255,255,255,0.55)" : C.muted, marginTop: 3, textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!isPremium ? (
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.surface, textAlign: "center" }}>
              <div style={{ ...S.body, fontSize: 13, marginBottom: 9 }}>Coach messaging is a Premium feature</div>
              <button style={{ ...S.btn, background: C.gold, fontSize: 12, padding: "9px 18px" }}>Unlock for $9/mo →</button>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.surface, display: "flex", gap: 8 }}>
              <input type="text" style={{ ...S.input, flex: 1, padding: "9px 12px" }} placeholder="Message your coach..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
              <button style={{ ...S.btn, padding: "9px 14px", flexShrink: 0 }} onClick={sendMsg}>↑</button>
            </div>
          )}
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowAddHabit(false)}>
          <div className="pi" style={{ background: C.surface, borderRadius: "18px 18px 0 0", padding: 24, width: "100%", maxWidth: 430 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "Lora,serif", fontSize: 17, fontWeight: 700, color: C.slate, marginBottom: 14 }}>Track a New Habit</div>
            <input type="text" style={{ ...S.input, marginBottom: 12 }} placeholder="e.g. Gambling, Sugar, Vaping..." value={newHabitName} onChange={e => setNewHabitName(e.target.value)} onKeyDown={e => e.key === "Enter" && addHabit()} />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.btn, flex: 1 }} onClick={addHabit}>Start Tracking</button>
              <button style={{ ...S.btnGhost, flex: 1 }} onClick={() => setShowAddHabit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <div style={S.navBar}>
        {TABS.map(t => (
          <button key={t.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "9px 0", background: "none", border: "none", cursor: "pointer" }} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 19, opacity: tab === t.id ? 1 : 0.38 }}>{t.icon}</span>
            <span style={{ fontFamily: "Syne,sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: tab === t.id ? C.sage : C.muted }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}