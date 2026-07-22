import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("./routes/home-redirect.tsx"),
  route("products", "./routes/products.tsx", [
    index("./routes/products.index.tsx"),
    route("new", "./routes/products.new.tsx"),
    route(":id", "./routes/products.$id.tsx"),
    route(":id/edit", "./routes/products.$id.edit.tsx"),
  ]),
] satisfies RouteConfig;
