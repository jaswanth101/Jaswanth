import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import gsap from 'gsap';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { customClass, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-[1.75rem] border border-white/10 bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${className ?? ''}`.trim()}
    />
  );
});

type CardSwapProps = {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: 'elastic' | 'smooth';
  children: ReactNode;
};

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

Card.displayName = 'Card';

const makeSlot = (index: number, distX: number, distY: number, total: number): Slot => ({
  x: index * distX,
  y: -index * distY,
  z: -index * distX * 1.5,
  zIndex: total - index,
});

const placeNow = (element: HTMLDivElement | null, slot: Slot, skew: number) => {
  if (!element) return;

  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export default function CardSwap({
  width = 500,
  height = 320,
  cardDistance = 50,
  verticalDistance = 60,
  delay = 6000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 4,
  easing = 'smooth',
  children,
}: CardSwapProps) {
  const childArray = Children.toArray(children) as ReactElement[];
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const orderRef = useRef<number[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const config = useMemo(
    () =>
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: 'power2.inOut',
            durDrop: 0.45,
            durMove: 0.45,
            durReturn: 0.45,
            promoteOverlap: 0.4,
            returnDelay: 0.16,
          },
    [easing],
  );

  useEffect(() => {
    const total = childArray.length;
    orderRef.current = Array.from({ length: total }, (_, index) => index);
    cardRefs.current = containerRef.current
      ? (Array.from(containerRef.current.querySelectorAll('[data-card-swap-item="true"]')) as HTMLDivElement[])
      : [];

    cardRefs.current.forEach((element, index) => {
      placeNow(element, makeSlot(index, cardDistance, verticalDistance, total), skewAmount);
    });

    const clearSwapInterval = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const swap = () => {
      if (orderRef.current.length < 2) return;

      const [front, ...rest] = orderRef.current;
      const frontElement = cardRefs.current[front];
      if (!frontElement) return;

      timelineRef.current?.kill();

      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(frontElement, {
        y: '+=420',
        duration: config.durDrop,
        ease: config.ease,
      });

      timeline.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);

      rest.forEach((index, slotIndex) => {
        const element = cardRefs.current[index];
        const slot = makeSlot(slotIndex, cardDistance, verticalDistance, total);
        if (!element) return;

        timeline.set(element, { zIndex: slot.zIndex }, 'promote');
        timeline.to(
          element,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${slotIndex * 0.12}`,
        );
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      timeline.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      timeline.call(() => {
        gsap.set(frontElement, { zIndex: backSlot.zIndex });
      }, undefined, 'return');
      timeline.to(
        frontElement,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        'return',
      );
      timeline.call(() => {
        orderRef.current = [...rest, front];
      });
    };

    const startSwapInterval = () => {
      clearSwapInterval();
      intervalRef.current = window.setInterval(swap, delay);
    };

    startSwapInterval();

    let teardownHover: (() => void) | undefined;

    if (pauseOnHover && containerRef.current) {
      const node = containerRef.current;
      const pause = () => {
        timelineRef.current?.pause();
        clearSwapInterval();
      };
      const resume = () => {
        timelineRef.current?.play();
        startSwapInterval();
      };

      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      teardownHover = () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
      };
    }

    return () => {
      teardownHover?.();
      clearSwapInterval();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [
    childArray.length,
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
  ]);

  const renderedChildren = useMemo(
    () =>
      childArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const element = child as ReactElement<{
          style?: CSSProperties;
          onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
        }>;
        const childStyle = (element.props.style ?? {}) as CSSProperties;

        return cloneElement(element, {
          key: index,
          'data-card-swap-item': 'true',
          style: { width, height, ...childStyle },
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            element.props.onClick?.(event);
            onCardClick?.(index);
          },
        } as never);
      }),
    [childArray, height, onCardClick, width],
  );

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-1/2 h-full w-full -translate-y-1/2 overflow-visible perspective-[1000px] max-lg:relative max-lg:top-auto max-lg:flex max-lg:justify-center max-lg:translate-y-0"
    >
      {renderedChildren}
    </div>
  );
}
