export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>{children}</div>
        </body>
      </html>
    );
  }
  