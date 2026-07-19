import React, { useState, useEffect } from "react";

// ── Your personal targets (20M, 174cm, 65kg, mostly sitting, training daily) ──
const TARGETS = { kcal: 2700, protein: 120, carbs: 340, fat: 65 };

// Tap-to-log preset meals from your plan. kcal / protein(g) / carbs(g) / fat(g)
const MEALS = [
  { id: "brk", name: "Breakfast", detail: "3 eggs + 80g oats + banana + milk", kcal: 600, p: 30, c: 70, f: 22 },
  { id: "lun", name: "Lunch", detail: "150g chicken + 1.5c rice + veg", kcal: 650, p: 40, c: 85, f: 14 },
  { id: "snk", name: "Snack", detail: "Greek yogurt + nuts + fruit", kcal: 400, p: 20, c: 35, f: 20 },
  { id: "din", name: "Dinner", detail: "150g beef/fish + potatoes + veg", kcal: 700, p: 35, c: 75, f: 25 },
  { id: "bed", name: "Before bed", detail: "Milk or cottage cheese", kcal: 200, p: 15, c: 15, f: 8 },
  { id: "shk", name: "Protein shake", detail: "1 scoop whey + water", kcal: 130, p: 25, c: 3, f: 2 },
];

// Your weekly split
const SPLIT = [
  { day: "Push", detail: "Floor press, OHP, lateral raises, tricep ext, push-ups", exercises: [
    { name: "Floor press", target: "Chest · triceps", sets: "3–4 × 15–20", how: "Lie on your back on the floor, a dumbbell in each hand at chest level. Press them straight up till arms lock, lower slowly. The floor stops your elbows and protects your shoulders." },
    { name: "Overhead press (OHP)", target: "Shoulders", sets: "3–4 × 15–20", how: "Standing or seated, dumbbells at shoulder height. Press straight up overhead until arms are straight, lower under control. Don't arch your back." },
    { name: "Lateral raises", target: "Side delts", sets: "3 × 15–20", how: "Arms at your sides, raise the dumbbells out sideways like wings until level with your shoulders. Lower slowly — this one is all about control, not weight." },
    { name: "Tricep extension", target: "Back of arm", sets: "3 × 15–20", how: "Hold one dumbbell overhead with both hands. Bend your elbows to lower it behind your head, then straighten back up. Keep elbows pointing forward." },
    { name: "Push-ups", target: "Chest · triceps", sets: "3 × max", how: "Hands under shoulders, body in a straight line. Lower your chest toward the floor, push back up. Go to knees if needed." },
  ] },
  { day: "Legs", detail: "Goblet squats, Bulgarian splits, RDLs, lunges, calves", exercises: [
    { name: "Goblet squat", target: "Quads · glutes", sets: "3–4 × 15–25", how: "Hold one dumbbell against your chest. Squat down — hips back, knees pushed out, chest up — until thighs are about parallel, then stand." },
    { name: "Bulgarian split squat", target: "Quads · glutes", sets: "3 × 12–15/leg", how: "Rest one foot behind you on a chair or couch. Lower into a lunge on the front leg, then drive up. Loads one leg at a time — ideal for light dumbbells." },
    { name: "Romanian deadlift (RDL)", target: "Hamstrings · glutes", sets: "3–4 × 15–20", how: "Dumbbells in front of thighs, slight knee bend. Push your hips back and lower the weights down your legs until you feel a hamstring stretch, then drive hips forward to stand. Keep your back flat, never rounded." },
    { name: "Walking lunges", target: "Legs · glutes", sets: "3 × 12/leg", how: "Step forward, drop the back knee toward the floor, push up and step through with the other leg." },
    { name: "Calf raises", target: "Calves", sets: "3 × 20–25", how: "Stand tall, rise onto your toes as high as you can, pause, lower slowly. Hold dumbbells for extra load." },
  ] },
  { day: "Endurance", detail: "25–40 min jog / cycle / circuit", exercises: [
    { name: "Steady cardio", target: "Endurance · heart", sets: "25–40 min", how: "Brisk jog, cycle, or a fast dumbbell circuit. Keep it easy enough to hold a conversation — that's the right intensity for building an aerobic base." },
  ] },
  { day: "Pull", detail: "One-arm rows, curls, rear delts, shrugs, chin-ups", exercises: [
    { name: "One-arm row", target: "Back", sets: "3–4 × 15–20/arm", how: "Put one hand and knee on a chair or bed for support. The other hand holds a dumbbell hanging down. Pull it up to your ribs — elbow goes back, not out — and lower slowly." },
    { name: "Bicep curl", target: "Biceps", sets: "3 × 15–20", how: "Arms at your sides, curl the dumbbells up toward your shoulders, lower slowly. No swinging — let the muscle do the work." },
    { name: "Rear-delt raise", target: "Rear delts · posture", sets: "3 × 15–20", how: "Bend forward at the hips, arms hanging down. Raise the dumbbells out to the sides, squeezing your upper back. Great for posture." },
    { name: "Shrugs", target: "Traps", sets: "3 × 15–20", how: "Dumbbells at your sides. Shrug your shoulders straight up toward your ears, pause, lower. Don't roll them." },
    { name: "Chin-ups", target: "Back · biceps", sets: "3 × max", how: "If you have a bar: hang with palms facing you and pull your chin over it. Your best back builder since bodyweight beats 4 kg. No bar? Do extra rows instead." },
  ] },
  { day: "Legs + core", detail: "Squats, step-ups, single-leg RDLs, planks, leg raises", exercises: [
    { name: "Goblet squat", target: "Quads · glutes", sets: "3–4 × 15–25", how: "Dumbbell at your chest, squat down with hips back and chest up until thighs parallel, then stand." },
    { name: "Step-ups", target: "Legs · glutes", sets: "3 × 12/leg", how: "Step up onto a sturdy chair or bench with one leg, drive through the heel, step down under control. One leg at a time." },
    { name: "Single-leg RDL", target: "Hamstrings · balance", sets: "3 × 10–12/leg", how: "Balance on one leg, hinge forward lowering the dumbbell as your back leg rises behind you, then return. Slow and controlled." },
    { name: "Plank", target: "Core", sets: "3 × 30–60 sec", how: "Forearms and toes on the floor, body in a straight line. Squeeze your core and hold — don't let your hips sag." },
    { name: "Leg raises", target: "Lower abs", sets: "3 × 12–15", how: "Lie on your back, legs straight. Raise them to vertical, lower slowly without letting your feet touch the floor." },
    { name: "Hollow hold", target: "Deep core", sets: "3 × 20–30 sec", how: "Lie on your back, press your lower back into the floor, lift shoulders and legs slightly off the ground, hold." },
  ] },
  { day: "Endurance", detail: "Longer easy walk / sport / mobility", exercises: [
    { name: "Active recovery", target: "Recovery · mobility", sets: "30–60 min", how: "A longer easy walk, a sport you enjoy, a swim, or mobility work. Keep it relaxed — this helps your muscles recover, not exhaust them." },
  ] },
  { day: "Rest", detail: "Full rest or gentle walk", exercises: [
    { name: "Rest day", target: "Growth happens now", sets: "—", how: "This is when muscle actually gets built. Take it fully off, or do a gentle walk. Prioritize sleep and hitting your protein." },
  ] },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const load = async (key, fallback) => {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
};
const save = async (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const C = {
  bg: "#0F1417", card: "#181F23", line: "#252E33", ink: "#EAF2F0",
  dim: "#8B9A99", lime: "#B8E62D", amber: "#E6A72D", blue: "#4DB2C4",
};

export default function App() {
  const [tab, setTab] = useState("food");
  const [logged, setLogged] = useState([]);      // meal ids eaten today
  const [workouts, setWorkouts] = useState({});   // { "2026-07-19": true }
  const [weights, setWeights] = useState([]);     // [{date, kg}]
  const [wInput, setWInput] = useState("");
  const [ready, setReady] = useState(false);

  const today = todayKey();

  useEffect(() => {
    (async () => {
      const day = await load(`food:${today}`, []);
      setLogged(day);
      setWorkouts(await load("workouts", {}));
      setWeights(await load("weights", []));
      setReady(true);
    })();
  }, []);

  const totals = logged.reduce((a, id) => {
    const m = MEALS.find((x) => x.id === id);
    if (m) { a.kcal += m.kcal; a.p += m.p; a.c += m.c; a.f += m.f; }
    return a;
  }, { kcal: 0, p: 0, c: 0, f: 0 });

  const logMeal = (id) => { const n = [...logged, id]; setLogged(n); save(`food:${today}`, n); };
  const undo = (i) => { const n = logged.filter((_, k) => k !== i); setLogged(n); save(`food:${today}`, n); };
  const toggleWorkout = () => { const n = { ...workouts, [today]: !workouts[today] }; setWorkouts(n); save("workouts", n); };
  const addWeight = () => {
    const kg = parseFloat(wInput);
    if (!kg) return;
    const n = [...weights.filter((w) => w.date !== today), { date: today, kg }].sort((a, b) => a.date.localeCompare(b.date));
    setWeights(n); save("weights", n); setWInput("");
  };

  // streak of consecutive days worked out ending today/yesterday
  const streak = (() => {
    let s = 0; let d = new Date();
    for (;;) {
      const k = d.toISOString().slice(0, 10);
      if (workouts[k]) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  const dayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  const todayPlan = SPLIT[dayIdx];

  if (!ready) return <div style={{ color: C.dim, padding: 40, fontFamily: "system-ui" }}>Loading…</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.ink, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "20px 16px 90px", maxWidth: 460, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, letterSpacing: 2, color: C.dim, textTransform: "uppercase" }}>Lean bulk · 65kg</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "2px 0 0" }}>Daily Tracker</h1>
      </div>

      {tab === "food" && (
        <>
          <Ring totals={totals} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "16px 0" }}>
            <Macro label="Protein" val={totals.p} tgt={TARGETS.protein} unit="g" color={C.lime} />
            <Macro label="Carbs" val={totals.c} tgt={TARGETS.carbs} unit="g" color={C.blue} />
            <Macro label="Fat" val={totals.f} tgt={TARGETS.fat} unit="g" color={C.amber} />
          </div>

          {logged.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Label>Eaten today</Label>
              {logged.map((id, i) => {
                const m = MEALS.find((x) => x.id === id);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.card, borderRadius: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>{m.name} · {m.kcal} kcal</span>
                    <button onClick={() => undo(i)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 13 }}>remove</button>
                  </div>
                );
              })}
            </div>
          )}

          <Label>Tap to log</Label>
          {MEALS.map((m) => (
            <button key={m.id} onClick={() => logMeal(m.id)} style={{ display: "block", width: "100%", textAlign: "left", background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, cursor: "pointer", color: C.ink }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                <span style={{ color: C.lime, fontSize: 14, fontWeight: 600 }}>+{m.kcal}</span>
              </div>
              <div style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>{m.detail} · {m.p}g protein</div>
            </button>
          ))}
        </>
      )}

      {tab === "train" && (
        <>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <Label>Today · {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayIdx]}</Label>
            <div style={{ fontSize: 22, fontWeight: 700, margin: "4px 0" }}>{todayPlan.day}</div>
            <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.5 }}>{todayPlan.detail}</div>
            <button onClick={toggleWorkout} style={{ marginTop: 14, width: "100%", padding: "12px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, background: workouts[today] ? C.lime : C.line, color: workouts[today] ? "#0F1417" : C.ink }}>
              {workouts[today] ? "✓ Done today" : "Mark as done"}
            </button>
          </div>

          <Label>How to do today's moves</Label>
          <div style={{ marginBottom: 16 }}>
            {todayPlan.exercises.map((ex, i) => (
              <ExerciseCard key={i} ex={ex} />
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <Stat big={streak} label="day streak" color={C.lime} />
            <Stat big={Object.values(workouts).filter(Boolean).length} label="total sessions" color={C.blue} />
          </div>

          <Label>Your week</Label>
          {SPLIT.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: i === dayIdx ? C.card : "transparent", border: `1px solid ${i === dayIdx ? C.line : "transparent"}`, borderRadius: 8, marginBottom: 4 }}>
              <span style={{ color: C.dim, fontSize: 12, width: 30, paddingTop: 2 }}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.day}</div>
                <div style={{ color: C.dim, fontSize: 12 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "weight" && (
        <>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <Label>Log today's weight</Label>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input value={wInput} onChange={(e) => setWInput(e.target.value)} placeholder="65.0" inputMode="decimal" style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px", color: C.ink, fontSize: 16 }} />
              <button onClick={addWeight} style={{ padding: "0 22px", borderRadius: 8, border: "none", background: C.lime, color: "#0F1417", fontWeight: 700, cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ color: C.dim, fontSize: 12, marginTop: 8 }}>Target: +0.2–0.4 kg/week. Faster = trim 200 kcal.</div>
          </div>

          {weights.length > 0 ? (
            <>
              <Trend weights={weights} />
              <Label>History</Label>
              {[...weights].reverse().map((w, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: C.card, borderRadius: 8, marginBottom: 4, fontSize: 14 }}>
                  <span style={{ color: C.dim }}>{w.date}</span>
                  <span style={{ fontWeight: 600 }}>{w.kg} kg</span>
                </div>
              ))}
            </>
          ) : (
            <div style={{ color: C.dim, textAlign: "center", padding: 40, fontSize: 14 }}>No entries yet. Weigh yourself weekly, same time of day.</div>
          )}
        </>
      )}

      {/* bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: C.card, borderTop: `1px solid ${C.line}`, maxWidth: 460, margin: "0 auto" }}>
        {[["food", "Food"], ["train", "Train"], ["weight", "Weight"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "14px", background: "none", border: "none", cursor: "pointer", color: tab === k ? C.lime : C.dim, fontWeight: tab === k ? 700 : 500, fontSize: 14, borderTop: `2px solid ${tab === k ? C.lime : "transparent"}` }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

function Ring({ totals }) {
  const pct = Math.min(totals.kcal / TARGETS.kcal, 1);
  const R = 70, circ = 2 * Math.PI * R;
  const over = totals.kcal > TARGETS.kcal;
  return (
    <div style={{ display: "flex", justifyContent: "center", position: "relative", margin: "8px 0" }}>
      <svg width="180" height="180">
        <circle cx="90" cy="90" r={R} fill="none" stroke={C.line} strokeWidth="12" />
        <circle cx="90" cy="90" r={R} fill="none" stroke={over ? C.amber : C.lime} strokeWidth="12" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} transform="rotate(-90 90 90)" style={{ transition: "stroke-dashoffset .4s" }} />
      </svg>
      <div style={{ position: "absolute", top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 700 }}>{totals.kcal}</div>
        <div style={{ color: C.dim, fontSize: 13 }}>of {TARGETS.kcal} kcal</div>
        <div style={{ color: over ? C.amber : C.lime, fontSize: 12, marginTop: 2 }}>{over ? `+${totals.kcal - TARGETS.kcal} over` : `${TARGETS.kcal - totals.kcal} left`}</div>
      </div>
    </div>
  );
}

function Macro({ label, val, tgt, unit, color }) {
  const pct = Math.min(val / tgt, 1);
  return (
    <div style={{ background: C.card, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontSize: 12, color: C.dim }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, margin: "2px 0 6px" }}>{val}<span style={{ fontSize: 12, color: C.dim }}>/{tgt}{unit}</span></div>
      <div style={{ height: 4, background: C.line, borderRadius: 4 }}><div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 4 }} /></div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 12, letterSpacing: 1, color: C.dim, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}

function Stat({ big, label, color }) {
  return (
    <div style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, textAlign: "center" }}>
      <div style={{ fontSize: 30, fontWeight: 700, color }}>{big}</div>
      <div style={{ color: C.dim, fontSize: 12 }}>{label}</div>
    </div>
  );
}

function ExerciseCard({ ex }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: C.ink, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{ex.name}</div>
          <div style={{ color: C.dim, fontSize: 12, marginTop: 2 }}>{ex.target} · {ex.sets}</div>
        </div>
        <span style={{ color: C.lime, fontSize: 18, transform: open ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 14px 14px", color: C.dim, fontSize: 13, lineHeight: 1.6 }}>{ex.how}</div>
      )}
    </div>
  );
}

function Trend({ weights }) {
  const kgs = weights.map((w) => w.kg);
  const min = Math.min(...kgs) - 0.5, max = Math.max(...kgs) + 0.5;
  const W = 420, H = 120, pad = 10;
  const range = max - min || 1;
  const pts = weights.map((w, i) => {
    const x = pad + (i / Math.max(weights.length - 1, 1)) * (W - 2 * pad);
    const y = pad + (1 - (w.kg - min) / range) * (H - 2 * pad);
    return [x, y];
  });
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
      <Label>Trend</Label>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <path d={path} fill="none" stroke={C.lime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={C.lime} />)}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", color: C.dim, fontSize: 12, marginTop: 4 }}>
        <span>{weights[0].kg} kg</span>
        <span>latest {weights[weights.length - 1].kg} kg</span>
      </div>
    </div>
  );
}
