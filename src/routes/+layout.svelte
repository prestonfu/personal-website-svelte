<script lang="ts">
  import "../app.css";

  import { dev } from "$app/environment";

  import { inject } from '@vercel/analytics';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  inject({ mode: dev ? 'development' : 'production' });
  injectSpeedInsights();
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

<main>
  <slot />
</main>
