# Backend Assets

Seeded project and blog images live here and are served by Express at `/assets`.

- Project image example: `backend/assets/project/zephyr.png` -> `/assets/project/zephyr.png`
- Blog image example: `backend/assets/blog/my-post.png` -> `/assets/blog/my-post.png`

In `src/scripts/seed.ts`, use:

```ts
coverImage: projectAsset('zephyr.png')
coverImage: blogAsset('my-post.png')
```

The server also supports `/asset/...` as a backwards-compatible alias.
