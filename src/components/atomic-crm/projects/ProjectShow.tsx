import { Plus } from "lucide-react";
import { ShowBase, useGetList, useRecordContext, useTranslate } from "ra-core";
import { Link } from "react-router";
import { EditButton } from "@/components/admin/edit-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getDealPipeline, getDealStageLabel } from "../deals/pipelines";
import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal, Project } from "../types";

const ProjectShow = () => (
  <ShowBase>
    <ProjectShowContent />
  </ShowBase>
);

const ProjectShowContent = () => {
  const record = useRecordContext<Project>();
  const translate = useTranslate();
  const config = useConfigurationContext();
  const { data: deals = [] } = useGetList<Deal>(
    "deals",
    {
      filter: { project_id: record?.id },
      pagination: { page: 1, perPage: 100 },
      sort: { field: "created_at", order: "ASC" },
    },
    { enabled: record?.id != null },
  );
  if (!record) return null;

  const sectorLabel = config.companySectors.find(
    (sector) => sector.value === record.sector,
  )?.label;
  const details: [string, string | null | undefined][] = [
    ["end_client", record.end_client],
    ["consultant", record.consultant],
    ["location", record.location],
    ["sector", sectorLabel ?? record.sector],
  ];

  return (
    <div className="mt-2 flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{record.name}</h2>
              <p className="text-sm text-muted-foreground">
                {translate("resources.projects.fields.sales_id")}:{" "}
                <ReferenceField
                  source="sales_id"
                  reference="sales"
                  link={false}
                />
              </p>
            </div>
            <EditButton />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {details.map(([field, value]) => (
              <div key={field} className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {translate(`resources.projects.fields.${field}`)}
                </span>
                <span className="text-sm">{value || "-"}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Stat
              label={translate("resources.projects.fields.estimated_value")}
              value={formatCompactMoney(
                record.estimated_value,
                config.currency,
              )}
              hint={translate("resources.projects.counted_once")}
            />
            <Stat
              label={translate("resources.projects.nb_opportunities")}
              value={String(deals.length)}
            />
            <Stat
              label={translate("resources.projects.nb_contractors")}
              value={String(new Set(deals.map((deal) => deal.company_id)).size)}
            />
          </div>
          {record.description ? (
            <p className="whitespace-pre-line text-sm">{record.description}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {translate("resources.deals.name", { smart_count: 2 })}
            </h3>
            <Button asChild variant="outline" size="sm">
              <Link
                to="/deals/create"
                state={{ record: { project_id: record.id } }}
              >
                <Plus className="h-4 w-4" />
                {translate("resources.deals.action.new")}
              </Link>
            </Button>
          </div>
          {deals.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {translate("resources.deals.fields.cr_number")}
                  </TableHead>
                  <TableHead>
                    {translate("resources.deals.fields.company_id")}
                  </TableHead>
                  <TableHead>
                    {translate("resources.deals.fields.pipeline")}
                  </TableHead>
                  <TableHead>
                    {translate("resources.deals.fields.stage")}
                  </TableHead>
                  <TableHead>
                    {translate("resources.deals.fields.sales_id")}
                  </TableHead>
                  <TableHead className="text-end">
                    {translate("resources.deals.fields.amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <Link
                        to={`/deals/${deal.id}/show`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {deal.cr_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ReferenceField
                        record={deal}
                        source="company_id"
                        reference="companies"
                        resource="deals"
                        link="show"
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {translate(
                          `resources.deals.pipelines.${getDealPipeline(deal)}`,
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{getDealStageLabel(config, deal)}</TableCell>
                    <TableCell>
                      <ReferenceField
                        record={deal}
                        source="sales_id"
                        reference="sales"
                        resource="deals"
                        link={false}
                      />
                    </TableCell>
                    <TableCell className="text-end">
                      {formatCompactMoney(deal.amount, config.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              {translate("resources.projects.no_opportunities")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="flex flex-col rounded-lg border p-3">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xl font-semibold">{value}</span>
    {hint ? (
      <span className="text-xs text-muted-foreground">{hint}</span>
    ) : null}
  </div>
);

export default ProjectShow;
