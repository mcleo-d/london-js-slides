# London.js November 2026 (Slack) content pack

`[claude-code | team-alpha | mac-mini | claude-sonnet-5 | none | 2026-11-14T13:51:45Z]`

Single input for S3. Every fact carries its source. Section order is for reading only. Slide copy drafted by the `london-js-content-creator` subagent from the facts below.

Fetch attempts (UTC, 2026-11-12): Meetup event page, attempted 00:06:58, connection failed (no route to host) from this container; facts below are taken from the S2 Story body instead, which cites the Meetup listing as its own source. Slack brand terms of service and slack.com/intl/en-gb/about, fetched successfully 00:05. confcodeofconduct.com, attempted 00:07, connection failed (no route to host).

## Title

- Event: "London.js at Slack on Monday 23 November 2026". Source: S2 Story body, citing https://www.meetup.com/london-js/events/317366197/ (not independently re-fetched this session, see fetch attempts above).
- Date: Monday 23 November 2026. Doors 17:30, to clear registration and security before welcome and talks start. Welcome and talks from 18:30. Event ends about 20:30, then the pub. Source: owner, 13 Nov 2026.
- Venue: Salesforce Tower, 110 Bishopsgate, London EC2N 4AY. Source: owner, 13 Nov 2026. Floor 26 is public on the Meetup listing; slide 06 uses it (owner decision, 20 Nov 2026).
- Floor closes: 21:00. Source: owner, 13 Nov 2026. The House rules slide now says "We close at 20:30." (owner, 16 Nov 2026).
- Kicker: `// london.js · november 2026`
- Subtitle: "JavaScript in the conversation: chat, bots and agents in the room." Source: slides.jsx, committed 42897f2.
- Tagline, beneath the subtitle in the secondary text style: "Learn, Share, Use JavaScript." Source: owner decision, 20 Nov 2026.
- Chrome date: `23 · 11 · 2026`. Footer: "Mon 23 November 2026 · Doors 17:30" / "Salesforce Tower, 110 Bishopsgate, London EC2N 4AY". Source: slides.jsx, committed 42897f2.
- Footer co-brand: "HOSTED & SPONSORED BY" plus the unmodified Slack full-colour SVG at 96px on the yellow title background (no filter, no white plate; owner decision, 20 Nov 2026; see the Design notes). This is a change from the old pack, which specified "Slack" as plain text with no logo; see Host section below for the brand permission rule. Source: slides.jsx, committed 42897f2.

## Access

- Attendees bring photo ID. Source: owner, 13 Nov 2026.
- Salesforce Guest Services emails each guest a QR code for building entry. Source: owner, 13 Nov 2026.
- The guest list (names and emails) goes to Salesforce on Friday 20 November 2026. Source: owner, 13 Nov 2026.
- Registration is capped at 110. Source: owner, 13 Nov 2026.

## Flow

The 14-slide play order, canonical per `London JS - November 2026.html` (mounts s01 to s16; every label reads "NN / 14"). Slide 08, the lineup, is approved and in the deck (owner, 20 Nov 2026):

01 Title (s01) · 02 Welcome (s10) · 03 Tonight (s02) · 04 House rules (s03) · 05 Thank you, Slack (s08) · 06 By numbers (s11) · 07 Announcements (s12) · 08 Lineup, chat-style card (s16) · 09 Talk 01, Tom Kearsley (s04) · 10 Talk 02, Daryl Cecile (s15) · 11 Networking (s14) · 12 Talk 03, Ryan Cormack (s05) · 13 Talk 04, Jason Pope and Megan Maguire (s06) · 14 Closing (s13).

Source: London JS - November 2026.html and slides.jsx, owner instruction, 16 Nov 2026.

## Lineup

- Slide 08 of 14, immediately before Talk 01. Approved and in the deck (owner, 20 Nov 2026).
- No kicker. A chat-style card, deliberately not a copy of the Slack app UI. Its header is an h2 with a yellow `.js` badge (decorative, aria-hidden) and the text "tonight’s speakers".
- Four rows in running order, each a panel with a photo, name (40px), role, " at" plus the firm logo (Omnea, GitHub or Slack; none for Ryan Cormack), the talk title (32px) and a left accent bar in that talk's accent colour. Photos are 140px circles with a 3px border in the accent colour; the Slack row shows both co-speaker photos overlapping, with the Slack logo (white, 32px) after each name.
- Per-talk accents (panel left border on the talk slides and the lineup bars): 01 yellow, 02 purple, 03 teal, 04 pink. Tokens: `accent`, `accentPurple`, `accentTeal`, `accentPink` in `slides.jsx`.
- Roles and titles as in the Talk sections below; titles come from `TALK_TITLES` in `slides.jsx`.

