import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, ExternalLink, Server, Cpu, Zap, Activity, Pause, Wrench, Archive, Search, RotateCcw, Folder, Github, GitBranch, Lightbulb } from 'lucide-react';

const STORAGE_KEY = 'agent-inventory';

const STATUS_CONFIG = {
  live: {
    label: 'Live',
    pillBg: '#DCFCE7', pillText: '#166534', pillBorder: '#BBF7D0', dotColor: '#10B981',
    filterText: '#166534', filterBorder: '#BBF7D0',
    stripeColor: '#10B981',
    icon: Activity,
  },
  development: {
    label: 'In Dev',
    pillBg: '#FEF3C7', pillText: '#92400E', pillBorder: '#FDE68A', dotColor: '#FACC15',
    filterText: '#92400E', filterBorder: '#FDE68A',
    stripeColor: '#FACC15',
    icon: Wrench,
  },
  paused: {
    label: 'Paused',
    pillBg: '#CFFAFE', pillText: '#155E75', pillBorder: '#A5F3FC', dotColor: '#06B6D4',
    filterText: '#155E75', filterBorder: '#A5F3FC',
    stripeColor: '#06B6D4',
    icon: Pause,
  },
  idea: {
    label: 'Idea',
    pillBg: '#FCE7F3', pillText: '#BE185D', pillBorder: '#FBCFE8', dotColor: '#EC4899',
    filterText: '#BE185D', filterBorder: '#FBCFE8',
    stripeColor: '#EC4899',
    icon: Lightbulb,
  },
  archived: {
    label: 'Archived',
    pillBg: '#F5F5F5', pillText: '#6B7280', pillBorder: '#E5E7EB', dotColor: '#9CA3AF',
    filterText: '#6B7280', filterBorder: '#E5E7EB',
    stripeColor: '#9CA3AF',
    icon: Archive,
  },
};

