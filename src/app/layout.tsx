import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
    title: "Kanaban",
    description:
        "Prueba kanban",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="h-full">
            <body className={`${poppins.className} h-full`}>{children}</body>
        </html>
    );
}