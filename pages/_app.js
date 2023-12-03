import "@/styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Script from "next/script";
const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});
export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-C308M4051V"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >{` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-C308M4051V');`}</Script>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
