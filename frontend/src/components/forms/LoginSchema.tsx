"use client"

import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Config from "@/types/Config";
import {useEffect, useState} from "react";
import {Turnstile} from 'next-turnstile';

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password is required" }),
    captcha: z.string().min(6, { message: "Captcha is required" }),
});

export function LoginForm() {
    const [turnstile_site_key, setTurnstileSiteKey] = useState("")
    useEffect(() => {
        fetch(Config.api_url + "/api/v1/misc/turnstile").then((res) => {
            res.json().then((resjson) => {
                setTurnstileSiteKey(resjson["site_key"])
            })
        })
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            captcha: ""
        },
    })

    const onErr = (err : unknown) => {
        console.log(err);
    }

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof loginSchema>) {
        fetch(Config.api_url + "/api/v1/auth/login", {
            method: "POST", headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            mode: "no-cors",
            body: JSON.stringify(values),
        })
    }
    return <Form {...form}>
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
                        {turnstile_site_key != "" &&
                            <Turnstile onVerify={(token) => {
                                field.onChange(token)
                            }} onError={onErr} siteKey={turnstile_site_key} />
                        }
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">Login</Button>
        </form>
    </Form>
}