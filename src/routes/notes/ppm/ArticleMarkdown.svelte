<script context="module" lang="ts">
  import { Marked } from "marked";
  import markedKatex from "marked-katex-extension";
  import "katex/dist/katex.min.css";

  function slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function injectFootnotes(markdown: string) {
    let count = 0;

    return markdown.replace(/(\S+[.!?])?[ \t]*\(Footnote:\s*([^)]+?)\)/g, (_, anchorText: string | undefined, note: string) => {
      count += 1;

      const content = note.trim().replace(/\s+/g, " ");
      const label = escapeHtml(`Footnote ${count}: ${content}`);
      const parseableContent = content.replace(/(\S)(\$[^$\n]+?\$)/g, "$1<!-- -->$2");
      const renderedContent = parser.parseInline(parseableContent);
      const marker = `<sup class="footnote" tabindex="0" aria-label="${label}">[${count}]<span class="footnote-popover" role="tooltip">${renderedContent}</span></sup>`;

      return anchorText
        ? `<span class="footnote-anchor">${anchorText}&#8288;${marker}</span>`
        : marker;
    });
  }

  function parseArticleMarkdown(markdown: string) {
    return parser.parse(injectFootnotes(markdown));
  }

  const parser = new Marked({
    gfm: true,
  });

  parser.use(
    markedKatex({
      throwOnError: false,
    }),
  );

  parser.use({
    renderer: {
      link(href: string, title: string | null | undefined, text: string) {
        const external = /^https?:\/\//.test(href);
        const pdf = /\.pdf(?:$|\?)/i.test(href);
        const titleAttr = title ? ` title="${title}"` : "";
        const externalAttrs = external || pdf
          ? ' target="_blank" rel="external noopener noreferrer"'
          : "";

        return `<a href="${encodeURI(href)}"${titleAttr}${externalAttrs}>${text}</a>`;
      },
      heading(text: string, level: number, raw: string) {
        return `<h${level} id="${slugify(raw)}">${text}</h${level}>`;
      },
      image(href: string, title: string | null | undefined, text: string) {
        const caption = title ? parser.parseInline(title) : "";
        const id = `fig-${slugify(text)}`;
        const media = /\.(mp4|webm|ogg)(?:$|\?)/i.test(href)
          ? `<video id="${id}" aria-label="${text}" autoplay muted loop playsinline controls preload="metadata"><source src="${href}" /></video>`
          : `<img id="${id}" src="${href}" alt="${text}" loading="lazy" />`;

        return `<figure>${media}${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
      },
    },
  });
</script>

<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import PaperCard from "./PaperCard.svelte";

  export let source: string;

  let articleEl: HTMLElement;

  const cardMarker = "<!-- ppm-resource-card -->";
  const mobileFootnoteGap = 8;
  const mobileFootnotePadding = 16;
  const footnoteViewportPadding = 16;

  function getFootnote(target: EventTarget | null) {
    return target instanceof Element
      ? target.closest<HTMLElement>(".footnote")
      : null;
  }

  function positionMobileFootnote(event: Event) {
    const footnote = getFootnote(event.target);
    const popover = footnote?.querySelector<HTMLElement>(".footnote-popover");

    if (!footnote || !popover) return;

    footnote.style.setProperty("--footnote-popover-offset", "0px");

    if (!window.matchMedia("(max-width: 520px)").matches) {
      const rect = popover.getBoundingClientRect();
      const rightLimit = window.innerWidth - footnoteViewportPadding;
      let offset = 0;

      if (rect.left < footnoteViewportPadding) {
        offset = footnoteViewportPadding - rect.left;
      } else if (rect.right > rightLimit) {
        offset = rightLimit - rect.right;
      }

      footnote.style.setProperty("--footnote-popover-offset", `${offset}px`);
      return;
    }

    const markerRect = footnote.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    let top = markerRect.top - popoverRect.height - mobileFootnoteGap;

    if (top < mobileFootnotePadding) {
      top = markerRect.bottom + mobileFootnoteGap;
    }

    top = Math.min(
      Math.max(top, mobileFootnotePadding),
      window.innerHeight - mobileFootnotePadding - popoverRect.height,
    );

    footnote.style.setProperty("--footnote-popover-top", `${top}px`);
  }

  function makeBibtexCopyable(root: HTMLElement) {
    const copyIcon = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>`;
    const checkIcon = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"></path>
      </svg>`;
    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>('pre > code[class~="language-bibtex"]'),
    );

    for (const code of blocks) {
      const pre = code.parentElement as HTMLElement | null;
      if (!pre || pre.dataset.copyable) continue;

      pre.dataset.copyable = "true";

      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = copyIcon;
      button.className = "copy-btn";
      button.setAttribute("aria-label", "Copy BibTeX");
      button.title = "Copy BibTeX";
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.innerHTML = checkIcon;
          button.setAttribute("aria-label", "Copied BibTeX");
          button.title = "Copied";
        } catch {
          button.textContent = "Error";
          button.setAttribute("aria-label", "Copy failed");
          button.title = "Copy failed";
        }

        setTimeout(() => {
          button.innerHTML = copyIcon;
          button.setAttribute("aria-label", "Copy BibTeX");
          button.title = "Copy BibTeX";
        }, 500);
      });

      pre.appendChild(button);
    }
  }

  onMount(() => {
    makeBibtexCopyable(articleEl);
  });

  afterUpdate(() => {
    makeBibtexCopyable(articleEl);
  });

  $: markerIndex = source.indexOf(cardMarker);
  $: beforeCard =
    markerIndex === -1 ? source : source.slice(0, markerIndex);
  $: afterCard =
    markerIndex === -1
      ? ""
      : source.slice(markerIndex + cardMarker.length);
  $: beforeCardHtml = parseArticleMarkdown(beforeCard);
  $: afterCardHtml = parseArticleMarkdown(afterCard);
</script>

<div
  bind:this={articleEl}
  class="article-markdown"
  on:pointerover={positionMobileFootnote}
  on:pointerdown={positionMobileFootnote}
  on:focusin={positionMobileFootnote}
>
  {@html beforeCardHtml}
  {#if markerIndex !== -1}
    <PaperCard />
    {@html afterCardHtml}
  {/if}
</div>

<style lang="postcss">
  .article-markdown {
    @apply text-md leading-7;
    color: var(--color-text);
    font-family: "IBM Plex Sans Article", "IBM Plex Sans", sans-serif;
  }

  .article-markdown :global(*)::selection {
    background: #d6f0e0;
    color: #111111;
  }

  .article-markdown :global(h1) {
    @apply mx-auto mb-2 mt-0 max-w-[720px] text-center text-2xl font-medium leading-tight text-black;
  }

  .article-markdown :global(h1 + p) {
    @apply mx-auto mb-14 max-w-[700px] text-center text-md leading-7;
    color: var(--color-text-muted);
  }

  .article-markdown :global(h1 + p a) {
    @apply no-underline transition-colors;
    color: var(--color-text);
    text-decoration-color: var(--color-link-decoration);
  }

  .article-markdown :global(h1 + p a:hover) {
    @apply text-black underline underline-offset-[3px];
  }

  .article-markdown :global(h2) {
    @apply mb-4 mt-14 text-xl font-medium leading-tight text-black;
  }

  .article-markdown :global(h3) {
    @apply mb-3 mt-10 text-lg font-medium leading-snug text-black;
  }

  .article-markdown :global(p) {
    @apply mb-4;
  }

  .article-markdown > :global(:last-child) {
    margin-bottom: 0;
  }

  .article-markdown :global(ul),
  .article-markdown :global(ol) {
    @apply mb-4 ml-6;
  }

  .article-markdown :global(ul) {
    @apply list-disc;
  }

  .article-markdown :global(ol) {
    @apply list-decimal;
  }

  .article-markdown :global(li) {
    @apply mb-0.5 pl-1;
  }

  .article-markdown :global(a) {
    @apply underline underline-offset-[3px] transition-colors;
    text-decoration-color: var(--color-link-decoration);
  }

  .article-markdown :global(a:hover) {
    @apply text-black decoration-black;
  }

  .article-markdown :global(.footnote) {
    @apply relative inline-block align-baseline text-[0.65em] transition-colors;
    --footnote-popover-top: 1rem;
    --footnote-popover-offset: 0px;
    color: #30b265;
    cursor: default;
    font-family: inherit;
    font-weight: inherit;
    line-height: 0;
    margin-left: 0;
    top: -0.7em;
    white-space: nowrap;
  }

  .article-markdown :global(.footnote-anchor) {
    white-space: nowrap;
  }

  .article-markdown :global(.footnote:hover),
  .article-markdown :global(.footnote:focus-visible) {
    @apply underline underline-offset-2;
    color: #269656;
    text-decoration-color: #269656;
    outline: none;
  }

  .article-markdown :global(.footnote-popover) {
    @apply invisible absolute bottom-[calc(100%+0.55rem)] left-1/2 z-30 max-w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 rounded border bg-white px-3 py-2 text-left text-base font-normal leading-6 opacity-0 transition;
    --tw-translate-x: calc(-50% + var(--footnote-popover-offset));
    border-color: var(--color-rule);
    color: var(--color-text);
    width: max-content;
    white-space: normal;
  }

  @media (max-width: 820px) {
    .article-markdown :global(.footnote-popover) {
      @apply fixed left-1/2 w-[min(360px,calc(100vw-2rem))] max-w-none -translate-x-1/2;
      top: var(--footnote-popover-top);
      bottom: auto;
    }
  }

  .article-markdown :global(.footnote:hover .footnote-popover),
  .article-markdown :global(.footnote:focus .footnote-popover) {
    @apply visible opacity-100;
  }

  .article-markdown :global(strong) {
    @apply font-semibold text-neutral-900;
  }

  .article-markdown :global(blockquote) {
    @apply my-7 border-l-4 border-sky-700 bg-sky-50 px-5 py-4 text-neutral-800;
  }

  .article-markdown :global(blockquote p:last-child),
  .article-markdown :global(blockquote ul:last-child) {
    @apply mb-0;
  }

  .article-markdown :global(figure) {
    @apply my-9;
  }

  .article-markdown :global(figure img),
  .article-markdown :global(figure video) {
    @apply mx-auto block h-auto max-h-[680px] w-full max-w-[760px] object-contain;
  }

  .article-markdown :global(figcaption) {
    @apply mx-auto mt-3 max-w-[680px] text-left text-sm leading-5;
    color: var(--color-text-subtle);
    width: fit-content;
  }

  .article-markdown :global(figcaption strong) {
    color: inherit;
  }

  .article-markdown
    :global(#fig-ppm-performance-as-the-task-horizon-grows) {
    max-width: 560px;
  }

  .article-markdown
    :global(#fig-progressive-point-matching-shortcutting-mechanism) {
    width: 80%;
  }

  .article-markdown
    :global(#fig-ppm-performance-at-larger-test-time-token-budgets) {
    width: 70%;
    max-width: 392px;
  }

  .article-markdown :global(hr) {
    @apply my-10 border-neutral-300;
  }

  .article-markdown :global(pre) {
    @apply mb-6 overflow-x-auto bg-neutral-100 p-4 text-sm;
  }

  .article-markdown :global(pre[data-copyable]) {
    position: relative;
  }

  .article-markdown :global(pre[data-copyable] .copy-btn) {
    position: absolute;
    top: 0.75rem;
    right: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.55rem;
    height: 1.55rem;
    background: #f3f4f6;
    border-radius: 0.25rem;
    color: #000;
    cursor: pointer;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  .article-markdown :global(pre[data-copyable] .copy-btn svg) {
    width: 0.95rem;
    height: 0.95rem;
  }

  .article-markdown :global(pre[data-copyable] .copy-btn:hover) {
    background: #e5e7eb;
  }

  .article-markdown :global(code) {
    @apply rounded bg-neutral-100 px-1 py-0.5 text-sm;
  }

  .article-markdown :global(pre code) {
    @apply rounded-none bg-transparent p-0 text-sm;
  }

  .article-markdown :global(.katex-display) {
    @apply my-7 overflow-x-auto overflow-y-hidden py-1;
  }

  @media (max-width: 420px) {
    .article-markdown :global(blockquote) {
      @apply px-4;
    }
  }

  @media (max-width: 600px) {
    .article-markdown
      :global(#fig-progressive-point-matching-shortcutting-mechanism),
    .article-markdown
      :global(#fig-ppm-performance-at-larger-test-time-token-budgets) {
      width: 100%;
      max-width: 100%;
    }
  }
</style>
