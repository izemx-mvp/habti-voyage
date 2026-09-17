import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/community-manager/idees")({
  component: () => <Outlet />,
});
