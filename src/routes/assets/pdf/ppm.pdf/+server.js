const ppmRedirectUrl = "https://arxiv.org/abs/2609.07303";

export function GET() {
  return Response.redirect(ppmRedirectUrl, 302);
}
