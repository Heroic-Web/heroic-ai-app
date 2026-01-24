'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/* =========================================================
 * ROOT
 * ========================================================= */
function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/* =========================================================
 * OVERLAY — PUTIH SOLID (NO TRANSPARAN)
 * ========================================================= */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        // 🔒 PAKSA PUTIH TOTAL
        'fixed inset-0 z-40 bg-white',
        className,
      )}
      {...props}
    />
  )
}

/* =========================================================
 * CONTENT — PUTIH SOLID
 * ========================================================= */
function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // 🔒 PUTIH TOTAL
          'fixed z-50 flex flex-col bg-white text-black shadow-xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:duration-300 data-[state=closed]:duration-200',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right sm:max-w-sm',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left sm:max-w-sm',
          side === 'top' &&
            'inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          className,
        )}
        {...props}
      >
        {children}

        {/* Close button */}
        <SheetPrimitive.Close
          className="absolute right-4 top-4 rounded-md p-1 text-black opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/* =========================================================
 * STRUCTURE HELPERS
 * ========================================================= */
function SheetHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-4 bg-white', className)}
      {...props}
    />
  )
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex gap-2 p-4 bg-white', className)}
      {...props}
    />
  )
}

function SheetTitle(props: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className="text-black text-base font-semibold"
      {...props}
    />
  )
}

function SheetDescription(
  props: React.ComponentProps<typeof SheetPrimitive.Description>,
) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className="text-gray-600 text-sm"
      {...props}
    />
  )
}

/* =========================================================
 * EXPORTS
 * ========================================================= */
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}