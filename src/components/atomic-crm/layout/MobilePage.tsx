import type { ReactNode } from "react";

import { MobileContent } from "./MobileContent";
import MobileHeader from "./MobileHeader";

/** Header + scrollable content for a desktop screen reused on mobile. */
export const MobilePage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <>
    <MobileHeader>
      <h1 className="text-xl font-semibold">{title}</h1>
    </MobileHeader>
    <MobileContent>{children}</MobileContent>
  </>
);
