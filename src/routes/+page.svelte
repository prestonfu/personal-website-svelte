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

  const projects = import.meta.glob("../projects/*.md", {
    eager: true,
  }) as Record<string, any>;

  const navItems: NavItem[] = [
    { id: "research", label: "Research" },
    { id: "writing", label: "Writing" },
  ];

  const contactLinks = [
    { label: "email", href: "mailto:prestonf@cs.washington.edu" },
    {
      label: "scholar",
      href: "https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=VjtRFvEAAAAJ",
    },
    { label: "github", href: "https://github.com/prestonfu" },
    { label: "twitter", href: "https://x.com/preston_fu" },
    { label: "linkedin", href: "https://www.linkedin.com/in/preston-fu/" },
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

  function updateMarkerPositions() {
    if (!browser || !railEl || markerRefs.length === 0) return;

    const railBox = railEl.getBoundingClientRect();
    markerPositions = markerRefs.map((node) => {
      const box = node.getBoundingClientRect();
      return box.top - railBox.top + box.height / 2;
    });

    updateSliderFromScroll();
  }

  function updateSliderFromScroll() {
    if (!browser || markerPositions.length !== navItems.length) return;

    if (
      programmaticTargetIndex !== null &&
      performance.now() < programmaticScrollUntil
    ) {
      activeIndex = programmaticTargetIndex;
      sliderTop = markerPositions[programmaticTargetIndex] ?? sliderTop;
      sliderOpacity = 1;
      return;
    }

    programmaticTargetIndex = null;

    const sectionTops = navItems.map((item) => {
      const node = sectionRefs[item.id];
      return node ? node.getBoundingClientRect().top + window.scrollY : 0;
    });
    const activationOffset = window.innerHeight * 0.3;
    const activationY = window.scrollY + activationOffset;
    const railStartsAtResearch = window.matchMedia("(max-width: 820px)").matches;

    if (railStartsAtResearch && activationY < sectionTops[0]) {
      activeIndex = 0;
      sliderTop = markerPositions[0] ?? sliderTop;
      sliderOpacity = 1;
      return;
    }

    if (activationY < sectionTops[0]) {
      const firstActivationScroll = Math.max(sectionTops[0] - activationOffset, 1);
      const progress = clamp(window.scrollY / firstActivationScroll, 0, 1);
      const spawnTop = -14;

      activeIndex = null;
      sliderTop = spawnTop + ((markerPositions[0] ?? spawnTop) - spawnTop) * progress;
      sliderOpacity = progress > 0 ? 1 : 0;
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
    activeIndex = index;
    sliderTop = markerPositions[index] ?? sliderTop;
    sliderOpacity = 1;
    programmaticTargetIndex = index;
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
      updateMarkerPositions();

      window.addEventListener("scroll", scheduleMeasure, { passive: true });
      window.addEventListener("resize", scheduleMeasure);
      window.addEventListener("load", scheduleMeasure);

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(scheduleMeasure);
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
      window.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("load", scheduleMeasure);
      resizeObserver?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  });
</script>

<Seo title="Preston Fu" description="PhD student at the University of Washington" />

<div class="home-shell">
  <aside class="side" aria-label="Section navigation">
    <a href="/" class="name" aria-label="Preston Fu home">Preston Fu</a>
    <nav class="rail" bind:this={railEl}>
      <span
        class="rail-slider"
        class:landed={activeIndex !== null}
        style={`top: ${sliderTop}px; opacity: ${sliderOpacity}`}
        aria-hidden="true"
      />
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
        Previously, I was an undergrad at UC Berkeley advised by
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
        <a
          class="contact-link"
          href={link.href}
          target={isExternal(link.href) ? "_blank" : undefined}
          rel={isExternal(link.href) ? "noreferrer" : undefined}
        >
          {link.label}
        </a>
      {/each}
    </section>
  </div>
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
    font-size: 1.5rem;
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
    font-size: 1.02rem;
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
      opacity 120ms ease,
      background-color 120ms ease,
      border-color 120ms ease;
  }

  .rail-slider.landed {
    background: #000;
  }

  .content {
    min-width: 0;
    font-size: 1.08rem;
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
    font-size: 1.35rem;
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
    font-size: 0.92rem;
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
    font-size: 0.98rem;
    line-height: 1.36;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: clamp(1.5rem, 4vw, 2.5rem);
  }

  .contact-link {
    padding: 0.35rem 0.7rem;
    margin-left: -0.7rem;
    color: #000;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  .contact-link:hover {
    background: var(--color-surface-hover);
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
      font-size: 1.5rem;
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
      font-size: 1.02rem;
      transform: translateY(-50%);
    }

    .rail-link:nth-of-type(1) {
      top: 0.3125rem;
    }

    .rail-link:nth-of-type(2) {
      top: 1.6625rem;
    }

    .content {
      font-size: 1rem;
      line-height: 1.48;
    }

    .section-block {
      --divider-gap: 2.25rem;
      margin-top: var(--divider-gap);
      scroll-margin-top: 1.4rem;
    }

    .section-heading {
      margin-bottom: 1rem;
      font-size: 1.28rem;
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
      font-size: 0.84rem;
    }
  }

  @media (max-width: 360px) {
    .home-shell {
      grid-template-columns: minmax(4.95rem, 5.35rem) minmax(0, 1fr);
      column-gap: 0.8rem;
      padding: 0 1.5rem;
    }

    .name {
      font-size: 1.35rem;
    }

    .rail-link {
      font-size: 0.94rem;
    }
  }
</style>
