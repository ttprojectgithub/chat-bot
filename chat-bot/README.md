
# Angular GPT Chat Room

A smart chat application built with **Angular 19** and **Node.js**, designed to simulate real-time communication with an intelligent chatbot that specializes in Angular-related questions. Built in an **NX Monorepo**, this application leverages modern web standards including accessibility, responsive design, and animation.

---

## Overview

This single-page application enables users to engage with an AI-powered chatbot that acts as a senior Angular developer. It can identify and respond to Angular-related queries through a combination of keyword recognition and natural language processing (NLP). The user interface is optimized for right-to-left (RTL) languages and follows best practices for accessibility and user experience.

---

## Tech Stack

* **Frontend**: Angular 19 (Standalone Components, Signals, Reactive Forms, Animations)
* **Backend**: Node.js, Express, OpenAI API
* **Architecture**: NX Monorepo (`apps/`, `libs/`)
* **Styling**: SCSS, fully responsive RTL layout
* **Accessibility**: A11y-compliant markup and keyboard navigation
* **Testing**: Jest
* **Deployment**: Ready for platforms like Vercel, Netlify, Railway

---

## Project Structure

```
chat-bot/
├── apps/
│   └── chat-bot/        # Angular frontend application
├── libs/
│   ├── bot/             # Bot logic (keywords + NLP)
│   ├── shared-core/     # Shared services and interfaces
│   └── shared-ui/       # Reusable UI components (e.g., Spinner)
├── api/                 # Node.js backend server
├── tools/               # Custom NX schematics and utilities
```

---

## Bot Logic

1. **Keyword Matching**
   The bot scans user messages for Angular-specific terms.

2. **Fallback to NLP (OpenAI)**
   If no match is found, the question is sent to OpenAI with the prompt:
   *"Is this question related to Angular? Respond with 'yes' or 'no' only."*

3. **Final Response**

   * If the answer is "no", the bot responds with a message stating the topic is unrelated to Angular.
   * If the answer is "yes", the bot sends the question again to OpenAI for a full response.

---

## Features

* Angular-specialized chatbot with combined keyword and NLP recognition
* Message editing capability for user submissions
* Local in-memory message history with persistence
* Copy functionality for bot responses
* Like/Dislike feedback options
* Fully accessible interface with `aria-*` attributes
* RTL support for right-to-left languages
* Smooth animations and toast notifications
* Responsive mobile-first design

---

## Getting Started



### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your OpenAI API Key

Create a `.env` file in the root directory and add the following:

```
OPENAI_API_KEY=your-openai-api-key
```

### 4. Run the Application

In one terminal, start the Angular frontend:

```bash
npx nx serve chat-bot
```

In a second terminal, start the Node.js backend:

```bash
npx ts-node api/index.ts
```

### 5. Optional: Run Tests

```bash
npx nx test bot
```

---

## Testing

Unit tests are implemented using **Jest** for the most critical logic paths, including:

* Keyword-based bot logic
* NLP fallback scenarios
* API error handling

Tests can be found in:

```
libs/bot/src/lib/__tests__/
```

---


