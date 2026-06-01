# Requirements Document

## Introduction

This specification defines the requirements for implementing four premium, tactile micro-interactions in the SoftPay React application. The goal is to enhance the user interface with physical, paper-like interactions that match the minimalist Japandi/Notion aesthetic while maintaining the existing Base58 deterministic hashing and LocalStorage persistence architecture. The fourth interaction adds a gamified scratch-off reveal mechanic for the blind box card system.

## Glossary

- **System**: The SoftPay React application frontend
- **Tier_Card**: The three payment tier selection cards ($1 Green Tea Cup, $3 Chiffon Cake, $5 Lo-fi Record)
- **Submit_Button**: The main action button labeled "Simulate cozy tea break"
- **Postcard_Modal**: The generative receipt postcard display container
- **Card_Image_Container**: The dashed border container displaying the blind box card image (line ~1425-1430 in App.tsx)
- **Scratch_Canvas**: HTML5 Canvas element overlaying the card image for scratch-off interaction
- **SSR_Rarity**: Super Super Rare rarity tier (10% probability)
- **SR_Rarity**: Super Rare rarity tier (30% probability)
- **COMMON_Rarity**: Common rarity tier (60% probability)
- **Framer_Motion**: The animation library used for micro-interactions
- **Tailwind_v4**: The CSS framework used for styling
- **ActivePostcardData**: TypeScript interface for postcard data structure
- **MailboxItem**: TypeScript interface for mailbox collection items
- **Base58_Hash**: Deterministic hash generation system for transaction signatures

## Requirements

### Requirement 1: Tactile Stamp Press Physics

**User Story:** As a user, I want to feel tactile, physical feedback when interacting with tier cards and action buttons, so that the interface feels tangible and satisfying like pressing a real ink stamp.

#### Acceptance Criteria

1. WHEN a user hovers over a Tier_Card, THE System SHALL apply a subtle lift animation with y: -2 and scale: 1.01
2. WHEN a user taps/clicks a Tier_Card, THE System SHALL apply a press-down animation with scale: 0.96, rotate: -0.5, and y: 2
3. WHEN a user hovers over the Submit_Button, THE System SHALL apply a subtle lift animation with y: -2 and scale: 1.01
4. WHEN a user taps/clicks the Submit_Button, THE System SHALL apply a press-down animation with scale: 0.96, rotate: -0.5, and y: 2
5. THE System SHALL use spring physics with stiffness: 500, damping: 15, and mass: 0.5 for all stamp press animations
6. THE System SHALL wrap Tier_Card elements in Framer Motion motion.div components
7. THE System SHALL wrap the Submit_Button in a Framer Motion motion.button component
8. THE System SHALL maintain existing onClick handlers and business logic without disruption

### Requirement 2: Gravity Drop & Postcard Wobble Ingress

**User Story:** As a user, I want to see the receipt postcard drop into view with realistic physics, so that it feels like a physical card being delivered into a mailbox.

#### Acceptance Criteria

1. WHEN the payment completes and Postcard_Modal triggers, THE System SHALL animate the modal from initial state y: "-100vh", opacity: 0, rotate: -6, scale: 0.9
2. WHEN the Postcard_Modal animates in, THE System SHALL transition to final state y: 0, opacity: 1, rotate: -1.5, scale: 1
3. THE System SHALL use elastic spring physics with stiffness: 220, damping: 14, and mass: 0.8 for the drop animation
4. THE System SHALL wrap the Postcard_Modal container with AnimatePresence from Framer Motion
5. THE System SHALL apply the drop animation only when showPostcard state transitions from false to true
6. THE System SHALL maintain the existing postcard content and data structure without modification
7. THE System SHALL preserve the existing modal close functionality

### Requirement 3: SSR Gilded Shimmer Reflection

**User Story:** As a user, I want to see a subtle gold shimmer effect on SSR rarity postcards, so that limited edition items feel premium and special without being garish.

#### Acceptance Criteria

