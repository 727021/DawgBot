import { UserButton } from "@clerk/nextjs"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <UserButton />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="text-right p-2 text-sm text-gray-500">&copy; {new Date().getFullYear()}</footer>
    </div>
  )
}
