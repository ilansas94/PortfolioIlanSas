"use client";

import React, { useState } from "react";

type Phase = "intro" | "learn" | "practice" | "finish";
type IconName = "hand" | "shield" | "drop" | "user" | "bed" | "spark" | "book" | "check" | "arrow" | "refresh" | "clock" | "light" | "play" | "hospital";

type Moment = {
  number: number;
  label: string;
  title: string;
  subtitle: string;
  why: string;
  example: string;
  remember: string;
  icon: IconName;
  color: string;
};

const moments: Moment[] = [
  {
    number: 1,
    label: "לפני",
    title: "לפני מגע במטופל",
    subtitle: "עוצרים רגע, לפני שמתקרבים.",
    why: "כדי להגן על המטופל מפני העברת מזהמים מהסביבה באמצעות הידיים.",
    example: "ניגשים לבדוק דופק או לסייע למטופל להתיישב — מבצעים היגיינת ידיים לפני המגע.",
    remember: "גם מגע קצר הוא מגע.",
    icon: "hand",
    color: "teal"
  },
  {
    number: 2,
    label: "לפני",
    title: "לפני פעולה נקייה או אספטית",
    subtitle: "לפני שלב שמחייב ניקיון מוקפד.",
    why: "כדי למנוע העברת מזהמים לאזור פגיע בגוף המטופל במהלך פעולה נקייה או אספטית.",
    example: "עומדים לבצע טיפול בפצע או לטפל בגישה ורידית — מבצעים היגיינת ידיים לפני הפעולה.",
    remember: "כפפות אינן מחליפות היגיינת ידיים.",
    icon: "shield",
    color: "blue"
  },
  {
    number: 3,
    label: "אחרי",
    title: "אחרי סיכון לחשיפה לנוזלי גוף",
    subtitle: "מגינים על הצוות ועל הסביבה.",
    why: "כדי לצמצם את הסיכון להעברת מזהמים לאחר פעולה שבה היה סיכון למגע עם נוזלי גוף.",
    example: "לאחר טיפול הכרוך בסיכון לחשיפה לנוזלי גוף — מסירים כפפות לפי הצורך ומבצעים היגיינת ידיים.",
    remember: "הסרת כפפות אינה סוף הפעולה.",
    icon: "drop",
    color: "coral"
  },
  {
    number: 4,
    label: "אחרי",
    title: "אחרי מגע במטופל",
    subtitle: "מסיימים מגע, שומרים על הרצף.",
    why: "כדי להגן על הצוות ועל הסביבה מפני העברת מזהמים לאחר מגע במטופל.",
    example: "סיימתם בדיקה גופנית ואתם עומדים לצאת מאזור המטופל — מבצעים היגיינת ידיים.",
    remember: "הטיפול הסתיים; ההגנה נמשכת.",
    icon: "user",
    color: "violet"
  },
  {
    number: 5,
    label: "אחרי",
    title: "אחרי מגע בסביבת המטופל",
    subtitle: "גם בלי מגע ישיר במטופל.",
    why: "כדי למנוע העברת מזהמים מהסביבה הקרובה של המטופל לאזורי טיפול אחרים.",
    example: "נגעתם במעקה המיטה או בציוד שנמצא בסביבת המטופל, ועומדים לצאת מהאזור — מבצעים היגיינת ידיים.",
    remember: "גם לסביבה הקרובה יש משמעות.",
    icon: "bed",
    color: "gold"
  }
];

