<script lang="ts">
  import Star from "lucide-svelte/icons/star";

  import Markdown from "$lib/components/Markdown.svelte";
  import { formatTime } from "$lib/utils";

  type Project = {
    title: string;
    date: string;
    link: string;
    content: string;
    repo: string;
    topics: string[];
    lead: string;
    image_before: string;
    image_after: string;
    image_border?: boolean;
    subimages?: string[];
    highlight: boolean;
  };

  export let data: Project;
  // export let images: Record<string, { default: string }>;
  export let stars: Record<string, number> | null = null;

  let hovered = false;
  // Treat image_after as an MP4 if it ends with .mp4; otherwise fall back to image hover swap.
  let is_video: boolean;
  $: is_video = /\.mp4($|\?)/.test(data.image_after ?? "");
  $: image_path = is_video
    ? `${data.image_before}`
    : hovered
      ? `${data.image_after}`
      : `${data.image_before}`;

  let video_el: HTMLVideoElement | null = null;

  const DEBUG = false;
  const log = (...args: any[]) => { if (DEBUG) console.log("[hover-video]", ...args); };
  let detach_listeners: Array<() => void> = [];
  function attachDebug(v: HTMLVideoElement) {
    // Log key media events and states
    const events = ["loadedmetadata","canplay","canplaythrough","play","pause","waiting","stalled","suspend","error","ended","timeupdate"];
    events.forEach((type) => {
      const h = (e: Event) => log(type, { readyState: v.readyState, networkState: v.networkState, currentTime: v.currentTime, paused: v.paused });
      v.addEventListener(type, h);
      detach_listeners.push(() => v.removeEventListener(type, h));
    });
    log("bound video", { src: data.image_after, canPlayType: v.canPlayType("video/mp4") });
    if (v.error) log("initial mediaError", v.error);
  }
</script>

<!-- Stars and tags (pill bar) -->
<!-- <div class="flex flex-wrap mb-1">
  <a
    class="pill hover:!bg-neutral-200 transition-colors"
    href="https://github.com/{data.repo}/stargazers"
  >
    <Star size={14} class="fill-current" />
    {#if stars?.[data.repo] !== undefined}
      <span class="ml-1">{stars[data.repo].toLocaleString()}</span>
    {:else}
      <span>&ZeroWidthSpace;</span>
    {/if}
  </a>
  {#each data.topics as tag}
    <div class="pill">{tag}</div>
  {/each}
</div> -->

<!-- Description and image -->
<div
  role="group"
  class={data.highlight
    ? "block -mx-4 px-4 py-3 hover:bg-emerald-50 bg-mint transition-colors"
    : "block -mx-4 px-4 py-1 transition-colors"}
  on:mouseenter={() => {
    hovered = true;
    if (!is_video || !video_el) return;
    // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    //   log("skipping play due to prefers-reduced-motion");
    //   return;
    // }
    video_el.muted = true;
    video_el.playsInline = true;
    const p = video_el.play();
    log("play() called", { readyState: video_el.readyState, networkState: video_el.networkState });
    p.then(() => log("play() resolved")).catch((err) => log("play() rejected", err?.name, err?.message));
  }}
  on:mouseleave={() => {
    hovered = false;
    if (is_video && video_el) {
      video_el.pause();
      try { video_el.currentTime = 0; } catch {}
    }
  }}
>
  <div class="project-row">
    <div class="project-media">
      <!-- Wrapper reserves layout via the IMG; VIDEO overlays and fades in on hover -->
      <div class="project-image">
        <img
          src="{image_path}"
          alt="{data.title} preview image"
            class:border={data.image_border}
            class="w-full block"
          />
        {#if is_video}
          <video
            bind:this={video_el}
            class="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style="opacity: {hovered ? 1 : 0}; transition: opacity 160ms ease;"
            preload="metadata"
            muted
            loop
            playsinline
            aria-hidden="true"
            tabindex="-1"
            poster="{data.image_before}"
          >
            <source src="{data.image_after}" type="video/mp4" />
          </video>
        {/if}
      </div>
    </div>
    <div class="project-copy">
      <!-- Title -->
      <h3 class="text-black text-lg font-semibold mb-2">
        <span class="mr-1">
          <a class="link-no-underline" href={data.link} target="_blank"
            >{data.title}</a
          >
        </span>
        <!-- <small class="whitespace-nowrap text-neutral-500 text-base font-normal">
          {formatTime("%b %Y", data.date)}
        </small> -->
      </h3>
      <!-- <p class="text-lg font-light mb-3">{data.lead}</p> -->
      <div class="project-meta text-sm">
        <Markdown
          source={data.content}
          plainFirstParagraphLinks
          buttonLastParagraphLinks
          openLinksInNewTab
        />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .project-row {
    display: flex;
    align-items: flex-start;
    column-gap: 0.75rem;
  }

  .project-copy {
    min-width: 0;
    flex: 1 1 0;
  }

  .project-copy h3 {
    margin-bottom: 0.35rem;
    line-height: 1.28;
  }

  .project-meta :global(.md-output) {
    line-height: 1.28;
  }

  .project-meta :global(.md-output p) {
    margin-bottom: 0.35rem;
  }

  .project-media {
    flex: 0 0 auto;
    width: clamp(3.5rem, 17vw, 6.25rem);
    margin-left: 0;
  }

  .project-image {
    position: relative;
    width: 100%;
  }

  @media (min-width: 600px) {
    .project-row {
      column-gap: 1.25rem;
    }

    .project-media {
      width: 8.75rem;
    }
  }

  .pill {
    @apply flex items-center text-sm font-medium;
    @apply px-1.5 py-[1px] mr-1.5 mb-2 bg-neutral-100 rounded-full;
  }
</style>
