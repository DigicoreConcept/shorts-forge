# Stacked (Split-Screen) Layout Design Reference

The **Stacked (Split-Screen)** layout is a layout style designed for vertical media (e.g., TikTok, YouTube Shorts, Instagram Reels) that displays **two distinct video feeds simultaneously**, aligned vertically on top of each other.

## 1. Primary Use Cases

*   **Split-Screen Podcasts/Interviews:**
    *   Displays the **Host** on the top half of the screen and the **Guest** on the bottom half of the screen.
*   **Gaming Content:**
    *   Stacks the creator's **Facecam** on the top half and the **Gameplay capture** on the bottom half.
*   **Reaction Feeds:**
    *   Displays the original video on the bottom half and the creator's live reaction feed on the top half.

---

## 2. Technical Rendering Pipeline (Expected Behavior)

*   **Double Area Cropping:**
    *   The backend pipeline takes two coordinate frames or subjects from a landscape `16:9` source (or parses two active camera inputs).
    *   Each segment is cropped into a `9:8` square-ish frame.
*   **Vertical Alignment:**
    *   The two cropped segments are stacked vertically to compile a standard `9:16` vertical video container.
*   **Subtitle Layer Placement:**
    *   Subtitles are positioned either centered along the dividing seam (boundary dividing line) or overlayed at the bottom margin of the lower stack to ensure key visual frames (e.g., speakers' faces) are not obscured.

---

> [!NOTE]
> This feature is hidden during the private beta testing phase and is scheduled to be enabled in Phase 2/3 of the development roadmap.