Source: slides.jsx as built, owner approval 20 Nov 2026.

## Agenda

Source: slides.jsx as built (seven-row agenda on the Tonight slide, kicker `// agenda`). Each talk is 15 minutes plus 5 minutes of Q&A. Talk rows carry a subtle highlight and show the talk title in the detail column. Firm logos stand in for the old ", Omnea", ", GitHub" and ", Slack" name suffixes: Omnea (40px, white), GitHub lockup (40px) and Slack (white, 56px) sit at the right of the label cell.

| Time | Label | Detail |
|---|---|---|
| 18:30 | Welcome | Intro, house rules and announcements |
| 18:40 | Tom Kearsley (Omnea logo) | Your API’s newest user is an LLM |
| 19:00 | Daryl Cecile (GitHub logo) | Beyond the Reply: Building an AI Support Teammate |
| 19:20 | Networking | Drinks, conversation and a breather |
| 19:50 | Ryan Cormack | Building Open Source Agents using Open Protocols |
| 20:10 | Jason & Megan (Slack logo) | Slack for Communities & Engineering |
| 20:30 | Close | Thank you and goodnight. Pub afterwards, soft drinks very welcome. |

## Housekeeping

Kicker: `// before_we_start`. Title: "The important bits". Source: slides.jsx as built (replaces the prior placeholder-heavy version and absorbs the removed Wi-Fi section as card 04).

- 01 Fire: Note your nearest exit. If the alarm sounds, leave calmly by the stairs, not the lifts, and follow the Slack team’s lead. Need help getting out or around? Ask any organiser.
- 02 Code of conduct: London.js is a friendly, inclusive space for everyone. Be kind and respectful. Anything feel off? Talk to James, Jordan or Will, or anyone from the Slack team. Link: confcodeofconduct.com.
- 03 Food & drink: Soft drinks, water and nibbles at the drinks station, thanks to Slack. Ask the Slack team for toilets or anything else. We close at 20:30.
- 04 Wi-Fi: Ask the Slack team for the guest Wi-Fi details.

## Host: Slack

