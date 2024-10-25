"use client";

import { ActionIcon, Flex } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <>
      <Flex className="h-[60px]" align="center" justify="flex-end" px={"md"}>
        {session && (
          <ActionIcon size={42} variant="default" onClick={() => signOut()}>
            <IconLogout />
          </ActionIcon>
        )}
      </Flex>
    </>
  );
}
