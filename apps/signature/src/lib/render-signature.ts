import type { SignatureData } from "./schema";

/** Best-effort E.164-ish tel: href. Strips formatting, assumes a French mobile if no country code was given. */
function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+33${digits.slice(1)}`;
  return `+${digits}`;
}

/** Strips the protocol and trailing slash for display (e.g. "https://example.com/" -> "example.com"). */
function toDisplayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * Renders the Gmail signature HTML from form data. Runs entirely client-side:
 * this is a pure string template, never sent to a server.
 */
export function renderSignature(data: SignatureData): string {
  const { name, title, email, phone, website, photoUrl, logoUrl, accentColor } = data;

  return `<table style="border:none">
    <tbody><tr>
        <td style="padding-right:15px">
            <img src="${photoUrl}" height="150">
        </td>
        <td>
            <p style="margin-top:0pt;margin-bottom:0pt;width:100%"><img src="${logoUrl}" height="35"></p>
            <p style="margin-top:0pt;margin-bottom:0pt;font-family:Montserrat,sans-serif;color:${accentColor};font-weight:600;font-size:x-large">
                ${name}</p>
            <p style="margin-top:0pt;margin-bottom:0pt;font-family:Montserrat,sans-serif;color:rgb(64,64,64);font-weight:500;font-size:large">
                ${title}
            </p>
            <p style="margin-top:0pt;margin-bottom:0pt;font-family:Montserrat,sans-serif">
                <a style="text-decoration:none;color:black" href="mailto:${email}" target="_blank">${email}</a>
            </p>
            <p style="margin-top:0pt;margin-bottom:0pt;font-family:Montserrat,sans-serif">
                <a style="text-decoration:none;color:black" href="tel:${toTelHref(phone)}" target="_blank">${phone}</a>
            </p>
            <p style="margin-top:0pt;margin-bottom:0pt;font-family:Montserrat,sans-serif">
                <a style="text-decoration:none;color:${accentColor}" href="${website}" target="_blank">
                    ${toDisplayUrl(website)}</a>
            </p>
        </td>
    </tr>
</tbody></table>`;
}
