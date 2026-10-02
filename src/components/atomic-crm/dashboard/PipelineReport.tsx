import { BarChart3 } from "lucide-react";
import { useGetList, useTranslate } from "ra-core";
import { useMemo } from "react";
import { ReferenceField } from "@/components/admin/reference-field";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal, DealPipeline, Project } from "../types";
import {
  buildPipelineReport,
  type ReportValues,
  type StageReportRow,
} from "./pipelineReport";

/**
 * Pipeline value per pipeline / stage and per owner. Project values are
 * counted once per project, whatever the number of opportunities.
 */
export const PipelineReport = () => {
  const translate = useTranslate();
  const config = useConfigurationContext();
  const { data: deals, isPending: isPendingDeals } = useGetList<Deal>("deals", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
    filter: { "archived_at@is": null },
  });
  const { data: projects, isPending: isPendingProjects } = useGetList<Project>(
    "projects",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
    },
  );

  const report = useMemo(
    () => buildPipelineReport(deals ?? [], projects ?? [], config),
    [deals, projects, config],
  );

  if (isPendingDeals || isPendingProjects) return null;
  const money = (value: number) => formatCompactMoney(value, config.currency);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div className="me-3 flex">
          <BarChart3 className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.reports.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label={translate("crm.reports.opportunity_value")}
          value={money(report.totals.opportunityValue)}
          hint={translate("crm.reports.nb_opportunities", {
            smart_count: report.totals.count,
          })}
        />
        <StatTile
          label={translate("crm.reports.project_value")}
          value={money(report.totals.projectValue)}
          hint={translate("crm.reports.counted_once")}
        />
        <StatTile
          label={translate("crm.reports.project_count")}
          value={String(report.totals.projectCount)}
        />
      </div>

      {(["tender", "in_hand"] as const).map((pipeline) => (
        <StageTable
          key={pipeline}
          pipeline={pipeline}
          rows={report.byStage.filter((row) => row.pipeline === pipeline)}
          money={money}
        />
      ))}

      <Card>
        <CardContent className="flex flex-col gap-2">
          <h3 className="text-base font-medium">
            {translate("crm.reports.by_owner")}
          </h3>
          <ValuesTable
            labelHeader={translate("crm.reports.owner")}
            rows={report.byOwner.map((row) => ({
              key: String(row.salesId),
              label:
                row.salesId == null ? (
                  "-"
                ) : (
                  <ReferenceField
                    record={{ id: row.salesId, sales_id: row.salesId }}
                    source="sales_id"
                    reference="sales"
                    link={false}
                  />
                ),
              values: row,
            }))}
            money={money}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const StatTile = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <Card className="py-4">
    <CardContent className="flex flex-col gap-1 px-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </CardContent>
  </Card>
);

const StageTable = ({
  pipeline,
  rows,
  money,
}: {
  pipeline: DealPipeline;
  rows: StageReportRow[];
  money: (value: number) => string;
}) => {
  const translate = useTranslate();
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-base font-medium">
          {translate(`resources.deals.pipelines.${pipeline}`)}
        </h3>
        <ValuesTable
          labelHeader={translate("resources.deals.fields.stage")}
          rows={rows.map((row) => ({
            key: row.stage,
            label: row.label,
            values: row,
          }))}
          money={money}
        />
      </CardContent>
    </Card>
  );
};

type ValuesRow = {
  key: string;
  label: React.ReactNode;
  values: ReportValues;
};

const ValuesTable = ({
  labelHeader,
  rows,
  money,
}: {
  labelHeader: string;
  rows: ValuesRow[];
  money: (value: number) => string;
}) => {
  const translate = useTranslate();
  const maxValue = Math.max(
    1,
    ...rows.map((row) => row.values.opportunityValue),
  );
  const total = rows.reduce(
    (sum, row) => ({
      count: sum.count + row.values.count,
      opportunityValue: sum.opportunityValue + row.values.opportunityValue,
      projectCount: sum.projectCount + row.values.projectCount,
      projectValue: sum.projectValue + row.values.projectValue,
    }),
    { count: 0, opportunityValue: 0, projectCount: 0, projectValue: 0 },
  );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labelHeader}</TableHead>
          <TableHead className="text-end">
            {translate("crm.reports.count")}
          </TableHead>
          <TableHead className="w-1/3">
            {translate("crm.reports.opportunity_value")}
          </TableHead>
          <TableHead className="text-end">
            {translate("crm.reports.project_count")}
          </TableHead>
          <TableHead className="text-end">
            {translate("crm.reports.project_value")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.key}>
            <TableCell>{row.label}</TableCell>
            <TableCell className="text-end">{row.values.count}</TableCell>
            <TableCell>
              <div
                className="flex items-center gap-2"
                title={money(row.values.opportunityValue)}
              >
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${(row.values.opportunityValue / maxValue) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-20 text-end text-sm tabular-nums">
                  {money(row.values.opportunityValue)}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-end">
              {row.values.projectCount}
            </TableCell>
            <TableCell className="text-end tabular-nums">
              {money(row.values.projectValue)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-medium">
          <TableCell>{translate("crm.reports.total")}</TableCell>
          <TableCell className="text-end">{total.count}</TableCell>
          <TableCell className="text-end tabular-nums">
            {money(total.opportunityValue)}
          </TableCell>
          <TableCell className="text-end">{total.projectCount}</TableCell>
          <TableCell className="text-end tabular-nums">
            {money(total.projectValue)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
