"use client"

import * as React from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AccountProps {
    id: string;
}

interface deleteAccountModalProps {
    onAccountDeleted: () => void,
    isOpen: boolean,
    onOpenChange: (open: boolean) => void
    accountToDelete: AccountProps | null
}

export function DeleteAccountModal({
    onAccountDeleted,
    isOpen,
    onOpenChange,
    accountToDelete
}: deleteAccountModalProps) {

    const handleDeleteAccount = async () => {
        if (!accountToDelete) {
            toast.error("No account selected for deleting.");
            return;
        }
        try {
            const response = await fetch(`/api/accounts/${accountToDelete.id}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                console.error("Failed to delete account:" + await response.json())
                toast.error("Error deleting account");
                return
            }
            onOpenChange(false)
            toast.success("Account has been deleted");
            onAccountDeleted()
        } catch (error) {
            console.error("There was an error deleting an account:" + error)
            toast.error("Error deleting account");
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the account
                        and remove all related data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="hover:cursor-pointer" onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}