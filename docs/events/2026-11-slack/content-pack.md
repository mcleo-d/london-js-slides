# London.js November 2026 (Slack) content pack

`[claude-code | team-alpha | mac-mini | claude-sonnet-5 | none | 2026-11-14T13:51:45Z]`

Single input for S3. Every fact carries its source. Section order is for reading only. Slide copy drafted by the `london-js-content-creator` subagent from the facts below.

Fetch attempts (UTC, 2026-11-12): Meetup event page, attempted 00:06:58, connection failed (no route to host) from this container; facts below are taken from the S2 Story body instead, which cites the Meetup listing as its own source. Slack brand terms of service and slack.com/intl/en-gb/about, fetched successfully 00:05. confcodeofconduct.com, attempted 00:07, connection failed (no route to host).

## Title

- Event: "London.js at Slack on Monday 23 November 2026". Source: S2 Story body, citing https://www.meetup.com/london-js/events/317366197/ (not independently re-fetched this session, see fetch attempts above).
- Date: Monday 23 November 2026. Doors 17:30, to clear registration and security before welcome and talks start. Welcome and talks from 18:30. Event ends about 20:30, then the pub. Source: owner, 13 Nov 2026.
- Venue: Salesforce Tower, 110 Bishopsgate, London EC2N 4AY. Source: owner, 13 Nov 2026. Do not name a floor (S2 Story body instruction).
- Floor closes: 21:00. Source: owner, 13 Nov 2026. The House rules slide now says "We close at 20:30." (owner, 16 Nov 2026).
- Kicker: `// london.js · november 2026`
- Subtitle: "JavaScript in the conversation: chat, bots and agents in the room." Source: slides.jsx, committed 42897f2.
- Chrome date: `23 · 11 · 2026`. Footer: "Mon 23 November 2026 · Doors 17:30" / "Salesforce Tower, 110 Bishopsgate, London EC2N 4AY". Source: slides.jsx, committed 42897f2.
- Footer co-brand: "HOSTED & SPONSORED BY" plus the Slack logo (full-colour, on a white plate). This is a change from the old pack, which specified "Slack" as plain text with no logo; see Host section below for the brand permission rule. Source: slides.jsx, committed 42897f2.

## Access

- Attendees bring photo ID. Source: owner, 13 Nov 2026.
- Salesforce Guest Services emails each guest a QR code for building entry. Source: owner, 13 Nov 2026.
- The guest list (names and emails) goes to Salesforce on Friday 20 November 2026. Source: owner, 13 Nov 2026.
- Registration is capped at 110. Source: owner, 13 Nov 2026.

## Flow

The 13-slide play order, canonical per `London JS - November 2026.html` (mounts s01 to s15; every label reads "NN / 13"):

01 Title (s01) · 02 Welcome (s10) · 03 Tonight (s02) · 04 House rules (s03) · 05 Thank you, Slack (s08) · 06 By numbers (s11) · 07 Announcements (s12) · 08 Talk 01, Tom Kearsley (s04) · 09 Talk 02, Daryl Cecile (s15) · 10 Networking break (s14) · 11 Talk 03, Ryan Cormack (s05) · 12 Talk 04, Jason Pope (s06) · 13 Closing (s13).

Source: London JS - November 2026.html and slides.jsx, owner instruction, 16 Nov 2026.

## Agenda

Source: slides.jsx, owner instruction, 16 Nov 2026 (seven-row agenda on the Tonight slide). Each talk is 15 minutes plus 5 minutes of Q&A. Talk rows carry a subtle highlight.

| Time | Label | Detail |
|---|---|---|
| 18:30 | Welcome | Intro, house rules and announcements |
| 18:40 | Tom Kearsley, Omnea | Talk and Q&A |
| 19:00 | Daryl Cecile, GitHub | Talk and Q&A |
| 19:20 | Networking break | Drinks, conversation and a chance to stretch |
| 19:40 | Ryan Cormack | Talk and Q&A |
| 20:00 | Jason Pope, Slack | Talk and Q&A |
| 20:20 | Close | Drinks with the speakers, then the pub |

## Housekeeping

