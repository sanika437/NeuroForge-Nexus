import React from "react";

export const Table = ({ className = "", children, ...props }) => (
  <div className="relative w-full overflow-auto rounded-xl border border-border/80 bg-card">
    <table className={`w-full caption-bottom text-sm border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);
Table.displayName = "Table";

export const TableHeader = ({ className = "", children, ...props }) => (
  <thead className={`border-b border-border bg-muted/30 sticky top-0 z-10 ${className}`} {...props}>
    {children}
  </thead>
);
TableHeader.displayName = "TableHeader";

export const TableBody = ({ className = "", children, ...props }) => (
  <tbody className={`divide-y divide-border/60 ${className}`} {...props}>
    {children}
  </tbody>
);
TableBody.displayName = "TableBody";

export const TableFooter = ({ className = "", children, ...props }) => (
  <tfoot className={`border-t border-border bg-muted/40 font-medium ${className}`} {...props}>
    {children}
  </tfoot>
);
TableFooter.displayName = "TableFooter";

export const TableRow = ({ className = "", children, ...props }) => (
  <tr
    className={`transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted ${className}`}
    {...props}
  >
    {children}
  </tr>
);
TableRow.displayName = "TableRow";

export const TableHead = ({ className = "", children, ...props }) => (
  <th
    className={`h-11 px-4 text-left align-middle font-bold text-muted-foreground uppercase text-[10px] tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);
TableHead.displayName = "TableHead";

export const TableCell = ({ className = "", children, ...props }) => (
  <td className={`p-4 align-middle text-sm text-foreground/80 ${className}`} {...props}>
    {children}
  </td>
);
TableCell.displayName = "TableCell";
