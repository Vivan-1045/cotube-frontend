import Navbar from "../pages/navbar"

export default function Layout({ children }) {
    return (
        <div className="cotube-page relative min-h-screen overflow-x-hidden text-[var(--text-primary)]">

            <div className="pointer-events-none fixed inset-0 z-0">

                <div className="pointer-events-none fixed inset-0 z-0" />

                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
                        backgroundSize: "45px 45px",
                    }}
                />

            </div>

            <Navbar />

            <main className="relative z-10 pt-20 sm:pt-24">
                {children}
            </main>

        </div>
    );
}