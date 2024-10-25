"use client";

import { auth } from "@/infra/firebase/client";
import {
  Box,
  Button,
  Center,
  Container,
  Input,
  LoadingOverlay,
} from "@mantine/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn as signInByNextAuth } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Box pos="relative" mt={"md"}>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Input.Wrapper label="メールアドレス" mb="md">
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </Input.Wrapper>

        <Input.Wrapper label="パスワード" mb="md">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
        </Input.Wrapper>

        <Center>
          <Button
            disabled={email === "" || password === ""}
            onClick={async () => {
              setLoading(true);

              try {
                const user = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                if (!user.user) {
                  setLoading(false);
                  return;
                }
                const refreshToken = user.user.refreshToken;
                const idToken = await user.user.getIdToken();

                await signInByNextAuth("credentials", {
                  idToken,
                  refreshToken,
                  callbackUrl: "/",
                });
              } catch (error) {}

              setLoading(false);
            }}
          >
            ログイン
          </Button>
        </Center>
      </Box>
    </Container>
  );
}
