import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getRecipients } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface RecipientSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RecipientSelect({ value, onChange }: RecipientSelectProps) {
  const [open, setOpen] = useState(false);
  
  // Fetch recipients
  const { data: recipients, isLoading } = useQuery({
    queryKey: ["/api/recipients"],
    queryFn: () => getRecipients(),
  });
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? recipients?.find((recipient) => recipient.email === value)?.email || value
            : "Select recipient..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search recipients..." />
          <CommandEmpty>
            {isLoading ? "Loading..." : "No recipient found."}
          </CommandEmpty>
          <CommandGroup>
            {recipients?.map((recipient) => (
              <CommandItem
                key={recipient.id}
                value={recipient.email}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === recipient.email ? "opacity-100" : "opacity-0"
                  )}
                />
                {recipient.name ? `${recipient.name} (${recipient.email})` : recipient.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
