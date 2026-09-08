<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import NotesList from "./NotesList.svelte";
  import notes from "./notes.yaml";
</script>

<Seo title="Preston Fu – Notes" description="Writing" />

<div class="text-lg">
  <div class="layout-md space-y-8">
    <p>
      Writing and scribbles of varied quality. Feel free to reach out with any comments!
    </p>
    <section>
      <h2 class="heading2">Research Blogs</h2>
      <NotesList data={notes.research} />
    </section>
    <section>
      <h2 class="heading2">Scribing</h2>
      <p class="mb-2">Some of my favorite courses at Berkeley!</p>
      <NotesList data={notes.courses} />
    </section>
    <section>
      <h2 class="heading2">Long ago</h2>
      <p class="mb-2">
        Before undergrad, I considered studying pure math. Some things I was reading:
      </p>
      <NotesList data={notes.artifacts} />
    </section>
  </div>
</div>
