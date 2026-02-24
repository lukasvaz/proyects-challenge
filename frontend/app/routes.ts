import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home/home.tsx"),
  route("/projects","pages/projects/new.tsx"),
  route("/workers","pages/workers/new.tsx"),
] satisfies RouteConfig;