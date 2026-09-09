<script lang="ts">
  import { Marked } from "marked";

  export let source: string;
  export let plainFirstParagraphLinks = false;
  export let buttonLastParagraphLinks = false;
  export let openLinksInNewTab = false;

  function isExternalHref(href: string) {
    return /^(https?:)?\/\//i.test(href);
  }

  function parseMarkdown(markdown: string, forceNewTab: boolean) {
    const parser = new Marked({ gfm: true });

    parser.use({
      renderer: {
        link(href: string, title: string | null | undefined, text: string) {
          const shouldOpenInNewTab = forceNewTab || isExternalHref(href);
          const targetAttrs = shouldOpenInNewTab
            ? ' target="_blank" rel="external noopener noreferrer"'
            : "";
          const titleAttr = title ? ` title="${title}"` : "";

          return `<a href="${encodeURI(href)}" class="link"${titleAttr}${targetAttrs}>${text}</a>`;
        },
      },
    });

    return parser.parse(markdown);
  }

  $: html = parseMarkdown(source, openLinksInNewTab);
</script>

<div
  class:plain-first-paragraph-links={plainFirstParagraphLinks}
  class:button-last-paragraph-links={buttonLastParagraphLinks}
  class="md-output"
>
  {@html html}
</div>

<style lang="postcss">
  .md-output :global(p) {
    @apply mb-2;
  }

  .md-output > :global(:last-child) {
    margin-bottom: 0;
  }

  .md-output :global(strong) {
    @apply font-semibold;
  }

  .md-output :global(code) {
    @apply text-sm;
  }

  .md-output.plain-first-paragraph-links :global(p:first-child a) {
    text-decoration-line: none;
  }

  .md-output.plain-first-paragraph-links :global(p:first-child a:hover) {
    text-decoration-line: underline;
    text-underline-offset: 3px;
  }

  .md-output.button-last-paragraph-links :global(p:last-child) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.1rem;
  }

  .md-output.button-last-paragraph-links :global(p:last-child a) {
    display: inline-block;
    margin-left: -0.4rem;
    padding: 0.28rem 0.4rem;
    color: #000;
    text-decoration-line: none !important;
    text-underline-offset: 0;
    transition:
      background-color 140ms ease,
      color 140ms ease;
  }

  .md-output.button-last-paragraph-links :global(p:last-child a:hover) {
    background: var(--color-surface-hover);
    color: #000;
    text-decoration-line: none !important;
    text-underline-offset: 0;
  }

</style>
