'use client';
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <h1>
      <Button onClick={() => router.push('/user')}>Click</Button>
    </h1>
  );
}
