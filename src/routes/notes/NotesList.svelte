<script lang="ts">
  import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";

  import { formatTime } from "$lib/utils";

  type Writing = {
    title: string;
    date: Date;
    summary: string;
    link: string;
    newTab?: boolean;
  };

  export let data: Writing[];
</script>

<div class="grid gap-y-1">
  {#each data as item}
    <a
      href={item.link}
      class="block -mx-3 px-3 py-2 hover:bg-neutral-100 transition-colors"
      target={item.newTab === false ? undefined : "_blank"}
      rel={item.newTab === false ? undefined : "noreferrer"}
    >
      <div class="flex flex-col sm:flex-row sm:items-end mb-1.5">
        <div class="type-body-large text-black">
          {item.title}
          {#if item.newTab !== false}
            <ArrowUpRight size={18} class="inline text-neutral-400" />
          {/if}
        </div>
        <div class="sm:ml-auto mb-0.5 text-neutral-500">
          {formatTime("%B %Y", item.date)}
        </div>
      </div>
      <div class="type-body-large leading-snug font-serif">
        {item.summary}
      </div>
    </a>
  {/each}
</div>
