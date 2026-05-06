# PropertySmart — Frontend

Next.js 15 (App Router) frontend for the PropertySmart real estate marketplace. Features a premium animated UI built with Framer Motion and Lenis smooth scroll, dark mode, role-based dashboards, Stripe checkout, and a dual-auth strategy that works reliably on both localhost and cross-origin Vercel deployments.

---

## Stack

| | |
|---|---|
| **Framework** | Next.js 15 · React 19 · TypeScript 5 |
| **Styling** | Tailwind CSS v3 · dark mode (`class`) |
| **Animations** | Framer Motion · Lenis smooth scroll |
| **Data fetching** | TanStack Query v5 · Axios |
| **Forms** | react-hook-form · Zod · @hookform/resolvers |
| **Payments** | @stripe/stripe-js · @stripe/react-stripe-js |
| **Charts** | Recharts |
| **Toasts** | react-hot-toast |
| **Icons** | Lucide React |

---

## Setup

### Install

Run from the **repo root** — npm workspaces hoist all dependencies:

```bash
npm install   # from PropertySmart/ root, not from inside this folder
```

### Environment

```bash
cp .env.local.example .env.local
```

```env
# Backend URL — used by axios (baseURL) and next.config.ts (rewrite destination)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe publishable key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Run

```bash
npm run dev          # next dev on :3000
npm run build        # next build (must pass before deploying)
npm run type-check   # tsc --noEmit
npm run lint         # next lint
```

---

## Project Structure

```
src/
├── app/                                  Next.js App Router
│   ├── layout.tsx                        Root layout — ScrollProgressBar + Providers
│   ├── providers.tsx                     QueryClient · Auth · Theme · SmoothScroll · PageTransition
│   ├── globals.css                       Tailwind + global classes (.btn-primary .card etc) + Lenis CSS
│   ├── not-found.tsx                     Custom 404
│   │
│   ├── page.tsx                          Homepage
│   │                                       • Hero: mouse-parallax + floating stat cards + glows
│   │                                       • Browse by Type: stagger grid
│   │                                       • Featured Properties: scroll-triggered stagger
│   │                                       • How It Works: step cards with spring badges
│   │                                       • Testimonials: star pop-in animation
│   │                                       • FAQ: AnimatePresence accordion
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx                Animated login
│   │   │                                   • Floating ambient orbs
│   │   │                                   • Card spring entrance + glow aura
│   │   │                                   • Demo auto-fill buttons (stagger spring)
│   │   │                                   • OAuth buttons with hover lift
│   │   │                                   • Fields slide in sequentially from left
│   │   │                                   • Shimmer sweep submit button
│   │   │                                   • Animated eye toggle (rotate in/out)
│   │   └── register/page.tsx             Animated register
│   │                                       • Same orb/card treatment as login
│   │                                       • Role selector with spring press
│   │                                       • 4 fields stagger in at 70ms intervals
│   │
│   ├── about/page.tsx                    Company page
│   │                                       • WordReveal hero heading (word-by-word)
│   │                                       • CountUp stats (10K+, 5K+, etc.)
│   │                                       • Values cards: icon rotates in from -15°
│   │                                       • Team: 3D mouse-tilt cards, unique gradients
│   │                                       • Timeline: alternating x-slide entrance,
│   │                                         connector lines draw down with scaleY
│   │
│   ├── blog/
│   │   ├── page.tsx                      Blog index
│   │   └── [slug]/page.tsx               Blog post (Server Component)
│   │
│   ├── contact/page.tsx                  Contact form
│   │
│   ├── auth/callback/page.tsx            OAuth return handler
│   │
│   ├── payment/
│   │   ├── page.tsx                      Stripe Elements checkout
│   │   └── success/page.tsx              Post-payment confirmation
│   │
│   ├── properties/
│   │   ├── page.tsx                      Property listing page
│   │   │                                   • Header y-slide entrance
│   │   │                                   • Result count swaps with AnimatePresence
│   │   │                                   • Grid: AnimatePresence mode="wait" between filter changes
│   │   │                                   • Skeleton cards stagger progressively
│   │   │                                   • Empty state emoji floats on loop
│   │   └── [id]/page.tsx                 Property detail page
│   │                                       • Image gallery: AnimatePresence crossfade (scale 1.04→1)
│   │                                       • Thumbnails spring in with stagger
│   │                                       • Price underline draws right-to-left
│   │                                       • Stats row: each pops from scale(0.6) with spring
│   │                                       • Feature tags: CheckCircle + spring stagger
│   │                                       • Reviews: x(-12) slide-in stagger
│   │                                       • Booking button: shimmer sweep
│   │                                       • Sidebar: fadeRight entrance, detail rows stagger
│   │
│   └── dashboard/
│       ├── layout.tsx                    Auth guard + animated sidebar
│       ├── profile/page.tsx              Profile settings + avatar upload (all roles)
│       │
│       ├── buyer/
│       │   ├── page.tsx                  Overview: stat cards + booking activity charts
│       │   ├── bookings/page.tsx         All bookings · 4 stat cards · status filter pills
│       │   │                             with counts · cancel PENDING bookings
│       │   └── favorites/page.tsx        Saved property grid · image · specs · remove button
│       │
│       ├── agent/
│       │   ├── page.tsx                  Overview with tabs: Overview · Properties · Bookings · Analytics
│       │   ├── properties/page.tsx       Listings table · thumbnail · search · status filter
│       │   │                             · edit link · delete with ConfirmDialog
│       │   ├── bookings/page.tsx         4 stat cards · status filter with counts
│       │   │                             · Confirm / Cancel (PENDING) · Mark Complete (CONFIRMED)
│       │   ├── analytics/page.tsx        Views bar chart + bookings pie + conversion stats
│       │   ├── new-property/page.tsx     Create listing: multipart form, image preview
│       │   └── properties/[id]/edit/     Edit listing: pre-filled form, existing images shown
│       │
│       └── admin/
│           ├── page.tsx                  Platform overview with tabs
│           ├── users/page.tsx            User table · 4 stat cards · role filter pills
│           │                             · role dropdown · activate/deactivate
│           ├── properties/               All properties + delete
│           ├── payments/                 Payment history + stats
│           ├── analytics/                Revenue + user growth charts
│           └── settings/                 Platform toggles (UI only)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    Animated navigation
│   │   │   • useScroll + useTransform: background fades transparent→solid over 60px
│   │   │   • Logo slides in from left on mount
│   │   │   • Chevrons rotate 180° (motion.span animate={{ rotate }})
│   │   │   • Dropdowns: AnimatePresence + spring scale from origin corner
│   │   │   • Mobile menu: height + opacity slide with AnimatePresence
│   │   │   • Hamburger/X: icon swaps with 90° spin
│   │   │   • Theme toggle: 15° rotation hover + 0.9 tap scale
│   │   └── Footer.tsx                   Animated footer
│   │       • staggerContainer on whileInView (4 columns)
│   │       • Links: x(+4) spring on hover, dot scales up
│   │       • Social icons: y(-3) scale(1.2) with brand color on hover
│   │       • Logo building rocks on 4s loop
│   │       • Subscribe button: boxShadow glow on hover
│   │
│   ├── property/
│   │   ├── PropertyCard.tsx             Premium property card
│   │   │   • useMotionValue + useSpring: mouse tilt ±6° with perspective 800
│   │   │   • whileHover: y(-6) + blue shadow depth (rgba(37,99,235,0.18))
│   │   │   • Gradient overlay fades in on hover
│   │   │   • Heart button: scale(1.2) hover, scale(0.85) tap
│   │   │   • Respects prefers-reduced-motion completely
│   │   ├── FeaturedProperties.tsx       staggerFast grid on whileInView
│   │   └── PropertyFilters.tsx          Filter bar
│   │
│   └── ui/
│       ├── SmoothScroll.tsx             Lenis root wrapper
│       │   • ReactLenis root, duration 1.2, wheelMultiplier 0.9, autoRaf true
│       │   • LenisFramerSync: dispatches native 'scroll' event so useScroll stays accurate
│       │   • LenisRouteReset: scrollTo(0, immediate) on pathname change
│       │   • Completely skipped (plain div) when prefers-reduced-motion is set
│       │
│       ├── PageTransition.tsx           Route transition
│       │   • AnimatePresence mode="wait" keyed by pathname
│       │   • opacity 0→1, y 12→0 enter; y -8 exit. 280ms ease.
│       │
│       ├── ScrollProgressBar.tsx        Scroll progress indicator
│       │   • Fixed top-0 z-[100]. 3px height.
│       │   • useScroll + useSpring → scaleX from origin-left
│       │   • Gradient: primary-500 → blue-400 → primary-600
│       │
│       ├── AnimatedSection.tsx          Scroll-triggered container
│       │   • Wraps children in motion.div with whileInView
│       │   • stagger?: boolean — uses staggerContainer variant when true
│       │   • once: true, margin: -60px. Falls back to plain div on reduced-motion.
│       │
│       ├── AnimatedItem.tsx             Individual stagger child
│       │   • Inherits variants from parent stagger container
│       │
│       ├── CountUp.tsx                  Animated number counter
│       │   • Pure RAF loop — no dependencies other than React
│       │   • Expo ease-out: 1 - 2^(-10t)
│       │   • Fires once on useInView (once: true, margin: -40px)
│       │   • Props: to · duration · decimals · prefix · suffix
│       │   • Instant value on prefers-reduced-motion
│       │
│       ├── WordReveal.tsx               Word-by-word text reveal
│       │   • Each word wrapped in overflow-hidden, slides from y: 105%
│       │   • Configurable: delay · duration · stagger · once
│       │   • Used on About hero and CTA headings
│       │
│       ├── MagneticButton.tsx           Magnetic cursor effect
│       │   • useMotionValue + useSpring tracks cursor from element center
│       │   • strength prop (default 0.3) — distance of drift
│       │   • Wraps any child element. No-op on reduced-motion.
│       │
│       ├── LoadingSpinner.tsx           Multi-ring spinner
│       │   • Outer ring: clockwise 1s
│       │   • Inner ring: counter-clockwise 0.75s (gyroscope effect)
│       │   • Center dot: scale + opacity pulse 1.2s
│       │   • Sizes: sm (28px) · md (48px) · lg (72px)
│       │   • PageLoader export: full-screen overlay with fade-exit
│       │
│       ├── ConfirmDialog.tsx            Animated confirmation modal
│       │   • Backdrop: rgba(0,0,0,0.5) + blur(2px) fade
│       │   • Click backdrop to dismiss
│       │   • Panel: spring from scale(0.94) y(16)
│       │   • Danger icon: pops in with spring at delay 0.15s
│       │   • Buttons: scale(1.02) hover, scale(0.97) tap
│       │
│       └── Pagination.tsx              Page number controls
│
├── context/
│   └── ThemeContext.tsx                Dark mode
│       • Reads localStorage.theme on mount
│       • Toggles dark class on <html>
│       • Tailwind darkMode: 'class'
│
├── hooks/
│   ├── useAuth.ts                       Auth state management
│   │   • AuthProvider calls GET /auth/me on mount
│   │   • login(): calls API, stores accessToken + refreshToken in TokenStore, sets user
│   │   • register(): same token storage
│   │   • logout(): calls API, TokenStore.clear(), setUser(null)
│   │   • refreshUser(): re-fetches /auth/me (useful after profile update)
│   │
│   └── useProperties.ts                Property data hooks
│       • useProperties(filters)        paginated list
│       • useProperty(id)               single property
│       • useFeaturedProperties()       featured listing
│       • useMyProperties(params)       agent's properties
│       • useCreateProperty()           mutation with cache invalidation
│       • useDeleteProperty()           mutation with cache invalidation
│       • useToggleFavorite()           mutation with cache invalidation
│
└── lib/
    ├── token.ts                         localStorage token store (SSR-safe)
    │   • TokenStore.getAccess() / setAccess() / clearAccess()
    │   • TokenStore.getRefresh() / setRefresh() / clearRefresh()
    │   • TokenStore.clear() — clears both
    │   • All methods are no-ops on SSR (typeof window check)
    │
    ├── axios.ts                         Axios instance + interceptors
    │   • baseURL: NEXT_PUBLIC_API_URL (fallback: http://localhost:5000)
    │   • withCredentials: true (cookie fallback for localhost)
    │   • Request interceptor: reads TokenStore.getAccess(), sets Authorization: Bearer header
    │   • Response 401 interceptor: sends { refreshToken } in body to /auth/refresh,
    │     stores new tokens, replays original request.
    │     On refresh failure: TokenStore.clear(), redirect /login (dashboard routes only)
    │
    ├── api.ts                           Named API objects
    │   • authApi    — register · login · logout · refresh · me
    │   • propertyApi — list · get · featured · create · update · delete
    │   │               myProperties · stats · removeImage
    │   • userApi    — profile · updateProfile · changePassword · uploadAvatar
    │   │               favorites · toggleFavorite · list · updateRole · toggleStatus
    │   • bookingApi — create · myBookings · agentBookings · adminBookings · updateStatus
    │   • paymentApi — createIntent · myPayments · adminPayments · stats
    │   • reviewApi  — list · create · delete
    │
    ├── animations.ts                    Shared Framer Motion variants
    │   • All ease values typed as [number,number,number,number] tuples (TS requirement)
    │   • fadeUp · fadeLeft · fadeRight · fadeIn · scaleIn
    │   • staggerContainer · staggerFast
    │   • backdrop · modalPanel · mobileMenu · dropdownVariants
    │
    └── utils.ts                         Utility functions
        • formatPrice(n)      BDT: ৳5.50 Cr / ৳65.00 Lac / ৳X,XXX
        • formatDate(s)       Long date string
        • formatDateShort(s)  Short date string
        • getStatusColor(s)   Tailwind badge color classes by status string
        • truncate(s, n)      Truncate with ellipsis
        • cn(...classes)      clsx + tailwind-merge
        • TIME_SLOTS          Booking time slot constants
```

---

## Authentication Architecture

### The problem it solves

Vercel deploys frontend and backend on **different domains** (`property-smart-frontend.vercel.app` vs `property-smart-backend.vercel.app`). Modern browsers block third-party cookies across different origins, which caused:

- `GET /auth/me` (called on every page load) silently dropping the session cookie → user appeared logged in, then immediately logged out (the "flicker" bug)
- Stale cookies in the normal browser causing login to fail

### The solution: dual auth

```
Login response body:  { user, accessToken, refreshToken }
                               ↓
useAuth.login()        TokenStore.setAccess(accessToken)
                       TokenStore.setRefresh(refreshToken)
                               ↓
Axios request interceptor  →  Authorization: Bearer <accessToken>  (every request)
                               ↓
Backend authenticate()     reads cookie first, then Authorization header
```

Both channels work:
- **Localhost**: cookies work (Next.js proxy makes it same-origin) + header also set
- **Vercel production**: cookies blocked by browser → header is the reliable path

### Token lifecycle

| Event | Action |
|---|---|
| Login | Store `accessToken` + `refreshToken` in `localStorage` |
| Every request | Axios interceptor attaches `Authorization: Bearer <accessToken>` |
| 401 response | Send `{ refreshToken }` in POST body to `/auth/refresh` |
| Successful refresh | Store new `accessToken` + `refreshToken`, replay original request |
| Failed refresh | `TokenStore.clear()`, redirect to `/login` (dashboard routes only) |
| Logout | Call `/auth/logout`, `TokenStore.clear()`, `setUser(null)` |
| Page reload | `AuthProvider` mounts → axios interceptor attaches stored token → `GET /auth/me` succeeds |

---

## Global CSS Classes

Defined in `globals.css` under `@layer components`. Extend here, not inline:

| Class | Description |
|---|---|
| `.btn-primary` | Blue filled button with focus ring |
| `.btn-secondary` | Outlined button, dark mode aware |
| `.btn-danger` | Red filled button |
| `.input` | Styled form input, dark mode aware |
| `.card` | Rounded border + shadow panel, dark mode aware |
| `.badge` | Small pill label |
| `.section-light` | `bg-gray-50 dark:bg-gray-900` |
| `.section-dark` | `bg-white dark:bg-gray-950` |

> **Important:** Do not use stacked variants like `dark:focus:*` inside `@apply` — Tailwind v3 does not support them in `@layer components`.

---

## Key Patterns

### `useSearchParams` requires Suspense

Any component calling `useSearchParams()` must be wrapped in `<Suspense>`. Violating this causes `next build` to fail with a prerender error:

```tsx
function PageContent() {
  const searchParams = useSearchParams();
  // ...
}
export default function Page() {
  return <Suspense><PageContent /></Suspense>;
}
```

### External images

Always use `<Image>` from `next/image`. Allowed remote patterns in `next.config.ts`:
- `images.unsplash.com`
- `res.cloudinary.com`
- `ui-avatars.com`
- `lh3.googleusercontent.com`
- `avatars.githubusercontent.com`

For `blob:` preview URLs (file upload previews only):
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={URL.createObjectURL(file)} alt="" />
```

### Dark mode

The `ThemeProvider` in `context/ThemeContext.tsx` reads and writes `localStorage.theme` and syncs the `dark` class on `<html>`. Every component should use `dark:` variants instead of JS theme checks.

### Form validation

Use `react-hook-form` + `zod` + `@hookform/resolvers/zod`. The `z.coerce` variants are used for numeric inputs that come from HTML form elements as strings.

### Toasts

`react-hot-toast` — use `toast.success()` / `toast.error()`. Already configured in `providers.tsx` with consistent styling.

### Class merging

```ts
import { cn } from '@/lib/utils';
// cn merges Tailwind classes, resolves conflicts with tailwind-merge
cn('px-4 py-2', condition && 'bg-blue-500', 'text-white')
```

---

## Stripe Integration

```tsx
// 1. POST /api/v1/payments/intent → { clientSecret }
// 2. const stripe = await loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
// 3. <Elements stripe={stripe} options={{ clientSecret }}>
// 4.   <PaymentElement />
//      <button onClick={() => stripe.confirmPayment({ redirect: 'if_required' })} />
// 5. </Elements>
// On success: redirect to /payment/success
```

---

## Next.js Config Notes

- `/api/:path*` rewrites proxy to `${NEXT_PUBLIC_API_URL}/api/:path*` — used as a cookie fallback on localhost
- `images.remotePatterns` — add new image hosts here before using external image URLs
- Build-time env vars (`NEXT_PUBLIC_*`) require a new deployment to take effect

---

## Lenis Smooth Scroll

`SmoothScroll` wraps the entire app at the provider level:

```
Lenis options:
  duration:        1.2      — scroll animation length
  easing:          t => Math.min(1, 1.001 - Math.pow(2, -10 * t))  — expo ease-out
  wheelMultiplier: 0.9      — slightly less than default, prevents floaty feel
  touchMultiplier: 1.8      — responsive touch on mobile
  syncTouch:       false    — native momentum on iOS
  autoRaf:         true     — Lenis manages its own requestAnimationFrame loop
```

**Framer Motion sync** — `LenisFramerSync` dispatches a native `scroll` event on every Lenis tick so `useScroll` (used in Navbar glass effect) reads the correct virtual scroll position.

**Route reset** — `LenisRouteReset` watches `usePathname` and calls `lenis.scrollTo(0, { immediate: true, force: true })` on every navigation.

**Reduced motion** — the entire `ReactLenis` wrapper is skipped; children render directly, native scroll is used.

Using Lenis programmatically in any component:

```tsx
import { useLenis } from '@/components/ui/SmoothScroll';

function BackToTop() {
  const lenis = useLenis();
  return <button onClick={() => lenis?.scrollTo(0, { duration: 1.2 })}>Top</button>;
}
```
