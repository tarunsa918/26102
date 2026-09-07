
Today 11:37 AM
As you already know that I am Prototype for my hecaton that is sih 26102 problem statement that we already discussed in previous cheques And we already found the dashboard template that is good for our Prototype hackathon minimum prototype But the problem is that this admin dashboard has so many pages and features That is what we like to discuss what pages are relevant to the mvp Make sure that You think from the perspective of the government officer who is going to use the dashboard not from the perspective of a developer Think about what do they want What are the features they might be interested to look on Why they want to navigate the dashboard what kind of information do they want together from the dashboard how can we make sure that they can upload the files or Upload the information regarding the project and view it how it is going How they can chat with the ai model we also have to connect the ai model with the Dashboard and its components so the ai can navigate the projects identify their root cause and give insights That's why first of all let's discuss how many pages do we actually need what kind of features do a user would require government officer would typically like and what we already exist in this project What we have to create And if you have any questions before you begin ask me clarifying questions make sure that you answer like a senior software engineer use design thinking principles and Yagini So that we don't over engineer the project for the heckaton We must make sure that It really solves their problem not increase our technological burden of managing the dashboard but reducing their work giving them insights

Yes. I would not start by deciding which of the template's 20+ screens to keep. That is the developer's framing.

For SIH 26102, we should start with the government officer's job:

“I have hundreds or thousands of MPLADS works. Show me what needs my attention, explain why it needs attention, let me inspect the evidence, and help me decide what to do next.”

That is the product.

The official problem statement explicitly calls for anomaly detection across sanctions, expenditure, payments, progress and asset creation, with risk-based alerts, predictive insights and decision-support dashboards. 

And importantly, I would frame the AI as risk/anomaly detection, not as a system that declares somebody fraudulent. A flagged project is something requiring investigation, not proof of fraud. 

I reviewed the repository as well. It currently provides many generic screens—CRM, Finance, Analytics, Productivity, Logistics, Infrastructure, File Manager, Chat, Calendar, Kanban, Users, Roles, etc.—so there is substantial UI we can reuse, but most of those screens should not survive into the MVP as separate government-facing pages. 

1. First, define the officer's actual workflow
Imagine an officer opening the system Monday morning.

Their workflow is probably:

Open dashboard → see what is abnormal → prioritize → investigate a project → inspect financial/progress/documents → ask AI questions → take/record action → move to next case.

Not:

Dashboard → CRM → Finance → Logistics → Calendar → Kanban → File Manager → ...

That distinction should drive the architecture.

2. I think the MVP needs only 6 primary areas
I would build the prototype around these:

Page / Area	Purpose	MVP
1. Overview	National/state/district situation at a glance	✅ Essential
2. Alerts / Risk Queue	Find projects that need attention	✅ Essential
3. Projects / Works	Search and inspect all MPLADS works	✅ Essential
4. Project Investigation	Deep view of one work	✅ Essential
5. Documents / Evidence	Upload/view supporting records	✅ Essential
6. AI Assistant	Ask questions and investigate through AI	✅ Essential
And then a very small Settings / Officer Profile area can exist, but it isn't part of the actual product story.

That's it.

I would not build separate Finance, Logistics, CRM, Calendar, Kanban, Invoice, Email, etc. pages.

Instead, their useful components get absorbed into the six areas.

3. Page 1 — Overview
This is the officer's command centre.

The question it answers:

“What is happening across the projects I am responsible for, and where should I look first?”

Top-level cards
Something like:

Total Works

12,482

Under Execution

4,821

Delayed

386

High Risk

73

Potential Cost Overruns

41

Unusual Expenditure

29

But don't turn this into a generic analytics dashboard with 15 charts.

The most important component should be:

"Requires Your Attention"
For example:

Risk	Project	Reason	Severity
🔴 High	Community Hall – X	₹18L above peer average	High
🔴 High	Road Work – Y	No progress for 142 days	High
🟠 Medium	Water Facility – Z	Expenditure pattern unusual	Medium
🟠 Medium	Road Work – A	Possible duplicate work	Medium
Clicking one takes the officer directly into the investigation.

That's much more valuable than another pie chart.

4. Overview should have a map of India
This is one of the places where your previous idea about an India map makes sense.

But the map shouldn't exist merely because government dashboards look good with maps.

It should answer:

Where are the problems concentrated?

For example:

India

→ State
→ District
→ Number of works
→ High-risk works
→ Delayed works
→ Cost anomalies

The officer can click:

Madhya Pradesh → District → Projects

This gives the geographic component an actual decision-making purpose.

5. Page 2 — Risk / Alerts
This may actually be the most important page in the entire prototype.

The officer doesn't really want to browse 10,000 projects.

They want:

“Tell me which 20 deserve my attention.”

So create a dedicated Risk Queue.

Filters
State

District

Work type

Implementing agency

Risk level

Anomaly type

Project status

Date range

Anomaly types
For the prototype I'd keep only 4–5:

Cost anomaly

Estimated/sanctioned cost significantly differs from comparable works.

Expenditure anomaly

Spending pattern deviates from comparable projects.

Delay / stalled execution

Project has remained inactive beyond expected duration.

Duplicate / near-duplicate

Similar work appears to exist at the same/nearby location.

Utilisation anomaly

Fund utilisation pattern differs significantly from peers.

These map directly to the problem statement's requested capabilities. 

6. The crucial thing: explain every alert
This is where I would differentiate your prototype.

Don't show:

Risk Score: 87

and leave it at that.

That's meaningless to an officer.

Instead:

🔴 High Risk
Why was this flagged?

Expenditure is 2.4× higher than the median for comparable works in this district.

Comparison

Similar works: 18
Median expenditure: ₹24.6 lakh
This project: ₹58.9 lakh

Additional signal

No progress update recorded in the last 96 days.

AI assessment
“This work warrants manual review because both expenditure and execution patterns deviate from comparable projects.”

[Investigate Project]

That is explainable AI.

And it is much safer than telling the officer:

“This project is fraudulent.”

7. Page 3 — Projects / Works
This is basically the repository's CRM concept, but we rename and redesign it around MPLADS.

The officer needs a searchable master list.

Table
Work	Location	Sanction	Spent	Progress	Risk
Community Hall	District A	₹42L	₹38L	82%	🟢
Road Construction	District B	₹65L	₹61L	34%	🔴
Water Facility	District C	₹28L	₹19L	67%	🟠
Useful filters:

Status

District

State

Work category

Agency

Risk

Sanction year

Completion status

And search should be extremely prominent.

An officer should be able to search:

road construction district indore

or

work ID 12345

and immediately find it.

8. Page 4 — Project Investigation
This is the most important page after the dashboard.

Think of it as a case file, not a project-management page.

When an officer clicks a suspicious project, everything relevant should come together.

Header
Construction of Community Hall

District X, Madhya Pradesh

Risk: HIGH

Under Investigation

Section 1 — Project summary
Work ID

Sanction date

Sanction amount

Implementing agency

Expected completion

Current status

Location

Work category

Section 2 — Financials
Use the useful parts of the existing Finance dashboard.

Show:

Sanctioned

₹45L

Released

₹40L

Spent

₹38.7L

Remaining

₹1.3L

Then a simple expenditure timeline.

Section 3 — Progress
This absorbs the useful parts of the Logistics / Infrastructure screens.

For example:

Sanctioned → Tender → Started → 25% → 50% → 75% → Completed

with actual dates.

Then:

Expected progress: 76%
Reported progress: 41%

That immediately communicates a potential delay.

9. Section 4 — Risk explanation
This should be prominent.

Why this project is flagged
1. Cost anomaly

Project cost is 2.1× the peer-group median.

2. Progress anomaly

Reported progress has remained unchanged for 74 days.

3. Payment pattern

Two payments were made within an unusually short interval.

Then:

View evidence →

This connects the ML system to the UI.

10. Section 5 — Documents
This is where your File Manager becomes useful.

