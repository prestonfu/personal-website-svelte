<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import ArticleMarkdown from "./ArticleMarkdown.svelte";
  import content from "./content.md?raw";
</script>

<Seo
  title="Progressive Point Matching"
  description="Assigning partial credit to improve reinforcement learning for long-horizon reasoning tasks."
/>

<svelte:head>
  <link
    rel="canonical"
    href="https://prestonfu.com/notes/ppm/"
  />
</svelte:head>

<article class="mx-auto max-w-[800px] px-8 sm:px-6">
  <ArticleMarkdown source={content} />
</article>
