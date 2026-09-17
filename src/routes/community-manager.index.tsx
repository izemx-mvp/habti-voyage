import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/community-manager/")({
  beforeLoad: () => { throw redirect({ to: "/community-manager/idees" }); },
});
