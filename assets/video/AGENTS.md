# assets/video/

Silent looping clips of the featured demos. `npm run clips` writes them from `clip` in `data/projects.json`.

## Rules
- Never edit a clip by hand. Change the scene in the data and run `npm run clips`.
- Each file stays at or under `clip.maxKilobytes`. `tests/clips.test.mjs` checks this.
- Each clip has an MP4 file and a WebM file. The page lists the MP4 file first.
- A clip shows sample data only.
