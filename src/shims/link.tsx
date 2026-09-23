import { Link as RouterLink } from "react-router"
import type { ComponentProps } from "react"

type Props = Omit<ComponentProps<typeof RouterLink>, "to"> & { href: string }

export default function Link({ href, ...props }: Props) {
  const viewTransition =
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  return <RouterLink to={href} viewTransition={viewTransition} {...props} />
}
