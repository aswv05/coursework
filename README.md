#Intent First

#Word count for README file: approximately 760 words including headings.

A browser prototype for a student who is replying to practical requests from their mother. In this prototype, the student can either choose "Yes", "No", or "Require more information" before requesting suggested wording. Then they can review and then control the final reply.

#Project status:
--> Implemented: three fictional scenarios, intention selection, optional extra wording, editable suggestions, manual writing, cancel the reply, replacement dialogs, outdated-draft warnings, local confirmation and restart.
--> Simulated: AI wording generation and message delivery. Nine prepared replies are selected by the scenario and intention, and the optional wording is appended literally. No model, API call, or connection to a messaging service were used in this prototype.
--> Limitations: The free text is not checked for contradictions or factual accuracy. The three intentions do not represent every possible response. The state is held in memory and is cleared when the page is refreshed.

#Technology and files:
The prototype uses HTML, CSS, and JavaScript. No external libraries, build process, installation requirements, or API keys were used.
--> htmlPage.html: page structure and controls.
--> styles.css: layout and presentation.
--> core.js: scenario data, prepared replies, state transitions and confirmation checks.
--> app.js: event listeners, dialogs, and display updates.

#Running the prototype:
You can download or clone the repository, and once it has been downloaded/cloned please check if the four files are there. Keep the four files in the same foler. Open htmlPage.html in a browser with JavaScript enabled. An internet connection is not necessary for the prototype to run locally.
Choose an example ("Shopping", "Dinner", "Clarifying"), select an intention ("Yes", "No", "Require more information"), and press "Create suggestion". Extra wording is optional. Review and edit the draft before confirming, or choose "Write manually" to enter a reply without selecting an intention. The confirmation displays the approved text locally, and  shows "Confirmed, nothing was sent" to make clear that it is a simulated delivery.

#Development record:
--> Starting point and scope: I had a couple of rough ideas on how I wanted to go about this assignment and the protoype. I wanted the prototype to be straight-forward and not complicated with a clear interaction sequence, so I discussed my ideas with ChatGPT and ultimately selected something that is visually simple. I decided to use VS Code for the prototype-making (using HTML, CSS, and JavaScript). I kept three fictional requests so that the response choices and the corresponding consequences are easy to understand and inspect.
--> Presentation: I simplified the template to keep all the main items in a single column with a standard font and sizes when needed. I also used black and white for the colours and less surrounding wording. This kept the prototype focused on choosing and reviewing a reply rather than focusing on visuals.
--> Interface connections: The review identified a prematurely closed response container and mismatched identifiers. I changed the HTML structure a little bit and matched identifiers to the scripts.
--> Control: I retained the template's generated-input snapshot and outdated-draft check. Changing an intention or extra wording keeps the old draft but it doesn't allow for the reply to be confirmed until it is updated or explicitly kept as manual wording. The "Shopping" screenshots show the visual warning and the updated draft.
--> Evidence: I captured the screenshots of the running prototype. I drew the system diagram and interaction flowchart on the website "smartdraw.com". The storyboard screenshots demonstrate acceptance, updating an outdated draft and editing a refusal to add questions.

#Checks and outcomes:
The browser walkthrough I initially conducted has reported no failures. The supplied screenshots show the generated replies, local confirmation, direct draft editing, an outdated draft warning with a disabled confirmation button, and an updated suggestion.
I have reviewed all the files and with ChatGPT's assistance also. I have checked the running prototype in my browser. These were informal checks, rather than participant testing.

#AI assistance:
ChatGPT has been used with developing the storyboards, discussing design choices, and providing staged development guidance. It has also aided in making the JavaScript and refining the code here and there.
My contributions included choosing the simpler presentation of the prototype, writing up the HTML and CSS code in VS Code, revising labels, running the prototype, capturing screenshots, and drawing the interaction and systems diagrams in SmartDraw.

#Accompanying material:
The project report contains the system diagram, interaction flowchart, screenshot storyboards, and references. No additional files or ZIP files are needed to run this prototype. The submitted commit is identified in the report.