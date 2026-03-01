# Getting started with Speed Insights

This guide will help you get started with using Vercel Speed Insights on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

  **pnpm:**
  ```bash
  pnpm i vercel
  ```

  **yarn:**
  ```bash
  yarn add vercel
  ```

  **npm:**
  ```bash
  npm i vercel
  ```

  **bun:**
  ```bash
  bun i vercel
  ```

## Setup Instructions

### 1. Enable Speed Insights in Vercel

On the [Vercel dashboard](https://vercel.com/dashboard), select your Project followed by the **Speed Insights** tab. Then, select **Enable** from the dialog.

> **💡 Note:** Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.

### 2. Add `@vercel/speed-insights` to your project

Using the package manager of your choice, add the `@vercel/speed-insights` package to your project:

**pnpm:**
```bash
pnpm i @vercel/speed-insights
```

**yarn:**
```bash
yarn add @vercel/speed-insights
```

**npm:**
```bash
npm i @vercel/speed-insights
```

**bun:**
```bash
bun i @vercel/speed-insights
```

### 3. Add the `SpeedInsights` component to your app

For React applications (like this project), the `SpeedInsights` component is a wrapper around the tracking script, offering seamless integration with React.

#### Implementation for Create React App / Vite React

Add the following component to your main app file:

**TypeScript (App.tsx):**
```tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* Your app components */}
      <SpeedInsights />
    </div>
  );
}
```

**JavaScript (App.jsx):**
```jsx
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  return (
    <div>
      {/* Your app components */}
      <SpeedInsights />
    </div>
  );
}
```

#### Example Implementation for This Project

For the Edgelligence website, you would modify `src/App.jsx`:

```jsx
import { ThemeProvider } from './contexts/ThemeContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen flex flex-col
                      bg-gradient-to-br from-slate-50 via-white to-slate-100
                      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
                      text-slate-900 dark:text-slate-100
                      transition-colors duration-300">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 min-h-0">
          <Hero />
          <Newsletter />
        </main>
        <Footer />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 4. Deploy your app to Vercel

You can deploy your app to Vercel's global [CDN](https://vercel.com/docs/cdn) by running the following command from your terminal:

```bash
vercel deploy
```

Alternatively, you can [connect your project's git repository](https://vercel.com/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest pushes and merges to main.

Once your app is deployed, it's ready to begin tracking performance metrics.

> **💡 Note:** If everything is set up correctly, you should be able to find the `/_vercel/speed-insights/script.js` script inside the body tag of your page.

### 5. View your data in the dashboard

Once your app is deployed, and users have visited your site, you can view the data in the dashboard.

To do so, go to your [dashboard](https://vercel.com/dashboard), select your project, and click the **Speed Insights** tab.

After a few days of visitors, you'll be able to start exploring your metrics.

## Framework-Specific Implementations

### Next.js (Pages Router)

For Next.js applications using the Pages Router, add the component to your `pages/_app.tsx` or `pages/_app.jsx`:

**TypeScript:**
```tsx
import type { AppProps } from 'next/app';
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
```

**JavaScript:**
```jsx
import { SpeedInsights } from '@vercel/speed-insights/next';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
```

For versions of Next.js older than 13.5, import the `<SpeedInsights>` component from `@vercel/speed-insights/react` and pass it the pathname:

```tsx
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useRouter } from 'next/router';

export default function Layout() {
  const router = useRouter();
  return <SpeedInsights route={router.pathname} />;
}
```

### Next.js (App Router)

For Next.js applications using the App Router, add the component to your root layout (`app/layout.tsx` or `app/layout.jsx`):

**TypeScript:**
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**JavaScript:**
```jsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

For versions of Next.js older than 13.5, create a dedicated component:

**Create `app/insights.tsx`:**
```tsx
'use client';

import { SpeedInsights } from '@vercel/speed-insights/react';
import { usePathname } from 'next/navigation';

export function Insights() {
  const pathname = usePathname();
  return <SpeedInsights route={pathname} />;
}
```

**Import in `app/layout.tsx`:**
```tsx
import type { ReactNode } from 'react';
import { Insights } from './insights';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Insights />
      </body>
    </html>
  );
}
```

### Remix

For Remix applications, add the component to your root file (`app/root.tsx` or `app/root.jsx`):

**TypeScript:**
```tsx
import { SpeedInsights } from '@vercel/speed-insights/remix';

export default function App() {
  return (
    <html lang="en">
      <body>
        {/* Your app content */}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**JavaScript:**
```jsx
import { SpeedInsights } from '@vercel/speed-insights/remix';

