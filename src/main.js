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
}