type Question = {
  label: string;
  title: string;
  description: string;
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    label: "תחילת מפגש",
    title: "עוד רגע מתחילים",
    description: "נכנסת לחדר, הצגת את עצמך, ואתה עומד לבדוק למטופל את הדופק. טרם נגעת בו.",
    answer: 0,
    explanation: "היגיינת ידיים נדרשת לפני מגע במטופל, גם כשמדובר בבדיקה קצרה."
  },
  {
    label: "פעולה נקייה",
    title: "ממש לפני הטיפול",
    description: "סידרת את הציוד, ואת עומדת להתחיל טיפול בפצע. מהו הרגע המתאים ביותר כעת?",
    answer: 1,
    explanation: "לפני פעולה נקייה או אספטית מבצעים היגיינת ידיים, גם כשעובדים עם כפפות."
  },
  {
    label: "לאחר טיפול",
    title: "הכפפות הוסרו",
    description: "סיימת פעולה שבה היה סיכון למגע עם נוזלי גוף. הסרת את הכפפות.",
    answer: 2,
    explanation: "לאחר סיכון לחשיפה לנוזלי גוף נדרשת היגיינת ידיים; כפפות אינן תחליף."
  },
  {
    label: "סיום בדיקה",
    title: "הבדיקה הסתיימה",
    description: "סיימת לבדוק את המטופל, ואתה עומד לעבור לאזור העבודה שמחוץ לסביבתו.",
    answer: 3,
    explanation: "אחרי מגע במטופל מבצעים היגיינת ידיים לפני המעבר לסביבה אחרת."
  },
  {
    label: "סביבת המטופל",
    title: "בלי לגעת במטופל",
    description: "סידרת את מעקה המיטה ונגעת בשולחן הצמוד אליה. לא היה מגע ישיר עם המטופל.",
    answer: 4,
    explanation: "גם לאחר מגע בסביבת המטופל, ללא מגע ישיר בו, נדרשת היגיינת ידיים ביציאה מהאזור."
  }
];

