<aside class="paper-card" aria-label="Paper resources">
  <div class="thumbnail">
    <img
      src="/notes/ppm/method_small.png"
      alt="Progressive point matching method diagram"
    />
  </div>

  <div class="paper-copy">
    <a
      href="https://arxiv.org/abs/2609.07303"
      class="paper-title"
      target="_blank"
      rel="noreferrer"
    >
      Long-Horizon Language Model Reinforcement Learning via Progressive Point
      Matching
    </a>
    <div class="paper-authors mb-3 text-sm leading-5">
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
        href="https://arxiv.org/abs/2609.07303"
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
    @apply mb-5 flex w-full items-start p-3 sm:p-4;
    column-gap: 0.75rem;
    background: #d6f0e0;
    user-select: none;
    -webkit-user-select: none;
  }

  .paper-copy {
    min-width: 0;
    flex: 1 1 0;
  }

  .thumbnail {
    @apply aspect-square overflow-hidden bg-white;
    flex: 0 0 auto;
    width: clamp(3.5rem, 17vw, 6.25rem);
  }

  .thumbnail img {
    @apply h-full w-full object-contain;
    object-position: center;
  }

  .resource-button {
    @apply px-2 py-1 text-sm leading-4 text-white no-underline transition-colors;
    background: #30b265;
  }

  .resource-button:hover {
    background: #269656;
    color: white;
  }

  .paper-title {
    @apply mb-2 block text-md font-medium leading-6 text-black no-underline underline-offset-[3px] hover:underline;
    text-decoration-color: var(--color-link-decoration);
  }

  .paper-authors {
    color: var(--color-text);
  }

  .author-link {
    @apply no-underline underline-offset-[3px] hover:text-black hover:underline;
    color: var(--color-text);
    text-decoration-color: var(--color-link-decoration);
  }

  @media (min-width: 600px) {
    .paper-card {
      column-gap: 1.25rem;
    }

    .thumbnail {
      width: 8.75rem;
    }
  }
</style>
