# Implementation Plan: Premium Micro-Interactions

## Overview

This implementation plan breaks down the premium micro-interactions feature into discrete, incremental coding tasks. Each task builds on previous work and includes specific references to requirements and design specifications.

## Tasks

- [ ] 1. Set up animation constants and motion configuration
  - Create reusable spring physics configuration objects
  - Define stamp press transition: `{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }`
  - Define postcard drop transition: `{ type: "spring", stiffness: 220, damping: 14, mass: 0.8 }`
  - Export configurations for consistent reuse across components
  - _Requirements: 1.5, 2.3_

- [ ] 2. Implement stamp press physics for tier cards
  - [ ] 2.1 Wrap tier card elements with motion.div
    - Locate tier card rendering in tiers.map() (around line 887)
    - Wrap each card's outer container with `<motion.div>`
    - Apply whileHover: `{ y: -2, scale: 1.01 }`
    - Apply whileTap: `{ scale: 0.96, rotate: -0.5, y: 2 }`
    - Use stamp press transition configuration
    - Preserve existing onClick handlers and className props
    - _Requirements: 1.1, 1.2, 1.6, 1.8_

  - [ ]* 2.2 Write property test for tier card animation preservation
    - **Property 1: Animation State Preservation**
    - **Validates: Requirements 1.8**
    - Generate random tier card props (onClick, className, children)
    - Verify motion wrapper preserves all original props
    - Verify onClick handler fires correctly after animation
    - Run 100 iterations with fast-check

- [ ] 3. Implement stamp press physics for submit button
  - [ ] 3.1 Wrap submit button with motion.button
    - Locate submit button (around line 1033 "Simulate cozy tea break")
    - Replace `<button>` with `<motion.button>`
    - Apply whileHover: `{ y: -2, scale: 1.01 }`
    - Apply whileTap: `{ scale: 0.96, rotate: -0.5, y: 2 }`
    - Use stamp press transition configuration
    - Preserve existing onClick={handleSendTip} handler
    - _Requirements: 1.3, 1.4, 1.7, 1.8_

  - [ ]* 3.2 Write unit test for submit button interaction
    - Test button onClick fires with motion wrapper
    - Test button disabled state prevents animation
    - Verify form submission logic unchanged
    - _Requirements: 1.8_

- [ ] 4. Checkpoint - Verify stamp press animations
  - Test tier card hover and tap interactions in browser
  - Test submit button hover and tap interactions
  - Verify no layout shifts or visual glitches
  - Ensure all existing click handlers still fire correctly
  - Ask the user if questions arise

- [ ] 5. Implement postcard drop animation
  - [ ] 5.1 Add AnimatePresence wrapper for postcard modal
    - Locate postcard modal rendering (around line 1391 with "postcard-container")
    - Wrap modal container with `<AnimatePresence mode="wait">`
    - Ensure showPostcard state controls visibility
    - _Requirements: 2.4_

  - [ ] 5.2 Apply drop animation to postcard modal
    - Wrap postcard container with `<motion.div>`
    - Set initial: `{ y: "-100vh", opacity: 0, rotate: -6, scale: 0.9 }`
    - Set animate: `{ y: 0, opacity: 1, rotate: -1.5, scale: 1 }`
    - Set exit: `{ opacity: 0, scale: 0.95 }`
    - Use postcard drop transition configuration
    - Preserve existing modal content and close functionality
    - _Requirements: 2.1, 2.2, 2.6, 2.7_

  - [ ]* 5.3 Write property test for modal animation trigger
    - **Property 2: Modal Animation Trigger Consistency**
    - **Validates: Requirements 2.5**
    - Test showPostcard state transitions (false → true)
    - Verify animation triggers exactly once per transition
    - Verify modal content renders correctly after animation
    - Run 100 iterations with fast-check

