# Chat API Integration

This document explains the integration between the EnhancedAIChat component and the backend chat API.

## Overview

The chat integration follows a two-step process:
1. **Start Session**: Initialize a new chat session with a system prompt
2. **Send Messages**: Send user messages and receive AI responses

## API Endpoints

### 1. Start Session
```
POST http://localhost:8003/agentv3/session/start
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "system_prompt": "You are a helpful AI assistant..."
}
```

**Response:**
```json
{
  "session_id": "85e978b8-88ba-4ab3-bb9f-4416c6d06fdb",
  "message": "Session started successfully",
  "system_prompt": "You are a helpful AI assistant..."
}
```

### 2. Ask Question
```
POST http://localhost:8003/agentv3/ask
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "query": "Hello, I want to start a tech startup",
  "session_id": "85e978b8-88ba-4ab3-bb9f-4416c6d06fdb"
}
```

**Response:**
```json
{
  "response": "That's exciting! Starting a tech startup is a great journey...",
  "session_id": "85e978b8-88ba-4ab3-bb9f-4416c6d06fdb",
  "message_id": "msg_123",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

## Implementation Files

### Core Files
- `src/utils/chatService.ts` - Chat service with session management
- `src/components/AIAssistant/EnhancedAIChat.tsx` - Updated chat component
- `src/utils/chatApiTest.ts` - Testing utilities

### Configuration
- `.env` - Environment variables including `VITE_AGENT_URL`

## Usage Flow

### 1. First Message
When a user sends their first message:
1. `chatService.initializeAndAsk()` is called
2. Creates new session with system prompt
3. Sends the first message
4. Returns both session data and AI response
5. Session ID is stored in component state

### 2. Subsequent Messages
For follow-up messages:
1. `chatService.askQuestion()` is called with existing session ID
2. Message is sent to the same session
3. AI response is returned
4. Session context is maintained

## System Prompt

The default system prompt used for the Launch Pad chat:

```
You are a helpful AI assistant for the Launch Pad. You help entrepreneurs brainstorm ideas, validate concepts, build prototypes, and take their first steps as entrepreneurs. Be encouraging, practical, and provide actionable advice.
```

## Environment Variables

Add to your `.env` file:

```env
# Chat API Configuration
VITE_AGENT_URL=http://localhost:8003
```

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Shows user-friendly message
- **Authentication Errors**: Handled by axios interceptors
- **Session Errors**: Automatically starts new session if needed
- **API Errors**: Graceful fallback responses

## Testing

### Manual Testing in Browser Console

In development mode, test functions are available:

```javascript
// Run all tests
await window.chatAPITest.runAll()

// Test basic API
await window.chatAPITest.test()

// Test initialize and ask
await window.chatAPITest.initTest()

// Check configuration
window.chatAPITest.config()
```

### Example Test
```typescript
import { testChatAPI } from './utils/chatApiTest';

// Test the chat API
const result = await testChatAPI();
console.log('Test result:', result);
```

## Session Management

### Session Lifecycle
1. **Start**: Session created on first message
2. **Active**: Session ID stored in component state
3. **Cleanup**: Session cleared on component unmount

### Session Persistence
- Sessions are not persisted across page reloads
- Each chat component instance gets its own session
- Session ID is managed automatically

## Integration Benefits

1. **Real AI Responses**: Actual AI-powered responses instead of mock data
2. **Session Context**: AI remembers conversation history
3. **Error Resilience**: Graceful handling of API failures
4. **Development Tools**: Built-in testing and debugging
5. **Type Safety**: Full TypeScript support
6. **Consistent UX**: Seamless integration with existing chat UI

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if chat API server is running on port 8003
   - Verify `VITE_AGENT_URL` in `.env`

2. **Authorization Failed**
   - Ensure JWT token is present in localStorage
   - Check token expiration

3. **Session Not Found**
   - Component will automatically start new session
   - Check browser console for session lifecycle logs

### Debug Logs

In development mode, detailed logs are available:
- 🚀 Session start
- 💬 Message sending
- ✅ Successful responses
- ❌ Error details
- 🧹 Session cleanup

## Future Enhancements

Potential improvements:
1. **Session Persistence**: Store sessions in localStorage
2. **Typing Indicators**: Real-time typing status
3. **Message History**: Load previous conversations
4. **File Uploads**: Support for document sharing
5. **Streaming Responses**: Real-time response streaming