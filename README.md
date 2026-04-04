# ServiceNow Interview Hub

Static GitHub Pages project for ServiceNow interview preparation.

## Included in this repo
- Browse by **Role**
- Browse by **Module / Product Area**
- Browse by **Topic**
- **Coding** questions with exact scripts
- **Use case** scenarios with step-by-step implementation answers
- **Quiz** mode with selectable counts
- **Bookmarks** using browser localStorage
- **Google Analytics 4** already wired with measurement ID **G-YMEYJNYHR7**

## Architecture
This project is intentionally built with:
- plain **HTML**
- plain **CSS**
- plain **JavaScript**
- split **JSON** data files

That means you can maintain it directly in GitHub or github.dev without installing Node.js locally.

## Repository name
This build is prepared for the repository name:

`ServiceNow_Interview_Hub`

## Files you will edit most often
- `data/taxonomy/roles.json`
- `data/taxonomy/modules.json`
- `data/taxonomy/topics.json`
- `data/content/theory/*.json`
- `data/content/coding/*.json`
- `data/content/use-cases/*.json`
- `data/content/quizzes/quiz-bank.json`

## Publish on GitHub Pages
1. Push all files in this repo to your GitHub repository.
2. In GitHub, open **Settings** → **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your main branch.
5. Select **/(root)** as the folder.
6. Save.

Because this repo is already static and includes `.nojekyll`, you do not need a separate build step.

## Routing
This project uses **hash routing**:
- `#/home`
- `#/roles`
- `#/modules`
- `#/topics`
- `#/coding`
- `#/use-cases`
- `#/quiz`
- `#/bookmarks`

That keeps GitHub Pages deployment simple.

## Google Analytics
GA4 is already added in `index.html` with:

`G-YMEYJNYHR7`

If you ever need to replace it, update:
- the script URL in `index.html`
- the `gtag('config', '...')` line in `index.html`
- the constant in `assets/js/constants.js`

## Content model
Every study item is mapped by:
- roleIds
- moduleIds
- topicIds
- difficulty
- contentType
- tags
- relatedTables

This structure is what makes filtering, search, quiz selection, and future expansion possible.

## Current seeded baseline
The repo ships with:
- broad taxonomy coverage for roles, modules, and topics
- seeded theory/comparison/troubleshooting content
- seeded coding questions
- seeded use cases
- seeded quiz bank

The app shell and data model are designed to scale toward a much larger interview hub over time.

## Bookmark behavior
Bookmarks are stored in the browser using localStorage, so they persist for the same browser/profile but do not sync across devices.

## Suggested growth path
1. Expand theory items under existing topics
2. Add more coding files by module
3. Add more use-case scenarios by module
4. Grow the quiz bank from every new content item
5. Keep coverage balanced across ITSM, CMDB, Discovery, Integrations, GRC, SecOps, HAM, SAM, HRSD, CSM, and platform core

## Tip for content additions
When adding new items:
- use exact answers
- avoid vague guidance
- include navigation paths for use cases
- include working scripts for coding questions
- add validation checklists for implementation scenarios
