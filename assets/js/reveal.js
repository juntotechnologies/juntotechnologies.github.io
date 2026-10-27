/** Scroll reveal: marks each .reveal element visible once it enters the view. CSS does the motion. */

const OPTIONS = { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
const root = document.documentElement

function show(observer, entry) {
  if (!entry.isIntersecting) return
  entry.target.classList.add("is-visible")
  observer.unobserve(entry.target)
}

function onIntersect(entries, observer) {
  entries.forEach(show.bind(null, observer))
}

function start() {
  const observer = new IntersectionObserver(onIntersect, OPTIONS)
  document.querySelectorAll(".reveal").forEach(observer.observe.bind(observer))
  root.dataset.reveal = "ready"
}

if (root.classList.contains("reveal-on")) start()
