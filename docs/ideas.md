Objective: To create a sleek, modern, and intuitive user interface for the Hilo social pairing application. The frontend will guide users through a multi-step process from registration to final matching, ensuring a smooth and engaging experience.

Theme: 

Tech Stack:

- Framework: React TS (with Vite)

- Language: TypeScript

- Styling: Tailwind CSS

- Component Library: Ant Design (use `context7` mcp to check for docs when needed)
  - Tags selection uses `TreeSelect` component

- HTTP Client: Axios

- State Management: Zustand

- Routing: React Router

Core Principles:

- Reduce second tries: Since authencation returns an `expires_in`, the frontend stores the expire timestamp and automatically refreshs the access token first on a request when the time is close to expiration

- Minimum http requests: Don't fetch apis like `/api/profile` many times for different components

- Component-Based: Break down the UI into small, reusable components.

- State-Driven UI: The user's current status (e.g., unverified, form_completed, matched) will dictate what they see and can do.

- Responsive Design: The application must be fully usable on both desktop and mobile devices.

- Optimistic UI (where applicable): For actions like vetoing, update the UI immediately while the API request runs in the background.

- Two language switch support: English and Simplified Chinese

Other thoughts:

- '/' is a home page, beautifully designed, with a button entry to email login page (if not logged-in) or a button entry to the dashboard. When login page gets finished user will be redirected to dashboard.

- Dashboard is the central page where user interact with all events.
  - The first time when user enter dashboard, a central popup of smooth, elegant and simplified 3-page animations will be displayed to tell users how we process and protect their data. We'll design this animation in the final stages of development so just give three placeholders with 'Next'/'OK' switch page now. User will only see this once, but a small button on the header can still call up this after.
  - In the upper part is a step-like navigation bar (Ant Design's `steps` component), guiding users through steps of the event. Step is a representation of user's status and thus is not subject to arbitrary reverse by users. One exception is: user who has submitted a form can refill their form.