But don't make it a generic Google Drive clone.

The officer should see:

Project Documents
📄 Sanction Order
📄 Administrative Approval
📄 Technical Approval
📄 Work Order
📄 Payment Records
📄 Progress Reports
📷 Site Photographs
📄 Completion Certificate

And:

+ Upload document

When uploading:

Document type
Date
Description
Upload

The AI can subsequently read/index these documents.

That's much more powerful than simply storing files.

11. Page 5 — AI Assistant
I would not make AI merely another chatbot page.

This is a critical design decision.

The AI should be available everywhere, especially inside the Project Investigation page.

Think:

Officer:
Why has this project been flagged?

AI:
The project has three significant signals:

Expenditure is 2.1× the median for comparable works.

Physical progress has remained unchanged for 74 days.

The latest payment occurred despite no corresponding progress update.

Then:

Would you like me to compare this project with similar works?

[Compare]

And the AI can actually navigate the application/data.

12. AI should have access to the dashboard's data
This is where your idea becomes interesting.

The AI shouldn't merely answer questions from an LLM.

It should have tools.

For example:

search_projects()
get_project()
get_expenditure()
get_progress()
get_documents()
compare_projects()
get_risk_signals()
search_documents()
Then an officer could say:

"Show me the highest-risk road projects in this district."

AI:

Searches projects

Filters road projects

Sorts by risk

Returns results

Optionally navigates the officer to the relevant view

Or:

"Why is Project 2847 high risk?"

The AI retrieves the actual project data and explains it.

This is the correct architecture for the AI component.

13. AI should also work with uploaded documents
This is another strong demo moment.

Officer uploads:

Work Order.pdf

Then asks:

"Does the work order amount match the sanctioned amount?"

AI:

Sanctioned amount: ₹42.5 lakh
Work order amount: ₹47.8 lakh
Difference: ₹5.3 lakh

This discrepancy requires review.

And ideally:

View source document

This gives you a genuine AI + government workflow, rather than an AI chatbot bolted onto a dashboard.

14. Page 6 — Evidence / Documents
We could actually make this a lightweight section rather than a huge independent page.

I'm keeping it as a conceptual area because the officer needs somewhere to upload/manage evidence.

The important principle is:

Documents belong to projects.
Not:

“Here's a giant government file manager.”

Instead:

Project → Documents → Upload → AI extracts information → Evidence becomes searchable.

15. What from the existing repository do we actually reuse?
The repository gives us a surprisingly good foundation.

The author already provides these screens:

Analytics

CRM

Finance

Logistics

Infrastructure

File Manager

Chat

Users

Roles

Authentication

etc. 

But I'd map them like this:

Existing template	Our system
Analytics	Overview
CRM	Projects / Works
Finance	Financial section inside Project
Logistics	Progress section inside Project
Infrastructure	Project/works components
File Manager	Project Documents
Chat	AI Assistant
Users	Officer management
Roles	Permissions
Calendar	❌ Remove
Kanban	❌ Remove
Email	❌ Remove
Invoice	❌ Remove
E-commerce	❌ Remove
Academy	❌ Remove
Patient Monitoring	❌ Remove
Productivity	❌ Remove
Multiple dashboard variants	❌ Remove
The repository itself describes these as generic prebuilt dashboards/screens, so we're effectively repurposing components rather than adopting the information architecture wholesale. 

16. What I would NOT build for the hackathon
This is where we save an enormous amount of development time.

❌ Complex role-management system
Have:

Officer Login → Dashboard

That's enough for the prototype.

You can visually demonstrate different permissions if needed, but don't build an enterprise IAM system.

❌ Full notification infrastructure
Just show:

73 items require attention

Don't build SMS/email/push notification infrastructure.

❌ Calendar
No meaningful reason for the MVP.

❌ Kanban
No.

❌ Full document management platform
No.

Upload + classify + view + AI extraction is enough.

❌ Real-time collaboration
No.

❌ Elaborate settings
No.

❌ 15 different analytics charts
Definitely no.

One excellent chart is better than ten meaningless ones.

17. The MVP navigation I would actually put on the sidebar
Something like:

MPLADS MONITORING

⌂ Overview

⚠ Risk & Alerts

▣ Projects

   └ All Projects

◉ Map

🤖 AI Assistant

📁 Documents

──────────────

⚙ Settings
But I would actually consider Map as a component of Overview, rather than a separate page.

Then the sidebar becomes:

Overview
Risk & Alerts
Projects
AI Assistant
Documents
That's five primary navigation items.

The Project Investigation page is reached by clicking a project; it doesn't need to be in the sidebar.

This is a much cleaner information architecture.

18. The entire application then becomes one coherent loop
This is the important part.

                    ┌───────────────┐
                    │   OVERVIEW    │
                    │ "What's wrong?"│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ RISK & ALERTS │
                    │ "What needs   │
                    │  attention?"  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    PROJECT    │
                    │ "What happened?"│
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Financials       Progress       Documents
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                    ┌───────────────┐
                    │ AI ASSISTANT  │
                    │ "Why? What    │
                    │ should I do?" │
                    └───────────────┘
That is the product.

19. The officer's mental model should be our design model
I'd use a very simple design-thinking framework:

Discover
What requires attention?

→ Overview
→ Risk queue

Understand
What is happening?

→ Project details
→ Financials
→ Progress
→ Location

Verify
Is the information supported?

→ Documents
→ Evidence
→ Peer comparison

Ask
Why is this happening?

→ AI

Act
What should I do?

→ Flag for review
→ Add note
→ Assign / mark investigated
→ Export/share finding

That last piece is important.

We don't want the system to merely say:

“Here's an anomaly.”

We want:

“Here's an anomaly → here's why → here's the evidence → here's what you can do.”

20. One small action system is worth adding
Inside a project:

Investigation status
Unreviewed

↓

Under Review

↓

Verified

or

Dismissed

or

Action Required

And a simple:

Officer Note

“Requested clarification from implementing agency.”

This creates the beginning of an actual government workflow without building a gigantic workflow engine.

21. What the hackathon judge should experience
This is how I'd structure the actual demo.

Step 1
Open dashboard.

73 high-risk works detected

The map shows concentrations.

Step 2
Click:

High Risk → 73

Step 3
See:

Community Hall Project — HIGH RISK

Why?

Cost 2.1× peer median

74 days without progress

Unusual expenditure pattern

Step 4
Click project.

See the entire case file.

Step 5
Ask AI:

“Why is this project considered high risk?”

AI explains using actual project data.

Step 6
Ask:

“Compare this with similar projects in the district.”

AI produces comparison.

Step 7
Upload a document.

AI extracts relevant information.

Step 8
AI notices:

Sanctioned amount ≠ work-order amount.

Step 9
Officer:

Mark as Under Review

Add note.

Done.

That is a complete story.

And it directly demonstrates the problem statement's core requirements: anomaly identification, risk-based prioritization, explainable insights, project monitoring, document/evidence handling and decision support. 

22. My recommended MVP scope
I'd draw the boundary here:

🟢 BUILD
Frontend

Overview

Risk queue

Projects table

Project investigation

Map

Financial visualization

Progress timeline

Document upload/view

AI chat

Investigation status

Officer notes

Backend

Project database

Financial/project data

Risk/anomaly results

Document storage

AI service

Basic authentication

AI tool/function layer

AI

Project explanation

Peer comparison

Natural-language project search

Document Q&A

Root-cause hypotheses

Recommended investigation questions

🟡 SIMULATE / SIMPLIFY
Notifications

Roles

Multiple government departments

Data ingestion pipeline

Real-time updates

Large-scale model training

🔴 DON'T BUILD
Calendar

Email

Kanban

Invoice

CRM functionality

Generic productivity tools

Enterprise permissions

Complex workflow engine

Full document-management system

Fancy analytics for its own sake

The one architectural principle I'd insist on
Don't build an "AI dashboard."

