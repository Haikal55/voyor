import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Bag | VOYOR Official Online Boutique",
  description:
    "Review your curated VOYOR creations, select bespoke delivery options, and proceed to checkout with atelier concierge service.",
};

export default function CartPage() {
  return <CartPageClient />;
}
