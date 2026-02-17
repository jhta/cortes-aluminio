# Publishing Cortes Aluminio to Google Play Store

Step-by-step guide using Expo EAS.

---

## Prerequisites

- [ ] **Google Play Developer account** — $25 USD one-time fee: https://play.google.com/console
  - Account verification can take 24-48 hours
- [ ] **Expo account** — free: https://expo.dev/signup
- [ ] **Node.js** installed (you already have it)

---

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

## Step 2: Login to Expo

```bash
eas login
```

Use your Expo account. If you don't have one, create it at https://expo.dev/signup

## Step 3: Set the Android package name

Edit `app.json` and add `package` inside `android`:

```json
"android": {
  "package": "com.jhta.cortesaluminio",
  "adaptiveIcon": {
    ...
  }
}
```

> The package name must be unique on Play Store. Format: `com.yourname.yourapp`

## Step 4: Configure EAS Build

```bash
cd /Users/jeisonhiguita/Documents/side-projects/cortes-aluminio
eas build:configure
```

This creates an `eas.json` file with build profiles (development, preview, production).

## Step 5: Create the production build

```bash
eas build --platform android --profile production
```

- Runs in the cloud (no Android Studio needed)
- Takes ~10-15 minutes the first time
- Generates an `.aab` file (Android App Bundle)
- EAS will ask to create a keystore the first time — accept it, it's stored securely in the cloud

When done, you'll get a download link for the `.aab`.

## Step 6: Create the app in Google Play Console

1. Go to https://play.google.com/console
2. Click **"Create app"**
3. Fill in:
   - Name: **Cortes Aluminio**
   - Language: Spanish
   - Type: App
   - Free
4. Accept the declarations

## Step 7: Complete the Play Store listing

Before publishing, Google requires:

### Basic info
- **Short description**: "Aluminum cutting calculator for windows"
- **Long description**: "Calculate the exact dimensions of each aluminum piece needed to build windows. Supports systems 520 and 744. Enter width, height, and number of panels to get dimensions for cabezal, sillar, jamba, horizontal, enganche, traslape, and glass."

### Screenshots
- Minimum 2 phone screenshots
- You can take them from the emulator or your phone
- Format: JPEG or PNG, min 320px, max 3840px

### App icon
- 512 x 512 px, high-resolution PNG

### Content rating
- Go to **Policy > Content rating**
- Complete the questionnaire (quick, the app has no sensitive content)

### Privacy policy
- Google requires a privacy policy URL
- Quick option: create a simple page on GitHub Pages or use a generator like https://app-privacy-policy-generator.firebaseapp.com/
- Since the app collects no data, the policy is very simple

## Step 8: Upload the build

### Option A: With EAS Submit (automated)

First, create a **Google Service Account Key**:

1. In Play Console: **Settings > API access**
2. Create a service account
3. Download the JSON file
4. Store the JSON securely (NOT in the repo)

Then:

```bash
eas submit --platform android --path /path/to/file.aab
```

Or if the build is already on EAS:

```bash
eas submit --platform android --latest
```

It will ask for the path to the service account JSON.

### Option B: Manual upload (simpler for the first time)

1. Download the `.aab` from the link provided by `eas build`
2. In Play Console, go to **Production > Create new release**
3. Upload the `.aab` manually
4. Add release notes: "Initial release"
5. Click **Review release** then **Start rollout**

## Step 9: Publish

### Recommended: start with internal testing

1. In Play Console: **Testing > Internal testing**
2. Upload the `.aab`
3. Add tester emails (up to 100)
4. Testers receive an install link
5. Available in minutes (no Google review)

### Production

1. When ready, promote from internal testing to production
2. Google reviews the app (can take 1-7 days the first time)
3. Once approved, it appears on Play Store

---

## Quick install on a connected device (no Play Store)

You can build locally and install directly on a connected Android phone.

### Option 1: Local APK with EAS (easiest)

Build a preview APK (installs directly, no Play Store needed):

```bash
eas build --platform android --profile preview --local
```

> Note: `--local` requires Java 17 and Android SDK installed locally.
> Install them with: `brew install openjdk@17` and Android Studio or `sdkmanager`.

This produces an `.apk` file. Install it on your connected device:

```bash
adb install build-*.apk
```

### Option 2: Development build on device

This gives you a hot-reloading dev build on your phone:

```bash
# Create a development build
npx expo run:android
```

> Requires Android SDK. Your phone must have **USB debugging** enabled
> (Settings > Developer options > USB debugging).

The app installs and runs on your connected device with live reload.

### Option 3: Expo Go (quickest for testing, no build needed)

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (available on Play Store).
This runs instantly but doesn't support all native features.

### Enable USB debugging on your Android phone

1. Go to **Settings > About phone**
2. Tap **Build number** 7 times (enables Developer options)
3. Go to **Settings > Developer options**
4. Enable **USB debugging**
5. Connect phone via USB and accept the prompt

---

## Future updates

To publish a new version:

1. Increment `version` in `app.json` (e.g. "1.0.0" -> "1.1.0")
2. Build:
   ```bash
   eas build --platform android --profile production
   ```
3. Upload:
   ```bash
   eas submit --platform android --latest
   ```

---

## Final checklist

- [ ] Google Play Developer account active
- [ ] Expo account created and logged in
- [ ] `android.package` set in `app.json`
- [ ] `eas build:configure` executed
- [ ] Production build created with `eas build`
- [ ] App created in Play Console
- [ ] Description, screenshots, icon uploaded
- [ ] Content rating completed
- [ ] Privacy policy published and URL added
- [ ] `.aab` uploaded to Play Console
- [ ] Release submitted for review
