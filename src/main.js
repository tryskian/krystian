
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.11.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.11.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

const horizontalSection = document.querySelector(".horizontal-scroll-section");
const horizontalInner   = document.querySelector(".horizontal-inner");

if (horizontalSection && horizontalInner) {
    const panels = gsap.utils.toArray(".slide");

    const horizontalTween = gsap.to(horizontalInner, {
      x: () => -(horizontalInner.scrollWidth - window.innerWidth) + "px",
      ease: "none",
      scrollTrigger: {
        id: "horizontal",
        trigger: horizontalSection,
        start: "top top",
        end: () => "+=" + (horizontalInner.scrollWidth - window.innerWidth),
        scrub: true, // Restored to prevent skipping and allow custom snap
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        snap: {
          snapTo: 1 / (panels.length - 1),
          duration: 1.2, // Slower for a more intentional snap
          ease: "power2.inOut"
        }
      }
    });
    const st = horizontalTween.scrollTrigger;

    document.querySelectorAll(".slide-links li").forEach((li, i) => {
      li.addEventListener("click", () => {
        st.scroll(i / (panels.length - 1));
      });
    });

    // --- One-at-a-time horizontal scroll (debounced) ---
    let isScrolling = false;
    let isActivated = false; // lockout for first scroll after pin
    let currentIndex = 0;
    const maxIndex = panels.length - 1;

    function scrollToPanel(idx) {
      currentIndex = Math.max(0, Math.min(idx, maxIndex));
      st.scroll(currentIndex / maxIndex);
    }

    function handleWheel(e) {
      if (!st.isActive) return; // allow normal scroll if not pinned
      const deltaX = e.deltaX || 0;
      const deltaY = e.deltaY || e.detail || e.wheelDelta || 0;
      // Activation lock: require one gesture to activate after pin
      if (!isActivated) {
        isActivated = true;
        e.preventDefault();
        return;
      }
      // Only trigger horizontal scroll if gesture is mostly horizontal and large enough
      const wheelThreshold = 160; // px, even less sensitive for more intentional scroll
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > wheelThreshold) {
        // If at first or last slide and user scrolls further, allow normal scroll to escape
        if ((currentIndex === 0 && deltaX < 0) || (currentIndex === maxIndex && deltaX > 0)) {
          return;
        }
        if (isScrolling) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        isScrolling = true;
        if (deltaX > 0) {
          scrollToPanel(currentIndex + 1);
        } else if (deltaX < 0) {
          scrollToPanel(currentIndex - 1);
        }
        setTimeout(() => { isScrolling = false; }, 600);
      } else {
        // If gesture is mostly vertical or too small, allow normal scroll always
        return;
      }
    }

    // Touch support
    let touchStartX = null;
    let touchStartY = null;
    horizontalSection.addEventListener('touchstart', e => {
      if (!st.isActive) return;
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: false });
    horizontalSection.addEventListener('touchend', e => {
      if (!st.isActive || touchStartX === null || touchStartY === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      const touchThreshold = 200; // px, even less sensitive for more intentional swipe
      // Only trigger horizontal scroll if horizontal swipe is dominant and large enough
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > touchThreshold && !isScrolling) {
        // If at first/last slide and swiping further, allow normal scroll
        if ((currentIndex === 0 && dx > 0) || (currentIndex === maxIndex && dx < 0)) {
          touchStartX = null; touchStartY = null; return;
        }
        isScrolling = true;
        if (dx < 0) scrollToPanel(currentIndex + 1);
        else scrollToPanel(currentIndex - 1);
        setTimeout(() => { isScrolling = false; }, 600);
      }
      touchStartX = null;
      touchStartY = null;
    }, { passive: false });

    // Mouse wheel
    horizontalSection.addEventListener('wheel', handleWheel, { passive: false });

    // Reset activation lock when leaving/re-entering section
    st.vars.onToggle = (self) => {
      if (self.isActive) {
        isActivated = false;
      }
    };

    // Sync currentIndex on manual scroll (e.g. nav click or drag)
    st.vars.onUpdate = () => {
      const progress = st.progress;
      const idx = Math.round(progress * maxIndex);
      currentIndex = idx;
    };
}
