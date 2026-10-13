import "./globals.css";
export const metadata = { title: "ZENTRIX | Digital Services & Website Support", description: "Website development, hosting, maintenance and technical support, managed through one customer service portal." };

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
