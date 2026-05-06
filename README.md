# PropertySmart — Frontend

Next.js 15 (App Router) frontend for the PropertySmart real estate marketplace. Features a premium animated UI with Framer Motion, Lenis smooth scroll, dark mode, role-based dashboards, Stripe checkout, and full TypeScript coverage.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 · React 19 · TypeScript 5 |
| Styling | Tailwind CSS v3 · dark mode (`class`) |
| Animations | Framer Motion · Lenis smooth scroll |
| Data fetching | TanStack Query v5 · Axios |
| Forms | react-hook-form · Zod · @hookform/resolvers |
| Payments | Stripe.js · @stripe/react-stripe-js |
| Charts | Recharts |
| Toasts | react-hot-toast |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── app/                          Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx        Animated login with demo account auto-fill
│   │   └── register/page.tsx     Animated registration with role selector
│   ├── about/page.tsx            Company page with WordReveal + CountUp + team 3D cards
│   ├── auth/callback/page.tsx    OAuth return handler
│   ├── blog/                     Blog index + [slug] detail
│   ├── contact/page.tsx          Contact form
│   ├── dashboard/
│   │   ├── layout.tsx            Auth guard + animated sidebar
│   │   ├── admin/
│   │   │   ├── page.tsx          Admin overview (stats, charts, users, payments tabs)
│   │   │   ├── users/page.tsx    User management table with role/status controls
│   │   │   ├── properties/       All properties + delete
│   │   │   ├── payments/         Payment history + stats
│   │   │   ├── analytics/        Revenue + user growth charts
│   │   │   └── settings/         Platform toggles (UI only)
│   │   ├── agent/
│   │   │   ├── page.tsx          Agent overview + analytics tabs
│   │   │   ├── properties/page.tsx  My listings table (edit/delete)
│   │   │   ├── bookings/page.tsx    Booking management (confirm/complete/cancel)
│   │   │   ├── analytics/page.tsx   Views + bookings charts
│   │   │   ├── new-property/        Create listing form
│   │   │   └── properties/[id]/edit Edit listing form
│   │   ├── buyer/
│   │   │   ├── page.tsx          Buyer overview + charts
│   │   │   ├── bookings/page.tsx All bookings with cancel
│   │   │   └── favorites/page.tsx Saved property grid
│   │   └── profile/page.tsx      Profile settings + avatar upload
│   ├── payment/
│   │   ├── page.tsx              Stripe Elements checkout
│   │   └── success/page.tsx      Post-payment confirmation
│   ├── properties/
│   │   ├── page.tsx              Listing grid with filters + AnimatePresence transitions
│   │   └── [id]/page.tsx         Detail — gallery crossfade, stat springs, booking form
│   ├── globals.css               Tailwind + global classes + Lenis CSS
│   ├── layout.tsx                Root layout — ScrollProgressBar + Providers
│   └── providers.tsx             TanStack Query + Auth + Theme + SmoothScroll + PageTransition
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            Scroll-glass nav, animated dropdowns, mobile slide menu
│   │   └── Footer.tsx            Stagger reveal, social hover, newsletter
│   ├── property/
│   │   ├── PropertyCard.tsx      3D mouse-tilt, hover lift, shadow depth
│   │   ├── FeaturedProperties.tsx Stagger grid on scroll
│   │   └── PropertyFilters.tsx   Filter controls
│   └── ui/
│       ├── AnimatedSection.tsx   whileInView scroll trigger (respects reduced-motion)
│       ├── CountUp.tsx           RAF-based number animation with expo ease
│       ├── WordReveal.tsx        Per-word clip reveal with stagger
│       ├── MagneticButton.tsx    Cursor-tracking magnetic drift
│       ├── ScrollProgressBar.tsx Fixed gradient bar driven by useScroll + useSpring
│       ├── SmoothScroll.tsx      Lenis root wrapper + Framer sync + route reset
│       ├── PageTransition.tsx    AnimatePresence fade+slide on route change
│       ├── LoadingSpinner.tsx    Dual counter-rotating rings + pulsing dot
│       ├── ConfirmDialog.tsx     Animated modal (backdrop + spring panel)
│       ├── Pagination.tsx        Page controls
│       └── [dashboard pages...]
│
├── context/
│   └── ThemeContext.tsx          Dark mode toggle — reads/writes localStorage
│
├── hooks/
│   ├── useAuth.ts                Auth state + login/logout/register/refreshUser
│   └── useProperties.ts         useProperties · useProperty · useFeaturedProperties
│                                useMyProperties · useCreateProperty · useToggleFavorite
│
├── lib/
│   ├── animations.ts            Shared Framer Motion variants (fadeUp, stagger, modal, etc.)
│   ├── api.ts                   Named API objects: authApi propertyApi userApi bookingApi
│                                paymentApi reviewApi
│   ├── axios.ts                 Axios instance — baseURL from NEXT_PUBLIC_API_URL,
│                                withCredentials, 401 refresh interceptor
│   └── utils.ts                 formatPrice · formatDate · getStatusColor · cn
│                                truncate · TIME_SLOTS
│
└── types/
    └── index.ts                 User · Property · Booking · Payment · Review
                                 PropertyFilters · ApiResponse · PaginatedResponse
```

---

## Setup

### 1 — Install

```bash
# From repo root (npm workspaces hoist everything)
npm install
```

### 2 — Environment

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3 — Run

```bash
npm run dev        # next dev on :3000
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | `next dev` — development server |
| `npm run build` | `next build` — production build |
| `npm run type-check` | `tsc --noEmit` — type check without emit |
| `npm run lint` | `next lint` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL. Used by `axios.ts` (baseURL) and `next.config.ts` (rewrite destination) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |

