import React from "react";

import type { Project } from "../types";
import { ProjectCreate } from "./ProjectCreate";
import { ProjectEdit } from "./ProjectEdit";

const ProjectList = React.lazy(() => import("./ProjectList"));
const ProjectShow = React.lazy(() => import("./ProjectShow"));

export default {
  list: ProjectList,
  show: ProjectShow,
  create: ProjectCreate,
  edit: ProjectEdit,
  recordRepresentation: (record: Project) => record.name,
};
