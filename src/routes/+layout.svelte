<script lang="ts">
  import "../app.css";
  import { math, display } from "mathlifier";
  
  import { dev } from "$app/environment";
  import { page } from "$app/stores";

  import { inject } from '@vercel/analytics';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  inject({ mode: dev ? 'development' : 'production' });
  injectSpeedInsights();

  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $: isNoteDetail =
    $page.status < 400 &&
    data.pathname.startsWith("/notes/") && data.pathname !== "/notes/";

</script>

<svelte:head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <!-- {#if !dev}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-156644599-1"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "UA-156644599-1");
    </script>
  {/if} -->
</svelte:head>

{#if !isNoteDetail}
  <Header />
{/if}

<main>
  <slot />
</main>

{#if !isNoteDetail}
  <Footer />
{/if}
