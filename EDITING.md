# Editing the website

Everything on the site lives in the `content` folder on GitHub. Change a file, save it, and the site updates in about two minutes. If a file has a mistake, the update stops and **the old site stays live**, so you cannot break it.

## Edit a testimonial

1. Open the repository on github.com. Click the **content** folder, then **testimonials**.
2. Click the file you want, for example `placeholder-doctor-couple.md`.
3. Click the **pencil icon** at the top right of the file. It says "Edit this file" when you hover.
4. Change the text after `quote:`. Keep the quote marks around it.
5. Set `consentGiven: true` **only** if the client has agreed in writing. Without it, the quote never shows on the live site.
6. Set `featured: true` to show it on the home page. `order: 1` shows first.
7. Click the green **Commit changes...** button at the top right, then **Commit changes** again in the box that opens.

To add a new testimonial: in the **testimonials** folder, click **Add file**, then **Create new file**. Name it like `mehta-family.md` and copy the top section from an existing testimonial.

## Add an article

1. Go to **content**, then **insights**. Click **Add file**, then **Create new file**.
2. Name the file using lowercase words and dashes, ending in `.mdx`. For example `why-we-rebalance-in-april.mdx`.
3. Open an existing article in another tab and copy everything between the two `---` lines. Paste it into your new file.
4. Change each line. The important ones:
   - `slug:` must match the file name, without `.mdx`.
   - `category:` must be one of `markets`, `planning`, `interviews`, `client-letters`, `guides`.
   - `excerpt:` is one or two sentences, between 60 and 220 characters.
   - `author:` is `plabita`, `sanjiv` or `shailee`.
   - `publishedAt:` is the date, written like `2026-11-15`.
5. Below the second `---`, write the article. Start a heading with `## `. Make a bold word with `**word**`.
6. Click **Commit changes...**, then **Commit changes**.

## Swap a team photo

1. Prepare the photo as a JPG, roughly 1200 pixels wide, under 500 KB.
2. Go to **public**, then **images**, then **team**. Click **Add file**, then **Upload files**.
3. Drag the photo in. Name it exactly as the team file expects: `plabita.jpg`, `sanjiv.jpg` or `shailee.jpg`. Uploading a file with the same name replaces the old photo.
4. Click **Commit changes**.
5. Optional: open **content**, then **team**, then the person's `.md` file, and update `photoAlt:` to describe the photo in a few words.

## If the update does not appear

After about five minutes, open the repository's front page. A **red cross** next to your latest change means the site found a mistake in your file. Click the cross, then **Details**, to read which line is wrong. The usual causes are a missing quote mark, a `slug` that does not match the file name, or an `excerpt` that is too short or too long. Fix the line and commit again. If you are stuck, email the developer the file name.

Writing rules for every page: no em dashes, and avoid the words trusted, comprehensive, customised, holistic, strive and endeavour.
