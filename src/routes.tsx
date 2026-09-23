import { createBrowserRouter } from "react-router"
import { Root } from "./root"
import Home from "./notebook-pages/page"
import NotFound from "./notebook-pages/not-found"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "about",
        lazy: async () => ({
          Component: (await import("./notebook-pages/about/page")).default,
        }),
      },
      {
        path: "projects",
        lazy: async () => ({
          Component: (await import("./notebook-pages/projects/page")).default,
        }),
      },
      {
        path: "projects/:slug",
        lazy: async () => ({
          Component: (await import("./notebook-pages/projects/detail/page"))
            .default,
        }),
      },
      {
        path: "research",
        lazy: async () => ({
          Component: (await import("./notebook-pages/research/page")).default,
        }),
      },
      {
        path: "github",
        lazy: async () => ({
          Component: (await import("./notebook-pages/github/page")).default,
        }),
      },
      {
        path: "github/:name",
        lazy: async () => ({
          Component: (await import("./notebook-pages/github/detail/page"))
            .default,
        }),
      },
      {
        path: "skills",
        lazy: async () => ({
          Component: (await import("./notebook-pages/skills/page")).default,
        }),
      },
      {
        path: "journey",
        lazy: async () => ({
          Component: (await import("./notebook-pages/journey/page")).default,
        }),
      },
      {
        path: "contact",
        lazy: async () => ({
          Component: (await import("./notebook-pages/contact/page")).default,
        }),
      },
      { path: "*", Component: NotFound },
    ],
  },
])
