import { useState, useEffect } from "react";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const useRazorpayPayment = () => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => {
      setError("Failed to load Razorpay SDK");
      setIsRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = (
    options: RazorpayOptions
  ): Promise<RazorpayResponse> => {
    return new Promise((resolve, reject) => {
      if (!isRazorpayLoaded) {
        reject(new Error("Razorpay SDK not loaded"));
        return;
      }

      const rzp = new window.Razorpay({
        ...options,
        handler: (response: RazorpayResponse) => {
          resolve(response);
        },
      });

      rzp.on("payment.failed", (response: any) => {
        reject(new Error(response.error.description || "Payment failed"));
      });

      rzp.open();
    });
  };

  return { initiatePayment, isRazorpayLoaded, error };
};
