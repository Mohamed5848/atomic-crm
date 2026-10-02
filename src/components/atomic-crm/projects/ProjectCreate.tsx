import { CreateBase, Form, useGetIdentity } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";

import { FormToolbar } from "../layout/FormToolbar";
import { ProjectInputs } from "./ProjectInputs";

export const ProjectCreate = () => {
  const { identity } = useGetIdentity();
  return (
    <CreateBase
      redirect="show"
      transform={(values) => ({
        ...values,
        created_at: new Date().toISOString(),
      })}
    >
      <div className="mt-2 max-w-3xl">
        <Form defaultValues={{ sales_id: identity?.id }}>
          <Card>
            <CardContent>
              <ProjectInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </CreateBase>
  );
};
