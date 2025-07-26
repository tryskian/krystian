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
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        snap: {
          snapTo: 1 / (panels.length - 1),
          duration: 0.3,
          ease: "power2.out"
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
    let currentIndex = 0;
    const maxIndex = panels.length - 1;

    function scrollToPanel(idx) {
      currentIndex = Math.max(0, Math.min(idx, maxIndex));
      st.scroll(currentIndex / maxIndex);
    }

    function handleWheel(e) {
      if (isScrolling) return;
      // Only trigger if the section is pinned (in view)
      if (!st.isActive) return;
      e.preventDefault();
      isScrolling = true;
      const delta = e.deltaY || e.detail || e.wheelDelta;
      if (delta > 0) {
        scrollToPanel(currentIndex + 1);
      } else if (delta < 0) {
        scrollToPanel(currentIndex - 1);
      }
      setTimeout(() => { isScrolling = false; }, 600); // adjust delay as needed
    }

    // Touch support
    let touchStartX = null;
    horizontalSection.addEventListener('touchstart', e => {
      if (!st.isActive) return;
      if (e.touches.length === 1) touchStartX = e.touches[0].clientX;
    }, { passive: false });
    horizontalSection.addEventListener('touchend', e => {
      if (!st.isActive || touchStartX === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 50 && !isScrolling) {
        isScrolling = true;
        if (dx < 0) scrollToPanel(currentIndex + 1);
        else scrollToPanel(currentIndex - 1);
        setTimeout(() => { isScrolling = false; }, 600);
      }
      touchStartX = null;
    }, { passive: false });

    // Mouse wheel
    horizontalSection.addEventListener('wheel', handleWheel, { passive: false });

    // Sync currentIndex on manual scroll (e.g. nav click)
    st.vars.onUpdate = () => {
      const progress = st.progress;
      const idx = Math.round(progress * maxIndex);
      currentIndex = idx;
    };
}
