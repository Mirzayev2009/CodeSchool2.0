

import './index.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css" rel="stylesheet" />        <link href="https://fonts.googleapis.com/css2?family=Pacifico:wght@400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />        <title>CodeSchool LMS</title>
        <meta name="description" content="CodeSchool Learning Management System" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>    </html>
  );}