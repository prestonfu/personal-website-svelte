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
        I'm a third-year electrical engineering and computer science undergrad
        at UC Berkeley. I am also a researcher at
        <a class="link" href="https://bair.berkeley.edu/" target="_blank">
          Berkeley Artificial Intelligence Research</a
        >, where I am advised by
        <a
          class="link"
          href="https://people.eecs.berkeley.edu/~svlevine/"
          target="_blank"
        >
          Sergey Levine</a
        >. Previously, I have been advised by
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
        My technical interests include reinforcement learning, generative
        models, probability, and algorithms.
      </p>
    </div>
    <div
      class="mt-6 md:mt-0 flex-shrink-0 flex justify-center md:justify-start"
    >
      <img
        src="/assets/images/big-game.jpg"
        alt="Go bears!"
        class="w-60 h-60 md:w-36 md:h-36 md:rounded-full object-cover"
      />
    </div>
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