- One-liner: Slack is the AI-powered platform for work, bringing all your conversations, apps and customers together in one place. Slack was acquired by Salesforce in 2021. Thank you for having us. Source: https://slack.com/intl/en-gb/about, fetched 2026-11-12 00:05Z.
- Brand rule: Slack gave written permission to use its logo on 12 Nov 2026 (Slack's events team). Full-colour logo on light backgrounds only; white logo on aubergine backgrounds only, per Slack's Brand Terms of Service. This supersedes the prior "plain text only, no logo" rule. Source: slides.jsx code comment, committed 42897f2.

## Thank you, Slack

- Kicker: `// thank_you`
- Headline: "Thank you, Slack"
- Body: "Slack is the AI-powered work OS, and the best place for Multiplayer AI: where people, agents, and apps work together."
- Design note: Slack logo, white variant, 300px.

Source: slides.jsx, committed 42897f2. This replaces the prior "Sponsor: Slack" section and its customer stats, which are no longer in the deck.

## By numbers

- Kicker: `// london_js.by_numbers`
- Title: "London.js by numbers"
- Subhead: "Thanks for being part of it."
- Tiles:
  - **24** - events since the relaunch.
  - **4,555** - Meetup members.
  - **1,829** - LinkedIn followers.
  - **110** - places tonight.
  - **4.7** - stars from 517 Meetup reviews.
  - **26** - floors up tonight.

Source: slides.jsx, committed 42897f2 (all six tiles are now confirmed; the prior "By Numbers" section only had "24" confirmed, with the rest marked as to be confirmed).

## Welcome

- Kicker: `// hello_london` (owner decision, 20 Nov 2026)
- Headline: "Welcome"
- Body, one paragraph: "First meetup or fiftieth, you’re welcome. Scan the QR to follow us on LinkedIn." (owner decision, 20 Nov 2026; replaces "Glad you made it."). Source: slides.jsx as built. The prior second line, "Three talks coming up - grab a drink and find a seat.", is stale and has been removed, it is not in the current deck.
- QR label: `FOLLOW · linkedin.com/company/london-js`
- Organisers (owner decision, 20 Nov 2026: each role line is replaced by the firm's logo on the slide):
  - James McLeod: NatWest Group
  - Jordan Potts: Albany
  - Will Laing: Plan:it

## Announcements

Unchanged from October pack, per S2 Story body instruction: kicker `// announcements`, title "Your announcements" (owner decision, 20 Nov 2026) / "Got something for the community? Grab the mic." Keep the open invite to PR against the slide. Source: S2 Story body.

## Talk 01

- Speaker: Tom Kearsley. Role: Product Engineer. Brand: Omnea logo shown under the role (40px, rendered white on the aubergine slide); the agenda and lineup slides show it too. Source: owner, 15 Nov 2026, for the line-up and order.
- Title: Your API’s newest user is an LLM (no trailing full stop on the slide).
- Description (not shown on the slide, which has no abstract prop): We built an MCP server so people could ask their AI assistants, from Claude to ChatGPT to Copilot, about their procurement data. Then agents and AI-built dashboards started calling it too, in ways we never planned for. Our logs could tell us what they were doing, but not why. So we asked them. This talk covers what the models told us, what we changed because of it, and what it means for anyone building tools for agents in TypeScript.
- Bio: Tom Kearsley is a Product Engineer at Omnea, the procurement platform, and leads its MCP project: the layer that lets Claude, ChatGPT, Copilot, Gemini and customers’ own agents work with their company’s procurement data.
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

- Speakers (equal co-speakers, shown side by side, photos 160px, left-aligned 64px apart, a Slack logo under each speaker): Jason Pope, Senior Manager, Solution Engineering, Slack; Megan Maguire, Principal Solution Engineer, Slack. Brand: Slack logo, white variant, 40px, shown once under each speaker. Source: owner, 15 Nov 2026, for the line-up and order.
- Title: Slack for Communities & Engineering.
- Description (not shown on the slide, which has no abstract prop): Supporting collaboration and agent work becomes teamwork.
- Speaker line: Jason Pope, Senior Manager, Solution Engineering, Slack, with a live demo from Megan Maguire, Principal Solution Engineer, Slack. The right panel (labelled ABOUT THE SPEAKERS) shows a short bio for each speaker, with the speaker's name as a small label above each.
- Bio, Jason (full): Jason leads Slack's UK Solution Engineering team, helping customers solve business challenges on the Slack platform and showing how generative AI changes the way teams work. Jason joined Slack in 2022 as a Principal Specialist Solution Engineer and now sits on Slack's UK go-to-market leadership team.
- Bio, Jason (on the slide): Jason leads Slack’s UK Solution Engineering team and sits on its UK go-to-market leadership team, helping customers solve business challenges and showing how generative AI changes the way teams work.
- Bio, Megan (full): Megan is a Principal Solution Engineer at Slack in London, helping organisations transform how they work together with AI, workflow automation and platform integrations. Since joining Slack in 2020, she has moved from supporting small businesses to leading enterprise solution architecture across the UK and Ireland. She speaks regularly at tech and community events, including Slack City Tour Europe and PowerToFly.
- Bio, Megan (on the slide): Megan leads enterprise solution architecture for Slack across the UK and Ireland, helping organisations work together with AI, workflow automation and platform integrations. She speaks regularly at community events, including Slack City Tour Europe.
- Photos: assets/speaker-pope.jpg (Jason), assets/speaker-maguire.jpg (Megan); both 320 x 320 JPEG.
- Source: linkedin.com/in/jspope (Senior Manager, Solution Engineering, Slack, Mar 2026 to present).

## Networking break

- Slide 11 of 14, between Talk 02 and Talk 03. No kicker.
- Headline: "Networking"
- Lead: "Back at 19:50 with Ryan Cormack"
- Body: "Grab a drink, meet someone new and take a breather."
- Right column: the Welcome slide's QR code and two-line `FOLLOW` / `linkedin.com/company/london-js` label.

Source: slides.jsx, owner instruction, 16 Nov 2026.

## Closing

- Kicker: `// thank_you_and_whats_next`
- Headline: "Thank you"
- Greeting (56px, yellow, between the headline and body 1): "Merry Christmas and Happy New Year"
- Body 1: "Thanks for coming, to Slack for hosting, and to our speakers." (owner decision, 20 Nov 2026)
- Body 2: "London.js returns in early 2027."
- QR label: `FOLLOW · linkedin.com/company/london-js`
- Design note: Slack logo, white variant, 120px, under the QR code.

Source: slides.jsx, committed 42897f2.

## Design notes

- The yellow london.js header mark appears on slides 02 to 14 (the aubergine-background slides); slide 01 (yellow background) keeps the header mark in ink colour, not yellow.
- Cream kickers (the mono `//` labels) on the aubergine slides.
- Yellow agenda times on the Tonight slide.
- Slack logo sizes: Title slide 96px (unmodified full-colour SVG on the yellow background, no filter, no white plate); Tonight slide 56px; Lineup slide 32px; Talk 04 slide 40px; Thank you, Slack slide 300px; Closing slide 120px. All white-variant logos sit on aubergine.
- The Welcome slide's organiser photo and QR code are both 300 by 300 px.

Source: slides.jsx as built (read-only reference).
