# ZADA Studio CSS

`style.css` is the single stylesheet entry point used by the HTML pages.

The stylesheet is split into `css/split/` by component/function. The import order in `style.css` preserves the original cascade order.

## Structure

- `01-variables.css` — theme variables
- `02-global.css` — reset and global styles
- `03-loader.css` — loader
- `04-buttons.css` — buttons and controls
- `05-navbar.css` — navigation
- `06-hero.css` — hero
- `07-catalog.css` — catalog/filter
- `08-forms-select.css` — forms/selects
- `09-portfolio.css` — portfolio cards/grid
- `10-services.css` — services
- `11-process.css` — process/workflow
- `12-subpages.css` — subpages
- `13-admin-ui.css` — admin UI
- `14-footer-animations.css` — footer/animations
- `15-gallery.css` — gallery/lightbox
- `16-team-report.css` — team/report
- `17-progress-tracker.css` — progress tracker
- `18-invoice-print.css` — invoice/print

To add or change styles, edit the relevant file inside `css/split/`. Keep the import order unless the CSS cascade is intentionally being changed.

### Borderless visual system
`19-borderless.css` is loaded last so it acts as the final visual layer. Cards use no visible border and rely on subtle elevation/shadow for separation. Functional inputs, badges, stamps, and intentional decorative separators retain their own interaction/decorative styles.
