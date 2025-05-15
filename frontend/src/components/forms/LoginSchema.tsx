"use client"

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Turnstile } from 'next-turnstile';
import { fetcher, request } from "@/lib/request";
import useSWR, { preload } from "swr";

export const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(6, { message: "Password is required" }),
	captcha: z.string().min(6, { message: "Captcha is required" }),
});

export function LoginForm() {
	const [turnstileSiteKey, setTurnstileSiteKey] = useState("");

	useEffect(() => {
		request("GET", "/api/v1/misc/config").then((json) => {
			setTurnstileSiteKey(json.turnstile.siteKey);
		});
	}, [])

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			captcha: ""
		},
	})

	function onSubmit(values: z.infer<typeof loginSchema>) {
		request("POST", "/api/v1/auth/login", values).then((data) => {
			if (!data.success) {
				const errorMessage = Array.isArray(data.error?.issues)
					? data.error.issues.map((issue: any) => issue.message).join(", ")
					: data.error?.message || "Login failed. Please check your credentials.";

				form.setError("root", { message: errorMessage });
				return;
			}

			document.cookie = "auth_token=" + data.token + "; Max-Age=3600"
			preload("/api/v1/user/info", fetcher)
				.then(() => window.location.href = "/home/dashboard")
				.catch(() => window.location.href = "/home/dashboard");
		}).catch((err) => {
			console.log(err);
			alert("An error occurred while logging in. Please try again.");
		});
	}

	return <Form {...form}>
		{form.formState.errors.root && (
			<div className="bg-red-500 text-white p-4 rounded-md">
				<p>{form.formState.errors.root.message}</p>
			</div>
		)}

		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
			<FormField
				control={form.control}
				name="email"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input type="email" placeholder="email@school.edu.it" {...field} />
						</FormControl>
						<FormDescription>
							This is your school email address.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl>
							<Input type="password" placeholder="Insert your password" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="captcha"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Captcha</FormLabel>
						{turnstileSiteKey != "" &&
							<Turnstile onVerify={(token) => {
								field.onChange(token)
							}} onError={(e) => console.log(e)} siteKey={turnstileSiteKey} />
						}
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button type="submit">Login</Button>
		</form>
	</Form>
}