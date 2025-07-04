"use client"

import * as React from "react"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().min(1, "Account name is needed"),
    type: z.string().min(1, "Account type is needed"),
    plaidId: z.string().optional()
})

interface createAccountModalProps {
    onAccountCreated: () => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void,
    existingAccountNames: string[]
}

export function CreateAccountModal({
    onAccountCreated,
    isOpen,
    onOpenChange,
    existingAccountNames
}: createAccountModalProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            plaidId: ""
        }
    })

    const isLoading = form.formState.isSubmitting

    useEffect(() => {
        form.clearErrors("name")
        if (existingAccountNames.includes(form.watch("name").trim().toLowerCase())) {
            form.setError("name", {
                type: "manual",
                message: "An account with this name already exists"
            })
        }
    }, [form.watch("name"), existingAccountNames, form])

    useEffect(() => {
        if (!isOpen) {
            form.reset();
            form.clearErrors();
        }
    }, [isOpen, form]);

    const handleNewAccount = async (values: z.infer<typeof formSchema>) => {

        if (existingAccountNames.includes(values.name.trim().toLowerCase())) {
            toast.error("An account with this name already exists.");
            return;
        }

        try {
            const response = await fetch('/api/accounts', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(values)
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to create account:", errorData);
                if (response.status === 409 && errorData.error) {
                    form.setError("name", {
                        type: "manual",
                        message: errorData.error,
                    });
                    toast.error(errorData.error);
                } else {
                    toast.error(errorData.error || "Error creating account");
                }
                return;
            }

            onOpenChange(false)
            toast.success("Account has been created");
            form.reset();
            onAccountCreated();
        } catch (error) {
            console.error("There was an error creating an account:", error)
            toast.error("Error creating account");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">New Account</DialogTitle>
                    <DialogDescription className="text-center">
                        Create a new account to track your transaction.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleNewAccount)}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel htmlFor="name" className="text-right">
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="e.g., Chase Bank, ASB Fund"
                                                className="col-span-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4" />
                                    </FormItem>
                                )}>
                            </FormField>
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel htmlFor="type" className="text-right">
                                            Type
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="type"
                                                placeholder="e.g., College Funds, Daily Expenses"
                                                className="col-span-3"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!form.formState.isValid || isLoading || !!form.formState.errors.name} className="bg-black hover:cursor-pointer">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}