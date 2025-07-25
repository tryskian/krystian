import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const horizontalSection = document.querySelector(".horizontal-scroll-section");
const horizontalInner = document.querySelector(".horizontal-inner");

if (horizontalSection && horizontalInner) {
  gsap.to(horizontalInner, {
    x: () => -(horizontalInner.scrollWidth - window.innerWidth) + "px",
    ease: "none",
    scrollTrigger: {
      trigger: horizontalSection,
      start: "top top",
      end: () => "+=" + (horizontalInner.scrollWidth - window.innerWidth),
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      snap: ".slide"
    }
  });
}
