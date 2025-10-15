# Contextual Chatbot Creator

This project allows you to create a personalized chatbot by providing information from images, text files, or pasted text. The chatbot will answer questions based solely on the context you provide, powered by the Gemini API.

This application is built with React and TypeScript, designed to run directly in environments that support on-the-fly TSX transpilation, such as Google's AI Studio. For deployment to standard static hosting platforms, a build step is recommended.

## Project Structure

- `index.html`: The main entry point of the application.
- `index.tsx`: The main React application logic.
- `App.tsx`: The root React component.
- `components/`: Contains all React components.
- `services/`: Modules for interacting with external APIs (like Gemini).
- `utils/`: Helper functions for tasks like file reading.
- `types.ts`: TypeScript type definitions.
- `service-worker.js`: Implements caching for offline functionality (PWA).
- `manifest.json`: PWA manifest file.
- `vercel.json`: Configuration for Vercel deployment, enabling SPA routing.
- `_redirects`: Configuration for Netlify deployment, enabling SPA routing.

## Local Development

Because this project uses TypeScript with JSX (`.tsx`), you cannot simply open `index.html` in a browser from the file system. You need a development server that can transpile the code.

While this project is designed for an environment like AI Studio, you can run it locally using a tool like Vite:
1.  Install Vite: `npm install -g create-vite`
2.  Create a new Vite React TS project: `npm create vite@latest my-chatbot-app -- --template react-ts`
3.  Replace the `src` folder of the new Vite project with the `.tsx`, `.ts`, `components`, `services`, and `utils` files from this project.
4.  Copy the contents of `index.html` into the Vite project's `index.html`, making sure to adjust script tags as needed (Vite uses `<script type="module" src="/src/main.tsx"></script>`).
5.  Run `npm install && npm run dev`.

## Deployment

To deploy this application to a static hosting provider like Vercel, Netlify, or GitHub Pages, you should first build the project for production. Using a tool like Vite (as described above), you would run `npm run build`. This will generate a `dist` folder with static HTML, JS, and CSS files that can be deployed.

### Platform Configuration

- **Vercel**: The `vercel.json` file is included to handle Single Page Application (SPA) routing. It rewrites all requests to `index.html`, allowing client-side logic to handle the view. No further configuration is needed.

- **Netlify**: The `_redirects` file is included for SPA routing on Netlify. It serves the same purpose as `vercel.json`. No further configuration is needed.

- **GitHub Pages**:
    1.  **Base Path**: If you are deploying to a repository page (e.g., `username.github.io/my-repo`), you will need to configure the `base` path in your build tool. For Vite, you would set `base: '/my-repo/'` in `vite.config.ts`. The paths in this project have been made relative, which helps with this.
    2.  **SPA Routing**: GitHub Pages does not natively support SPA routing like Vercel or Netlify. A common workaround is to use a custom 404 page that redirects to `index.html`. You can find many guides online for "GitHub Pages SPA".

By following these instructions and using a build tool, you can ensure the application is correctly optimized and configured for production deployment on any static hosting platform.