Build a government investigation workspace powered by AI.

The distinction matters.

The dashboard's job is:

Prioritize.

The project page's job is:

Explain.

The documents' job is:

Provide evidence.

The AI's job is:

Connect the evidence, data and anomalies and reduce the officer's investigation effort.

And the officer's job remains:

Make the decision.

That keeps the system aligned with SIH 26102 instead of turning it into another generic analytics/admin template. 

One thing I would do before we touch the code
The next step should be to take the actual routes/components in the GitHub repository and make a screen-by-screen conversion map:

Existing route → Keep / Modify / Merge / Delete → New MPLADS purpose → Components to reuse → Components we need to build.

That will tell us exactly how much of the existing repository we can preserve and prevent us from accidentally rebuilding the dashboard from scratch.


Your suggested pages are alright but I would like you to criticise your current design And find out loopholes explain each feature set with a minimum piece of slice How can we make sure that they connect each other What about the error states what about if something is not working do not just build the happy path think about the failure path too think about from the perspective of the officer How are we making sure that the AI is relevant It you have given me the high level design what about the low level design of this 

Yes. The previous design is directionally correct, but it still has several product-design and engineering loopholes that would become visible the moment an officer tries to use it for an actual investigation.

The most important correction is this:

The fundamental unit of the system should not be the dashboard page. It should be the “investigation of a work.”

SIH 26102 asks for analysis across sanctions, expenditure, payments, work progress, asset creation, anomalies, delays, cost overruns and duplicate works, with risk-based alerts and decision support. 

That means our system needs to turn scattered information into one chain:

Signal → Investigation → Evidence → Explanation → Officer decision

The dashboard is merely the entry point.

1. Criticism of my previous design
There were six significant weaknesses.

Problem 1: “Risk & Alerts” could become a notification graveyard
I said:

Risk & Alerts → list of suspicious projects.

That sounds good, but there is an obvious failure:

Suppose the system generates 1,800 alerts.

The officer now has a new administrative burden rather than less work.

The actual question is not:

“Which projects have anomalies?”

It is:

“Which 10 cases deserve my attention today?”

Therefore we need prioritization, not merely detection.

The queue should rank by:

Priority =
    anomaly severity
  × financial exposure
  × persistence
  × confidence
  × officer relevance
But crucially, the UI should not pretend this is a mathematical truth.

It should say:

Priority: High

Reason: large financial exposure + prolonged inactivity + unusual expenditure pattern.

That is much more intelligible than Risk Score = 87.

2. Problem 2: A “risk score” can cause automation bias
This is a major issue.

Imagine:

🔴 Risk Score: 94/100

An officer may subconsciously interpret that as:

“There is fraud here.”

But anomaly detection does not establish fraud.

Even other systems working on this problem explicitly frame the output as prioritization for verification rather than determination of fraud. 

So our UI should distinguish three concepts:

ANOMALY
Something statistically / logically unusual.

RISK
How important it may be to investigate.

FINDING
What the officer established after reviewing evidence.
These are completely different states.

Therefore:
Never show:

Fraud probability: 94%

For the MVP.

Show:

High priority for verification

And beneath it:

3 anomaly signals detected.

That preserves human judgment.

3. Problem 3: The AI page and project page are too disconnected
Previously I proposed:

Projects
AI Assistant
Documents
That is technically neat but cognitively wrong.

Imagine the officer is looking at Project MPLADS-2847.

Then they want to ask:

“Why was this flagged?”

They should not need to leave the project and open AI Assistant.

The AI belongs inside the investigation context.

So:

Project Dossier
 ├── Overview
 ├── Financials
 ├── Progress
 ├── Anomalies
 ├── Documents
 ├── Evidence
 └── AI Copilot
And the global AI page exists only for broad questions such as:

“Show me the highest-risk road projects in my district.”

This gives us two modes:

Contextual AI
Inside a project

“Explain this anomaly.”

Global AI
Across the dataset

“Which districts have the highest concentration of delayed works?”

That distinction is important.

4. Problem 4: Documents should not be a separate universe
A generic:

Documents

page sounds useful, but it creates another silo.

An officer doesn't think:

“I would like to browse documents.”

They think:

“I need the work order for this project.”

Therefore:

Project is the parent.

Documents are attached to projects.

The dedicated Documents page should exist only for:

recent uploads / ingestion problems / searching across evidence

not as the primary workflow.

5. Problem 5: We haven't defined what happens when data is incomplete
This is possibly the biggest practical loophole.

Government data will not always be complete.

Suppose:

Sanction amount = ₹42 lakh
Expenditure = ₹31 lakh
Progress = unavailable
Documents = 2
Latest update = 9 months old
What does AI do?

It must not invent a progress explanation.

Instead:

Progress cannot be assessed

The latest physical-progress record is missing.

Last available update: 18 Nov 2025.

That is a much more trustworthy system.

Therefore every important metric needs a data-quality state.

6. Problem 6: We designed the happy path, not the operational path
A real officer interaction looks more like:

Click project
 ↓
API slow
 ↓
financial data arrives
 ↓
documents unavailable
 ↓
AI still processing
 ↓
one anomaly detector failed
 ↓
officer uploads PDF
 ↓
PDF processing fails
 ↓
tries AI
 ↓
AI cannot answer because evidence is incomplete
The UI must remain usable throughout this.

This means we need explicit:

loading states

empty states

partial-data states

stale-data states

processing states

failure states

permission states

AI uncertainty states

These are part of the design, not polish.

7. I would now simplify the information architecture
After stress-testing it, I would change my earlier structure to:

┌─────────────────────────────┐
│ OVERVIEW                    │
│ “What needs attention?”     │
└─────────────────────────────┘

┌─────────────────────────────┐
│ WORKS                       │
│ “Find any project”          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ INVESTIGATION               │
│ “Understand one project”    │
└─────────────────────────────┘

┌─────────────────────────────┐
│ AI COPILOT                  │
│ “Ask across the system”     │
└─────────────────────────────┘
And Documents are inside Investigation, not a major first-class destination.

Likewise, Risk & Alerts are primarily a state of Overview, with a filtered investigation queue accessible from there.

So I would now reduce the primary navigation to:

Overview
Works
AI Copilot
Everything important happens through these three entry points.

That's even cleaner.

8. Now let's define the low-level product
We need to think in vertical slices.

A vertical slice means:

UI + API + data + business logic + failure state

all working together for one meaningful user task.

Not:

“Let's build frontend first and connect backend later.”

SLICE 1 — Officer opens the system
User goal
“Tell me what deserves my attention.”

UI
Header:

MPLADS Monitoring

District: Indore

Data refreshed: 06 Sep 2026, 09:40 AM

Then:

23
High-priority cases

71
Projects delayed

14
Cost anomalies

8
Duplicate-work signals
Then:

Priority queue
HIGH PRIORITY

Road Construction
Work ID: MP-2024-01924

₹58.2L sanctioned
₹49.7L spent
34% reported progress

Why attention is needed:
• expenditure unusually high
• progress stalled 91 days
• comparable works average 71%

[Investigate]
Failure states
Backend unavailable
Don't turn the entire page into a blank error.

Show:

Live data unavailable

Showing the last successfully synchronized snapshot from 09:40 AM.

And clearly distinguish cached information.

No anomalies
Don't show:

Nothing found.

Show:

No high-priority cases

No projects currently meet the configured attention threshold.

That's reassuring and meaningful.

Data stale
⚠ Data is 3 days old.

The officer immediately knows the system's limitations.

SLICE 2 — Officer searches for a project
The officer might know:

work ID

location

implementing agency

category

MP constituency

beneficiary area

So the Works screen should have:

Search
Search by Work ID, title, district, agency...
And filters.

But the important low-level detail is:

Search result must expose enough context without opening the project
For example:

