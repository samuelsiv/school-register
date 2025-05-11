"use client"

import { z } from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Config from "@/types/config";
import {useEffect, useState} from "react";
import {Turnstile} from 'next-turnstile';

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password is required" }),
    captcha: z.string().min(6, { message: "Captcha is required" }),
});

export function LoginForm() {
    const [turnstileSiteKey, setTurnstileSiteKey] = useState("");

    useEffect(() => {
        request("POST", "/api/v1/misc/turnstile").then((json) => {
            setTurnstileSiteKey(json.siteKey)
        });
    })

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

    function onSubmit(values: z.infer<typeof loginSchema>) {

        request("POST", "/api/v1/auth/login", values).then((json) => {
            if (json.error) {
                alert(json.error);
                return;
            }
            localStorage.setItem("access_token", json.token);
            window.location.href = "/dashboard";
        }).catch((err) => {
            console.log(err);
            alert("An error occurred while logging in. Please try again.");
        }
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
                        {turnstileSiteKey != "" &&
                            <Turnstile onVerify={(token) => {
                                field.onChange(token)
                            }} onError={onErr} siteKey={turnstileSiteKey} />
                        }
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">Login</Button>
        </form>
    </Form>
}