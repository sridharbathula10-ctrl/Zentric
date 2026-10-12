import "./globals.css";
export const metadata = { title: "Zentrix | Customer Support", description: "Customer support and ticket management" };

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
