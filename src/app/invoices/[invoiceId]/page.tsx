"use client";

import InvoiceForm from "@/components/invoice-form";
import { getInvoice, useZustandStore } from "@/utils";
import { Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const InvoiceDetails = () => {
	const router = useRouter();
	const { invoiceId } = useParams();
	const { invoices, updateInvoice, deleteInvoice } = useZustandStore();
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}>
				<h4>Invoice Details</h4>

				<Button
					style={{
						height: 40,
						backgroundColor: "red",
						color: "white",
					}}
					disabled={!invoiceId}
					onClick={() => {
						if (!invoiceId) return;
						router.replace("/invoices");

						deleteInvoice(invoiceId as string);
					}}
					variant='contained'>
					Delete
				</Button>
			</div>
			<InvoiceForm
				onSubmit={(invoice) => {
					updateInvoice(invoice, invoiceId as string);
					router.push("/invoices");
				}}
				invoice={
					invoiceId ? getInvoice(invoiceId as string, invoices) : undefined
				}
			/>
		</div>
	);
};

export default InvoiceDetails;