Work	Location	Sanction	Progress	Attention
Community Hall	Indore	₹42L	81%	—
Road Construction	Dewas	₹58L	34%	High
This prevents unnecessary clicking.

SLICE 3 — Officer opens an investigation
This is the core slice of the entire product.

Route conceptually:

/works/:workId
The page is a dossier.

Header
Construction of Rural Road

Work ID: MP-2024-01924

Indore District
MPLADS 2024–25

HIGH PRIORITY
Then:

Last updated 06 Sep 2026

This matters enormously.

10. Project page hierarchy
I would structure it like this:

PROJECT
│
├── Summary
│
├── Financial
│
├── Progress
│
├── Anomalies
│
├── Evidence
│
└── Activity
But these should be sections/tabs, not six separate routes.

That reduces navigation.

11. Summary
The summary answers:

What is this project?

Show:

Work ID
Work type
District
Implementing agency
Sanction date
Sanctioned amount
Expected completion
Current status
Then:

Current condition
At risk of delay

Why?

Reported completion: 34%

Expected completion based on schedule: 71%

The officer understands immediately.

12. Financial section
The existing repository's Finance screen is useful as a component source. The template already contains a Finance dashboard and uses TanStack Table, React Hook Form, Zustand and Zod, so we can reuse its UI conventions rather than building a visual system from nothing. 

But our financial model should be simpler:

Sanctioned       ₹58.2L
Released        ₹54.0L
Spent           ₹49.7L
Balance          ₹4.3L
Then:

Timeline
Apr      May      Jun      Jul      Aug
₹4L      ₹11L     ₹19L     ₹39L     ₹49L
Then:

Anomaly
Expenditure acceleration is unusual relative to comparable works.

[See why]

This links directly to the anomaly engine.

13. Progress section
We need two timelines:

Planned
Start ───── 25% ───── 50% ───── 75% ───── Completion
Actual
Start ───── 18% ───── 27% ── 34%
Then:

Progress variance: -37 percentage points

Don't hide the comparison inside a graph.

14. Anomaly section
This is where I would improve the original design significantly.

Instead of one mysterious AI-generated score, show individual signals.

Example:

1. Expenditure anomaly
Severity: High
Confidence: High

₹49.7L spent versus peer median ₹26.1L.

Evidence

18 comparable projects

same work category

same district

similar sanctioned amount

[View comparison]

2. Delay anomaly
Severity: Medium

No reported progress change for 91 days.

Evidence

Last update:

07 Jun 2026 → 34%

Current:

06 Sep 2026 → 34%

3. Document discrepancy
Severity: Medium

Work order amount differs from recorded sanctioned amount.

[View documents]

This is explainability at the component level.

15. Evidence should be the bridge between AI and reality
This is one of the most important principles.

Every AI claim should ideally lead to evidence.

For example:

“Spending is unusually high.”

Under it:

Data evidence

Peer median: ₹26.1L
Project: ₹49.7L

Source records

Payment record #17
Payment record #21

Then:

Document evidence

Work Order.pdf

So the officer can trace:

AI statement
     ↓
Derived metric
     ↓
Source data
     ↓
Document
This is much more defensible.

16. Upload workflow
We should make upload ridiculously simple.

Officer clicks:

Upload evidence

Modal:

Document type
[ Work Order ▼ ]

Upload file
[ Drop PDF here ]

Description
[ Optional ]

[Cancel] [Upload]
Then immediately:

Uploading...
████████░░ 82%
After upload:

Processing document...
Extracting information...
Then:

✓ Document processed

Detected:
Work order amount: ₹62.4L
Date: 12 Apr 2025
Agency: XYZ Construction

[Review extracted information]
17. Now the failure design becomes important
Suppose OCR/extraction fails.

Do not show:

AI Error.

Show:

We could not extract structured information from this document.

The document is still safely stored.

You can open it manually or retry processing.

Buttons:

Open document

Retry processing

That respects the officer's actual objective.

18. AI design: this is where I would be extremely strict
The biggest technical mistake would be:

Officer question
      ↓
LLM
      ↓
Answer
Absolutely not.

The architecture should be:

Officer question
        ↓
Intent classification
        ↓
Context identification
        ↓
Tool selection
        ↓
Retrieve authoritative data
        ↓
Evidence retrieval
        ↓
Reasoning
        ↓
Answer + citations/evidence
19. Example AI request
Officer:

Why is this work high priority?

AI shouldn't just retrieve a paragraph from a database.

It should call something like:

get_work(work_id)
get_anomalies(work_id)
get_financial_summary(work_id)
get_progress_history(work_id)
get_peer_comparison(work_id)
get_documents(work_id)
Then construct its answer.

20. The AI needs a strict evidence contract
Every AI response should internally classify statements as:

FACT
DIRECTLY OBSERVED

DERIVED
CALCULATED FROM DATA

INFERENCE
REASONABLE INTERPRETATION

UNKNOWN
NOT ENOUGH EVIDENCE
The UI can express this naturally.

For example:

What we know

₹49.7L has been recorded as expenditure.

What the analysis indicates

This is materially above comparable works.

What cannot currently be determined

The available records do not establish whether the difference is justified.

This is vastly safer than pretending the AI knows everything.

21. AI hallucination failure state
Suppose the officer asks:

Why was the contractor overpaid?

But we don't actually have contractor payment records.

The answer should be:

I cannot establish overpayment from the available records.

I found an expenditure anomaly, but the current project data does not contain enough contractor-level payment information to determine whether an overpayment occurred.

Available evidence:

sanctioned amount

expenditure total

3 payment records

Missing:

itemized contractor invoice

Then:

Upload invoice

That is a useful AI.

It doesn't simply say “I don't know.”

It tells the officer what is missing.

22. AI should know the page the officer is looking at
This becomes powerful.

Officer is on:

Project 2847
Anomalies > Expenditure
They ask:

“Explain this.”

The AI automatically understands:

currentWork = 2847
currentSection = expenditure
selectedAnomaly = expenditure_anomaly
No repeated context needed.

This is called context binding, and it makes the assistant feel dramatically more intelligent.

23. AI should be able to navigate the application
The AI can have limited tools like:

searchWorks()
openWork()
compareWorks()
getFinancials()
getProgress()
getAnomalies()
searchEvidence()
summarizeDocument()
But I would not allow arbitrary browser control for the hackathon.

The agent should navigate via explicit application actions.

For example:

“Show me similar projects.”

AI calls:

compareWorks(workId)
Then the UI updates.

That is far easier to control and demonstrate.

24. The AI answer should become an interface, not just text
This is another improvement.

Officer:

Show similar projects.

Don't respond with 400 words.

Render:

Comparable works

Road Project A      ₹27L     78%
Road Project B      ₹31L     82%
Road Project C      ₹25L     74%

Current project     ₹49L     34%
Then:

[Open comparison]

The AI is therefore a control layer for the product, not a separate chatbot.

25. What happens if the AI service goes down?
This is critical.

The entire dashboard must continue working.

If AI fails:

AI Assistant unavailable

Core project monitoring and anomaly results are still available.

The officer can still:

inspect project

view financials

view documents

see anomaly rules

update investigation status

AI must be augmentation, not infrastructure on which the whole product depends.

26. What happens if the anomaly engine fails?
Same principle.

Suppose:

Financial anomaly detector: ✓
Delay detector: ✓
Duplicate detector: ⚠ unavailable
Don't hide that.

Show:

Analysis partially available

Duplicate-work analysis is currently unavailable.

Then:

Financial analysis       ✓
Progress analysis        ✓
Duplicate detection      —
Document analysis        ✓
This is far more professional.

27. Investigation status needs a state machine
Instead of simply adding a button:

Mark investigated

we need an explicit state.

UNREVIEWED
     ↓
UNDER REVIEW
     ↓
 ┌──────┬────────┬────────────┐
 ▼      ▼        ▼            ▼
VALID   DISMISSED NEEDS INFO  REFERRED
Maybe simplify for MVP:

