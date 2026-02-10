"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-6">
      <section className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome to Zenda
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Organize your tasks, manage your workflow, and stay in control of
            your projects with a simple, fast, and elegant experience. Zenda is
            built to help you focus on what truly matters.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="
              px-8 py-3 rounded-xl
              bg-black text-white
              dark:bg-white dark:text-black
              font-medium
              shadow-lg shadow-zinc-300/40 dark:shadow-zinc-800/40
              hover:scale-105 active:scale-95
              transition-all duration-200
            "
          >
            Sign in
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="
              px-8 py-3 rounded-xl
              border border-zinc-300 dark:border-zinc-700
              text-zinc-700 dark:text-zinc-300
              hover:bg-zinc-100 dark:hover:bg-zinc-900
              transition
            "
          >
            Home
          </button>
        </div>
      </section>
    </main>
  );
}
