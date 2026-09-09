<script lang="ts">
  import { marked } from "marked";

  export let source: string;
  export let plainFirstParagraphLinks = false;

  marked.use({
    renderer: {
      link(href: string, title: string | null | undefined, text: string) {
        let out = `<a rel="external" href="${encodeURI(href)}" class="link" target="_blank"`;
        if (title) {
          out += ' title="' + title + '"';
        }
        out += ">" + text + "</a>";
        return out;
      },
    },
  });

  $: html = marked.parse(source);
</script>

<div class:plain-first-paragraph-links={plainFirstParagraphLinks} class="md-output">
  {@html html}
</div>

<style lang="postcss">
  .md-output :global(p) {
    @apply mb-2;
  }

  .md-output :global(strong) {
    @apply font-semibold;
  }

  .md-output :global(code) {
    @apply text-[95%];
  }

  .md-output.plain-first-paragraph-links :global(p:first-child a) {
    text-decoration-line: none;
  }

  .md-output.plain-first-paragraph-links :global(p:first-child a:hover) {
    text-decoration-line: underline;
    text-underline-offset: 3px;
  }
</style>
