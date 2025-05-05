import "./styles.css"
import { AlertProvider } from "./error-alert"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  )
}
