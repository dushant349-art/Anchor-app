# Anchor — completely free version (no server, no API key, no cost)

Good news: the goal roadmap no longer needs any AI API or backend server at all.
It's now generated instantly on the phone itself, using built-in step templates
matched to your goal (exam prep, language learning, instrument, fitness, coding,
reading, career/business, or a solid generic plan) paced across whatever timeframe
you type in. Zero ongoing cost, works offline, nothing to pay for ever.

That also means you can **delete the Render service** you made earlier — it's not
needed anymore. And GitHub is now used just to host 5 plain files, for free,
via GitHub Pages.

## What's in this folder
Just 5 files, all at the same level (no folders):
- `index.html` — the whole app
- `manifest.json` — makes it installable
- `service-worker.js` — makes it work offline
- `icon-192.png`, `icon-512.png` — app icons

## Step 1 — Put these 5 files in a GitHub repo
If your old `anchor-app` repo still exists, you can reuse it — just delete
whatever's in there first (or make a fresh repo, simpler).

1. github.com → **+** → **New repository** → name it `anchor-app` → Create.
2. **Add file → Upload files** → select all 5 files above at once → Commit.
3. Double check afterwards: tap each filename in the repo and confirm GitHub
   did **not** add "-1" or similar to any of them (it does this if a file with
   that name already existed). If it did, rename it back using the pencil/edit
   icon so the names exactly match the list above.

## Step 2 — Turn on GitHub Pages (free hosting, no Render needed)
1. In your repo, go to **Settings** (top tab, not the gear in the sidebar).
2. In the left menu, tap **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)` → **Save**.
5. Wait a minute or two, then refresh — GitHub shows a URL like:
   `https://yourusername.github.io/anchor-app/`
6. Open that URL — the app should load directly, fully working, roadmap
   included, no errors, nothing to configure.

## Step 3 — Package it as an APK with PWABuilder
1. Go to https://www.pwabuilder.com in your phone browser.
2. Paste your GitHub Pages URL from Step 2.6 → **Start**.
3. Go to the **Android** package option → **Generate Package** → choose **APK**.
4. Download it to your phone.

## Step 4 — Install it
Open the downloaded APK from your Downloads/Files app, allow installing from
that source when asked, and install.

That's it — habit tracker, focus timer, badges, progress, and the goal roadmap
builder, all free, all offline-capable, no accounts or billing involved beyond
GitHub (free) and PWABuilder (free).
