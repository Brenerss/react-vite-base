import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta(_: Route.MetaArgs) {
  return [{ title: "BaseApp" }, { name: "description", content: "BaseApp" }];
}

export default function Home() {
  return <Welcome />;
}
