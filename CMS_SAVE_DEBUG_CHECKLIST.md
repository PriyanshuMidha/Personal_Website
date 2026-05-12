# CMS Save Debug Checklist

## Public API Checks

```bash
curl -s http://localhost:5000/api/public/profile | jq
curl -s http://localhost:5000/api/public/projects | jq
curl -s http://localhost:5000/api/public/projects/featured | jq
curl -s http://localhost:5000/api/public/skills | jq
curl -s http://localhost:5000/api/public/experience | jq
curl -s http://localhost:5000/api/public/achievements | jq
curl -s http://localhost:5000/api/public/education | jq
```

## Admin Save Checklist

- Profile: save name/headline/about/social links and confirm `profiles` updates, then refresh `/about` and `/resume`.
- Projects: create or edit a project with `isPublished`, `isFeatured`, `githubUrl`, and `liveUrl`, then refresh `/projects` and `/`.
- Skills: create or edit a published skill with exact category/level enums, then refresh `/skills`.
- Experience: create or edit a published experience entry with dates and list fields, then refresh `/experience`.
- Achievements: create or edit a published achievement and optional featured flag, then refresh `/achievements`.
- Education: create or edit a published education entry, then refresh `/education`.
- Resume: upload a PDF from `/admin/resume`, confirm `profile.resumeUrl` changes, then refresh `/resume`.

## Save -> MongoDB -> Public API -> Public Page

1. Save from the relevant `/admin/*` screen.
2. Confirm the CMS toast shows success and there is no validation error.
3. Confirm the document exists or updates in MongoDB.
4. Run the matching public `curl` command and confirm the saved record appears only when `isPublished: true`.
5. Refresh the matching public page and confirm the new data renders without code edits.

## Validation and Error Checks

- Send invalid enum values for project status/category and skill category/level; confirm backend returns:
  - `success: false`
  - `message: "Validation failed"`
  - `errors[{ field, message }]`
- Confirm CMS UI shows the returned backend message and does not show a success toast.
- In local development, check browser/server console output for:
  - outgoing admin payload
  - normalized backend payload
  - parsed API success payload
  - parsed backend error payload

## Resume Upload Notes

- Cloudinary mode: if `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are configured, uploaded resume URLs should be Cloudinary-hosted.
- Local fallback mode: if Cloudinary credentials are missing, uploads should be saved under backend `/uploads/*` and still populate `profile.resumeUrl`.
- If no resume is available, the public resume page and button should show `Resume not uploaded yet`.
