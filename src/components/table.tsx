import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Invoice, useZustandStore } from "@/utils";
import { useRouter } from "next/navigation";

const columns: GridColDef<Invoice[][number]>[] = [
	{ field: "invoiceNumber", headerName: "Invoice No.", minWidth: 90, flex: 1 },
	{
		field: "date",
		headerName: "Date",

		minWidth: 160,
		valueGetter: (value) => new Date(value),
		valueFormatter: (value: Date) => value.toDateString(),
		flex: 1,
	},
	{
		field: "customerName",
		headerName: "Customer name",
		minWidth: 150,
		flex: 1,
	},

	{
		field: "billingAddress",
		headerName: "Billing Address",

		sortable: false,
		minWidth: 200,
		flex: 1,
	},
	{
		field: "shippingAddress",
		headerName: "Shipping Address",

		sortable: false,
		minWidth: 200,
		flex: 1,
	},
	{
		field: "totalAmount",
		headerName: "Total",
		type: "number",
		minWidth: 150,
	},
];

export default function Table() {
	const { invoices } = useZustandStore();
	const router = useRouter();
	return (
		<Box sx={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={invoices}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: {
							pageSize: 5,
						},
					},
				}}
				isCellEditable={() => false}
				onRowClick={(params) => router.push(`/invoices/${params.row.id}`)}
				pageSizeOptions={[5]}
			/>
		</Box>
	);
}
