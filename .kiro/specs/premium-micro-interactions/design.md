# Design Document: Premium Micro-Interactions

## Overview

This design document specifies the implementation of four premium, tactile micro-interactions for the SoftPay React application. The interactions are designed to create a physical, paper-like feel that matches the minimalist Japandi/Notion aesthetic while maintaining all existing business logic and data integrity. The fourth interaction adds an HTML5 Canvas-based scratch-off reveal mechanic for the blind box card system.

## Architecture

### Technology Stack
- **Animation Library**: Framer Motion (motion/react)
- **Styling Framework**: Tailwind CSS v4
- **Component Pattern**: Wrapper-based enhancement (non-invasive)
- **State Management**: Existing React hooks (no changes)

### Design Principles
1. **Non-Invasive Enhancement**: Wrap existing elements without modifying their internal logic
2. **GPU-Accelerated**: Use only transform and opacity properties
3. **Physically Accurate**: Spring physics parameters tuned for realistic tactile feedback
4. **Conditional Rendering**: SSR shimmer effect only when rarity === 'SSR'
5. **Type Safety**: Maintain all existing TypeScript interfaces

## Components and Interfaces

### 1. Stamp Press Motion Wrapper

**Target Elements:**
- Three tier selection cards (lines ~887-950 in App.tsx)
- Submit button (lines ~1033-1040 in App.tsx)

**Implementation Pattern:**
```tsx
<motion.div
  whileHover={{ y: -2, scale: 1.01 }}
  whileTap={{ scale: 0.96, rotate: -0.5, y: 2 }}
  transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.5 }}
>
  {/* Existing card/button content */}
</motion.div>
```

**Physics Rationale:**
- **High stiffness (500)**: Creates snappy, responsive feedback
- **Low damping (15)**: Allows slight bounce without floatiness
- **Low mass (0.5)**: Quick response to user input
- **Rotation (-0.5deg)**: Mimics physical stamp tilt on press

### 2. Postcard Drop Animation

**Target Element:**
- Postcard modal container (line ~1391 with class "postcard-container")

**Implementation Pattern:**
```tsx
<AnimatePresence mode="wait">
  {showPostcard && (
    <motion.div
      initial={{ y: "-100vh", opacity: 0, rotate: -6, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, rotate: -1.5, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 220, damping: 14, mass: 0.8 }}
    >
      {/* Existing postcard modal content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Physics Rationale:**
- **Medium stiffness (220)**: Elastic bounce on landing
- **Low damping (14)**: Visible oscillation for "paper card" feel
- **Higher mass (0.8)**: Heavier object with momentum
- **Initial rotation (-6deg)**: Card tumbling through air
- **Final rotation (-1.5deg)**: Settled at slight angle

### 3. SSR Gilded Shimmer Effect

**Target Elements:**
- Postcard modal border (when rarity === 'SSR')
- Mailbox item borders (when item.rarity === 'SSR')

**CSS Keyframe Animation:**
```css
@keyframes gildedFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

**Implementation Pattern:**
```tsx
<div
  className={`
    postcard-container 
    ${activePostcard.rarity === 'SSR' ? 'relative' : ''}
  `}
>
  {activePostcard.rarity === 'SSR' && (
    <div
      className="absolute inset-0 pointer-events-none rounded-xl"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(254,240,138,0.3) 50%, transparent)',
        backgroundSize: '200% 200%',
        animation: 'gildedFlow 4s ease-in-out infinite',
      }}
    />
  )}
  {/* Existing postcard content */}
</div>
```

**Visual Design Rationale:**
- **Subtle opacity (0.3)**: Elegant, not garish
- **Slow animation (4s)**: Sophisticated, wandering reflection
- **Gold color (254,240,138)**: Warm, premium metallic tone
- **Gradient spread (200%)**: Smooth transition across surface

### 4. Scratch-off Canvas Reveal Component

**Target Element:**
- Card image container within postcard modal (line ~1425-1430 in App.tsx)
- Dashed border container with id="blindBoxCard"

**Component Architecture:**
```tsx
interface ScratchCardProps {
  imageUrl: string;
  onReveal?: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ imageUrl, onReveal }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  
  // Canvas initialization, event handlers, pixel tracking
  // ...
  
  return (
    <div className="relative w-full">
      <img src={imageUrl} alt="Card" className="w-full h-auto" />
      {!isRevealed && (
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-pointer"
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
};
```

