"use client";

import { NavLink } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {}

export default function Menu({}: Props) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {session?.type === "customer" && (
        <>
          <NavLink
            component={Link}
            href={"/customer"}
            label={"カスタマー"}
            active={pathname === "/customer"}
            leftSection={<IconHome />}
          />
        </>
      )}
      {session?.type === "client" && (
        <>
          <NavLink
            component={Link}
            href={"/client"}
            label={"クライアント"}
            active={pathname === "/client"}
            leftSection={<IconHome />}
          />
        </>
      )}
    </>
  );
}