const Icon = ({ name, size = 24 }: { name: IconName; size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {name === "hand" && <><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6V3.8a1.5 1.5 0 0 1 3 0V11 5.5a1.5 1.5 0 0 1 3 0V12l.5-2.2a1.6 1.6 0 0 1 3.1.7l-1 5.1C19 19 16.5 21 13 21h-2c-2.4 0-4.2-1.1-5.4-2.9L3.4 15a1.6 1.6 0 0 1 2.4-2.1L8 15" /></>}
    {name === "shield" && <><path d="m12 2 8 4v5c0 5.5-3.2 8.5-8 11-4.8-2.5-8-5.5-8-11V6l8-4Z"/><path d="m8.5 12 2.5 2.5 4.8-5"/></>}
    {name === "drop" && <><path d="M12 2c2.5 4.1 7 8.2 7 12a7 7 0 1 1-14 0c0-3.8 4.5-7.9 7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/></>}
    {name === "user" && <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>}
    {name === "bed" && <><path d="M3 5v15M21 10v10M3 16h18M3 11h18v5M7 11V8h5v3"/></>}
    {name === "spark" && <><path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z"/></>}
    {name === "book" && <><path d="M12 6a8 8 0 0 0-9-2v15a8 8 0 0 1 9 2 8 8 0 0 1 9-2V4a8 8 0 0 0-9 2ZM12 6v15"/></>}
    {name === "check" && <path d="m5 12 4.2 4.2L19 6.5"/>}
    {name === "arrow" && <path d="M20 12H4m7-7-7 7 7 7"/>}
    {name === "refresh" && <><path d="M20 11a8 8 0 1 0-2 6"/><path d="M20 4v7h-7"/></>}
    {name === "clock" && <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}
    {name === "light" && <><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-.8.6-1 1.5-1 2H9c0-.5-.2-1.4-1-2Z"/></>}
    {name === "play" && <path d="m8 5 11 7-11 7V5Z"/>}
    {name === "hospital" && <><rect x="4" y="3" width="16" height="19" rx="2"/><path d="M9 22v-5h6v5M12 6v7M8.5 9.5h7"/></>}
  </svg>
);

function Scene({ onExplore }: { onExplore: (index: number) => void }) {
  const [active, setActive] = useState<number | null>(null);
  const shown = active === null ? null : moments[active];
  const hotspots = [
    { index: 0, position: "ml-orbit-b" },
    { index: 1, position: "ml-orbit-a" },
    { index: 2, position: "ml-orbit-c" },
    { index: 3, position: "ml-orbit-d" },
    { index: 4, position: "ml-orbit-e" }
  ];

  return (
    <div className="ml-scene" aria-label="איור אינטראקטיבי של חדר מטופל עם חמישה רגעים ללמידה">
      <div className="ml-scene-grid" />
      <div className="ml-scene-window"><span/><span/><span/></div>
      <div className="ml-scene-monitor"><div className="ml-ecg">⌁⌁</div><span>72</span></div>
      <div className="ml-scene-stand"><span className="ml-iv-bag"/><span className="ml-iv-line"/></div>
      <div className="ml-scene-bed">
        <div className="ml-scene-pillow"/>
        <div className="ml-scene-person"><span className="ml-person-head"/><span className="ml-person-body"/></div>
        <div className="ml-bed-frame"/>
      </div>
      {hotspots.map(({index, position}) => (
        <button
          type="button"
          key={index}
          aria-label={"גלו את רגע מספר " + moments[index].number + ": " + moments[index].title}
          aria-pressed={active === index}
          onClick={() => setActive(active === index ? null : index)}
          className={"ml-orbit " + position + (active === index ? " ml-orbit-selected" : "")}
        >
          <Icon name={moments[index].icon} size={23}/>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </button>
      ))}
      {shown && (
        <div className="ml-scene-tooltip" role="status">
          <button type="button" className="ml-tooltip-close" onClick={() => setActive(null)} aria-label="סגור מידע">×</button>
          <small>רגע {shown.number} מתוך 5</small>
          <strong>{shown.title}</strong>
          <button type="button" onClick={() => onExplore(active!)}>ללמידה על הרגע ←</button>
        </div>
      )}
      <div className="ml-scene-caption"><span className="ml-pulse"/> לחצו על סמן כדי לגלות רגע</div>
    </div>
  );
}

export default function LearningExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [momentIndex, setMomentIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number[]>([3, 0, 4, 1, 2]);
  const score = answers.filter(Boolean).length;
  const missedQuestions = answers.flatMap((isCorrect, index) => isCorrect ? [] : [questions[questionOrder[index]]]);
  const currentMoment = moments[momentIndex];
  const currentQuestion = questions[questionOrder[questionIndex]];
  const progress = phase === "intro" ? 0 : phase === "learn" ? 10 + visited.length * 8 : phase === "practice" ? 50 + (questionIndex + (chosen !== null ? 1 : 0)) * 10 : 100;

  const start = () => {
    setPhase("learn");
    setMomentIndex(0);
    setVisited([0]);
    setAnswers([]);
    setQuestionIndex(0);
    setQuestionOrder(([...Array(questions.length).keys()]).sort(() => Math.random() - 0.5));
    setChosen(null);
  };

  const exploreMoment = (index: number) => {
    setPhase("learn");
    setMomentIndex(index);
    setVisited([index]);
    setQuestionIndex(0);
    setAnswers([]);
    setChosen(null);
  };

  const openMoment = (index: number) => {
    setMomentIndex(index);
    setVisited(prev => prev.includes(index) ? prev : [...prev, index]);
  };

  const advanceMoment = () => {
    if (momentIndex < moments.length - 1) {
      openMoment(momentIndex + 1);
    } else {
      setPhase("practice");
      setQuestionIndex(0);
      setAnswers([]);
      setQuestionOrder(([...Array(questions.length).keys()]).sort(() => Math.random() - 0.5));
      setChosen(null);
    }
  };

  const answer = (index: number) => {
    if (chosen !== null) return;
    setChosen(index);
    setAnswers(prev => [...prev, index === currentQuestion.answer]);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setChosen(null);
    } else {
      setPhase("finish");
    }
  };

  return (
    <main className="ml" lang="he" dir="rtl">
      <header className="ml-header">
        <div className="ml-shell ml-header-inner">
          <a className="ml-brand" href="/learning-lab" aria-label="רגע בטוח — תחילת הלמידה">
            <span className="ml-brand-icon"><Icon name="spark" size={21}/></span>
            <span>רגע<span className="ml-brand-strong">בטוח</span><small>LEARNING EXPERIENCE</small></span>
          </a>
          <nav className="ml-header-actions" aria-label="קישורי ניווט">
            <span className="ml-header-tag">DEMO · CONCEPT PROJECT</span>
            <a href="/#portfolio" className="ml-header-back">לתיק העבודות <Icon name="arrow" size={16}/></a>
          </nav>
        </div>
      </header>

      <div className="ml-shell">
        <div className="ml-progress-row" aria-label="התקדמות בלמידה">
          <div className="ml-progress-details">
            <span className="ml-progress-kicker">מסע למידה</span>
            <span className="ml-progress-name">{phase === "intro" ? "לפני שמתחילים" : phase === "learn" ? "לומדים את 5 הרגעים" : phase === "practice" ? "מתרגלים בשטח" : "המסע הושלם"}</span>
          </div>
          <div className="ml-progress-meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="התקדמות הלמידה"><span style={{ width: progress + "%" }}/></div>
          <span className="ml-progress-number">{progress}%</span>
        </div>

        {phase === "intro" && (
          <>
            <section className="ml-hero">
              <div className="ml-hero-copy">
                <span className="ml-eyebrow"><span className="ml-eyebrow-dot"/> מיקרו־למידה · בטיחות המטופל</span>
                <h1>לפעמים,<br/><em>רגע אחד</em><br/>עושה את ההבדל.</h1>
                <p className="ml-hero-text">חמישה רגעים להיגיינת ידיים. מסע קצר שמתרגם ידע חשוב להחלטות אמיתיות, בתוך סביבת טיפול יומיומית.</p>
                <div className="ml-hero-metadata">
                  <span><Icon name="clock" size={17}/> 4–5 דקות</span>
                  <span><Icon name="book" size={17}/> 5 רגעי למידה</span>
                  <span><Icon name="check" size={17}/> תרגול ומשוב</span>
                </div>
                <button type="button" className="ml-primary ml-primary-light" onClick={start}>בואו נתחיל <Icon name="arrow" size={20}/></button>
                <div className="ml-hero-under">ללא הרשמה · ללא איסוף מידע אישי</div>
              </div>
              <Scene onExplore={exploreMoment} />
            </section>
            <section className="ml-intro-row" aria-label="תהליך הלמידה">
              <div className="ml-intro-stat"><span className="ml-intro-stat-icon"><Icon name="light" size={22}/></span><div><strong>מבינים</strong><span>מזהים את חמשת הרגעים</span></div></div>
              <div className="ml-intro-stat"><span className="ml-intro-stat-icon"><Icon name="hospital" size={22}/></span><div><strong>מתרגלים</strong><span>מקבלים החלטות בתרחישים</span></div></div>
              <div className="ml-intro-stat"><span className="ml-intro-stat-icon"><Icon name="check" size={22}/></span><div><strong>זוכרים</strong><span>מקבלים משוב מיידי</span></div></div>
            </section>
          </>
        )}

        {phase === "learn" && (
          <section className="ml-learning-stage">
            <div className="ml-stage-top">
              <span className="ml-section-label">01 / לומדים</span>
              <h1>חמישה רגעים.<br/><em>הרגל בטוח אחד.</em></h1>
              <p>בחרו רגע מהרשימה כדי לראות מתי הוא מתרחש, למה הוא חשוב ואיך מזהים אותו בעבודה.</p>
            </div>
            <div className="ml-learning-grid">
              <div className="ml-moment-list" role="group" aria-label="בחירת רגע ללמידה">
                {moments.map((m, i) => (
                  <button type="button" key={m.number} onClick={() => openMoment(i)} className={"ml-moment-tab " + (i === momentIndex ? "ml-moment-active " : "") + (visited.includes(i) ? "ml-moment-visited" : "")} aria-pressed={i === momentIndex}>
                    <span className={"ml-moment-no ml-color-" + m.color}>{String(m.number).padStart(2, "0")}</span>
                    <span className="ml-moment-text"><small>{m.label}</small><strong>{m.title}</strong></span>
                    {visited.includes(i) && <span className="ml-done-icon"><Icon name="check" size={15}/></span>}
                  </button>
                ))}
              </div>
              <article className="ml-learning-panel" key={currentMoment.number}>
                <div className="ml-learning-panel-head">
                  <div className={"ml-moment-bigicon ml-color-" + currentMoment.color}><Icon name={currentMoment.icon} size={42}/></div>
                  <div><span className="ml-panel-kicker">רגע {currentMoment.number} מתוך 5</span><h2>{currentMoment.title}</h2></div>
                </div>
                <p className="ml-panel-subtitle">{currentMoment.subtitle}</p>
                <div className="ml-fact"><div className="ml-fact-label"><Icon name="shield" size={20}/> למה זה חשוב?</div><p>{currentMoment.why}</p></div>
                <div className="ml-fact ml-fact-example"><div className="ml-fact-label"><Icon name="hospital" size={20}/> דוגמה מהשטח</div><p>{currentMoment.example}</p></div>
                <div className="ml-memory"><Icon name="light" size={19}/><span><strong>כדאי לזכור:</strong> {currentMoment.remember}</span></div>
                <div className="ml-learning-actions">
                  {momentIndex > 0 && <button type="button" className="ml-back-button" onClick={() => openMoment(momentIndex - 1)}>→ לרגע הקודם</button>}
                  <button type="button" className="ml-primary ml-primary-dark" onClick={advanceMoment}>{momentIndex === 4 ? "מוכנים לתרגול" : "לרגע הבא"} <Icon name="arrow" size={18}/></button>
                </div>
              </article>
            </div>
            <div className="ml-learning-tip"><Icon name="book" size={20}/> הטיפ: שני הרגעים הראשונים הם לפני הפעולה. שלושת האחרים — אחריה.</div>
          </section>
        )}

        {phase === "practice" && (
          <section className="ml-practice-stage">
            <div className="ml-stage-top ml-stage-centered">
              <span className="ml-section-label">02 / מתרגלים</span>
              <h1>הידע פוגש את <em>הרגע.</em></h1>
              <p>חמישה מצבים קצרים מהשגרה. בחרו את הרגע המתאים לכל מצב וקבלו משוב מיידי.</p>
            </div>
            <div className="ml-quiz-card">
              <div className="ml-quiz-meta"><span>תרחיש {String(questionIndex + 1).padStart(2, "0")} / 05</span><span className="ml-quiz-dots">{questions.map((q,i)=><i key={q.title} className={i < questionIndex ? "ml-dot-done" : i === questionIndex ? "ml-dot-active" : ""}/>)}</span></div>
              <div className="ml-scenario-badge"><Icon name="hospital" size={18}/> {currentQuestion.label}</div>
              <h2>{currentQuestion.title}</h2>
              <p className="ml-scenario-desc">{currentQuestion.description}</p>
              <div className="ml-question-label">איזה מחמשת הרגעים מתאים למצב הזה?</div>
              <div className="ml-answers">
                {moments.map((m, i) => (
                  <button
                    type="button"
                    key={m.number}
                    onClick={() => answer(i)}
                    disabled={chosen !== null}
                    aria-pressed={chosen === i}
                    className={"ml-answer " + (chosen !== null && i === currentQuestion.answer ? "ml-answer-correct" : "") + (chosen === i && i !== currentQuestion.answer ? " ml-answer-incorrect" : "")}
                  >
                    <span className="ml-answer-index">{m.number}</span>
                    <span>{m.title}</span>
                    {chosen !== null && i === currentQuestion.answer && <Icon name="check" size={19}/>}
                  </button>
                ))}
              </div>
              {chosen !== null && (
                <div className={"ml-feedback " + (chosen === currentQuestion.answer ? "ml-feedback-positive" : "ml-feedback-try")} role="status" aria-live="polite">
                  <div className="ml-feedback-heading"><Icon name={chosen === currentQuestion.answer ? "check" : "light"} size={20}/>{chosen === currentQuestion.answer ? "בדיוק כך!" : "כדאי לשים לב להבדל"}</div>
                  <p>{currentQuestion.explanation}</p>
                  <button type="button" className="ml-primary ml-primary-dark" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? "לסיכום הלמידה" : "לתרחיש הבא"}<Icon name="arrow" size={18}/></button>
                </div>
              )}
            </div>
            <div className="ml-practice-note">אין כאן ציון עובר או נכשל. המטרה היא ללמוד מהחלטות ולחדד את הזיהוי בזמן אמת.</div>
          </section>
        )}

        {phase === "finish" && (
          <section className="ml-finish-stage">
            <div className="ml-finish-graphic"><div className="ml-finish-ring"><Icon name="shield" size={54}/></div><div className="ml-finish-spark ml-finish-spark-a">✦</div><div className="ml-finish-spark ml-finish-spark-b">✦</div></div>
            <span className="ml-section-label">03 / מסכמים</span>
            <h1>כל הכבוד! <em>זה רגע בטוח.</em></h1>
            <p className="ml-finish-intro">סיימתם את חמשת התרחישים ולמדתם לזהות את חמשת הרגעים להיגיינת ידיים.</p>
            <div className="ml-score-card"><div className="ml-score-value"><strong>{score}</strong><span> / {questions.length}</span></div><div><strong>תשובות נכונות</strong><p>{score === questions.length ? "זיהוי מצוין! עכשיו חשוב ליישם גם בשגרה." : "כל תרחיש הוא הזדמנות לזכור טוב יותר את הרגע המתאים."}</p></div></div>
            {missedQuestions.length > 0 && (
              <div className="ml-review-card">
                <h2>לומדים גם מהתשובות הלא נכונות</h2>
                <p>אפשר לחזור על הרגעים הבאים לפני סבב חדש:</p>
                {missedQuestions.map((question) => (
                  <div key={question.title} className="ml-review-item">
                    <Icon name="light" size={18}/>
                    <span><strong>{question.title}</strong> — {moments[question.answer].title}</span>
                  </div>
                ))}
                <button type="button" className="ml-review-action" onClick={() => exploreMoment(missedQuestions[0].answer)}>לחזרה לרגע הראשון שדורש חיזוק ←</button>
              </div>
            )}
            <div className="ml-finish-reminder"><Icon name="light" size={24}/><span>כל רגע נכון מתחיל בזיהוי נכון. לפני מגע או פעולה נקייה — ואחרי חשיפה, מגע במטופל או מגע בסביבתו.</span></div>
            <div className="ml-finish-actions"><button type="button" className="ml-primary ml-primary-dark" onClick={start}>לתרגל מחדש <Icon name="refresh" size={18}/></button><a className="ml-secondary" href="/#portfolio">לתיק העבודות <Icon name="arrow" size={17}/></a></div>
          </section>
        )}
      </div>

      <footer className="ml-footer"><div className="ml-shell ml-footer-inner">
        <div><span className="ml-footer-brand">רגע בטוח<span> · </span>SAFE MOMENTS</span><p>פרויקט קונספט עצמאי של אילן ששתיאל · חוויית למידה דיגיטלית</p></div>
        <div className="ml-sources"><span>מבוסס על עקרונות WHO של 5 רגעים להיגיינת ידיים</span><a href="https://www.who.int/campaigns/world-hand-hygiene-day/key-resources-on-hand-hygiene" target="_blank" rel="noopener noreferrer">מקור מקצועי — WHO ↗</a><small>להדגמה בלבד. אינו תחליף להכשרה מוסדית, הנחיות מקצועיות או נהלי מקום העבודה. ללא קשר רשמי לבית חולים כלשהו.</small></div>
      </div></footer>
    </main>
  );
}