- [ ] 6. Implement SSR gilded shimmer effect
  - [ ] 6.1 Create CSS keyframe animation for shimmer
    - Add @keyframes gildedFlow to index.css or inline styles
    - Define animation: 0% → 50% → 100% background-position
    - Set animation duration to 4 seconds
    - Set animation timing to ease-in-out
    - Set animation iteration to infinite
    - _Requirements: 3.3_

  - [ ] 6.2 Create shimmer overlay component
    - Create conditional shimmer div inside postcard container
    - Apply absolute positioning with inset-0
    - Set pointer-events-none to avoid blocking interactions
    - Apply linear-gradient: `linear-gradient(90deg, transparent, rgba(254,240,138,0.3) 50%, transparent)`
    - Set background-size: 200% 200%
    - Apply gildedFlow animation
    - _Requirements: 3.4, 3.5, 3.6, 3.7_

  - [ ] 6.3 Add conditional rendering based on rarity
    - Check activePostcard.rarity === 'SSR'
    - Render shimmer overlay only for SSR rarity
    - Ensure SR and COMMON postcards have no shimmer
    - Test with different rarity values
    - _Requirements: 3.1, 3.2, 3.8_

  - [ ]* 6.4 Write property test for SSR shimmer conditional rendering
    - **Property 3: SSR Shimmer Conditional Rendering**
    - **Validates: Requirements 3.1, 3.2, 3.8**
    - Generate random rarity values ('SSR', 'SR', 'COMMON')
    - Verify shimmer renders if and only if rarity === 'SSR'
    - Verify shimmer has correct gradient and animation
    - Run 100 iterations with fast-check

- [ ] 7. Add shimmer effect to mailbox items
  - [ ] 7.1 Apply shimmer to SSR mailbox items
    - Locate mailbox item rendering
    - Add conditional shimmer overlay for items with rarity === 'SSR'
    - Use same shimmer component/styles as postcard modal
    - Ensure consistent visual appearance
    - _Requirements: 3.1, 3.2_

  - [ ]* 7.2 Write unit test for mailbox shimmer rendering
    - Test shimmer renders for SSR mailbox items
    - Test shimmer does not render for SR/COMMON items
    - Verify mailbox item click handlers still work
    - _Requirements: 3.1, 3.2_

- [ ] 8. Checkpoint - Verify all animations working together
  - Test complete user flow: select tier → submit → postcard drops in
  - Test SSR postcard shows shimmer effect
  - Test SR and COMMON postcards have no shimmer
  - Verify all animations feel smooth and physically accurate
  - Ask the user if questions arise

- [ ] 9. Add accessibility and performance optimizations
  - [ ] 9.1 Implement prefers-reduced-motion support
    - Detect prefers-reduced-motion media query
    - Set transition duration to 0 when reduced motion preferred
    - Test with browser accessibility settings
    - _Requirements: 5.5_

  - [ ] 9.2 Verify GPU acceleration
    - Inspect animated properties (should only be transform, opacity)
    - Verify no layout properties (width, height, top, left) animated
    - Check browser DevTools Performance tab for smooth 60fps
    - _Requirements: 5.1, 5.2, 5.7_

  - [ ] 9.3 Preserve keyboard navigation and focus states
    - Test tab navigation through tier cards and submit button
    - Verify focus visible styles still apply
    - Test Enter/Space key activation with animations
    - _Requirements: 5.3, 5.4_

  - [ ]* 9.4 Write property test for data integrity preservation
    - **Property 4: Data Integrity Preservation**
    - **Validates: Requirements 4.3, 4.4, 4.5**
    - Generate random user inputs (name, message, amount)
    - Call getDeterministicHash before and after animation implementation
    - Verify hash results are identical
    - Verify LocalStorage persistence unchanged
    - Run 100 iterations with fast-check

- [ ] 10. Final integration testing and polish
  - [ ]* 10.1 Write end-to-end integration test
    - Test complete payment flow with animations
    - Verify tier selection → submit → postcard drop → shimmer (if SSR)
    - Verify mailbox persistence with animated items
    - _Requirements: All_

  - [ ] 10.2 Cross-browser testing
    - Test in Chrome, Firefox, Safari, Edge
    - Verify animations work consistently
    - Check for any visual glitches or performance issues
    - _Requirements: 5.7_

  - [ ] 10.3 Mobile responsiveness testing
    - Test touch interactions on mobile devices
    - Verify animations scale appropriately
    - Check performance on lower-end devices
    - _Requirements: 5.7_

