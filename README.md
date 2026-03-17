# n8n-nodes-late

<img src="https://raw.githubusercontent.com/zernio-dev/n8n-nodes-zernio/master/late/late-logo.png" alt="LATE Logo" width="200"/>

An n8n community node for the [Zernio API](https://zernio.com) - the professional social media management platform.

**Schedule and manage social media posts across multiple platforms:**
- 🐦 **Twitter/X** - Posts, threads, and automation
- 📸 **Instagram** - Posts, Stories, Reels with Business account support
- 👤 **Facebook** - Page management and posting
- 💼 **LinkedIn** - Personal and company page posting
- 🎵 **TikTok** - Direct video posting with privacy controls
- 📹 **YouTube** - Videos and Shorts with custom thumbnails
- 🧵 **Threads** - Meta's social platform
- 🦋 **Bluesky** - Decentralized social network
- 📌 **Pinterest** - Pin to boards
- 🤖 **Reddit** - Post to subreddits
- ✈️ **Telegram** - Channel posting
- 📍 **Google Business** - Business profile posts and reviews
- 👻 **Snapchat** - Public profile posting

## Version History

- **1.0.0** - Initial release with comprehensive LATE API integration

## Installation

### From n8n Community Nodes Panel (Recommended)

1. Go to **Settings** → **Community Nodes** in your n8n instance
2. Select **Install** and enter `n8n-nodes-late`
3. Click **Install** and restart n8n
4. The LATE node will appear in your node palette

### From npm

```bash
npm install n8n-nodes-late
```

### From Source

```bash
git clone https://github.com/zernio-dev/n8n-nodes-zernio.git
cd n8n-nodes-late
npm install
npm run build
```

## Prerequisites

1. **LATE Account**: Sign up at [zernio.com](https://zernio.com)
2. **API Key**: Generate an API key from your LATE dashboard
3. **Social Accounts**: Connect your social media accounts to LATE profiles

## Credentials Setup

1. Add a new credential in n8n
2. Search for "LATE API"
3. Enter your API key from the LATE dashboard

## Quick Start

### 1. Create a Profile

Profiles organize your social media accounts by brand, client, or purpose.

```json
{
  "resource": "profiles",
  "operation": "create",
  "name": "Personal Brand",
  "description": "My personal social media accounts",
  "color": "#4ade80"
}
```

### 2. Connect Social Accounts

Connect your social media platforms to the profile:

```json
{
  "resource": "connect",
  "operation": "connect",
  "platform": "twitter",
  "profileId": "profile_123_abc"
}
```

### 3. Schedule a Post

Create posts across multiple platforms:

```json
{
  "resource": "posts",
  "operation": "create",
  "content": "Hello, world! #automation",
  "platforms": [
    {"platform": "twitter", "accountId": "twitter_account_123"},
    {"platform": "linkedin", "accountId": "linkedin_account_456"}
  ],
  "scheduledFor": "2024-01-15T16:00:00",
  "timezone": "America/New_York"
}
```

## Supported Operations

### Profiles
- **List** - Get all profiles
- **Create** - Create new profile (subject to plan limits)
- **Update** - Update profile details
- **Delete** - Delete profile (must be empty)

### Posts
- **List** - Get posts with pagination and filters
- **Get** - Get specific post details
- **Create** - Schedule or publish posts
- **Update** - Edit draft/scheduled posts
- **Delete** - Delete posts (published posts cannot be deleted)
- **Retry** - Retry failed posts
- **Logs** - Get publishing logs for a post
- **Bulk Upload** - Upload multiple posts at once

### Media
- **Upload** - Upload images/videos up to 5GB
- **Presign** - Get presigned URL for large file uploads

### Social Accounts
- **List** - View connected accounts
- **Get** - Get specific account details
- **Update** - Update account settings (e.g., display name)
- **Delete** - Disconnect accounts
- **Health** - Check account connection health
- **All Health** - Check health of all accounts
- **Follower Stats** - Get follower statistics

### Account Groups
- **List** - Get all account groups
- **Get** - Get specific group details
- **Create** - Create new account group
- **Update** - Update group settings
- **Delete** - Delete account group

### Connect Platform
- **Connect** - Initiate OAuth for new platforms

### Usage Statistics
- **Get Stats** - Monitor usage against plan limits

### Analytics
- **Get** - Get post analytics across platforms
- **YouTube Daily Views** - Get daily view statistics for YouTube

### Queue (Scheduling Slots)
- **List** - Get queue slots for a profile
- **Create** - Create new queue slot
- **Update** - Update slot time
- **Delete** - Remove queue slot
- **Preview** - Preview upcoming scheduled posts
- **Next Slot** - Get next available slot time

### Webhooks
- **Get** - Get webhook configuration
- **Create** - Create new webhook endpoint
- **Update** - Update webhook settings
- **Delete** - Remove webhook
- **Test** - Send test webhook event
- **Logs** - View webhook delivery history

### Facebook Management
- **List Pages** - Get available Facebook pages
- **Select Page** - Connect specific page
- **List Account Pages** - Get pages for a specific account
- **Update Page** - Change active page

### LinkedIn Management
- **Update Organization** - Switch between personal/company posting

### Google Business Management
- **List Locations** - Get available business locations
- **Select Location** - Connect specific location
- **List Account Locations** - Get locations for an account
- **Switch Location** - Change active location
- **List Reviews** - Get business reviews
- **Reply Review** - Respond to a review
- **Delete Reply** - Remove review response

### Pinterest Management
- **List Boards** - Get available Pinterest boards
- **Select Board** - Connect specific board

### Bluesky Management
- **Connect** - Connect Bluesky account with credentials
- **Disconnect** - Disconnect Bluesky account

### Reddit Management
- **List Subreddits** - Get saved subreddits for posting
- **Update Subreddits** - Update subreddit list
- **Search** - Search for subreddits
- **Feed** - Get subreddit feed (hot, new, top, rising)

### Snapchat Management
- **List Profiles** - Get available public profiles
- **Select Profile** - Connect specific profile

### Telegram Management
- **Get Status** - Check Telegram connection status
- **Initiate** - Start Telegram connection flow

### Clone Connection
- **Clone Connection** - Reuse OAuth across profiles

### Team Management
- **Invites: Create** - Invite team members with profile access

### API Keys
- **List** - Get all API keys
- **Create** - Generate new API key
- **Delete** - Revoke API key

### Users
- **List** - Get team members
- **Get** - Get user details

### Logs
- **List** - Get publishing logs with filters
- **Get** - Get specific log entry

## Advanced Features

### Platform-Specific Settings

#### Twitter/X Threads
Create multi-tweet threads:

```json
{
  "platforms": [
    {
      "platform": "twitter",
      "accountId": "twitter_account_123",
      "platformSpecificData": {
        "threadItems": [
          {"content": "Tweet 1 - Introduction"},
          {"content": "Tweet 2 - Details"},
          {"content": "Tweet 3 - Conclusion"}
        ]
      }
    }
  ]
}
```

#### Instagram Stories
Post to Instagram Stories:

```json
{
  "platforms": [
    {
      "platform": "instagram",
      "accountId": "instagram_account_123",
      "platformSpecificData": {
        "contentType": "story"
      }
    }
  ],
  "mediaItems": [
    {"type": "image", "url": "https://your-story-image.jpg"}
  ]
}
```

#### TikTok Privacy Settings
Control TikTok post privacy:

```json
{
  "platforms": [
    {
      "platform": "tiktok",
      "accountId": "tiktok_account_123",
      "platformSpecificData": {
        "tiktokSettings": {
          "privacy_level": "PUBLIC_TO_EVERYONE",
          "allow_comment": true,
          "allow_duet": true,
          "allow_stitch": true
        }
      }
    }
  ]
}
```

#### YouTube Settings
Add custom thumbnails and first comments:

```json
{
  "platforms": [
    {
      "platform": "youtube",
      "accountId": "youtube_account_123",
      "platformSpecificData": {
        "firstComment": "Thanks for watching! Don't forget to like and subscribe!"
      }
    }
  ],
  "mediaItems": [
    {
      "type": "video",
      "url": "https://your-video.mp4",
      "thumbnail": "https://your-custom-thumbnail.jpg"
    }
  ],
  "tags": ["tutorial", "automation", "n8n"]
}
```

#### Bluesky Threads
Create multi-post threads on Bluesky:

```json
{
  "platforms": [
    {
      "platform": "bluesky",
      "accountId": "bluesky_account_123",
      "platformSpecificData": {
        "threadItems": [
          {"content": "Post 1 - Introduction"},
          {"content": "Post 2 - Details"},
          {"content": "Post 3 - Conclusion"}
        ]
      }
    }
  ]
}
```

### Media Upload

Upload files before using in posts:

```json
{
  "resource": "media",
  "operation": "upload",
  "files": [
    {
      "filename": "image.jpg",
      "data": "base64_encoded_data"
    }
  ]
}
```

For large files (>4MB), use the presign operation:

```json
{
  "resource": "media",
  "operation": "presign",
  "filename": "video.mp4",
  "contentType": "video/mp4"
}
```

### Webhooks

Set up webhooks to receive real-time notifications:

```json
{
  "resource": "webhooks",
  "operation": "create",
  "url": "https://your-server.com/webhook",
  "events": ["post.published", "post.failed"]
}
```

Available webhook events:
- `post.scheduled` - Post scheduled
- `post.published` - Post published successfully
- `post.failed` - Post failed to publish
- `post.partial` - Post partially published (some platforms failed)

## Platform Requirements

- **Instagram**: Business account required (Personal/Creator accounts not supported)
- **Facebook**: Must be admin of Facebook pages
- **LinkedIn**: Company pages require admin access
- **TikTok**: Creator account recommended
- **YouTube**: Channel access required
- **Twitter/X**: Standard account
- **Threads**: Standard account
- **Bluesky**: Standard account (uses app password)
- **Pinterest**: Business account recommended
- **Reddit**: Account with posting privileges
- **Telegram**: Bot token required
- **Google Business**: Business profile owner/manager access
- **Snapchat**: Public profile required

## Plan Limits

LATE enforces usage limits based on your plan:

- **Free**: 10 posts/month, 2 Social Sets - $0/mo
- **Build**: 120 posts/month, 10 Social Sets - $13/mo (billed yearly)
- **Accelerate**: Unlimited posts, 50 Social Sets - $33/mo (billed yearly)
- **Unlimited**: Unlimited posts, Unlimited Social Sets - $667/mo (billed yearly)

Optional add-ons available: Analytics, Comments + DMs

Monitor usage with the Usage Statistics operation.

## Error Handling

The node handles various error scenarios:

- **403**: Plan limits exceeded
- **401**: Invalid API key
- **400**: Invalid request data
- **404**: Resource not found
- **429**: Rate limit exceeded

Check the node output for detailed error messages and upgrade suggestions.

## Development

### Prerequisites
- Node.js 18+
- TypeScript
- n8n development environment

### Setup
```bash
git clone https://github.com/zernio-dev/n8n-nodes-zernio.git
cd n8n-nodes-late
npm install
npm run build
```

### Linting
```bash
npm run lint        # Check for issues
npm run lintfix     # Fix automatically
```

## Support

- **Documentation**: [Zernio API Docs](https://docs.zernio.com)
- **Dashboard**: [zernio.com/dashboard](https://zernio.com/dashboard)
- **Email**: [miki@zernio.com](mailto:miki@zernio.com)
- **Issues**: [GitHub Issues](https://github.com/zernio-dev/n8n-nodes-zernio/issues)

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

---

**Made with love by the LATE team**

[Website](https://zernio.com) | [Documentation](https://docs.zernio.com) | [Dashboard](https://zernio.com/dashboard)