export default function App() {
  return (
    <html lang="en">
      <body>
        {/* Your app content */}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### SvelteKit

For SvelteKit applications, call the `injectSpeedInsights` function in your root layout file:

**TypeScript (`src/routes/+layout.ts`):**
```ts
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();
```

**JavaScript (`src/routes/+layout.js`):**
```js
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

injectSpeedInsights();
```

### Vue

For Vue applications, add the component to your main app template:

**TypeScript (`src/App.vue`):**
```vue
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
  <!-- Your app content -->
</template>
```

**JavaScript (`src/App.vue`):**
```vue
<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
  <!-- Your app content -->
</template>
```

### Nuxt

For Nuxt applications, add the component to your default layout:

**TypeScript (`layouts/default.vue`):**
```vue
<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
  <!-- Your app content -->
</template>
```

**JavaScript (`layouts/default.vue`):**
```vue
<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />
  <!-- Your app content -->
</template>
```

### Astro

Speed Insights is available for both static and SSR Astro apps. Declare the `<SpeedInsights />` component near the bottom of your layout components:

**TypeScript (`BaseHead.astro`):**
```tsx
---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<SpeedInsights />
```

**JavaScript (`BaseHead.astro`):**
```jsx
---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<SpeedInsights />
```

#### Optional: `beforeSend` Function

You can remove sensitive information from the URL by adding a `speedInsightsBeforeSend` function:

```jsx
---
import SpeedInsights from '@vercel/speed-insights/astro';
const { title, description } = Astro.props;
---
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />

<script is:inline>
  function speedInsightsBeforeSend(data){
    console.log("Speed Insights before send", data)
    return data;
  }
</script>
<SpeedInsights />
```

### HTML (Vanilla JavaScript)

For plain HTML sites, add the following scripts before the closing `</body>` tag:

```html
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

**💡 Note:** When using the HTML implementation, there is no need to install the `@vercel/speed-insights` package.

### Other Frameworks

For other frameworks or vanilla JavaScript applications, import the `injectSpeedInsights` function from the package. This should only be called once in your app and must run in the client:

**TypeScript (`main.ts`):**
```ts
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
```

**JavaScript (`main.js`):**
```js
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();
```

## Understanding Speed Insights Metrics

Speed Insights tracks several key performance metrics:

### Core Web Vitals

- **Largest Contentful Paint (LCP)**: Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.
- **First Input Delay (FID)**: Measures interactivity. To provide a good user experience, pages should have a FID of 100 milliseconds or less.
- **Cumulative Layout Shift (CLS)**: Measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1 or less.

### Additional Metrics

- **First Contentful Paint (FCP)**: Measures when the first content is rendered on the screen.
- **Time to First Byte (TTFB)**: Measures the time from the request to when the first byte is received.
- **Interaction to Next Paint (INP)**: Measures the latency of user interactions throughout the page lifecycle.

## Privacy and Data Compliance

Vercel Speed Insights respects user privacy and complies with data protection regulations:

- **Minimal Data Collection**: Only collects performance metrics necessary for analysis
- **Anonymized Data**: No personally identifiable information is collected
- **GDPR Compliant**: Follows EU data protection requirements
- **User Consent**: Can be integrated with consent management platforms
- **Data Retention**: Performance data is retained according to your plan limits

Learn more about [privacy and data compliance standards](https://vercel.com/docs/speed-insights/privacy-policy).

## Troubleshooting

### Speed Insights not appearing in dashboard

If you don't see Speed Insights data after deployment:

1. **Verify Script Loading**: Open your deployed site and check the browser's Network tab for the `/_vercel/speed-insights/script.js` file
2. **Check Environment**: Speed Insights only works on Vercel production or preview deployments, not in local development
3. **Wait for Traffic**: Data appears after users visit your site. Give it some time after deployment
4. **Verify Feature Enabled**: Ensure Speed Insights is enabled in your Vercel project settings

### Script not loading

If the Speed Insights script isn't loading:

1. **Check Component Placement**: Ensure the `<SpeedInsights />` component is rendered in your app
2. **Verify Installation**: Confirm `@vercel/speed-insights` is installed in your dependencies
3. **Build and Deploy**: Make sure you've rebuilt and redeployed your app after adding the component
4. **Check Import Path**: Use the correct import path for your framework (e.g., `/react`, `/next`, `/vue`)

### Local development

Speed Insights doesn't collect data during local development (when running `npm run dev` or similar). To test Speed Insights:

1. Deploy to a Vercel preview deployment
2. Visit your preview URL
3. Check the Speed Insights tab in your Vercel dashboard after a few minutes

## Next Steps

Now that you have Vercel Speed Insights set up, you can explore the following topics to learn more:

- [Learn how to use the `@vercel/speed-insights` package](https://vercel.com/docs/speed-insights/package)
- [Learn about metrics](https://vercel.com/docs/speed-insights/metrics)
- [Read about privacy and compliance](https://vercel.com/docs/speed-insights/privacy-policy)
- [Explore pricing](https://vercel.com/docs/speed-insights/limits-and-pricing)
- [Troubleshooting guide](https://vercel.com/docs/speed-insights/troubleshooting)

## Benefits of Using Speed Insights

- **Real User Monitoring**: Track actual user experience, not synthetic tests
- **Global Performance**: See how your site performs across different regions
- **Core Web Vitals**: Monitor metrics that affect SEO rankings
- **Historical Trends**: Track performance improvements or regressions over time
- **Device-Specific Insights**: Understand performance across mobile and desktop
- **Integration with Vercel**: Seamlessly integrated with your deployment workflow

---

For more information, visit the [official Vercel Speed Insights documentation](https://vercel.com/docs/speed-insights).
