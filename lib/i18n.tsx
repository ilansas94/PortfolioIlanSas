"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type SiteLanguage = "en" | "he";

/**
 * Editorial Hebrew copy for the public portfolio. Client and product names remain
 * unchanged. Missing dictionary keys deliberately fall back to the English source.
 */
const hebrewCopy: Record<string, string> = {
  "Home": "ראשי",
  "About": "אודות",
  "Portfolio": "תיק עבודות",
  "Skills": "יכולות",
  "Contact": "יצירת קשר",
  "Let's Work Together": "בואו נעבוד יחד",
  "Back to homepage": "חזרה לעמוד הראשי",
  "Open navigation menu": "פתיחת תפריט ניווט",
  "Close navigation menu": "סגירת תפריט ניווט",
  "English": "אנגלית",
  "Hebrew": "עברית",
  "Creative Designer": "מעצב גרפי",
  "Digital Artist": "ואמן דיגיטלי",
  "Bringing ideas to life through thoughtful design, compelling branding, and AI-enhanced creative workflows that turn ideas into meaningful visual experiences.":
    "אני יוצר חוויות חזותיות בעלות משמעות באמצעות עיצוב מדויק, מיתוג חכם ותהליכי יצירה שמשלבים כלי AI.",
  "View My Work": "לצפייה בעבודות",
  "Get In Touch": "ליצירת קשר",
  "Scroll to explore": "גללו כדי לגלות עוד",
  "About Me": "קצת עליי",
  "Passionate Multidisciplinary Designer": "מעצב רב־תחומי עם תשוקה ליצירה",
  "I'm": "אני",
  "Ilan Sastiel": "אילן ששתיאל",
  ", a passionate multidisciplinary designer who loves creating meaningful, beautiful visuals.": ", מעצב רב־תחומי שאוהב להפוך רעיונות לחוויות חזותיות מדויקות, יפות ובעלות משמעות.",
  "My background includes digital painting, branding, logo design, and user interface mockups. I'm not just about the art – I'm also a thinker, a planner, and a storyteller.":
    "אני מגיע מעולמות הציור הדיגיטלי, המיתוג, עיצוב הלוגואים והממשקים. לצד הצד החזותי, חשובים לי גם החשיבה שמאחורי הרעיון, התכנון והסיפור שהעיצוב מספר.",
  "My journey includes hands-on experience with everything from intuitive sketching to sleek landing pages and full campaign identity systems.":
    "העשייה שלי נעה בין רישום ויצירת איורים לבין עיצוב דפי נחיתה, שפות מותג ומערכות חזותיות לקמפיינים.",
  "Beyond traditional graphic design, I work with AI across visual creation and development. I use ChatGPT, Runway and Photoshop for research, concepts and motion, and experiment with ComfyUI. With OpenAI Codex, I also build and iterate on websites and interactive game prototypes, combining design direction with AI-assisted coding and testing.":
    "מעבר לעיצוב הגרפי המסורתי, אני משלב AI בתהליכי היצירה והפיתוח שלי. אני נעזר ב־ChatGPT, ב־Runway וב־Photoshop למחקר, לפיתוח קונספטים, לווידאו ולתנועה, ומתנסה גם ב־ComfyUI. באמצעות OpenAI Codex אני בונה ומשפר אתרים ואבות־טיפוס למשחקים אינטראקטיביים, תוך שילוב בין הובלה עיצובית, כתיבת קוד בסיוע AI ובדיקות מעשיות.",
  "This portfolio is a reflection of my dedication, creativity, and constant curiosity. Thanks for stopping by!":
    "תיק העבודות הזה משקף את הסקרנות, ההשקעה והאהבה שלי ליצירה. תודה שבאתם לבקר!",
  "Core Expertise": "תחומי ההתמחות שלי",
  "Digital Painting": "ציור דיגיטלי",
  "Branding & Identity": "מיתוג וזהות חזותית",
  "Logo Design": "עיצוב לוגואים",
  "UI/UX Design": "עיצוב UI/UX",
  "Visual Storytelling": "סטוריטלינג חזותי",
  "Campaign Design": "עיצוב קמפיינים",
  "Illustration": "איור",
  "Print Design": "עיצוב לדפוס",
  "AI-Assisted Design": "עיצוב בסיוע AI",
  "Prompt Engineering": "בניית הנחיות ל־AI",
  "17+": "17+",
  "Creative Projects": "פרויקטים יצירתיים",
  "Years Experience": "שנות ניסיון",
  "Passion Driven": "מתוך תשוקה",
  "Ideas & Counting": "הרעיונות ממשיכים",
  "Let's Connect": "בואו נדבר",
  "Skills & Services": "יכולות ושירותים",
  "What I Bring to the Table": "מה אני מביא איתי",
  "A comprehensive skill set spanning digital design, traditional art, and modern technology to create compelling visual experiences.":
    "שילוב של עיצוב דיגיטלי, מיומנויות אמנותיות וטכנולוגיה מתקדמת — ליצירת תוצרים חזותיים מדויקים ומעוררי עניין.",
  "Design & Branding": "עיצוב ומיתוג",
  "Brand Identity": "זהות מותג",
  "Visual Identity": "זהות חזותית",
  "Brand Guidelines": "ספר מותג",
  "Character Design": "עיצוב דמויות",
  "Concept Art": "אמנות קונספט",
  "User Interface": "ממשקי משתמש",
  "User Experience": "חוויית משתמש",
  "Prototyping": "בניית אבות־טיפוס",
  "Wireframing": "אפיון מסכים",
  "Print & Media": "דפוס ומדיה",
  "Brochure Design": "עיצוב חוברות",
  "Poster Design": "עיצוב פוסטרים",
  "Print Layout": "עימוד לדפוס",
  "Beyond the Canvas": "מעבר לקנבס",
  "Creative Technology & AI": "טכנולוגיה יצירתית ו־AI",
  "Combining an experienced designer's eye with generative AI, interactive prototyping and AI-assisted development.":
    "שילוב בין עין עיצובית מנוסה, בינה מלאכותית יוצרת, פיתוח אינטראקטיבי ובניית אבות־טיפוס.",
  "Visual creation & motion": "יצירה חזותית ואנימציה",
  "AI-Assisted Creative Workflows": "תהליכי יצירה בסיוע AI",
  "I use ChatGPT for research and advanced prompting, Runway for AI video and cinematic transitions, and Photoshop for visual refinement. I also explore node-based generation in ComfyUI, with creative direction guiding every result.":
    "אני משתמש ב־ChatGPT למחקר ולבניית הנחיות מדויקות, ב־Runway ליצירת וידאו ומעברים קולנועיים, וב־Photoshop לליטוש חזותי. במקביל אני מתנסה בעבודה מבוססת צמתים ב־ComfyUI, כשההחלטות העיצוביות מנחות את התהליך.",
  "Websites & interactive projects": "אתרים וחוויות אינטראקטיביות",
  "AI-Assisted Development": "פיתוח בסיוע AI",
  "I work with OpenAI Codex to design and develop websites, refine interfaces, and experiment with interactive game prototypes. I combine design thinking with AI-assisted coding, testing and iteration, including projects published through GitHub and Vercel.":
    "באמצעות OpenAI Codex אני מעצב ומפתח אתרים, משפר ממשקים ומתנסה באבות־טיפוס למשחקים אינטראקטיביים. אני משלב חשיבה עיצובית עם פיתוח בסיוע AI, בדיקות ושיפור הדרגתי, כולל פרויקטים המנוהלים ב־GitHub ומפורסמים באמצעות Vercel.",
  "ComfyUI (Exploration)": "ComfyUI (התנסות)",
  "Web Development": "פיתוח אתרים",
  "Game Prototyping": "פיתוח אבות־טיפוס למשחקים",
  "Tools & Technologies": "כלים וטכנולוגיות",
  "Featured Work": "עבודות נבחרות",
  "Explore my collection of creative projects spanning branding, digital art, and visual design across various industries and mediums.":
    "מבחר עבודות במיתוג, בעיצוב גרפי, באמנות דיגיטלית ובחוויות אינטראקטיביות — במגוון סגנונות ופורמטים.",
  "All": "הכול",
  "Branding": "מיתוג",
  "Digital Art": "אמנות דיגיטלית",
  "Portrait": "דיוקן",
  "AI & Interactive": "AI ואינטראקטיב",
  "Interactive Learning": "למידה אינטראקטיבית",
  "Live": "לצפייה",
  "Open the interactive lesson": "לפתיחת החוויה האינטראקטיבית",
  "Interactive Prototype": "אב־טיפוס אינטראקטיבי",
  "Click and interact with the prototype on the left to explore the full user experience.":
    "אפשר ללחוץ ולהתנסות באב־הטיפוס כדי להכיר את חוויית המשתמש.",
  "Highlights": "דגשים",
  "Deliverables": "תוצרים",
  "Tools": "כלים",
  "Tags": "תגיות",
  "Close project": "סגירת פרויקט",
  "Filter projects by category": "סינון עבודות לפי תחום",
  "Like what you see? Let's create something amazing together.":
    "אהבתם את מה שראיתם? אשמח ליצור משהו מיוחד גם יחד איתכם.",
  "Start Your Project": "בואו נתחיל",
  "Let's Create Something Amazing": "בואו ניצור משהו מיוחד",
  "Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your vision to life.":
    "יש לכם רעיון או פרויקט בראש? אשמח לשמוע עליו ולחשוב יחד איך להפוך אותו למציאות.",
  "Send me a message": "השאירו לי הודעה",
  "Name *": "שם *",
  "Email *": "דוא״ל *",
  "Subject *": "נושא *",
  "Message *": "הודעה *",
  "Your name": "איך קוראים לכם?",
  "Project inquiry, collaboration, etc.": "פנייה בנוגע לפרויקט, שיתוף פעולה ועוד",
  "Tell me about your project, ideas, timeline, and any specific requirements...":
    "ספרו לי על הרעיון, לוחות הזמנים והדברים שחשובים לכם...",
  "Sending...": "שולח...",
  "Send Message": "שליחת הודעה",
  "Message sent successfully! I'll get back to you soon.": "ההודעה נשלחה בהצלחה! אחזור אליכם בהקדם.",
  "Something went wrong. Please try again or contact me directly.":
    "משהו השתבש בשליחת ההודעה. נסו שוב או פנו אליי ישירות.",
  "Let's Collaborate": "בואו נשתף פעולה",
  "Ready to bring your vision to life? I'm always excited to work on new creative projects.":
    "יש לכם רעיון שתרצו להוציא לפועל? אני תמיד שמח להכיר פרויקטים יצירתיים חדשים.",
  "Quick Response": "מענה מהיר",
  "I typically respond to all inquiries within 24 hours during business days.":
    "אני משתדל להשיב לפניות בתוך יום עבודה.",
  "Professional Service": "עבודה מקצועית",
  "From concept to completion, I ensure every project meets the highest standards.":
    "משלב הרעיון ועד התוצאה הסופית, אני מקפיד על מחשבה, דיוק ותשומת לב לפרטים.",
  "Connect with me": "אפשר למצוא אותי גם כאן",
  "Follow me on social media for behind-the-scenes content, design tips, and the latest updates on my creative journey.":
    "מוזמנים לעקוב אחרי התהליכים, הרעיונות והעבודות החדשות שלי גם ברשתות החברתיות.",
  "Open to design opportunities": "פתוח להזדמנויות בעיצוב",
  "Interested in graphic design roles and meaningful creative collaborations.":
    "מחפש הזדמנויות בעיצוב גרפי ושיתופי פעולה יצירתיים בעלי ערך.",
  "Quick Links": "ניווט מהיר",
  "Creative designer and digital artist passionate about bringing ideas to life through innovative design and compelling visual experiences.":
    "מעצב גרפי ואמן דיגיטלי שאוהב להפוך רעיונות לחוויות חזותיות מקוריות ובעלות משמעות.",
  "Ready to bring your vision to life?": "יש לכם רעיון שתרצו להגשים?",
  "Let's create something amazing together.": "בואו נהפוך אותו למשהו מיוחד.",
  "Start a Project": "מתחילים פרויקט",
  "All rights reserved. Designed and developed with passion.":
    "כל הזכויות שמורות. עוצב ונבנה מתוך אהבה ליצירה.",
  "Adobe Creative Suite": "Adobe Creative Suite"
};

type LanguageContextShape = {
  language: SiteLanguage;
  isHebrew: boolean;
  setLanguage: (language: SiteLanguage) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextShape | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en");
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ilan-portfolio-language");
      if (stored === "he" || stored === "en") setLanguageState(stored);
    } catch { /* Storage may be disabled; language switch still works. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
    try { window.localStorage.setItem("ilan-portfolio-language", language); } catch { /* Ignore */ }
  }, [language]);
  const setLanguage = useCallback((next: SiteLanguage) => setLanguageState(next), []);
  const t = useCallback((text: string) => language === "he" ? (hebrewCopy[text] || text) : text, [language]);
  const value = useMemo(() => ({ language, isHebrew: language === "he", setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires a LanguageProvider");
  return context;
}