New
Under Review
Verified
Dismissed
Action Required
Every transition gets:

Officer
Timestamp
Optional note
Now we have an audit trail.

28. Officer's activity timeline
This is something I didn't emphasize enough before.

Every investigation should have:

06 Sep 10:43
Aaditya opened project

06 Sep 10:46
AI comparison requested

06 Sep 10:49
Work Order.pdf uploaded

06 Sep 10:51
AI extracted ₹62.4L work order amount

06 Sep 10:55
Status changed:
New → Under Review
This is extremely useful for accountability.

And it is relatively cheap to implement.

29. Data freshness needs to be everywhere it matters
Every major dataset should expose:

Source
Last updated
Coverage
Example:

Financial records
Updated: 06 Sep 2026 08:30 AM

Physical progress
Updated: 01 Sep 2026

This prevents the officer from assuming all data is equally current.

30. Another major loophole: anomaly thresholds
Suppose the detector says:

Project is unusual.

Unusual compared with what?

This is actually one of the hardest parts of SIH 26102. The problem statement does not prescribe exactly how anomalies should be defined, and meaningful comparison groups are a major analytical challenge. 

Therefore the UI must show the comparison basis.

Bad:

Cost anomaly detected.

Good:

Cost is 2.1× the median of 18 comparable road projects in the same district and similar sanction range.

Then the officer can challenge the methodology.

That makes the AI more trustworthy.

31. We need an “insufficient comparison” state
This is easily overlooked.

Suppose a rural project has only 2 comparable historical works.

The model should not confidently say:

Extremely unusual.

Instead:

Limited comparison available

Only 2 sufficiently similar historical works were found. Cost anomaly confidence is low.

That is exactly the sort of edge case judges may ask about.

32. Duplicate detection needs special treatment
For duplicate work detection, a simple text match is not enough.

Potential signals:

same/similar title
+
nearby coordinates
+
same asset category
+
similar sanctioned amount
+
similar implementing agency
Then the officer sees:

Possible duplicate
86% similarity with Work ID MP-2023-01182

Map:

Existing work
     ●
      1.2 km
        ●
Current work
Then:

Compare records

Again, possible duplicate, not “duplicate confirmed.”

33. The map should not be a decorative homepage component
I previously recommended an India map.

I still support it, but with a stricter purpose.

Its job is:

Find geographic concentration of risk.

Not:

“India map because this is a government dashboard.”

Click:

Madhya Pradesh

→ district risk distribution

→ project list

→ investigation

The map and list should stay synchronized.

34. A very important UI interaction: preserve filters
Suppose the officer does:

Overview
→ Madhya Pradesh
→ Indore
→ High Risk
→ Road Works
→ Project 2847
Then presses Back.

They should return to:

Indore
High Risk
Road Works
not a reset project list.

This sounds tiny, but it dramatically affects usability.

35. Another failure path: unauthorized action
Eventually there will be different officers.

Even for the prototype, actions should distinguish:

View
Upload
Investigate
Change status
Admin
If someone cannot modify a record:

You have view-only access to this investigation.

Not a generic HTTP error.

The repository already contains authentication and role-management screens, although its README describes more advanced RBAC/multi-tenant functionality as planned rather than completed. 

For the hackathon, we can simply simulate:

District Officer
with the permissions needed for the demo.

36. Low-level component architecture
Now we get to the software structure.

The repo is already organized around TanStack Start, React, TypeScript, Shadcn UI and colocated route-specific components, with server functions available for server-side behavior. 

I would preserve that architectural philosophy.

Conceptually:

src/
│
├── routes/
│   └── (main)/
│       ├── dashboard/
│       │   ├── index.tsx
│       │   └── works/
│       │       ├── index.tsx
│       │       └── $workId.tsx
│       │
│       └── ai/
│           └── index.tsx
│
├── features/
│   ├── works/
│   ├── anomalies/
│   ├── evidence/
│   ├── investigation/
│   └── ai/
│
├── server/
│   ├── works.ts
│   ├── anomalies.ts
│   ├── evidence.ts
│   └── ai.ts
│
└── lib/
    ├── types/
    ├── validation/
    └── utils/
Although the repository itself recommends colocating feature-specific code beneath routes, so I wouldn't prematurely extract every component into a giant shared abstraction layer. 

37. Data model
The backend should revolve around a few entities.

Work
 ├── metadata
 ├── financials
 ├── progress
 ├── anomalies
 ├── documents
 ├── investigations
 └── activity
Work
id
title
category
district
state
constituency
agency
sanctionedAmount
sanctionDate
expectedCompletion
status
latitude
longitude
updatedAt
FinancialRecord
workId
date
type
amount
reference
source
ProgressRecord
workId
date
percentage
description
source
Anomaly
id
workId
type
severity
confidence
status
detectedAt
explanation
comparisonSet
evidenceRefs[]
Document
id
workId
name
type
uploadedAt
processingStatus
extractedFields
sourceHash
Investigation
id
workId
status
assignedTo
notes
createdAt
updatedAt
Activity
id
workId
actor
action
timestamp
metadata
That is enough for the MVP.

38. AI tool contract
The AI backend should not have arbitrary database access.

Give it controlled functions:

searchWorks
getWorkSummary
getFinancialRecords
getProgressHistory
getAnomalies
compareWithPeers
listDocuments
readDocument
searchEvidence
updateInvestigationStatus
addInvestigationNote
And perhaps:

getCurrentContext()
which tells the AI:

{
  "workId": "MP-2024-01924",
  "section": "anomalies",
  "selectedAnomaly": "EXPENDITURE_OUTLIER"
}
This is enough to make the AI contextual without making it uncontrollable.

39. The most important AI rule
The AI should have a hierarchy of authority:

1. Structured government data
2. Uploaded official documents
3. Derived analytics
4. Historical comparison
5. LLM reasoning
Meaning the LLM is at the bottom of the evidence hierarchy, not the top.

The LLM explains the evidence.

It should not manufacture the evidence.

40. We need answer-level provenance
Every important AI response should be able to say:

Sources used

Financial records
Updated 06 Sep 2026

Progress records
Updated 01 Sep 2026

Work Order.pdf
Uploaded 06 Sep 2026
For the hackathon, this can simply appear beneath the AI answer:

Sources: 3 project records · 1 document

Click:

View sources

This would be a very strong demonstration to judges.

41. What happens when the officer edits something?
Another overlooked issue.

Suppose they upload a document saying:

Work order = ₹62.4L

But database says:

Sanction = ₹58.2L

The system should not automatically overwrite government records.

Instead:

Discrepancy detected

and create a finding:

Source A
Sanction record: ₹58.2L

Source B
Work order: ₹62.4L
Then the officer decides what it means.

This separation between source data and officer interpretation is crucial.

42. Our MVP should therefore have three layers
Layer 1 — Truth
Raw records and documents.

Layer 2 — Intelligence
Anomalies, comparisons, risk prioritization.

Layer 3 — Decision support
AI explanation + officer investigation.

Visualized:

RAW DATA
   ↓
ANALYTICS / ML
   ↓
ANOMALIES
   ↓
PRIORITY
   ↓
INVESTIGATION
   ↓
AI + EVIDENCE
   ↓
OFFICER DECISION
That is the system architecture I would defend to judges.

43. The full failure architecture
We should intentionally design for:

                    ┌── API unavailable
                    ├── stale data
                    ├── incomplete data
                    ├── detector unavailable
                    ├── document processing failed
Officer ────────────┼── AI unavailable
                    ├── AI insufficient evidence
                    ├── upload failed
                    ├── permission denied
                    ├── conflicting records
                    └── no anomalies found
And none of these should prevent the user from understanding what happened.

Every failure should answer:

What happened?

What information is still available?

What can I do next?

That's the standard I would use.

44. The vertical slices I would actually implement
Rather than building page by page, I would implement in this order:

