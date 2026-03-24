# n8n Node Sync Report

**Generated:** 2026-03-24T09:12:15.655Z
**API Version:** 1.0.1
**Total Endpoints:** 225

## Summary

| Metric | Count |
|--------|-------|
| New/Missing Endpoints | 57 |
| Missing Resources | 0 |

## New Endpoints to Implement

These endpoints exist in the API but are not implemented in the n8n node:

| Tag | Method | Path | Operation ID |
|-----|--------|------|--------------|
| Messages | GET | /v1/inbox/conversations | listInboxConversations |
| Messages | GET | /v1/inbox/conversations/{conversationId} | getInboxConversation |
| Messages | PUT | /v1/inbox/conversations/{conversationId} | updateInboxConversation |
| Messages | GET | /v1/inbox/conversations/{conversationId}/messages | getInboxConversationMessages |
| Messages | POST | /v1/inbox/conversations/{conversationId}/messages | sendInboxMessage |
| Messages | PATCH | /v1/inbox/conversations/{conversationId}/messages/{messageId} | editInboxMessage |
| Comments | GET | /v1/inbox/comments | listInboxComments |
| Comments | GET | /v1/inbox/comments/{postId} | getInboxPostComments |
| Comments | POST | /v1/inbox/comments/{postId} | replyToInboxPost |
| Comments | DELETE | /v1/inbox/comments/{postId} | deleteInboxComment |
| Comments | POST | /v1/inbox/comments/{postId}/{commentId}/hide | hideInboxComment |
| Comments | DELETE | /v1/inbox/comments/{postId}/{commentId}/hide | unhideInboxComment |
| Comments | POST | /v1/inbox/comments/{postId}/{commentId}/like | likeInboxComment |
| Comments | DELETE | /v1/inbox/comments/{postId}/{commentId}/like | unlikeInboxComment |
| Comments | POST | /v1/inbox/comments/{postId}/{commentId}/private-reply | sendPrivateReplyToComment |
| Reviews | GET | /v1/inbox/reviews | listInboxReviews |
| Reviews | POST | /v1/inbox/reviews/{reviewId}/reply | replyToInboxReview |
| Reviews | DELETE | /v1/inbox/reviews/{reviewId}/reply | deleteInboxReviewReply |
| Contacts | GET | /v1/contacts | listContacts |
| Contacts | POST | /v1/contacts | createContact |
| Contacts | GET | /v1/contacts/{contactId} | getContact |
| Contacts | PATCH | /v1/contacts/{contactId} | updateContact |
| Contacts | DELETE | /v1/contacts/{contactId} | deleteContact |
| Contacts | GET | /v1/contacts/{contactId}/channels | getContactChannels |
| Contacts | POST | /v1/contacts/bulk | bulkCreateContacts |
| Custom Fields | PUT | /v1/contacts/{contactId}/fields/{slug} | setContactFieldValue |
| Custom Fields | DELETE | /v1/contacts/{contactId}/fields/{slug} | clearContactFieldValue |
| Custom Fields | GET | /v1/custom-fields | listCustomFields |
| Custom Fields | POST | /v1/custom-fields | createCustomField |
| Custom Fields | PATCH | /v1/custom-fields/{fieldId} | updateCustomField |
| Custom Fields | DELETE | /v1/custom-fields/{fieldId} | deleteCustomField |
| Broadcasts | GET | /v1/broadcasts | listBroadcasts |
| Broadcasts | POST | /v1/broadcasts | createBroadcast |
| Broadcasts | GET | /v1/broadcasts/{broadcastId} | getBroadcast |
| Broadcasts | PATCH | /v1/broadcasts/{broadcastId} | updateBroadcast |
| Broadcasts | DELETE | /v1/broadcasts/{broadcastId} | deleteBroadcast |
| Broadcasts | POST | /v1/broadcasts/{broadcastId}/send | sendBroadcast |
| Broadcasts | POST | /v1/broadcasts/{broadcastId}/schedule | scheduleBroadcast |
| Broadcasts | POST | /v1/broadcasts/{broadcastId}/cancel | cancelBroadcast |
| Broadcasts | GET | /v1/broadcasts/{broadcastId}/recipients | listBroadcastRecipients |
| Broadcasts | POST | /v1/broadcasts/{broadcastId}/recipients | addBroadcastRecipients |
| Sequences | GET | /v1/sequences | listSequences |
| Sequences | POST | /v1/sequences | createSequence |
| Sequences | GET | /v1/sequences/{sequenceId} | getSequence |
| Sequences | PATCH | /v1/sequences/{sequenceId} | updateSequence |
| Sequences | DELETE | /v1/sequences/{sequenceId} | deleteSequence |
| Sequences | POST | /v1/sequences/{sequenceId}/activate | activateSequence |
| Sequences | POST | /v1/sequences/{sequenceId}/pause | pauseSequence |
| Sequences | POST | /v1/sequences/{sequenceId}/enroll | enrollContacts |
| Sequences | DELETE | /v1/sequences/{sequenceId}/enroll/{contactId} | unenrollContact |
| Sequences | GET | /v1/sequences/{sequenceId}/enrollments | listSequenceEnrollments |
| Comment Automations | GET | /v1/comment-automations | listCommentAutomations |
| Comment Automations | POST | /v1/comment-automations | createCommentAutomation |
| Comment Automations | GET | /v1/comment-automations/{automationId} | getCommentAutomation |
| Comment Automations | PATCH | /v1/comment-automations/{automationId} | updateCommentAutomation |
| Comment Automations | DELETE | /v1/comment-automations/{automationId} | deleteCommentAutomation |
| Comment Automations | GET | /v1/comment-automations/{automationId}/logs | listCommentAutomationLogs |

