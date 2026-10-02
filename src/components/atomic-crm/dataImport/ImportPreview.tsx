import * as Papa from "papaparse";
import { useDataProvider, useTranslate } from "ra-core";
import { useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  applyMapping,
  autoMapColumns,
  detectDuplicates,
  type ColumnMapping,
  type DuplicateResource,
  type RawRow,
  type RowStatus,
} from "./importMapping";

const UNMAPPED = "__unmapped__";
const PREVIEW_ROWS = 20;
/** Enough for the whole customer base of a small sales team */
const MAX_EXISTING = 20000;

const STATUS_VARIANTS: Record<
  RowStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "default",
  duplicate_existing: "secondary",
  duplicate_file: "outline",
  invalid: "destructive",
};

/** Columns shown in the preview table, per resource */
const PREVIEW_FIELDS: Record<DuplicateResource, string[]> = {
  companies: ["name", "city", "phone_number"],
  contacts: ["first_name", "last_name", "company", "email_work"],
};

/**
 * Dry run of a CSV import: maps the file's columns to the CRM fields, flags
 * duplicates against the CRM and inside the file, and previews the result.
 * Nothing is written until the user confirms; the confirmed rows are handed
 * back as a CSV in the CRM's own column format.
 */
export const ImportPreview = ({
  file,
  resource,
  sampleCsv,
  onBack,
  onImport,
}: {
  file: File;
  resource: DuplicateResource;
  sampleCsv: string;
  onBack(): void;
  onImport(file: File): void;
}) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const targetFields = useMemo(
    () => Papa.parse<string[]>(sampleCsv.split(/\r?\n/)[0]).data[0] ?? [],
    [sampleCsv],
  );
  const [rows, setRows] = useState<RawRow[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [existing, setExisting] = useState<Record<string, unknown>[] | null>(
    null,
  );
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (result) => {
        const fileHeaders = result.meta.fields ?? [];
        setHeaders(fileHeaders);
        setMapping(autoMapColumns(fileHeaders, targetFields));
        setRows(result.data);
      },
      error: (parseError) => setError(parseError.message),
    });
  }, [file, targetFields]);

  useEffect(() => {
    dataProvider
      // contacts_summary carries company_name, needed to match contacts by company
      .getList(resource === "contacts" ? "contacts_summary" : resource, {
        pagination: { page: 1, perPage: MAX_EXISTING },
        sort: { field: "id", order: "ASC" },
        filter: {},
      })
      .then(({ data }) => setExisting(data))
      .catch((fetchError: unknown) =>
        setError(
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        ),
      );
  }, [dataProvider, resource]);

  const mappedRows = useMemo(
    () => (rows ? applyMapping(rows, mapping) : []),
    [rows, mapping],
  );
  const statuses = useMemo(
    () =>
      existing ? detectDuplicates(resource, mappedRows, existing as never) : [],
    [existing, mappedRows, resource],
  );
  const counts = statuses.reduce(
    (acc, status) => ({ ...acc, [status]: acc[status] + 1 }),
    { new: 0, duplicate_existing: 0, duplicate_file: 0, invalid: 0 } as Record<
      RowStatus,
      number
    >,
  );
  const rowsToImport = mappedRows.filter((_, index) =>
    skipDuplicates ? statuses[index] === "new" : statuses[index] !== "invalid",
  );

  const handleImport = () => {
    const csv = Papa.unparse(rowsToImport, { columns: targetFields });
    onImport(new File([csv], file.name, { type: "text/csv" }));
  };

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertDescription>
            {translate("crm.data_import.error")} ({error})
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onBack} className="self-start">
          {translate("ra.action.back")}
        </Button>
      </div>
    );
  }

  if (!rows || !existing) {
    return (
      <p className="text-sm text-muted-foreground">
        {translate("crm.common.loading")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Alert>
        <AlertDescription>
          {translate("crm.data_import.preview.dry_run_hint", {
            smart_count: rows.length,
          })}
        </AlertDescription>
      </Alert>

      <section className="flex flex-col gap-2">
        <h3 className="font-medium">
          {translate("crm.data_import.preview.mapping")}
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {targetFields.map((field) => (
            <div key={field} className="flex items-center gap-2">
              <Label
                htmlFor={`mapping-${field}`}
                className="w-32 shrink-0 font-mono text-xs"
              >
                {field}
              </Label>
              <Select
                value={mapping[field] || UNMAPPED}
                onValueChange={(column) =>
                  setMapping({
                    ...mapping,
                    [field]: column === UNMAPPED ? "" : column,
                  })
                }
              >
                <SelectTrigger id={`mapping-${field}`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNMAPPED}>
                    {translate("crm.data_import.preview.unmapped")}
                  </SelectItem>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="font-medium">
          {translate("crm.data_import.preview.result")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(counts) as RowStatus[]).map((status) => (
            <Badge key={status} variant={STATUS_VARIANTS[status]}>
              {translate(`crm.data_import.preview.status.${status}`)}:{" "}
              {counts[status]}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="skip-duplicates"
            checked={skipDuplicates}
            onCheckedChange={(checked) => setSkipDuplicates(checked === true)}
          />
          <Label htmlFor="skip-duplicates">
            {translate("crm.data_import.preview.skip_duplicates")}
          </Label>
        </div>
        <div className="max-h-72 overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                {PREVIEW_FIELDS[resource].map((field) => (
                  <TableHead key={field} className="font-mono text-xs">
                    {field}
                  </TableHead>
                ))}
                <TableHead>
                  {translate("crm.data_import.preview.status_header")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappedRows.slice(0, PREVIEW_ROWS).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  {PREVIEW_FIELDS[resource].map((field) => (
                    <TableCell key={field}>{row[field]}</TableCell>
                  ))}
                  <TableCell>
                    <Badge variant={STATUS_VARIANTS[statuses[index]]}>
                      {translate(
                        `crm.data_import.preview.status.${statuses[index]}`,
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {mappedRows.length > PREVIEW_ROWS ? (
          <p className="text-xs text-muted-foreground">
            {translate("crm.data_import.preview.more_rows", {
              smart_count: mappedRows.length - PREVIEW_ROWS,
            })}
          </p>
        ) : null}
      </section>

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack}>
          {translate("ra.action.back")}
        </Button>
        <Button onClick={handleImport} disabled={!rowsToImport.length}>
          {translate("crm.data_import.preview.import", {
            smart_count: rowsToImport.length,
          })}
        </Button>
      </div>
    </div>
  );
};
