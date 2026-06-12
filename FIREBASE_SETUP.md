# Firebase setup for Athlete Race

Firebase config is already inserted into `firebase-config.js`.

## What you still need to do in Firebase Console

1. Open Firebase Console → project `athlete-race`.
2. Go to **Build → Realtime Database**.
3. Click **Create Database** if it is not created yet.
4. Start in **test mode** for development.
5. Open **Rules** and paste the content from `database.rules.json`.
6. Open `index.html` through a local server, not just by double-clicking the file.

Example local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Important

The current `databaseURL` is:

```js
https://athlete-race-default-rtdb.firebaseio.com
```

If Firebase shows another URL in **Realtime Database → Data**, copy that exact URL into `firebase-config.js`.
For example, some projects use a regional URL like:

```js
https://athlete-race-default-rtdb.europe-west1.firebasedatabase.app
```

When everything is connected, the chat page will show:

```text
Realtime sync online
```
