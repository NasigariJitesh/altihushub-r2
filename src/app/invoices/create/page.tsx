"use client";

import InvoiceForm from "@/components/invoice-form";
import { useZustandStore } from "@/utils";
import { useRouter } from "next/navigation";
import React from "react";

const CreateInvoice = () => {
	const router = useRouter();

	const { addInvoices } = useZustandStore();
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<h3>Create Invoice</h3>
			<InvoiceForm
				onSubmit={(invoice) => {
					addInvoices(invoice);
					router.push("/invoices");
				}}
			/>
		</div>
	);
};

export default CreateInvoice;
