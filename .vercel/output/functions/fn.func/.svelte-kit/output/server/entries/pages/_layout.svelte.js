import { c as create_ssr_component, b as subscribe, e as escape, d as each, f as add_attribute, v as validate_component } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
const css$1 = {
  code: "nav.svelte-bgdsr9.svelte-bgdsr9.svelte-bgdsr9{display:flex;align-items:flex-start;justify-content:flex-end\n}nav.svelte-bgdsr9>.svelte-bgdsr9:not([hidden])~.svelte-bgdsr9:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1.5rem * var(--tw-space-x-reverse));margin-left:calc(1.5rem * calc(1 - var(--tw-space-x-reverse)))\n}nav.svelte-bgdsr9.svelte-bgdsr9.svelte-bgdsr9{padding-top:0.125rem;padding-bottom:0.125rem;font-size:1.125rem;line-height:1.75rem;--tw-text-opacity:1;color:rgb(115 115 115 / var(--tw-text-opacity))\n}.page-title.svelte-bgdsr9.svelte-bgdsr9.svelte-bgdsr9{font-weight:300\n}@media(max-width: 580px){.page-title.svelte-bgdsr9.svelte-bgdsr9.svelte-bgdsr9{display:block;font-size:1.25rem;line-height:1.75rem\n    }.page-title.svelte-bgdsr9 .svelte-bgdsr9.svelte-bgdsr9:first-child{display:none\n    }}@media(max-width: 420px){nav.svelte-bgdsr9.svelte-bgdsr9.svelte-bgdsr9{flex-direction:column;align-items:flex-end\n    }nav.svelte-bgdsr9>.svelte-bgdsr9:not([hidden])~.svelte-bgdsr9:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(0px * var(--tw-space-x-reverse));margin-left:calc(0px * calc(1 - var(--tw-space-x-reverse)))\n    }}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const links = [
    // { name: "projects", href: "/projects" },
    { name: "Notes", href: "/notes" }
  ];
  let pageTitle = null;
  $$result.css.add(css$1);
  {
    {
      const link = links.find(({ href }) => href === $page.url.pathname);
      if (link) {
        pageTitle = link.name.charAt(0).toUpperCase() + link.name.slice(1);
      } else {
        pageTitle = null;
      }
    }
  }
  $$unsubscribe_page();
  return `<header class="layout-md flex justify-between items-start" data-sveltekit-noscroll data-sveltekit-preload-code="eager"><a href="/" class="mb-8"><div class="flex items-center"><h1 class="font-bold text-black text-2xl">Preston Fu
        ${pageTitle ? `<span class="page-title svelte-bgdsr9"><span class="text-neutral-400 svelte-bgdsr9" data-svelte-h="svelte-13sl46h">—</span> ${escape(pageTitle)}</span>` : ``}</h1> </div></a> <nav class="svelte-bgdsr9">${each(links, (link) => {
    return `<a${add_attribute("href", link.href, 0)} class="${[
      "hover:text-black transition-colors svelte-bgdsr9",
      $page.url.pathname === link.href ? "text-black" : ""
    ].join(" ").trim()}">${escape(link.name)} </a>`;
  })}</nav> </header>`;
});
const css = {
  code: ".row.svelte-1t3hv3r.svelte-1t3hv3r.svelte-1t3hv3r{display:flex;align-items:center\n}.row.svelte-1t3hv3r>.svelte-1t3hv3r:not([hidden])~.svelte-1t3hv3r:not([hidden]){--tw-space-x-reverse:0;margin-right:calc(1rem * var(--tw-space-x-reverse));margin-left:calc(1rem * calc(1 - var(--tw-space-x-reverse)))\n}.row.svelte-1t3hv3r span.svelte-1t3hv3r.svelte-1t3hv3r{--tw-text-opacity:1;color:rgb(115 115 115 / var(--tw-text-opacity))\n}.row.svelte-1t3hv3r hr.svelte-1t3hv3r.svelte-1t3hv3r{margin-top:0.125rem;width:100%;border-style:dotted;--tw-border-opacity:1;border-color:rgb(212 212 212 / var(--tw-border-opacity))\n}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<footer class="layout-md text-lg mt-20 flex flex-col" data-svelte-h="svelte-1s0i8lg"><div class="row svelte-1t3hv3r"><span class="svelte-1t3hv3r">GitHub</span> <hr class="svelte-1t3hv3r"> <a class="link svelte-1t3hv3r" href="https://github.com/prestonfu" target="_blank">@prestonfu</a></div> <div class="row svelte-1t3hv3r"><span class="svelte-1t3hv3r">Email</span> <hr class="svelte-1t3hv3r">
    prestonfu&lt;at&gt;berkeley&lt;dot&gt;edu</div> </footer>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-1xw0bo2_START -->${`<script async src="https://www.googletagmanager.com/gtag/js?id=UA-156644599-1" data-svelte-h="svelte-5wi4mp"><\/script> <script data-svelte-h="svelte-iuq0cl">window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "UA-156644599-1");<\/script>`}<!-- HEAD_svelte-1xw0bo2_END -->`, ""} ${validate_component(Header, "Header").$$render($$result, {}, {}, {})} ${`<main>${slots.default ? slots.default({}) : ``}</main>`} ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
