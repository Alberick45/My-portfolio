import { useState, useEffect, useRef } from 'react';
import { ROOM_CONFIG, WORKSHOP_STATIONS } from '../config/workshopConfig';

export interface UseZScrollReturn {
  curZ: number;
  tgtZ: number;
  progress: number;
  rotX: number;
  rotY: number;
  introOpacity: number;
  activeStationIndex: number;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  scrollToStation: (index: number) => void;
}

export function useZScroll(): UseZScrollReturn {
  const [curZ, setCurZ] = useState(0);
  const [tgtZ, setTgtZ] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [introOpacity, setIntroOpacity] = useState(1);
  const [activeStationIndex, setActiveStationIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const curZRef = useRef(0);
  const tgtZRef = useRef(0);
  const rotXTargetRef = useRef(0);
  const rotYTargetRef = useRef(0);
  const rotXCurRef = useRef(0);
  const rotYCurRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const p = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const target = p * ROOM_CONFIG.maxCameraZ;
      tgtZRef.current = target;
      setProgress(p);
      setTgtZ(target);

      // Intro text fades out completely during first 12% of scroll
      const iOp = Math.max(0, 1 - p / 0.12);
      setIntroOpacity(iOp);

      // Determine active station index based on camera depth
      let closestIdx = 0;
      let minDiff = Infinity;
      WORKSHOP_STATIONS.forEach((st, idx) => {
        const diff = Math.abs(-st.z - target);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveStationIndex(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Parallax (subtle viewport tilt)
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      rotYTargetRef.current = dx * 2.5; // Max 2.5 degrees
      rotXTargetRef.current = -dy * 2.0; // Max 2.0 degrees
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, prefersReducedMotion]);

  // Easing loop (0.06 easing)
  useEffect(() => {
    const update = () => {
      const diffZ = tgtZRef.current - curZRef.current;
      const diffRotX = rotXTargetRef.current - rotXCurRef.current;
      const diffRotY = rotYTargetRef.current - rotYCurRef.current;

      if (prefersReducedMotion) {
        curZRef.current = tgtZRef.current;
        rotXCurRef.current = 0;
        rotYCurRef.current = 0;
      } else {
        curZRef.current += diffZ * ROOM_CONFIG.easing;
        rotXCurRef.current += diffRotX * 0.08;
        rotYCurRef.current += diffRotY * 0.08;
      }

      setCurZ(curZRef.current);
      setRotX(rotXCurRef.current);
      setRotY(rotYCurRef.current);

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [prefersReducedMotion]);

  const scrollToStation = (index: number) => {
    const station = WORKSHOP_STATIONS[index];
    if (!station) return;
    const targetCameraZ = -station.z;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = (targetCameraZ / ROOM_CONFIG.maxCameraZ) * maxScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: prefersReducedMotion ? 'instant' as any : 'smooth',
    });
  };

  return {
    curZ,
    tgtZ,
    progress,
    rotX,
    rotY,
    introOpacity,
    activeStationIndex,
    isMobile,
    prefersReducedMotion,
    scrollToStation,
  };
}
