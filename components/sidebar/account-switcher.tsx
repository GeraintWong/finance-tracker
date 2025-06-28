"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Wallet2, Landmark, Trash, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CreateAccountModal } from "@/modals/create-account-modal"
import { EditAccountModal } from "@/modals/edit-account-modal"
import { DeleteAccountModal } from "@/modals/delete-account-modal"

interface AccountProps {
  id: string;
  name: string;
  type: string;
  plaidId: string | null;
}

export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const [activeAccount, setActiveAccount] = useState<AccountProps | null>(null)
  const [latestAccounts, setLatestAccounts] = useState<AccountProps[]>([])
  const [accountToDelete, setAccountToDelete] = useState<AccountProps | null>(null)
  const [accountToEdit, setAccountToEdit] = useState<AccountProps | null>(null)

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)

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

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleSelectOverview = () => {
    setActiveAccount(null)
  }

  const existingAccountNames = React.useMemo(() => {
    return latestAccounts.map(account => account.name.trim().toLowerCase());
  }, [latestAccounts]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
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
                      <div className="flex size-6 items-center justify-end cursor-pointer" onClick={(e) => { e.stopPropagation(), setIsEditAccountOpen(true), setAccountToEdit(account) }}>
                        <SquarePen className="size-3.5 shrink-0" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Edit Account</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex size-6 items-center justify-center cursor-pointer" onClick={() => { setIsDeleteAccountOpen(true); setAccountToDelete(account) }}>
                        <Trash className="size-3.5 shrink-0" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Delete Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex items-center w-full h-full hover:cursor-pointer" onClick={() => setIsCreateAccountOpen(true)}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="ps-2 text-muted-foreground font-medium">Add account</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create Account */}
        <CreateAccountModal
          isOpen={isCreateAccountOpen}
          onOpenChange={setIsCreateAccountOpen}
          onAccountCreated={fetchAccounts}
          existingAccountNames={existingAccountNames} />

        {/* Edit Account */}
        {accountToEdit && (
          <EditAccountModal
            isOpen={isEditAccountOpen}
            onOpenChange={setIsEditAccountOpen}
            onAccountEdited={fetchAccounts}
            accountToEdit={accountToEdit}
            existingAccountNames={existingAccountNames} />
        )}

        {/* Delete Account */}
        {accountToDelete ? (
          <DeleteAccountModal
            isOpen={isDeleteAccountOpen}
            onOpenChange={setIsDeleteAccountOpen}
            onAccountDeleted={fetchAccounts}
            accountToDelete={accountToDelete} />
        ) : null}
        
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