Slice A — Detect → Investigate
Overview
 ↓
High-priority case
 ↓
Project dossier
 ↓
Anomaly explanation
This proves the core value.

Slice B — Investigate → Evidence
Project
 ↓
Documents
 ↓
Upload
 ↓
Extraction
 ↓
Discrepancy
This proves the evidence workflow.

Slice C — Ask → Explain
Project
 ↓
AI
 ↓
tool calls
 ↓
data retrieval
 ↓
evidence-backed answer
This proves the AI.

Slice D — Decide
Investigation
 ↓
Officer note
 ↓
Status change
 ↓
Activity history
This proves the system actually helps an officer complete work.

Slice E — Browse
Works
 ↓
search/filter
 ↓
project
This is supporting functionality, not the headline feature.

45. What I would remove from the original MVP
After this deeper critique, I would actually remove even more.

Remove dedicated Documents navigation
Documents belong to projects.

Remove dedicated Risk page from primary navigation
Risk is a lens over the Works dataset.

Remove standalone AI as the only AI experience
AI should be globally accessible and contextually embedded.

Remove generic analytics pages
Analytics should exist only when they answer an administrative question.

The existing template has many screens—including CRM, Finance, Analytics, Logistics, Infrastructure, File Manager, Email, Calendar, Kanban, Invoice, Users, Roles and others—but these are generic admin screens, not a ready-made MPLADS information architecture. 

That distinction is the key reason we should reuse its components, not its product structure.

46. The final MVP I would now defend
                    OFFICER
                       │
                       ▼
                 ┌───────────┐
                 │  OVERVIEW │
                 │ What needs│
                 │ attention?│
                 └─────┬─────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
        PRIORITY CASES       SEARCH WORKS
              │                 │
              └────────┬────────┘
                       ▼
                ┌──────────────┐
                │ WORK DOSSIER │
                └──────┬───────┘
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   Financials       Progress         Anomalies
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                  ┌─────────┐
                  │ EVIDENCE│
                  │ Documents│
                  └────┬────┘
                       │
                       ▼
                ┌────────────┐
                │ AI COPILOT │
                │ Why?       │
                │ Compare?   │
                │ What's missing?│
                └─────┬──────┘
                      ▼
               OFFICER DECISION
                      │
           ┌──────────┼──────────┐
           ▼          ▼          ▼
        Verified   Dismissed  Action Required
                      │
                      ▼
                 ACTIVITY LOG
That's much more coherent than the initial version.

The real product thesis
I would now define the prototype in one sentence:

The system reduces the officer's investigation time by turning thousands of project records into a prioritized, explainable case file where every AI insight can be traced back to data or evidence.

That is much stronger than:

“We built an AI dashboard for MPLADS.”

And it gives us a ruthless filter for every feature:

Does this reduce the officer's time to identify, understand, verify, or act on a project?

If not, it probably does not belong in the hackathon MVP.

The repository is actually well suited to this approach because its current architecture already gives us reusable dashboard, table, finance, infrastructure, file-manager and chat building blocks, while its route structure is designed for feature-level colocation. 

The next engineering-level artifact I would produce from this is a screen-by-screen specification: every screen, component, API call, database field, AI tool, loading state, empty state, error state, permission state, and navigation transition. That becomes the actual blueprint from which the team can implement without drifting into unnecessary features.




Yes. I went through the MVP document again, including the low-level architecture, failure states, data model, AI tool contract, and vertical slices. I would not treat every feature as a separate page.

The key idea from the document is that the product is an investigation workspace for a government officer, not a generic admin dashboard. The fundamental flow is:

Signal → Investigation → Evidence → Explanation → Officer decision. 

1. How many pages should we actually build?
For the SIH MVP, I recommend:

Actual routes/pages: 5
#	Route	Purpose	Priority
1	/login	Officer authentication	🟢
2	/overview	Command center + risk overview + map	🟢
3	/works	Search/filter all MPLADS works	🟢
4	/works/:workId	Complete investigation/case file	⭐ Core
5	/ai	Global AI Copilot	🟢
And do NOT make these separate pages:

Financials ❌ → section inside /works/:workId

Progress ❌ → section inside project

Anomalies ❌ → section inside project

Documents ❌ → section inside project

Activity ❌ → section inside project

Risk & Alerts ❌ → filtered view/state of Overview + Works

Map ❌ → component of Overview

Settings ❌ → optional/basic

The document explicitly moves toward three main entry points: Overview, Works, and AI Copilot, with Investigation reached from a work rather than being a sidebar destination. 

So I'd structure the visible sidebar as:

MPLADS MONITORING

⌂ Overview
▣ Works
🤖 AI Copilot

────────────────
Officer Profile
Logout
2. What each page actually contains
PAGE 1 — Login
Very simple.

┌──────────────────────────────┐
│       MPLADS MONITORING      │
│                              │
│  Government Officer Login    │
│                              │
│  Officer ID                  │
│  [____________________]      │
│                              │
│  Password                    │
│  [____________________]      │
│                              │
│       [ Sign In ]            │
│                              │
└──────────────────────────────┘
Backend
POST /auth/login
        ↓
verify credentials
        ↓
create session
        ↓
return officer
        ↓
/overview
For the hackathon, do not build enterprise IAM/RBAC. Basic authentication is enough according to the MVP scope. 

3. PAGE 2 — Overview
This is the officer's morning command center.

The officer should immediately understand:

"What needs my attention?"

Components
Overview
│
├── Header
│   ├── Officer
│   ├── District
│   └── Last data refresh
│
├── KPI Cards
│   ├── Total Works
│   ├── Under Execution
│   ├── Delayed
│   ├── High Priority
│   └── Cost Anomalies
│
├── India / State Map
│
├── Requires Attention
│   ├── Project A
│   ├── Project B
│   └── Project C
│
└── Analysis Status
    ├── Financial ✓
    ├── Progress ✓
    ├── Duplicate ⚠
    └── Documents ✓
The document specifically says the important part should be "Requires Your Attention", rather than filling the dashboard with charts. 

Map
The map isn't decoration.

India
 ↓
Madhya Pradesh
 ↓
Indore
 ↓
High-risk works
 ↓
Project
It should synchronize with the list. 

Frontend → Backend
Overview
   │
   ├── GET /dashboard/summary
   │
   ├── GET /works?priority=high
   │
   ├── GET /dashboard/geography
   │
   └── GET /analysis/status
Backend aggregates:

Database
   │
   ├── Works
   ├── Financial records
   ├── Progress records
   └── Anomalies
          ↓
    Dashboard service
          ↓
       JSON
          ↓
       React UI
4. PAGE 3 — Works
This replaces the generic CRM page from the template.

The officer's question here is:

"I know a project. Find it."

UI
Works

[ Search Work ID / title / district / agency ]

Filters:
[State] [District] [Category] [Agency]
[Risk] [Status] [Sanction Year]

--------------------------------------------------
Work             Location     Sanction  Progress Risk
--------------------------------------------------
Community Hall   Indore       ₹42L      81%      —
Road Project     Dewas        ₹58L      34%      HIGH
Water Facility   Bhopal      ₹28L      67%      MED
--------------------------------------------------
Search/filtering should happen through the backend rather than downloading every project and filtering everything in React.

The document specifically calls for prominent search and filters and says search results should expose enough context that the officer doesn't have to open every project. 

API
GET /works
GET /works?district=Indore
GET /works?risk=high
GET /works?category=road
GET /works?search=MP-2024-01924
Backend:

Request
 ↓
Validation
 ↓
Database query
 ↓
Filter / sort / pagination
 ↓
Response
5. PAGE 4 — Investigation
⭐ This is the MOST important page.
Route:

/works/:workId
The document specifically says this should be treated as a case file/dossier, not a project-management page. 

This one page contains:

PROJECT DOSSIER

├── Summary
├── Financial
├── Progress
├── Anomalies
├── Evidence
└── Activity
These are tabs/sections, not six routes. 

