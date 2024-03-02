import {
  S as f,
  i as _,
  s as g,
  k as m,
  J as p,
  l as u,
  h as s,
  n as l,
  D as d,
  F as h,
} from "./index.4b79d54d.js";
function T(c) {
  let n, t, o, r, i;
  return (
    (document.title = n = c[0]),
    {
      c() {
        (t = m("meta")), (o = m("meta")), (i = m("meta")), this.h();
      },
      l(e) {
        const a = p("svelte-1u7ey3", document.head);
        (t = u(a, "META", { name: !0, content: !0 })),
          (o = u(a, "META", { property: !0, content: !0 })),
          (i = u(a, "META", { property: !0, content: !0 })),
          a.forEach(s),
          this.h();
      },
      h() {
        l(t, "name", "description"),
          l(t, "content", c[2]),
          l(o, "property", "og:title"),
          l(o, "content", (r = c[1] ?? c[0])),
          l(i, "property", "og:description"),
          l(i, "content", c[2]);
      },
      m(e, a) {
        d(document.head, t), d(document.head, o), d(document.head, i);
      },
      p(e, [a]) {
        a & 1 && n !== (n = e[0]) && (document.title = n),
          a & 4 && l(t, "content", e[2]),
          a & 3 && r !== (r = e[1] ?? e[0]) && l(o, "content", r),
          a & 4 && l(i, "content", e[2]);
      },
      i: h,
      o: h,
      d(e) {
        s(t), s(o), s(i);
      },
    }
  );
}
function E(c, n, t) {
  let { title: o } = n,
    { ogTitle: r = null } = n,
    { description: i } = n;
  return (
    (c.$$set = (e) => {
      "title" in e && t(0, (o = e.title)),
        "ogTitle" in e && t(1, (r = e.ogTitle)),
        "description" in e && t(2, (i = e.description));
    }),
    [o, r, i]
  );
}
class y extends f {
  constructor(n) {
    super(), _(this, n, E, T, g, { title: 0, ogTitle: 1, description: 2 });
  }
}
export { y as S };
