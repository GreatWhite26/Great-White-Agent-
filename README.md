# RevenuePilot Studio

A browser-based short-video creation and YouTube publishing platform for Great White Construction.

## What it does
- Generates contractor-focused short-form content from built-in rotating topic templates.
- Renders a real 9:16 WebM video in the browser with animated branding, hook, tips and CTA.
- Connects to YouTube using Google Identity Services and uploads directly with YouTube Data API v3.
- Keeps TikTok disabled until developer approval.

## One-time setup
1. Enable GitHub Pages for this repository and publish from the /docs folder on the main branch.
2. Your expected Pages URL is: https://greatwhite26.github.io/Great-White-Agent-/
3. In Google Cloud, create/use a **Web application** OAuth client and add this Authorized JavaScript origin:
   https://greatwhite26.github.io
4. Enable YouTube Data API v3 for that Google Cloud project.
5. Open RevenuePilot Studio > Settings and paste the Google Web Client ID.
6. Generate a video, connect YouTube, and publish as Unlisted for the first test.

No client secret is required or stored in the browser app.

## Limits
This starter hosted version creates videos while the browser is open. A true closed-browser autopilot needs a server-side render worker, which can be added later.
