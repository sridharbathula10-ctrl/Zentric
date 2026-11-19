import "./globals.css";
export const metadata = { title: "ZENTRIX | Digital Solutions, Website Design & Development", description: "ZENTRIX helps businesses build and improve websites, online stores, custom applications and digital experiences, with ongoing technology support." };

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
