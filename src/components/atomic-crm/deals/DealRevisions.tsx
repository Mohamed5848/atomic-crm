import { Plus } from "lucide-react";
import { useNotify, useRefresh, useTranslate, useUpdate } from "ra-core";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { formatCompactMoney } from "../misc/formatMoney";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { addRevision, formatRevision } from "./opportunity";

/**
 * Revision history of the opportunity's CR quotation. Adding a revision
 * appends Rev N+1 to the same opportunity (it never creates a new one) and
 * makes its value the opportunity's current value.
 */
export const DealRevisions = ({ record }: { record: Deal }) => {
  const translate = useTranslate();
  const { currency } = useConfigurationContext();
  const [isAdding, setIsAdding] = useState(false);
  const revisions = [...(record.revisions ?? [])].sort(
    (a, b) => b.revision - a.revision,
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground tracking-wide">
          {translate("resources.deals.revisions.title", {
            cr_number: record.cr_number,
          })}
        </span>
        {!isAdding ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
            {translate("resources.deals.revisions.add")}
          </Button>
        ) : null}
      </div>
      {isAdding ? (
        <RevisionForm record={record} onDone={() => setIsAdding(false)} />
      ) : null}
      {revisions.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {translate("resources.deals.revisions.fields.revision")}
              </TableHead>
              <TableHead>
                {translate("resources.deals.revisions.fields.date")}
              </TableHead>
              <TableHead className="text-end">
                {translate("resources.deals.revisions.fields.value")}
              </TableHead>
              <TableHead>
                {translate("resources.deals.revisions.fields.notes")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revisions.map((revision) => (
              <TableRow key={revision.revision}>
                <TableCell className="font-medium">
                  {formatRevision(revision.revision)}
                </TableCell>
                <TableCell>{revision.date}</TableCell>
                <TableCell className="text-end">
                  {formatCompactMoney(revision.value, currency)}
                </TableCell>
                <TableCell className="whitespace-normal text-xs">
                  {revision.notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">
          {translate("resources.deals.revisions.empty")}
        </p>
      )}
    </div>
  );
};

const RevisionForm = ({
  record,
  onDone,
}: {
  record: Deal;
  onDone: () => void;
}) => {
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [update, { isPending }] = useUpdate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [value, setValue] = useState(String(record.amount ?? 0));
  const [notes, setNotes] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(value);
    if (!date || !Number.isFinite(amount) || amount < 0) {
      notify("resources.deals.revisions.invalid", { type: "error" });
      return;
    }
    update(
      "deals",
      {
        id: record.id,
        data: {
          revisions: addRevision(record.revisions, {
            date,
            value: amount,
            notes: notes.trim() || null,
          }),
          amount,
        },
        previousData: record,
      },
      {
        mutationMode: "pessimistic",
        onSuccess: () => {
          notify("resources.deals.revisions.added", { type: "info" });
          refresh();
          onDone();
        },
        onError: () =>
          notify("resources.deals.revisions.error", { type: "error" }),
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-lg border p-3 md:grid-cols-3"
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="revision-date">
          {translate("resources.deals.revisions.fields.date")}
        </Label>
        <Input
          id="revision-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="revision-value">
          {translate("resources.deals.revisions.fields.value")}
        </Label>
        <Input
          id="revision-value"
          type="number"
          min={0}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1 md:col-span-3">
        <Label htmlFor="revision-notes">
          {translate("resources.deals.revisions.fields.notes")}
        </Label>
        <Textarea
          id="revision-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={2}
        />
      </div>
      <div className="flex gap-2 md:col-span-3 justify-end">
        <Button type="button" variant="ghost" onClick={onDone}>
          {translate("ra.action.cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {translate("resources.deals.revisions.save")}
        </Button>
      </div>
    </form>
  );
};
