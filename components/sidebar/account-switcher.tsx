"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Wallet2, Landmark, Trash, SquarePen } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { useEffect, useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface AccountProps {
  id: string;
  name: string;
  type: string;
  plaidId: string | null;
}

const formSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  plaidId: z.string().optional(),
})

export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const [activeAccount, setActiveAccount] = useState<AccountProps | null>(null)
  const [latestAccounts, setLatestAccounts] = useState<AccountProps[]>([])
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  const [accountToEdit, setAccountToEdit] = useState<AccountProps | null>(null)
  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Form for NEW account
  const newAccountForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      plaidId: "",
    }
  })

  //Form for EDITING account
  const editAccountForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const isLoading = newAccountForm.formState.isLoading

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`/api/accounts`)
      if (!response.ok) {
        console.error("Failed to fetch accounts")
      }
      const latestAccounts = await response.json()
      setLatestAccounts(latestAccounts.accounts)
    } catch (error) {

    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        console.error("Failed to create account:" + await response.json())
      }

      setOpen(false);
      toast.success("Account has been created");
      newAccountForm.reset()
      await fetchAccounts()
    } catch (error) {
      console.error("There was an error creating an account:" + error)
      toast.error("Error creating account");
    }
  }

  const handleEditAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "PATCH",

      })
    } catch (error) {

    }
  }

  useEffect(() => {
    if(accountToEdit && isEditOpen) {
      editAccountForm.reset({
        name: accountToEdit.name,
        type: accountToEdit.type
      })
    }
  }, [accountToEdit, isEditOpen, editAccountForm])

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        console.error("Failed to delete account:")
        try {
          const errorData = await response.json();
          console.error("Backend error details:", errorData);
          toast.error(errorData.error || `Failed to delete account (Status: ${response.status})`);
        } catch (e) {
          const errorText = await response.text();
          console.error("Backend error response (non-JSON):", errorText);
          toast.error(`Failed to delete account (Status: ${response.status})`);
        }
        return
      }

      toast.success("Account has been deleted");
      await fetchAccounts()
      setActiveAccount(null)
    } catch (error) {
      console.error("There was an error deleting the account:" + error)
      toast.error("Error deleting account");
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleSelectOverview = () => {
    setActiveAccount(null)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeAccount === null ? (
                    <Landmark className="size-4" />
                  ) : (
                    <Wallet2 className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeAccount?.name || "Overview"}</span>
                  <span className="truncate text-xs">{activeAccount?.type}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuItem
                onClick={handleSelectOverview}
                className={`gap-2 p-2 ${activeAccount === null ? 'bg-accent text-accent-foreground' : ''}`}
              >
                Overview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Accounts
              </DropdownMenuLabel>
              {latestAccounts.map((account) => (
                <DropdownMenuItem
                  key={account.name}
                  onClick={() => setActiveAccount(account)}
                  className={`gap-2 p-2 ${activeAccount?.name === account.name ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <span onClick={() => setActiveAccount(account)} className="flex-grow">
                    {account.name}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex size-6 items-center justify-end cursor-pointer" onClick={() => { setIsEditOpen(true); setAccountToEdit(account) }}>
                          <SquarePen className="size-3.5 shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Edit Account</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex size-6 items-center justify-center cursor-pointer" onClick={() => { setIsDeleteOpen(true); setAccountToDelete(account.id) }}>
                          <Trash className="size-3.5 shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Delete Account</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <DialogTrigger className="flex items-center w-full h-full">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="ps-2 text-muted-foreground font-medium">Add account</div>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">New Account</DialogTitle>
              <DialogDescription className="text-center">
                Create a new account to track your transaction.
              </DialogDescription>
            </DialogHeader>
            <Form {...newAccountForm}>
              <form onSubmit={newAccountForm.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Chase Bank, ASB Fund"
                      {...newAccountForm.register('name')}
                      className="col-span-3"
                    />
                    {newAccountForm.formState.errors.name && (
                      <p className="text-sm col-span-4 text-red-500">Account name is needed</p>
                    )}
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="type"
                      placeholder="e.g., College Funds, Daily Expenses"
                      {...newAccountForm.register('type')}
                      className="col-span-3"
                    />
                    {newAccountForm.formState.errors.type && (
                      <p className="text-sm col-span-4 text-red-500">Account type is needed</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!newAccountForm.formState.isValid || isLoading} className="bg-black hover:cursor-pointer">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* For Editing */}
      
        {accountToEdit ? (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Edit Account</DialogTitle>
              <DialogDescription className="text-center">
                Edit your account.
              </DialogDescription>
            </DialogHeader>
            <Form {...editAccountForm}>
              <form onSubmit={editAccountForm.handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      {...editAccountForm.register('name')}
                      className="col-span-3"
                    />
                    {editAccountForm.formState.errors.name && (
                      <p className="text-sm col-span-4 text-red-500">Account name is needed</p>
                    )}
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="type"
                      {...editAccountForm.register('type')}
                      className="col-span-3"
                    />
                    {editAccountForm.formState.errors.type && (
                      <p className="text-sm col-span-4 text-red-500">Account type is needed</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!editAccountForm.formState.isValid || isLoading} className="bg-black hover:cursor-pointer">
                    {isLoading ? 'Saving Account...' : 'Save'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        ): null}

        {accountToDelete ? (
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the account
                  and remove all related data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAccountToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteAccount(accountToDelete)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
