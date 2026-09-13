# Memoh legal documents

The website provides Chinese and English versions of the Service Agreement, Privacy Policy and Cross-Border Data Transfer Terms. The documents are independently drafted for Memoh; references below informed their coverage and organisation.

## Files and routes

| Document | Chinese | English | Route |
| --- | --- | --- | --- |
| Service Agreement | [terms.zh.md](../../src/content/legal/terms.zh.md) | [terms.en.md](../../src/content/legal/terms.en.md) | `/legal/terms` |
| Privacy Policy | [privacy.zh.md](../../src/content/legal/privacy.zh.md) | [privacy.en.md](../../src/content/legal/privacy.en.md) | `/legal/privacy` |
| Cross-Border Data Transfer Terms | [cross-border.zh.md](../../src/content/legal/cross-border.zh.md) | [cross-border.en.md](../../src/content/legal/cross-border.en.md) | `/legal/cross-border` |

Append `?lang=zh` or `?lang=en` for a language-specific link. `/legal` redirects to the Service Agreement.

`src/lib/legal.ts` loads the Markdown and owns the document update date. `LegalPage.vue` renders it with the existing Markdown renderer, using the Blog article's width and typography. It provides a collapsed chapter directory, language switching, document navigation and Markdown downloads. The download includes the title and update date. The page does not display a subtitle or review notice.

Footer links preserve the selected language. `scripts/create-spa-fallback.mjs` creates static entry pages for direct access. Legal pages currently use `noindex, nofollow` in both static and runtime metadata and are excluded from the sitemap. The update date is not a declaration of legal effectiveness.

## Entities and contact details

| Role | Entity | Contact |
| --- | --- | --- |
| Mainland China service provider | 深圳猫本原理科技有限公司（猫本公司）/ Felinic | support@memoh.net |
| Overseas recipient in Singapore | MEMOH AI PTE LTD | support@memoh.ai |

The mainland correspondence address is 深圳市南山区 TCL 国际 E 城 G4 栋 (Building G4, TCL International E City, Nanshan District, Shenzhen, China). Singapore and Japan are possible overseas processing and storage locations; each feature's actual arrangements require specific disclosure. The overseas recipient's street address and other vendors' identities have not been supplied.

The Service Agreement includes acceptable-use rules for cloud computers, Agents, networks and shared resources, together with proportionate enforcement and appeals. The cross-border document uses six sections: recipient, purposes, information categories, storage and security, rights, and contacts. Both language versions and the Privacy Policy identify the same overseas recipient and email address.

## References

Reviewed on 2026-09-14:

- [MiMo Service Agreement](https://mimo.mi.com/docs/quick-start/terms/user-agreement): Chinese and English via the site's language switch; displayed effective date 2026-07-07.
- MiMo Privacy Policy: [Chinese](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN/) and [English](https://privacy.mi.com/XiaomiMiMoPlatform/en_GB/); version v20260806, with a stated effective date of 2026-06-25.
- Acceptable use: [AWS](https://aws.amazon.com/aup/), [Google Cloud](https://cloud.google.com/terms/aup) and [DigitalOcean](https://www.digitalocean.com/legal/acceptable-use-policy).
- [Duolingo cross-border statement](https://www.duolingo.cn/cross-border-data-transfer-agreement): six-section disclosure structure; displayed revision date 2025-12-15.
- [Personal Information Protection Law](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm), [Provisions on Promoting and Regulating Cross-Border Data Flows](https://www.cac.gov.cn/2024-03/22/c_1712776611775634.htm), [Measures on the Standard Contract for Outbound Transfer of Personal Information](https://www.cac.gov.cn/2023-02/24/c_1678884830036813.htm), [Network Data Security Management Regulations](https://www.cac.gov.cn/2024-09/30/c_1729384452307680.htm) and [AI-generated content labelling measures](https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm).

Reference policies are not incorporated wholesale into Memoh's terms. Their company-specific infrastructure, certifications, contact details and effective dates are not assertions about Memoh.

## Operational details to complete

Before adopting the text as an effective policy, reconcile it with the actual service:

- Complete the remaining provider inventory, roles, data categories, destinations, retention and rights channels. The Privacy Policy keeps explicit placeholders for other providers, the cookie inventory and retention schedules.
- Verify account closure, data deletion, backup clearance, model-training restrictions and actual provider configurations against the stated commitments.
- Verify tool permissions, renewal notices, refunds and generated-content labelling against product behaviour.
- Confirm applicable entity boundaries, the effective version and date, and the publication and notice process. Review indexing metadata when these details are complete.

These files implement document presentation only. They do not implement consent collection, transfer controls, abuse detection, deletion workflows, or regulatory assessments and filings.

## Validation

Run `npm run build` for pricing styles, the embedded demo, Vue type checking, Vite output, static route entries and demo asset verification. Existing large-chunk warnings do not prevent the build.

Browser checks cover both languages, footer navigation, page and site language controls, chapter links and fragment reloads, light and dark themes, and desktop and mobile layouts. Document checks cover matching chapter counts, entity and email consistency, valid internal links and absence of reference-company branding in the policy text.
