const ppmRedirectUrl =
  "https://scholar.google.com/citations?hl=en&user=zBUwaGkAAAAJ&view_op=list_works&sortby=pubdate";

export function GET() {
  return Response.redirect(ppmRedirectUrl, 302);
}
