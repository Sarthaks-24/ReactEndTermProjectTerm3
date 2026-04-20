# 🚀 AI Resume Analyzer (React Project)

## 🎯 Problem Statement

Students often don’t know whether their resumes meet industry expectations or ATS (Applicant Tracking System) standards. This leads to missed opportunities despite having the right skills.

---

## 💡 Solution

Build a web application that allows users to upload their resume and receive AI-powered feedback including a score, strengths, weaknesses, and improvement suggestions. Each analysis is saved to the user’s account so they can track improvements over time.

---

## 🧠 Core Features

### 1. Authentication (Firebase)

* User Signup/Login (Email or Google)
* Protected routes
* Each user has their own stored resume analyses

### 2. Resume Upload

* Upload resume (PDF)
* Extract text from PDF

### 3. AI Analysis

* Send extracted text to AI API
* Get structured feedback:

  * Score (0–100)
  * Strengths
  * Weaknesses
  * Suggestions

### 4. Dashboard

* Display analysis results clearly
* Show:

  * Resume score
  * Feedback sections
  * Date of analysis

### 5. History (Important)

* Save analysis results in Firebase Firestore
* Each record linked to authenticated user
* Allow users to revisit previous analyses

---

## 🔥 Advanced Feature (Pick ONE)

### Option A: Job Role Targeting (Recommended)

* User selects a target role (e.g., Frontend Developer)
* AI evaluates resume based on that role

### Option B: Keyword Analysis

* Highlight missing important keywords

### Option C: Section-wise Scoring

* Score different sections like:

  * Education
  * Skills
  * Experience

---

## ⚙️ Tech Stack

* React
* Firebase (Authentication + Firestore)
* Gemini API
* Tailwind CSS

---

## 🏗️ Folder Structure

```
/components
  ResumeUpload.jsx
  AnalysisCard.jsx
  ScoreBar.jsx
  Navbar.jsx

/pages
  Login.jsx
  Dashboard.jsx
  Analyzer.jsx

/services
  gemini.js
  firebase.js

/context
  AuthContext.jsx
```

---

## 🔄 Application Flow

1. User logs in (Firebase Auth)
2. Uploads resume (PDF)
3. Extract text from PDF
4. Send text to AI API
5. Receive structured response
6. Save analysis in Firestore (linked to user ID)
7. Display results on dashboard
8. User can view past analyses

---

## 🧪 AI Prompt Structure

```
Analyze the following resume.

Return response in this JSON format:
{
  "score": number,
  "strengths": [points],
  "weaknesses": [points],
  "suggestions": [points]
}
```

---

## 🗄️ Firebase Data Structure (Important)

Collection: users

```
users/{userId}/analyses/{analysisId}
```

Each analysis document:

```
{
  score: number,
  strengths: [],
  weaknesses: [],
  suggestions: [],
  createdAt: timestamp
}
```

---

## 🎨 UI (Tailwind CSS)

### Key UI Elements

* Clean dashboard cards
* Score progress bar
* Section-wise feedback cards
* Upload area (drag & drop optional)

### Must Include

* Loading spinner during AI call
* Error messages
* Responsive layout (mobile + desktop)

---

## 📦 Required Features Checklist

* Authentication (Login/Signup)
* Resume upload
* AI analysis
* Dashboard view
* History of analyses
* CRUD operations
* Routing
* State management (Context API)

---

## ⚠️ Common Mistakes to Avoid

* Sending very large resume text to API
* Not structuring AI response
* Displaying raw text instead of formatted UI
* No loading or error states
* Not linking data to user accounts
* Overcomplicating features

---

## 🧠 Key Points for Viva

* Explain Firebase authentication flow
* Explain how data is stored per user
* Explain AI prompt and response structure
* Explain state management (Context API)
* Walk through full data flow clearly

---

## 🚀 Final Goal

Build a clean, functional, and explainable project that demonstrates real-world problem solving, proper authentication, and solid React fundamentals.

---

**Tip:** Keep the logic simple, UI clean, and make sure you understand how data flows from upload → AI → database → UI.