Kicker: `// before_we_start`. Title: "The important bits". Source: slides.jsx, committed 42897f2 (replaces the prior placeholder-heavy version and absorbs the removed Wi-Fi section as card 04).

- 01 Fire: Note your nearest exit. In an alarm, follow the Slack team's lead.
- 02 Code of conduct: Be kind. Anything feel off? Find an organiser. confcodeofconduct.com.
- 03 Food & drink: Soft drinks and nibbles, thanks to Slack. We close at 20:30.
- 04 Wi-Fi: Ask the Slack team.

## Host: Slack

- One-liner: Slack is the AI-powered platform for work, bringing all your conversations, apps and customers together in one place. Slack was acquired by Salesforce in 2021. Thank you for having us. Source: https://slack.com/intl/en-gb/about, fetched 2026-11-12 00:05Z.
- Brand rule: Slack gave written permission to use its logo on 12 Nov 2026 (Cassie Hatfield, Senior Slack Specialist, Salesforce). Full-colour logo on light backgrounds only; white logo on aubergine backgrounds only, per Slack's Brand Terms of Service. This supersedes the prior "plain text only, no logo" rule. Source: slides.jsx code comment, committed 42897f2.

## Thank you, Slack

- Kicker: `// thank_you`
- Headline: "Thank you, Slack"
- Body: "PLACEHOLDER: Slack's own description, to come from the Slack team."
- Design note: Slack logo, white variant, 180px.

Source: slides.jsx, committed 42897f2. This replaces the prior "Sponsor: Slack" section and its customer stats, which are no longer in the deck.

## By numbers

- Kicker: `// london_js.by_numbers`
- Title: "London.js by numbers"
- Subhead: "24 events since the relaunch, and counting."
- Tiles:
  - **24** - events since the relaunch.
  - **4,518** - Meetup members.
  - **1,819** - LinkedIn followers.
  - **110** - places tonight.
  - **4.7** - stars from 517 Meetup reviews.
  - **26** - floors up tonight.

Source: slides.jsx, committed 42897f2 (all six tiles are now confirmed; the prior "By Numbers" section only had "24" confirmed, with the rest marked PLACEHOLDER).

## Welcome

- Kicker: `// welcome`
- Headline: "Follow London.js"
- Body: "Glad you made it. Scan the QR to follow us on LinkedIn." Source: slides.jsx, committed 42897f2. This is now the only body line; the prior second line, "Three talks coming up - grab a drink and find a seat.", is stale and has been removed, it is not in the current deck.
- QR label: `FOLLOW · linkedin.com/company/london-js`
- Organisers (unchanged from October pack, per S2 Story body instruction):
  - James McLeod: Open Source Program Lead, NatWest Group · FINOS Board Member · London.js Organiser
  - Jordan Potts: Head of Technology, Albany Growth · Co-Founder, London.js
  - Will Laing: Co-Founder, Plan:it · Co-Founder & Organiser, London.js

## Announcements

Unchanged from October pack, per S2 Story body instruction: "Your Announcements" / "Got something for the community? Grab the mic." Keep the open invite to PR against the slide. Source: S2 Story body.

## Talk 01

- Speaker: Tom Kearsley. Role: Product Engineer. Brand: Omnea (text only, no logo). Source: owner, 15 Nov 2026, for the line-up and order.
- Title: Your API's newest user is an LLM.
- Description (not shown on the slide, which has no abstract prop): We built an MCP server so people could ask their AI assistants, from Claude to ChatGPT to Copilot, about their procurement data. Then agents and AI-built dashboards started calling it too, in ways we never planned for. Our logs could tell us what they were doing, but not why. So we asked them. This talk covers what the models told us, what we changed because of it, and what it means for anyone building tools for agents in TypeScript.
- Bio: Tom Kearsley is a Product Engineer at Omnea, the procurement platform, and leads its MCP project: the layer that lets Claude, ChatGPT, Copilot, Gemini and customers' own agents work with their company's procurement data.
- Photo: assets/speaker-kearsley.jpg.
- Source: Tom via Will (WhatsApp), 16 Nov 2026. Bio in Tom's own words.
- Source: linkedin.com/in/thomas-kearsley-6a6278134 (experience: Product Engineer, Omnea, Nov 2024 to present).

