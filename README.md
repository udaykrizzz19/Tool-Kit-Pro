<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2689/2689604.png" alt="ToolKitPro Logo" width="120" />
  <h1 align="center">ToolKitPro</h1>
  <p align="center">
    Your Personal, Blazing-Fast Toolkit Manager
    <br />
    <a href="https://github.com/udaykrizzz19/Tool-Kit-Pro"><strong>Explore the docs »</strong></a>
    <br />
    <br />
  </p>
</p>

<!-- Badges -->
<p align="center">
  <a href="https://reactjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  </a> 
  <a href="https://vitejs.dev/" target="_blank">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  </a> 
  <a href="https://supabase.io/" target="_blank">
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  </a>
</p>

---

## 📖 About The Project

ToolKitPro is a minimalist, yet powerful application to save, categorize, and manage your personal collection of digital tools, links, and resources. It's built with a strict black-and-white aesthetic for ultimate focus, with intentional color accents for clarity and intuitive interaction.

Whether you're a developer, designer, researcher, or student, ToolKitPro helps you organize the digital clutter and keep your essential resources just a click away.


### ✨ Key Features

-   🔐 **Secure User Authentication**: Full sign-up, login, and session management powered by Supabase Auth.
-   🛠️ **Complete Tool Management (CRUD)**: Easily add, view, update, and delete any tool in your collection.
-   🗂️ **Dynamic Categorization**: Create and assign custom categories to your tools for superior organization.
-   🔍 **Quick Search & Filtering**: Instantly filter your toolkit by category to find exactly what you need, when you need it.
-   📌 **Pinning & Prioritization**: Pin your most-used tools to the top of the list for immediate access.
-   🎨 **Minimalist, Focused UI**: A beautiful, strict black & white theme with a toggleable dark mode. Destructive (red) and success (green) actions are colored for intuitive user feedback.
-   📱 **Fully Responsive Design**: A seamless and consistent experience across desktop, tablet, and mobile devices.
-   👤 **Account Management**: Users can update their password and securely delete their account along with all associated data.

---

## 🛠️ Built With

This project leverages a modern, efficient, and scalable technology stack to deliver a premium user experience.

| Tech                               | Description                                                              |
| ---------------------------------- | ------------------------------------------------------------------------ |
| **React**                          | A JavaScript library for building user interfaces.                       |
| **Vite**                           | Next-generation frontend tooling for a blazing-fast development experience. |
| **Supabase**                       | The open-source Firebase alternative for backend, database, and auth.    |
| **Tailwind CSS**                   | A utility-first CSS framework for rapid UI development.                  |
| **shadcn/ui**                      | Re-usable components built using Radix UI and Tailwind CSS.              |
| **React Router DOM**               | Client-side routing for single-page applications.                        |
| **TanStack Query**                 | Powerful asynchronous state management for fetching, caching, and updating. |
| **Lucide React**                   | Beautiful and consistent open-source icons.                              |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   `npm`, `yarn`, or `pnpm` package manager

### 1. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/udaykrizzz19/Tool-Kit-Pro
    cd toolkitpro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### 2. Set up Supabase

This project requires a Supabase backend for database, authentication, and storage.

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com), sign in, and create a new project.

2.  **Database Schema**: Navigate to the **SQL Editor** in your Supabase project dashboard and run the following SQL queries to set up the necessary tables and functions.

    ```sql
    -- 1. Create the profiles table to store public user data
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT,
      purpose TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    COMMENT ON TABLE public.profiles IS 'Stores public user data linked to authentication.';

    -- 2. Create the categories table
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      color TEXT, -- Kept in schema for future extensibility
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    COMMENT ON TABLE public.categories IS 'Stores user-defined categories for organizing tools.';

    -- 3. Create the tools table
    CREATE TABLE tools (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      description TEXT,
      category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
      tags TEXT[],
      notes TEXT,
      is_pinned BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    COMMENT ON TABLE public.tools IS 'Stores the core tool/resource data for each user.';


    -- 4. Function to automatically create a profile when a new user signs up
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, full_name, purpose)
      VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'purpose');
      RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile for a new user.';

    -- 5. Trigger to execute the function on new user creation
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    ```

3.  **Row Level Security (RLS)**: For data privacy and security, you must enable RLS and create policies. Run this SQL in the editor:

    ```sql
    -- Enable RLS for all relevant tables
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

    -- Create policies for the 'profiles' table
    CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

    -- Create policies for the 'categories' table
    -- This single policy allows full management (SELECT, INSERT, UPDATE, DELETE) for the owner.
    CREATE POLICY "Users can manage their own categories." ON categories FOR ALL USING (auth.uid() = user_id);

    -- Create policies for the 'tools' table
    -- This single policy allows full management for the owner.
    CREATE POLICY "Users can manage their own tools." ON tools FOR ALL USING (auth.uid() = user_id);
    ```

### 3. Environment Variables

1.  Create a `.env` file in the root of your project by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Go to your Supabase project's **Settings > API**.
3.  Copy the **Project URL** and the **`anon` (public) key**.
4.  Add them to your `.env` file:

    ```env
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### 4. Running the Application

Now you can start the local development server:
```bash
npm run dev
```

## 🎨 Theming & Customization

The application uses a CSS variable-based theming system, making it easy to customize the look and feel.

-   **Theme Definition**: All theme colors are defined in `src/styles/globals.css`.
-   **Light & Dark Modes**: Colors for light mode are defined under the `:root` selector, and colors for dark mode are under the `.dark` selector.
-   **Accent Colors**: The primary theme is black and white for focus. Specific accent colors are defined for user feedback:
    -   `--destructive` & `--destructive-foreground` for delete/danger actions (Red).
    -   `--success` & `--success-foreground` for confirmation/success actions (Green).
-   **Component Styling**: Most UI components from `shadcn/ui` are styled using these CSS variables and will adapt automatically to any theme changes you make.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📧 Contact
Project Link: [https://github.com/your-username/toolkitpro](https://github.com/your-username/toolkitpro)
