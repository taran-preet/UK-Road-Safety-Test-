import './globals.css';
export const metadata={title:'UK Road Hazard Perception Test',description:'60-second UK road safety hazard perception test'};
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export default function RootLayout({children}){
  return(<html lang="en-GB"><body><div id="root">{children}</div></body></html>);
}
