self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/_error": [
    "static/chunks/pages/_error.js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/categories",
    "/api/categories/[id]/posts",
    "/api/categories/[id]/threads",
    "/api/login",
    "/api/register",
    "/api/test",
    "/forum",
    "/forum/[categoryId]",
    "/thread/[threadId]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()