## Endpoints by Tag

### ⚠️ Tools

- `GET` /v1/tools/youtube/download
- `GET` /v1/tools/youtube/transcript
- `GET` /v1/tools/instagram/download
- `POST` /v1/tools/instagram/hashtag-checker
- `GET` /v1/tools/tiktok/download
- `GET` /v1/tools/twitter/download
- `GET` /v1/tools/facebook/download
- `GET` /v1/tools/linkedin/download
- `GET` /v1/tools/bluesky/download

### ⚠️ Validate

- `POST` /v1/tools/validate/post-length
- `POST` /v1/tools/validate/post
- `POST` /v1/tools/validate/media
- `GET` /v1/tools/validate/subreddit

### ✅ Analytics

- `GET` /v1/analytics
- `GET` /v1/analytics/youtube/daily-views
- `GET` /v1/analytics/instagram/account-insights
- `GET` /v1/analytics/instagram/demographics
- `GET` /v1/analytics/daily-metrics
- `GET` /v1/analytics/best-time
- `GET` /v1/analytics/content-decay
- `GET` /v1/analytics/posting-frequency
- `GET` /v1/analytics/post-timeline
- `GET` /v1/accounts/{accountId}/linkedin-aggregate-analytics
- `GET` /v1/accounts/{accountId}/linkedin-post-analytics
- `GET` /v1/accounts/{accountId}/linkedin-post-reactions

### ✅ Account Groups

- `GET` /v1/account-groups
- `POST` /v1/account-groups
- `PUT` /v1/account-groups/{groupId}
- `DELETE` /v1/account-groups/{groupId}

### ✅ Media

- `POST` /v1/media/presign

### ✅ Reddit Search

- `GET` /v1/reddit/search
- `GET` /v1/reddit/feed

### ✅ Usage

- `GET` /v1/usage-stats

### ✅ Posts

- `GET` /v1/posts
- `POST` /v1/posts
- `GET` /v1/posts/{postId}
- `PUT` /v1/posts/{postId}
- `DELETE` /v1/posts/{postId}
- `POST` /v1/posts/bulk-upload
- `POST` /v1/posts/{postId}/retry
- `POST` /v1/posts/{postId}/unpublish

### ⚠️ Users

