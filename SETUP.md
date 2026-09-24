# Setup: make the site editable (free)

The site works right now in **demo mode** (sample content). These steps connect it to your own free Firebase project so you can edit everything from `admin.html`.

Why Firebase and not MongoDB? MongoDB needs a server to run your code and hide its password. Firebase talks to a plain HTML site directly, and the free plan is far more than a school needs.

## 1. Create the project
1. Go to https://console.firebase.google.com and sign in with a Google account.
2. **Add project**, name it (e.g. `bab-rrayan`). You can turn Google Analytics off.
3. Stay on the free **Spark** plan. Never add a card.

## 2. Connect the site
1. In the project, click the **`</>` Web** icon to add a web app. Name it, skip Hosting for now.
2. Firebase shows a `firebaseConfig` block. Copy its values into **`.env`** (see `.env.example`), then run `node build-env.js`.
   (These values are meant to be public. The rules in step 5 protect your data.)

## 3. Create your admin login
1. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
2. **Users → Add user**: your email and a strong password. This is how you log in to `admin.html`.

## 4. Create the database
**Build → Firestore Database → Create database**, choose **production mode**, and a location close to Morocco (`eur3` or `europe-west1`).

## 5. Lock it down (important)
In Firestore, open the **Rules** tab, paste the contents of **`firestore.rules`**, and replace `YOUR_ADMIN_EMAIL@example.com` with the same email as step 3. Click **Publish**.

This means: everyone can read the site content, only your account can change it, and visitors can only *send* visit requests, not read them.

## 6. Put the site online (free)
Pick one:
- **Firebase Hosting** (same project):
  ```
  npm install -g firebase-tools
  firebase login
  firebase init hosting    # public folder: .   single-page app: No   overwrite index.html: No
  firebase deploy
  ```
- **Netlify Drop**: drag the whole folder onto https://app.netlify.com/drop. Then in Firebase **Authentication → Settings → Authorized domains**, add your Netlify domain.

To test on your computer, do not double-click the file. Run `npx serve` in this folder and open `http://localhost:3000` (localhost is already authorized).

## 7. Use the admin
Open `yoursite/admin.html` and sign in.

| Tab | What it does |
|---|---|
| Announcements | Notices in the News section. Pin one to show it in the top bar. |
| Events | Dated events. They disappear on their own after the date. |
| Downloads | PDFs and forms with categories and a download button. |
| Visit requests | Messages sent from the site's form. |
| Page content | Every text on the site: hero, stages, timetable, quotes, Mizmar app section, contact details. Add, remove and reorder items. |

## Get visit requests by email (free)
Requests from the "Request a visit" form are always saved in the admin (**Visit requests** tab). To also receive them by email:
1. Go to https://web3forms.com, type the email that should receive requests, and confirm.
2. They send you an **Access Key**. Paste it in **`.env`** as `WEB3FORMS_KEY=...`, then run `node build-env.js`.
3. In the Web3Forms dashboard, limit the key to your site's domain so nobody else can use it.

The free plan allows about 250 emails a month.

## The .env file
All keys live in **`.env`** (Firebase keys and the email key). A browser cannot read `.env`, so `node build-env.js` copies it into **`env.js`**, the one generated file the website loads. `firebase-config.js` has no keys in it: it just reads them from `env.js`. Never edit `env.js` by hand.

- After changing `.env`, run `node build-env.js` (or `npm start` to build and serve locally, `npm run deploy` to build and deploy).
- `.env` itself is never uploaded (Firebase Hosting ignores it) and is listed in `.gitignore`.
- Be honest about what this protects: once the site is online these keys are visible to anyone who opens the page's source. That is normal for Firebase web keys. Your **Firestore rules** are what protect your data. Never put a password or a private key in `.env`.

## Hosting on Netlify
`.env` is not uploaded, so give Netlify the same values as environment variables. Because `netlify.toml` runs `node build-env.js` at build time, it creates `env.js` from them.
1. Push the folder to GitHub (`.env` and `env.js` are git-ignored) and connect the repo in Netlify. Do **not** use drag-and-drop with `.env` inside the folder: it would be published.
2. Netlify → Site configuration → **Environment variables**: add each line of `.env` (`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, … `WEB3FORMS_KEY`).
3. Netlify may suggest marking some as "secret". You can, or not. These keys end up in the public website either way, so it changes nothing about safety. `netlify.toml` already tells Netlify's scanner to allow them, so the deploy will not fail.
4. In Firebase → Authentication → Settings → **Authorized domains**, add your Netlify domain, or admin login will not work.

## Languages
The site is in Arabic by default, with a switch for French and English (saved in the visitor's browser). Share a French or English link with `?lang=fr` or `?lang=en` at the end of the address.

In the admin every text has three boxes: **AR**, **FR**, **EN**. Arabic is required; if a French or English box is empty, visitors see the Arabic text instead.

## Files (PDF, images)
Firebase Storage is no longer free, so files are added **by link**:
1. Upload the PDF to Google Drive.
2. Right click → **Share → Anyone with the link**.
3. Paste the link in **Downloads**. The site converts it to a direct download automatically.

For campus photos, paste a direct image link (for example from a free Cloudinary account) in **Page content → Campus photos**.

## Free limits (Spark plan)
50,000 reads and 20,000 writes per day, 1 GiB stored. A school site will not come close.
