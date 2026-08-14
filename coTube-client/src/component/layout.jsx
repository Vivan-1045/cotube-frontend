import Navbar from "../pages/navbar"

export default function Layout({ children }) {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#070b18] text-white">

            <div className="pointer-events-none fixed inset-0 z-0">

                <div
                    className="
            absolute inset-0
            bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.10),transparent_30%),
                radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.10),transparent_30%)]
          "
                />

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