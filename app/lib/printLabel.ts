/**
 * Shared inventory-label printing. Builds a clean, printable sticker (asset
 * name, location, QR image and Asset ID) and opens it in a print window.
 * Browser-only helpers — call from client components on a user gesture.
 */

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

export function labelHtml({
  dataUrl,
  name,
  assetId,
  location,
}: {
  dataUrl: string;
  name: string;
  assetId: string;
  location: string;
}): string {
  return `<!doctype html><html><head><meta charset="utf-8" />
    <title>${esc(assetId)}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
      body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;padding:24px;}
      .label{width:300px;border:2px solid #0b0b0b;border-radius:18px;padding:22px;text-align:center;}
      .name{font-size:19px;font-weight:700;color:#0b0b0b;line-height:1.2;}
      .loc{font-size:12px;color:#555;margin-top:4px;margin-bottom:16px;}
      img{width:208px;height:208px;display:block;margin:0 auto;}
      .id{margin-top:14px;font-size:17px;font-weight:700;letter-spacing:3px;color:#0b0b0b;}
      .brand{margin-top:8px;font-size:10px;color:#999;letter-spacing:1.5px;text-transform:uppercase;}
      @media print{body{padding:0;} .label{border-color:#000;}}
    </style></head>
    <body><div class="label">
      <div class="name">${esc(name)}</div>
      <div class="loc">${esc(location)}</div>
      <img src="${dataUrl}" alt="QR" />
      <div class="id">${esc(assetId)}</div>
      <div class="brand">PRVIO Earth</div>
    </div>
    <script>window.onload=function(){setTimeout(function(){window.focus();window.print();},150);};</script>
    </body></html>`;
}

export function printLabelWindow(html: string): void {
  const win = window.open("", "_blank", "width=420,height=600");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

/** Asset ID as shown on the detail page for custom/live assets (slug-derived). */
export function assetIdFromHref(href: string): string {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  return slug.toUpperCase().slice(0, 10);
}
