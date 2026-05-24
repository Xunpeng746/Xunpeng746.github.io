function buildToc() {
  const article = document.querySelector(".post-main") || document.querySelector("d-article");
  const tocList = document.getElementById("toc-list");
  const sidebar = document.getElementById("toc-sidebar");
  if (!article || !tocList || !sidebar) return;

  const headings = article.querySelectorAll("h2, h3, h4");
  if (headings.length === 0) {
    sidebar.style.display = "none";
    return;
  }

  headings.forEach(function (heading, i) {
    if (!heading.id) heading.id = "toc-heading-" + i;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + heading.id;
    a.textContent = heading.textContent;
    if (heading.tagName === "H3" || heading.tagName === "H4") li.classList.add("toc-h3");
    li.appendChild(a);
    tocList.appendChild(li);
  });

  // Scroll spy
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const id = entry.target.id;
      const link = tocList.querySelector('a[href="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        tocList.querySelectorAll("a").forEach(function (a) { a.classList.remove("active"); });
        link.classList.add("active");
      }
    });
  }, { rootMargin: "0px 0px -70% 0px" });

  headings.forEach(function (h) { observer.observe(h); });

  // Distill applies CSS transforms to ancestors which breaks position:fixed.
  // Move sidebar to document.body to escape any transformed ancestor.
  // Then simulate sticky: start below the byline and slide up until it hits
  // the navbar bottom, where it stays fixed.
  if (sidebar.classList.contains("distill-toc")) {
    document.body.appendChild(sidebar);
    sidebar.style.position = "fixed";

    var initialTop = 390; // distance from viewport top when page is unscrolled
    var minTop = 80;      // navbar height — sidebar never goes above this

    function updateTop() {
      var top = Math.max(minTop, initialTop - window.scrollY);
      sidebar.style.top = top + "px";
    }

    window.addEventListener("scroll", updateTop, { passive: true });
    updateTop();
  }
}

window.addEventListener("load", function () {
  setTimeout(buildToc, 100);
});