**Canvas Initialization:**
```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Set canvas dimensions to match image
  const img = canvas.previousElementSibling as HTMLImageElement;
  canvas.width = img.offsetWidth;
  canvas.height = img.offsetHeight;
  
  // Fill with matte cream color
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw centered text
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Scratch to reveal art', canvas.width / 2, canvas.height / 2);
}, []);
```

**Scratch Interaction Logic:**
```typescript
const handleScratch = (e: MouseEvent | TouchEvent) => {
  if (!isScratching) return;
  
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
  const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
  
  // Clear circular area (brush effect)
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
  
  // Check reveal percentage
  checkRevealPercentage();
};

const checkRevealPercentage = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  
  let clearedPixels = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) clearedPixels++;
  }
  
  const percentage = (clearedPixels / (pixels.length / 4)) * 100;
  
  if (percentage > 50) {
    setIsRevealed(true);
    onReveal?.();
  }
};
```

**Event Handler Setup:**
```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || isRevealed) return;
  
  const handleStart = () => setIsScratching(true);
  const handleEnd = () => setIsScratching(false);
  
  // Mouse events
  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mousemove', handleScratch);
  canvas.addEventListener('mouseleave', handleEnd);
  
  // Touch events
  canvas.addEventListener('touchstart', handleStart);
  canvas.addEventListener('touchend', handleEnd);
  canvas.addEventListener('touchmove', handleScratch);
  
  return () => {
    canvas.removeEventListener('mousedown', handleStart);
    canvas.removeEventListener('mouseup', handleEnd);
    canvas.removeEventListener('mousemove', handleScratch);
    canvas.removeEventListener('mouseleave', handleEnd);
    canvas.removeEventListener('touchstart', handleStart);
    canvas.removeEventListener('touchend', handleEnd);
    canvas.removeEventListener('touchmove', handleScratch);
  };
}, [isScratching, isRevealed]);
```

**Integration Pattern:**
```tsx
// In App.tsx postcard modal (line ~1425)
<div className="py-4 flex items-center justify-center relative">
  <ScratchCard
    imageUrl={`/assets/card/card_${activePostcard.cardIndex}.jpg`}
    onReveal={() => triggerNotification("🎨 Card art revealed!")}
  />
</div>
```

