# valenArtifacts README
## Introduction
This is a fun and interactive web based User Posting Platform for lighthearted debates and arguments built for cs410 Long Project 1. Moderators create rotating, open ended questions with custom sides and users select a stance, write a supporting reason and view others’ responses.

## My Contribution
### Focus Area
My work focus on building the main user facing UI/UX for the answer selection and reason posting workflow, along with implementing the 7 day question expiration feature across the platform. Below are my primary deliverables and feature implementations, including all created and modified files as well as key UI components:

### Implemented Features
#### 7 Day Question Expiry Limit
Implemented a site wide 7 day time limit for all published debate questions, with edits to all CSS/JS/HTML files.
- Auto calculates expiry timestamps for moderators when publishing questions
- Displays expiry dates on moderator and user pages
- Locks all submission functionality for expired questions
- Adds visual expiry cues via custom css styling
- Prevents new user submissions for expired questions while preserving old responses

#### Answer Selection and Reason Posting UI Flow
Built the full end to end UI for users to engage with debate questions, with seamless session persistence and input guardrails.
- Simple answer stance selection UI: clickable buttons for custom moderator created sides
- Plain text input field: styled input for users to write supporting reasons for their stance
- Session storage for saved user reasons: auto saves unsubmitted reasons across page refreshes
- Last edit history log for reason posts: tracks and preserves edit history for user reason submissions 
- 500 char limit and real time character count indicator: character limit for concise arguments, with a live counter that updates as users type

### UI/UX
- Consistent styling across all pages
- Responsive button/input layout for easy navigation
- Clear visual feedback 
- Seamless integration between moderator publishing tools and user facing features
- Persistent user state across all user pages via browser storage
