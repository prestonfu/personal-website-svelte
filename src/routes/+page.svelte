<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount, tick } from "svelte";
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";

  import Seo from "$lib/components/Seo.svelte";
  import { formatTime } from "$lib/utils";
  import notes from "./notes/notes.yaml";
  import Project from "./projects/Project.svelte";

  type Writing = {
    title: string;
    date: string | Date;
    summary: string;
    link: string;
  };

  type NavItem = {
    id: "research" | "writing";
    label: string;
  };

  type ContactLink = {
    label: string;
    href?: string;
    copyText?: string;
  };

  type CopyParticle = {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    rotation: number;
    scale: number;
    duration: number;
  };

  const emailAddress = "prestonf@cs.washington.edu";

  const projects = import.meta.glob("../projects/*.md", {
    eager: true,
  }) as Record<string, any>;

  const navItems: NavItem[] = [
    { id: "research", label: "Research" },
    { id: "writing", label: "Writing" },
  ];

  const contactLinks: ContactLink[] = [
    { label: "email", copyText: emailAddress },
    {
      label: "scholar",
      href: "https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=VjtRFvEAAAAJ",
    },
    { label: "github", href: "https://github.com/prestonfu" },
    { label: "strava", href: "https://strava.app.link/wlebb9cWh6b" },
  ];

  function trimName(id: string) {
    return id.match(/\.\.\/projects\/(.*)\.md$/)?.[1];
  }

  function timeValue(date: string | Date) {
    return date instanceof Date ? date.getTime() : new Date(date).getTime();
  }

  function isExternal(link: string) {
    return /^https?:\/\//.test(link);
  }

  $: enabledProjects = Object.keys(projects).filter(
    (id) => projects[id].enable !== false,
  );
  $: projectsByDate = [...enabledProjects].sort(
    (a, b) => timeValue(projects[b].date) - timeValue(projects[a].date),
  );

  $: writingItems = [
    ...((notes as any).research ?? []),
    ...((notes as any).courses ?? []),
    ...((notes as any).artifacts ?? []),
  ].sort((a: Writing, b: Writing) => timeValue(b.date) - timeValue(a.date));

  let railEl: HTMLElement | null = null;
  let markerRefs: HTMLElement[] = [];
  let sectionRefs: Record<string, HTMLElement> = {};
  let markerPositions: number[] = [];
  let sliderTop = 0;
  let sliderOpacity = 0;
  let activeIndex: number | null = null;
  let programmaticTargetIndex: number | null = null;
  let programmaticScrollUntil = 0;
  let frame = 0;
  let bottomHoldTimer: ReturnType<typeof setTimeout> | null = null;
  let railEasterResetTimer: ReturnType<typeof setTimeout> | null = null;
  let railEasterState: "idle" | "active" | "reversing" = "idle";
  let railUsesSlider = true;
  let sliderLanded = false;
  let copyParticleId = 0;
  let copyParticles: CopyParticle[] = [];
  let copyParticleTimers: ReturnType<typeof setTimeout>[] = [];

  const compactRailQuery = "(max-width: 820px)";
  const railEasterScrollableHoldMs = 5000;
  const railEasterContainedHoldMs = 5000;
  const railEasterAnimationMs = 200;

  $: railRungGap =
    markerPositions.length > 1
      ? Math.abs(markerPositions[1] - markerPositions[0])
      : 21.6;
  $: railEasterDrop = railRungGap;
  $: railEasterTextTop =
    (markerPositions[1] ?? railRungGap * 2) + railEasterDrop + 0.6 * 16;

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function registerMarker(node: HTMLElement, index: number) {
    markerRefs[index] = node;
    return {
      destroy() {
        markerRefs[index] = undefined as any;
      },
    };
  }

  function registerSection(node: HTMLElement, id: string) {
    sectionRefs[id] = node;
    return {
      destroy() {
        delete sectionRefs[id];
      },
    };
  }

  function clearBottomHoldTimer() {
    if (!bottomHoldTimer) return;
    clearTimeout(bottomHoldTimer);
    bottomHoldTimer = null;
  }

  function clearRailEasterResetTimer() {
    if (!railEasterResetTimer) return;
    clearTimeout(railEasterResetTimer);
    railEasterResetTimer = null;
  }

  function clearCopyParticleTimers() {
    for (const timer of copyParticleTimers) {
      clearTimeout(timer);
    }
    copyParticleTimers = [];
  }

  async function copyText(text: string) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall back below when the Clipboard API is present but unavailable.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function showCopyParticle(originX: number, originY: number) {
    copyParticleId += 1;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const dx = direction * (15 + Math.random() * 27);
    const dy = -(17 + Math.random() * 21);

    const particle: CopyParticle = {
      id: copyParticleId,
      x: originX,
      y: originY,
      dx: Math.round(dx),
      dy: Math.round(dy),
      rotation: Math.round(-42 + Math.random() * 84),
      scale: 0.92 + Math.random() * 0.16,
      duration: 574 + Math.round(Math.random() * 154),
    };

    copyParticles = [...copyParticles, particle];

    const timer = setTimeout(() => {
      copyParticles = copyParticles.filter((item) => item.id !== particle.id);
      copyParticleTimers = copyParticleTimers.filter((item) => item !== timer);
    }, particle.duration);

    copyParticleTimers = [...copyParticleTimers, timer];
  }

  async function handleContactClick(event: MouseEvent, link: ContactLink) {
    if (!link.copyText) return;

    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    showCopyParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    try {
      await copyText(link.copyText);
    } catch {
      if (link.href) {
        window.location.href = link.href;
      }
    }
  }

  function disableRailEaster() {
    clearBottomHoldTimer();
    clearRailEasterResetTimer();
    railEasterState = "idle";
  }

  function updateRailMode() {
    if (!browser) return;

    railUsesSlider = !window.matchMedia(compactRailQuery).matches;
    if (!railUsesSlider) {
      disableRailEaster();
      sliderOpacity = 0;
    }
  }

  function isPageScrollable() {
    if (!browser) return false;

    const page = document.documentElement;
    return page.scrollHeight > window.innerHeight + 2;
  }

  function isAtPageBottom() {
    if (!browser) return false;

    const page = document.documentElement;
    if (!isPageScrollable()) return true;

    return window.scrollY + window.innerHeight >= page.scrollHeight - 2;
  }

  function hideRailSliderAtStart() {
    activeIndex = null;
    sliderTop = -14;
    sliderOpacity = 0;
    sliderLanded = false;
  }

  function setRailSliderToWriting() {
    const lastIndex = navItems.length - 1;
    sliderTop = markerPositions[lastIndex] ?? sliderTop;
    sliderOpacity = 1;
    sliderLanded = true;
  }

  function getRailEasterHoldMs() {
    return isPageScrollable()
      ? railEasterScrollableHoldMs
      : railEasterContainedHoldMs;
  }

  function activateRailEaster() {
    if (!railUsesSlider) return;

    clearRailEasterResetTimer();
    setRailSliderToWriting();
    railEasterState = "active";
  }

  function reverseRailEaster() {
    if (!railUsesSlider || railEasterState !== "active") return;

    clearRailEasterResetTimer();
    railEasterState = "reversing";
    railEasterResetTimer = setTimeout(() => {
      if (railEasterState === "reversing") {
        railEasterState = "idle";
        if (!isPageScrollable()) {
          hideRailSliderAtStart();
        } else {
          updateSliderFromScroll();
        }
      }
    }, railEasterAnimationMs);
  }

  function monitorBottomHold() {
    if (!browser || !railUsesSlider) {
      disableRailEaster();
      return;
    }

    const atBottom = isAtPageBottom();

    if (!atBottom) {
      clearBottomHoldTimer();
      reverseRailEaster();
      return;
    }

    if (railEasterState === "reversing") return;
    if (railEasterState === "active" || bottomHoldTimer) return;

    bottomHoldTimer = setTimeout(() => {
      bottomHoldTimer = null;
      if (isAtPageBottom()) {
        activateRailEaster();
      }
    }, getRailEasterHoldMs());
  }

  function dismissRailEaster() {
    clearBottomHoldTimer();
    reverseRailEaster();
  }

  function updateMarkerPositions() {
    if (!browser || !railEl || markerRefs.length === 0) return;

    const railBox = railEl.getBoundingClientRect();
    markerPositions = markerRefs.map((node) => {
      const box = node.getBoundingClientRect();
      return box.top - railBox.top + box.height / 2;
    });

    updateSliderFromScroll();
  }

  function handleViewportChange() {
    updateRailMode();
    scheduleMeasure();
    monitorBottomHold();
  }

  function updateSliderFromScroll() {
    if (!browser || markerPositions.length !== navItems.length) return;

    const lastIndex = navItems.length - 1;

    if (railEasterState === "active" || railEasterState === "reversing") {
      sliderTop = markerPositions[lastIndex] ?? sliderTop;
      sliderOpacity = 1;
      sliderLanded = true;
      activeIndex = isPageScrollable() && isAtPageBottom() ? lastIndex : null;
      return;
    }

    if (
      railUsesSlider &&
      programmaticTargetIndex !== null &&
      performance.now() < programmaticScrollUntil
    ) {
      activeIndex = programmaticTargetIndex;
      sliderTop = markerPositions[programmaticTargetIndex] ?? sliderTop;
      sliderOpacity = 1;
      sliderLanded = true;
      return;
    }

    programmaticTargetIndex = null;

    const sectionTops = navItems.map((item) => {
      const node = sectionRefs[item.id];
      return node ? node.getBoundingClientRect().top + window.scrollY : 0;
    });
    const activationOffset = window.innerHeight * 0.3;
    const activationY = window.scrollY + activationOffset;

    if (!isPageScrollable()) {
      hideRailSliderAtStart();
      return;
    }

    if (window.scrollY <= 1) {
      hideRailSliderAtStart();
      return;
    }

    if (isAtPageBottom()) {
      activeIndex = lastIndex;
      if (railUsesSlider) {
        sliderTop = markerPositions[lastIndex] ?? sliderTop;
        sliderOpacity = 1;
        sliderLanded = true;
      } else {
        sliderOpacity = 0;
        sliderLanded = false;
      }
      return;
    }

    if (!railUsesSlider) {
      let simpleIndex = 0;
      for (let i = 0; i < sectionTops.length; i += 1) {
        if (activationY >= sectionTops[i]) {
          simpleIndex = i;
        }
      }

      activeIndex = simpleIndex;
      sliderOpacity = 0;
      sliderLanded = false;
      return;
    }


    if (activationY < sectionTops[0]) {
      const firstActivationScroll = Math.max(sectionTops[0] - activationOffset, 1);
      const progress = clamp(window.scrollY / firstActivationScroll, 0, 1);
      const spawnTop = -14;
      const nextSliderTop =
        spawnTop + ((markerPositions[0] ?? spawnTop) - spawnTop) * progress;

      activeIndex = null;
      sliderTop = nextSliderTop;
      sliderOpacity = nextSliderTop >= 0 ? 1 : 0;
      sliderLanded = false;
      return;
    }

    let nextIndex: number | null = null;
    for (let i = 0; i < sectionTops.length; i += 1) {
      if (activationY >= sectionTops[i]) {
        nextIndex = i;
      }
    }

    activeIndex = nextIndex;
    if (nextIndex !== null) {
      sliderTop = markerPositions[nextIndex] ?? sliderTop;
      sliderOpacity = 1;
      sliderLanded = true;
    }
  }

  function scheduleMeasure() {
    if (!browser || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      updateMarkerPositions();
    });
  }

  function handleNavClick(event: MouseEvent, item: NavItem, index: number) {
    event.preventDefault();
    const shouldPreserveEasterBase = railEasterState !== "idle";

    if (railUsesSlider) {
      dismissRailEaster();
    } else {
      disableRailEaster();
    }
    activeIndex = index;
    if (railUsesSlider) {
      if (!shouldPreserveEasterBase) {
        sliderTop = markerPositions[index] ?? sliderTop;
        sliderOpacity = 1;
        sliderLanded = true;
      }
      programmaticTargetIndex = index;
    } else {
      sliderOpacity = 0;
      sliderLanded = false;
      programmaticTargetIndex = null;
    }
    programmaticScrollUntil = performance.now() + 900;
    sectionRefs[item.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${item.id}`);

    setTimeout(() => {
      if (programmaticTargetIndex === index) {
        programmaticTargetIndex = null;
        scheduleMeasure();
      }
    }, 900);
  }

  onMount(() => {
    if (!browser) return;

    let resizeObserver: ResizeObserver | null = null;

    tick().then(() => {
      updateRailMode();
      updateMarkerPositions();
      monitorBottomHold();

      window.addEventListener("scroll", handleViewportChange, { passive: true });
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("load", handleViewportChange);

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(handleViewportChange);
        resizeObserver.observe(document.body);
      }

      const selected = window.location.hash.slice(1);
      if (selected && sectionRefs[selected]) {
        setTimeout(() => {
          sectionRefs[selected]?.scrollIntoView({ block: "start" });
          scheduleMeasure();
        }, 120);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("load", handleViewportChange);
      resizeObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      clearBottomHoldTimer();
      clearRailEasterResetTimer();
      clearCopyParticleTimers();
    };
  });
</script>

<Seo title="Preston Fu" description="PhD student at the University of Washington" />

<div class="home-shell">
  <aside class="side" aria-label="Section navigation">
    <a href="/" class="name" aria-label="Preston Fu home">Preston Fu</a>
    <nav class="rail" bind:this={railEl}>
      {#if railUsesSlider}
        <span
          class="rail-slider"
          class:landed={sliderLanded}
          class:easter-active={railEasterState === "active"}
          class:easter-reversing={railEasterState === "reversing"}
          style={`top: ${sliderTop}px; opacity: ${sliderOpacity}; --rail-easter-drop: ${railEasterDrop}px`}
          aria-hidden="true"
        />
      {/if}
      {#each navItems as item, index (item.id)}
        <a
          class="rail-link"
          class:active={activeIndex === index}
          href={`#${item.id}`}
          on:click={(event) => handleNavClick(event, item, index)}
        >
          <span class="rail-marker" use:registerMarker={index} />
          <span>{item.label}</span>
        </a>
      {/each}
      {#if railUsesSlider}
        <span
          class="rail-easter-text"
          class:easter-active={railEasterState === "active"}
          class:easter-reversing={railEasterState === "reversing"}
          style={`top: ${railEasterTextTop}px; --rail-easter-drop: ${railEasterDrop}px`}
          aria-hidden="true"
        >
          Anything interest you? Let's chat! :)
        </span>
      {/if}
    </nav>
  </aside>

  <div class="content" role="main" aria-label="Home">
    <section class="about" aria-label="About">
      <p>
        I'm a PhD student at the University of Washington advised by
        <a class="link" href="https://abhishekunique.github.io/" target="_blank">
          Abhishek Gupta</a
        >, where I am supported by the
        <a class="link" href="https://www.nsfgrfp.org/" target="_blank"
          >NSF Graduate Research Fellowship</a
        >. I'm interested in building reliable and efficiently adaptable systems
        via large-scale RL.
      </p>
      <p>
        Previously, I did my undergrad at UC Berkeley advised by
        <a
          class="link"
          href="https://people.eecs.berkeley.edu/~svlevine/"
          target="_blank"
        >
          Sergey Levine</a
        >
        and
        <a class="link" href="https://aviralkumar2907.github.io/" target="_blank">
          Aviral Kumar</a
        >.
      </p>
    </section>

    <section
      id="research"
      class="section-block"
      aria-label="Research"
      use:registerSection={"research"}
    >
      <!-- <hr class="section-divider" aria-hidden="true" /> -->
      <h2 class="section-heading">Research</h2>
      <div class="research-list">
        {#each projectsByDate as id (id)}
          <article id={trimName(id)}>
            <Project data={projects[id]} stars={null} />
          </article>
        {/each}
      </div>
    </section>

    <section
      id="writing"
      class="section-block"
      aria-label="Writing"
      use:registerSection={"writing"}
    >
      <!-- <hr class="section-divider" aria-hidden="true" /> -->
      <h2 class="section-heading">Writing</h2>
      <div class="writing-list">
        {#each writingItems as item}
          <a
            class="writing-card"
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            <span class="writing-date">{formatTime("%b %Y", item.date)}</span>
            <span class="writing-copy">
              <span class="writing-title">
                {item.title}
                <span class="external-icon">
                  <ArrowUpRight size={16} />
                </span>
              </span>
              <span class="writing-summary">{item.summary}</span>
            </span>
          </a>
        {/each}
      </div>
    </section>

    <section class="contact" aria-label="Contact">
      {#each contactLinks as link}
        {#if link.copyText}
          <button
            type="button"
            class="contact-link"
            on:click={(event) => handleContactClick(event, link)}
          >
            {link.label}
          </button>
        {:else if link.href}
          <a
            class="contact-link"
            href={link.href}
            target={isExternal(link.href) ? "_blank" : undefined}
            rel={isExternal(link.href) ? "noreferrer" : undefined}
          >
            {link.label}
          </a>
        {/if}
      {/each}
    </section>
  </div>
</div>

<div class="copy-particle-layer" aria-hidden="true">
  {#each copyParticles as particle (particle.id)}
    <span
      class="copy-particle"
      style={`left: ${particle.x}px; top: ${particle.y}px; --copy-x: ${particle.dx}px; --copy-y: ${particle.dy}px; --copy-rotate: ${particle.rotation}deg; --copy-scale: ${particle.scale}; --copy-duration: ${particle.duration}ms`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </span>
  {/each}
</div>

<style lang="postcss">
  .home-shell {
    width: min(100%, 980px);
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: minmax(6.5rem, 9rem) minmax(0, 1fr);
    column-gap: clamp(1.4rem, 5vw, 4.5rem);
  }

  .side {
    position: sticky;
    top: 2rem;
    align-self: start;
    min-height: 18rem;
  }

  .name {
    position: relative;
    z-index: 3;
    display: inline-block;
    padding-right: 0.35rem;
    background: #fff;
    color: #000;
    @apply text-xl;
    font-weight: 700;
    line-height: 1.1;
  }

  .rail {
    position: relative;
    height: 2.7rem;
    margin-top: 0.75rem;
  }

  .rail::before {
    content: "";
    position: absolute;
    left: 0.3125rem;
    top: 0;
    height: 2.7rem;
    width: 1px;
    background: #111;
    transform: translateX(-50%);
  }

  .rail-link {
    position: absolute;
    left: 0;
    z-index: 1;
    display: grid;
    grid-template-columns: 0.625rem minmax(0, auto);
    align-items: center;
    column-gap: 0.58rem;
    width: max-content;
    max-width: 100%;
    color: var(--color-text-muted);
    @apply text-base;
    line-height: 1.2;
    transform: translateY(-50%);
    transition: color 140ms ease;
  }

  .rail-link:nth-of-type(1) {
    top: 1.35rem;
  }

  .rail-link:nth-of-type(2) {
    top: 2.7rem;
  }

  .rail-link:hover,
  .rail-link.active {
    color: #000;
  }

  .rail-marker,
  .rail-slider {
    width: 0.625rem;
    height: 0.625rem;
  }

  .rail-marker {
    display: block;
    border: 1.25px solid #111;
    background: #fff;
  }

  .rail-slider {
    position: absolute;
    z-index: 2;
    left: 0.3125rem;
    transform: translate(-50%, -50%);
    border: 1.25px solid #000;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    pointer-events: none;
    transition:
      top 220ms ease-out,
      opacity 200ms ease,
      background-color 120ms ease,
      border-color 120ms ease;
  }

  .rail-slider.landed {
    background: #000;
  }

  .rail-slider.easter-active {
    animation: rail-easter-drop 200ms both;
  }

  .rail-slider.easter-reversing {
    animation: rail-easter-rise 200ms both;
  }

  .rail-easter-text {
    position: absolute;
    z-index: 1;
    left: 1.205rem;
    width: max-content;
    max-width: 12rem;
    color: #000;
    @apply text-base;
    line-height: 1.2;
    opacity: 0;
    pointer-events: none;
    transform: translateY(calc(-50% - var(--rail-easter-drop)));
  }

  .rail-easter-text.easter-active {
    animation: rail-easter-text-drop 200ms both;
  }

  .rail-easter-text.easter-reversing {
    animation: rail-easter-text-rise 200ms both;
  }

  @keyframes rail-easter-drop {
    0% {
      transform: translate(-50%, -50%);
      animation-timing-function: cubic-bezier(0.45, 0, 1, 1);
    }

    100% {
      transform: translate(-50%, calc(-50% + var(--rail-easter-drop)));
    }
  }

  @keyframes rail-easter-rise {
    0% {
      transform: translate(-50%, calc(-50% + var(--rail-easter-drop)));
      animation-timing-function: cubic-bezier(0, 0, 0.25, 1);
    }

    100% {
      transform: translate(-50%, -50%);
    }
  }

  @keyframes rail-easter-text-drop {
    0% {
      opacity: 0;
      transform: translateY(calc(-50% - var(--rail-easter-drop)));
      animation-timing-function: cubic-bezier(0.45, 0, 1, 1);
    }

    100% {
      opacity: 1;
      transform: translateY(-50%);
    }
  }

  @keyframes rail-easter-text-rise {
    0% {
      opacity: 1;
      transform: translateY(-50%);
      animation-timing-function: cubic-bezier(0, 0, 0.25, 1);
    }

    100% {
      opacity: 0;
      transform: translateY(calc(-50% - var(--rail-easter-drop)));
    }
  }

  .content {
    min-width: 0;
    @apply text-md;
    line-height: 1.55;
  }

  .about {
    display: grid;
    gap: 0.95rem;
    padding-top: 0.06rem;
  }

  .section-block {
    --divider-gap: clamp(2.1rem, 5vw, 3.4rem);
    scroll-margin-top: 2rem;
    margin-top: var(--divider-gap);
  }

  /* .section-divider {
    width: 100%;
    margin-bottom: var(--divider-gap);
    border-color: var(--color-rule);
  } */

  .section-heading {
    margin-bottom: 1.2rem;
    color: var(--color-text-muted);
    font-family: "Newsreader Italics", serif;
    @apply text-lg;
    font-weight: 400;
    line-height: 1;
  }

  .research-list {
    display: grid;
    gap: 0.85rem;
  }

  .writing-list {
    display: grid;
    gap: 0.28rem;
  }

  .writing-card {
    display: grid;
    grid-template-columns: 5.4rem minmax(0, 1fr);
    column-gap: 1rem;
    align-items: start;
    margin: 0 -0.7rem;
    padding: 0.58rem 0.7rem 0.64rem;
    color: inherit;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  .writing-card:hover {
    background: var(--color-surface-hover);
    color: #000;
  }

  .writing-date {
    padding-top: 0.1rem;
    color: var(--color-text-subtle);
    @apply text-sm;
    line-height: 1.35;
    white-space: nowrap;
  }

  .writing-copy {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  .writing-title {
    color: #000;
    font-weight: 600;
    line-height: 1.28;
  }

  .external-icon {
    display: inline-flex;
    margin-left: 0.12rem;
    color: var(--color-link-decoration);
    vertical-align: -0.12em;
  }

  .writing-summary {
    color: var(--color-text-muted);
    @apply text-base;
    line-height: 1.36;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: clamp(1.5rem, 4vw, 2.5rem);
  }

  .contact-link {
    appearance: none;
    display: inline-block;
    border: 0;
    background: transparent;
    font: inherit;
    padding: 0.35rem 0.7rem;
    margin-left: -0.7rem;
    color: #000;
    cursor: pointer;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  .contact-link:hover {
    background: var(--color-surface-hover);
  }

  .copy-particle-layer {
    position: fixed;
    inset: 0;
    z-index: 20;
    overflow: hidden;
    pointer-events: none;
  }

  .copy-particle {
    position: fixed;
    color: var(--color-text-muted);
    pointer-events: none;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.82);
    animation:
      copy-particle-float var(--copy-duration) ease-out forwards,
      copy-particle-fade var(--copy-duration) linear forwards;
    filter: drop-shadow(0 0.2rem 0.45rem rgba(0, 0, 0, 0.1));
    will-change: transform, opacity;
  }

  .copy-particle svg {
    display: block;
    width: 0.95rem;
    height: 0.95rem;
  }

  @keyframes copy-particle-float {
    0% {
      transform: translate(-50%, -50%) scale(0.82) rotate(0deg);
    }

    100% {
      transform: translate(calc(-50% + var(--copy-x)), calc(-50% + var(--copy-y)))
        scale(var(--copy-scale)) rotate(var(--copy-rotate));
    }
  }

  @keyframes copy-particle-fade {
    0% {
      opacity: 0;
    }

    12% {
      opacity: 0.95;
    }

    58% {
      opacity: 0.86;
    }

    100% {
      opacity: 0;
    }
  }

  @media (max-width: 820px) {
    .home-shell {
      display: block;
      padding: 0 2.1rem;
    }

    .side {
      position: static;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      min-height: 0;
      margin-bottom: 2.25rem;
    }

    .name {
      @apply text-xl;
    }

    .rail {
      position: relative;
      width: 6.35rem;
      height: 1.975rem;
      margin-top: 0.48rem;
      padding-top: 0;
    }

    .rail::before {
      left: 0.3125rem;
      top: 0.3125rem;
      height: 1.35rem;
    }

    .rail-link {
      position: absolute;
      grid-template-columns: 0.625rem minmax(0, auto);
      column-gap: 0.5rem;
      @apply text-base;
      transform: translateY(-50%);
    }

    .rail-slider,
    .rail-easter-text {
      display: none;
    }

    .rail-easter-text {
      left: 1.125rem;
    }

    .rail-link:nth-of-type(1) {
      top: 0.3125rem;
    }

    .rail-link:nth-of-type(2) {
      top: 1.6625rem;
    }

    .content {
      @apply text-base;
      line-height: 1.48;
    }

    .section-block {
      --divider-gap: 2.25rem;
      margin-top: var(--divider-gap);
      scroll-margin-top: 1.4rem;
    }

    .section-heading {
      margin-bottom: 1rem;
      @apply text-lg;
    }

    .research-list {
      gap: 0.75rem;
    }

    .writing-card {
      grid-template-columns: minmax(0, 1fr);
      gap: 0.18rem;
      margin-right: -0.5rem;
      padding-right: 0.5rem;
    }

    .writing-date {
      @apply text-xs;
    }
  }

  @media (max-width: 360px) {
    .home-shell {
      grid-template-columns: minmax(4.95rem, 5.35rem) minmax(0, 1fr);
      column-gap: 0.8rem;
      padding: 0 1.5rem;
    }

    .name {
      @apply text-lg;
    }

    .rail-link {
      @apply text-sm;
    }
  }
</style>
