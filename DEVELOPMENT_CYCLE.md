# 🔄 Development Cycle & Pipeline Stages

This document outlines the lifecycle of a feature in our app—from local development to production release—and explains how our automated CI/CD pipeline protects our codebase at every step.

---

## 1️⃣ Stage 1: Local Development (The `feature` Branch)
Every new task, bug fix, or feature begins in an isolated branch.

* **Action:** You branch off `dev` (e.g., `git checkout -b feature/booking-modal`).
* **Process:** Write your code, build the UI, and write unit tests.
* **Safety Net:** Run `npm test` and `npm run typecheck` locally. Code should not leave your machine if it's failing.

---

## 2️⃣ Stage 2: Integration (Pull Request to `dev`)
When your feature is complete, it's time to merge it with everyone else's work.

* **Action:** Open a Pull Request (PR) from your `feature` branch into the `dev` branch.
* **Pipeline Trigger:** 🚦 **CI Pipeline** runs automatically!
  * **What it does:** It sets up a clean environment, installs dependencies, checks TypeScript types, looks for left-behind `console.log`s, and runs all Jest tests.
  * **The Gatekeeper:** If any check fails, GitHub **blocks** the merge. You must fix the code in your feature branch and push again.
* **Merge:** Once all checks are green, you click "Merge". Your code is now in `dev`.

---

## 3️⃣ Stage 3: Pre-Release (Pull Request to `master`)
Once the `dev` branch has accumulated enough features for a new app update, we prepare for release.

* **Action:** Open a PR from the `dev` branch into the `master` branch.
* **Pipeline Trigger:** 🚦 **CI Pipeline** runs again!
  * **Why?** Since `dev` contains multiple merged features, we must guarantee that combining them didn't break anything. 
* **QA / Testing:** At this stage, a Preview APK is usually built from `dev` and manually tested on physical devices to ensure the app feels right.

---

## 4️⃣ Stage 4: Production (Merge to `master`)
The code is flawless and ready for users.

* **Action:** You click "Merge" on the `dev` -> `master` PR.
* **Pipeline Trigger:** 🚀 **CI/CD Pipeline** runs one final time.
  * **What it does:** It runs the tests to ensure the production branch is stable.
  * **Continuous Deployment (CD):** *(Future Step)* This trigger will automatically log into Expo Application Services (EAS), build the final production APK/AAB, and submit it directly to the App Store and Google Play Store!

---

## 💡 Summary of Pipeline Triggers

Our `.github/workflows/ci.yml` is listening for three specific events:

1. **`pull_request` to `dev`** 👉 Protects the shared testing environment.
2. **`pull_request` to `master`** 👉 Ensures the release candidate is bug-free.
3. **`push` to `master`** 👉 Verifies the live code and triggers production builds.

*Check out `TESTING.md` for more details on exactly how to write tests for these stages!*
