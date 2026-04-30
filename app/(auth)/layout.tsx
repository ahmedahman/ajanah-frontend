import { AuthIllustration } from "@/components/auth/auth-illustration";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex relative bg-background overflow-hidden"
      style={{ backgroundImage: "url('/bg_pg_auth.svg')" }}
    >
      {/* Background decorative swirl */}
      <div className="absolute top-0 left-0 w-[400px] h-[300px] pointer-events-none">
        <img
          src="/line_auth_pgs.svg"
          alt="Background swirl"
          className="absolute top-[-50px] left-0 w-[400px] h-[300px] pointer-events-none"
        />
      </div>

      {/* Left side - Auth forms */}
      <div
        className="flex-1 flex items-center justify-center p-8 z-10"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <img
          src="/side-ph.svg"
          alt="Logo"
          className="hidden lg:flex flex-1 items-center justify-center p-8"
        />
      </div>
    </div>
  );
}
