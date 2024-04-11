import { Invoice } from "@/utils";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import dayjs from "dayjs";

import FormGroup from "@mui/material/FormGroup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	FormControl,
	FormHelperText,
	Input,
	InputLabel,
} from "@mui/material";

const invoiceItemZodSchema = z
	.object({
		id: z.string(),
		itemName: z
			.string({ required_error: "Item name is required" })
			.min(1, { message: "Item name is required" }),
		quantity: z
			.number({ required_error: "Item quantity is required" })
			.int({ message: "Item must be an integer" }),

		price: z.number({ required_error: "Item quantity is required" }),
		amount: z.number({ required_error: "Item Amount is required" }),
	})
	.refine((data) => data.amount === data.quantity * data.price, {
		message: "Amount must be equal to product of the quantity and price",
		path: ["amount"],
	});

const invoiceBillSundryZodSchema = z.object({
	id: z.string(),
	billSundryName: z
		.string({ required_error: "Bill sundry name is required" })
		.min(1, { message: "Bill sundry name is required" }),
	amount: z.number({ required_error: "Bill sundry Amount is required" }),
});

const invoiceZodSchema = z
	.object({
		id: z.string(),
		date: z.string().refine((date) => new Date(date) <= new Date(), {
			message: "Invalid date",
		}),
		invoiceNumber: z.number({ required_error: "Invoice number is required" }),
		customerName: z.string({ required_error: "Customer name is required" }),
		billingAddress: z.string({ required_error: "Billing Address is required" }),
		shippingAddress: z.string({
			required_error: "Shipping Address is required",
		}),
		gstID: z.string({ required_error: "GST ID Number is required" }),
		items: z.array(invoiceItemZodSchema).min(1, {
			message: "There should be at least one item to generate invoice ",
		}),

		billSundrys: z.array(invoiceBillSundryZodSchema),
		totalAmount: z.number(),
	})
	.refine(
		(data) =>
			data.items.reduce((acc, value) => acc + value.amount, 0) +
				data.billSundrys.reduce((acc, value) => acc + value.amount, 0) ===
			data.totalAmount,
		{
			message: "Amount must be equal to product of the quantity and price",
			path: ["amount"],
		}
	);

const getDefaultValues = (invoice?: Invoice) =>
	invoice
		? { ...invoice }
		: {
				id: uuidv4(),
				items: [
					{ id: uuidv4(), itemName: "", quantity: 0, price: 0, amount: 0 },
				],
		  };