## Talk 02

- Speaker: Daryl Cecile, GitHub. Role: Software Engineer. Brand: GitHub lockup, white variant, 40px; the logo is never recoloured or filtered. GitHub logo used by owner decision, 16 Nov 2026.
- Title: Beyond the Reply: Building an AI Support Teammate.
- Bio: Daryl is a Software Engineer at GitHub. Before GitHub, Daryl spent nearly four years at Capital One, latterly as a Senior Software Engineer, and co-founded ProjectFunction. Outside work, Daryl is building Knosh.app and writes about engineering with AI agents at darylcecile.net.
- Photo: assets/speaker-cecile.jpg. No abstract.
- Source: linkedin.com/in/darylcecile, read 16 Nov 2026.

## Talk 03

- Speaker: Ryan Cormack. Role: AI Engineer. No brand (Ryan left Motorway in September 2026). Source: owner, 15 Nov 2026, for the line-up and order.
- Title: Building Open Source Agents using Open Protocols.
- Description (not shown on the slide, which has no abstract prop): MCP, ACP, AG-UI, A2A, OpenTelemetry: the ways agents can operate are changing fast. Ryan shows how to build agents with the open-source Strands Agents SDK, connect them through open protocols, and run them on open-weight models.
- Bio: Ryan is an AI engineer and self-described renaissance developer. Most recently a Principal Engineer at Motorway, Ryan was previously a Principal Engineer at Moonpig and spent four years engineering at Just Eat. Before software, Ryan worked in digital marketing and co-founded MemoryStoria, an EU-backed startup.
- Photo: assets/speaker-cormack.jpg.
- Source: Ryan via Jordan (WhatsApp), 16 Nov 2026. Bio confirmed by Ryan.
- Source: linkedin.com/in/ryancormack (headline "Renaissance Developer and AI engineer"; Motorway Jun 2023 to Sep 2026).

## Talk 04

- Speaker: Jason Pope, Slack. Role: Senior Manager, Solution Engineering. Brand: Slack logo, white variant, 56px. Source: owner, 15 Nov 2026, for the line-up and order.
- Title: `PLACEHOLDER: talk title to come.`
- Abstract: `PLACEHOLDER: not yet supplied`.
- Bio: Jason leads Slack's UK Solution Engineering team, helping customers solve business challenges on the Slack platform and showing how generative AI changes the way teams work. Jason joined Slack in 2022 as a Principal Specialist Solution Engineer and now sits on Slack's UK go-to-market leadership team.
- Photo: assets/speaker-pope.jpg.
- Source: linkedin.com/in/jspope (Senior Manager, Solution Engineering, Slack, Mar 2026 to present).

## Networking break

- Slide 10 of 13, between Talk 02 and Talk 03. No kicker.
- Headline: "Networking break"
- Lead: "Back at 19:40 with Ryan Cormack"
- Body: "Grab a drink, meet someone new and stretch your legs."
- Right column: the Welcome slide's QR code and two-line `FOLLOW` / `linkedin.com/company/london-js` label.

Source: slides.jsx, owner instruction, 16 Nov 2026.

## Closing

- Kicker: `// thank_you_and_whats_next`
- Headline: "Thank you"
- Body 1: "Thanks to Slack for hosting and sponsoring tonight, and to tonight's speakers for sharing their time and knowledge."
- Body 2: "London.js returns in early 2027."
- QR label: `FOLLOW · linkedin.com/company/london-js`
- Design note: Slack logo, white variant, 72px.

Source: slides.jsx, committed 42897f2.

## Design notes

- The yellow london.js header mark appears on slides 02 to 13 (the aubergine-background slides); slide 01 (yellow background) keeps the header mark in ink colour, not yellow.
- Cream kickers (the mono `//` labels) on the aubergine slides.
- Yellow agenda times on the Tonight slide.
- Slack logo sizes: Title slide 96px on a white plate; Thank you, Slack slide 180px; Closing slide 72px.
- The Welcome slide's organiser photo and QR code are both 300 by 300 px.

Source: slides.jsx, committed 42897f2 (read-only reference).
