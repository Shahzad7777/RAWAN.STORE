# RAWAN Footwear — Internet par Live karne ka Guide

Kharcha: **sirf domain** (~Rs. 3,000–4,000/saal). Baqi sab free hai: GitHub, Render, MongoDB Atlas.

---

## Step 1 — MongoDB Atlas (free database) · ~10 min
Yahan products, orders aur customers hamesha ke liye save rahenge.

1. https://www.mongodb.com/cloud/atlas/register par sign up karein.
2. **Create a cluster** → **M0 FREE** → region: Mumbai ya Singapore → Create.
3. **Database Access** → Add New Database User → username `rawan`, ek strong password (yaad rakhein).
4. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
5. **Database** → **Connect** → **Drivers** → connection string copy karein:
   ```
   mongodb+srv://rawan:<password>@cluster0.xxxxx.mongodb.net/rawan?retryWrites=true&w=majority
   ```
   `<password>` ki jagah apna password likhein, aur `.net/` ke baad `rawan` likhna zaroori hai.

## Step 2 — GitHub par code upload · ~5 min
1. https://github.com/new → Repository name: `rawan-final` → **Private** → Create.
2. Is folder mein terminal kholein aur ye chalayein:
   ```
   git branch -M main
   git remote add origin https://github.com/Shahzad7777/rawan-final.git
   git push -u origin main
   ```

## Step 3 — Render par website chalayein · ~10 min
1. https://render.com par **GitHub se sign up** karein.
2. **New +** → **Web Service** → `rawan-final` repo select karein.
3. Settings:
   | Field | Value |
   |---|---|
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
   | Instance Type | **Free** |
4. **Environment Variables** add karein:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Step 1 wali connection string |
   | `ADMIN_PASSWORD` | apna strong admin password |
   | `SESSION_SECRET` | koi bhi lambi random line (30+ characters) |
5. **Create Web Service**. 2–4 minute baad link milega: `https://rawan-final.onrender.com`.
6. Check karein: `https://rawan-final.onrender.com/api/health` par `"storage":"mongodb"` likha aana chahiye.

## Step 4 — Apna domain lagayein · ~15 min (+ DNS ka intezar)
1. Domain khareedein (Namecheap, GoDaddy, ya PKNIC `.pk`).
2. Render → aapki service → **Settings → Custom Domains** → `rawanfootwear.com` aur `www.rawanfootwear.com` add karein.
3. Render jo DNS records dikhaye (CNAME / A record), wo domain ki DNS settings mein daal dein.
4. SSL (https) Render khud free mein laga deta hai. DNS update hone mein 10 minute se 24 ghante lag sakte hain.

## Step 5 — Admin setup (pehli baar)
`https://aapka-domain.com/admin.html` → username `admin` + Step 3 wala password.

1. **Store Settings**: WhatsApp number, bank details (Account Title / IBAN), delivery charges.
2. **Products**: naye items add karein (photos, price, sizes, stock). Demo products edit ya delete kar dein.
3. **Elite Members**: Founding limit (default 20) aur Elite Access Charge (default Rs. 500 per Executive pair).

---

## Elite Membership kaise kaam karti hai
- Pehle **20 customers** (phone number se pehchane jate hain) pehle order par khud-ba-khud **Founding Elite** ban jate hain. Ye membership free aur hamesha ke liye hai.
- Founding spots khatam hone ke baad non-members ko **har Executive pair par Elite Access Charge** dena hota hai.
- Elite members (Founding ya admin ka banaya VIP) se ye charge kabhi nahi liya jata.
- Admin → Elite Members panel se aap kisi bhi customer ko VIP bana sakte hain ya hata sakte hain.

## Zaroori baatein
> **Render free plan:** 15 minute tak koi visitor na aaye to server so jata hai. Agla visitor aaye to pehli dafa page khulne mein ~30–50 second lagte hain. Isse bachne ke liye https://uptimerobot.com (free) par har 5 minute ka monitor `https://aapka-domain.com/api/health` par laga dein. Ya Render ka paid plan ($7/mahina) le lein.

- `MONGODB_URI` ke baghair Render par sara data restart pe mit jayega. Isliye Step 1 lazmi hai.
- Code update karne ke liye: `git add . && git commit -m "update" && git push`. Render khud dobara deploy kar dega.

## Local chalana (apne computer par)
```
npm install
node server.js
```
Phir browser mein http://localhost:5000 kholein. `MONGODB_URI` set na ho to data `data/` folder mein save hota hai.
