import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BFc_DXHU.js","_app/immutable/chunks/scheduler.DncWI_c9.js","_app/immutable/chunks/index.zjPmmWb8.js","_app/immutable/chunks/each.Zm37TrhH.js","_app/immutable/chunks/stores.DvZIQ_wN.js","_app/immutable/chunks/entry.Bn0cuEiN.js"];
export const stylesheets = ["_app/immutable/assets/0.BY16jbD0.css"];
export const fonts = ["_app/immutable/assets/newsreader-vietnamese-400-italic.CleG-9Rg.woff2","_app/immutable/assets/newsreader-vietnamese-400-italic.iySEQg0n.woff","_app/immutable/assets/newsreader-latin-ext-400-italic.BtYoGYpg.woff2","_app/immutable/assets/newsreader-latin-ext-400-italic.CIu1K5fU.woff","_app/immutable/assets/newsreader-latin-400-italic.DAZ-RO9s.woff2","_app/immutable/assets/newsreader-latin-400-italic.BtVV2XX4.woff","_app/immutable/assets/ibm-plex-sans-cyrillic-ext-400-normal.BJItruJi.woff2","_app/immutable/assets/ibm-plex-sans-cyrillic-ext-400-normal.C1SKuNhx.woff","_app/immutable/assets/ibm-plex-sans-cyrillic-400-normal.BPWuI_CM.woff2","_app/immutable/assets/ibm-plex-sans-cyrillic-400-normal.CTUnhTqV.woff","_app/immutable/assets/ibm-plex-sans-greek-400-normal.n6oPB5VF.woff2","_app/immutable/assets/ibm-plex-sans-greek-400-normal.DSasf_jt.woff","_app/immutable/assets/ibm-plex-sans-vietnamese-400-normal.B97dYap6.woff2","_app/immutable/assets/ibm-plex-sans-vietnamese-400-normal.OKGpH0gQ.woff","_app/immutable/assets/ibm-plex-sans-latin-ext-400-normal.BHf956ki.woff2","_app/immutable/assets/ibm-plex-sans-latin-ext-400-normal.CyDjbWPV.woff","_app/immutable/assets/ibm-plex-sans-latin-400-normal.CdZtFfYS.woff2","_app/immutable/assets/ibm-plex-sans-latin-400-normal.BU83cd9M.woff"];