- [ ] 11. Create scratch-off canvas reveal component
  - [x] 11.1 Create ScratchCard component file
    - Create new component file: src/components/ScratchCard.tsx
    - Define ScratchCardProps interface with imageUrl and onReveal callback
    - Set up component state: isRevealed, isScratching
    - Create canvas ref with useRef<HTMLCanvasElement>
    - _Requirements: 6.1, 6.2_

  - [x] 11.2 Implement canvas initialization
    - Set canvas dimensions to match underlying image element
    - Fill canvas with matte cream color (#F5F5DC)
    - Draw centered text "Scratch to reveal art" in bold sans-serif
    - Set text color to black with proper alignment
    - _Requirements: 6.3, 6.4_

  - [x] 11.3 Implement scratch interaction handlers
    - Add mousedown/touchstart event to set isScratching to true
    - Add mouseup/touchend/mouseleave events to set isScratching to false
    - Add mousemove/touchmove event to handle scratch drawing
    - Calculate cursor position relative to canvas bounds
    - Use globalCompositeOperation 'destination-out' to clear pixels
    - Draw circular brush with 20px radius at cursor position
    - _Requirements: 6.5, 6.6, 6.7_

  - [x] 11.4 Implement reveal percentage calculation
    - Create checkRevealPercentage function
    - Use getImageData to sample all canvas pixels
    - Count pixels with alpha channel === 0 (cleared pixels)
    - Calculate percentage: (clearedPixels / totalPixels) * 100
    - Trigger reveal when percentage > 50%
    - _Requirements: 6.8, 6.9_

  - [x] 11.5 Implement canvas fade-out animation
    - Use Framer Motion animate prop on canvas element
    - Animate opacity from 1 to 0 when isRevealed is true
    - Set transition duration to 400ms
    - Unmount canvas after animation completes
    - Call onReveal callback when reveal triggers
    - _Requirements: 6.10, 6.11_

  - [ ]* 11.6 Write property test for pixel clearing
    - **Property 6: Scratch Canvas Pixel Clearing**
    - **Validates: Requirements 6.6, 6.7**
    - Generate random cursor positions (x, y)
    - Simulate scratch event at each position
    - Verify pixels within brush radius are cleared
    - Run 100 iterations with fast-check

  - [ ]* 11.7 Write property test for reveal threshold
    - **Property 7: Reveal Threshold Trigger**
    - **Validates: Requirements 6.8, 6.9, 6.10, 6.11**
    - Simulate scratching various percentages of canvas
    - Verify fade-out triggers only when > 50% cleared
    - Verify onReveal callback fires exactly once
    - Run 100 iterations with fast-check

  - [ ]* 11.8 Write property test for canvas dimension matching
    - **Property 8: Canvas Dimension Matching**
    - **Validates: Requirements 6.2, 6.12**
    - Generate random image dimensions
    - Verify canvas width/height match image offsetWidth/offsetHeight
    - Run 100 iterations with fast-check

- [x] 12. Integrate ScratchCard into postcard modal
  - [x] 12.1 Import and use ScratchCard component
    - Import ScratchCard component in App.tsx
    - Locate card image container in postcard modal (line ~1425)
    - Replace static img tag with ScratchCard component
    - Pass imageUrl prop: `/assets/card/card_${activePostcard.cardIndex}.jpg`
    - Add onReveal callback to trigger notification
    - _Requirements: 6.13_

  - [x] 12.2 Ensure responsive layout preservation
    - Verify ScratchCard maintains aspect ratio
    - Test on different screen sizes (mobile, tablet, desktop)
    - Ensure dashed border container layout unchanged
    - Verify no overflow or layout shifts
    - _Requirements: 6.12_

  - [ ]* 12.3 Write integration test for scratch-off in modal
    - Test ScratchCard renders in postcard modal
    - Test scratch interaction reveals card image
    - Test notification triggers on reveal
    - Verify modal close functionality still works
    - _Requirements: 6.13_

- [x] 13. Checkpoint - Verify scratch-off feature
  - Test scratch interaction with mouse on desktop
  - Test touch interaction on mobile/tablet
  - Verify 50% threshold triggers reveal correctly
  - Verify canvas fades out smoothly
  - Verify underlying card image displays correctly
  - Ask the user if questions arise

- [ ] 14. Final checkpoint - Complete feature verification
  - All animations implemented and working smoothly
  - Scratch-off canvas working on all devices
  - All tests passing (unit + property + integration)
  - No regressions in existing functionality
  - Performance metrics acceptable (>30fps)
  - Accessibility requirements met
  - Ask the user for final approval

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Animation physics parameters are precisely tuned for tactile feedback
- All existing business logic (Base58 hash, LocalStorage, rarity calculation) remains unchanged

