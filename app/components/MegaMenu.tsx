import { CategoryItem } from "@/types/category";
import MegaMenuWrapper from "./megamenu/MegaMenuWrapper";

/**
 * Server component that renders the megamenu
 * Uses the MegaMenuWrapper for client-side interactivity
 * while keeping most content server-rendered
 */
export default function MegaMenu({ categories }: { categories: CategoryItem[] }) {
  return (
    <MegaMenuWrapper categories={categories} />
  );
}
