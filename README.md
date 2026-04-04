# ServiceNow Interview Hub

This is the publish-ready static version of the ServiceNow Interview Hub. You can push it directly to GitHub and publish it with GitHub Pages without any local build step.

## Final package counts
- Roles: 58
- Modules: 54
- Topics: 219
- Theory items: 68
- Coding items: 63
- Use cases: 62
- Quiz items: 206
- Total questions & scenarios: 193

## What is included
- Browse by role
- Browse by module
- Browse by topic
- Coding questions with exact scripts
- Use cases with step-by-step implementation answers
- Quiz mode
- Bookmarks
- GA4 analytics
- Support button

## GitHub Pages setup
1. Push the project to the `ServiceNow_Interview_Hub` repository.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your branch and the root folder.
5. Save.

## GA4
The package is already configured with measurement ID `G-YMEYJNYHR7`.

## Content structure
- `data/taxonomy/` stores roles, modules, and topics.
- `data/content/theory/` stores theory, tricky, comparison, and troubleshooting content.
- `data/content/coding/` stores coding questions with exact scripts.
- `data/content/use-cases/` stores implementation scenarios with step-by-step answers.
- `data/content/quizzes/quiz-bank.json` stores quiz questions.

## Notes
- Bookmarks use browser localStorage.
- The app uses hash routing for GitHub Pages reliability.
- You can edit JSON files directly in GitHub or github.dev.
- A support CTA is included in the sidebar and home hero and opens Cash App in a new tab.