- `GET` /v1/users
- `GET` /v1/users/{userId}

### ✅ Profiles

- `GET` /v1/profiles
- `POST` /v1/profiles
- `GET` /v1/profiles/{profileId}
- `PUT` /v1/profiles/{profileId}
- `DELETE` /v1/profiles/{profileId}

### ⚠️ Accounts

- `GET` /v1/accounts
- `GET` /v1/accounts/follower-stats
- `PUT` /v1/accounts/{accountId}
- `DELETE` /v1/accounts/{accountId}
- `GET` /v1/accounts/health
- `GET` /v1/accounts/{accountId}/health
- `GET` /v1/accounts/{accountId}/tiktok/creator-info

### ⚠️ API Keys

- `GET` /v1/api-keys
- `POST` /v1/api-keys
- `DELETE` /v1/api-keys/{keyId}

### ✅ Invites

- `POST` /v1/invite/tokens

### ✅ Connect

- `GET` /v1/connect/{platform}
- `POST` /v1/connect/{platform}
- `GET` /v1/connect/facebook/select-page
- `POST` /v1/connect/facebook/select-page
- `GET` /v1/connect/googlebusiness/locations
- `POST` /v1/connect/googlebusiness/select-location
- `GET` /v1/connect/pending-data
- `GET` /v1/connect/linkedin/organizations
- `POST` /v1/connect/linkedin/select-organization
- `GET` /v1/connect/pinterest/select-board
- `POST` /v1/connect/pinterest/select-board
- `GET` /v1/connect/snapchat/select-profile
- `POST` /v1/connect/snapchat/select-profile
- `POST` /v1/connect/bluesky/credentials
- `POST` /v1/connect/whatsapp/credentials
- `GET` /v1/connect/telegram
- `POST` /v1/connect/telegram
- `PATCH` /v1/connect/telegram
- `GET` /v1/accounts/{accountId}/facebook-page
- `PUT` /v1/accounts/{accountId}/facebook-page
- `GET` /v1/accounts/{accountId}/linkedin-organizations
- `PUT` /v1/accounts/{accountId}/linkedin-organization
- `GET` /v1/accounts/{accountId}/pinterest-boards
- `PUT` /v1/accounts/{accountId}/pinterest-boards
- `GET` /v1/accounts/{accountId}/gmb-locations
- `PUT` /v1/accounts/{accountId}/gmb-locations
- `GET` /v1/accounts/{accountId}/reddit-subreddits
- `PUT` /v1/accounts/{accountId}/reddit-subreddits
- `GET` /v1/accounts/{accountId}/reddit-flairs

### ⚠️ GMB Reviews

- `GET` /v1/accounts/{accountId}/gmb-reviews

### ⚠️ GMB Food Menus

- `GET` /v1/accounts/{accountId}/gmb-food-menus
- `PUT` /v1/accounts/{accountId}/gmb-food-menus

### ⚠️ GMB Location Details

- `GET` /v1/accounts/{accountId}/gmb-location-details
- `PUT` /v1/accounts/{accountId}/gmb-location-details

### ⚠️ GMB Media

- `GET` /v1/accounts/{accountId}/gmb-media
- `POST` /v1/accounts/{accountId}/gmb-media
- `DELETE` /v1/accounts/{accountId}/gmb-media

### ⚠️ GMB Attributes

- `GET` /v1/accounts/{accountId}/gmb-attributes
- `PUT` /v1/accounts/{accountId}/gmb-attributes

### ⚠️ GMB Place Actions

- `GET` /v1/accounts/{accountId}/gmb-place-actions
- `POST` /v1/accounts/{accountId}/gmb-place-actions
- `DELETE` /v1/accounts/{accountId}/gmb-place-actions

### ⚠️ LinkedIn Mentions

- `GET` /v1/accounts/{accountId}/linkedin-mentions

### ✅ Queue

- `GET` /v1/queue/slots
- `POST` /v1/queue/slots
- `PUT` /v1/queue/slots
- `DELETE` /v1/queue/slots
- `GET` /v1/queue/preview
- `GET` /v1/queue/next-slot

