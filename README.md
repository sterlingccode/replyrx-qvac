# ReplyRx

ReplyRx is a simple localhost app that uses QVAC local inference to analyze a pasted message and generate three reply styles: friendly, direct, and professional.

## Built with
- QVAC SDK 0.20.0
- Node.js + Express
- Plain HTML, CSS, and JavaScript

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

The first AI request may take longer while the local model is prepared.

## How QVAC is used

The Node server loads a local QVAC model with `loadModel()` and generates the analysis with `completion()`. No cloud AI API key is required.

## Project structure

```text
public/
  index.html
  app.js
  styles.css
server.js
package.json
README.md
LICENSE
.gitignore
GITHUB_GUIDE.md
COMMIT_PROMPTS.txt
```

## Suggested GitHub repository

`replyrx-qvac`
