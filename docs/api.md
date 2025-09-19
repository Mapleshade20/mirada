# Project Contigo: Backend 'hilo' documentation

**Contigo** is a one-time social pairing event that matches university students (1 female - 1 male) based on their interests, traits, and preferences.

The backend system uses email verification with university domains, collects detailed user questionnaires, and employs a sophisticated matching algorithm to pair compatible users.

## Backend Technical Architecture

- **Framework**: Axum web framework with Tokio async runtime
- **Database**: PostgreSQL with SQLx for compile-time checked queries
- **Authentication**: JWT tokens with refresh token support and email verification
- **File Storage**: Local filesystem for user-uploaded images (ID cards and profile photos)
- **Matching System**: Background service with configurable scoring algorithm
- **Email Service**: Trait-based email abstraction supporting multiple providers
- **Tag System**: Hierarchical tag structure with good lookup performance

## User Workflow

### Part I. Authentication & ID Verification

1. **Email Verification**: Users request a verification code sent to their university email
   - Only emails from approved university domains are accepted
   - Rate limiting prevents abuse (configurable interval between requests)
   - 6-digit verification codes expire after a set duration

2. **Account Creation**: Upon successful email verification:
   - User account is created with `unverified` status
   - JWT access and refresh tokens are issued for authentication
   - Users can upload their student ID card for verification, meanwhile the status is `verification_pending`

3. **ID Card Upload**: Users upload a photo of their student ID card
   - Images are validated and stored securely
   - Admin's review changes user status to `verified`/`unverified`

### Part II. Form Submission

1. **Profile Form**: Verified users complete a questionnaire including:
   - Personal information (WeChat ID, gender, self-introduction)
   - Interest tags (familiar and aspirational categories)
   - Personality traits (self-assessment and ideal partner preferences)
   - Physical boundaries and recent conversation topics
   - **Optional** profile photo upload

2. **Tag Selection**: Users choose from a hierarchical tag system:
   - Maximum tag limit enforced (configurable)
   - Tags are categorized and have IDF-based scoring for matching

3. **Status Update**: Form completion changes user status to `form_completed`

### Part III. Match Previews & Veto System

Veto means rejection.

1. **Preview Generation**: Background service periodically generates match suggestions:
   - Algorithm considers tag compatibility, trait matching, and physical boundaries
   - Matching tags receive higher scores, and complementary tags receive lower scores

2. **User Review**: Users can view a couple of top-score potential matches
   - Displayed info: `familiar_tags`, `aspirational_tags`, `recent_topics`, `email_domain`, `grade`
   - Users can veto unwanted matches based on their info before final pairing
   - Vetoed users are excluded from final matching algorithm

### Part IV. Final Matching & Results

1. **Admin Trigger**: Administrators initiate the final matching process:
   - Only users with `form_completed` status are included, after this matched users' status is updated to `matched`
   - Vetoes are considered to exclude incompatible pairs
   - Algorithm: **Greedy**

2. **Match Results**: Users receive their final match information and decide if their accept it:
   - Displayed info: `familiar_tags`, `aspirational_tags`, `self_intro`, `email_domain`, `grade`, profile photo (if any)
   - Once both users accepted the match, `wechat_id` is displayed, and status becomes `confirmed`
   - A rejection from either side will revert both users' status to `form_completed`. Admin can trigger new final matching after a period of time, and only unmatched users will be included in this round.

## API Documentation

<details>
<summary>Public APIs</summary>

### Public APIs

#### Authentication Endpoints

- `POST /api/auth/send-code` - Send verification code to email
  - JSON request body: `email`
  - Rate limited per email address
  - Only accepts university domain emails
  - Returns `202 Accepted`

