# ESP32 Vercel Proxy

This Vercel serverless function acts as a proxy between your React Native app and your ESP32 device, bypassing Android network security restrictions.

## 🚀 Quick Setup

### 1. Deploy to Vercel

```bash
cd vercel-proxy
npm install
npx vercel --prod
```

### 2. Update App Configuration

After deployment, Vercel will give you a URL like:
`https://your-app-name.vercel.app`

Update `constants/Config.ts` in your main app:

```typescript
export const ESP32_CONFIG = {
  PROXY_URL: 'https://your-app-name.vercel.app/api/esp32',
  // ... rest of config
};
```

### 3. Update ESP32 IP (if needed)

If your ESP32 IP changes, update it in `api/esp32.js`:

```javascript
const ESP32_IP = '192.168.0.165'; // Your ESP32's current IP
```

## 🔧 How It Works

1. **App** → **HTTPS** → **Vercel Proxy** → **HTTP** → **ESP32**
2. Android allows HTTPS requests by default
3. Vercel proxy handles the HTTP communication to ESP32
4. All responses are forwarded back to your app

## 📱 Benefits

- ✅ **Bypasses Android network security** completely
- ✅ **Uses HTTPS** (Android allows this by default)
- ✅ **Works on any network** (no local network restrictions)
- ✅ **More secure** than direct HTTP connections
- ✅ **Reliable** across all devices and Android versions

## 🔍 Testing

Test the proxy directly:

```bash
# Test status endpoint
curl https://your-app-name.vercel.app/api/esp32/status

# Test home lights endpoint
curl -X POST https://your-app-name.vercel.app/api/esp32/home-lights \
  -H "Content-Type: application/json" \
  -d '{"state": true}'
```

## 🛠️ Troubleshooting

- **Check ESP32 IP**: Make sure it's correct in `api/esp32.js`
- **Check ESP32 connectivity**: Ensure ESP32 is reachable from Vercel's servers
- **Check logs**: Vercel dashboard shows function logs
- **Test locally**: Use `vercel dev` to test locally first
