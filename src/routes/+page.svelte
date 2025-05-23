<script lang="ts">
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
  import Seo from "$lib/components/Seo.svelte";

  //   const featuredProjects = [
  //     {
  //       name: "sshx",
  //       href: "/projects#sshx",
  //       desc: "secure web-based, collaborative terminal",
  //     },
  //     {
  //       name: "Bore",
  //       href: "/projects#bore",
  //       desc: "bypass your NAT in just 400 lines of code",
  //       aside: "7500+ stars on GitHub",
  //     },
  //     {
  //       name: "Percival",
  //       href: "/projects#percival",
  //       desc: "reactive notebooks for exploratory data analysis",
  //     },
  //     {
  //       name: "Rustpad",
  //       href: "/projects#rustpad",
  //       desc: "self-hosted collaborative text editor",
  //       aside: "2M+ downloads",
  //     },
  //     {
  //       name: "Crepe",
  //       href: "/projects#crepe",
  //       desc: "compiled Datalog language in Rust",
  //       aside: "used by distributed databases & security systems",
  //     },
  //     {
  //       name: "FastSeg",
  //       href: "/projects#fastseg",
  //       desc: "real-time semantic segmentation for self-driving cars",
  //     },
  //     {
  //       name: "Set with Friends",
  //       href: "/projects#setwithfriends",
  //       desc: "online multiplayer card game",
  //       aside: "30M+ page views, 900K+ users",
  //     },
  //   ];
  //

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import CalendarDays from "lucide-svelte/icons/calendar-days";
  import Star from "lucide-svelte/icons/star";

  import Project from "./projects/Project.svelte";

  const projects = import.meta.glob("../projects/*.md", {
    eager: true,
  }) as any;
  const images = import.meta.glob("../projects/*.{png,jpg,svg,gif}", {
    eager: true,
  }) as any;

  function trimName(id: string) {
    return id.match(/\.\.\/projects\/(.*)\.md$/)?.[1];
  }

  $: projectsByDate = Object.keys(projects).sort(
    (a, b) => projects[b].date - projects[a].date
  );
  $: projectsByTitle = Object.keys(projects).sort((a, b) => {
    const titleA = projects[a].title.toLowerCase();
    const titleB = projects[b].title.toLowerCase();
    return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
  });

  onMount(() => {
    // Hack: Fix the scroll position after the page loads, especially for mobile browsers.
    const selected = $page.url.hash.slice(1);
    if (selected) {
      setTimeout(() => {
        if ($page.url.hash.slice(1) === selected) {
          document.getElementById(selected)?.scrollIntoView();
        }
      }, 500);
    }
  });

  let stars: Record<string, number> | null = null;
  onMount(async () => {
    const resp = await fetch(
      "https://api.github.com/users/ekzhang/repos?per_page=100"
    );
    const repos = await resp.json();
    stars = {};
    for (const obj of repos) {
      stars[obj.full_name] = obj.stargazers_count;
    }
  });

  $: projectsByStars = [...projectsByTitle].sort((a, b) => {
    const starsA = stars?.[projects[a].repo] ?? 0;
    const starsB = stars?.[projects[b].repo] ?? 0;
    return starsB - starsA;
  });

  let sortOrder: "date" | "stars" = "date";

</script>

<Seo title="Preston Fu" description="Undergrad at UC Berkeley" />

<!-- <p
  class="layout-md text-black text-xl leading-tight font-light mb-16"
  id="preston-is"
>
  <span class="g">is a</span> software engineer<span class="g">,</span><br />
  researcher<span class="g">, and</span><br />
  designer<span class="g">.</span>
</p> -->

<div class="layout-md text-lg space-y-12">
  <div
    class="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6"
  >
    <div class="flex-1">
      <p>
        Hi! I'm Preston, a third-year undergrad at UC Berkeley. I am also a researcher at
        <a class="link" href="https://bair.berkeley.edu/" target="_blank">
          Berkeley Artificial Intelligence Research</a
        > advised by
        <a
          class="link"
          href="https://people.eecs.berkeley.edu/~svlevine/"
          target="_blank"
        >
          Sergey Levine</a
        >. Previously, I've been advised by
        <a
          class="link"
          href="https://people.eecs.berkeley.edu/~klein/"
          target="_blank">Dan Klein</a
        >,
        <a
          class="link"
          href="https://people.eecs.berkeley.edu/~trevor/"
          target="_blank">Trevor Darrell</a
        >, and
        <a
          class="link"
          href="https://bayen.berkeley.edu/alex-bayen"
          target="_blank">Alexandre Bayen</a
        >.
      </p>
      <div class="mt-4" />
      <p>
        I'm interested in building intelligent systems that can efficiently
        learn general skills.
      </p>
    </div>
    <div
      class="mt-6 md:mt-0 flex-shrink-0 flex justify-center md:justify-start"
    >
      <img
        src="/assets/images/big-game.jpg"
        alt="Go bears!"
        class="w-80 h-80 md:w-48 md:h-48 md:rounded-full object-cover"
      />
    </div>
  </div>

  <div>
    <h2 class="heading2 text-xl mb-2">News</h2>
    <ul class="list-disc ml-4">
      <li>
        <b>May 2025</b>: I'm an
        <a
          class="link"
          href="https://eecs.berkeley.edu/resources/undergrads/accel/"
          target="_blank">Accel Scholar</a
        >!
      </li>
      <li>
        <b>May 2025</b>: New
        <a class="link" href="https://arxiv.org/abs/2502.04327" target="_blank"
          >paper</a
        > on scaling laws for value-based RL is accepted to ICML!
      </li>
    </ul>
  </div>

  <div class="space-y-2">
  <h2 class="heading2 text-xl space-y-5">Research</h2>
  {#each sortOrder === "date" ? projectsByDate : projectsByStars as id (id)}
    <section id={trimName(id)}>
      <!-- <div class="mx-auto max-w-[1152px] px-4 sm:px-6"> -->
        <Project data={projects[id]} {images} {stars} />
      <!-- </div> -->
    </section>
  {/each}
  </div>
</div>

<!-- <div class="leading-snug space-y-4">
    <p class="pb-2">Notable open-source work:</p>

    {#each featuredProjects as project}
      <a class="project-pair" href={project.href}>
        <div class="text-black font-medium">
          {project.name}
          <ArrowUpRight size={18} class="inline text-neutral-400" />
        </div>
        <div>
          <p>{project.desc}</p>
          {#if project.aside}
            <aside>{project.aside}</aside>
          {/if}
        </div>
      </a>
    {/each}
  </div> -->

<!-- <div class="space-y-5">
    <img
      alt="Self-portrait photograph of Preston Fu at his desk"
      src="/assets/images/profile4.jpg"
    />
  </div> -->

<style lang="postcss">
  .g {
    @apply text-neutral-400;
  }

  em {
    @apply font-serif text-[110%] leading-[100%];
  }

  .project-pair {
    @apply grid sm:grid-cols-[1fr,2fr] gap-y-1 -mx-3 px-3 py-2 hover:bg-neutral-100 transition-colors;
  }

  aside {
    @apply mt-0.5 text-base text-neutral-500;
  }

  /* Correction for vertical navigation links on mobile. */
  @media (max-width: 420px) {
    #preston-is {
      @apply -mt-10;
    }
  }
</style>
