import nlp from "compromise";
import nlpDates from "compromise-dates";

// Extend compromise with the dates plugin
nlp.extend(nlpDates);

// Attach nlp to the window object, making it globally accessible
window.nlp = nlp;
