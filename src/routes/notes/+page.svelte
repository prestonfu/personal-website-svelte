<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import NotesList from "./NotesList.svelte";
  import notes from "./notes.yaml";
</script>

<Seo title="Preston Fu – Notes" description="Technical writing" />

<div class="text-lg">
  <div class="layout-md space-y-12">
    <p>
      Writeups for a wide variety of things. Some contain TODOs; if you happen to
      know how to resolve them, or observe that anything looks wrong, please don't 
      hesitate to reach out!
    </p>
  </div>
  <section class="layout-md py-5">
    <h2 class="heading2">Course Notes</h2>
    <NotesList data={notes.courses} />
  </section>
  <section class="layout-md py-5">
    <h2 class="heading2">Artifacts</h2>
    <div class="mb-5">
      Before undergrad, I considered studying pure math. Here are some summaries
      of what I was reading at the time.
    </div>
    <NotesList data={notes.artifacts} />
  </section>
</div>
