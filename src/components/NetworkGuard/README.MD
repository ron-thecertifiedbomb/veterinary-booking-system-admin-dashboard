🛡️ NetworkGuard Component
The NetworkGuard is a production-ready, full-screen blocking shield for React Native (and Web) applications. It prevents the application from rendering and executing unnecessary API calls when the user has no internet connection, the backend is unreachable, or the device's clock is severely out of sync with the server.

✨ Features
Zero-Leak Validation: Wraps your app at the root level, meaning downstream useEffect hooks or API fetches will never trigger if the user is offline.
Time Synchronization Check: Compares the client's local clock against the server's time to prevent JWT expiration bugs or timezone-related appointment errors.
Smart Re-verification: Uses React Native's AppState to automatically silently re-check the connection when the user brings the app back from the background.
Offline Escape Hatch: Allows users to bypass the error screen and continue to the app (useful for offline-first architectures using cached data).
Environment Aware: Automatically falls back to localhost, local network IPs, or production environment variables (EXPO_PUBLIC_API_URL, etc.).
📦 Requirements
Tailwind CSS: This component is styled using Tailwind CSS classes. In a React Native environment, you must have a library like NativeWind configured to parse the className props.
Backend Endpoint: The component expects your backend to expose a GET /api/server-time endpoint that returns a JSON object with at least a timestamp property (Unix epoch milliseconds).
Expected Backend Response:

json
{
  "timestamp": 1779425323000
}
🛠️ Usage
Wrap your main application or router with the NetworkGuard. It should ideally be placed right inside your App's root provider.

tsx
 Show full code block 
import React from 'react';
import { NetworkGuard } from './components/NetworkGuard';
import { MainRouter } from './router'; 

export default function App() {
  return (
    <NetworkGuard 
      allowOffline={true}
      maxTimeDifferenceMs={60000} // 1 minute
      onStatusChange={(status) => console.log('Current App Status:', status)}
    >
      <MainRouter />
    </NetworkGuard>
  );
}
🎛️ API Reference (Props)
Prop	Type	Default	Description
children	ReactNode	Required	The application or components to render once validation passes.
apiUrl	string	Auto-detected	The URL to ping. Defaults to process.env.EXPO_PUBLIC_API_URL/api/server-time or a local IP fallback.
maxTimeDifferenceMs	number	60000	The maximum allowed drift between the device clock and the server clock (in milliseconds). Default is 1 minute.
enabled	boolean	true	Setting this to false disables the guard entirely and instantly renders the children (useful for specific staging/dev testing).
allowOffline	boolean	false	If true, a "Continue Offline" button will appear on error screens, allowing the user to bypass the block.
onStatusChange	function	undefined	Callback fired whenever the guard's internal state changes. Passes the GuardStatus.
🚦 Status Types (GuardStatus)
If you are using the onStatusChange listener, it will return one of the following string states:

"verifying": The component is actively pinging the server.
"connected": The server responded perfectly, the clock is in sync, and the app is rendered.
"offline": The fetch failed, timed out, or returned a non-200 status code. The error screen is visible.
"time-desync": The server responded, but the device's clock drift exceeded the maxTimeDifferenceMs. The error screen is visible.
"offline-bypassed": The connection failed, but the user clicked "Continue Offline" (only possible if allowOffline is true). The app is rendered.
🧪 Testing
To test the different states locally:

Offline: Turn off your Wi-Fi or kill your NestJS server.
Time Desync: Manually change your phone/emulator's clock to be 5 minutes in the future, then open the app.
Bypass: Set allowOffline={true}, turn off your server, and click the "Continue Offline" button.