- `POST /api/auth/verify-code` - Verify email code and get JWT tokens
  - JSON request body: `email`, `code`
  - Creates user account and issues token pair
  - Returns `200 OK` with tokens and expiration time
  - Response:

  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNTM2ZjViMC0wZjZjLTQwMWItOWY5Mi1iZTk1ZWZlNTcxZWQiLCJleHAiOjE3NTcyMjQ2NjcsImlhdCI6MTc1NzIyMTA2N30.cSQ4dJp21ie-JdN1S01RtcMmmbtaAO0BorVuBjOzVro",
    "refresh_token": "d1a9ef00-7030-4eaa-a1f5-ca3b582d2f74",
    "token_type": "Bearer",
    "expires_in": 900
  }
  ```

- `POST /api/auth/refresh` - Refresh JWT token pair
  - JSON request body: `refresh_token`
  - Uses valid refresh token to get new tokens
  - Returns: `200 OK` with new tokens and expiration time, refer to `POST /api/auth/verify-code`

#### Health Check

- `GET /health_check` - Server health status
  - Always returns `200 OK`

</details>

<details>
<summary>Protected APIs</summary>

### Protected APIs

_All protected endpoints require valid JWT Bearer token in Authorization header_

#### Profile Management

- `GET /api/profile` - Get current user profile with their final match partner information if any
  - If the user doesn't have a final match partner, the final result field will be null; wechat_id becomes not null once both sides have accepted the result

  ```json
  {
    "email": "second@mails.tsinghua.edu.cn",
    "status": "matched",
    "grade": "graduate",
    "final_match": {
      "email_domain": "mails.tsinghua.edu.cn",
      "grade": "undergraduate",
      "familiar_tags": ["pc_fps", "spanish"],
      "aspirational_tags": ["volleyball", "creative_games"],
      "self_intro": "Hello world",
      "photo_url": "/api/images/partner/91f4cf07-b2b4-4c05-a31e-9ed524c936ee.jpg",
      "wechat_id": null
    }
  }
  ```

- `POST /api/upload/profile-photo` - Upload user profile photo
  - Request body: Multipart form with an image `file` field
  - Returns filename for form submission
  - Response: `{"filename": "2536f5b0-0f6c-401b-9f92-be95efe571ed.jpg"}`

#### Form Management

- `POST /api/form` - Submit or update user form
  - Only accessible to verified users; once submitted, it cannot be changed
  - Returns `200 OK` with partial submitted form data (without wechat_id field), see `GET /api/form` response
  - JSON request body:

  ```json
  {
    "wechat_id": "examplewechatid",
    "gender": "female",
    "familiar_tags": ["pc_fps", "spanish"],
    "aspirational_tags": ["volleyball", "creative_games"],
    "recent_topics": "Recently I love Bitcoin",
    "self_traits": ["empathy", "explorer"],
    "ideal_traits": ["empathy", "explorer"],
    "physical_boundary": 3,
    "self_intro": "Hello world",
    "profile_photo_filename": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee.jpg"
  }
  ```

- `GET /api/form` - Retrieve user's submitted form
  - Returns `200 OK` with partial submitted form data (without wechat_id field)
  - Response:

  ```json
  {
    "user_id": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee",
    "gender": "female",
    "familiar_tags": ["pc_fps", "spanish"],
    "aspirational_tags": ["volleyball", "creative_games"],
    "recent_topics": "Recently I love Bitcoin",
    "self_traits": ["empathy", "explorer"],
    "ideal_traits": ["empathy", "explorer"],
    "physical_boundary": 3,
    "self_intro": "Hello world",
    "profile_photo_filename": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee.jpg"
  }
  ```

#### ID Verification

- `POST /api/upload/card` - Upload student ID card for verification
  - Multipart form with ID card image `card` field and `grade` text field
  - Changes user status to verification pending
  - Returns `200 OK` with some user info
  - Response:

  ```json
  {
    "email": "second@mails.tsinghua.edu.cn",
    "status": "verification_pending",
    "grade": "graduate",
    "card_photo_filename": "2536f5b0-0f6c-401b-9f92-be95efe571ed.jpg"
  }
  ```

#### Matching System

- `GET /api/veto/previews` - Get current match previews for user to decide who to give veto
  - Response:

  ```json
  [
    {
      "candidate_id": "3bc5b542-36f2-41d8-8c63-f252f0eb438c",
      "familiar_tags": ["tennis", "martial_arts"],
      "aspirational_tags": ["wild", "pc_fps"],
      "recent_topics": "I'm User 7 and I love meeting new people! I enjoy various activities and am looking forward to connecting with like-minded individuals.",
      "email_domain": "mails.tsinghua.edu.cn",
      "grade": "undergraduate"
    },
    {
      "candidate_id": "47c361f7-d828-4015-892d-bd842bd5b7d7",
      "familiar_tags": ["music_games", "soccer"],
      "aspirational_tags": ["narrative_adventure", "other_sports"],
      "recent_topics": "I'm User 39 and I love meeting new people! I enjoy various activities and am looking forward to connecting with like-minded individuals.",
      "email_domain": "mails.tsinghua.edu.cn",
      "grade": "undergraduate"
    }
  ]
  ```

- `POST /api/veto` - Veto unwanted potential partner
  - JSON request body: `vetoed_id`
  - Response: `{"id": "f217e3c5-b503-4d8d-b37a-251ef63bcf06", "vetoer_id": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee", "vetoed_id": "3bc5b542-36f2-41d8-8c63-f252f0eb438c"}`

- `DELETE /api/veto` - Revoke vetoes
  - JSON request body: `vetoed_id`
  - Response: `{"id": "f217e3c5-b503-4d8d-b37a-251ef63bcf06", "vetoer_id": "91f4cf07-b2b4-4c05-a31e-9ed524c936ee", "vetoed_id": "3bc5b542-36f2-41d8-8c63-f252f0eb438c"}`

- `GET /api/vetoes` - Get casted vetoes
  - Returns `200 OK` with a list of UUIDs of casted vetoes
  - Response: `["3bc5b542-36f2-41d8-8c63-f252f0eb438c", "47c361f7-d828-4015-892d-bd842bd5b7d7"]`

- `POST /api/final-match/accept`, `POST /api/final-match/reject` - Decide on final match
  - Returns `200 OK` with updated profile
  - Response: refer to `GET /api/profile`

- `GET /api/partner-image/{filename}` - Get partner's profile photo
  - Maximum access control, only accessible to matched partners
  - Returns `200 OK` with image

</details>
