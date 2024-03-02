const prerender = true;
const load = async ({ url }) => {
  return { pathname: url.pathname };
};
export {
  load,
  prerender
};