### ✅ Webhooks

- `GET` /v1/webhooks/settings
- `POST` /v1/webhooks/settings
- `PUT` /v1/webhooks/settings
- `DELETE` /v1/webhooks/settings
- `POST` /v1/webhooks/test
- `GET` /v1/webhooks/logs

### ✅ Logs

- `GET` /v1/posts/logs
- `GET` /v1/connections/logs
- `GET` /v1/posts/{postId}/logs

### ⚠️ Messages

- `GET` /v1/inbox/conversations 🆕
- `GET` /v1/inbox/conversations/{conversationId} 🆕
- `PUT` /v1/inbox/conversations/{conversationId} 🆕
- `GET` /v1/inbox/conversations/{conversationId}/messages 🆕
- `POST` /v1/inbox/conversations/{conversationId}/messages 🆕
- `PATCH` /v1/inbox/conversations/{conversationId}/messages/{messageId} 🆕

### ⚠️ Account Settings

- `GET` /v1/accounts/{accountId}/messenger-menu
- `PUT` /v1/accounts/{accountId}/messenger-menu
- `DELETE` /v1/accounts/{accountId}/messenger-menu
- `GET` /v1/accounts/{accountId}/instagram-ice-breakers
- `PUT` /v1/accounts/{accountId}/instagram-ice-breakers
- `DELETE` /v1/accounts/{accountId}/instagram-ice-breakers
- `GET` /v1/accounts/{accountId}/telegram-commands
- `PUT` /v1/accounts/{accountId}/telegram-commands
- `DELETE` /v1/accounts/{accountId}/telegram-commands

### ⚠️ Comments

- `GET` /v1/inbox/comments 🆕
- `GET` /v1/inbox/comments/{postId} 🆕
- `POST` /v1/inbox/comments/{postId} 🆕
- `DELETE` /v1/inbox/comments/{postId} 🆕
- `POST` /v1/inbox/comments/{postId}/{commentId}/hide 🆕
- `DELETE` /v1/inbox/comments/{postId}/{commentId}/hide 🆕
- `POST` /v1/inbox/comments/{postId}/{commentId}/like 🆕
- `DELETE` /v1/inbox/comments/{postId}/{commentId}/like 🆕
- `POST` /v1/inbox/comments/{postId}/{commentId}/private-reply 🆕

### ⚠️ Twitter Engagement

- `POST` /v1/twitter/retweet
- `DELETE` /v1/twitter/retweet
- `POST` /v1/twitter/bookmark
- `DELETE` /v1/twitter/bookmark
- `POST` /v1/twitter/follow
- `DELETE` /v1/twitter/follow

### ⚠️ Reviews

- `GET` /v1/inbox/reviews 🆕
- `POST` /v1/inbox/reviews/{reviewId}/reply 🆕
- `DELETE` /v1/inbox/reviews/{reviewId}/reply 🆕

### ⚠️ WhatsApp

- `POST` /v1/whatsapp/bulk
- `GET` /v1/whatsapp/contacts
- `POST` /v1/whatsapp/contacts
- `GET` /v1/whatsapp/contacts/{contactId}
- `PUT` /v1/whatsapp/contacts/{contactId}
- `DELETE` /v1/whatsapp/contacts/{contactId}
- `POST` /v1/whatsapp/contacts/import
- `POST` /v1/whatsapp/contacts/bulk
- `DELETE` /v1/whatsapp/contacts/bulk
- `GET` /v1/whatsapp/groups
- `POST` /v1/whatsapp/groups
- `DELETE` /v1/whatsapp/groups
- `GET` /v1/whatsapp/templates
- `POST` /v1/whatsapp/templates
- `GET` /v1/whatsapp/templates/{templateName}
- `PATCH` /v1/whatsapp/templates/{templateName}
- `DELETE` /v1/whatsapp/templates/{templateName}
- `GET` /v1/whatsapp/broadcasts
- `POST` /v1/whatsapp/broadcasts
- `GET` /v1/whatsapp/broadcasts/{broadcastId}
- `DELETE` /v1/whatsapp/broadcasts/{broadcastId}
- `POST` /v1/whatsapp/broadcasts/{broadcastId}/send
- `POST` /v1/whatsapp/broadcasts/{broadcastId}/schedule
- `DELETE` /v1/whatsapp/broadcasts/{broadcastId}/schedule
- `GET` /v1/whatsapp/broadcasts/{broadcastId}/recipients
- `PATCH` /v1/whatsapp/broadcasts/{broadcastId}/recipients
- `DELETE` /v1/whatsapp/broadcasts/{broadcastId}/recipients
- `GET` /v1/whatsapp/business-profile
- `POST` /v1/whatsapp/business-profile
- `POST` /v1/whatsapp/business-profile/photo
- `GET` /v1/whatsapp/business-profile/display-name
- `POST` /v1/whatsapp/business-profile/display-name