const InvoiceForm = ({
	invoice,
	onSubmit,
}: {
	invoice?: Invoice;
	onSubmit: (data: Invoice) => void;
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<z.infer<typeof invoiceZodSchema>>({
		resolver: zodResolver(invoiceZodSchema),

		defaultValues: getDefaultValues(invoice),
	});

	const {
		fields: items,
		append: appendItems,
		remove: removeItems,
	} = useFieldArray({
		control,
		name: "items",
	});

	const {
		fields: billSundrys,
		append: appendBillSundrys,
		remove: removeBillSundrys,
	} = useFieldArray({
		control,
		name: "billSundrys",
	});

	const submit = (data: Invoice) => {
		onSubmit(data);
		reset();
	};

	return (
		<form onSubmit={handleSubmit(submit)} onReset={() => reset()}>
			<FormGroup>
				<Controller
					control={control}
					name='invoiceNumber'
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor='invoiceNumber'>Invoice number</InputLabel>
							<Input
								id='invoiceNumber'
								aria-describedby='invoiceNumber-error'
								{...field}
								type={"number"}
							/>
							{errors.invoiceNumber?.message ? (
								<FormHelperText id='invoiceNumber-error'>
									{errors.invoiceNumber?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>
				<Controller
					control={control}
					name='date'
					render={({ field: { value, onChange } }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label='Date'
									value={dayjs(value)}
									onChange={(newValue) => onChange(newValue?.toString())}
								/>
							</LocalizationProvider>
							{errors.invoiceNumber?.message ? (
								<FormHelperText id='date-error'>
									{errors.invoiceNumber?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>
				<Controller
					control={control}
					name='customerName'
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor='customerName'>Customer name</InputLabel>
							<Input
								id='customerName'
								aria-describedby='customerName-error'
								{...field}
							/>
							{errors.customerName?.message ? (
								<FormHelperText id='customerName-error'>
									{errors.customerName?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>
				<Controller
					control={control}
					name='gstID'
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor='gstID'>GST Identification Number</InputLabel>
							<Input id='gstID' aria-describedby='gstID-error' {...field} />
							{errors.gstID?.message ? (
								<FormHelperText id='gstID-error'>
									{errors.gstID?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>

				<Controller
					control={control}
					name='shippingAddress'
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor='shippingAddress'>
								Shipping Address
							</InputLabel>
							<Input
								id='shippingAddress'
								multiline
								aria-describedby='shippingAddress-error'
								{...field}
							/>
							{errors.shippingAddress?.message ? (
								<FormHelperText id='shippingAddress-error'>
									{errors.shippingAddress?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>
				<Controller
					control={control}
					name='billingAddress'
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor='billingAddress'>Billing Address</InputLabel>
							<Input
								id='billingAddress'
								multiline
								aria-describedby='billingAddress-error'
								{...field}
							/>
							{errors.billingAddress?.message ? (
								<FormHelperText id='billingAddress-error'>
									{errors.billingAddress?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					rules={{ required: true }}
				/>
				<InputLabel htmlFor='items'>Items</InputLabel>

				<FormGroup id='items' style={{ marginBottom: "16px" }}>
					{items.map((field, index) => (
						<FormGroup style={{ marginBottom: "24px" }} key={field.id}>
							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`items.${index}.itemName`}>
											Item Name
										</InputLabel>
										<Input
											id={`items.${index}.itemName`}
											aria-describedby={`items.${index}.itemName-error`}
											{...field}
										/>
										{errors.items && errors.items[index]?.itemName?.message ? (
											<FormHelperText id={`items.${index}.itemName-error`}>
												{errors.items[index]?.itemName?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`items.${index}.itemName`}
								control={control}
								rules={{ required: true }}
							/>
							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`items.${index}.price`}>
											Price
										</InputLabel>
										<Input
											id={`items.${index}.price`}
											aria-describedby={`items.${index}.price-error`}
											{...field}
											type='number'
										/>
										{errors.items && errors.items[index]?.price?.message ? (
											<FormHelperText id={`items.${index}.price-error`}>
												{errors.items[index]?.price?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`items.${index}.price`}
								control={control}
								rules={{ required: true }}
							/>
							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`items.${index}.quantity`}>
											Quantity
										</InputLabel>
										<Input
											id={`items.${index}.quantity`}
											aria-describedby={`items.${index}.quantity-error`}
											{...field}
											type='number'
										/>
										{errors.items && errors.items[index]?.quantity?.message ? (
											<FormHelperText id={`items.${index}.quantity-error`}>
												{errors.items[index]?.quantity?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`items.${index}.quantity`}
								control={control}
								rules={{ required: true }}
							/>

							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`items.${index}.amount`}>
											Amount
										</InputLabel>
										<Input
											id={`items.${index}.amount`}
											aria-describedby={`items.${index}.amount-error`}
											{...field}
											type='number'
										/>
										{errors.items && errors.items[index]?.amount?.message ? (
											<FormHelperText id={`items.${index}.amount-error`}>
												{errors.items[index]?.amount?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`items.${index}.amount`}
								control={control}
								rules={{ required: true }}
							/>
							{index != 0 ? (
								<Button variant='outlined' onClick={() => removeItems(index)}>
									Delete Item
								</Button>
							) : null}
						</FormGroup>
					))}
					<Button
						variant='outlined'
						onClick={() =>
							appendItems({
								id: uuidv4(),
								itemName: "",
								quantity: 0,
								price: 0,
								amount: 0,
							})
						}>
						+ Add Item
					</Button>
				</FormGroup>

				<InputLabel htmlFor='billSundrys'>Bill Sundrys</InputLabel>

				<FormGroup id='billSundrys' style={{ marginBottom: "16px" }}>
					{billSundrys.map((field, index) => (
						<FormGroup style={{ marginBottom: "24px" }} key={field.id}>
							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`billSundrys.${index}.billSundryName`}>
											Bill Sundry Name
										</InputLabel>
										<Input
											id={`billSundrys.${index}.billSundryName`}
											aria-describedby={`billSundrys.${index}.billSundryName-error`}
											{...field}
										/>
										{errors.billSundrys &&
										errors.billSundrys[index]?.billSundryName?.message ? (
											<FormHelperText
												id={`billSundrys.${index}.billSundryName-error`}>
												{errors.billSundrys[index]?.billSundryName?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`billSundrys.${index}.billSundryName`}
								control={control}
								rules={{ required: true }}
							/>

							<Controller
								render={({ field }) => (
									<FormControl style={{ marginBottom: "16px" }}>
										<InputLabel htmlFor={`billSundrys.${index}.amount`}>
											Amount
										</InputLabel>
										<Input
											id={`billSundrys.${index}.amount`}
											aria-describedby={`billSundrys.${index}.amount-error`}
											type={"number"}
											{...field}
										/>
										{errors.billSundrys &&
										errors.billSundrys[index]?.amount?.message ? (
											<FormHelperText id={`billSundrys.${index}.amount-error`}>
												{errors.billSundrys[index]?.amount?.message}
											</FormHelperText>
										) : null}
									</FormControl>
								)}
								name={`billSundrys.${index}.amount`}
								control={control}
								rules={{ required: true }}
							/>

							<Button
								variant='outlined'
								onClick={() => removeBillSundrys(index)}>
								Delete Bill Sundry
							</Button>
						</FormGroup>
					))}
					<Button
						variant='outlined'
						onClick={() =>
							appendBillSundrys({
								id: uuidv4(),
								billSundryName: "",
								amount: 0,
							})
						}>
						+ Add Bill Sundry
					</Button>
				</FormGroup>

				<Controller
					render={({ field }) => (
						<FormControl style={{ marginBottom: "16px" }}>
							<InputLabel htmlFor={"totalAmount"}>Total Amount</InputLabel>
							<Input
								id={`totalAmount`}
								aria-describedby={`totalAmount-error`}
								type={"number"}
								{...field}
							/>
							{errors.totalAmount?.message ? (
								<FormHelperText id={`totalAmount-error`}>
									{errors.totalAmount?.message}
								</FormHelperText>
							) : null}
						</FormControl>
					)}
					name={`totalAmount`}
					control={control}
					rules={{ required: true }}
				/>

				<Button variant='contained' type='button'>
					Save
				</Button>
			</FormGroup>
		</form>
	);
};

export default InvoiceForm;