1. WHEN the deterministic rarity calculation results in SSR_Rarity, THE System SHALL apply a gilded shimmer animation to the Postcard_Modal border
2. WHEN the deterministic rarity calculation results in SR_Rarity or COMMON_Rarity, THE System SHALL NOT apply any shimmer animation
3. THE System SHALL create a keyframe animation named "gildedFlow" with background-position transitions: 0% 50% → 100% 50% → 0% 50%
4. THE System SHALL apply a linear gradient overlay: linear-gradient(90deg, transparent, rgba(254,240,138,0.3) 50%, transparent)
5. THE System SHALL set background-size to 200% 200% for the shimmer effect
6. THE System SHALL animate the shimmer with a 4-second duration and infinite loop
7. THE System SHALL apply the shimmer to the outer border container of the Postcard_Modal
8. THE System SHALL conditionally render the shimmer based on activePostcard.rarity === 'SSR'
9. THE System SHALL maintain the existing rarity calculation logic from calculateRarity function
10. THE System SHALL preserve the existing SSR, SR, and COMMON badge styling

### Requirement 4: Type Safety and Data Integrity

**User Story:** As a developer, I want all micro-interactions to maintain type safety and data integrity, so that the existing Base58 hash system and LocalStorage persistence remain functional.

#### Acceptance Criteria

1. THE System SHALL maintain the existing ActivePostcardData interface structure
2. THE System SHALL maintain the existing MailboxItem interface structure
3. THE System SHALL preserve the getDeterministicHash function logic
4. THE System SHALL preserve the calculateRarity function logic
5. THE System SHALL maintain LocalStorage synchronization for mailbox array
6. THE System SHALL ensure all Framer Motion components accept existing props and handlers
7. THE System SHALL maintain TypeScript strict mode compliance
8. THE System SHALL preserve all existing state management hooks

### Requirement 5: Performance and Accessibility

**User Story:** As a user, I want smooth animations that don't impact performance or accessibility, so that the interface remains responsive and usable.

#### Acceptance Criteria

1. THE System SHALL use GPU-accelerated CSS properties (transform, opacity) for all animations
2. THE System SHALL avoid animating layout-triggering properties (width, height, top, left)
3. THE System SHALL maintain existing keyboard navigation functionality
4. THE System SHALL preserve existing focus states on interactive elements
5. THE System SHALL ensure animations respect prefers-reduced-motion media query
6. THE System SHALL maintain existing ARIA labels and accessibility attributes
7. THE System SHALL ensure animation frame rates remain above 30fps on standard devices

### Requirement 6: Interactive Scratch-off Canvas Reveal

**User Story:** As a user, I want to scratch off a cover layer to reveal the blind box card art, so that the card reveal experience feels gamified and engaging like a physical scratch card.

#### Acceptance Criteria

1. WHEN the Postcard_Modal displays a card image, THE System SHALL render a Scratch_Canvas element positioned absolutely on top of the Card_Image_Container
2. THE Scratch_Canvas SHALL match the exact dimensions of the underlying card image element
3. THE System SHALL fill the Scratch_Canvas with a soft matte cream color (#F5F5DC) or pastel gray (#E5E5E5) matching the style guide
4. THE System SHALL render centered text "Scratch to reveal art" on the Scratch_Canvas in a minimalist font style
5. WHEN a user performs a mouse down event on the Scratch_Canvas, THE System SHALL begin tracking mouse movement
6. WHEN a user drags the mouse across the Scratch_Canvas, THE System SHALL clear pixels in a circular brush pattern at the cursor position
7. WHEN a user performs touch events on mobile devices, THE System SHALL respond identically to mouse events for scratch interaction
8. THE System SHALL continuously calculate the percentage of cleared pixels on the Scratch_Canvas
9. WHEN the cleared pixel percentage exceeds 50%, THE System SHALL trigger a fade-out animation on the Scratch_Canvas
10. THE System SHALL use Framer Motion or CSS transition with opacity: 0 and duration: 400ms for the fade-out animation
11. WHEN the fade-out animation completes, THE System SHALL unmount the Scratch_Canvas element completely
12. THE System SHALL maintain responsive layout without stretching or breaking the card image alignment
13. THE System SHALL preserve the existing dashed border styling on the Card_Image_Container
14. THE System SHALL set pointer-events: none on the Scratch_Canvas after the 50% threshold is reached
