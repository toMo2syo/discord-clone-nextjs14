import Link from "next/link";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Naive Discord Clone with Next.js 14
        </p>
        <p className="text-center">Add me as a friend</p>
        <p className="text-center select-text mt-2"><b>qingying54@gmail.com</b></p>
        <p className="text-center mt-4">Join my server</p>
        <p className="text-center select-text mt-2"><b>https://discord-clone-nextjs14-production.up.railway.app/invite/802f7777-ff53-4f18-b342-1b5c803bb6e6</b></p>
      </div>
      <div className="mb-32 grid text-center">
        <Link
          href="/server"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Live Demo{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Please do <b>not</b> enter any sensitive information on this website.
          </p>
        </Link>
        <a
          href="https://github.com/toMo2syo/discord-clone-nextjs14"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Github{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore the source code and project details.
          </p>
        </a>
      </div>
    </main>
  );
}
