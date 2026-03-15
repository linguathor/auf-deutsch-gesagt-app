/**
 * Generate complete modules.ts from story text files.
 * Run: node scripts/generate-modules.mjs
 */
import { readFileSync, writeFileSync } from "fs";

// Read stories
let raw = readFileSync("scripts/stories_clean.json", "utf8");
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
const stories = JSON.parse(raw);

// Parse a story text into { title, paragraphs, sentences }
function parseStory(text) {
  // Strip vocab/idiom reference tables that use \r as column separator
  // These appear after the story narrative
  const cleanText = text.replace(/\r\n\r\n[\s\S]*$/, "").replace(/\n\nVerb\r[\s\S]*$/, "").replace(/\n\nAusdruck\r[\s\S]*$/, "");
  
  const lines = cleanText.split(/\r?\n/).filter((l) => l.trim());
  // Filter out any lines with \r (these are vocab table rows)
  const cleanLines = lines.filter((l) => !l.includes("\r"));
  const title = cleanLines[0];
  const bodyLines = cleanLines.slice(1);

  // Each non-empty line is a paragraph
  const paragraphs = bodyLines.filter((l) => l.trim());

  // Split paragraphs into sentences (rough heuristic)
  const allSentences = [];
  let time = 0;
  for (const para of paragraphs) {
    // Split on sentence boundaries
    const sents = para.match(/[^.!?"]+[.!?"]+[""]?\s*/g) || [para];
    for (let s of sents) {
      s = s.trim();
      if (!s) continue;
      const duration = Math.max(2.5, s.length * 0.06);
      allSentences.push({
        start: Math.round(time * 10) / 10,
        end: Math.round((time + duration) * 10) / 10,
        text: s,
      });
      time += duration;
    }
  }
  return { title, paragraphs, sentences: allSentences };
}

