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

interface AccountProps {
    id: string;
    name: string;
    type: string;
    plaidId: string | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Account name is needed"),
    type: z.string().min(1, "Account type is needed"),
    plaidId: z.string().optional()
})

interface editAccountModalProps {
    onAccountEdited: () => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
    accountToEdit: AccountProps | null,
    existingAccountNames: string[]
}

export function EditAccountModal({
    onAccountEdited,
    isOpen,
    onOpenChange,
    accountToEdit,
    existingAccountNames
}: editAccountModalProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const isLoading = form.formState.isSubmitting


    useEffect(() => {
        if (accountToEdit && isOpen) {
            form.reset({
                name: accountToEdit.name,
                type: accountToEdit.type,
                plaidId: accountToEdit.plaidId || "",
            })
        }
        if (!isOpen) {
            form.reset();
            form.clearErrors();
        }
    }, [accountToEdit, isOpen, form])

    useEffect(() => {
        if (accountToEdit && isOpen) {
            const currentName = form.watch("name").trim().toLowerCase();
            const originalName = accountToEdit.name.trim().toLowerCase();

            const otherExistingNames = existingAccountNames.filter(
                (name) => name !== originalName
            );

            if (otherExistingNames.includes(currentName)) {
                form.setError("name", {
                    type: "manual",
                    message: "Another account with this name already exists.",
                });
            } else {
                form.clearErrors("name");
            }
        }
    }, [form.watch("name"), existingAccountNames, accountToEdit, isOpen, form]);

    useEffect(() => {
        if (accountToEdit && isOpen) {
            form.reset({
                name: accountToEdit.name,
                type: accountToEdit.type
            })
        }
    }, [accountToEdit, isOpen, form])

    const handleEditAccount = async (values: z.infer<typeof formSchema>) => {
        if (!accountToEdit) {
            toast.error("No account selected for editing.");
            return;
        }
        try {
            const response = await fetch(`/api/accounts/${accountToEdit.id}`, {
                method: "PATCH",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(values)
            })

            if (!response.ok) {
                console.error("Failed to update account:" + await response.json())
                toast.error("Error updating account");
                return
            }
            onOpenChange(false)
            toast.success("Account has been updated");
            onAccountEdited()
        } catch (error) {
            console.error("There was an error updating an account:" + error)
            toast.error("Error updating account");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Edit Account</DialogTitle>
                    <DialogDescription className="text-center">
                        Edit your account.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEditAccount)}>
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
                                                className="col-span-3"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4" />
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!form.formState.isValid || isLoading || !!form.formState.errors.name} className="bg-black hover:cursor-pointer">
                                {isLoading ? 'Saving Account...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}