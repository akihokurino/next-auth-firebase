import { authOptions } from "@/app/api/auth/[...nextauth]/next-auth-options";
import { Alert, Container } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <Container>
      <Alert
        mt={"md"}
        variant="light"
        color="blue"
        title="Customer Page"
        icon={<IconInfoCircle />}
      >
        Firebase uid: {session?.uid}
      </Alert>
    </Container>
  );
}
