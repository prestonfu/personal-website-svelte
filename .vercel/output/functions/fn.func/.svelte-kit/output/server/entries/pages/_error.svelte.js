import { c as create_ssr_component, v as validate_component, b as subscribe, e as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { I as Icon } from "../../chunks/Icon.js";
const Bug = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "m8 2 1.88 1.88" }],
    ["path", { "d": "M14.12 3.88 16 2" }],
    [
      "path",
      {
        "d": "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"
      }
    ],
    [
      "path",
      {
        "d": "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"
      }
    ],
    ["path", { "d": "M12 20v-9" }],
    ["path", { "d": "M6.53 9C4.6 8.8 3 7.1 3 5" }],
    ["path", { "d": "M6 13H2" }],
    ["path", { "d": "M3 21c0-2.1 1.7-3.9 3.8-4" }],
    ["path", { "d": "M20.97 5c0 2.1-1.6 3.8-3.5 4" }],
    ["path", { "d": "M22 13h-4" }],
    ["path", { "d": "M17.2 17c2.1.1 3.8 1.9 3.8 4" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "bug" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Bug$1 = Bug;
const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<div class="layout-md"><div class="pt-14 pb-40 sm:pt-20 sm:pb-80 text-xl flex justify-center items-center">${validate_component(Bug$1, "Bug").$$render($$result, { class: "mr-2" }, {}, {})} <span class="font-medium">${escape($page.status)}</span> <div class="mx-4 h-8 border-l border-black"></div> ${escape($page.error?.message)}</div></div>`;
});
export {
  Error as default
};
