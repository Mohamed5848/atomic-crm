import { useTranslate } from "ra-core";
import { lazy } from "react";

import { MobilePage } from "../layout/MobilePage";

const DealList = lazy(() => import("../deals/DealList"));
const ProjectList = lazy(() => import("../projects/ProjectList"));
const ProjectShow = lazy(() => import("../projects/ProjectShow"));

// The opportunity board and the projects screens are shared with desktop:
// on mobile they only get the mobile header and bottom-navigation spacing.

export const MobileDealList = () => {
  const translate = useTranslate();
  return (
    <MobilePage title={translate("resources.deals.name", { smart_count: 2 })}>
      <DealList />
    </MobilePage>
  );
};

export const MobileProjectList = () => {
  const translate = useTranslate();
  return (
    <MobilePage
      title={translate("resources.projects.name", { smart_count: 2 })}
    >
      <ProjectList />
    </MobilePage>
  );
};

export const MobileProjectShow = () => {
  const translate = useTranslate();
  return (
    <MobilePage
      title={translate("resources.projects.name", { smart_count: 1 })}
    >
      <ProjectShow />
    </MobilePage>
  );
};
