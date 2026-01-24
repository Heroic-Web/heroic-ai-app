'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

/* ================= ROOT ================= */
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/* ================= TRIGGER ================= */
function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        `
        flex w-full items-center justify-between gap-2
        rounded-md border border-input
        bg-white text-foreground
        px-3 py-2 text-sm shadow-sm
        outline-none transition
        focus:ring-2 focus:ring-ring
        disabled:cursor-not-allowed disabled:opacity-50
        data-[size=default]:h-9
        data-[size=sm]:h-8
        `,
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/* ================= CONTENT ================= */
function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn(
          `
          z-50 min-w-[8rem]
          rounded-md border
          bg-white text-foreground
          shadow-lg
          opacity-100
          backdrop-blur-none
          `,
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ================= ITEM ================= */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        `
        relative flex cursor-pointer select-none items-center
        rounded-sm px-2 py-1.5 text-sm
        outline-none
        focus:bg-accent focus:text-accent-foreground
        data-[disabled]:pointer-events-none
        data-[disabled]:opacity-50
        `,
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/* ================= OTHER ================= */
function SelectLabel(props: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className="px-2 py-1.5 text-xs text-muted-foreground"
      {...props}
    />
  )
}

function SelectSeparator(
  props: React.ComponentProps<typeof SelectPrimitive.Separator>,
) {
  return (
    <SelectPrimitive.Separator
      className="my-1 h-px bg-border"
      {...props}
    />
  )
}

function SelectScrollUpButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>,
) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronUpIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton(
  props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>,
) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex items-center justify-center py-1"
      {...props}
    >
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}