5.1 Project header
Construction of Rural Road

Work ID: MP-2024-01924
District: Indore
MPLADS: 2024–25

HIGH PRIORITY

Investigation:
[ Under Review ▼ ]

Last updated: 06 Sep 2026
5.2 Summary
Project Summary

Work ID
Work Type
District
State
Constituency
Agency
Sanction Date
Sanctioned Amount
Expected Completion
Current Status

Reported Progress: 34%
Expected Progress: 71%

⚠ Potential delay
6. Financial section
Inside the same page:

FINANCIAL

Sanctioned     ₹58.2L
Released       ₹54.0L
Spent          ₹49.7L
Remaining       ₹4.3L
Then:

Expenditure Timeline

Apr ── May ── Jun ── Jul ── Aug
₹4L    ₹11L   ₹19L   ₹39L   ₹49L
And importantly:

⚠ Expenditure anomaly

₹49.7L spent
Peer median: ₹26.1L

[See why]
The financial data model in the document includes separate financial records linked to the work. 

7. Progress section
PROGRESS

Planned
Start ───── 25% ───── 50% ───── 75% ───── Complete

Actual
Start ─── 18% ─── 27% ─── 34%

Expected: 71%
Actual:   34%

⚠ 37 percentage-point variance

Last progress update:
07 Jun 2026
This allows the officer to understand the delay without asking AI.

8. Anomalies section
This is where your actual anomaly engine connects to the UI.

Do NOT have one mysterious Risk Score = 87.

Instead:

ANOMALIES

┌─────────────────────────────────────┐
│ 🔴 EXPENDITURE ANOMALY              │
│                                     │
│ Severity: HIGH                      │
│                                     │
│ ₹49.7L vs peer median ₹26.1L        │
│                                     │
│ Comparison set:                    │
│ 18 similar road projects            │
│ Same district                       │
│ Similar sanction range              │
│                                     │
│ [View comparison] [View evidence]  │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│ 🟠 DELAY ANOMALY                    │
│                                     │
│ No progress change for 91 days      │
│                                     │
│ Expected: 71%                       │
│ Actual: 34%                         │
│                                     │
│ [View progress]                     │
└─────────────────────────────────────┘
The document emphasizes that anomaly, risk, and an officer-established finding are different concepts; the system should prioritize verification rather than declare fraud. 

9. Evidence / Documents
This should be inside the project.

EVIDENCE

Documents

📄 Sanction Order
📄 Administrative Approval
📄 Technical Approval
📄 Work Order
📄 Payment Records
📄 Progress Reports
📷 Site Photographs
📄 Completion Certificate

[ + Upload Evidence ]
The project is the parent; documents belong to the project. 

Upload flow
Click Upload
      ↓
Select document type
      ↓
Upload PDF
      ↓
Storage
      ↓
Processing
      ↓
OCR / extraction
      ↓
Structured information
      ↓
Compare with project data
      ↓
Potential discrepancy
Example:

Work Order.pdf

Extracted:
Work order amount: ₹62.4L
Date: 12 Apr 2025
Agency: XYZ Construction

[Review extracted information]
Then:

Sanctioned amount: ₹58.2L
Work order:        ₹62.4L

⚠ Difference: ₹4.2L

[Investigate discrepancy]
Crucially, the document says uploaded data should not automatically overwrite government source records. It should create evidence/finding for the officer to interpret. 

10. Activity / Audit trail
Also inside Investigation.

ACTIVITY

06 Sep 10:43
Officer opened project

06 Sep 10:46
AI comparison requested

06 Sep 10:49
Work Order.pdf uploaded

06 Sep 10:51
AI extracted work-order amount

06 Sep 10:55
Status changed:
New → Under Review
This is cheap to build but gives the system a much more credible government workflow. 

11. Investigation state machine
This is another small but important backend feature.

UNREVIEWED
     │
     ▼
UNDER REVIEW
     │
     ├── VERIFIED
     ├── DISMISSED
     ├── NEEDS INFO
     └── REFERRED
Each transition:

actor
timestamp
oldStatus
newStatus
optionalNote
So:

Under Review

Officer: XYZ
Time: 06 Sep 2026 10:55
Note: Requested clarification from agency
The document recommends exactly this kind of lightweight state machine rather than a giant workflow engine. 

12. PAGE 5 — AI Copilot
This is where I would make one important distinction.

Global AI
/ai
Used for:

"Show me the highest-risk road projects in Indore."

"Which districts have the highest delayed-work concentration?"

"Find projects with unusually high expenditure."

Contextual AI
Inside:

/works/:workId
Used for:

"Why is this project high priority?"

"Compare this with similar works."

"Does the work order match the sanctioned amount?"

The document explicitly recommends these two AI modes: contextual AI inside a project and global AI across the dataset. 

13. How the AI backend should actually work
This is extremely important.

Do not do:

Officer question
      ↓
LLM
      ↓
Answer
Instead:

Officer
   │
   ▼
AI API
   │
   ▼
Intent detection
   │
   ▼
Context detection
   │
   ▼
Select allowed tool
   │
   ▼
Retrieve authoritative data
   │
   ▼
Retrieve evidence
   │
   ▼
Reason
   │
   ▼
Answer + sources
This is the architecture specified in the document. 

14. AI tools
Give the LLM controlled functions.

searchWorks()

getWorkSummary()

getFinancialRecords()

getProgressHistory()

getAnomalies()

compareWithPeers()

listDocuments()

readDocument()

searchEvidence()

updateInvestigationStatus()

addInvestigationNote()

getCurrentContext()
The AI should never have arbitrary database access. 

Example:

Officer asks
Why is this work high priority?

AI internally calls:

getWorkSummary(workId)
getAnomalies(workId)
getFinancialRecords(workId)
getProgressHistory(workId)
compareWithPeers(workId)
getDocuments(workId)
Then responds:

Why this work requires review

1. Expenditure
₹49.7L vs peer median ₹26.1L

2. Progress
34% actual vs 71% expected

3. Delay
No progress update for 91 days

Evidence
• 18 comparable projects
• Payment records
• Progress records

[View comparison]
[View evidence]
That's much stronger than a normal chatbot.

15. Backend architecture
I'd keep the backend relatively simple for the hackathon:

                    FRONTEND
                       │
                       ▼
                 API / Server
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Works       Anomalies      Evidence
       Service       Service       Service
          │            │            │
          └────────────┼────────────┘
                       ▼
                    DATABASE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Works       Financials    Progress
          │
          ├── Anomalies
          ├── Documents
          ├── Investigations
          └── Activity
                       │
                       ▼
                  AI Service
                       │
                 Tool Layer
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       DB tools    Evidence tools  Compare tools
The source recommends essentially this feature-oriented structure:

src/
├── routes/
│   └── (main)/
│       ├── dashboard/
│       ├── works/
│       │   ├── index.tsx
│       │   └── $workId.tsx
│       └── ai/
│
├── features/
│   ├── works/
│   ├── anomalies/
│   ├── evidence/
│   ├── investigation/
│   └── ai/
│
├── server/
│   ├── works.ts
│   ├── anomalies.ts
│   ├── evidence.ts
│   └── ai.ts
│
└── lib/
    ├── types/
    ├── validation/
    └── utils/

16. Database
Don't make 30 tables.

For MVP, think:

OFFICER
   │
   │
WORK
 ├── FinancialRecord[]
 ├── ProgressRecord[]
 ├── Anomaly[]
 ├── Document[]
 ├── Investigation
 └── Activity[]
Work
Work
----------------
id
title
category
district
state
constituency
agency
sanctionedAmount
sanctionDate
expectedCompletion
status
latitude
longitude
updatedAt
FinancialRecord
FinancialRecord
----------------
id
workId
date
type
amount
reference
source
ProgressRecord
ProgressRecord
----------------
id
workId
date
percentage
description
source
Anomaly
Anomaly
----------------
id
workId
type
severity
confidence
status
detectedAt
explanation
comparisonSet
evidenceRefs[]
Document
Document
----------------
id
workId
name
type
uploadedAt
processingStatus
storageUrl
extractedData
These entities and fields are laid out in the MVP document's data model. 