const SEED_AGENTS = [
  { id: '1', name: "ColorTuneLyrics", description: "Real-time neon lyric visualizer that syncs text, timing, and color to music on a live music staff.", status: "live", category: "Creative / Entertainment", techStack: ["Python (FastAPI)", "JavaScript", "HTML/CSS (neon)", "PWA", "Docker", "pytest", "GitHub Actions CI"], apis: ["LRCLIB", "YouTube InnerTube search", "YouTube IFrame Player", "YouTube captions (word-level timing)", "MusicBrainz", "GetSongBPM", "PostHog", "Pushover"], hosting: "Railway (Docker)", url: "https://www.colortunelyrics.com", repoUrl: "https://github.com/strongj3369/colortunelyrics", deployMethod: "git push → Railway Docker build (pytest gates the deploy)", folder: "D:/colortune", notes: "Timing is LRCLIB line-level + YouTube caption word-level; Whisper/yt-dlp DISABLED in prod (YouTube blocks datacenter IPs). Oct 2026: added a deterministic sync probe at GET /health/sync, floored word start times at 0, and fixed the H1 XSS (search results now escape LRCLIB/YouTube titles). Full security audit in AUDIT_2026-10-18.md: no Critical; open Highs are a YouTube cookie jar still in git history (revoke the Google sessions), yt-dlp running on every search with no timeout, and unpinned dependencies; Mediums include CORS * with credentials, no rate limiting, no security headers/HSTS, root container. 139/139 tests pass. Uncommitted: CLAUDE.md, EVALS.md, .dockerignore, tests, and the parked EVALS 018 LEAD_TRIM_MS change in fetch_lyrics.py — committing that shifts live timing ~200ms, so decide it on purpose. Open risk: displaying full synced lyrics is a copyright exposure." },
  { id: '2', name: "Candace Uncut Pipeline", description: "Auto-curated and clipped highlight moments from Candace Owens content into YouTube Shorts.", status: "archived", category: "Content Automation", techStack: ["Python"], apis: ["yt-dlp", "Groq Whisper", "LLaMA", "FFmpeg", "Pushover"], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/yt_cu", notes: "ARCHIVED — YouTube banned the account and cancelled the channel. The pipeline itself worked; the distribution channel is gone. File: candace_pipeline.py." },
  { id: '3', name: "StrongAutomation Dashboard", description: "MCP tool server (27 tools across 12 modules) plus a Next.js control center pulling live data from every service I run.", status: "development", category: "Infrastructure", techStack: ["TypeScript", "Next.js 16", "React 19", "Tailwind 4", "Recharts", "MCP SDK", "Zod", "Vitest"], apis: ["OpenAI", "Alpaca", "Google Analytics 4", "PostHog", "ClickUp", "Apify", "Instagram Graph", "Microsoft Clarity", "Railway GraphQL", "Cal.com", "LRCLIB"], hosting: "Vercel (dashboard + crons); MCP server runs locally over stdio", url: "", repoUrl: "https://github.com/strongj3369/my-ai-dashboard", deployMethod: "git push → Vercel; 3 Vercel cron jobs", folder: "D:/my-dashboard", notes: "Deployed on Vercel with 3 active crons, but NOT shipped — close, not fully ready. Deployed is not the same as done. Root package is the MCP server (extendedcode, colortunelyrics, echoflow, marketing, videoscrubber, analytics, stocks, clarity, instascrubber, competitiveintel, clickup, utilities). Competitive-intel uses SHA-256 content hashing so the LLM only fires on real change, then opens ClickUp tasks. Heads-up: plaintext .env and a Google service-account JSON sit in the working tree." },
  { id: '4', name: "Stock MCP Engine", description: "MCP server exposing Alpaca paper-trading, market-data and research tools to an LLM client, plus a weekday after-close research run that ranks 5 companies and pushes the result to my phone.", status: "live", category: "Finance", techStack: ["Python", "MCP (FastMCP)", "alpaca-py", "Claude Code CLI (print mode, tools off)", "Windows Task Scheduler", "static HTML dashboard"], apis: ["Alpaca Paper Trading", "Alpaca Market Data + screener + news", "Finnhub (fundamentals, analyst ratings, earnings)", "Claude (haiku, via CLI)", "Pushover"], hosting: "Local (stdio MCP server + Windows scheduled task)", url: "", repoUrl: "https://github.com/strongj3369/alphastock-engine", deployMethod: "Local .venv as stdio MCP server; auto_research.py --install creates the 'stock-mcp research' task (weekdays 2:30 PM MT)", folder: "D:/stock-mcp", notes: "Guardrails still non-bypassable: paper=True forced, MAX_QTY=1, allowlist is a hand-edited constant — now 10 symbols (original AAPL/MSFT/NVDA/SPY/TSLA + NU/T/VZ/SPCX/AAL added 2026-10-11 from the research log). New read-only research layer: research.py (MCP tools), auto_research.py (screen → data pack → one capped $0.50 haiku call → strict JSON checked against the pack → research_log.jsonl), dashboard.py rebuilds research_dashboard.html, notify.py sends Pushover. The research code can never place orders or change the allowlist. CURRENTLY FAILING: the 2026-10-23 run errored with 'claude CLI not found on PATH' — the scheduled task can't see the Claude CLI. New files are uncommitted/untracked; .env is gitignored." },
  { id: '5', name: "JS Dash", description: "Password-protected personal cash-flow dashboard that pulls live Chase balances and renders a running bill/payday calendar with forecast balances.", status: "live", category: "Personal Finance", techStack: ["Python", "Flask", "gunicorn", "HTML", "CSS", "JavaScript"], apis: ["SimpleFIN (Chase bank data)"], hosting: "Vercel (project 'cash-flow')", url: "", repoUrl: "https://github.com/strongj3369/cash-flow", deployMethod: "Vercel CLI ('Deploy to Vercel.bat')", folder: "D:/2025cal_scheduled", notes: "Formerly listed as 'Bill Calendar AI' — there's no AI in it. Real automation is the SimpleFIN bank pull (30-min cache + /refresh endpoint); bill and forecast rows are still hand-edited in dashboard.html. Most actively maintained project I have." },
  { id: '6', name: "Celestial Destiny", description: "Paid birth-card reading site — visitor enters a birth date, gets a free reading on-site, and can buy a multi-page PDF report that's generated and emailed automatically.", status: "live", category: "Creative AI / Digital Products", techStack: ["React 18", "Vite", "react-router-dom", "Vercel serverless (Node ESM)", "PWA", "puppeteer-core + @sparticuz/chromium", "Upstash Redis", "Vercel Blob"], apis: ["Stripe (checkout + webhooks)", "Upstash Redis", "Vercel Blob", "Resend (email)", "Google Analytics 4"], hosting: "Vercel", url: "https://destinyrealm.com", repoUrl: "https://github.com/strongj3369/celestialdestiny", deployMethod: "Vercel auto-deploy on push to master; daily /api/keepalive cron", folder: "D:/_card_rewrites", notes: "Real asset is the content: 314 hand-written readings (52 cards × 6 layers + Jester) governed by MASTER-SPEC.md, with an offline eval harness. Since Aug: daily Redis keepalive cron (Upstash free tier archives a DB after 14 idle days; CRON_SECRET-protected), and support email moved to corporate@thestrongautomation.com. New suit/card art (Rivers, Feathers, Mountains, Sky, Third Eye, Jester, Instagram card images) plus sitemap/robots and a maintenance page — about 15 of the image files are still untracked in git. Open per DEPLOY-RECORD.md: provision Blob, prove a full test purchase, flip to live Stripe keys; mobile CSS is the launch-gating item." },
  { id: '7', name: "JSUE", description: "Autonomous opportunity-scouting agent that scanned for demand signals on a cron and pinged my phone only when signals converged.", status: "paused", category: "Market Intel", techStack: ["Python", "Anthropic SDK (claude-haiku-4-5)", "GitHub Actions (cron, disabled)", "Markdown-as-state"], apis: ["Anthropic Claude API", "Pushover"], hosting: "GitHub Actions cron (currently disabled)", url: "", repoUrl: "https://github.com/strongj3369/jsue", deployMethod: "GitHub Actions workflow running jsue_loop.py, committing state back to the repo", folder: "D:/JSUE", notes: "Wiped to a blank slate 2026-07-30 — all prior state moved to _archive/, schedule commented out, nothing rebuilt since. Ran ~$2/month on haiku at a 4-hour cadence. Documented failure mode worth remembering: unpushed local commits made cycles read stale state and confabulate their own history." },
  { id: '8', name: "AI Marketing Tool", description: "Creators upload screenshots; tool returns ready-made sales previews.", status: "development", category: "Creator Tools", techStack: [], apis: [], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/AI-Marketing-tool", notes: "Concept stage. Folder not connected — details unverified since the last inventory pass." },
  { id: '9', name: "Diagnostic Tool", description: "Chrome extension that evaluates company websites and suggests AI-driven improvements.", status: "development", category: "Diagnostics", techStack: ["JavaScript", "Manifest V3", "Claude API"], apis: ["Claude", "Chrome APIs"], hosting: "Local + Chrome extension", url: "", repoUrl: "", deployMethod: "", folder: "D:/diagnostic-tool", notes: "Folder not connected — details unverified since the last inventory pass." },
  { id: '10', name: "Insta-scraper", description: "MCP server that scrapes Instagram creators via Apify, downloads their reels, transcribes them locally with Whisper, and can stitch top clips into a compilation.", status: "paused", category: "Content Automation", techStack: ["TypeScript", "Node.js", "MCP SDK", "Python (faster-whisper subprocess)", "ffmpeg"], apis: ["Apify (instagram-scraper actor)", "faster-whisper (local)"], hosting: "Local (stdio MCP server)", url: "", repoUrl: "", deployMethod: "npm run build → node dist/index.js", folder: "D:/insta-scaper", notes: "Ran successfully at least once — real scraped output, 8 downloaded reels, an 81MB compilation.mp4 — then nothing since 2026-02-15. No git repo. Pipeline is hard-coded to scrape 'evolving.ai'." },
  { id: '11', name: "SIGNAL", description: "Automated news site — pulls ~20 RSS feeds every six hours, has Claude write and adversarially fact-check short briefs, and publishes to a live Next.js site with push notifications.", status: "live", category: "Content Automation", techStack: ["Next.js 14 (App Router)", "React 18", "TypeScript", "Tailwind", "Python 3.11 (feedparser, trafilatura, APScheduler)", "JSON-as-CMS"], apis: ["Anthropic API (claude-haiku-4-5, two-pass synthesizer + verifier)", "Congress.gov", "~20 RSS feeds", "OneSignal web push", "Google Analytics", "Vercel Analytics"], hosting: "Vercel", url: "https://signal-newsblog.vercel.app", repoUrl: "https://github.com/strongj3369/signal-news", deployMethod: "Vercel auto-deploy on push to main; GitHub Actions scrape every 6h, healthcheck every 3h", folder: "D:/NEWS_BLOG/signal-app", notes: "This is what the old 'News Blog Automation' became — it's running, not broken. Local working copy is stale: 10 modified files are uncommitted and NOT on the live site. next.config.mjs deliberately ignores TS/lint errors at build, so that safety net is off. Local `npm run build` is broken on this machine (webpack EISDIR on NTFS) — Vercel is the only build truth." },
  { id: '12', name: "AI Inventory Dashboard", description: "This dashboard — personal index of every AI project, tool, and site.", status: "live", category: "Infrastructure", techStack: ["React", "Vite", "Tailwind", "lucide-react"], apis: [], hosting: "GitHub Pages", url: "https://strongj3369.github.io/AI-inventory/", repoUrl: "https://github.com/strongj3369/AI-inventory", deployMethod: "Auto (GitHub Actions → Pages, on push to main)", folder: "D:/AI_inventory", notes: "What you're looking at right now. State lives in browser localStorage seeded from SEED_AGENTS in src/App.jsx — browser edits are per-device and don't write back to the repo, so this file is the source of truth." },
  { id: '13', name: "JenniferStrong.dev", description: "Personal portfolio site — showcases templates, skills, and work.", status: "live", category: "Website / Portfolio", techStack: ["HTML", "CSS", "JavaScript"], apis: [], hosting: "GitHub Pages", url: "https://jenniferstrong.dev", repoUrl: "https://github.com/strongj3369/jenniferstrong.dev", deployMethod: "Auto (GitHub Actions)", folder: "D:/NEW-IMPROVED-PORT", notes: "Main professional portfolio. Folder not connected — details unverified since the last inventory pass." },
  { id: '14', name: "ExtendedCode", description: "Single-page lead-gen site for AI automation services, with a scripted chat-style intake form that emails submissions.", status: "live", category: "Website / Services", techStack: ["HTML", "CSS", "JavaScript"], apis: ["formsubmit.co"], hosting: "GitHub Pages (custom domain via CNAME)", url: "https://extendedcode.com", repoUrl: "https://github.com/strongj3369/extendedcode", deployMethod: "GitHub Pages branch publishing from main (no Actions workflow)", folder: "D:/extendedCode-site/extendedcode", notes: "Everything is one 45KB index.html. The 'chatbot' is a hard-coded 8-step scripted flow, not an LLM — it posts to formsubmit.co. Current copy targets creator-businesses and solo operators." },
  { id: '15', name: "EchoFlow", description: "Voicemail-to-memo automation with caller intent detection and next-step routing.", status: "idea", category: "Async Ops", techStack: ["Python (FastAPI)", "Whisper", "Claude API", "Pydantic", "Webhooks"], apis: ["Twilio", "Groq (Whisper)", "Claude", "Pushover"], hosting: "TBD", url: "", repoUrl: "", deployMethod: "", folder: "TBD", notes: "Originally a Nucamp course concept. Worth a second look: there's already a working 'echoflow' module and dashboard tab in StrongAutomation Dashboard, so this may be further along than 'idea'." },
  { id: '16', name: "Strong Labs Practice Platform", description: "Hands-on HTML/CSS learning platform. 8 email templates + 10 landing pages + 5 multi-page sites, all AI-built. Three-tier pricing designed (Starter $0, Refiner $12, Builder $35) but not deployed.", status: "paused", category: "Product / Learning Platform", techStack: ["HTML", "CSS", "JavaScript", "AI-assisted"], apis: [], hosting: "Local only", url: "", repoUrl: "", deployMethod: "", folder: "D:/samsung-1tb/practice-platform", notes: "23 finished templates sitting unused. Potential revenue path: bundle and sell on Gumroad/Etsy. Or use as a portfolio asset to showcase build volume. Folder not connected — unverified this pass." },
  { id: '17', name: "Nicole AI", description: "Two-channel AI sales agent for ExtendedCode — a Groq-powered web chat widget that qualifies leads, plus a Vapi voice assistant that checks Cal.com availability and books strategy calls.", status: "paused", category: "Voice AI / Sales", techStack: ["TypeScript", "Node.js", "Express", "Vapi", "MCP SDK", "ngrok"], apis: ["Vapi", "Cal.com API v2", "Groq (llama-3.3-70b)", "OpenAI gpt-4o-mini (via Vapi)", "ElevenLabs (voice)", "Deepgram (transcription)", "SMTP / nodemailer"], hosting: "Local Express server exposed via ngrok; Vapi cloud hosts the voice assistant", url: "", repoUrl: "https://github.com/strongj3369/appointment-setter-extendedcode", deployMethod: "Manual: npm run build + node dist/server.js, ngrok tunnel, then push assistant config to Vapi", folder: "D:/Sales-appointment-setter", notes: "PAUSED — it works, I'm just not running it right now. Key fragility: only the voice layer is on Vapi — the brains (tool execution, Cal.com booking, lead store, email) run on a local server behind an ngrok tunnel, so it breaks whenever this machine is down. Also: the committed scripts still use the older 'Alex' outbound persona; the newer 'Nicole' inbound config script is untracked in git." },
  { id: '18', name: "News Digest", description: "Daily AI-curated security/military intel digest pushed to phone via Pushover. Covers war, geopolitical tensions, US threat level, and includes a 'Reality Check' grounding statement to keep things factual.", status: "live", category: "Personal Intelligence", techStack: ["Python (likely)", "Claude API or similar"], apis: ["Pushover", "News sources / RSS"], hosting: "Local or server", url: "", repoUrl: "", deployMethod: "Scheduled / cron", folder: "TBD", notes: "Personal use — built to stay grounded in verified info while my mom consumes prepper content. Daily push to phone. Folder not connected — unverified this pass." },
  { id: '19', name: "Refrakt", description: "Takes one post, has Claude reformat it for each platform, then schedules and publishes it — now multi-brand, with a media library and a Reel builder.", status: "live", category: "Content Automation", techStack: ["Node.js (zero dependencies, raw http)", "Vanilla JS single-page UI", "JSON files as datastore", "node:test"], apis: ["Anthropic API (claude-haiku-4-5)", "Bluesky AT Protocol", "Pinterest v5 API", "Meta Graph API (Facebook Pages + Reels, Instagram posts + Reels)", "Threads API", "Mastodon (disabled)"], hosting: "Local (node server.js)", url: "http://localhost:3000", repoUrl: "https://github.com/strongj3369/refrakt-app", deployMethod: "Manual (node server.js); work done on feature branches, merged to main", folder: "D:/refrakt/refrakt-local", notes: "Publishes to Bluesky, Pinterest, Facebook (incl. the Nova Sloane Page), Instagram and Threads — Threads now has a real publish path. Meta is dev access, so it only posts to my own Pages; going public needs Meta App Review / business verification. Since Aug: brands (separate accounts per brand, account pictures), a Library of each brand's images/music/videos with a popup player, Reels with looks and effects (fog, smoke, sparkles, candle glow), per-card links, failed posts are never a dead end, one-at-a-time posting, tab in the URL. NOW BACKED UP: GitHub remote refrakt-app with feature branches; local main is 5 commits ahead of origin (reel-effects not pushed). Brands build works in a separate worktree (refrakt-brands-test) — phase 6 switch-over waits on my go-ahead. Folder is cluttered with dozens of *.backup-*.js/html files that git already covers. Token JSON files (bluesky/meta/pinterest/threads) sit in the folder — confirm they're gitignored. The Safe-Publish throttle is the anti-flag logic and the most fragile piece." },
  { id: '20', name: "Billing Fixer", description: "Reads a behavioral-health practice's denied insurance claims, classifies why each was denied, and proposes the exact correction or appeal to recover the money.", status: "development", category: "Healthcare RCM", techStack: ["Python 3 (stdlib-only harness)", "JSONL dataset + CSV run history", "static HTML/JS dashboards"], apis: ["Anthropic Claude API", "Groq (llama-3.3-70b)", "Google Gemini (2.5 Flash)"], hosting: "Local", url: "", repoUrl: "", deployMethod: "Manual (run_eval.py from CLI)", folder: "D:/Billing-fixer", notes: "The eval harness is the mature part: 21 synthetic no-PHI denial cases, confusion matrix, per-bucket P/R/F1, disciplined journal. Best real score 90.5% on Groq under prompt v1 — but the taxonomy was then split 6→7 buckets (v2), which invalidates that baseline. Outstanding next step: the v2 re-baseline. No git repo, so the eval history has no backup. Real claims would need a signed BAA with the model vendor." },
  { id: '21', name: "InterviewApp", description: "Listens during an interview or live member call and instantly puts the right answer card on screen with keywords and a 20-second spoken script.", status: "development", category: "Personal Productivity", techStack: ["Vanilla JS (ES modules)", "Node build scripts", "Web Speech API", "transformers.js (MiniLM embeddings)"], apis: ["Anthropic Messages API (optional)", "Chrome/Edge speech recognition"], hosting: "Local", url: "", repoUrl: "", deployMethod: "Manual (node build.mjs, run from start-here.bat)", folder: "D:/interview-app", notes: "Two decks share one matcher. The WTCHP call deck is strong — 93% first-place, 100% top-3 on 41 unseen questions. The AI-engineering interview deck is weak — 41% first-place, 74% top-3, because the vocabulary isn't distinctive enough. cue.html and wtc.html are GENERATED; edit src/ and rebuild or your changes get overwritten. No git repo." },
  { id: '22', name: "Etsy-RunOffline", description: "Offline single-file web app for dog groomers — tracks clients, pets, vaccination expiry, and rebooking. Sold on Etsy as a no-subscription download.", status: "archived", category: "Digital Products / Ecommerce", techStack: ["Single-file HTML + vanilla CSS/JS", "localStorage", "light/dark theming"], apis: [], hosting: "Etsy (digital download); product itself runs fully offline in the buyer's browser", url: "https://runoffline.etsy.com", repoUrl: "", deployMethod: "Etsy digital listing — auto-delivers the ZIP on payment", folder: "D:/etsy/dog-grooming", notes: "DONE (2026-10-23). Listing: 'Pet Grooming Client Manager' at runoffline.etsy.com. Fully built: app, 320KB delivery ZIP, START-HERE.pdf, licence, 15 listing images, demo video, full brand set. Two open items from the build: LICENCE.txt still needs the real shop URL inserted then re-zipped, and no real groomer has click-tested it yet — every design decision came from forum posts and competitor teardowns. Research-led (niche scan + demand findings drove the feature set). Local git repo since 2026-08-24 (71 files, no remote — deliberately not on GitHub); the 2FA codes live one level up in D:/etsy, outside the repo. STILL NEEDS AN OFF-DISK BACKUP: a local repo dies with the drive, and this is the only copy of a product that's selling. NOTE: etsy-setup-checklist.md in the folder is stale/unchecked; ignore it." },
  { id: '23', name: "Celestial Destiny Agent OS", description: "Packaged Cowork agent that acts as the marketing team for destinyrealm.com — drafts on-brand Pinterest/Instagram pin images and matching captions for approval before posting.", status: "live", category: "Content Automation / Marketing Agent", techStack: ["Claude Code / Cowork agent skill (CLAUDE.md + .claude/skills)", "Markdown context files", "Python 3 + Pillow"], apis: ["Higgsfield MCP (suggested, not wired)", "Metricool / Meta Business Suite (suggested, not wired)"], hosting: "Local", url: "https://destinyrealm.com", repoUrl: "", deployMethod: "Manual (install folder into Cowork, run the celestial-pins skill)", folder: "D:/celestial-agents/Celestial-Destiny-OS", notes: "In daily use on destinyrealm.com. A real packaged agent, not a script: CLAUDE.md as northstar, /context for brand facts, a self-updating memory.md, and generate_pins.py rendering 1000×1500 pins from the actual card art. Golden rule is baked in — the agent drafts and queues, I approve, nothing goes live unattended. Output is produced in the Cowork session and published through Refrakt, so the folder's file dates never move — do not read them as inactivity. Two context files (offer-catalog.md, card-system.md) are still stubs." },
  { id: '24', name: "WTCHP Reference Library", description: "Curated, source-dated notes and official PDFs on World Trade Center Health Program coverage rules, so answers given on live member calls trace back to a real document.", status: "live", category: "Knowledge Base", techStack: ["Markdown notes", "PDF source documents"], apis: ["cdc.gov/wtc (checked manually)"], hosting: "Local", url: "", repoUrl: "", deployMethod: "", folder: "D:/WTC-ADMIN", notes: "Not software — a maintained knowledge base, and the upstream source for the WTC deck in Cue Cards. _SOURCE_CURRENCY_AUDIT.md is the control doc: it flags stale citations and logged one real policy change (2025 handbook moved travel reimbursement to over 250 ROUND-TRIP miles). Tracker follows the NPN→NPA transition to Sedgwick (~Jan 2027), the July 2026 Generic First pharmacy rule, and a June 2026 telehealth claims bug. Three non-public docs are still missing and block definitive answers: the Codebook (Vols A & B), the Pharmacy Formulary, and the NTI drug list. Currency check is manual with no reminder." },
  { id: '25', name: "StrongPantry", description: "Web app that tells a household on a tight budget what to buy this week to build a deeper pantry — tracks what's on hand, counts days of meals, and makes the weekly and in-store shopping lists, using USDA price forecasts.", status: "live", category: "Consumer App / Micro-SaaS", techStack: ["Next.js 16", "React 19", "TypeScript", "Supabase (Postgres + RLS, magic-link auth)", "Vitest + PGlite", "barcode-detector", "Claude Code agent team (.claude/agents)"], apis: ["Supabase", "Stripe (Checkout subscriptions + customer portal)", "USDA ERS food price outlook (CPI/PPI, monthly cron)", "Vercel Cron"], hosting: "Vercel", url: "https://www.strongpantry.com", repoUrl: "https://github.com/strongj3369/ai-pantry-builder", deployMethod: "Vercel on push to main; numbered Supabase migrations run on the live project before the code that needs them; GitHub check workflow", folder: "D:/Pantry-Builder/ai-pantry-builder", notes: "Formerly 'Pantry Builder' / 'The Strong Pantry' (renamed StrongPantry 2026-10-06). Live since 2026-10-07; billing live since 2026-10-18 — free: days-of-meals number, pantry, price outlook; paid $4.99/mo or $39/yr: weekly list, shopping list, later price alerts; first week free. Go-live smoke run passed 124/124. Built by a 19-agent Claude team (builder, code/design/security reviewers, QA, eval grader, release checker, marketing, SEO, conversion, tracking, policies, support, plus 4 'impeccable' finish agents). Latest releases (Oct 21): home-canned jars, scan-to-add-to-existing items, meat counted in pounds (migrations 0013–0015). Migrations are frozen once run and pinned byte for byte by tests. Next: Claude features, Updates posts, idea box, email. Uncommitted: BACKLOG.md, CLAUDE.md, the 4 new impeccable agents/skill, mockups/." },
];

// Fingerprint of the seed data above. Whenever SEED_AGENTS changes in this
// file, this value changes too — and the app reloads from the seed instead of
// serving a stale copy out of localStorage. The code is the source of truth;
// no more bumping a version key by hand every time a status is corrected.
const SEED_FINGERPRINT = (() => {
  const s = JSON.stringify(SEED_AGENTS);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
})();

const emptyAgent = () => ({
  id: '',
  name: '',
  description: '',
  status: 'development',
  category: '',
  techStack: [],
  apis: [],
  hosting: '',
  url: '',
  repoUrl: '',
  deployMethod: '',
  folder: '',
  notes: '',
});

const inputClass = "w-full px-3 py-2 bg-white border-[1.5px] border-[#FFE4EC] rounded-full text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] transition-colors";
const textareaClass = "w-full px-3 py-2 bg-white border-[1.5px] border-[#FFE4EC] rounded-2xl text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] transition-colors resize-none";

export default function AgentInventory() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadSeed = () => {
      setAgents(SEED_AGENTS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ fingerprint: SEED_FINGERPRINT, agents: SEED_AGENTS }));
      } catch {}
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        loadSeed();
      } else {
        const saved = JSON.parse(raw);
        if (saved && saved.fingerprint === SEED_FINGERPRINT && Array.isArray(saved.agents)) {
          setAgents(saved.agents);
        } else {
          loadSeed();
        }
      }
    } catch {
      loadSeed();
    }
    setLoading(false);
  }, []);

  const persist = (next) => {
    setAgents(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fingerprint: SEED_FINGERPRINT, agents: next })); } catch (e) { console.error(e); }
  };

  const startNew = () => {
    setEditing({ ...emptyAgent(), id: Date.now().toString() });
    setIsNew(true);
  };

  const startEdit = (agent) => {
    setEditing({ ...agent });
    setIsNew(false);
  };

  const saveEdit = () => {
    if (!editing.name.trim()) return;
    const next = isNew
      ? [...agents, editing]
      : agents.map(a => a.id === editing.id ? editing : a);
    persist(next);
    setEditing(null);
    setIsNew(false);
  };

  const deleteAgent = (id) => {
    if (!confirm('Delete this agent?')) return;
    persist(agents.filter(a => a.id !== id));
  };

  const resetAll = () => {
    if (!confirm('Reset to default agent list? Your edits will be lost.')) return;
    persist(SEED_AGENTS);
  };

  const updateField = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value }));
  };

  const updateListField = (field, value) => {
    setEditing(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const filtered = agents.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search && !`${a.name} ${a.description} ${a.category} ${a.techStack.join(' ')} ${a.apis.join(' ')} ${a.repoUrl || ''} ${a.deployMethod || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: agents.length,
    live: agents.filter(a => a.status === 'live').length,
    development: agents.filter(a => a.status === 'development').length,
    paused: agents.filter(a => a.status === 'paused').length,
    idea: agents.filter(a => a.status === 'idea').length,
    archived: agents.filter(a => a.status === 'archived').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFAFB] flex items-center justify-center">
        <div className="text-[#B85878] italic">Loading inventory…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAFB] text-[#6B4456]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-[10px] bg-[#FF3D8A] flex items-center justify-center"
                style={{ boxShadow: '0 0 0 3px #FFE4EC' }}
              >
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-glam text-4xl font-bold tracking-tight text-[#C2185B]">Agent Inventory</h1>
            </div>
            <p className="italic text-[#B85878]">What you've built and what's running it. ✨</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FFE4EC] text-[#C2185B] border-[1.5px] border-[#FFB8D1] rounded-full font-medium transition-colors text-sm"
              title="Reset to default agent list"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Agent
            </button>
          </div>
        </div>

        {/* Decorative hairline */}
        <div className="gradient-hairline mb-6" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {['all', 'live', 'development', 'paused', 'idea', 'archived'].map(key => {
            const isActive = filter === key;
            const isAll = key === 'all';
            const cfg = STATUS_CONFIG[key];
            const label = isAll ? 'Total' : cfg?.label || key;

            const baseStyle = isAll
              ? { background: '#FF3D8A', color: '#FFFFFF', borderColor: 'transparent' }
              : { background: '#FFFFFF', color: cfg.filterText, borderColor: cfg.filterBorder };

            const activeShadow = isActive ? { boxShadow: '0 0 0 3px #FFE4EC' } : {};

            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="text-left p-4 rounded-[12px] border-[1.5px] transition-all"
                style={{ ...baseStyle, ...activeShadow }}
              >
                <div className="text-2xl font-bold">{counts[key]}</div>
                <div
                  className="text-[10.5px] uppercase mt-1 font-medium"
                  style={{ letterSpacing: '0.06em', color: isAll ? 'rgba(255,255,255,0.85)' : cfg.filterText }}
                >
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B85878]" />
          <input
            type="text"
            placeholder="Search by name, tech, API…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border-[1.5px] border-[#FFE4EC] rounded-full text-[#6B4456] placeholder-[#B85878]/60 focus:outline-none focus:border-[#FF3D8A] text-sm transition-colors"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#B85878] italic border-[1.5px] border-dashed border-[#FFB8D1] rounded-[12px] bg-white">
            No agents match. Try clearing filters or adding a new one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(agent => {
              const cfg = STATUS_CONFIG[agent.status] || STATUS_CONFIG.development;
              return (
                <div
                  key={agent.id}
                  className="group relative overflow-hidden bg-white border-[1.5px] border-[#FFE4EC] rounded-[12px] p-5 pt-6 hover:border-[#FFB8D1] hover:shadow-[0_4px_16px_rgba(255,61,138,0.08)] transition-all"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: cfg.stripeColor }}
                  />
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate text-[#C2185B]">{agent.name}</h3>
                      {agent.category && (
                        <div
                          className="text-[10.5px] uppercase mt-0.5 font-medium text-[#B85878]"
                          style={{ letterSpacing: '0.05em' }}
                        >
                          {agent.category}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(agent)}
                        className="p-1.5 text-[#B85878] hover:text-[#C2185B] hover:bg-[#FFE4EC] rounded-full"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="p-1.5 text-[#B85878] hover:text-[#C2185B] hover:bg-[#FFE4EC] rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border-[1px] text-xs font-medium mb-3"
                    style={{ background: cfg.pillBg, color: cfg.pillText, borderColor: cfg.pillBorder }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${agent.status === 'live' ? 'animate-pulse' : ''}`}
                      style={{ background: cfg.dotColor }}
                    />
                    {cfg.label}
                  </div>

                  {agent.description && (
                    <p className="text-sm text-[#6B4456] mb-4 leading-relaxed">{agent.description}</p>
                  )}

                  <div className="space-y-2.5 text-xs">
                    {agent.techStack.length > 0 && (
                      <div>
                        <div
                          className="flex items-center gap-1.5 text-[#B85878] mb-1.5 uppercase font-medium text-[10px]"
                          style={{ letterSpacing: '0.06em' }}
                        >
                          <Cpu className="w-3 h-3" /> Tech
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.techStack.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full font-medium bg-[#DCFCE7] text-[#166534]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.apis.length > 0 && (
                      <div>
                        <div
                          className="flex items-center gap-1.5 text-[#B85878] mb-1.5 uppercase font-medium text-[10px]"
                          style={{ letterSpacing: '0.06em' }}
                        >
                          <Zap className="w-3 h-3" /> APIs / Services
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.apis.map((t, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full font-medium bg-[#E0F2FE] text-[#075985]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {agent.hosting && (
                      <div className="flex items-start gap-1.5 text-[#6B4456]">
                        <Server className="w-3 h-3 text-[#B85878] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-[#B85878]">Runs on: </span>
                          <span className="text-[#6B4456]">{agent.hosting}</span>
                        </div>
                      </div>
                    )}

                    {agent.url && (
                      <a
                        href={agent.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#FF3D8A] hover:text-[#C2185B] mt-1 font-semibold"
                      >
                        <span aria-hidden="true">↗</span>
                        <span className="truncate">{agent.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      </a>
                    )}

                    {agent.repoUrl && (
                      <a
                        href={agent.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[#6B4456] hover:text-[#C2185B]"
                      >
                        <Github className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <span className="truncate">{agent.repoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      </a>
                    )}

                    {agent.deployMethod && (
                      <div className="flex items-center gap-1.5 text-[#6B4456]">
                        <GitBranch className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <span className="text-[#B85878]">Deploys:</span>
                        <span className="text-[#6B4456] truncate">{agent.deployMethod}</span>
                      </div>
                    )}

                    {agent.folder && (
                      <div className="flex items-center gap-1.5 text-[#6B4456]">
                        <Folder className="w-3 h-3 text-[#B85878] flex-shrink-0" />
                        <code className="font-mono text-[11px] text-[#6B4456] bg-[#FFF8DC] border-[1px] border-[#FFE4A3] rounded-full px-2 py-0.5 truncate">
                          {agent.folder}
                        </code>
                      </div>
                    )}

                    {agent.notes && (
                      <div className="pt-2 mt-2 border-t border-[#FFE4EC] text-[#B85878] italic">
                        {agent.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          style={{ background: 'rgba(194, 24, 91, 0.25)' }}
          onClick={() => setEditing(null)}
        >
          <div
            className="modal-scroll bg-white border-[1.5px] border-[#FFE4EC] rounded-[16px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#FFE4EC] p-5 flex items-center justify-between rounded-t-[16px]">
              <h2 className="font-glam text-2xl font-bold text-[#C2185B]">{isNew ? 'New Agent' : 'Edit Agent'}</h2>
              <button onClick={() => setEditing(null)} className="p-1 text-[#B85878] hover:text-[#C2185B] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <Field label="Name *">
                <input
                  type="text"
                  value={editing.name}
                  onChange={e => updateField('name', e.target.value)}
                  className={inputClass}
                  placeholder="e.g., ColorTuneLyrics"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={editing.description}
                  onChange={e => updateField('description', e.target.value)}
                  rows={2}
                  className={textareaClass}
                  placeholder="What it does"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <select
                    value={editing.status}
                    onChange={e => updateField('status', e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Category">
                  <input
                    type="text"
                    value={editing.category}
                    onChange={e => updateField('category', e.target.value)}
                    className={inputClass}
                    placeholder="e.g., Content Automation"
                  />
                </Field>
              </div>

              <Field label="Tech Stack" hint="comma-separated">
                <input
                  type="text"
                  value={editing.techStack.join(', ')}
                  onChange={e => updateListField('techStack', e.target.value)}
                  className={inputClass}
                  placeholder="Python, JavaScript, MCP"
                />
              </Field>

              <Field label="APIs / Services" hint="comma-separated">
                <input
                  type="text"
                  value={editing.apis.join(', ')}
                  onChange={e => updateListField('apis', e.target.value)}
                  className={inputClass}
                  placeholder="Claude API, Pushover, Alpaca"
                />
              </Field>

              <Field label="Hosting / Where it runs">
                <input
                  type="text"
                  value={editing.hosting}
                  onChange={e => updateField('hosting', e.target.value)}
                  className={inputClass}
                  placeholder="Railway, Local, Vercel, AWS Lambda…"
                />
              </Field>

              <Field label="URL">
                <input
                  type="text"
                  value={editing.url}
                  onChange={e => updateField('url', e.target.value)}
                  className={inputClass}
                  placeholder="https://…"
                />
              </Field>

              <Field label="GitHub Repo">
                <input
                  type="text"
                  value={editing.repoUrl}
                  onChange={e => updateField('repoUrl', e.target.value)}
                  className={inputClass}
                  placeholder="https://github.com/..."
                />
              </Field>

              <Field label="Deploy Method">
                <input
                  type="text"
                  value={editing.deployMethod}
                  onChange={e => updateField('deployMethod', e.target.value)}
                  className={inputClass}
                  placeholder="Auto (GitHub Actions), Manual, n/a..."
                />
              </Field>

              <Field label="Folder" hint="local path">
                <input
                  type="text"
                  value={editing.folder}
                  onChange={e => updateField('folder', e.target.value)}
                  className={inputClass + ' font-mono text-sm'}
                  placeholder="D:/project-folder"
                />
              </Field>

              <Field label="Notes">
                <textarea
                  value={editing.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  rows={2}
                  className={textareaClass}
                  placeholder="Anything else worth remembering"
                />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[#FFE4EC] p-5 flex justify-end gap-2 rounded-b-[16px]">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-[#B85878] hover:text-[#C2185B] rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={!editing.name.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF3D8A] hover:bg-[#C2185B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium"
              >
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label
        className="block text-[11px] uppercase font-medium text-[#B85878] mb-1.5"
        style={{ letterSpacing: '0.06em' }}
      >
        {label}
        {hint && <span className="text-[#B85878]/70 font-normal normal-case ml-2 tracking-normal">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