### ⚠️ WhatsApp Phone Numbers

- `GET` /v1/whatsapp/phone-numbers
- `POST` /v1/whatsapp/phone-numbers/purchase
- `GET` /v1/whatsapp/phone-numbers/{phoneNumberId}
- `DELETE` /v1/whatsapp/phone-numbers/{phoneNumberId}

### ⚠️ Contacts

- `GET` /v1/contacts 🆕
- `POST` /v1/contacts 🆕
- `GET` /v1/contacts/{contactId} 🆕
- `PATCH` /v1/contacts/{contactId} 🆕
- `DELETE` /v1/contacts/{contactId} 🆕
- `GET` /v1/contacts/{contactId}/channels 🆕
- `POST` /v1/contacts/bulk 🆕

### ⚠️ Custom Fields

- `PUT` /v1/contacts/{contactId}/fields/{slug} 🆕
- `DELETE` /v1/contacts/{contactId}/fields/{slug} 🆕
- `GET` /v1/custom-fields 🆕
- `POST` /v1/custom-fields 🆕
- `PATCH` /v1/custom-fields/{fieldId} 🆕
- `DELETE` /v1/custom-fields/{fieldId} 🆕

### ⚠️ Broadcasts

- `GET` /v1/broadcasts 🆕
- `POST` /v1/broadcasts 🆕
- `GET` /v1/broadcasts/{broadcastId} 🆕
- `PATCH` /v1/broadcasts/{broadcastId} 🆕
- `DELETE` /v1/broadcasts/{broadcastId} 🆕
- `POST` /v1/broadcasts/{broadcastId}/send 🆕
- `POST` /v1/broadcasts/{broadcastId}/schedule 🆕
- `POST` /v1/broadcasts/{broadcastId}/cancel 🆕
- `GET` /v1/broadcasts/{broadcastId}/recipients 🆕
- `POST` /v1/broadcasts/{broadcastId}/recipients 🆕

### ⚠️ Sequences

- `GET` /v1/sequences 🆕
- `POST` /v1/sequences 🆕
- `GET` /v1/sequences/{sequenceId} 🆕
- `PATCH` /v1/sequences/{sequenceId} 🆕
- `DELETE` /v1/sequences/{sequenceId} 🆕
- `POST` /v1/sequences/{sequenceId}/activate 🆕
- `POST` /v1/sequences/{sequenceId}/pause 🆕
- `POST` /v1/sequences/{sequenceId}/enroll 🆕
- `DELETE` /v1/sequences/{sequenceId}/enroll/{contactId} 🆕
- `GET` /v1/sequences/{sequenceId}/enrollments 🆕

### ⚠️ Comment Automations

- `GET` /v1/comment-automations 🆕
- `POST` /v1/comment-automations 🆕
- `GET` /v1/comment-automations/{automationId} 🆕
- `PATCH` /v1/comment-automations/{automationId} 🆕
- `DELETE` /v1/comment-automations/{automationId} 🆕
- `GET` /v1/comment-automations/{automationId}/logs 🆕

