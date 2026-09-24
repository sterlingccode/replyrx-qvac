# ReplyRx GitHub Guide

1. Extract the ZIP and open a terminal in the `replyrx-qvac` folder.
2. Test locally:

```bash
npm install
npm start
```

Open `http://localhost:3000`.

3. In Claude Code, run the four prompts in `COMMIT_PROMPTS.txt` one at a time.
4. On GitHub, create a **public** empty repository named `replyrx-qvac`.
5. Back in the terminal, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/replyrx-qvac.git
git push -u origin main
```

6. Verify the four commits:

```bash
git log --oneline -4
```

Expected order:

```text
docs: finalize GitHub submission
feat: improve ReplyRx UI
feat: add QVAC reply analysis
feat: initialize ReplyRx project
```

Common Git fixes:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

If `remote origin already exists` appears:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/replyrx-qvac.git
```
