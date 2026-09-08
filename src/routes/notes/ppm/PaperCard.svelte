<aside class="paper-card" aria-label="Paper resources">
  <div class="thumbnail">
    <img
      src="/notes/ppm/method_small.png"
      alt="Progressive point matching method diagram"
    />
  </div>

  <div class="min-w-0">
    <a
      href="/assets/pdf/ppm.pdf"
      class="paper-title"
      target="_blank"
      rel="noreferrer"
    >
      Long-Horizon Language Model Reinforcement Learning via Progressive Point
      Matching
    </a>
    <div class="mb-3 text-sm leading-5 text-neutral-700">
      <a href="/" class="author-link">Preston Fu</a>*,
      <a
        href="https://kvfrans.com/"
        class="author-link"
        target="_blank"
        rel="noreferrer"
      >Kevin Frans</a>*,
      <a
        href="https://olehrybkin.com/"
        class="author-link"
        target="_blank"
        rel="noreferrer"
      >Oleh Rybkin</a>,
      <a
        href="https://people.eecs.berkeley.edu/~svlevine/"
        class="author-link"
        target="_blank"
        rel="noreferrer"
      >Sergey Levine</a>, and
      <a
        href="https://aviralkumar2907.github.io/"
        class="author-link"
        target="_blank"
        rel="noreferrer"
      >Aviral Kumar</a>
    </div>
    <div class="flex flex-wrap gap-2">
      <a
        href="/assets/pdf/ppm.pdf"
        class="resource-button"
        target="_blank"
        rel="noreferrer"
      >Paper</a>
      <a
        href="https://github.com/prestonfu/ppm"
        class="resource-button"
        target="_blank"
        rel="noreferrer"
      >Code</a>
    </div>
  </div>
</aside>

<style lang="postcss">
  .paper-card {
    @apply mb-14 grid w-full grid-cols-[96px,minmax(0,1fr)] items-center gap-4 p-3 sm:grid-cols-[128px,minmax(0,1fr)] sm:p-4;
    background: #d6f0e0;
    user-select: none;
    -webkit-user-select: none;
  }

  .thumbnail {
    @apply aspect-square overflow-hidden bg-white;
  }

  .thumbnail img {
    @apply h-full w-full object-contain;
    object-position: center;
  }

  .resource-button {
    @apply px-2 py-1 text-[15px] leading-4 text-white no-underline transition-colors;
    background: #30b265;
  }

  .resource-button:hover {
    background: #269656;
    color: white;
  }

  .paper-title {
    @apply mb-2 block text-[17px] font-medium leading-6 text-black no-underline decoration-neutral-600 underline-offset-[3px] hover:underline;
  }

  .author-link {
    @apply text-neutral-700 no-underline decoration-neutral-500 underline-offset-[3px] hover:text-black hover:underline;
  }
</style>
