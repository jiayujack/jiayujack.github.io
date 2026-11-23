# Jiayu Qin — Academic Homepage

A responsive, dependency-free academic homepage hosted at https://jiayujack.github.io/ with GitHub Pages. No installation or build step is needed.

## Update content

- `index.html`: biography, dated news, conference papers, workshop papers, manuscripts under review, projects, experience, education, and service. Each paper includes its citation in a native expandable BibTeX block.
- `assets/docs/Jiayu_Qin_CV.pdf`: public CV. Replace the PDF while keeping the filename so existing links continue working.
- `assets/css/styles.css`: responsive layout, light and dark themes, and print styles.
- `assets/js/main.js`: theme preference, mobile navigation, active section, and citation copying. Content and citation text remain available without JavaScript.
- `assets/img/jiayu-qin.webp`: profile photograph.

Before publishing, verify titles, author order, venue/year, and official paper links. Keep unpublished manuscripts separate from conference and workshop papers. Add numerical results only when the benchmark, baseline, metric, and source can be stated accurately. Update the footer date and `sitemap.xml` when substantive content changes.

## Preview and publish

Serve the repository root with any static web server, for example `python3 -m http.server 8000`, and open `http://localhost:8000`. Check both themes, mobile navigation, citation expansion/copying, and the CV download. Commit and push the reviewed changes to `main` to update GitHub Pages.

The November 2026 content update follows the supplied CV and the official ACL Anthology, ICLR, PMLR, and NeurIPS proceedings. Conference-paper citations link to those sources; under-review manuscripts retain abbreviated author lists.
