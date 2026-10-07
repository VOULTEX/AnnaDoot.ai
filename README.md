# AnnaDoot AI

Agentic AI food redistribution prototype for **SDG 2 - Zero Hunger**
(IBM SkillsBuild for Academia, Masterclass 5).

A donor posts surplus food. Five cooperating agents (Intake, Safety, Matching,
Dispatch, Impact) check it, match the best NGO and track the result.

## Run
Open `index.html` in a browser. No build step.

## Host (GitHub Pages)
1. Create a repo and upload these files.
2. Settings > Pages > Deploy from branch `main` / root.

## How it works
- `app.js`: rule-based agents (safety window, NGO scoring by distance/capacity/diet, impact estimates).
- Estimates: 0.4 kg per portion, 2.5 kg CO2e per kg of food. NGOs and first 3 log rows are demo data.
- Roadmap: replace the rule-based Intake/Safety agents with an LLM (e.g. IBM watsonx.ai), add a real database and WhatsApp API.

## Credits
Author: Aaditya Singh Chauhan. AI assistance: <describe the tools you used, as your program requires>.