**Design Rationale:**
- **Absolute positioning**: Canvas overlays image without affecting layout
- **Circular brush (20px radius)**: Natural scratch pattern, not too small or large
- **50% threshold**: Balanced between too easy and too tedious
- **Matte cream (#F5F5DC)**: Matches paper-like aesthetic
- **Framer Motion fade**: Smooth 400ms transition feels polished
- **Touch support**: Essential for mobile gamification experience
- **Pixel sampling**: Efficient alpha channel check for reveal percentage

## Data Models

### Existing Interfaces (Preserved)

```typescript
interface ActivePostcardData {
  theme: SeededPostcardTheme;
  txHash: string;
  fanName: string;
  fanMessage: string;
  healingWord: string;
  amount: number;
  timestamp: string;
  cardIndex: number;
  rarity: "SSR" | "SR" | "COMMON";
}

interface MailboxItem {
  id: string;
  name: string;
  message: string;
  amount: number;
  txHash: string;
  themeIndex: number;
  healingWord: string;
  timestamp: string;
  cardIndex: number;
  rarity: "SSR" | "SR" | "COMMON";
}
```

**No modifications required** - animations are purely presentational.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Animation State Preservation
*For any* tier card or submit button, applying stamp press animations should not modify the element's onClick handler, selected state, or any business logic state variables.

**Validates: Requirements 1.8**

### Property 2: Modal Animation Trigger Consistency
*For any* state transition where showPostcard changes from false to true, the postcard modal should animate from the initial drop state (y: "-100vh") to the final settled state (y: 0) exactly once per transition.

**Validates: Requirements 2.5**

### Property 3: SSR Shimmer Conditional Rendering
*For any* postcard or mailbox item, the gilded shimmer effect should be visible if and only if the rarity property equals 'SSR'.

**Validates: Requirements 3.1, 3.2, 3.8**

### Property 4: Data Integrity Preservation
*For any* animation applied to interactive elements, the Base58 hash generation (getDeterministicHash), rarity calculation (calculateRarity), and LocalStorage persistence should produce identical results before and after animation implementation.

**Validates: Requirements 4.3, 4.4, 4.5**

### Property 5: GPU Acceleration Compliance
*For all* animations, only CSS properties that trigger GPU acceleration (transform, opacity, filter) should be animated, never layout properties (width, height, top, left, margin, padding).

**Validates: Requirements 5.1, 5.2**

### Property 6: Scratch Canvas Pixel Clearing
*For any* mouse or touch drag event on the Scratch_Canvas, pixels within the brush radius should be cleared (alpha channel set to 0) at the cursor position.

**Validates: Requirements 6.6, 6.7**

### Property 7: Reveal Threshold Trigger
*For any* Scratch_Canvas state, when the percentage of cleared pixels exceeds 50%, the canvas fade-out animation should trigger exactly once and the canvas should unmount after completion.

**Validates: Requirements 6.8, 6.9, 6.10, 6.11**

### Property 8: Canvas Dimension Matching
*For any* card image rendered in the postcard modal, the Scratch_Canvas dimensions should exactly match the rendered dimensions of the underlying image element.

**Validates: Requirements 6.2, 6.12**

## Error Handling

### Animation Fallbacks

1. **Reduced Motion Preference**
   ```tsx
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   
   const transition = prefersReducedMotion 
     ? { duration: 0 }
     : { type: "spring", stiffness: 500, damping: 15, mass: 0.5 };
   ```

2. **Browser Compatibility**
   - Framer Motion automatically falls back to CSS transitions if JavaScript animations fail
   - Shimmer effect degrades gracefully (no shimmer if CSS animations unsupported)

3. **Performance Throttling**
   - Framer Motion uses requestAnimationFrame internally
   - No manual throttling required

## Testing Strategy

### Unit Tests

**Test 1: Stamp Press Animation Props**
```typescript
test('tier card applies correct whileTap props', () => {
  const { container } = render(<TierCardWithStampPress />);
  const motionDiv = container.querySelector('[data-testid="tier-card"]');
  
  expect(motionDiv).toHaveAttribute('whileTap');
  // Verify scale, rotate, y values
});
```

**Test 2: SSR Shimmer Conditional Rendering**
```typescript
test('shimmer renders only for SSR rarity', () => {
  const ssrPostcard = { ...mockPostcard, rarity: 'SSR' };
  const { container } = render(<PostcardModal postcard={ssrPostcard} />);
  
  expect(container.querySelector('.gilded-shimmer')).toBeInTheDocument();
});

test('shimmer does not render for SR rarity', () => {
  const srPostcard = { ...mockPostcard, rarity: 'SR' };
  const { container } = render(<PostcardModal postcard={srPostcard} />);
  
  expect(container.querySelector('.gilded-shimmer')).not.toBeInTheDocument();
});
```

**Test 3: Data Integrity After Animation**
```typescript
test('onClick handler fires correctly with motion wrapper', () => {
  const handleClick = jest.fn();
  const { getByRole } = render(
    <motion.button onClick={handleClick} whileTap={{ scale: 0.96 }}>
      Submit
    </motion.button>
  );
  
  fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Property-Based Tests

**Property Test 1: Animation State Preservation**
```typescript
import fc from 'fast-check';

test('stamp press animation preserves all props', () => {
  fc.assert(
    fc.property(
      fc.record({
        onClick: fc.func(fc.constant(undefined)),
        className: fc.string(),
        children: fc.string(),
      }),
      (props) => {
        const { container } = render(
          <motion.div {...props} whileTap={{ scale: 0.96 }} />
        );
        
        const element = container.firstChild;
        expect(element).toHaveClass(props.className);
        expect(element).toHaveTextContent(props.children);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test 2: Rarity-Based Shimmer Rendering**
```typescript
test('shimmer visibility matches rarity === SSR', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('SSR', 'SR', 'COMMON'),
      (rarity) => {
        const postcard = { ...mockPostcard, rarity };
        const { container } = render(<PostcardModal postcard={postcard} />);
        
        const shimmer = container.querySelector('.gilded-shimmer');
        const shouldHaveShimmer = rarity === 'SSR';
        
        if (shouldHaveShimmer) {
          expect(shimmer).toBeInTheDocument();
        } else {
          expect(shimmer).not.toBeInTheDocument();
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test 3: Hash Generation Consistency**
```typescript
test('animations do not affect hash generation', () => {
  fc.assert(
    fc.property(
      fc.string(),
      fc.string(),
      fc.float({ min: 1, max: 100 }),
      (name, message, amount) => {
        // Generate hash before animation
        const hashBefore = getDeterministicHash(name, message, amount);
        
        // Render component with animations
        render(<App />);
        
        // Generate hash after animation
        const hashAfter = getDeterministicHash(name, message, amount);
        
        expect(hashBefore.txSig).toBe(hashAfter.txSig);
        expect(hashBefore.cardIndex).toBe(hashAfter.cardIndex);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Tests

**Test 1: End-to-End Postcard Drop Animation**
```typescript
test('postcard animates in when payment completes', async () => {
  const { getByText, findByTestId } = render(<App />);
  
  // Trigger payment
  fireEvent.click(getByText('Simulate cozy tea break'));
  
  // Wait for postcard to appear
  const postcard = await findByTestId('postcard-modal');
  
  // Verify animation classes applied
  expect(postcard).toHaveStyle({ opacity: 1 });
});
```

**Test 2: Tier Card Selection with Animation**
```typescript
test('tier card selection works with stamp press animation', () => {
  const { getByText } = render(<App />);
  
  const teaCupCard = getByText('Green Tea Cup').closest('div');
  
  // Click should still select tier
  fireEvent.click(teaCupCard);
  
  // Verify selection state updated
  expect(teaCupCard).toHaveClass('selected');
});
```

### Testing Configuration

- **Framework**: Jest + React Testing Library
- **Property Testing**: fast-check
- **Minimum Iterations**: 100 runs per property test
- **Coverage Target**: 90% for animation logic
- **Test Tags**: 
  - `Feature: premium-micro-interactions, Property 1: Animation State Preservation`
  - `Feature: premium-micro-interactions, Property 2: Modal Animation Trigger Consistency`
  - `Feature: premium-micro-interactions, Property 3: SSR Shimmer Conditional Rendering`
  - `Feature: premium-micro-interactions, Property 6: Scratch Canvas Pixel Clearing`
  - `Feature: premium-micro-interactions, Property 7: Reveal Threshold Trigger`
  - `Feature: premium-micro-interactions, Property 8: Canvas Dimension Matching`

### Scratch-off Canvas Tests

**Unit Test 1: Canvas Initialization**
```typescript
test('canvas initializes with correct dimensions and styling', () => {
  const { container } = render(<ScratchCard imageUrl="/test.jpg" />);
  const canvas = container.querySelector('canvas');
  const img = container.querySelector('img');
  
  expect(canvas).toBeInTheDocument();
  expect(canvas?.width).toBe(img?.offsetWidth);
  expect(canvas?.height).toBe(img?.offsetHeight);
});
```

**Unit Test 2: Scratch Interaction**
```typescript
test('scratching clears canvas pixels', () => {
  const { container } = render(<ScratchCard imageUrl="/test.jpg" />);
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  
  fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
  fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 });
  
  const ctx = canvas.getContext('2d');
  const imageData = ctx?.getImageData(55, 55, 1, 1);
  
  // Check that pixel alpha channel is cleared
  expect(imageData?.data[3]).toBe(0);
});
```

**Unit Test 3: Reveal Threshold**
```typescript
test('canvas fades out when 50% threshold reached', async () => {
  const onReveal = jest.fn();
  const { container } = render(<ScratchCard imageUrl="/test.jpg" onReveal={onReveal} />);
  const canvas = container.querySelector('canvas') as HTMLCanvasElement;
  
  // Simulate scratching over 50% of canvas
  // ... scratch simulation logic
  
  await waitFor(() => {
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(canvas).toHaveStyle({ opacity: 0 });
  });
});
```

**Property Test 1: Pixel Clearing Consistency**
```typescript
test('scratch always clears pixels at cursor position', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 300 }),
      fc.integer({ min: 0, max: 300 }),
      (x, y) => {
        const { container } = render(<ScratchCard imageUrl="/test.jpg" />);
        const canvas = container.querySelector('canvas') as HTMLCanvasElement;
        
        fireEvent.mouseDown(canvas, { clientX: x, clientY: y });
        fireEvent.mouseMove(canvas, { clientX: x, clientY: y });
        
        const ctx = canvas.getContext('2d');
        const imageData = ctx?.getImageData(x, y, 1, 1);
        
        // Pixel at cursor should be cleared
        expect(imageData?.data[3]).toBe(0);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test 2: Dimension Matching**
```typescript
test('canvas dimensions always match image dimensions', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 100, max: 500 }),
      fc.integer({ min: 100, max: 500 }),
      (width, height) => {
        const { container } = render(
          <div style={{ width, height }}>
            <ScratchCard imageUrl="/test.jpg" />
          </div>
        );
        
        const canvas = container.querySelector('canvas');
        const img = container.querySelector('img');
        
        expect(canvas?.width).toBe(img?.offsetWidth);
        expect(canvas?.height).toBe(img?.offsetHeight);
      }
    ),
    { numRuns: 100 }
  );
});
```

