# Publish ScamSense on GitHub Pages

This version is ready for GitHub Pages. It needs no backend, database account, API key, environment variable, npm installation, or build step.

## 1. Download and extract the correct ZIP

Use **ScamSense-GitHub-Pages.zip**, not the older backend archive.

On your Mac, double-click the ZIP to extract it. Open the extracted folder. Its contents should include:

```text
index.html
styles.css
app.js
content.js
learning.js
favicon.svg
.nojekyll
README.md
HOSTING-GUIDE.md
```

The important point is that `index.html` is directly inside this folder. You will upload the contents, not the containing folder and not the ZIP itself.

`.nojekyll` is a hidden file. In Finder, press **Command + Shift + .** to show hidden files. On Windows, enable **View → Show → Hidden items**. The file tells Pages to serve the files directly.

## 2. Create a GitHub repository

1. Sign in at https://github.com/.
2. Click **+ → New repository**.
3. Set the repository name to **scamsense**.
4. Choose **Public** for the straightforward GitHub Free setup.
5. Turn **Add a README file** on so the repository has its default branch.
6. Click **Create repository**.

The repository can have a different name; all website paths are relative and support repository subfolders.

## 3. Upload the website

1. In your new repository, select **Add file → Upload files**.
2. Drag the extracted folder's **contents** into the upload area. Include the six website files and `.nojekyll`. You may also upload README.md and this guide.
3. Confirm the upload list shows **index.html**, not **some-folder/index.html**.
4. Enter the commit message **Add ScamSense website**.
5. Choose **Commit directly to the main branch** and click **Commit changes**.

If `.nojekyll` was not uploaded, select **Add file → Create new file**, name it `.nojekyll`, put a short note such as `Static website` in it, and commit it. The presence of the file is what matters.

Do not upload the old `data/` directory, `node_modules/`, SQLite files, or the backend archive. The clean Pages ZIP contains none of these.

## 4. Enable GitHub Pages

1. Open **Settings** in your repository.
2. In the left sidebar, under **Code and automation**, select **Pages**.
3. Under **Build and deployment**, set **Source → Deploy from a branch**.
4. Under **Branch**, select **main**.
5. Select **/ (root)** as the folder.
6. Click **Save**.

If you are using an existing repository whose source branch is named `master`, select that branch instead. Choose the branch containing the uploaded `index.html`.

No custom workflow or framework setting is needed. Do not select `/docs` for this package.

## 5. Wait for the website address

Open the **Actions** tab and look for the **pages build and deployment** run. Wait for it to finish successfully.

Return to **Settings → Pages**, then click **Visit site**. For a repository called `scamsense`, the address normally looks like:

```text
https://YOUR_USERNAME.github.io/scamsense/
```

Use the actual link GitHub displays. Publishing can take up to 10 minutes. Keep the trailing slash and use HTTPS.

## 6. Check the deployed course

1. Confirm the homepage has its colours, fonts and graphics.
2. Start the baseline and answer a few questions.
3. Refresh: your saved choices should still be present, and the next unanswered question should open.
4. Complete the baseline and all three training modules.
5. Complete the final check and try a revision exercise.
6. Reload: completed results should remain.
7. Open the website in a different browser or private window: it should have a separate fresh journey.

Learning progress is stored in each visitor's browser. A teacher cannot view it centrally. Private-window data normally disappears when that window closes. Clearing site data or changing device/browser starts again. Old backend SQLite records do not transfer into this static edition.

## 7. Share and update

Share the published website address, not the repository address or a localhost link.

To update the site later:

1. Open the repository's **Code** tab.
2. Select **Add file → Upload files**.
3. Upload the changed files with the same filenames and folder positions.
4. Commit the changes to the publishing branch.
5. Wait for the Pages deployment to finish, then refresh the published site.

Updating files normally preserves browser progress while the storage format and URL stay the same. Moving to a different domain or repository path starts a different browser storage area.

## Troubleshooting

| Symptom | What to check |
|---|---|
| GitHub shows the README instead of the course | `index.html` must be at the root of the selected source folder. |
| 404 page | Confirm Pages is enabled, the correct branch and `/ (root)` are selected, and deployment is finished. Use the exact URL in Settings → Pages. |
| Unstyled page or missing JavaScript | Upload all six website files. Preserve filename case. Use this package's relative `./` paths. |
| “Could not connect to server” | You uploaded the old Express edition. Replace it with the files from ScamSense-GitHub-Pages.zip. |
| Old appearance after an update | Wait for the deployment, then hard-refresh: Command + Shift + R on Mac; Ctrl + Shift + R on Windows. |
| Progress does not persist | Allow browser site storage. In the memory-only fallback, the app explicitly says progress lasts only in the current open tab. |
| Saved progress cannot be read | Use the displayed fresh-start button to deliberately reset this site's saved journey. |
| Files fail when opening index.html directly | This app uses JavaScript modules. Open the published HTTPS site, or use the optional local HTTP preview, instead of a file:// URL. |

## Optional local preview

If you have Node.js 20 or newer, open a terminal in the full source project and run:

```sh
npm start
```

Then visit http://127.0.0.1:3000/scamsense/. This is only a development preview, not a backend, and is not required for publishing. Alternatively serve the folder with any standard static HTTP server.

## What changed for Pages

The same course now runs fully in the browser. JavaScript checks answers and localStorage stores progress. Because the source and answer keys are downloadable, this is an educational demonstration, not a secure or proctored assessment. This edition no longer satisfies a requirement for a server-side backend/database; the original implementation is preserved separately in ScamSense-Backend-Archive.zip.

## Official GitHub references

- Creating a Pages site: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Configuring branch publishing: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