Investigation
Investigation
----------------
id
workId
status
assignedTo
notes
createdAt
updatedAt
Activity
Activity
----------------
id
workId
actor
action
timestamp
metadata
17. The anomaly engine
This is separate from the LLM.

Raw project data
      ↓
Analytics
      ↓
Anomaly detectors
      ↓
Anomaly records
      ↓
Priority calculation
      ↓
Overview / Works / Investigation
For MVP, I'd implement four detectors:

1. Cost anomaly
Project cost
vs
similar projects
2. Expenditure anomaly
Spending pattern
vs
peer projects
3. Delay anomaly
Expected progress
vs
actual progress
4. Duplicate / near-duplicate
title similarity
+
location proximity
+
category
+
amount
+
agency
The document recommends these anomaly types for the prototype. 

18. The most important architecture: three layers
I would actually build the whole backend around this:

                 ┌─────────────────┐
                 │   TRUTH LAYER   │
                 │                 │
                 │ Government data │
                 │ Documents       │
                 │ Raw records     │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │ INTELLIGENCE    │
                 │                 │
                 │ Analytics       │
                 │ Anomalies       │
                 │ Comparisons     │
                 │ Derived metrics │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │ DECISION SUPPORT│
                 │                 │
                 │ AI explanation  │
                 │ Evidence        │
                 │ Investigation   │
                 │ Officer action  │
                 └─────────────────┘
The document explicitly proposes this separation of Truth → Intelligence → Decision Support. 

This is important because an AI-generated statement should never silently become government data.

19. Complete user flow
Now connect everything.

Flow A — Finding a suspicious project
LOGIN
  ↓
OVERVIEW
  ↓
"23 High Priority Cases"
  ↓
RISK LIST
  ↓
Click project
  ↓
INVESTIGATION
  ↓
See anomaly
  ↓
See evidence
  ↓
Ask AI
  ↓
AI retrieves data
  ↓
AI explains
  ↓
Officer changes status
  ↓
Adds note
  ↓
Activity recorded
Flow B — Document discrepancy
INVESTIGATION
      ↓
Upload Work Order
      ↓
Document Storage
      ↓
Processing
      ↓
OCR / extraction
      ↓
₹62.4L work order
      ↓
Compare
      ↓
₹58.2L sanctioned
      ↓
DISCREPANCY
      ↓
New anomaly/evidence
      ↓
AI explains
      ↓
Officer decides
Flow C — Global AI
AI COPILOT
    ↓
"Show highest-risk road works in Indore"
    ↓
AI
    ↓
searchWorks()
    ↓
filter district
    ↓
filter category
    ↓
sort priority
    ↓
results
    ↓
[Open Investigation]
20. Failure states are part of the MVP
This is where I strongly agree with the document: don't only build the pretty demo.

Every major component needs:

Loading
Loading project...
Empty
No anomalies detected.

No projects currently meet the attention threshold.
Stale
⚠ Data may be stale

Last synchronized:
06 Sep 2026, 09:40 AM
Partial
Analysis partially available

Financial ✓
Progress ✓
Duplicate detection ⚠ unavailable
API failure
Unable to load latest data.

Showing last successfully synchronized data.

[Retry]
AI failure
AI Assistant unavailable.

You can still:
✓ View project
✓ View financials
✓ View evidence
✓ Update investigation
The document explicitly lists loading, empty, partial-data, stale-data, processing, failure, permission and AI-uncertainty states as part of the design—not polish. 

21. AI failure
If AI dies:

THE WEBSITE MUST NOT DIE.

                    APPLICATION
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
         Core System                AI
             │                       │
       Works/Finance             Optional
       Progress/Documents         enhancement
       Anomalies
             │
             ▼
        STILL WORKS
The document explicitly says AI should be augmentation rather than infrastructure on which the whole product depends. 

22. Data-quality problem
This is another big one.

Suppose:

Sanctioned: ₹42L
Spent: ₹31L
Progress: unavailable
Documents: 2
Last update: 9 months ago
Don't let AI make up why progress is missing.

Show:

⚠ Progress cannot be assessed

Latest physical-progress record is missing.

Last available update:
18 Nov 2025
Then AI should say:

"I cannot determine the current execution status from the available records."

rather than hallucinating an explanation. 

23. What NOT to build
This is where you'll save a huge amount of time.

❌ Don't build
Calendar
Email
Kanban
Invoice
CRM
Productivity
Chat between officers
Complex RBAC
Enterprise IAM
Full document management
Real-time collaboration
15 analytics dashboards
The source explicitly places these outside the MVP. 

🟡 Simulate
Notifications
Multiple departments
Large-scale ingestion
Real-time updates
Complex roles
🟢 Actually build
Authentication
Overview
Works
Investigation
Anomaly engine
Financial analysis
Progress analysis
Evidence
Document processing
AI
Investigation status
Notes
Activity
24. How I would divide the development
Don't develop page-by-page.

Build vertical slices.

Slice 1 — Detect → Investigate ⭐
Database
 ↓
Anomaly engine
 ↓
Overview
 ↓
High-priority list
 ↓
Project
 ↓
Anomaly explanation
This proves the core product.

Slice 2 — Investigate → Evidence
Project
 ↓
Documents
 ↓
Upload
 ↓
Processing
 ↓
Extraction
 ↓
Comparison
 ↓
New evidence/anomaly
Slice 3 — Ask → Explain
Project
 ↓
AI
 ↓
Tool call
 ↓
Database
 ↓
Evidence
 ↓
AI answer
 ↓
UI component
These are the three implementation slices recommended in the document. 

25. So the final MVP looks like this
                    ┌─────────────┐
                    │    LOGIN    │
                    └──────┬──────┘
                           │
                           ▼
              ┌────────────────────────┐
              │       OVERVIEW          │
              │                        │
              │ KPIs                   │
              │ Map                    │
              │ High-priority queue    │
              └───────────┬────────────┘
                          │
             ┌────────────┴─────────────┐
             ▼                          ▼
       ┌───────────┐             ┌──────────────┐
       │   WORKS   │             │ AI COPILOT   │
       │           │             │              │
       │ Search    │             │ Global AI    │
       │ Filter    │             │ Search       │
       │ Sort      │             │ Questions    │
       └─────┬─────┘             └──────────────┘
             │
             ▼
   ┌─────────────────────────────────┐
   │       PROJECT INVESTIGATION     │
   │                                 │
   │ Summary                         │
   │ Financial                       │
   │ Progress                        │
   │ Anomalies                       │
   │ Evidence                        │
   │ Activity                        │
   │                                 │
   │ Contextual AI                   │
   │                                 │
   │ Investigation Status            │
   │ Officer Notes                   │
   └─────────────────────────────────┘
And behind it:
                 FRONTEND
                    │
                    ▼
              SERVER / API
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     WORKS      ANOMALIES     EVIDENCE
       │            │            │
       └────────────┼────────────┘
                    ▼
                 DATABASE
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   ANALYTICS / ML              AI
        │                       │
        ▼                       ▼
   Anomaly records         Tool layer
        │                       │
        └───────────┬───────────┘
                    ▼
              INVESTIGATION
                    │
                    ▼
             OFFICER DECISION
My final recommendation
Build 5 actual routes, but only 3 are the core product routes:

/overview → /works → /works/:workId

with /ai as the global AI interface and /login as infrastructure.

Everything else should be a component/section/modal, not another page.

That gives you a much tighter MVP and, more importantly, every feature has a reason to exist in the officer's workflow. The document's central principle is exactly this: don't build an AI dashboard; build a government investigation workspace powered by AI. 


Sources

