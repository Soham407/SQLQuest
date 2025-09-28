# SQL Quest Interactive

SQL Quest Interactive is a modern, engaging web application designed to help users master SQL through hands-on practice, structured lessons, and real-time feedback. Start your journey from a beginner to a SQL expert today\!

## ✨ Key Features

  - **Interactive SQL Sandbox**: Write and execute SQL queries directly in the browser against a sample database and see instant results.
  - **Progressive Learning Path**: Follow a structured curriculum with lessons organized by difficulty (Beginner, Intermediate, Advanced) and category.
  - **User Authentication**: Secure sign-up and login with email/password, as well as OAuth providers like Google and GitHub.
  - **Gamified Progress Tracking**: Stay motivated by tracking completed lessons, scores, and earning achievement badges on your user profile.
  - **Subscription Tiers**: Offers Free, Pro, and Pro Plus plans with varying levels of access to features.
  - **International Payments**: Integrated with Razorpay to handle subscriptions, including dynamic currency conversion.
  - **Modern UI/UX**: A beautiful, responsive interface built with Tailwind CSS and shadcn/ui, featuring smooth page transitions and an animated dark/light mode toggle.

## 🛠️ Tech Stack

  - **Frontend**: React, Vite, TypeScript
  - **UI Components**: shadcn/ui
  - **Styling**: Tailwind CSS
  - **Animations**: Framer Motion
  - **Backend-as-a-Service**: Supabase (Auth, Postgres Database, Edge Functions)
  - **In-Browser Database**: sql.js
  - **Payment Gateway**: Razorpay

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  - Node.js (v18 or higher recommended)
  - npm or bun
  - A Supabase account

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd sqlquest
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example:

    ```sh
    cp .env.example .env
    ```

    Populate the `.env` file with your Supabase project URL and Anon Key. You can find these in your Supabase project's API settings.

    ```env
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Set up the Supabase database:**

      * Create a new project on [Supabase](https://supabase.com/).
      * Go to the SQL Editor in your Supabase project.
      * Copy the content from the migration files located in the `supabase/migrations/` directory and run it to create the necessary tables, policies, and functions.

5.  **Run the development server:**

    ```sh
    npm run dev
    ```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a7b1cfac-5724-4c91-9997-727939da6321) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
