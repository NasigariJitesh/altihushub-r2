"use client";

import InvoiceForm from "@/components/invoice-form";
import { getInvoice, useZustandStore } from "@/utils";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const InvoiceDetails = () => {
	const router = useRouter();
	const { invoiceId } = useParams();
	const { invoices, updateInvoice } = useZustandStore();
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<h3>Invoice Details</h3>
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