---

## Architecture Notes

### Data fetching

All data fetching is **client-side only** — Server Components render shells and Client Components use TanStack Query. There are no `fetch()` calls in Server Components.

### Auth flow

1. `AuthProvider` calls `GET /api/v1/auth/me` on mount
2. `useAuth()` exposes `{ user, loading, login, register, logout, refreshUser }`
3. `login()` returns the `User` object so the caller can redirect by role
4. 401 responses trigger a silent refresh attempt via `POST /api/v1/auth/refresh`; if that also fails and the user is on a `/dashboard/*` route, they're redirected to `/login`

### API proxy

`next.config.ts` rewrites `/api/:path*` → `${NEXT_PUBLIC_API_URL}/api/:path*`. This makes API calls same-origin from the browser's perspective, but Axios uses the backend URL as `baseURL` so requests go direct — CORS + `sameSite: 'none'` cookies handle the cross-origin case in production.

### Dark mode

`ThemeProvider` reads `localStorage.theme` on mount and toggles the `dark` class on `<html>`. The Tailwind config uses `darkMode: 'class'`.

Do **not** use stacked variants like `dark:focus:*` inside `@apply` — Tailwind v3 doesn't support them in `@layer components`.

### `useSearchParams` + Suspense

Any component calling `useSearchParams()` must be wrapped in `<Suspense>`. Violating this fails `next build` with a prerender error.

---

## Animation System

### Smooth scroll — Lenis

`SmoothScroll` (`src/components/ui/SmoothScroll.tsx`) wraps the entire app:

```tsx
<ReactLenis root options={{ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9 }}>
  <LenisFramerSync />   {/* dispatches native scroll event so useScroll stays in sync */}
  <LenisRouteReset />   {/* scrollTo(0, immediate) on pathname change */}
  {children}
</ReactLenis>
```

If `prefers-reduced-motion` is set, `SmoothScroll` renders children directly with no Lenis instance.

### Shared variants — `src/lib/animations.ts`

```ts
fadeUp          // opacity 0→1, y 28→0
fadeLeft        // opacity 0→1, x -32→0
fadeRight       // opacity 0→1, x 32→0
scaleIn         // opacity 0→1, scale 0.92→1
staggerContainer // staggerChildren: 0.1
staggerFast     // staggerChildren: 0.06
backdrop        // modal overlay fade
modalPanel      // spring scale+y entrance
mobileMenu      // height + opacity slide
dropdownVariants // spring scale from origin
```

All `ease` values are typed as `[number, number, number, number]` tuples — required by Framer Motion's TypeScript types.

### PropertyCard — 3D tilt

```tsx
// useMotionValue tracks normalized mouse position within the card (-0.5 to 0.5)
// useSpring smooths to rotateX/rotateY ±6° with perspective: 800
// whileHover lifts y:-6 with a blue-tinted box-shadow
// MouseLeave springs back to 0,0
```

### Key animation components

| Component | Effect |
|---|---|
| `ScrollProgressBar` | `useScroll` scaleX + gradient — global page progress |
| `PageTransition` | `AnimatePresence` fade+slide on every route change |
| `WordReveal` | Each word in `overflow-hidden`, slides up from `y: 105%` |
| `CountUp` | RAF loop with expo-ease-out; fires once on `useInView` |
| `MagneticButton` | `useMotionValue + useSpring` floats toward cursor |
| `LoadingSpinner` | Outer ring CW, inner ring CCW, center dot pulse |
| `ConfirmDialog` | Backdrop fade + panel spring from `scale(0.94) y(16)` |

---

## Routing — Dashboard Guard

`dashboard/layout.tsx` shows a spinner while `loading` is true; redirects to `/login` only when `!loading && !user`. The sidebar `isActive()` uses exact match for overview routes (`/dashboard/admin`, `/dashboard/agent`, `/dashboard/buyer`) so sub-routes don't keep the overview item highlighted.

---

## Stripe Integration

```tsx
// 1. Call POST /api/v1/payments/intent → { clientSecret }
// 2. loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
// 3. Wrap form in <Elements stripe={...} options={{ clientSecret }}>
// 4. Use <PaymentElement /> inside the form
// 5. stripe.confirmPayment({ redirect: 'if_required' }) → /payment/success
```

---

## Image Handling

- Always use `<Image>` from `next/image` for external URLs
- Allowed remote patterns: `images.unsplash.com` · `res.cloudinary.com` · `ui-avatars.com` · `lh3.googleusercontent.com` · `avatars.githubusercontent.com`
- For `blob:` preview URLs (file upload previews), use `<img>` with the ESLint disable comment:
  ```tsx
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src={URL.createObjectURL(file)} alt="" />
  ```
- Add new external image hosts to `images.remotePatterns` in `next.config.ts`

---

## Global CSS Classes

Defined in `globals.css` under `@layer components` — extend here, not inline:

| Class | Description |
|---|---|
| `.btn-primary` | Blue filled button |
| `.btn-secondary` | Outlined button |
| `.btn-danger` | Red filled button |
| `.input` | Styled form input |
| `.card` | Rounded border + shadow panel |
| `.badge` | Pill label |

---

## Utility Functions — `src/lib/utils.ts`

| Function | Description |
|---|---|
| `formatPrice(n)` | BDT: `৳5.50 Cr` / `৳65.00 Lac` / `৳X,XXX` |
| `formatDate(s)` | Long date string |
| `formatDateShort(s)` | Short date string |
| `getStatusColor(status)` | Tailwind badge color classes |
| `truncate(s, n)` | Truncate with ellipsis |
| `cn(...classes)` | `clsx` + `tailwind-merge` |
| `TIME_SLOTS` | Array of booking time slots |
