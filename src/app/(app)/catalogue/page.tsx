import type { Metadata } from "next";
import { CatalogueView } from "@/components/app/views/catalogue-view";

export const metadata: Metadata = { title: "Catalogue" };

export default function CataloguePage() {
  return <CatalogueView />;
}
