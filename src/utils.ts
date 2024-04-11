import { create } from "zustand";

export interface InvoiceItem {
	id: string;
	itemName: string;
	quantity: number;
	price: number;
	amount: number;
}

export interface InvoiceBillSundry {
	id: string;
	billSundryName: string;
	amount: number;
}

export interface Invoice {
	id: string;
	date: string;
	invoiceNumber: number;
	customerName: string;
	billingAddress: string;
	shippingAddress: string;
	gstID: string;
	items: InvoiceItem[];
	billSundrys: InvoiceBillSundry[];
	totalAmount: number;
}

interface Store {
	invoices: Invoice[];
	addInvoices: (invoice: Invoice) => void;
	updateInvoice: (invoice: Invoice, id: string) => void;
	deleteInvoice: (id: string) => void;
}

const updateItem = (id: string, item: Invoice, invoices: Invoice[]) => {
	const index = invoices.findIndex((invoice) => invoice.id === id);
	if (index === -1) throw new Error("Invalid invoice Id");
	invoices[index] = item;

	return invoices;
};

const deleteItem = (id: string, invoices: Invoice[]) => {
	const array = [...invoices];
	const index = array.findIndex((invoice) => invoice.id === id);

	if (index === -1) throw new Error("Invalid invoice Id");
	array.splice(index, 1);

	return array;
};

export const getInvoice = (id: string, invoices: Invoice[]) => {
	const index = invoices.findIndex((invoice) => invoice.id === id);

	return invoices[index];
};

export const useZustandStore = create<Store>()((set) => ({
	invoices: [
		{
			id: "0",
			billingAddress: "123, Gachibowli, Hyderabad",
			billSundrys: [],
			customerName: "ABC",
			date: "2022-12-12",
			gstID: "XXXXXX",
			invoiceNumber: 123,
			items: [],
			shippingAddress: "123, Gachibowli, Hyderabad",
			totalAmount: 0,
		},
		{
			id: "1",
			billingAddress: "456, Gachibowli, Hyderabad",
			billSundrys: [],
			customerName: "XYZ",
			date: "2023-1-1",
			gstID: "XXXXXX",
			invoiceNumber: 124,
			items: [
				{
					amount: 60,
					id: "1",
					itemName: "Item 1",
					price: 10,
					quantity: 6,
				},
				{
					amount: 40,
					id: "2",
					itemName: "Item 2",
					price: 20,
					quantity: 2,
				},
			],
			shippingAddress: "124, Gachibowli, Hyderabad",
			totalAmount: 100,
		},
	],
	addInvoices: (invoice: Invoice) =>
		set((state) => ({ invoices: [...state.invoices, invoice] })),

	updateInvoice: (invoice: Invoice, id: string) =>
		set((state) => ({ invoices: updateItem(id, invoice, state.invoices) })),

	deleteInvoice: (id: string) =>
		set((state) => ({ invoices: deleteItem(id, state.invoices) })),
}));
