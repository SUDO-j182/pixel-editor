# Pixel Editor

A basic pixel art editor designed for drawing, erasing, and saving small pixel artworks. This project was developed to practice DOM manipulation, event handling, and interactive UI design.

---

**Status:** IN DEVELOPMENT  
**Last Updated:** 30/04/2025

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript (Vanilla)
- Backend: None (Frontend-only application)
- Database: LocalStorage (for save/load feature)

---



|---------------------------------------|---------------|
| Pixel grid with adjustable size      | Implemented   |
| Colour selection palette             | Implemented   |
| Click or drag to draw and erase       | Implemented   |
| Save/load artwork locally             | Implemented   |
| Export pixel art as `.png`            | Implemented   |
| Mobile and desktop compatibility     | Implemented   |
| README documentation                 | Included      |

---

## Frontend Overview

### HTML
- Semantic structure with canvas grid and colour palette
- Buttons for saving, loading, clearing, and exporting artwork
- Supports accessibility where practical for a lightweight app

### CSS
- Custom palette based on a 16-colour retro theme
- Responsive layout supporting both mobile and desktop
- Styled buttons, palette swatches, and pixel grid cells

### JavaScript
- Handles drawing, erasing, and drag-to-paint functionality
- Allows saving and loading artwork via `localStorage`
- Enables exporting artwork as a downloadable `.png`
- Supports adjustable grid size (future zoom feature planned)

---

## Backend Overview

### REST API Endpoints

N/A — Frontend-only project using browser storage (`localStorage`).

---

## Testing Summary (as of 30/04/2025 )

All core features have been manually tested:

- Pixel drawing and erasing verified on desktop and mobile
- Save and Load functionality confirmed via `localStorage`
- Exported `.png` file downloads successfully
- Palette colour selection and drag-to-paint tested

---

## Unit Testing Summary (as of )

_No formal unit tests yet implemented. Manual testing used for current version._

---

## Planned Features

- Add shape tools (rectangle, circle)
- Add undo/redo functionality
- Add optional favicon preview mode

---

## Additional Notes

- Designed with simplicity and speed in mind
- Focuses on practicing DOM manipulation without frameworks

