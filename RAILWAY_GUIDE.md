# RAWAN — Railway par auto-deploy (GitHub push = live update)

Ye setup **sirf ek baar** karna hai. Uske baad har `git push` par Railway khud update kar dega.
MongoDB bhi Railway ke andar hi banta hai (Atlas ki zaroorat nahi).

## Ek baar ka setup (~10 min)
1. https://railway.com → **Login with GitHub**.
2. **New Project → Deploy from GitHub repo → `rawan-final`** select karein. Railway build + deploy shuru kar dega.
3. Same project mein: **+ New → Database → Add MongoDB**.
4. Apni web service kholein → **Variables** → ye add karein:
   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | `${{MongoDB.MONGO_URL}}` (Add Reference se select karein) |
   | `ADMIN_PASSWORD` | apna strong password |
   | `SESSION_SECRET` | koi lambi random line |
5. Service → **Settings → Networking → Generate Domain**. Link milega (e.g. `rawan.up.railway.app`).
6. Check: `https://<link>/api/health` par `"storage":"mongodb"` aana chahiye.
7. Admin: `https://<link>/admin.html`.

## Roz ka kaam (code update)
**GitHub Desktop** mein: changes dikhengi → neeche Summary likhein → **Commit to main** → **Push origin**.
Railway 1-2 minute mein khud naya version live kar deta hai. Data (products, orders, comments, images) MongoDB mein safe rehta hai.

## Zaroori
- Images ab admin se upload karein: wo MongoDB mein save hoti hain, sab ko nazar aati hain.
- `public/images/products` aur `public/images/gallery` ki photos code ke saath push hoti hain.
- Railway free trial ke baad paid (~$5/mahina) hai.

