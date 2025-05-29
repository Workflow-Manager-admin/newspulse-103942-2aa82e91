# Deploying NewsPulse React App

This guide provides step-by-step instructions for deploying your NewsPulse React app (`newspulse_frontend`) to popular web hosting platforms: **Netlify** and **Vercel**. Both platforms offer free plans, continuous deployment from Git, and simple static site hosting.

---
## General Preparation

1. **Build your production app:**
   From the root of `newspulse_frontend`, run:
   ```bash
   npm install
   npm run build
   ```
   This creates an optimized `build` directory to deploy.

2. **Push to repository (recommended):**
   - Create a repository on GitHub, GitLab, or Bitbucket.
   - Push your project (including `newspulse_frontend`) to the remote repository.

---

## Deploy to Netlify

### Option 1: Deploy via Netlify UI ("Drag & Drop")

1. Build your app as above.
2. Go to [netlify.com](https://www.netlify.com/) and log in or sign up.
3. Click "Add new site" > "Deploy manually".
4. Drag and drop the `build` folder from `newspulse_frontend` into the upload box.
5. Netlify will deploy and provide a URL instantly.

### Option 2: Connect Repository for Continuous Deployment

1. Sign in at [netlify.com](https://www.netlify.com/).
2. Click "Add new site" > "Import an existing project".
3. Choose your Git provider and pick your repo.
4. Set **build settings**:
   - **Base directory**: `newspulse_frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Click "Deploy site". Netlify will build and deploy on every push.

#### Optional: Custom Domain

- In the Netlify dashboard, go to your site > Domain Settings to add or manage your custom domain.

---

## Deploy to Vercel

Vercel is extremely simple for React (Create React App) projects.

### Steps:

1. Sign in at [vercel.com](https://vercel.com/) (use GitHub/GitLab/Bitbucket).
2. Click "New Project" and import your NewsPulse repository.
3. In project settings:
   - **Root directory**: `newspulse_frontend`
   - **Framework Preset**: Select "Create React App" (usually detected automatically)
   - **Build command**: `npm run build` (default)
   - **Output directory**: `build` (default)
4. Click "Deploy".
5. Vercel will assign a deployment URL you can share.

#### To redeploy

- Simply push changes to your main branch.

#### Add a custom domain

- In the Vercel dashboard, select your project > Settings > Domains.

---

## Environment Variables

If you need to use any environment variables (like API keys):

1. On Netlify or Vercel dashboard, go to your site's settings > Environment Variables.
2. Add variables there (e.g., `REACT_APP_API_URL`).
3. Redeploy the site.

---

## Troubleshooting

- If your site fails to build, make sure all dependencies are in `newspulse_frontend/package.json`.
- The `build` script must succeed locally (`npm run build`) before deploying.
- For advanced custom routing or SPA fallback, see:
  - Netlify: Add a `_redirects` file with `/*    /index.html   200`
  - Vercel: Default config covers SPA routes.

---

## Support

- [Netlify Docs: React Deployment](https://docs.netlify.com/configure-builds/get-started/#create-a-new-site)
- [Vercel Docs: Create React App](https://vercel.com/guides/deploying-react-with-vercel)

You're all set to launch your NewsPulse app 🚀!
