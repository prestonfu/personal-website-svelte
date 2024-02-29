<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import NotesList from "./NotesList.svelte";
  import notes from "./notes.yaml";
</script>

<Seo
  title="Preston Fu – Writing"
  description="Past writing: academic papers, presentations, notes, tutorials, and technical blog posts."
/>

<div class="layout-md space-y-12">
  <p>
    I like to write out my notes in English for future reference; perhaps they 
    are useful to you too. You may notice that the notes still have TODOs on them;
    if you happen to know how to resolve them, please let me know.
  </p>
</div>
<section class="layout-md py-5">
  <!-- <h2 class="heading2">Notes and Tutorials</h2> -->
  <NotesList data={notes} />
</section>
