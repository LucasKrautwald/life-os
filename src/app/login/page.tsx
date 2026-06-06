import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,255,71,0.06),transparent_55%)]" />
      <div className="relative">
        <LoginForm />
      </div>
    </div>
  );
}
