// import { useEffect } from 'react'

// function App() {
//   // ----- Auto-trigger the install prompt (no button needed) -----
//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e) => {
//       e.preventDefault()   
//       e.prompt()           // install popup open without on click
//       e.userChoice.then((choice) => {
//         console.log(`User ${choice.outcome} the install prompt`)
//       })
//     }

//     window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
//     return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
//   }, [])

//   return (
//     <div className="app">
//       <h1>⚡ Flash LAB Notes</h1>
//     </div>
//   )
// }

// export default App