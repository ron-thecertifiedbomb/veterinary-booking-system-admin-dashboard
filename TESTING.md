# 🚀 The Vet App Testing Manual

This manual explains our three-stage branching strategy and what kind of testing happens at each step to ensure we never release a broken app to our users.

## Stage 1: The Feature Branch 🛠️

_This is your sandbox. You branched off `dev` to build something new._

- **Goal:** Prove that your _specific new code_ works and handles errors properly.
- **Type of Testing:** **Unit Testing & Local Manual Testing**
- **Who does it?** You (the developer).
- **What you should do before merging:**
  1. **Write Unit Tests:** Write Jest tests for your new hooks or components (e.g., `useCreateBooking.test.ts`). This proves the isolated logic works.
  2. **Run All Tests Locally:** Run `npm test` in your terminal. Ensure your new tests pass AND you didn't accidentally break any old tests.
  3. **Manual App Check:** Open the app on your phone/emulator and tap around the new feature to make sure the UI looks right.

> **Rule of Thumb:** If `npm test` fails on your machine, the code is not allowed to leave the feature branch.

---

## Stage 2: The Dev Branch 🤝

_You just merged your feature branch into `dev`. This branch contains everyone's combined work._

- **Goal:** Prove that your new feature didn't break someone else's feature when they were mixed together.
- **Type of Testing:** **Integration Testing & QA / User Acceptance Testing (UAT)**
- **Who does it?** Automated Systems (GitHub Actions) + You or a QA Tester.
- **What happens here:**
  1. **Automated Integration Check:** As soon as code hits `dev`, your CI/CD pipeline (like GitHub Actions) should automatically run `npm test`. This ensures the merge didn't break the build.
  2. **Build a Test APK:** You generate a Debug or "Preview" APK from the `dev` branch.
  3. **User Acceptance Testing (UAT):** You install this APK on a real phone and try to use the app exactly like a customer would. _Does the booking actually go through to the real NestJS server? Does the history list update?_

> **Rule of Thumb:** The `dev` branch should always be stable enough to show to a client or stakeholder, even if some features are half-finished.

---

## Stage 3: The Master Branch 🚀

_The `dev` branch looks great, and it's time to release an update. You merge `dev` into `master`._

- **Goal:** Final sanity check. Absolute zero tolerance for bugs.
- **Type of Testing:** **Regression Testing & Smoke Testing**
- **Who does it?** Automated Systems + The final approver.
- **What happens here:**
  1. **Regression Testing:** Your automated pipeline runs `npm test` one last time.
  2. **Production Build:** The pipeline builds the final Release APK/AAB file.
  3. **Smoke Testing:** Before hitting "Publish" to all users, you do a "Smoke Test" (a very quick 2-minute check: open the app, log in, book a slot, check history) using the production build.

> **Rule of Thumb:** Nobody writes new code directly on `master`. Code only arrives here after surviving the gauntlet of the `dev` branch.

---

### 📋 Quick Reference Cheat Sheet

| Branch      | What is it for?           | What type of testing?  | How is it done?                           |
| :---------- | :------------------------ | :--------------------- | :---------------------------------------- |
| **Feature** | Building new things       | **Unit Testing**       | `npm test` locally + coding               |
| **Dev**     | Combining everyone's work | **Integration & QA**   | Automated CI pipeline + Debug APKs        |
| **Master**  | Releasing to users        | **Regression & Smoke** | Final CI run + TestFlight/Play Store beta |