// Module definitions with metadata, vocab, and exercises
const moduleDefs = [
  // ============ MODULE 1: Der Umzug (ziehen) ============
  {
    id: 1,
    slug: "der-umzug",
    title: "Der Umzug",
    subtitle: "ziehen – bewegen, umziehen und anziehen",
    focusVerb: "ziehen",
    headerImage: "/images/story-01.svg",
    learningGoals: [
      "Trennbare und untrennbare Verben mit «ziehen» sicher verwenden",
      "Eine Alltagsgeschichte über einen Umzug verstehen",
      "Redewendungen mit «ziehen» im Kontext erkennen",
      "Kurze Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "umziehen", english: "to move (house)", definition: "Die Wohnung oder den Wohnort wechseln.", example: "Ben zieht heute um." },
      { german: "anziehen", english: "to put on (clothes)", definition: "Kleidung anlegen.", example: "Ich ziehe mir meine Arbeitshandschuhe an." },
      { german: "ausziehen", english: "to move out / to take off", definition: "1. Aus einer Wohnung ausziehen. 2. Kleidung ablegen.", example: "Die Vormieterin ist noch nicht ganz ausgezogen." },
      { german: "einziehen", english: "to move in", definition: "In eine neue Wohnung oder ein Haus einziehen.", example: "Ben ist offiziell eingezogen." },
      { german: "vorziehen", english: "to bring forward / to prefer", definition: "1. Einen Termin nach vorne verlegen. 2. Etwas lieber mögen.", example: "Frau Krüger zieht den Termin auf elf Uhr vor." },
      { german: "hochziehen", english: "to pull up", definition: "Etwas oder jemanden nach oben ziehen.", example: "Wir müssen die Kartons ins dritte Stockwerk hochziehen." },
      { german: "aufziehen", english: "to tease / to pull open", definition: "1. Jemanden necken, sich lustig machen. 2. Etwas öffnen, indem man daran zieht.", example: "Du ziehst mich doch gerade bloß auf." },
      { german: "wegziehen", english: "to move away", definition: "Einen Ort dauerhaft verlassen.", example: "Ich werde hier so schnell nicht wieder wegziehen." },
      { german: "durchziehen", english: "to see something through", definition: "Etwas konsequent bis zum Ende machen, trotz Schwierigkeiten.", example: "Jetzt ziehen wir das hier durch." },
      { german: "sich unterziehen", english: "to undergo (something unpleasant)", definition: "Etwas Unangenehmes über sich ergehen lassen.", example: "Du siehst aus, als würdest du dich lieber einer Wurzelbehandlung unterziehen." },
    ],
    idioms: [
      { german: "jemanden aufziehen", english: "to tease someone", definition: "Sich über jemanden auf humorvolle Weise lustig machen.", example: "Du ziehst mich doch gerade bloß auf." },
      { german: "die Hütte brennt", english: "there's chaos / an emergency", definition: "Es gibt eine dringende oder chaotische Situation.", example: "Sag bitte nicht, dass im Büro die Hütte brennt." },
      { german: "etwas durchziehen", english: "to follow through with something", definition: "Einen Plan oder eine Aufgabe konsequent zu Ende bringen.", example: "Jetzt ziehen wir das hier durch." },
      { german: "alle Register ziehen", english: "to pull out all the stops", definition: "Alle Möglichkeiten ausschöpfen, um ein Ziel zu erreichen.", example: "Heute müssen wir alle Register ziehen." },
      { german: "Leine ziehen", english: "to clear off / to leave", definition: "Weggehen, verschwinden (umgangssprachlich).", example: "Die Vormieterin soll endlich Leine ziehen." },
      { german: "in die Länge ziehen", english: "to drag out", definition: "Etwas unnötig verlängern.", example: "Der Umzug zieht sich ganz schön in die Länge." },
    ],
    exercises: [
      {
        id: "m1-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Der Umzug».",
        questions: [
          { question: "Warum steht Alex um acht vor Bens Haus?", options: ["Er bringt Post.", "Er hilft Ben beim Umzug.", "Er will Bens alte Wohnung besichtigen.", "Er hat dort einen Termin."], correctIndex: 1 },
          { question: "Was ist das Problem in Bens neuer Wohnung?", options: ["Die Wohnung ist zu klein.", "Ein Fenster lässt sich nicht schließen.", "Es gibt kein fließendes Wasser.", "Die Heizung funktioniert nicht."], correctIndex: 1 },
          { question: "Wer ruft Alex während des Umzugs an?", options: ["Frau Krüger", "Jule", "Mehmet", "Der Hausmeister"], correctIndex: 1 },
          { question: "Was macht die Vormieterin?", options: ["Sie hilft beim Umzug.", "Sie blockiert den Aufzug mit ihren Sachen.", "Sie beschwert sich über den Lärm.", "Sie bringt Kaffee."], correctIndex: 1 },
          { question: "Wie endet der Tag?", options: ["Ben ist eingezogen, wenn auch nicht perfekt.", "Sie geben auf und gehen nach Hause.", "Ben zieht in eine andere Wohnung.", "Der Umzug wird auf morgen verschoben."], correctIndex: 0 },
        ],
      },
      {
        id: "m1-tf-1", type: "true-false", skill: "lesen",
        instruction: "Richtig oder falsch? Entscheide basierend auf der Geschichte.",
        statements: [
          { statement: "Alex hat sich freiwillig für den Umzug freigenommen.", correct: true },
          { statement: "Ben ist schlecht gelaunt am Morgen.", correct: false },
          { statement: "Frau Krüger zieht einen Kundentermin vor.", correct: true },
          { statement: "Das Fenster in der neuen Wohnung funktioniert perfekt.", correct: false },
          { statement: "Mehmet schickt eine Sprachnachricht.", correct: true },
          { statement: "Am Ende des Tages ist der Umzug komplett geschafft.", correct: true },
        ],
      },
      {
        id: "m1-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «ziehen».",
        sentences: [
          { text: "Ben ___ heute in seine neue Wohnung.", answer: "zieht" },
          { text: "Ich ___ mir meine Arbeitshandschuhe an.", answer: "ziehe" },
          { text: "Frau Krüger ___ den Termin auf elf Uhr ___.", answer: "vor" },
          { text: "Die Vormieterin ist noch nicht ganz ___.", answer: "ausgezogen" },
          { text: "Du ___ mich doch gerade bloß ___.", answer: "auf" },
          { text: "Jetzt ___ wir das hier ___.", answer: "durch" },
          { text: "So schnell werde ich hier nicht wieder ___.", answer: "wegziehen" },
        ],
      },
      {
        id: "m1-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "umziehen", right: "die Wohnung wechseln" },
          { left: "jemanden aufziehen", right: "sich über jemanden lustig machen" },
          { left: "etwas durchziehen", right: "konsequent bis zum Ende machen" },
          { left: "einen Termin vorziehen", right: "einen Termin früher stattfinden lassen" },
          { left: "die Hütte brennt", right: "es gibt eine dringende Situation" },
          { left: "Leine ziehen", right: "weggehen, verschwinden" },
        ],
      },
      {
        id: "m1-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle in 4–5 Sätzen: Was passiert in der Geschichte «Der Umzug»? Benutze mindestens 4 Verben mit «ziehen».",
        mustUseWords: ["umziehen", "anziehen", "vorziehen", "durchziehen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Ben zieht heute in seine neue Wohnung um. Sein Freund Alex zieht sich die Arbeitshandschuhe an und hilft ihm. Leider zieht die Chefin einen wichtigen Termin vor. Trotzdem ziehen sie den Umzug gemeinsam durch.",
      },
      {
        id: "m1-speak-2", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe deinen letzten Umzug oder den Umzug eines Freundes. Benutze mindestens 3 Ausdrücke mit «ziehen».",
        mustUseWords: ["einziehen", "ausziehen", "umziehen"],
        instruction: "Sprich frei und verwende die Ausdrücke in ganzen Sätzen.",
        modelAnswer: "Letztes Jahr bin ich umgezogen. Zuerst musste ich aus meiner alten Wohnung ausziehen. Dann bin ich in die neue Wohnung eingezogen. Der Umzug hat sich ganz schön in die Länge gezogen.",
      },
      {
        id: "m1-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über einen chaotischen Umzug. Benutze mindestens 5 Verben mit «ziehen».",
        mustUseWords: ["umziehen", "einziehen", "ausziehen", "anziehen", "durchziehen"],
        instruction: "Schreibe deinen Text unten. Benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzten Samstag bin ich umgezogen. Ich habe mir alte Klamotten angezogen und die ersten Kartons gepackt. Die Vormieterin war noch nicht ganz ausgezogen, das war stressig. Aber wir haben alles durchgezogen und am Abend bin ich endlich in die neue Wohnung eingezogen.",
      },
      {
        id: "m1-write-2", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 4–5 Sätze aus Bens Perspektive über den Umzugstag. Benutze mindestens 3 Redewendungen.",
        mustUseWords: ["die Hütte brennt", "aufziehen", "in die Länge ziehen"],
        instruction: "Schreibe deinen Text unten. Benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Heute war Umzugstag und am Anfang dachte ich, die Hütte brennt. Alex hat mich die ganze Zeit aufgezogen, aber er hat auch richtig angepackt. Der ganze Umzug hat sich leider ziemlich in die Länge gezogen, weil die Vormieterin ihre Sachen noch nicht weggeräumt hatte.",
      },
    ],
  },

  // ============ MODULE 2: Alles mitgebracht (bringen) ============
  {
    id: 2,
    slug: "alles-mitgebracht",
    title: "Alles mitgebracht?",
    subtitle: "bringen – mitbringen, anbringen und beibringen",
    focusVerb: "bringen",
    headerImage: "/images/story-02.svg",
    learningGoals: [
      "Trennbare und untrennbare Verben mit «bringen» verwenden",
      "Redewendungen mit «bringen» im Kontext erkennen",
      "Über Geburtstage und Überraschungen sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "mitbringen", english: "to bring along", definition: "Etwas zu einem bestimmten Ort oder einer Person mitnehmen.", example: "Was bringst du zur Party mit?" },
      { german: "beibringen", english: "to teach / to break news", definition: "1. Jemandem etwas lehren. 2. Jemandem eine unangenehme Nachricht übermitteln.", example: "Wer bringt ihr das bei?" },
      { german: "anbringen", english: "to attach / to mount", definition: "Etwas an einer Stelle befestigen.", example: "Wir haben das Schild an der Tür angebracht." },
      { german: "aufbringen", english: "to raise (money, energy) / to upset", definition: "1. Geld oder Kraft aufwenden. 2. Jemanden verärgern.", example: "Ich kann die Energie dafür kaum aufbringen." },
      { german: "unterbringen", english: "to accommodate / to put away", definition: "Etwas oder jemanden an einem Platz unterbringen.", example: "Wo sollen wir die Geschenke unterbringen?" },
      { german: "rüberbringen", english: "to get across (a message)", definition: "Eine Botschaft oder Idee verständlich vermitteln.", example: "Hast du die Nachricht gut rübergebracht?" },
      { german: "umbringen", english: "to kill (coll.: to drive crazy)", definition: "Umgangssprachlich: jemanden wahnsinnig machen. Wörtlich: töten.", example: "Die Warterei bringt mich fast um!" },
      { german: "durcheinanderbringen", english: "to mix up / confuse", definition: "Jemanden verwirren oder etwas in Unordnung bringen.", example: "Jetzt hast du mich total durcheinandergebracht." },
    ],
    idioms: [
      { german: "jemanden auf die Palme bringen", english: "to drive someone up the wall", definition: "Jemanden sehr wütend oder gereizt machen.", example: "Das bringt mich echt auf die Palme!" },
      { german: "etwas auf den Punkt bringen", english: "to get to the point", definition: "Etwas klar und präzise zusammenfassen.", example: "Bring es bitte auf den Punkt." },
      { german: "jemanden zum Lachen bringen", english: "to make someone laugh", definition: "Jemanden unterhalten, sodass er lacht.", example: "Ben bringt alle zum Lachen." },
      { german: "etwas in Ordnung bringen", english: "to sort something out", definition: "Ein Problem lösen oder etwas wieder in Ordnung bringen.", example: "Wir bringen das schon in Ordnung." },
      { german: "keinen Wirbel machen", english: "to not make a fuss", definition: "Kein großes Aufheben um etwas machen.", example: "Sie sagt, wir sollen keinen Wirbel machen." },
    ],
    exercises: [
      {
        id: "m2-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Alles mitgebracht?».",
        questions: [
          { question: "Wessen Geburtstag ist es?", options: ["Alex", "Jule", "Ben", "Mehmet"], correctIndex: 1 },
          { question: "Was wollen die Kollegen für Jule machen?", options: ["Eine große Party organisieren", "Eine nette Geste: Kaffee, Kuchen, zehn Minuten Pause", "Einen Ausflug planen", "Blumen kaufen"], correctIndex: 1 },
          { question: "Was sagt Jule über ihren Geburtstag?", options: ["Sie freut sich auf die Party.", "Sie will keinen Wirbel.", "Sie hat Urlaub genommen.", "Sie feiert nicht."], correctIndex: 1 },
        ],
      },
      {
        id: "m2-tf-1", type: "true-false", skill: "lesen",
        instruction: "Richtig oder falsch?",
        statements: [
          { statement: "Jule will, dass die Kollegen viel Aufwand betreiben.", correct: false },
          { statement: "Die Überraschung beinhaltet Kaffee und Kuchen.", correct: true },
          { statement: "Jule hat seit Tagen gesagt, man soll keinen Wirbel machen.", correct: true },
          { statement: "Die Kollegen ignorieren Jules Wunsch komplett.", correct: false },
        ],
      },
      {
        id: "m2-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «bringen».",
        sentences: [
          { text: "Was hast du zur Party ___?", answer: "mitgebracht" },
          { text: "Wer ___ ihr die Nachricht bei?", answer: "bringt" },
          { text: "Das ___ mich echt auf die Palme.", answer: "bringt" },
          { text: "Kannst du das bitte auf den Punkt ___?", answer: "bringen" },
          { text: "Ben ___ alle zum Lachen.", answer: "bringt" },
          { text: "Wir ___ das schon in Ordnung.", answer: "bringen" },
        ],
      },
      {
        id: "m2-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "auf die Palme bringen", right: "jemanden sehr wütend machen" },
          { left: "auf den Punkt bringen", right: "etwas klar zusammenfassen" },
          { left: "zum Lachen bringen", right: "jemanden unterhalten" },
          { left: "in Ordnung bringen", right: "ein Problem lösen" },
          { left: "durcheinanderbringen", right: "jemanden verwirren" },
          { left: "rüberbringen", right: "eine Botschaft vermitteln" },
        ],
      },
      {
        id: "m2-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle in 4–5 Sätzen: Was passiert in der Geschichte? Benutze mindestens 3 Verben mit «bringen».",
        mustUseWords: ["mitbringen", "beibringen", "auf die Palme bringen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Jule hat Geburtstag und die Kollegen bringen Kaffee und Kuchen mit. Niemand weiß, wie man ihr die Überraschung beibringen soll. Als der Plan fast schiefgeht, bringt das alle fast auf die Palme.",
      },
      {
        id: "m2-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über eine Geburtstagsüberraschung. Benutze mindestens 4 Ausdrücke mit «bringen».",
        mustUseWords: ["mitbringen", "zum Lachen bringen", "in Ordnung bringen", "auf den Punkt bringen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Letzte Woche hatten wir eine Geburtstagsüberraschung für Jule geplant. Alle sollten etwas mitbringen. Ben hat versucht, Jule zum Lachen zu bringen, während wir alles vorbereitet haben. Am Ende hat Jule gesagt, wir sollen es auf den Punkt bringen und einfach feiern. Und wir haben alles in Ordnung gebracht.",
      },
    ],
  },

  // ============ MODULE 3: Man nehme, so man hat (nehmen) ============
  {
    id: 3,
    slug: "man-nehme",
    title: "Man nehme, so man hat",
    subtitle: "nehmen – annehmen, festnehmen und mitnehmen",
    focusVerb: "nehmen",
    headerImage: "/images/story-03.svg",
    learningGoals: [
      "Trennbare Verben mit «nehmen» verwenden",
      "Redewendungen mit «nehmen» im Kontext erkennen",
      "Über Spieleabende und geselliges Beisammensein sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "mitnehmen", english: "to take along", definition: "Etwas oder jemanden an einen anderen Ort bringen.", example: "Ich bringe Wein und ein Spiel mit." },
      { german: "annehmen", english: "to accept / to assume", definition: "1. Etwas akzeptieren. 2. Vermuten.", example: "Ich nehme an, dass alle kommen." },
      { german: "zunehmen", english: "to increase / gain weight", definition: "Mehr werden, sich vergrößern.", example: "Die Lautstärke nimmt zu." },
      { german: "abnehmen", english: "to decrease / to take off / to answer phone", definition: "1. Weniger werden. 2. Etwas entfernen. 3. Ans Telefon gehen.", example: "Nimm doch mal das Telefon ab!" },
      { german: "aufnehmen", english: "to record / take in / absorb", definition: "1. Etwas registrieren. 2. Jemanden empfangen.", example: "Wir nehmen jeden herzlich auf." },
      { german: "vornehmen", english: "to plan to do / intend", definition: "Sich etwas fest planen oder beabsichtigen.", example: "Ich habe mir vorgenommen, heute früh zu kochen." },
      { german: "in Anspruch nehmen", english: "to make use of / to take up", definition: "Zeit, Ressourcen oder einen Service nutzen.", example: "Das Kochen nimmt mehr Zeit in Anspruch als geplant." },
      { german: "übernehmen", english: "to take over", definition: "Eine Aufgabe oder Verantwortung von jemandem anderen übernehmend.", example: "Ben übernimmt das Schneiden." },
    ],
    idioms: [
      { german: "sich kein Blatt vor den Mund nehmen", english: "to not mince words", definition: "Direkt und offen sagen, was man denkt.", example: "Ben nimmt sich kein Blatt vor den Mund." },
      { german: "etwas in Kauf nehmen", english: "to accept a disadvantage", definition: "Einen Nachteil bewusst akzeptieren.", example: "Die Verspätung nehmen wir in Kauf." },
      { german: "jemanden auf den Arm nehmen", english: "to pull someone's leg", definition: "Jemanden scherzhaft täuschen oder veralbern.", example: "Du nimmst mich doch auf den Arm!" },
      { german: "Rücksicht nehmen", english: "to be considerate", definition: "Auf die Bedürfnisse anderer achten.", example: "Nimm bitte Rücksicht auf die Nachbarn." },
      { german: "ein Selbstläufer", english: "a sure thing / runs itself", definition: "Etwas, das von selbst klappt, ohne großen Aufwand.", example: "Eigentlich ein Selbstläufer." },
    ],
    exercises: [
      {
        id: "m3-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Man nehme, so man hat».",
        questions: [
          { question: "Was ist heute bei Alex geplant?", options: ["Ein Umzug", "Ein Spieleabend", "Ein Geburtstag", "Ein Meeting"], correctIndex: 1 },
          { question: "Was bringt Ben mit?", options: ["Pizza und Cola", "Wein und ein Spiel", "Kuchen und Kaffee", "Nichts"], correctIndex: 1 },
          { question: "Warum ist der Abend 'ein Selbstläufer'?", options: ["Weil das Essen bestellt wird", "Weil man nur kochen, lachen und spielen muss", "Weil Ben alles organisiert", "Weil es eine App gibt"], correctIndex: 1 },
        ],
      },
      {
        id: "m3-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «nehmen».",
        sentences: [
          { text: "Ich habe mir ___, heute früh zu kochen.", answer: "vorgenommen" },
          { text: "Das Kochen ___ mehr Zeit in ___ als geplant.", answer: "Anspruch" },
          { text: "Ben ___ sich kein Blatt vor den Mund.", answer: "nimmt" },
          { text: "Die Verspätung ___ wir in Kauf.", answer: "nehmen" },
          { text: "Du ___ mich doch auf den Arm!", answer: "nimmst" },
        ],
      },
      {
        id: "m3-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "mitnehmen", right: "etwas an einen anderen Ort bringen" },
          { left: "vornehmen", right: "sich etwas fest planen" },
          { left: "in Kauf nehmen", right: "einen Nachteil akzeptieren" },
          { left: "auf den Arm nehmen", right: "jemanden scherzhaft veralbern" },
          { left: "Rücksicht nehmen", right: "auf andere achten" },
          { left: "kein Blatt vor den Mund nehmen", right: "direkt sagen, was man denkt" },
        ],
      },
      {
        id: "m3-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle über einen Spieleabend oder Abend mit Freunden. Benutze mindestens 3 Ausdrücke mit «nehmen».",
        mustUseWords: ["mitnehmen", "vornehmen", "in Kauf nehmen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzte Woche habe ich mir vorgenommen, einen Spieleabend zu organisieren. Alle haben etwas zum Essen mitgenommen. Dass es etwas lauter wurde, haben die Nachbarn zum Glück in Kauf genommen.",
      },
      {
        id: "m3-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über einen Abend mit Freunden. Benutze mindestens 4 Ausdrücke mit «nehmen».",
        mustUseWords: ["mitnehmen", "vornehmen", "übernehmen", "annehmen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Ich habe mir vorgenommen, einen Kochabend zu organisieren. Alle sollten eine Zutat mitnehmen. Ben hat angenommen, dass ich alles plane, aber Jule hat das Dessert übernommen. Am Ende war der Abend perfekt.",
      },
    ],
  },

  // ============ MODULE 4: Genau an diese Stelle (stellen) ============
  {
    id: 4,
    slug: "genau-an-diese-stelle",
    title: "Genau an diese Stelle",
    subtitle: "stellen – hinstellen, vorstellen und einstellen",
    focusVerb: "stellen",
    headerImage: "/images/story-04.svg",
    learningGoals: [
      "Trennbare Verben mit «stellen» verwenden",
      "Redewendungen mit «stellen» im Kontext erkennen",
      "Über Büro-Alltag und Logistik sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "hinstellen", english: "to put/place somewhere", definition: "Etwas an einen bestimmten Platz stellen.", example: "Stell die Kiste genau hier hin." },
      { german: "abstellen", english: "to park / to put down / to turn off", definition: "1. Ein Fahrzeug parken. 2. Etwas ablegen. 3. Ein Gerät ausschalten.", example: "Einer der Monteure hat den Hubwagen vor der Tür abgestellt." },
      { german: "aufstellen", english: "to set up / to erect", definition: "Etwas errichten oder an einem Platz positionieren.", example: "Wir müssen die Regale aufstellen." },
      { german: "vorstellen", english: "to introduce / to imagine", definition: "1. Jemanden bekannt machen. 2. Sich etwas denken.", example: "Ich kann mir vorstellen, dass das stressig ist." },
      { german: "einstellen", english: "to hire / to adjust / to stop", definition: "1. Jemanden anstellen. 2. Etwas regulieren. 3. Eine Tätigkeit beenden.", example: "Die Firma hat zwei neue Leute eingestellt." },
      { german: "feststellen", english: "to determine / notice", definition: "Etwas bemerken oder herausfinden.", example: "Ich stelle fest, dass etwas nicht stimmt." },
      { german: "sicherstellen", english: "to ensure / make sure", definition: "Dafür sorgen, dass etwas passiert oder gesichert ist.", example: "Wir müssen sicherstellen, dass alles rechtzeitig fertig ist." },
    ],
    idioms: [
      { german: "jemanden vor vollendete Tatsachen stellen", english: "to present someone with a fait accompli", definition: "Jemanden mit einer fertigen Entscheidung konfrontieren, ohne ihn vorher einzubeziehen.", example: "Die Monteure haben uns vor vollendete Tatsachen gestellt." },
      { german: "sich dumm stellen", english: "to play dumb", definition: "So tun, als ob man nichts wüsste.", example: "Stell dich nicht dumm." },
      { german: "die Weichen stellen", english: "to set the course", definition: "Die Grundlagen für eine zukünftige Entwicklung legen.", example: "Jetzt werden die Weichen gestellt." },
      { german: "eine Frage stellen", english: "to ask a question", definition: "Eine Frage formulieren.", example: "Darf ich eine Frage stellen?" },
    ],
    exercises: [
      {
        id: "m4-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte.",
        questions: [
          { question: "Was steht vor der Bürotür?", options: ["Ein LKW", "Zwei Europaletten und ein Hubwagen", "Ein Schreibtisch", "Kartons"], correctIndex: 1 },
          { question: "Wer hat den Hubwagen abgestellt?", options: ["Alex", "Einer der Monteure", "Der Hausmeister", "Frau Krüger"], correctIndex: 1 },
        ],
      },
      {
        id: "m4-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «stellen».",
        sentences: [
          { text: "Er hat den Hubwagen vor der Tür ___.", answer: "abgestellt" },
          { text: "Ich ___ fest, dass etwas nicht stimmt.", answer: "stelle" },
          { text: "Wir müssen ___, dass alles rechtzeitig kommt.", answer: "sicherstellen" },
          { text: "Die Firma hat neue Leute ___.", answer: "eingestellt" },
          { text: "Stell dich nicht ___.", answer: "dumm" },
        ],
      },
      {
        id: "m4-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "hinstellen", right: "an einen bestimmten Platz stellen" },
          { left: "feststellen", right: "bemerken oder herausfinden" },
          { left: "sich dumm stellen", right: "so tun, als ob man nichts weiß" },
          { left: "die Weichen stellen", right: "Grundlagen für die Zukunft legen" },
          { left: "vor vollendete Tatsachen stellen", right: "mit einer fertigen Entscheidung konfrontieren" },
        ],
      },
      {
        id: "m4-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe eine Situation bei der Arbeit, in der etwas am falschen Platz war. Benutze «stellen»-Verben.",
        mustUseWords: ["hinstellen", "abstellen", "feststellen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Als ich im Büro ankam, stellte ich fest, dass jemand einen Wagen vor der Tür abgestellt hatte. Ich habe ihn gebeten, den Wagen woanders hinzustellen. Am Ende hat er ihn im Hof abgestellt.",
      },
      {
        id: "m4-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über einen chaotischen Tag im Büro. Benutze mindestens 4 Ausdrücke mit «stellen».",
        mustUseWords: ["feststellen", "sicherstellen", "hinstellen", "abstellen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Heute Morgen habe ich festgestellt, dass vor dem Büro ein Transporter abgestellt wurde. Die Monteure haben alles einfach vor die Tür hingestellt. Ich musste sicherstellen, dass wir trotzdem arbeiten konnten.",
      },
    ],
  },

  // ============ MODULE 5: Einfach drüberstehen (stehen) ============
  {
    id: 5,
    slug: "einfach-drueberstehen",
    title: "Einfach drüberstehen",
    subtitle: "stehen – bestehen, verstehen und drüberstehen",
    focusVerb: "stehen",
    headerImage: "/images/story-05.svg",
    learningGoals: [
      "Verben mit «stehen» in verschiedenen Kontexten verwenden",
      "Redewendungen mit «stehen» erkennen und anwenden",
      "Über Café-Gespräche und Meinungen sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "drüberstehen", english: "to be above it / to not let it bother you", definition: "Sich von etwas nicht beeinflussen oder ärgern lassen.", example: "Man muss einfach drüberstehen." },
      { german: "verstehen", english: "to understand", definition: "Den Sinn von etwas begreifen.", example: "Ich verstehe nicht, was du meinst." },
      { german: "bestehen", english: "to pass (exam) / to insist / to exist", definition: "1. Eine Prüfung schaffen. 2. Auf etwas bestehen. 3. Existieren.", example: "Er besteht darauf, alles selber zu machen." },
      { german: "aufstehen", english: "to stand up / get up", definition: "Sich erheben, aus dem Bett aufstehen.", example: "Ich bin heute früh aufgestanden." },
      { german: "anstehen", english: "to stand in line / to be upcoming", definition: "1. In einer Schlange warten. 2. Bevorstehen.", example: "Ich stelle mich hinten an." },
      { german: "bevorstehen", english: "to be imminent", definition: "In naher Zukunft geschehen.", example: "Eine schwierige Woche steht bevor." },
      { german: "zugestehen", english: "to concede / to grant", definition: "Jemandem ein Recht oder eine Möglichkeit einräumen.", example: "Das muss man ihm zugestehen." },
    ],
    idioms: [
      { german: "auf dem Schlauch stehen", english: "to not get it", definition: "Etwas nicht verstehen, begriffsstutzig sein.", example: "Ich stehe gerade völlig auf dem Schlauch." },
      { german: "jemandem gut stehen", english: "to suit someone", definition: "Jemandem gut aussehen (bei Kleidung, Frisur).", example: "Die Jacke steht dir gut." },
      { german: "im Raum stehen", english: "to be unaddressed (an issue)", definition: "Ein Thema, das noch nicht angesprochen wurde, aber spürbar ist.", example: "Die Frage steht im Raum." },
      { german: "Rede und Antwort stehen", english: "to answer for something", definition: "Für sein Handeln Rechenschaft ablegen.", example: "Er muss Rede und Antwort stehen." },
    ],
    exercises: [
      {
        id: "m5-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte.",
        questions: [
          { question: "Wo trifft Alex Ben?", options: ["Im Büro", "Im Café", "Im Park", "Zu Hause"], correctIndex: 1 },
          { question: "Was macht Ben, als Alex ankommt?", options: ["Er winkt.", "Er schaut aufs Smartphone.", "Er bestellt Kaffee.", "Er liest ein Buch."], correctIndex: 1 },
        ],
      },
      {
        id: "m5-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «stehen».",
        sentences: [
          { text: "Man muss einfach ___.", answer: "drüberstehen" },
          { text: "Ich ___ gerade völlig auf dem Schlauch.", answer: "stehe" },
          { text: "Die Frage ___ im Raum.", answer: "steht" },
          { text: "Eine schwierige Entscheidung ___ bevor.", answer: "steht" },
          { text: "Er ___ darauf, alles selbst zu machen.", answer: "besteht" },
        ],
      },
      {
        id: "m5-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "drüberstehen", right: "sich nicht ärgern lassen" },
          { left: "auf dem Schlauch stehen", right: "etwas nicht verstehen" },
          { left: "im Raum stehen", right: "ein noch unbesprochenes Thema" },
          { left: "anstehen", right: "in einer Schlange warten" },
          { left: "bevorstehen", right: "bald passieren" },
        ],
      },
      {
        id: "m5-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe eine Situation, in der du einfach drüberstehen musstest. Benutze mindestens 3 «stehen»-Ausdrücke.",
        mustUseWords: ["drüberstehen", "verstehen", "auf dem Schlauch stehen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzte Woche hat mich ein Kollege kritisiert. Erst stand ich auf dem Schlauch und habe nicht verstanden, warum. Dann habe ich gemerkt, dass ich einfach drüberstehen muss.",
      },
      {
        id: "m5-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über ein Café-Gespräch. Benutze mindestens 4 Ausdrücke mit «stehen».",
        mustUseWords: ["anstehen", "drüberstehen", "verstehen", "im Raum stehen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Als ich ins Café kam, musste ich erst anstehen. Ben war schon da und wir haben über die Arbeit geredet. Eine unangenehme Frage stand im Raum, aber Ben hat gesagt, man muss einfach drüberstehen. Ich habe sofort verstanden, was er meinte.",
      },
    ],
  },

  // ============ MODULE 6: Viele Übergaben (geben) ============
  {
    id: 6,
    slug: "viele-uebergaben",
    title: "Viele Übergaben",
    subtitle: "geben – übergeben, abgeben und nachgeben",
    focusVerb: "geben",
    headerImage: "/images/story-06.svg",
    learningGoals: [
      "Trennbare Verben mit «geben» verwenden",
      "Redewendungen mit «geben» erkennen",
      "Über Arbeitsübergaben sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "übergeben", english: "to hand over", definition: "Etwas offiziell an jemand anderen weitergeben.", example: "Ich übergebe die Aufgabe an Jule." },
      { german: "abgeben", english: "to hand in / to give away", definition: "Etwas einreichen oder jemandem geben.", example: "Ich muss den Bericht bis Freitag abgeben." },
      { german: "nachgeben", english: "to give in", definition: "Seinen Widerstand aufgeben und zustimmen.", example: "Am Ende hat er nachgegeben." },
      { german: "angeben", english: "to show off / to state", definition: "1. Prahlen. 2. Informationen nennen.", example: "Bitte geben Sie Ihren Namen an." },
      { german: "aufgeben", english: "to give up / to post", definition: "1. Nicht mehr weitermachen. 2. Einen Brief aufgeben.", example: "Ich gebe nicht auf!" },
      { german: "zugeben", english: "to admit", definition: "Eingestehen, dass etwas wahr ist.", example: "Er gibt zu, dass er einen Fehler gemacht hat." },
      { german: "vorgeben", english: "to pretend / to specify", definition: "1. So tun als ob. 2. Etwas bestimmen.", example: "Sie gibt vor, alles zu wissen." },
    ],
    idioms: [
      { german: "den Ton angeben", english: "to set the tone", definition: "Die Richtung oder Stimmung bestimmen.", example: "Frau Krüger gibt hier den Ton an." },
      { german: "sich die Klinke in die Hand geben", english: "to come and go in quick succession", definition: "Wenn viele Leute schnell nacheinander kommen und gehen.", example: "Heute geben sich die Kunden die Klinke in die Hand." },
      { german: "es gibt", english: "there is/are", definition: "Ausdrücken, dass etwas existiert oder vorhanden ist.", example: "Es gibt heute viel zu tun." },
      { german: "Gas geben", english: "to step on it / hurry up", definition: "Schneller machen, sich beeilen.", example: "Wir müssen jetzt Gas geben!" },
    ],
    exercises: [
      {
        id: "m6-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Viele Übergaben».",
        questions: [
          { question: "Wie riecht das Büro am Dienstagmorgen?", options: ["Nach Essen", "Nach frischem Kaffee", "Nach Farbe", "Nach Rauch"], correctIndex: 1 },
          { question: "Wie ist das Wetter?", options: ["Es regnet.", "Es scheint die Sonne.", "Es schneit.", "Es ist neblig."], correctIndex: 1 },
        ],
      },
      {
        id: "m6-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «geben».",
        sentences: [
          { text: "Ich ___ die Aufgabe an Jule.", answer: "übergebe" },
          { text: "Am Ende hat er ___.", answer: "nachgegeben" },
          { text: "Er ___ zu, dass er einen Fehler gemacht hat.", answer: "gibt" },
          { text: "Frau Krüger ___ hier den Ton an.", answer: "gibt" },
          { text: "Wir müssen jetzt Gas ___!", answer: "geben" },
        ],
      },
      {
        id: "m6-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "übergeben", right: "offiziell an jemanden weitergeben" },
          { left: "aufgeben", right: "nicht mehr weitermachen" },
          { left: "zugeben", right: "eingestehen, dass etwas wahr ist" },
          { left: "den Ton angeben", right: "die Richtung bestimmen" },
          { left: "Gas geben", right: "sich beeilen" },
        ],
      },
      {
        id: "m6-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle über einen Tag mit vielen Übergaben bei der Arbeit. Benutze mindestens 3 «geben»-Ausdrücke.",
        mustUseWords: ["übergeben", "abgeben", "aufgeben"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzte Woche musste ich viele Aufgaben übergeben, weil ein Kollege im Urlaub war. Ich habe den Bericht rechtzeitig abgegeben. Obwohl es stressig war, habe ich nicht aufgegeben.",
      },
      {
        id: "m6-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über eine stressige Arbeitsübergabe. Benutze mindestens 4 «geben»-Verben.",
        mustUseWords: ["übergeben", "abgeben", "nachgeben", "zugeben"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Am Freitag musste ich alle meine Projekte übergeben. Ich habe die Berichte pünktlich abgegeben. Mein Kollege wollte die Verantwortung nicht übernehmen, aber am Ende hat er nachgegeben. Ich muss zugeben, dass ich erleichtert war.",
      },
    ],
  },

  // ============ MODULE 7: Setz dich dazu (setzen) ============
  {
    id: 7,
    slug: "setz-dich-dazu",
    title: "Setz dich dazu",
    subtitle: "setzen – einsetzen, umsetzen und sich durchsetzen",
    focusVerb: "setzen",
    headerImage: "/images/story-07.svg",
    learningGoals: [
      "Trennbare Verben mit «setzen» verwenden",
      "Redewendungen mit «setzen» erkennen",
      "Über soziale Situationen und Begegnungen sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "sich hinsetzen", english: "to sit down", definition: "Sich auf einen Stuhl, eine Bank oder den Boden setzen.", example: "Setz dich doch hin." },
      { german: "umsetzen", english: "to implement / to realize", definition: "Eine Idee oder einen Plan in die Tat umsetzen.", example: "Wir müssen den Plan umsetzen." },
      { german: "einsetzen", english: "to deploy / to use", definition: "Etwas oder jemanden gezielt verwenden.", example: "Wir setzen neue Technik ein." },
      { german: "sich durchsetzen", english: "to assert oneself", definition: "Seine Meinung oder Position erfolgreich vertreten.", example: "Am Ende hat sich Jule durchgesetzt." },
      { german: "voraussetzen", english: "to presuppose / to require", definition: "Etwas als gegeben oder notwendig annehmen.", example: "Das setzt Erfahrung voraus." },
      { german: "fortsetzen", english: "to continue", definition: "Etwas weiterführen, das unterbrochen wurde.", example: "Wir setzen die Diskussion morgen fort." },
      { german: "übersetzen", english: "to translate", definition: "Einen Text von einer Sprache in eine andere übertragen.", example: "Können Sie das bitte übersetzen?" },
    ],
    idioms: [
      { german: "sich in die Nesseln setzen", english: "to put oneself in a difficult position", definition: "Sich selbst in eine unangenehme Lage bringen.", example: "Da habe ich mich ganz schön in die Nesseln gesetzt." },
      { german: "alles auf eine Karte setzen", english: "to put all eggs in one basket", definition: "Alles auf eine einzige Möglichkeit setzen – riskant.", example: "Er setzt alles auf eine Karte." },
      { german: "jemandem zusetzen", english: "to take a toll on someone", definition: "Jemanden unter Druck setzen oder belasten.", example: "Die Arbeit setzt mir ganz schön zu." },
    ],
    exercises: [
      {
        id: "m7-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Setz dich dazu».",
        questions: [
          { question: "Was will Alex am Samstagabend machen?", options: ["Arbeiten", "Einen Spaziergang machen", "Fernsehen", "Kochen"], correctIndex: 1 },
          { question: "Wie war die Woche im Büro?", options: ["Entspannt", "Langweilig", "Zäh und stressig", "Es gab keine Arbeit"], correctIndex: 2 },
        ],
      },
      {
        id: "m7-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «setzen».",
        sentences: [
          { text: "___ dich doch hin.", answer: "Setz" },
          { text: "Wir müssen den Plan ___.", answer: "umsetzen" },
          { text: "Am Ende hat sich Jule ___.", answer: "durchgesetzt" },
          { text: "Die Arbeit ___ mir ganz schön zu.", answer: "setzt" },
          { text: "Er ___ alles auf eine Karte.", answer: "setzt" },
        ],
      },
      {
        id: "m7-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "umsetzen", right: "eine Idee in die Tat umsetzen" },
          { left: "sich durchsetzen", right: "seine Meinung erfolgreich vertreten" },
          { left: "einsetzen", right: "gezielt verwenden" },
          { left: "sich in die Nesseln setzen", right: "sich in eine schwierige Lage bringen" },
          { left: "jemandem zusetzen", right: "jemanden belasten" },
        ],
      },
      {
        id: "m7-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle von einer Situation, in der du dich durchsetzen musstest. Benutze «setzen»-Verben.",
        mustUseWords: ["sich durchsetzen", "umsetzen", "einsetzen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Bei einem Projekt musste ich mich durchsetzen, weil ich eine bessere Idee hatte. Wir haben sie dann gemeinsam umgesetzt. Dabei haben wir auch neue Tools eingesetzt.",
      },
      {
        id: "m7-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über eine Begegnung an einem öffentlichen Ort. Benutze mindestens 4 «setzen»-Ausdrücke.",
        mustUseWords: ["sich hinsetzen", "fortsetzen", "umsetzen", "durchsetzen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Am Samstagabend bin ich spazieren gegangen und habe mich auf eine Bank hingesetzt. Neben mir saß jemand, und wir haben angefangen zu reden. Wir haben das Gespräch lange fortgesetzt. Er hat mir erzählt, wie er seine Ideen im Job umsetzt und sich dabei immer durchsetzt.",
      },
    ],
  },

  // ============ MODULE 8: Liegt alles bereit? (legen) ============
  {
    id: 8,
    slug: "liegt-alles-bereit",
    title: "Liegt alles bereit?",
    subtitle: "legen – anlegen, festlegen und auslegen",
    focusVerb: "legen",
    headerImage: "/images/story-08.svg",
    learningGoals: [
      "Trennbare Verben mit «legen» verwenden",
      "Redewendungen mit «legen» erkennen",
      "Über Messestände und Vorbereitung sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "bereitlegen", english: "to lay out / prepare", definition: "Etwas vorbereiten und griffbereit hinlegen.", example: "Liegt alles bereit?" },
      { german: "festlegen", english: "to determine / to set", definition: "Etwas verbindlich bestimmen.", example: "Wir haben den Termin festgelegt." },
      { german: "auslegen", english: "to lay out / to interpret", definition: "1. Etwas zur Ansicht hinlegen. 2. Etwas auf eine bestimmte Weise interpretieren.", example: "Wir legen die Broschüren aus." },
      { german: "anlegen", english: "to invest / to put on / to create", definition: "1. Geld investieren. 2. Etwas anziehen. 3. Eine Datei erstellen.", example: "Wir legen eine neue Liste an." },
      { german: "nahelegen", english: "to suggest / recommend", definition: "Jemandem etwas empfehlen oder vorschlagen.", example: "Die Ergebnisse legen nahe, dass wir den Plan ändern sollten." },
      { german: "vorlegen", english: "to present / submit", definition: "Etwas offiziell zeigen oder einreichen.", example: "Ich lege den Bericht morgen vor." },
      { german: "sich hinlegen", english: "to lie down", definition: "Sich zum Ausruhen oder Schlafen flach hinlegen.", example: "Ich muss mich kurz hinlegen." },
    ],
    idioms: [
      { german: "jemandem das Handwerk legen", english: "to put a stop to someone's activities", definition: "Jemanden daran hindern, etwas (Schlechtes) weiterzumachen.", example: "Der Chef hat ihm das Handwerk gelegt." },
      { german: "sich ins Zeug legen", english: "to make an effort / to go all out", definition: "Sich sehr anstrengen.", example: "Wir legen uns heute richtig ins Zeug." },
      { german: "den Finger in die Wunde legen", english: "to put one's finger on the problem", definition: "Ein unangenehmes Problem direkt ansprechen.", example: "Sie legt den Finger genau in die Wunde." },
    ],
    exercises: [
      {
        id: "m8-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte.",
        questions: [
          { question: "Wo spielt die Geschichte?", options: ["Im Büro", "Auf einer Messe", "Im Café", "Zu Hause"], correctIndex: 1 },
          { question: "Was machen die Menschen auf der Messe?", options: ["Sie feiern.", "Sie gehen mit Kaffeebechern und Stofftaschen vorbei.", "Sie schlafen.", "Sie kochen."], correctIndex: 1 },
        ],
      },
      {
        id: "m8-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «legen».",
        sentences: [
          { text: "___ alles bereit?", answer: "Liegt" },
          { text: "Wir haben den Termin ___.", answer: "festgelegt" },
          { text: "Wir ___ die Broschüren aus.", answer: "legen" },
          { text: "Wir ___ uns heute richtig ins Zeug.", answer: "legen" },
          { text: "Ich muss mich kurz ___.", answer: "hinlegen" },
        ],
      },
      {
        id: "m8-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "festlegen", right: "verbindlich bestimmen" },
          { left: "auslegen", right: "zur Ansicht hinlegen oder interpretieren" },
          { left: "sich ins Zeug legen", right: "sich sehr anstrengen" },
          { left: "das Handwerk legen", right: "jemanden stoppen" },
          { left: "nahelegen", right: "empfehlen oder vorschlagen" },
        ],
      },
      {
        id: "m8-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe Vorbereitungen für eine Messe oder Veranstaltung. Benutze «legen»-Ausdrücke.",
        mustUseWords: ["bereitlegen", "auslegen", "sich ins Zeug legen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Für die Messe haben wir alles bereitgelegt. Die Broschüren haben wir am Stand ausgelegt. Das ganze Team hat sich richtig ins Zeug gelegt.",
      },
      {
        id: "m8-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über die Vorbereitung einer Veranstaltung. Benutze mindestens 4 «legen»-Ausdrücke.",
        mustUseWords: ["bereitlegen", "festlegen", "auslegen", "vorlegen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Die Messe steht vor der Tür und wir haben alles bereitgelegt. Der Termin war schon vor Wochen festgelegt. Am Stand haben wir Flyer und Broschüren ausgelegt. Den fertigen Messebericht lege ich nächste Woche vor.",
      },
    ],
  },

  // ============ MODULE 9: Endlich runterkommen (kommen) ============
  {
    id: 9,
    slug: "endlich-runterkommen",
    title: "Endlich runterkommen",
    subtitle: "kommen – ankommen, mitkommen und runterkommen",
    focusVerb: "kommen",
    headerImage: "/images/story-09.svg",
    learningGoals: [
      "Trennbare Verben mit «kommen» verwenden",
      "Redewendungen mit «kommen» erkennen",
      "Über Feierabend und Erholung sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "runterkommen", english: "to wind down / to relax", definition: "Sich nach Stress entspannen.", example: "Ich will dieses Wochenende wirklich runterkommen." },
      { german: "ankommen", english: "to arrive", definition: "An einem Ziel eintreffen.", example: "Wann kommst du an?" },
      { german: "mitkommen", english: "to come along / to keep up", definition: "1. Jemanden begleiten. 2. Etwas verstehen.", example: "Kommst du mit?" },
      { german: "zurechtkommen", english: "to cope / manage", definition: "Mit einer Situation umgehen können.", example: "Ich komme damit zurecht." },
      { german: "rauskommen", english: "to come out / to emerge", definition: "1. Herauskommen. 2. Veröffentlicht werden.", example: "Was ist am Ende dabei rausgekommen?" },
      { german: "dazukommen", english: "to be added / to arrive", definition: "1. Zusätzlich auftreten. 2. Dazu eintreffen.", example: "Es kommt noch etwas dazu." },
      { german: "vorkommen", english: "to occur / to seem", definition: "1. Passieren, geschehen. 2. Jemandem so erscheinen.", example: "Das kommt mir komisch vor." },
    ],
    idioms: [
      { german: "auf keinen grünen Zweig kommen", english: "to not make any progress", definition: "Keinen Erfolg haben, nicht vorankommen.", example: "Mit dem Projekt komme ich auf keinen grünen Zweig." },
      { german: "zu kurz kommen", english: "to miss out / to not get enough", definition: "Weniger bekommen, als man verdient.", example: "Die Freizeit kommt bei mir zu kurz." },
      { german: "auf den Geschmack kommen", english: "to get a taste for something", definition: "Anfangen, etwas gut zu finden.", example: "Ich bin auf den Geschmack gekommen." },
      { german: "jemandem entgegenkommen", english: "to accommodate / to meet halfway", definition: "Jemandem einen Kompromiss anbieten.", example: "Mein Chef ist mir entgegengekommen." },
    ],
    exercises: [
      {
        id: "m9-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte.",
        questions: [
          { question: "Wann spielt die Geschichte?", options: ["Montagmorgen", "Freitagnachmittag kurz vor Feierabend", "Sonntagabend", "Mittwochmittag"], correctIndex: 1 },
          { question: "Was hat Alex sich für das Wochenende vorgenommen?", options: ["Zu arbeiten", "Wirklich runterzukommen", "Einen Ausflug zu machen", "Ben zu besuchen"], correctIndex: 1 },
          { question: "Was passiert genau vor Feierabend?", options: ["Ein Anruf kommt rein.", "Eine dringende E-Mail kommt rein.", "Das Licht geht aus.", "Ein Meeting wird angesetzt."], correctIndex: 1 },
        ],
      },
      {
        id: "m9-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «kommen».",
        sentences: [
          { text: "Ich will dieses Wochenende wirklich ___.", answer: "runterkommen" },
          { text: "Genau in dem Moment ___ eine E-Mail rein.", answer: "kommt" },
          { text: "Die Freizeit ___ bei mir zu kurz.", answer: "kommt" },
          { text: "Er ist mir ___.", answer: "entgegengekommen" },
          { text: "Das ___ mir komisch vor.", answer: "kommt" },
        ],
      },
      {
        id: "m9-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "runterkommen", right: "sich entspannen" },
          { left: "zurechtkommen", right: "mit etwas klarkommen" },
          { left: "zu kurz kommen", right: "weniger bekommen als verdient" },
          { left: "auf den Geschmack kommen", right: "anfangen, etwas zu mögen" },
          { left: "vorkommen", right: "geschehen oder jemandem so erscheinen" },
        ],
      },
      {
        id: "m9-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe, wie du nach einer stressigen Woche runterkommst. Benutze mindestens 3 «kommen»-Ausdrücke.",
        mustUseWords: ["runterkommen", "zurechtkommen", "zu kurz kommen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Am Freitagabend will ich endlich runterkommen. Unter der Woche komme ich mit dem Stress zurecht, aber die Erholung kommt zu kurz. Am Wochenende mache ich keinen Finger krumm.",
      },
      {
        id: "m9-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über einen stressigen Freitag. Benutze mindestens 4 «kommen»-Ausdrücke.",
        mustUseWords: ["runterkommen", "ankommen", "dazukommen", "zu kurz kommen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Am Freitag bin ich im Büro angekommen und hatte schon zehn E-Mails. Dann kam noch ein Meeting dazu. Die Mittagspause kam wie immer zu kurz. Am Abend wollte ich nur noch runterkommen.",
      },
    ],
  },

  // ============ MODULE 10: Nerven behalten (halten) ============
  {
    id: 10,
    slug: "nerven-behalten",
    title: "Nerven behalten",
    subtitle: "halten – aushalten, einhalten und dagegenhalten",
    focusVerb: "halten",
    headerImage: "/images/story-10.svg",
    learningGoals: [
      "Trennbare Verben mit «halten» verwenden",
      "Redewendungen mit «halten» erkennen",
      "Über Geduld und Alltagsstress sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "aushalten", english: "to endure / to bear", definition: "Etwas Unangenehmes ertragen können.", example: "Ich kann diesen Lärm kaum aushalten." },
      { german: "anhalten", english: "to stop / to persist", definition: "1. Stoppen. 2. Andauern.", example: "Der Fahrer hält an." },
      { german: "einhalten", english: "to keep / comply with", definition: "Eine Regel, einen Termin oder ein Versprechen beachten.", example: "Wir müssen die Frist einhalten." },
      { german: "aufhalten", english: "to hold up / delay", definition: "Jemanden oder etwas verzögern.", example: "Ein Lieferwagen hat uns aufgehalten." },
      { german: "festhalten", english: "to hold on to", definition: "1. Etwas greifen und nicht loslassen. 2. An etwas festhalten (Meinung).", example: "Halte dich gut fest!" },
      { german: "dagegenhalten", english: "to counter / to argue against", definition: "Einem Argument widersprechen.", example: "Da muss man dagegenhalten." },
      { german: "zurückhalten", english: "to hold back / restrain", definition: "Sich oder andere bremsen, nicht sofort reagieren.", example: "Ich konnte mich kaum zurückhalten." },
    ],
    idioms: [
      { german: "die Nerven behalten", english: "to keep one's cool", definition: "Ruhig bleiben in einer stressigen Situation.", example: "Man muss die Nerven behalten." },
      { german: "davon halte ich nichts", english: "I don't think much of that", definition: "Etwas nicht gut finden, nicht einverstanden sein.", example: "Davon halte ich absolut nichts." },
      { german: "sich an etwas halten", english: "to stick to something", definition: "Regeln oder Absprachen beachten.", example: "Halt dich bitte an die Regeln." },
      { german: "jemandem den Rücken freihalten", english: "to have someone's back", definition: "Jemanden vor Störungen oder Problemen schützen.", example: "Ich halte dir den Rücken frei." },
    ],
    exercises: [
      {
        id: "m10-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Nerven behalten».",
        questions: [
          { question: "Wo steht Alex in der Geschichte?", options: ["Im Bus", "In der Straßenbahn", "Im Zug", "Im Auto"], correctIndex: 1 },
          { question: "Warum halten sie an?", options: ["Eine Haltestelle", "Ein Lieferwagen im Gleisbereich", "Eine rote Ampel", "Ein Unfall"], correctIndex: 1 },
        ],
      },
      {
        id: "m10-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «halten».",
        sentences: [
          { text: "Der Fahrer ___ erst mal an.", answer: "hält" },
          { text: "Ein Lieferwagen hat uns ___.", answer: "aufgehalten" },
          { text: "Man muss die Nerven ___.", answer: "behalten" },
          { text: "Ich konnte mich kaum ___.", answer: "zurückhalten" },
          { text: "___ dich bitte an die Regeln.", answer: "Halt" },
        ],
      },
      {
        id: "m10-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "aushalten", right: "etwas Unangenehmes ertragen" },
          { left: "aufhalten", right: "jemanden verzögern" },
          { left: "die Nerven behalten", right: "ruhig bleiben" },
          { left: "den Rücken freihalten", right: "jemanden schützen" },
          { left: "sich an etwas halten", right: "Regeln beachten" },
        ],
      },
      {
        id: "m10-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe eine Situation, in der du die Nerven behalten musstest. Benutze «halten»-Ausdrücke.",
        mustUseWords: ["die Nerven behalten", "aushalten", "zurückhalten"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzte Woche war die Straßenbahn total voll. Ich musste die Nerven behalten, obwohl es kaum auszuhalten war. Ich habe mich zurückgehalten und nichts gesagt.",
      },
      {
        id: "m10-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über eine Situation im Verkehr. Benutze mindestens 4 «halten»-Ausdrücke.",
        mustUseWords: ["anhalten", "aufhalten", "die Nerven behalten", "aushalten"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Der Bus hat plötzlich angehalten. Ein Lieferwagen hat den ganzen Verkehr aufgehalten. Die Fahrgäste mussten die Nerven behalten. Die Hitze im Bus war kaum auszuhalten.",
      },
    ],
  },

  // ============ MODULE 11: Im Studio geht es ab (gehen) ============
  {
    id: 11,
    slug: "im-studio-geht-es-ab",
    title: "Im Studio geht es ab",
    subtitle: "gehen – losgehen, angehen und abgehen",
    focusVerb: "gehen",
    headerImage: "/images/story-11.svg",
    learningGoals: [
      "Redewendungen mit «gehen» im Sport-Kontext verwenden",
      "Trennbare Verben mit «gehen» sicher anwenden",
      "Über Fitness und Motivation sprechen",
      "Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "abgehen", english: "to go off / to rock", definition: "Richtig loslegen, es geht rund (umgangssprachlich).", example: "Im Studio geht es ab." },
      { german: "losgehen", english: "to start / to set off", definition: "Anfangen oder sich auf den Weg machen.", example: "Jetzt geht's los!" },
      { german: "angehen", english: "to tackle / to concern", definition: "1. Ein Problem angehen. 2. Jemanden betreffen.", example: "Wir gehen das Problem direkt an." },
      { german: "mitgehen", english: "to come along / to be carried along", definition: "1. Begleiten. 2. Sich mitreißen lassen.", example: "Die Energie geht mit." },
      { german: "eingehen", english: "to accept / to shrink / to respond to", definition: "1. Einen Kompromiss eingehen. 2. Auf etwas eingehen.", example: "Er geht auf meinen Vorschlag ein." },
      { german: "vergehen", english: "to pass (time)", definition: "Die Zeit verstreicht.", example: "Die Zeit vergeht wie im Flug." },
      { german: "übergehen", english: "to pass over / to transition", definition: "1. Jemanden ignorieren. 2. In etwas anderes übergehen.", example: "Wir gehen zur nächsten Übung über." },
    ],
    idioms: [
      { german: "es geht ab", english: "it's going off / it's wild", definition: "Es ist los, es ist richtig Stimmung (umgangssprachlich).", example: "Im Studio geht es richtig ab." },
      { german: "das geht gar nicht", english: "that's totally unacceptable", definition: "Etwas ist absolut nicht in Ordnung.", example: "So ein Verhalten – das geht gar nicht." },
      { german: "einen Schritt weitergehen", english: "to take it a step further", definition: "Etwas weiterentwickeln oder vorantreiben.", example: "Wir gehen einen Schritt weiter." },
      { german: "in sich gehen", english: "to reflect / to soul-search", definition: "Über sich selbst nachdenken.", example: "Manchmal muss man in sich gehen." },
    ],
    exercises: [
      {
        id: "m11-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte.",
        questions: [
          { question: "Wann spielt die Geschichte?", options: ["Am Montagmorgen", "Am Mittwochabend", "Am Freitagabend", "Am Sonntagmittag"], correctIndex: 1 },
          { question: "Was würde Alex normalerweise machen?", options: ["Ins Fitnessstudio gehen", "Direkt nach Hause fahren und eine Serie schauen", "Überstunden machen", "Freunde treffen"], correctIndex: 1 },
          { question: "Warum geht Alex trotzdem ins Studio?", options: ["Sein Arzt hat es empfohlen.", "Die Firma nimmt an einer Fitness-Challenge teil.", "Ben hat ihn überredet.", "Das Studio hat ein Sonderangebot."], correctIndex: 1 },
        ],
      },
      {
        id: "m11-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «gehen».",
        sentences: [
          { text: "Im Studio ___ es richtig ab.", answer: "geht" },
          { text: "Jetzt ___ es los!", answer: "geht" },
          { text: "Die Zeit ___ wie im Flug.", answer: "vergeht" },
          { text: "So ein Verhalten – das ___ gar nicht.", answer: "geht" },
          { text: "Wir ___ das Problem direkt an.", answer: "gehen" },
        ],
      },
      {
        id: "m11-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Ausdrücke mit den passenden Erklärungen.",
        pairs: [
          { left: "abgehen", right: "richtig loslegen, Stimmung machen" },
          { left: "angehen", right: "ein Problem direkt anpacken" },
          { left: "vergehen", right: "die Zeit verstreicht" },
          { left: "das geht gar nicht", right: "das ist absolut nicht akzeptabel" },
          { left: "in sich gehen", right: "über sich selbst nachdenken" },
        ],
      },
      {
        id: "m11-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle von einem Sporterlebnis oder einem Fitnessprogramm. Benutze «gehen»-Ausdrücke.",
        mustUseWords: ["losgehen", "abgehen", "vergehen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Letzte Woche bin ich endlich ins Fitnessstudio losgegangen. Im Kurs ist es richtig abgegangen. Die Stunde ist vergangen wie im Flug.",
      },
      {
        id: "m11-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 5–7 Sätze über einen sportlichen Abend. Benutze mindestens 4 «gehen»-Ausdrücke.",
        mustUseWords: ["abgehen", "losgehen", "angehen", "vergehen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Am Mittwoch bin ich nach der Arbeit direkt ins Fitnessstudio losgegangen. Im Kurs ist es richtig abgegangen. Ich wollte mein Fitnessproblem endlich angehen. Die Zeit ist vergangen wie im Flug und am Ende fühlte ich mich großartig.",
      },
    ],
  },

  // ============ MODULE 12: Mach Licht an! (machen) ============
  {
    id: 12,
    slug: "mach-licht-an",
    title: "Mach Licht an!",
    subtitle: "machen – die Kraft des Machens",
    focusVerb: "machen",
    headerImage: "/images/story-12.svg",
    learningGoals: [
      "Trennbare Verben mit «machen» sicher verwenden",
      "Eine Alltagsgeschichte im Präteritum/Präsens verstehen",
      "Redewendungen und Wortschatz (B2+) im Kontext erkennen",
      "Kurze Texte mit Pflicht-Vokabular schreiben",
    ],
    coreVerbs: [
      { german: "anmachen", english: "to switch on", definition: "Ein Gerät oder Licht einschalten, damit es funktioniert.", example: "Ich will das Licht im Büro anmachen." },
      { german: "ausmachen", english: "to agree on / to switch off", definition: "1. Etwas vereinbaren. 2. Ein Gerät ausschalten.", example: "Wir haben ausgemacht, dass die Ware heute rausgeht." },
      { german: "aufmachen", english: "to open", definition: "Etwas öffnen, z.\u00a0B. ein Fenster, eine Tür.", example: "Ich mache erst mal das Fenster weit auf." },
      { german: "zumachen", english: "to close", definition: "Etwas schließen, das Gegenteil von aufmachen.", example: "Mach bitte die Klappe wieder zu." },
      { german: "fertigmachen", english: "to finish", definition: "Eine Aufgabe abschließen oder zu Ende bringen.", example: "Die Jungs können nichts mehr fertigmachen." },
      { german: "weitermachen", english: "to continue", definition: "Eine unterbrochene Tätigkeit fortführen.", example: "Wir versuchen, so gut es geht weiterzumachen." },
      { german: "abmachen", english: "to agree on / arrange", definition: "Etwas mit einer anderen Person vereinbaren.", example: "Wir hatten doch abgemacht, dass der Termin fix ist." },
      { german: "klarmachen", english: "to make clear", definition: "Etwas deutlich erklären.", example: "Ich mache ihnen klar, dass wir nichts dafür können." },
      { german: "kaputtmachen", english: "to break / exhaust", definition: "Zerstören, umgangssprachlich: jemanden erschöpfen.", example: "Mein Kopf fühlt sich an, als hätte ihn jemand kaputtgemacht." },
      { german: "sich aufmachen", english: "to set off", definition: "Sich auf den Weg machen.", example: "Ich mache mich gleich zu euch auf." },
      { german: "blöd anmachen", english: "to talk rudely to someone", definition: "Jemanden unhöflich ansprechen.", example: "Er muss einen immer gleich blöd anmachen." },
    ],
    idioms: [
      { german: "unter Strom stehen", english: "to be very stressed", definition: "Sehr gestresst und angespannt sein.", example: "Ich stehe heute echt unter Strom." },
      { german: "der Wurm ist drin", english: "something keeps going wrong", definition: "Wenn immer wieder etwas schiefgeht.", example: "Heute ist echt der Wurm drin." },
      { german: "auf dem Schlauch stehen", english: "to not get it", definition: "Etwas nicht verstehen.", example: "Ich stehe nicht mehr auf dem Schlauch." },
      { german: "sich nicht verrückt machen", english: "to not stress out", definition: "Sich nicht unnötig stressen.", example: "Macht euch nicht verrückt, wir bekommen das hin." },
      { german: "jemanden kirre machen", english: "to drive someone crazy", definition: "Jemanden unter Druck setzen.", example: "Hätte mich die Situation komplett kirre gemacht." },
      { german: "auf eigene Faust", english: "on one's own", definition: "Allein und ohne Erlaubnis tun.", example: "Nichts auf eigene Faust an der Elektronik machen." },
      { german: "im Eimer sein", english: "to be broken", definition: "Kaputt oder nicht mehr zu gebrauchen.", example: "Kein Wunder, dass hier alles im Eimer ist." },
      { german: "an etwas rumpfuschen", english: "to tinker unprofessionally", definition: "Unprofessionell an etwas herumbasteln.", example: "Die Handwerker haben dran rumgepfuscht." },
      { german: "auf der Matte stehen", english: "to show up unannounced", definition: "Plötzlich vor der Tür auftauchen.", example: "Der Hausmeister steht auf der Matte." },
      { german: "kommissionieren", english: "to pick and pack orders", definition: "Waren im Lager zusammenstellen.", example: "Ohne Strom können wir nicht kommissionieren." },
      { german: "eine Verzögerung aufholen", english: "to make up for a delay", definition: "Verlorene Zeit gutmachen.", example: "Wir tun alles, um die Verzögerung aufzuholen." },
      { german: "stramm stehen", english: "to stand at attention", definition: "Sehr aufrecht stehen, aus Respekt oder Angst.", example: "Wir stehen stramm wie Schuljungen." },
      { german: "duster", english: "very dark", definition: "Sehr dunkel (umgangssprachlich).", example: "Im Lager ist es duster." },
      { german: "lokaler Stromausfall", english: "local power outage", definition: "Wenn in einem Gebiet kein Strom fließt.", example: "Es gibt einen lokalen Stromausfall." },
    ],
    exercises: [
      {
        id: "m12-mc-1", type: "multiple-choice", skill: "lesen",
        instruction: "Beantworte die Fragen zur Geschichte «Mach Licht an!».",
        questions: [
          { question: "Warum funktioniert am Montagmorgen nichts im Büro?", options: ["Der Computer ist kaputt.", "Es gibt einen lokalen Stromausfall.", "Die Kaffeemaschine ist defekt.", "Mehmet hat den Strom abgestellt."], correctIndex: 1 },
          { question: "Was hatten Alex und der Kunde letzte Woche ausgemacht?", options: ["Dass der Kunde ins Büro kommt.", "Dass die Lieferung am Montag rausgeht.", "Dass die Bestellung storniert wird.", "Dass der Preis gesenkt wird."], correctIndex: 1 },
          { question: "Was sagt Jule, als sie den Lichtschalter drückt?", options: ["«Das ist doch nicht möglich!»", "«Heute ist echt der Wurm drin.»", "«Ich stehe unter Strom.»", "«Das muss der Hausmeister reparieren.»"], correctIndex: 1 },
          { question: "Wer repariert am Ende den Strom?", options: ["Mehmet", "Alex", "Frau Krüger", "Der Hausmeister"], correctIndex: 3 },
          { question: "Was macht Alex abends zu Hause als Erstes?", options: ["Er macht den Fernseher an.", "Er macht die Wohnungstür auf und das Handy aus.", "Er ruft einen Kunden an.", "Er macht sich etwas zu essen."], correctIndex: 1 },
        ],
      },
      {
        id: "m12-tf-1", type: "true-false", skill: "lesen",
        instruction: "Richtig oder falsch?",
        statements: [
          { statement: "Am Montagmorgen funktioniert das Licht im Büro sofort.", correct: false },
          { statement: "Mehmet sagt, er steht unter Strom.", correct: true },
          { statement: "Die Lieferung sollte um neun Uhr rausgehen.", correct: true },
          { statement: "Frau Krüger sagt, alle sollen nach Hause gehen.", correct: false },
          { statement: "Der Hausmeister findet heraus, dass Handwerker am Wochenende am Sicherungskasten gepfuscht haben.", correct: true },
          { statement: "Alex konnte die Kunden nicht erreichen, weil sein Handy keinen Akku hatte.", correct: false },
          { statement: "Alex macht abends sein Handy konsequent aus.", correct: true },
        ],
      },
      {
        id: "m12-gf-1", type: "gap-fill", skill: "hoeren",
        instruction: "Ergänze die Sätze mit dem richtigen Verb mit «machen».",
        sentences: [
          { text: "Ich will das Licht im Büro ___, aber es passiert nichts.", answer: "anmachen" },
          { text: "Ich mache erst mal das Fenster weit ___.", answer: "auf" },
          { text: "Die Jungs können nichts mehr ___.", answer: "fertigmachen" },
          { text: "Mit dem Kunden haben wir letzte Woche ___, dass heute alles auf dem Lkw ist.", answer: "ausgemacht" },
          { text: "Wir versuchen, so gut es geht ___.", answer: "weiterzumachen" },
          { text: "Ich mache ihnen ___, dass wir nichts dafür können.", answer: "klar" },
          { text: "Mein Kopf fühlt sich an, als hätte ihn jemand ___.", answer: "kaputtgemacht" },
          { text: "Abends mache ich das Handy konsequent ___.", answer: "aus" },
        ],
      },
      {
        id: "m12-match-1", type: "matching", skill: "hoeren",
        instruction: "Verbinde die Redewendungen mit den passenden Erklärungen.",
        pairs: [
          { left: "unter Strom stehen", right: "sehr gestresst und angespannt sein" },
          { left: "der Wurm ist drin", right: "es geht vieles schief" },
          { left: "auf dem Schlauch stehen", right: "etwas nicht verstehen" },
          { left: "jemanden kirre machen", right: "jemanden nervlich fertig machen" },
          { left: "auf eigene Faust", right: "allein, ohne Erlaubnis" },
          { left: "im Eimer sein", right: "kaputt, nicht funktionsfähig" },
          { left: "auf der Matte stehen", right: "plötzlich vor der Tür stehen" },
          { left: "an etwas rumpfuschen", right: "unsauber / unprofessionell arbeiten" },
        ],
      },
      {
        id: "m12-speak-1", type: "speaking", skill: "sprechen",
        prompt: "Erzähle in 4–5 Sätzen: Was passiert in der Geschichte «Mach Licht an!»? Benutze mindestens 4 Verben mit «machen».",
        mustUseWords: ["anmachen", "fertigmachen", "ausmachen", "weitermachen"],
        instruction: "Sprich laut und benutze die Pflicht-Ausdrücke.",
        modelAnswer: "Am Montagmorgen will Alex das Licht anmachen, aber es gibt keinen Strom. Die Kollegen können im Lager nichts fertigmachen. Alex ruft die Kunden an und macht neue Liefertermine aus. Nachdem der Hausmeister den Strom repariert hat, können alle weitermachen.",
      },
      {
        id: "m12-speak-2", type: "speaking", skill: "sprechen",
        prompt: "Beschreibe eine stressige Situation bei der Arbeit. Benutze mindestens 3 Redewendungen.",
        mustUseWords: ["unter Strom stehen", "der Wurm ist drin", "sich nicht verrückt machen"],
        instruction: "Sprich frei und verwende die Redewendungen.",
        modelAnswer: "Letzte Woche stand ich total unter Strom, weil wir eine wichtige Präsentation hatten. Am Morgen war der Wurm drin – erst hatte ich verschlafen, dann war mein Laptop leer. Mein Kollege hat gesagt, ich soll mich nicht verrückt machen, und am Ende hat alles geklappt.",
      },
      {
        id: "m12-write-1", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe einen kurzen Absatz (5–7 Sätze) über einen chaotischen Tag bei der Arbeit. Benutze mindestens 5 Verben mit «machen».",
        mustUseWords: ["anmachen", "aufmachen", "fertigmachen", "ausmachen", "kaputtmachen"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Heute Morgen wollte ich den Computer anmachen, aber er ging nicht. Ich habe das Fenster aufgemacht. Die Kollegen konnten ihre Arbeit nicht fertigmachen. Wir haben mit dem Chef einen neuen Termin ausgemacht. Am Abend war ich total kaputtgemacht.",
      },
      {
        id: "m12-write-2", type: "open-writing", skill: "schreiben",
        prompt: "Schreibe 4–5 Sätze aus der Perspektive des Hausmeisters. Benutze mindestens 3 Redewendungen.",
        mustUseWords: ["rumpfuschen", "im Eimer sein", "auf eigene Faust"],
        instruction: "Schreibe deinen Text unten.",
        modelAnswer: "Ich fahre zum Büro und sehe, dass alles im Eimer ist. Die Handwerker haben wieder an der Elektronik rumgepfuscht. Kein Wunder! Ich hoffe nur, dass niemand auf eigene Faust versucht hat, den Kasten zu öffnen.",
      },
    ],
  },
];

// ---------------------------------------------------------------
// Build the output
// ---------------------------------------------------------------
const out = [];
out.push(`import { CourseModule } from "@/types";\n`);

for (const def of moduleDefs) {
  const storyIndex = def.id - 1;
  const rawText = stories[storyIndex];
  const parsed = parseStory(rawText);
  // Clean story text: remove vocab/idiom reference tables
  const storyTextClean = rawText
    .replace(/\r\n\r\n[\s\S]*$/, "")
    .replace(/\n\nVerb\r[\s\S]*$/, "")
    .replace(/\n\nAusdruck\r[\s\S]*$/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.includes("\r"))
    .join("\n");

  const varName = `module${def.id}`;
  out.push(`const ${varName}: CourseModule = ${JSON.stringify({
    id: def.id,
    slug: def.slug,
    title: parsed.title,
    subtitle: def.subtitle,
    focusVerb: def.focusVerb,
    learningGoals: def.learningGoals,
    estimatedMinutes: 45,
    story: {
      text: storyTextClean,
      headerImage: def.headerImage,
      paragraphs: parsed.paragraphs,
      sentences: parsed.sentences,
    },
    coreVerbs: def.coreVerbs,
    idioms: def.idioms,
    exercises: def.exercises,
    reviewItems: [],
  }, null, 2)};\n`);
}

// Export
out.push(`const allModules: CourseModule[] = [`);
for (let i = 1; i <= 12; i++) {
  out.push(`  module${i},`);
}
out.push(`];\n`);
out.push(`export default allModules;\n`);
out.push(`export function getModuleBySlug(slug: string): CourseModule | undefined {`);
out.push(`  return allModules.find((m) => m.slug === slug);`);
out.push(`}\n`);
out.push(`export function getModuleById(id: number): CourseModule | undefined {`);
out.push(`  return allModules.find((m) => m.id === id);`);
out.push(`}`);

writeFileSync("src/data/modules.ts", out.join("\n"), "utf8");
console.log("Generated modules.ts successfully!");
console.log(`Total lines: ${out.join("\n").split("\n").length}`);
